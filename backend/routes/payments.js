import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import Appointment from '../models/Appointment.js';
import DiagnosticBooking from '../models/DiagnosticBooking.js';
import ActivityLog from '../models/ActivityLog.js';
import { authenticate, authorize, logActivity } from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Razorpay
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
} else {
  console.log('⚠️ Razorpay credentials not found - payment features disabled');
}

// ==================== APPOINTMENT PAYMENTS ====================

/**
 * @route   POST /api/payments/create-order
 * @desc    Create Razorpay order for appointment payment
 * @access  Private (Patient)
 */
router.post('/create-order', authenticate, authorize('patient'), logActivity('payment_initiate', 'payment'), async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: 'Appointment ID is required'
      });
    }

    // Fetch appointment details
    const appointment = await Appointment.findById(appointmentId)
      .populate('doctor', 'firstName lastName consultationFee')
      .populate('patient', 'firstName lastName email');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if user owns this appointment
    if (appointment.patient._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if already paid
    if (appointment.isPaid) {
      return res.status(400).json({
        success: false,
        message: 'Appointment is already paid'
      });
    }

    // Check if Razorpay is available
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: 'Payment service is currently unavailable. Please contact support.'
      });
    }

    // Create Razorpay order
    const amount = Math.round(appointment.consultationFee * 100); // Amount in paise
    
    // Create shorter receipt (Razorpay limit: 40 chars)
    const shortAppointmentId = appointmentId.toString().substring(0, 8);
    const receipt = `apt_${shortAppointmentId}_${Date.now().toString().slice(-6)}`;
    
    const orderOptions = {
      amount,
      currency: 'INR',
      receipt,
      notes: {
        appointmentId: appointmentId.toString(),
        patientId: req.user._id.toString(),
        doctorId: appointment.doctor._id.toString(),
        patientName: `${appointment.patient.firstName} ${appointment.patient.lastName}`,
        doctorName: `${appointment.doctor.firstName} ${appointment.doctor.lastName}`
      }
    };

    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create(orderOptions);
      console.log('Razorpay order created successfully:', razorpayOrder.id);
    } catch (razorpayError) {
      console.error('Razorpay order creation failed:', {
        error: razorpayError.message,
        statusCode: razorpayError.statusCode,
        code: razorpayError.error?.code,
        description: razorpayError.error?.description,
        details: razorpayError.error
      });
      
      // Return specific error for authentication issues
      if (razorpayError.statusCode === 401) {
        return res.status(500).json({
          success: false,
          message: 'Payment service authentication failed. Please check Razorpay credentials.'
        });
      }
      
      // Return specific error for receipt validation issues
      if (razorpayError.statusCode === 400 && razorpayError.error?.description?.includes('receipt')) {
        return res.status(500).json({
          success: false,
          message: 'Payment order creation failed due to invalid receipt format. Please try again.'
        });
      }
      
      // Handle amount validation errors
      if (razorpayError.statusCode === 400 && razorpayError.error?.description?.includes('amount')) {
        return res.status(500).json({
          success: false,
          message: 'Invalid payment amount. Please contact support.'
        });
      }
      
      // Handle currency validation errors
      if (razorpayError.statusCode === 400 && razorpayError.error?.description?.includes('currency')) {
        return res.status(500).json({
          success: false,
          message: 'Invalid currency. Please contact support.'
        });
      }
      
      // Generic error for other 400 status codes
      if (razorpayError.statusCode === 400) {
        return res.status(500).json({
          success: false,
          message: `Payment order creation failed: ${razorpayError.error?.description || razorpayError.message}`
        });
      }
      
      throw razorpayError;
    }

    // Save payment record
    const payment = new Payment({
      user: req.user._id,
      appointment: appointmentId,
      doctor: appointment.doctor._id,
      amount: razorpayOrder.amount, // store in paise to match Razorpay and UI formatting
      currency: 'INR',
      razorpayOrderId: razorpayOrder.id,
      status: 'created',
      paymentMethod: 'razorpay',
      description: `Appointment with Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`
    });

    await payment.save();

    res.json({
      success: true,
      message: 'Payment order created successfully',
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        paymentId: payment._id
      }
    });

  } catch (error) {
    console.error('Error creating appointment payment order:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create payment order'
    });
  }
});


