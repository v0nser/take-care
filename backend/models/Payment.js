import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: false // Made optional to support diagnostic bookings
  },
  diagnosticBooking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DiagnosticBooking',
    required: false
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Made optional for diagnostic bookings
  },
  
  // Payment Details
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  
  // Razorpay Details
  razorpayOrderId: {
    type: String,
    required: true
  },
  razorpayPaymentId: {
    type: String,
    default: null
  },
  razorpaySignature: {
    type: String,
    default: null
  },
  
  // Payment Status
  status: {
    type: String,
    enum: ['created', 'attempted', 'paid', 'failed', 'refunded', 'cancelled'],
    default: 'created'
  },
  
  // Payment Method
  method: {
    type: String,
    enum: ['card', 'netbanking', 'wallet', 'upi', 'emi'],
    default: null
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'cash', 'insurance'],
    default: 'razorpay'
  },
  
  // Failure Details
  failureReason: {
    type: String,
    default: null
  },
  errorCode: {
    type: String,
    default: null
  },
  errorDescription: {
    type: String,
    default: null
  },
  
  // Refund Details
  refundAmount: {
    type: Number,
    default: 0
  },
  refundId: {
    type: String,
    default: null
  },
  refundStatus: {
    type: String,
    enum: ['pending', 'processed', 'failed'],
    default: null
  },
  refundReason: {
    type: String,
    default: null
  },
  refundDate: {
    type: Date,
    default: null
  },
  
  // Payment Gateway Response
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Additional Information
  description: {
    type: String,
    default: null
  },
  notes: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Timestamps
  paidAt: {
    type: Date,
    default: null
  },
  
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ appointment: 1 });
paymentSchema.index({ razorpayOrderId: 1 });
// Removed razorpayPaymentId index - causes duplicate key errors with null values
paymentSchema.index({ status: 1 });

// Virtual for formatted amount
paymentSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: this.currency
  }).format(this.amount / 100); // Razorpay amounts are in paise
});

// Pre-save middleware to set paidAt timestamp
paymentSchema.pre('save', function(next) {
  if (this.status === 'paid' && !this.paidAt) {
    this.paidAt = new Date();
  }
  next();
});

export default mongoose.model('Payment', paymentSchema);
