import mongoose from 'mongoose';

const medicalRecordSchema = new mongoose.Schema({
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
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    default: null
  },
  
  // Basic Information
  recordType: {
    type: String,
    enum: ['consultation', 'diagnosis', 'prescription', 'test_result', 'vaccination', 'surgery', 'emergency'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  
  // Medical Details
  symptoms: [{
    symptom: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe'],
      default: 'moderate'
    },
    duration: String
  }],
  
  diagnosis: [{
    condition: String,
    icd10Code: String, // International Classification of Diseases
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe', 'critical'],
      default: 'moderate'
    },
    status: {
      type: String,
      enum: ['active', 'resolved', 'chronic', 'suspected'],
      default: 'active'
    }
  }],
  
  prescription: [{
    medicine: {
      type: String,
      required: true
    },
    dosage: {
      type: String,
      required: true
    },
    frequency: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true
    },
    instructions: String,
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: Date
  }],
  
  // Vital Signs
  vitalSigns: {
    bloodPressure: {
      systolic: Number,
      diastolic: Number
    },
    heartRate: Number, // beats per minute
    temperature: Number, // in Celsius
    weight: Number, // in kg
    height: Number, // in cm
    oxygenSaturation: Number, // percentage
    respiratoryRate: Number // breaths per minute
  },
  
  // Lab Tests
  labTests: [{
    testName: String,
    testDate: Date,
    results: [{
      parameter: String,
      value: String,
      unit: String,
      normalRange: String,
      status: {
        type: String,
        enum: ['normal', 'abnormal', 'critical'],
        default: 'normal'
      }
    }],
    notes: String
  }],
  
  // Imaging Studies
  imagingStudies: [{
    studyType: String, // X-Ray, CT Scan, MRI, Ultrasound
    studyDate: Date,
    bodyPart: String,
    findings: String,
    images: [String], // URLs to image files
    radiologistNotes: String
  }],
  
  // Files and Documents
  attachments: [{
    fileName: String,
    fileType: String,
    fileSize: Number,
    fileUrl: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Follow-up
  followUpRequired: {
    type: Boolean,
    default: false
  },
  followUpDate: Date,
  followUpNotes: String,
  
  // Additional Notes
  doctorNotes: String,
  patientNotes: String,
  
  // Privacy and Access
  isPrivate: {
    type: Boolean,
    default: false
  },
  sharedWith: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    permission: {
      type: String,
      enum: ['read', 'write'],
      default: 'read'
    },
    sharedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
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
medicalRecordSchema.index({ patient: 1, date: -1 });
medicalRecordSchema.index({ doctor: 1, date: -1 });
medicalRecordSchema.index({ recordType: 1 });
medicalRecordSchema.index({ appointment: 1 });

// Virtual for formatted date
medicalRecordSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

export default mongoose.model('MedicalRecord', medicalRecordSchema);
