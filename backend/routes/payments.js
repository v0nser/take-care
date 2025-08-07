import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import Appointment from '../models/Appointment.js';
import ActivityLog from '../models/ActivityLog.js';
import { authenticate, authorize, logActivity } from '../middleware/auth.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Razorpay (only if credentials are provided)
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  console.log('✅ Razorpay initialized successfully');
} else {
  console.log('⚠️ Razorpay credentials not found - payment features disabled');
}

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

    // Create Razorpay order
    const amount = appointment.consultationFee * 100; // Amount in paise
    const orderOptions = {
      amount,
      currency: 'INR',
      receipt: `appointment_${appointmentId}_${Date.now()}`,
      notes: {
        appointmentId: appointmentId.toString(),
        patientId: req.user._id.toString(),
        doctorId: appointment.doctor._id.toString(),
        patientName: appointment.patient.fullName,
        doctorName: appointment.doctor.fullName
      }
    };

    // Check if Razorpay is available
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: 'Payment service is currently unavailable. Please contact support.'
      });
    }

    const razorpayOrder = await razorpay.orders.create(orderOptions);

    // Save payment record
    const payment = new Payment({
      user: req.user._id,
      appointment: appointmentId,
      doctor: appointment.doctor._id,
      amount: amount,
      razorpayOrderId: razorpayOrder.id,
      status: 'created',
      description: `Consultation fee for Dr. ${appointment.doctor.fullName}`,
      notes: {
        appointmentDate: appointment.appointmentDate,
        appointmentTime: appointment.appointmentTime
      }
    });

    await payment.save();

    res.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: amount,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID,
      payment: payment,
      appointment: {
        id: appointment._id,
        doctor: appointment.doctor.fullName,
        date: appointment.appointmentDate,
        time: appointment.appointmentTime
      }
    });
  } catch (error) {
    console.error('Error creating payment order:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating payment order'
    });
  }
});

/**
 * @route   POST /api/payments/verify
 * @desc    Verify Razorpay payment
 * @access  Private (Patient)
 */
router.post('/verify', authenticate, authorize('patient'), logActivity('payment_verify', 'payment'), async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      appointmentId
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification details'
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

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      // Update payment status to failed
      payment.status = 'failed';
      payment.failureReason = 'Invalid signature';
      await payment.save();

      await ActivityLog.logActivity({
        user: req.user._id,
        action: 'payment_failure',
        resourceType: 'payment',
        resourceId: payment._id.toString(),
        description: 'Payment verification failed - Invalid signature',
        status: 'failure'
      });

      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    try {
      // Check if Razorpay is available
      if (!razorpay) {
        return res.status(503).json({
          success: false,
          message: 'Payment service is currently unavailable. Please contact support.'
        });
      }

      // Fetch payment details from Razorpay
      const razorpayPayment = await razorpay.payments.fetch(razorpay_payment_id);

      // Update payment record
      payment.razorpayPaymentId = razorpay_payment_id;
      payment.razorpaySignature = razorpay_signature;
      payment.status = razorpayPayment.status === 'captured' ? 'paid' : 'failed';
      payment.method = razorpayPayment.method;
      payment.gatewayResponse = razorpayPayment;
      
      if (payment.status === 'paid') {
        payment.paidAt = new Date();
      }

      await payment.save();

      // Update appointment payment status
      if (payment.status === 'paid') {
        const appointment = await Appointment.findById(payment.appointment);
        if (appointment) {
          appointment.isPaid = true;
          appointment.paymentId = razorpay_payment_id;
          await appointment.save();

          // Emit real-time notification
          req.io.to(`user_${req.user._id}`).emit('payment_success', {
            appointmentId: appointment._id,
            message: 'Payment successful! Your appointment is confirmed.'
          });

          await ActivityLog.logActivity({
            user: req.user._id,
            action: 'payment_success',
            resourceType: 'payment',
            resourceId: payment._id.toString(),
            description: `Payment successful for appointment with amount ₹${payment.amount / 100}`,
            metadata: {
              appointmentId: appointment._id.toString(),
              amount: payment.amount,
              method: payment.method
            }
          });
        }
      }

      res.json({
        success: true,
        message: payment.status === 'paid' ? 'Payment successful' : 'Payment failed',
        payment: payment,
        appointment: appointmentId
      });

    } catch (razorpayError) {
      console.error('Razorpay fetch error:', razorpayError);
      
      // Update payment with error details
      payment.status = 'failed';
      payment.failureReason = 'Razorpay verification failed';
      payment.errorCode = razorpayError.error?.code;
      payment.errorDescription = razorpayError.error?.description;
      await payment.save();

      res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment'
    });
  }
});

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
      message: 'Error fetching payment history'
    });
  }
});