/**
 * @route   POST /api/payments/verify
 * @desc    Verify appointment payment
 * @access  Private (Patient)
 */
router.post('/verify', authenticate, authorize('patient'), logActivity('payment_verify', 'payment'), async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification data'
      });
    }

    // Check if Razorpay is available
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: 'Payment service is currently unavailable. Please contact support.'
      });
    }

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Find payment record
    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
      user: req.user._id
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    // Verify payment with Razorpay
    let razorpayPayment;
    try {
      razorpayPayment = await razorpay.payments.fetch(razorpay_payment_id);
      console.log('Razorpay payment status:', razorpayPayment.status);
    } catch (fetchError) {
      console.error('Error fetching Razorpay payment:', fetchError);
      return res.status(400).json({
        success: false,
        message: 'Failed to verify payment with payment gateway'
      });
    }

    // Handle different payment statuses
    let finalStatus = razorpayPayment.status;
    
    // If payment is authorized but not captured, attempt to capture
    if (razorpayPayment.status === 'authorized') {
      try {
        console.log('Attempting to capture authorized payment...');
        const capturedPayment = await razorpay.payments.capture(
          razorpay_payment_id, 
          payment.amount, 
          payment.currency
        );
        console.log('Payment captured successfully:', capturedPayment.status);
        finalStatus = capturedPayment.status;
        razorpayPayment = capturedPayment;
      } catch (captureErr) {
        console.error('Error capturing payment:', captureErr);
        // Don't fail the verification if capture fails, just log it
        // The payment might still be successful
      }
    }

    // Map Razorpay status to our system status
    let systemStatus;
    switch (finalStatus) {
      case 'captured':
        systemStatus = 'paid';
        break;
      case 'authorized':
        systemStatus = 'pending';
        break;
      case 'failed':
        systemStatus = 'failed';
        break;
      case 'created':
        systemStatus = 'created';
        break;
      default:
        systemStatus = finalStatus || 'unknown';
    }

    // Update payment record
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = systemStatus;
    payment.method = razorpayPayment.method;
    payment.gatewayResponse = razorpayPayment;
    
    if (systemStatus === 'paid') {
      payment.paidAt = new Date();
    }

    await payment.save();
    console.log('Payment record updated with status:', systemStatus);

    // Update appointment payment status
    if (systemStatus === 'paid' && payment.appointment) {
      const appointment = await Appointment.findById(payment.appointment);
      if (appointment) {
        appointment.isPaid = true;
        appointment.paymentId = razorpay_payment_id;
        await appointment.save();
        console.log('Appointment marked as paid');
      }
      // Emit socket event to user
      if (req.io) {
        req.io.to(`user_${req.user._id}`).emit('payment_success', {
          paymentId: payment._id,
          type: 'appointment',
          amount: payment.amount,
          message: 'Appointment payment successful'
        });
      }
    }

    res.json({
      success: true,
      message: payment.status === 'paid' ? 'Payment successful!' : 'Payment failed',
      data: {
        paymentId: payment._id,
        status: payment.status,
        amount: payment.amount
      }
    });

  } catch (error) {
    console.error('Error verifying appointment payment:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Payment verification failed'
    });
  }
});

// ==================== DIAGNOSTIC PAYMENTS ====================

/**
 * @route   POST /api/payments/create-diagnostic-order
 * @desc    Create Razorpay order for diagnostic booking payment
 * @access  Private (Patient)
 */
