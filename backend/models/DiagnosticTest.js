import mongoose from 'mongoose';

const diagnosticTestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Diabetes', 'General Health', 'Liver Health', 'Cardiovascular', 
      'Endocrinology', 'Blood Disorders', 'Toxicology', 'Nutrition', 
      'Men Health', 'Women Health'
    ]
  },
  sampleType: {
    type: String,
    required: true,
    enum: ['Blood', 'Urine', 'Stool', 'Saliva', 'Tissue']
  },
  fasting: {
    type: Boolean,
    default: false
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
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
diagnosticTestSchema.index({ category: 1, isActive: 1 });
diagnosticTestSchema.index({ sampleType: 1, isActive: 1 });
diagnosticTestSchema.index({ popular: 1, isActive: 1 });
diagnosticTestSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('DiagnosticTest', diagnosticTestSchema); 