import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Action Details
  action: {
    type: String,
    required: true,
    enum: [
      'login',
      'logout',
      'register',
      'profile_update',
      'appointment_book',
      'appointment_cancel',
      'appointment_reschedule',
      'appointment_complete',
      'payment_initiate',
      'payment_success',
      'payment_failure',
      'meeting_create',
      'meeting_join',
      'meeting_end',
      'medical_record_create',
      'medical_record_update',
      'medical_record_view',
      'notification_send',
      'password_change',
      'role_change',
      'data_export',
      'system_error',
      'failed_login'
    ]
  },
  
  // Resource Information
  resourceType: {
    type: String,
    enum: ['user', 'appointment', 'payment', 'medical_record', 'meeting', 'notification', 'system'],
    required: true
  },
  resourceId: {
    type: String, // Can be ObjectId or any identifier
    default: null
  },
  
  // Action Details
  description: {
    type: String,
    required: true
  },
  
  // Request Information
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  },
  
  // Additional Context
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Status
  status: {
    type: String,
    enum: ['success', 'failure', 'warning', 'info'],
    default: 'success'
  },
  
  // Error Information (if applicable)
  error: {
    code: String,
    message: String,
    stack: String
  },
  
  // Timing
  duration: {
    type: Number, // in milliseconds
    default: null
  },
  
  // Privacy
  isPrivate: {
    type: Boolean,
    default: false
  },
  
  // Timestamp (for backward compatibility)
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });
activityLogSchema.index({ resourceType: 1, resourceId: 1 });
activityLogSchema.index({ status: 1 });
activityLogSchema.index({ createdAt: -1 }); // For recent logs

// Virtual for formatted timestamp
activityLogSchema.virtual('formattedTimestamp').get(function() {
  return this.createdAt.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
});

// Static method to log activity
activityLogSchema.statics.logActivity = async function(logData) {
  try {
    const log = new this(logData);
    await log.save();
    return log;
  } catch (error) {
    console.error('Error logging activity:', error);
  }
};

// Static method to get user activity
activityLogSchema.statics.getUserActivity = async function(userId, limit = 50) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'firstName lastName email role');
};

// Static method to get system activity
activityLogSchema.statics.getSystemActivity = async function(filters = {}, limit = 100) {
  const query = { ...filters };
  return this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'firstName lastName email role');
};

// Pre-save middleware to ensure timestamp is set
activityLogSchema.pre('save', function(next) {
  if (!this.timestamp) {
    this.timestamp = new Date();
  }
  next();
});

export default mongoose.model('ActivityLog', activityLogSchema);