router.post('/create-diagnostic-order', authenticate, authorize('patient'), logActivity('diagnostic_payment_initiate', 'payment'), async (req, res) => {
  try {
    const { bookingId } = req.body;
    console.log('Creating diagnostic order for booking:', bookingId);

    if (!bookingId) {
      console.log('Missing booking ID in request');
      return res.status(400).json({
        success: false,
        message: 'Booking ID is required'
      });
    }

    // Check if Razorpay is available
    if (!razorpay) {
      console.log('Razorpay not initialized - credentials missing');
      return res.status(503).json({
        success: false,
        message: 'Payment service is currently unavailable. Please contact support.'
      });
    }

    // Debug Razorpay configuration
    console.log('Razorpay config check:', {
      keyId: process.env.RAZORPAY_KEY_ID ? 'Set' : 'Missing',
      keySecret: process.env.RAZORPAY_KEY_SECRET ? 'Set' : 'Missing',
      razorpayInstance: razorpay ? 'Available' : 'Not Available'
    });

    // Fetch diagnostic booking details
    const booking = await DiagnosticBooking.findById(bookingId)
      .populate('patient', 'firstName lastName email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Diagnostic booking not found'
      });
    }

    // Check if user owns this booking
    if (booking.patient._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if already paid
    if (booking.paymentStatus === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Booking is already paid'
      });
    }

    // Create Razorpay order
    const amount = Math.round(booking.totalAmount * 100); // Amount in paise
    
    // Create shorter receipt (Razorpay limit: 40 chars)
    const shortBookingId = bookingId.toString().substring(0, 8);
    const receipt = `diag_${shortBookingId}_${Date.now().toString().slice(-6)}`;
    
    const orderOptions = {
      amount,
      currency: 'INR',
      receipt,
      notes: {
        bookingId: bookingId.toString(),
        patientId: req.user._id.toString(),
        patientName: `${booking.patient.firstName} ${booking.patient.lastName}`,
        bookingType: 'diagnostic'
      }
    };

    console.log('Creating Razorpay order with options:', {
      amount,
      currency: orderOptions.currency,
      receipt: orderOptions.receipt
    });

    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create(orderOptions);
      console.log('Razorpay order created successfully:', razorpayOrder.id);
    } catch (razorpayError) {
      console.error('Razorpay order creation failed:', {
        error: razorpayError.message,
        statusCode: razorpayError.statusCode,
        code: razorpayError.error?.code,
        description: razorpayError.error?.description,
        details: razorpayError.error
      });
      
      // Return specific error for authentication issues
      if (razorpayError.statusCode === 401) {
        return res.status(500).json({
          success: false,
          message: 'Payment service authentication failed. Please check Razorpay credentials.'
        });
      }
      
      // Return specific error for receipt validation issues
      if (razorpayError.statusCode === 400 && razorpayError.error?.description?.includes('receipt')) {
        return res.status(500).json({
          success: false,
          message: 'Payment order creation failed due to invalid receipt format. Please try again.'
        });
      }
      
      // Handle amount validation errors
      if (razorpayError.statusCode === 400 && razorpayError.error?.description?.includes('amount')) {
        return res.status(500).json({
          success: false,
          message: 'Invalid payment amount. Please contact support.'
        });
      }
      
      // Handle currency validation errors
      if (razorpayError.statusCode === 400 && razorpayError.error?.description?.includes('currency')) {
        return res.status(500).json({
          success: false,
          message: 'Invalid currency. Please contact support.'
        });
      }
      
      // Generic error for other 400 status codes
      if (razorpayError.statusCode === 400) {
        return res.status(500).json({
          success: false,
          message: `Payment order creation failed: ${razorpayError.error?.description || razorpayError.message}`
        });
      }
      
      throw razorpayError;
    }

    // Save payment record
    const payment = new Payment({
      user: req.user._id,
      diagnosticBooking: bookingId,
      amount: razorpayOrder.amount, // store in paise to match Razorpay and UI formatting
      currency: 'INR',
      razorpayOrderId: razorpayOrder.id,
      status: 'created',
      paymentMethod: 'razorpay',
      description: `Diagnostic booking - ${booking.bookingId}`
    });

    await payment.save();

    res.json({
      success: true,
      message: 'Diagnostic payment order created successfully',
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        paymentId: payment._id
      }
    });

  } catch (error) {
    console.error('Error creating diagnostic payment order:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create payment order'
    });
  }
});

/**
 * @route   POST /api/payments/verify-diagnostic
 * @desc    Verify diagnostic payment
 * @access  Private (Patient)
 */
