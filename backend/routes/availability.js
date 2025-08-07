import express from 'express';
import DoctorAvailability from '../models/DoctorAvailability.js';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/availability/doctor/:doctorId
 * @desc    Get doctor's availability for a date range
 * @access  Private
 */
router.get('/doctor/:doctorId', authenticate, async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { startDate, endDate, date } = req.query;

    // Validate doctor exists
    const doctor = await User.findOne({ _id: doctorId, role: 'doctor', isActive: true });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    if (date) {
      // Get availability for specific date
      const targetDate = new Date(date);
      const availability = await DoctorAvailability.getAvailabilityForDate(doctorId, targetDate);
      
      if (!availability) {
        return res.json({
          success: true,
          date,
          isAvailable: false,
          slots: []
        });
      }

      // Get existing appointments for the date to mark slots as booked
      const existingAppointments = await Appointment.find({
        doctor: doctorId,
        appointmentDate: {
          $gte: new Date(targetDate.setHours(0, 0, 0, 0)),
          $lt: new Date(targetDate.setHours(23, 59, 59, 999))
        },
        status: { $in: ['pending', 'confirmed'] }
      });

      // Mark booked slots
      const slots = availability.slots.map(slot => ({
        ...slot,
        isBooked: existingAppointments.some(apt => apt.appointmentTime === slot.startTime)
      }));

      return res.json({
        success: true,
        date,
        isAvailable: availability.isAvailable,
        slots,
        reason: availability.reason
      });
    }

    // Get availability for date range
    const start = new Date(startDate);
    const end = new Date(endDate);
    const availabilityData = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayAvailability = await DoctorAvailability.getAvailabilityForDate(doctorId, new Date(d));
      
      if (dayAvailability) {
        const existingAppointments = await Appointment.find({
          doctor: doctorId,
          appointmentDate: {
            $gte: new Date(d.setHours(0, 0, 0, 0)),
            $lt: new Date(d.setHours(23, 59, 59, 999))
          },
          status: { $in: ['pending', 'confirmed'] }
        });

        const slots = dayAvailability.slots.map(slot => ({
          ...slot,
          isBooked: existingAppointments.some(apt => apt.appointmentTime === slot.startTime)
        }));

        availabilityData.push({
          date: d.toISOString().split('T')[0],
          isAvailable: dayAvailability.isAvailable,
          slots,
          reason: dayAvailability.reason
        });
      } else {
        availabilityData.push({
          date: d.toISOString().split('T')[0],
          isAvailable: false,
          slots: []
        });
      }
    }

    res.json({
      success: true,
      availability: availabilityData
    });
  } catch (error) {
    console.error('Error fetching doctor availability:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching availability'
    });
  }
});

/**
 * @route   GET /api/availability/my-schedule
 * @desc    Get current doctor's availability setup
 * @access  Private (Doctor)
 */
router.get('/my-schedule', authenticate, authorize('doctor'), async (req, res) => {
  try {
    const availability = await DoctorAvailability.findOne({
      doctor: req.user._id,
      isActive: true
    });

    if (!availability) {
      // Create default availability if none exists
      const defaultAvailability = new DoctorAvailability({
        doctor: req.user._id,
        weeklySchedule: {
          monday: { isAvailable: false, slots: [] },
          tuesday: { isAvailable: false, slots: [] },
          wednesday: { isAvailable: false, slots: [] },
          thursday: { isAvailable: false, slots: [] },
          friday: { isAvailable: false, slots: [] },
          saturday: { isAvailable: false, slots: [] },
          sunday: { isAvailable: false, slots: [] }
        }
      });

      await defaultAvailability.save();
      return res.json({
        success: true,
        availability: defaultAvailability
      });
    }

    res.json({
      success: true,
      availability
    });
  } catch (error) {
    console.error('Error fetching doctor schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching schedule'
    });
  }
});

/**
 * @route   PUT /api/availability/my-schedule
 * @desc    Update doctor's weekly schedule
 * @access  Private (Doctor)
 */
