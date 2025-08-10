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
  consultationType: {
    type: String,
    enum: ['in-person', 'teleconsultation'],
    default: 'in-person'
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'rescheduled', 'in-progress'],
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
  
  // Teleconsultation/Meeting related
  meetingLink: {
    type: String,
    default: null
  },
  meetingId: {
    type: String,
    default: null
  },
  jitsiRoomName: {
    type: String,
    default: null
  },
  meetingStarted: {
    type: Boolean,
    default: false
  },
  meetingStartTime: {
    type: Date,
    default: null
  },
  meetingEndTime: {
    type: Date,
    default: null
  },
  actualDuration: {
    type: Number, // in minutes
    default: null
  },
  meetingAttendees: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: Date,
    leftAt: Date,
    totalTime: Number // in minutes
  }],
  
  // Pre-consultation form for teleconsultation
  preConsultationForm: {
    chiefComplaint: String,
    currentMedications: [String],
    allergies: [String],
    vitalSigns: {
      temperature: Number,
      bloodPressure: String,
      heartRate: Number,
      weight: Number,
      height: Number
    },
    urgencyLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    }
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

// Virtual for meeting duration
appointmentSchema.virtual('meetingDuration').get(function() {
  if (this.meetingStartTime && this.meetingEndTime) {
    return Math.floor((this.meetingEndTime - this.meetingStartTime) / 60000); // in minutes
  }
  return null;
});

// Index for better query performance
appointmentSchema.index({ patient: 1, appointmentDate: 1 });
appointmentSchema.index({ doctor: 1, appointmentDate: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ appointmentDate: 1, appointmentTime: 1 });
// Removed duplicate meetingId index - it's already defined in the schema with unique: true, sparse: true
appointmentSchema.index({ consultationType: 1 });

// Helper function to generate unique meeting ID
const generateMeetingId = function() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `takecare-${timestamp}-${randomStr}`;
};

// Pre-save middleware to generate meeting link for teleconsultation appointments
appointmentSchema.pre('save', function(next) {
  // Generate meeting details for teleconsultation when confirmed
  if (this.consultationType === 'teleconsultation' && this.status === 'confirmed' && !this.meetingId) {
    const meetingId = generateMeetingId();
    this.meetingId = meetingId;
    this.jitsiRoomName = meetingId;
    this.meetingLink = `${process.env.JITSI_MEET_DOMAIN || 'https://meet.jit.si'}/${meetingId}`;
  }
  next();
});

// Method to start meeting
appointmentSchema.methods.startMeeting = function(userId) {
  this.meetingStarted = true;
  this.meetingStartTime = new Date();
  this.status = 'in-progress';
  
  // Add user to attendees
  const attendee = this.meetingAttendees.find(a => a.userId.toString() === userId.toString());
  if (attendee) {
    attendee.joinedAt = new Date();
  } else {
    this.meetingAttendees.push({
      userId,
      joinedAt: new Date()
    });
  }
  
  return this.save();
};

// Method to end meeting
appointmentSchema.methods.endMeeting = function(userId) {
  this.meetingEndTime = new Date();
  this.actualDuration = this.meetingDuration;
  
  // Update attendee left time
  const attendee = this.meetingAttendees.find(a => a.userId.toString() === userId.toString());
  if (attendee && !attendee.leftAt) {
    attendee.leftAt = new Date();
    if (attendee.joinedAt) {
      attendee.totalTime = Math.floor((attendee.leftAt - attendee.joinedAt) / 60000);
    }
  }
  
  return this.save();
};

// Static method to get upcoming teleconsultations
appointmentSchema.statics.getUpcomingTeleconsultations = function(userId, role) {
  const query = {
    consultationType: 'teleconsultation',
    status: { $in: ['confirmed', 'in-progress'] },
    appointmentDate: { $gte: new Date() }
  };
  
  if (role === 'patient') {
    query.patient = userId;
  } else if (role === 'doctor') {
    query.doctor = userId;
  }
  
  return this.find(query)
    .populate('patient', 'firstName lastName profileImage')
    .populate('doctor', 'firstName lastName specialization profileImage')
    .sort({ appointmentDate: 1, appointmentTime: 1 });
};

export default mongoose.model('Appointment', appointmentSchema);