router.post('/verify-diagnostic', authenticate, authorize('patient'), logActivity('diagnostic_payment_verify', 'payment'), async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification data'
      });
    }

    // Check if Razorpay is available
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: 'Payment service is currently unavailable. Please contact support.'
      });
    }

    // Verify signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Find payment record
    const payment = await Payment.findOne({
      razorpayOrderId: razorpay_order_id,
      user: req.user._id
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    // Verify payment with Razorpay
    let razorpayPayment;
    try {
      razorpayPayment = await razorpay.payments.fetch(razorpay_payment_id);
      console.log('Diagnostic payment status:', razorpayPayment.status);
    } catch (fetchError) {
      console.error('Error fetching diagnostic payment:', fetchError);
      return res.status(400).json({
        success: false,
        message: 'Failed to verify payment with payment gateway'
      });
    }

    // Handle different payment statuses
    let finalStatus = razorpayPayment.status;
    
    // If payment is authorized but not captured, attempt to capture
    if (razorpayPayment.status === 'authorized') {
      try {
        console.log('Attempting to capture authorized diagnostic payment...');
        const capturedPayment = await razorpay.payments.capture(
          razorpay_payment_id, 
          payment.amount, 
          payment.currency
        );
        console.log('Diagnostic payment captured successfully:', capturedPayment.status);
        finalStatus = capturedPayment.status;
        razorpayPayment = capturedPayment;
      } catch (captureErr) {
        console.error('Error capturing diagnostic payment:', captureErr);
        // Don't fail the verification if capture fails, just log it
        // The payment might still be successful
      }
    }

    // Map Razorpay status to our system status
    let systemStatus;
    switch (finalStatus) {
      case 'captured':
        systemStatus = 'paid';
        break;
      case 'authorized':
        systemStatus = 'pending';
        break;
      case 'failed':
        systemStatus = 'failed';
        break;
      case 'created':
        systemStatus = 'created';
        break;
      default:
        systemStatus = finalStatus || 'unknown';
    }

    // Update payment record
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    payment.status = systemStatus;
    payment.method = razorpayPayment.method;
    payment.gatewayResponse = razorpayPayment;
    
    if (systemStatus === 'paid') {
      payment.paidAt = new Date();
    }

    await payment.save();
    console.log('Diagnostic payment record updated with status:', systemStatus);

    // Update diagnostic booking payment status
    if (payment.status === 'paid' && payment.diagnosticBooking) {
      const booking = await DiagnosticBooking.findById(payment.diagnosticBooking);
      if (booking) {
        booking.paymentStatus = 'completed';
        booking.razorpayPaymentId = razorpay_payment_id;
        booking.razorpayOrderId = razorpay_order_id;
        await booking.save();
      }
      // Emit socket event to user
      if (req.io) {
        req.io.to(`user_${req.user._id}`).emit('payment_success', {
          paymentId: payment._id,
          type: 'diagnostic',
          amount: payment.amount,
          message: 'Diagnostic payment successful'
        });
      }
    }

    res.json({
      success: true,
      message: payment.status === 'paid' ? 'Payment successful!' : 'Payment failed',
      data: {
        paymentId: payment._id,
        status: payment.status,
        amount: payment.amount
      }
    });

  } catch (error) {
    console.error('Error verifying diagnostic payment:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Payment verification failed'
    });
  }
});

// ==================== PAYMENT HISTORY ====================

/**
 * @route   GET /api/payments
 * @desc    Get user's payment history
 * @access  Private
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let query = {};
    
    if (req.user.role === 'patient') {
      query.user = req.user._id;
    } else if (req.user.role === 'doctor') {
      query.doctor = req.user._id;
    }
    
    if (status) {
      query.status = status;
    }

    const payments = await Payment.find(query)
      .populate('user', 'firstName lastName email')
      .populate('doctor', 'firstName lastName specialization')
      .populate('appointment', 'appointmentDate appointmentTime reason')
      .populate('diagnosticBooking', 'bookingId scheduledDate scheduledTime')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Payment.countDocuments(query);

    res.json({
      success: true,
      payments,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch payments'
    });
  }
});

/**
 * @route   GET /api/payments/:id
 * @desc    Get single payment by ID
 * @access  Private
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const payment = await Payment.findOne({
      _id: req.params.id,
      user: req.user._id
    })
      .populate('appointment', 'appointmentDate appointmentTime reason')
      .populate('diagnosticBooking', 'bookingId scheduledDate scheduledTime')
      .populate('doctor', 'firstName lastName');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch payment'
    });
  }
});

export default router;