router.put('/my-schedule', authenticate, authorize('doctor'), async (req, res) => {
  try {
    const {
      weeklySchedule,
      defaultSlotDuration,
      bufferTime,
      maxAdvanceBooking,
      isAcceptingNewPatients,
      timezone
    } = req.body;

    let availability = await DoctorAvailability.findOne({
      doctor: req.user._id,
      isActive: true
    });

    if (!availability) {
      availability = new DoctorAvailability({
        doctor: req.user._id
      });
    }

    // Update fields
    if (weeklySchedule) availability.weeklySchedule = weeklySchedule;
    if (defaultSlotDuration !== undefined) availability.defaultSlotDuration = defaultSlotDuration;
    if (bufferTime !== undefined) availability.bufferTime = bufferTime;
    if (maxAdvanceBooking !== undefined) availability.maxAdvanceBooking = maxAdvanceBooking;
    if (isAcceptingNewPatients !== undefined) availability.isAcceptingNewPatients = isAcceptingNewPatients;
    if (timezone) availability.timezone = timezone;

    await availability.save();

    res.json({
      success: true,
      message: 'Schedule updated successfully',
      availability
    });
  } catch (error) {
    console.error('Error updating doctor schedule:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating schedule'
    });
  }
});

/**
 * @route   POST /api/availability/block-date
 * @desc    Block a specific date
 * @access  Private (Doctor)
 */
router.post('/block-date', authenticate, authorize('doctor'), async (req, res) => {
  try {
    const { date, reason, isRecurring, recurringType } = req.body;

    if (!date || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Date and reason are required'
      });
    }

    let availability = await DoctorAvailability.findOne({
      doctor: req.user._id,
      isActive: true
    });

    if (!availability) {
      availability = new DoctorAvailability({
        doctor: req.user._id
      });
    }

    // Check if date is already blocked
    const existingBlock = availability.blockedDates.find(block => {
      const blockDate = new Date(block.date);
      const targetDate = new Date(date);
      return blockDate.toDateString() === targetDate.toDateString();
    });

    if (existingBlock) {
      return res.status(400).json({
        success: false,
        message: 'Date is already blocked'
      });
    }

    availability.blockedDates.push({
      date: new Date(date),
      reason,
      isRecurring: isRecurring || false,
      recurringType
    });

    await availability.save();

    res.json({
      success: true,
      message: 'Date blocked successfully',
      availability
    });
  } catch (error) {
    console.error('Error blocking date:', error);
    res.status(500).json({
      success: false,
      message: 'Error blocking date'
    });
  }
});

/**
 * @route   DELETE /api/availability/unblock-date
 * @desc    Unblock a specific date
 * @access  Private (Doctor)
 */
router.delete('/unblock-date', authenticate, authorize('doctor'), async (req, res) => {
  try {
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required'
      });
    }

    const availability = await DoctorAvailability.findOne({
      doctor: req.user._id,
      isActive: true
    });

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: 'No availability schedule found'
      });
    }

    // Remove the blocked date
    availability.blockedDates = availability.blockedDates.filter(block => {
      const blockDate = new Date(block.date);
      const targetDate = new Date(date);
      return blockDate.toDateString() !== targetDate.toDateString();
    });

    await availability.save();

    res.json({
      success: true,
      message: 'Date unblocked successfully',
      availability
    });
  } catch (error) {
    console.error('Error unblocking date:', error);
    res.status(500).json({
      success: false,
      message: 'Error unblocking date'
    });
  }
});

/**
 * @route   POST /api/availability/generate-slots
 * @desc    Generate time slots for a day
 * @access  Private (Doctor)
 */
router.post('/generate-slots', authenticate, authorize('doctor'), async (req, res) => {
  try {
    const { startTime, endTime, duration, buffer } = req.body;

    if (!startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Start time and end time are required'
      });
    }

    const availability = await DoctorAvailability.findOne({
      doctor: req.user._id,
      isActive: true
    });

    if (!availability) {
      return res.status(404).json({
        success: false,
        message: 'No availability schedule found'
      });
    }

    const slots = availability.generateTimeSlots(
      startTime,
      endTime,
      duration || availability.defaultSlotDuration,
      buffer || availability.bufferTime
    );

    res.json({
      success: true,
      slots
    });
  } catch (error) {
    console.error('Error generating slots:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating time slots'
    });
  }
});

export default router; 