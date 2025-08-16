import express from 'express';
import DiagnosticBooking from '../models/DiagnosticBooking.js';
import DiagnosticService from '../models/DiagnosticService.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Create new diagnostic booking
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      serviceId,
      selectedPackage,
      additionalTests,
      schedule,
      patient
    } = req.body;

    // Validate service exists
    const service = await DiagnosticService.findById(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Diagnostic service not found'
      });
    }

    // Calculate pricing
    let packagePrice = 0;
    let additionalTestsPrice = 0;
    let totalAmount = 0;
    let discountAmount = 0;

    if (selectedPackage) {
      packagePrice = selectedPackage.price;
      totalAmount += packagePrice;
    }

    if (additionalTests && additionalTests.length > 0) {
      additionalTestsPrice = additionalTests.reduce((sum, test) => {
        return sum + (test.price * test.quantity);
      }, 0);
      totalAmount += additionalTestsPrice;
    }

    // Calculate discount if any
    if (selectedPackage && selectedPackage.discount) {
      const discountPercent = parseInt(selectedPackage.discount.replace('% off', ''));
      discountAmount = (packagePrice * discountPercent) / 100;
    }

    const finalAmount = totalAmount - discountAmount;

    // Create booking
    const booking = new DiagnosticBooking({
      patient: {
        userId: req.user.id,
        ...patient
      },
      service: {
        serviceId: service._id,
        serviceName: service.name,
        category: service.category
      },
      selectedPackage,
      additionalTests,
      schedule,
      pricing: {
        packagePrice,
        additionalTestsPrice,
        totalAmount,
        discountAmount,
        finalAmount
      }
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Diagnostic booking created successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error creating diagnostic booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create diagnostic booking',
      error: error.message
    });
  }
});

// Get user's diagnostic bookings
router.get('/my-bookings', authenticate, async (req, res) => {
  try {
    const { status, limit = 10, page = 1 } = req.query;
    
    let query = { 'patient.userId': req.user.id, isActive: true };
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const bookings = await DiagnosticBooking.find(query)
      .populate('service.serviceId', 'name category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await DiagnosticBooking.countDocuments(query);
    
    res.json({
      success: true,
      data: bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalBookings: total,
        hasNextPage: skip + bookings.length < total,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching user diagnostic bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch diagnostic bookings',
      error: error.message
    });
  }
});

// Get diagnostic booking by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const booking = await DiagnosticBooking.findById(req.params.id)
      .populate('service.serviceId', 'name category description')
      .populate('collection.phlebotomistId', 'firstName lastName');
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Diagnostic booking not found'
      });
    }
    
    // Check if user owns this booking or is admin
    if (booking.patient.userId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error fetching diagnostic booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch diagnostic booking',
      error: error.message
    });
  }
});

// Update diagnostic booking status (admin/phlebotomist only)
router.patch('/:id/status', authenticate, authorize('admin', 'phlebotomist'), async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const updateData = { status, updatedAt: new Date() };
    
    if (notes) {
      updateData.notes = notes;
    }
    
    // Add collection details if status is sample-collected
    if (status === 'sample-collected') {
      updateData.collection = {
        phlebotomistId: req.user.id,
        phlebotomistName: `${req.user.firstName} ${req.user.lastName}`,
        collectedAt: new Date()
      };
    }
    
    const booking = await DiagnosticBooking.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Diagnostic booking not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Diagnostic booking status updated successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error updating diagnostic booking status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update diagnostic booking status',
      error: error.message
    });
  }
});

// Update diagnostic booking (user can update patient details and schedule)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { patient, schedule } = req.body;
    
    const booking = await DiagnosticBooking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Diagnostic booking not found'
      });
    }
    
    // Check if user owns this booking
    if (booking.patient.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Only allow updates if booking is still pending
    if (booking.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update booking after confirmation'
      });
    }
    
    const updateData = { updatedAt: new Date() };
    
    if (patient) {
      updateData.patient = { ...booking.patient.toObject(), ...patient };
    }
    
    if (schedule) {
      updateData.schedule = { ...booking.schedule.toObject(), ...schedule };
    }
    
    const updatedBooking = await DiagnosticBooking.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Diagnostic booking updated successfully',
      data: updatedBooking
    });
  } catch (error) {
    console.error('Error updating diagnostic booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update diagnostic booking',
      error: error.message
    });
  }
});

// Cancel diagnostic booking
router.patch('/:id/cancel', authenticate, async (req, res) => {
  try {
    const { reason } = req.body;
    
    const booking = await DiagnosticBooking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Diagnostic booking not found'
      });
    }
    
    // Check if user owns this booking
    if (booking.patient.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    // Only allow cancellation if booking is pending or confirmed
    if (!['pending', 'confirmed'].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel booking at this stage'
      });
    }
    
    booking.status = 'cancelled';
    if (reason) {
      booking.notes = reason;
    }
    booking.updatedAt = new Date();
    
    await booking.save();
    
    res.json({
      success: true,
      message: 'Diagnostic booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    console.error('Error cancelling diagnostic booking:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel diagnostic booking',
      error: error.message
    });
  }
});

// Admin: Get all diagnostic bookings
router.get('/admin/all', authenticate, authorize('admin'), async (req, res) => {
  try {
    
    const { status, date, limit = 20, page = 1 } = req.query;
    
    let query = { isActive: true };
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query['schedule.collectionDate'] = { $gte: startDate, $lt: endDate };
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const bookings = await DiagnosticBooking.find(query)
      .populate('patient.userId', 'firstName lastName email')
      .populate('service.serviceId', 'name category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await DiagnosticBooking.countDocuments(query);
    
    res.json({
      success: true,
      data: bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalBookings: total,
        hasNextPage: skip + bookings.length < total,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error fetching all diagnostic bookings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch diagnostic bookings',
      error: error.message
    });
  }
});

export default router; 