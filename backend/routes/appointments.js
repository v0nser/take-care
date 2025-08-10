import express from 'express';
import Appointment from '../models/Appointment.js';
import User from '../models/User.js';
import DoctorAvailability from '../models/DoctorAvailability.js';
import ActivityLog from '../models/ActivityLog.js';
import { authenticate, authorize, logActivity } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/appointments
 * @desc    Book a new appointment
 * @access  Private (Patient)
 */
router.post('/', authenticate, authorize('patient'), logActivity('appointment_book', 'appointment'), async (req, res) => {
  try {
    const {
      doctorId,
      appointmentDate,
      appointmentTime,
      reason,
      symptoms,
      type = 'consultation',
      consultationType = 'in-person'
    } = req.body;

    // Validate required fields
    if (!doctorId || !appointmentDate || !appointmentTime || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Doctor, date, time, and reason are required'
      });
    }

    // Check if doctor exists and is active
    const doctor = await User.findOne({
      _id: doctorId,
      role: 'doctor',
      isActive: true
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found or not available'
      });
    }

    // Validate appointment date (not in past)
    const appointmentDateObj = new Date(appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (appointmentDateObj < today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book appointments for past dates'
      });
    }

    // Check doctor availability for the requested date and time
    const availability = await DoctorAvailability.getAvailabilityForDate(doctorId, appointmentDateObj);
    
    if (!availability || !availability.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Doctor is not available on the selected date'
      });
    }

    // Check if the requested time slot is available
    const requestedSlot = availability.slots.find(slot => slot.startTime === appointmentTime);
    
    if (!requestedSlot) {
      return res.status(400).json({
        success: false,
        message: 'Requested time slot is not available'
      });
    }

    // Check for conflicting appointments
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      appointmentDate: appointmentDateObj,
      appointmentTime,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    // Create new appointment
    const appointment = new Appointment({
      patient: req.user._id,
      doctor: doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      reason,
      symptoms: symptoms || [],
      type,
      consultationType,
      consultationFee: doctor.consultationFee || 500
    });

    await appointment.save();
    await appointment.populate(['patient', 'doctor']);

    // Emit real-time notification to doctor
    req.io.to(`doctor_${doctorId}`).emit('new_appointment', {
      appointment,
      message: `New appointment request from ${req.user.fullName}`
    });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error booking appointment'
    });
  }
});

/**
 * @route   GET /api/appointments
 * @desc    Get user's appointments
 * @access  Private
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, page = 1, limit = 10, upcoming = false } = req.query;
    
    let query = {};
    
    // Filter by user role
    if (req.user.role === 'patient') {
      query.patient = req.user._id;
    } else if (req.user.role === 'doctor') {
      query.doctor = req.user._id;
    }

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Filter upcoming appointments
    if (upcoming === 'true') {
      const now = new Date();
      query.appointmentDate = { $gte: now };
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'firstName lastName profileImage phone email')
      .populate('doctor', 'firstName lastName specialization profileImage consultationFee')
      .sort({ appointmentDate: -1, appointmentTime: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments(query);

    res.json({
      success: true,
      appointments,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments'
    });
  }
});

/**
 * @route   GET /api/appointments/:id
 * @desc    Get specific appointment details
 * @access  Private
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'firstName lastName profileImage phone email bloodGroup')
      .populate('doctor', 'firstName lastName specialization profileImage qualifications consultationFee');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if user has access to this appointment
    const hasAccess = 
      req.user.role === 'admin' ||
      appointment.patient._id.toString() === req.user._id.toString() ||
      appointment.doctor._id.toString() === req.user._id.toString();

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      appointment
    });
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointment details'
    });
  }
});

/**
 * @route   PUT /api/appointments/:id/status
 * @desc    Update appointment status
 * @access  Private (Doctor/Admin)
 */
