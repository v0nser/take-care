import mongoose from 'mongoose';

const diagnosticPackageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Age & Gender', 'Health Need']
  },
  description: {
    type: String,
    required: true
  },
  tests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DiagnosticTest',
    required: true
  }],
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  savings: {
    type: Number,
    required: true,
    min: 0
  },
  preparation: {
    type: String,
    required: true
  },
  reportTime: {
    type: String,
    required: true
  },
  popular: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
diagnosticPackageSchema.index({ category: 1, isActive: 1 });
diagnosticPackageSchema.index({ popular: 1, isActive: 1 });
diagnosticPackageSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('DiagnosticPackage', diagnosticPackageSchema); 