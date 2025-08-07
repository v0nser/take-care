import mongoose from 'mongoose';

const timeSlotSchema = new mongoose.Schema({
  startTime: {
    type: String, // Format: "HH:MM"
    required: true
  },
  endTime: {
    type: String, // Format: "HH:MM"
    required: true
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    default: null
  }
}, { _id: false });

const availabilitySchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Weekly schedule pattern
  weeklySchedule: {
    monday: {
      isAvailable: { type: Boolean, default: false },
      slots: [timeSlotSchema]
    },
    tuesday: {
      isAvailable: { type: Boolean, default: false },
      slots: [timeSlotSchema]
    },
    wednesday: {
      isAvailable: { type: Boolean, default: false },
      slots: [timeSlotSchema]
    },
    thursday: {
      isAvailable: { type: Boolean, default: false },
      slots: [timeSlotSchema]
    },
    friday: {
      isAvailable: { type: Boolean, default: false },
      slots: [timeSlotSchema]
    },
    saturday: {
      isAvailable: { type: Boolean, default: false },
      slots: [timeSlotSchema]
    },
    sunday: {
      isAvailable: { type: Boolean, default: false },
      slots: [timeSlotSchema]
    }
  },
  
  // Specific date overrides (for holidays, special schedules, etc.)
  dateOverrides: [{
    date: {
      type: Date,
      required: true
    },
    isAvailable: {
      type: Boolean,
      default: false
    },
    slots: [timeSlotSchema],
    reason: {
      type: String, // holiday, conference, etc.
      default: null
    }
  }],
  
  // Blocked dates (unavailable completely)
  blockedDates: [{
    date: {
      type: Date,
      required: true
    },
    reason: {
      type: String,
      required: true
    },
    isRecurring: {
      type: Boolean,
      default: false
    },
    recurringType: {
      type: String,
      enum: ['weekly', 'monthly', 'yearly'],
      default: null
    }
  }],
  
  // Default settings
  defaultSlotDuration: {
    type: Number, // in minutes
    default: 30
  },
  bufferTime: {
    type: Number, // buffer between appointments in minutes
    default: 10
  },
  maxAdvanceBooking: {
    type: Number, // maximum days in advance patients can book
    default: 30
  },
  isAcceptingNewPatients: {
    type: Boolean,
    default: true
  },
  
  // Timezone
  timezone: {
    type: String,
    default: 'Asia/Kolkata'
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
availabilitySchema.index({ doctor: 1 });
availabilitySchema.index({ 'dateOverrides.date': 1 });
availabilitySchema.index({ 'blockedDates.date': 1 });

// Static method to get doctor's availability for a specific date
availabilitySchema.statics.getAvailabilityForDate = async function(doctorId, date) {
  const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()];
  
  const availability = await this.findOne({ doctor: doctorId, isActive: true });
  if (!availability) return null;
  
  // Check if date is blocked
  const isBlocked = availability.blockedDates.some(blocked => {
    const blockedDate = new Date(blocked.date);
    return blockedDate.toDateString() === date.toDateString();
  });
  
  if (isBlocked) return { isAvailable: false, reason: 'blocked' };
  
  // Check for date override
  const override = availability.dateOverrides.find(override => {
    const overrideDate = new Date(override.date);
    return overrideDate.toDateString() === date.toDateString();
  });
  
  if (override) {
    return {
      isAvailable: override.isAvailable,
      slots: override.slots,
      reason: override.reason
    };
  }
  
  // Return weekly schedule for the day
  const daySchedule = availability.weeklySchedule[dayOfWeek];
  return {
    isAvailable: daySchedule.isAvailable,
    slots: daySchedule.slots || [],
    defaultSlotDuration: availability.defaultSlotDuration,
    bufferTime: availability.bufferTime
  };
};

// Method to generate time slots for a day
availabilitySchema.methods.generateTimeSlots = function(startTime, endTime, duration = 30, buffer = 10) {
  const slots = [];
  const start = new Date(`2000-01-01T${startTime}:00`);
  const end = new Date(`2000-01-01T${endTime}:00`);
  const slotDuration = duration + buffer; // total duration including buffer
  
  let current = start;
  while (current < end) {
    const slotEnd = new Date(current.getTime() + (duration * 60000));
    if (slotEnd <= end) {
      slots.push({
        startTime: current.toTimeString().substring(0, 5),
        endTime: slotEnd.toTimeString().substring(0, 5),
        isBooked: false
      });
    }
    current = new Date(current.getTime() + (slotDuration * 60000));
  }
  
  return slots;
};

const DoctorAvailability = mongoose.model('DoctorAvailability', availabilitySchema);

export default DoctorAvailability; 