router.put('/:id/status', authenticate, authorize('doctor', 'admin'), logActivity('appointment_update', 'appointment'), async (req, res) => {
  try {
    const { status, notes, cancellationReason } = req.body;
    
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'firstName lastName')
      .populate('doctor', 'firstName lastName');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if doctor is updating their own appointment or admin
    if (req.user.role === 'doctor' && appointment.doctor._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update appointment status
    appointment.status = status;
    if (notes) appointment.notes.doctor = notes;
    if (cancellationReason) {
      appointment.cancellationReason = cancellationReason;
      appointment.cancelledBy = req.user._id;
    }

    await appointment.save();

    // Emit real-time notification to patient
    req.io.to(`user_${appointment.patient._id}`).emit('appointment_update', {
      appointment,
      message: `Your appointment has been ${status}`
    });

    res.json({
      success: true,
      message: 'Appointment status updated successfully',
      appointment
    });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating appointment status'
    });
  }
});

/**
 * @route   PUT /api/appointments/:id/complete
 * @desc    Complete appointment with diagnosis and prescription
 * @access  Private (Doctor)
 */
router.put('/:id/complete', authenticate, authorize('doctor'), logActivity('appointment_complete', 'appointment'), async (req, res) => {
  try {
    const { diagnosis, prescription, notes } = req.body;
    
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if doctor owns this appointment
    if (appointment.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update appointment with completion details
    appointment.status = 'completed';
    appointment.diagnosis = diagnosis;
    appointment.prescription = prescription || [];
    appointment.notes.doctor = notes;

    await appointment.save();
    await appointment.populate(['patient', 'doctor']);

    // Emit real-time notification to patient
    req.io.to(`user_${appointment.patient._id}`).emit('appointment_completed', {
      appointment,
      message: 'Your appointment has been completed'
    });

    res.json({
      success: true,
      message: 'Appointment completed successfully',
      appointment
    });
  } catch (error) {
    console.error('Error completing appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error completing appointment'
    });
  }
});

/**
 * @route   DELETE /api/appointments/:id
 * @desc    Cancel appointment
 * @access  Private (Patient/Doctor/Admin)
 */
router.delete('/:id', authenticate, logActivity('appointment_cancel', 'appointment'), async (req, res) => {
  try {
    const { reason } = req.body;
    
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'firstName lastName')
      .populate('doctor', 'firstName lastName');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check access permissions
    const hasAccess = 
      req.user.role === 'admin' ||
      appointment.patient._id.toString() === req.user._id.toString() ||
      appointment.doctor._id.toString() === req.user._id.toString();

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update appointment status to cancelled
    appointment.status = 'cancelled';
    appointment.cancellationReason = reason || 'No reason provided';
    appointment.cancelledBy = req.user._id;

    await appointment.save();

    // Notify the other party
    const notifyUserId = appointment.patient._id.toString() === req.user._id.toString() 
      ? appointment.doctor._id 
      : appointment.patient._id;

    req.io.to(`user_${notifyUserId}`).emit('appointment_cancelled', {
      appointment,
      message: 'An appointment has been cancelled'
    });

    res.json({
      success: true,
      message: 'Appointment cancelled successfully',
      appointment
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling appointment'
    });
  }
});

/**
 * @route   GET /api/appointments/stats
 * @desc    Get appointment statistics
 * @access  Private (Doctor/Admin)
 */
router.get('/stats/overview', authenticate, authorize('doctor', 'admin'), async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'doctor') {
      query.doctor = req.user._id;
    }

    const totalAppointments = await Appointment.countDocuments(query);
    const pendingAppointments = await Appointment.countDocuments({ ...query, status: 'pending' });
    const confirmedAppointments = await Appointment.countDocuments({ ...query, status: 'confirmed' });
    const completedAppointments = await Appointment.countDocuments({ ...query, status: 'completed' });
    const cancelledAppointments = await Appointment.countDocuments({ ...query, status: 'cancelled' });

    // Today's appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todaysAppointments = await Appointment.countDocuments({
      ...query,
      appointmentDate: { $gte: today, $lt: tomorrow },
      status: { $in: ['pending', 'confirmed'] }
    });

    res.json({
      success: true,
      stats: {
        totalAppointments,
        pendingAppointments,
        confirmedAppointments,
        completedAppointments,
        cancelledAppointments,
        todaysAppointments
      }
    });
  } catch (error) {
    console.error('Error fetching appointment stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointment statistics'
    });
  }
});

export default router;
