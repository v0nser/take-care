import express from 'express';
import { authenticate as auth } from '../middleware/auth.js';
import DiagnosticTest from '../models/DiagnosticTest.js';
import DiagnosticPackage from '../models/DiagnosticPackage.js';
import DiagnosticBooking from '../models/DiagnosticBooking.js';
import User from '../models/User.js';

const router = express.Router();

// ==================== DIAGNOSTIC TESTS ====================

// Get all diagnostic tests
router.get('/tests', async (req, res) => {
  try {
    const { category, sampleType, search, popular } = req.query;
    let query = { isActive: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (sampleType && sampleType !== 'all') {
      query.sampleType = sampleType;
    }

    if (popular === 'true') {
      query.popular = true;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const tests = await DiagnosticTest.find(query).sort({ name: 1 });
    res.json(tests);
  } catch (error) {
    console.error('Error fetching diagnostic tests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get popular tests
router.get('/tests/popular', async (req, res) => {
  try {
    const tests = await DiagnosticTest.find({ popular: true, isActive: true }).limit(10);
    res.json(tests);
  } catch (error) {
    console.error('Error fetching popular tests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get test by ID
router.get('/tests/:id', async (req, res) => {
  try {
    const test = await DiagnosticTest.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.json(test);
  } catch (error) {
    console.error('Error fetching test:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== DIAGNOSTIC PACKAGES ====================

// Get all diagnostic packages
router.get('/packages', async (req, res) => {
  try {
    const { category, search, popular } = req.query;
    let query = { isActive: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (popular === 'true') {
      query.popular = true;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const diagnosticPackages = await DiagnosticPackage.find(query)
      .populate('tests', 'name price description')
      .sort({ name: 1 });
    
    res.json(diagnosticPackages);
  } catch (error) {
    console.error('Error fetching diagnostic packages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get popular packages
router.get('/packages/popular', async (req, res) => {
  try {
    const popularPackages = await DiagnosticPackage.find({ popular: true, isActive: true })
      .populate('tests', 'name price')
      .limit(10);
    res.json(popularPackages);
  } catch (error) {
    console.error('Error fetching popular packages:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get package by ID
router.get('/packages/:id', async (req, res) => {
  try {
    const diagnosticPackage = await DiagnosticPackage.findById(req.params.id)
      .populate('tests', 'name price description preparation reportTime');
    
    if (!diagnosticPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.json(diagnosticPackage);
  } catch (error) {
    console.error('Error fetching package:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== DIAGNOSTIC BOOKINGS ====================

// Create new diagnostic booking
router.post('/bookings', auth, async (req, res) => {
  try {
    const {
      tests,
      packages,
      collectionType,
      scheduledDate,
      scheduledTime,
      patientDetails,
      totalAmount,
      paymentMethod
    } = req.body;

    // Validate required fields - either tests or packages should be present
    if ((!tests || tests.length === 0) && (!packages || packages.length === 0)) {
      return res.status(400).json({ message: 'At least one test or package is required' });
    }

    if (!scheduledDate || !scheduledTime || !patientDetails) {
      return res.status(400).json({ message: 'Missing required booking information' });
    }

    // Generate unique booking ID
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    const generatedBookingId = `DIAG${timestamp}${random}`;

    // Create booking
    const diagnosticBooking = new DiagnosticBooking({
      bookingId: generatedBookingId,
      patient: req.user.id,
      tests: tests ? tests.map(test => ({
        test: test.testId,
        price: test.price
      })) : [],
      packages: packages ? packages.map(pkg => ({
        package: pkg.packageId,
        price: pkg.price
      })) : [],
      collectionType,
      scheduledDate: new Date(scheduledDate),
      scheduledTime,
      patientDetails,
      totalAmount,
      paymentMethod
    });

    // Check fasting requirements (only if tests are present)
    let fastingTests = [];
    if (tests && tests.length > 0) {
      const testIds = tests.map(t => t.testId);
      fastingTests = await DiagnosticTest.find({
        _id: { $in: testIds },
        fasting: true
      });
    }

    if (fastingTests.length > 0) {
      const currentHour = new Date().getHours();
      if (currentHour >= 12) {
        diagnosticBooking.fastingWarning = {
          warning: true,
          message: `Warning: ${fastingTests.map(t => t.name).join(', ')} require fasting. Consider booking for morning slots.`,
          tests: fastingTests.map(t => t.name)
        };
      }
    }

    await diagnosticBooking.save();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: {
        _id: diagnosticBooking._id,
        bookingId: diagnosticBooking.bookingId,
        totalAmount: diagnosticBooking.totalAmount,
        status: diagnosticBooking.status
      }
    });
  } catch (error) {
    console.error('Error creating diagnostic booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's diagnostic bookings
router.get('/bookings', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    let query = { patient: req.user.id };

    if (status && status !== 'all') {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const userBookings = await DiagnosticBooking.find(query)
      .populate('tests.test', 'name price')
      .populate('packages.package', 'name price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await DiagnosticBooking.countDocuments(query);
    
    res.json({
      success: true,
      data: userBookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalBookings: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// Alias for my-bookings (used by dashboard)
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    let query = { patient: req.user.id };

    if (status && status !== 'all') {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const userBookings = await DiagnosticBooking.find(query)
      .populate('tests.test', 'name price')
      .populate('packages.package', 'name price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await DiagnosticBooking.countDocuments(query);
    
    res.json({
      success: true,
      data: userBookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalBookings: total,
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error' 
    });
  }
});

// Get specific booking by ID
router.get('/bookings/:id', auth, async (req, res) => {
  try {
    const diagnosticBooking = await DiagnosticBooking.findById(req.params.id)
      .populate('tests.test', 'name price description preparation')
      .populate('packages.package', 'name price description');

    if (!diagnosticBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking
    if (diagnosticBooking.patient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(diagnosticBooking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking status (for lab staff)
router.patch('/bookings/:id/status', auth, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const diagnosticBooking = await DiagnosticBooking.findById(req.params.id);

    if (!diagnosticBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only lab staff or admin can update status
    if (req.user.role !== 'admin' && req.user.role !== 'lab_staff') {
      return res.status(404).json({ message: 'Access denied' });
    }

    diagnosticBooking.status = status;
    if (notes) diagnosticBooking.notes = notes;

    if (status === 'completed') {
      diagnosticBooking.completedAt = new Date();
    }

    await diagnosticBooking.save();

    res.json({ message: 'Booking status updated', booking: diagnosticBooking });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel booking
router.patch('/bookings/:id/cancel', auth, async (req, res) => {
  try {
    const { reason } = req.body;
    const diagnosticBooking = await DiagnosticBooking.findById(req.params.id);

    if (!diagnosticBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking
    if (diagnosticBooking.patient.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Only allow cancellation if not completed
    if (['completed', 'cancelled'].includes(diagnosticBooking.status)) {
      return res.status(400).json({ message: 'Cannot cancel this booking' });
    }

    diagnosticBooking.status = 'cancelled';
    diagnosticBooking.cancelledAt = new Date();
    if (reason) diagnosticBooking.cancellationReason = reason;

    await diagnosticBooking.save();

    res.json({ message: 'Booking cancelled successfully', booking: diagnosticBooking });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== SEARCH & FILTERS ====================

// Search tests and packages
router.get('/search', async (req, res) => {
  try {
    const { query, type } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    let results = {};

    if (!type || type === 'tests') {
      const tests = await DiagnosticTest.find({
        $text: { $search: query },
        isActive: true
      }).limit(10);
      results.tests = tests;
    }

    if (!type || type === 'packages') {
      const searchPackages = await DiagnosticPackage.find({
        $text: { $search: query },
        isActive: true
      }).populate('tests', 'name price').limit(10);
      results.packages = searchPackages;
    }

    res.json(results);
  } catch (error) {
    console.error('Error searching diagnostics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available time slots for a date
router.get('/slots/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const { collectionType } = req.query;

    // Mock time slots - in production, this would check lab availability
    const availableSlots = [
      '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
      '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
      '04:00 PM', '05:00 PM', '06:00 PM'
    ];

    // Check existing bookings for the date
    const existingBookings = await DiagnosticBooking.find({
      scheduledDate: new Date(date),
      status: { $nin: ['cancelled'] }
    });

    // Filter out booked slots (mock logic)
    const bookedSlots = existingBookings.map(booking => booking.scheduledTime);
    const availableSlotsFiltered = availableSlots.filter(slot => !bookedSlots.includes(slot));

    res.json({
      date,
      availableSlots: availableSlotsFiltered,
      totalSlots: availableSlots.length,
      bookedSlots: bookedSlots.length
    });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==================== ADMIN ROUTES ====================

// Get all bookings (admin only)
router.get('/admin/bookings', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status, page = 1, limit = 20 } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    const skip = (page - 1) * limit;
    const diagnosticBookings = await DiagnosticBooking.find(query)
      .populate('patient', 'name email')
      .populate('tests.test', 'name price')
      .populate('packages.package', 'name price')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await DiagnosticBooking.countDocuments(query);

    res.json({
      bookings: diagnosticBookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalBookings: total
      }
    });
  } catch (error) {
    console.error('Error fetching admin bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 