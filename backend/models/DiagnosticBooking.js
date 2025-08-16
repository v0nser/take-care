import mongoose from 'mongoose';

const diagnosticBookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tests: [{
    test: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DiagnosticTest',
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }],
  packages: [{
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DiagnosticPackage'
    },
    price: {
      type: Number,
      required: true
    }
  }],
  collectionType: {
    type: String,
    required: true,
    enum: ['lab-visit', 'home-collection']
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  scheduledTime: {
    type: String,
    required: true
  },
  patientDetails: {
    name: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      required: true,
      min: 1,
      max: 120
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female', 'other']
    },
    phone: {
      type: String,
      required: true
    },
    email: String,
    address: String,
    pincode: {
      type: String,
      required: true,
      pattern: /^[0-9]{6}$/
    }
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    default: 'razorpay'
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  status: {
    type: String,
    required: true,
    enum: ['scheduled', 'sample-collected', 'processing', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  collectionAddress: {
    address: String,
    pincode: String,
    city: String,
    state: String
  },
  labLocation: {
    name: String,
    address: String,
    pincode: String,
    city: String,
    state: String
  },
  notes: String,
  fastingWarning: {
    warning: Boolean,
    message: String,
    tests: [String]
  },
  reportUrl: String,
  completedAt: Date,
  cancelledAt: Date,
  cancellationReason: String
}, {
  timestamps: true
});

// Indexes for better query performance
diagnosticBookingSchema.index({ patient: 1, status: 1 });
diagnosticBookingSchema.index({ scheduledDate: 1, status: 1 });
diagnosticBookingSchema.index({ bookingId: 1 });
diagnosticBookingSchema.index({ paymentStatus: 1 });
diagnosticBookingSchema.index({ collectionType: 1, scheduledDate: 1 });

// Generate booking ID before saving
diagnosticBookingSchema.pre('save', function(next) {
  if (!this.bookingId) {
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    this.bookingId = `DIAG${timestamp}${random}`;
  }
  next();
});

// Calculate total amount
diagnosticBookingSchema.methods.calculateTotal = function() {
  const testTotal = this.tests.reduce((sum, test) => sum + test.price, 0);
  const packageTotal = this.packages.reduce((sum, pkg) => sum + pkg.price, 0);
  return testTotal + packageTotal;
};

export default mongoose.model('DiagnosticBooking', diagnosticBookingSchema); 