/**
 * @route   GET /api/payments/:id
 * @desc    Get specific payment details
 * @access  Private
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('user', 'firstName lastName email phone')
      .populate('doctor', 'firstName lastName specialization')
      .populate('appointment');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check access permissions
    const hasAccess = 
      req.user.role === 'admin' ||
      payment.user._id.toString() === req.user._id.toString() ||
      payment.doctor._id.toString() === req.user._id.toString();

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment details'
    });
  }
});

/**
 * @route   POST /api/payments/:id/refund
 * @desc    Process refund for a payment (Admin only)
 * @access  Private (Admin)
 */
router.post('/:id/refund', authenticate, authorize('admin'), logActivity('payment_refund', 'payment'), async (req, res) => {
  try {
    const { amount, reason } = req.body;

    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (payment.status !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Only paid payments can be refunded'
      });
    }

    // Check if Razorpay is available
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: 'Payment service is currently unavailable. Please contact support.'
      });
    }

    // Create refund on Razorpay
    const refundAmount = amount || payment.amount;
    const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
      amount: refundAmount,
      notes: { reason: reason || 'Refund requested' }
    });

    // Update payment record
    payment.refundAmount = refundAmount;
    payment.refundId = refund.id;
    payment.refundStatus = refund.status;
    payment.refundReason = reason;
    payment.refundDate = new Date();

    if (refundAmount === payment.amount) {
      payment.status = 'refunded';
    }

    await payment.save();

    // Update appointment payment status if full refund
    if (refundAmount === payment.amount) {
      const appointment = await Appointment.findById(payment.appointment);
      if (appointment) {
        appointment.isPaid = false;
        appointment.paymentId = null;
        await appointment.save();
      }
    }

    await ActivityLog.logActivity({
      user: req.user._id,
      action: 'payment_refund',
      resourceType: 'payment',
      resourceId: payment._id.toString(),
      description: `Refund processed for amount ₹${refundAmount / 100}`,
      metadata: {
        refundAmount,
        reason,
        refundId: refund.id
      }
    });

    res.json({
      success: true,
      message: 'Refund processed successfully',
      payment,
      refund
    });
  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error processing refund'
    });
  }
});

/**
 * @route   GET /api/payments/stats/overview
 * @desc    Get payment statistics
 * @access  Private (Admin/Doctor)
 */
router.get('/stats/overview', authenticate, authorize('admin', 'doctor'), async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'doctor') {
      query.doctor = req.user._id;
    }

    const totalPayments = await Payment.countDocuments(query);
    const successfulPayments = await Payment.countDocuments({ ...query, status: 'paid' });
    const failedPayments = await Payment.countDocuments({ ...query, status: 'failed' });
    const refundedPayments = await Payment.countDocuments({ ...query, status: 'refunded' });

    // Calculate total revenue
    const revenueResult = await Payment.aggregate([
      { $match: { ...query, status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    // This month's revenue
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyRevenueResult = await Payment.aggregate([
      { 
        $match: { 
          ...query, 
          status: 'paid',
          paidAt: { $gte: startOfMonth }
        } 
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const monthlyRevenue = monthlyRevenueResult[0]?.total || 0;

    res.json({
      success: true,
      stats: {
        totalPayments,
        successfulPayments,
        failedPayments,
        refundedPayments,
        totalRevenue: totalRevenue / 100, // Convert to rupees
        monthlyRevenue: monthlyRevenue / 100,
        successRate: totalPayments > 0 ? (successfulPayments / totalPayments * 100).toFixed(2) : 0
      }
    });
  } catch (error) {
    console.error('Error fetching payment stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment statistics'
    });
  }
});

export default router;
