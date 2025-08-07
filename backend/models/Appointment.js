import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in minutes
    default: 30
  },
  type: {
    type: String,
    enum: ['consultation', 'followup', 'checkup', 'emergency'],
    default: 'consultation'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled'],
    default: 'pending'
  },
  reason: {
    type: String,
    required: true
  },
  symptoms: [{
    type: String
  }],
  notes: {
    patient: String,
    doctor: String
  },
  prescription: [{
    medicine: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String
  }],
  diagnosis: {
    type: String,
    default: null
  },
  
  // Payment related
  consultationFee: {
    type: Number,
    required: true
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paymentId: {
    type: String,
    default: null
  },
  paymentMethod: {
    type: String,
    enum: ['razorpay', 'cash', 'insurance'],
    default: 'razorpay'
  },
  
  // Meeting related
  meetingLink: {
    type: String,
    default: null
  },
  meetingId: {
    type: String,
    default: null
  },
  meetingStarted: {
    type: Boolean,
    default: false
  },
  meetingEndTime: {
    type: Date,
    default: null
  },
  
  // Cancellation/Rescheduling
  cancellationReason: {
    type: String,
    default: null
  },
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  rescheduledFrom: {
    date: Date,
    time: String
  },
  
  // Reminders
  remindersSent: {
    patient: {
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false }
    },
    doctor: {
      email: { type: Boolean, default: false },
      sms: { type: Boolean, default: false }
    }
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

// Virtual for appointment date and time combined
appointmentSchema.virtual('appointmentDateTime').get(function() {
  const date = new Date(this.appointmentDate);
  const [hours, minutes] = this.appointmentTime.split(':');
  date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return date;
});

// Index for better query performance
appointmentSchema.index({ patient: 1, appointmentDate: 1 });
appointmentSchema.index({ doctor: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ appointmentDate: 1, appointmentTime: 1 });

// Pre-save middleware to generate meeting link for confirmed appointments
appointmentSchema.pre('save', function(next) {
  if (this.status === 'confirmed' && !this.meetingLink) {
    const meetingId = `takecare-${this._id}-${Date.now()}`;
    this.meetingId = meetingId;
    this.meetingLink = `${process.env.JITSI_MEET_DOMAIN || 'https://meet.jit.si'}/${meetingId}`;
  }
  next();
});

export default mongoose.model('Appointment', appointmentSchema);
