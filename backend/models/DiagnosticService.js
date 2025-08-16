import mongoose from 'mongoose';

const diagnosticServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'diabetes',
      'cardiovascular-diseases',
      'hypertension',
      'gut-health',
      'bone-health',
      'alcohol',
      'cancer',
      'depression',
      'nutrition-disorder',
      'obesity',
      'respiratory-disorders',
      'sexual-wellness',
      'sleep-disorder'
    ]
  },
  icon: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  bgColor: {
    type: String,
    required: true
  },
  tests: [{
    name: String,
    description: String,
    price: Number,
    originalPrice: Number,
    discount: Number,
    reportTime: String,
    homeCollection: Boolean
  }],
  packages: [{
    name: String,
    price: Number,
    originalPrice: Number,
    discount: Number,
    description: String,
    includes: [String],
    reportTime: String,
    homeCollection: Boolean,
    category: String
  }],
  popular: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
diagnosticServiceSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const DiagnosticService = mongoose.model('DiagnosticService', diagnosticServiceSchema);

export default DiagnosticService; 