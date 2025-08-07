import express from 'express';
import MedicalRecord from '../models/MedicalRecord.js';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import { authenticate, authorize, logActivity } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/medical-records
 * @desc    Create a new medical record
 * @access  Private (Doctor)
 */
router.post('/', authenticate, authorize('doctor'), logActivity('medical_record_create', 'medical_record'), async (req, res) => {
  try {
    const {
      patientId,
      appointmentId,
      recordType,
      title,
      description,
      symptoms,
      diagnosis,
      prescription,
      vitalSigns,
      labTests,
      imagingStudies,
      doctorNotes,
      followUpRequired,
      followUpDate,
      followUpNotes
    } = req.body;

    // Validate required fields
    if (!patientId || !recordType || !title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID, record type, title, and description are required'
      });
    }

    // Verify patient exists
    const patient = await User.findOne({ _id: patientId, role: 'patient' });
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Create medical record
    const medicalRecord = new MedicalRecord({
      patient: patientId,
      doctor: req.user._id,
      appointment: appointmentId || null,
      recordType,
      title,
      description,
      symptoms: symptoms || [],
      diagnosis: diagnosis || [],
      prescription: prescription || [],
      vitalSigns: vitalSigns || {},
      labTests: labTests || [],
      imagingStudies: imagingStudies || [],
      doctorNotes,
      followUpRequired: followUpRequired || false,
      followUpDate: followUpDate || null,
      followUpNotes
    });

    await medicalRecord.save();
    await medicalRecord.populate(['patient', 'doctor']);

    // Emit real-time notification to patient
    req.io.to(`user_${patientId}`).emit('new_medical_record', {
      medicalRecord,
      message: `New medical record added: ${title}`
    });

    res.status(201).json({
      success: true,
      message: 'Medical record created successfully',
      medicalRecord
    });
  } catch (error) {
    console.error('Error creating medical record:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating medical record'
    });
  }
});

/**
 * @route   GET /api/medical-records
 * @desc    Get medical records
 * @access  Private
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const { patientId, recordType, page = 1, limit = 10, search } = req.query;
    
    let query = {};
    
    // Role-based filtering
    if (req.user.role === 'patient') {
      query.patient = req.user._id;
    } else if (req.user.role === 'doctor') {
      if (patientId) {
        query.patient = patientId;
      } else {
        query.doctor = req.user._id;
      }
    } else if (req.user.role === 'admin' && patientId) {
      query.patient = patientId;
    }

    // Additional filters
    if (recordType) {
      query.recordType = recordType;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'diagnosis.condition': { $regex: search, $options: 'i' } }
      ];
    }

    const medicalRecords = await MedicalRecord.find(query)
      .populate('patient', 'firstName lastName profileImage bloodGroup')
      .populate('doctor', 'firstName lastName specialization')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await MedicalRecord.countDocuments(query);

    res.json({
      success: true,
      medicalRecords,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching medical records:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching medical records'
    });
  }
});

/**
 * @route   GET /api/medical-records/:id
 * @desc    Get specific medical record details
 * @access  Private
 */
router.get('/:id', authenticate, logActivity('medical_record_view', 'medical_record'), async (req, res) => {
  try {
    const medicalRecord = await MedicalRecord.findById(req.params.id)
      .populate('patient', 'firstName lastName profileImage phone email bloodGroup dateOfBirth gender')
      .populate('doctor', 'firstName lastName specialization qualifications')
      .populate('appointment', 'appointmentDate appointmentTime reason');

    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }

    // Check access permissions
    const hasAccess = 
      req.user.role === 'admin' ||
      medicalRecord.patient._id.toString() === req.user._id.toString() ||
      medicalRecord.doctor._id.toString() === req.user._id.toString();

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      medicalRecord
    });
  } catch (error) {
    console.error('Error fetching medical record:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching medical record details'
    });
  }
});

/**
 * @route   PUT /api/medical-records/:id
 * @desc    Update medical record
 * @access  Private (Doctor)
 */
router.put('/:id', authenticate, authorize('doctor'), logActivity('medical_record_update', 'medical_record'), async (req, res) => {
  try {
    const medicalRecord = await MedicalRecord.findById(req.params.id);

    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }

    // Check if doctor owns this record
    if (medicalRecord.doctor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update fields
    const updateData = req.body;
    delete updateData._id;
    delete updateData.patient;
    delete updateData.doctor;
    delete updateData.createdAt;

    Object.assign(medicalRecord, updateData);
    await medicalRecord.save();

    await medicalRecord.populate(['patient', 'doctor']);

    // Emit real-time notification to patient
    req.io.to(`user_${medicalRecord.patient._id}`).emit('medical_record_updated', {
      medicalRecord,
      message: `Medical record updated: ${medicalRecord.title}`
    });

    res.json({
      success: true,
      message: 'Medical record updated successfully',
      medicalRecord
    });
  } catch (error) {
    console.error('Error updating medical record:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating medical record'
    });
  }
});

/**
 * @route   DELETE /api/medical-records/:id
 * @desc    Delete medical record
 * @access  Private (Doctor/Admin)
 */
router.delete('/:id', authenticate, authorize('doctor', 'admin'), async (req, res) => {
  try {
    const medicalRecord = await MedicalRecord.findById(req.params.id);

    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }

    // Check permissions
    const hasAccess = 
      req.user.role === 'admin' ||
      medicalRecord.doctor.toString() === req.user._id.toString();

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await MedicalRecord.findByIdAndDelete(req.params.id);

    await ActivityLog.logActivity({
      user: req.user._id,
      action: 'medical_record_delete',
      resourceType: 'medical_record',
      resourceId: req.params.id,
      description: `Medical record deleted: ${medicalRecord.title}`,
      metadata: {
        patientId: medicalRecord.patient.toString(),
        recordType: medicalRecord.recordType
      }
    });

    res.json({
      success: true,
      message: 'Medical record deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting medical record:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting medical record'
    });
  }
});

/**
 * @route   GET /api/medical-records/patient/:patientId/summary
 * @desc    Get patient's medical summary
 * @access  Private (Doctor/Admin)
 */
router.get('/patient/:patientId/summary', authenticate, authorize('doctor', 'admin'), async (req, res) => {
  try {
    const patientId = req.params.patientId;

    // Verify patient exists
    const patient = await User.findOne({ _id: patientId, role: 'patient' })
      .select('firstName lastName bloodGroup dateOfBirth gender phone email');
      
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found'
      });
    }

    // Get medical records summary
    const totalRecords = await MedicalRecord.countDocuments({ patient: patientId });
    
    const recordsByType = await MedicalRecord.aggregate([
      { $match: { patient: mongoose.Types.ObjectId(patientId) } },
      { $group: { _id: '$recordType', count: { $sum: 1 } } }
    ]);

    // Recent records
    const recentRecords = await MedicalRecord.find({ patient: patientId })
      .populate('doctor', 'firstName lastName specialization')
      .sort({ date: -1 })
      .limit(5)
      .select('title recordType date description diagnosis');

    // Active diagnoses
    const activeDiagnoses = await MedicalRecord.find({
      patient: patientId,
      'diagnosis.status': 'active'
    })
      .select('diagnosis')
      .sort({ date: -1 })
      .limit(10);

    // Current prescriptions
    const currentPrescriptions = await MedicalRecord.find({
      patient: patientId,
      prescription: { $exists: true, $ne: [] }
    })
      .select('prescription date')
      .sort({ date: -1 })
      .limit(3);

    res.json({
      success: true,
      patient,
      summary: {
        totalRecords,
        recordsByType,
        recentRecords,
        activeDiagnoses: activeDiagnoses.flatMap(record => 
          record.diagnosis.filter(d => d.status === 'active')
        ),
        currentPrescriptions: currentPrescriptions.flatMap(record => record.prescription)
      }
    });
  } catch (error) {
    console.error('Error fetching patient summary:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching patient medical summary'
    });
  }
});

/**
 * @route   POST /api/medical-records/:id/share
 * @desc    Share medical record with another doctor
 * @access  Private (Patient/Doctor)
 */
router.post('/:id/share', authenticate, async (req, res) => {
  try {
    const { doctorId, permission = 'read' } = req.body;

    const medicalRecord = await MedicalRecord.findById(req.params.id);

    if (!medicalRecord) {
      return res.status(404).json({
        success: false,
        message: 'Medical record not found'
      });
    }

    // Check permissions
    const hasAccess = 
      req.user.role === 'admin' ||
      medicalRecord.patient.toString() === req.user._id.toString() ||
      medicalRecord.doctor.toString() === req.user._id.toString();

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Verify target doctor exists
    const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    // Check if already shared
    const existingShare = medicalRecord.sharedWith.find(
      share => share.user.toString() === doctorId
    );

    if (existingShare) {
      existingShare.permission = permission;
      existingShare.sharedAt = new Date();
    } else {
      medicalRecord.sharedWith.push({
        user: doctorId,
        permission,
        sharedAt: new Date()
      });
    }

    await medicalRecord.save();

    await ActivityLog.logActivity({
      user: req.user._id,
      action: 'medical_record_share',
      resourceType: 'medical_record',
      resourceId: medicalRecord._id.toString(),
      description: `Medical record shared with Dr. ${doctor.fullName}`,
      metadata: {
        sharedWith: doctorId,
        permission,
        recordTitle: medicalRecord.title
      }
    });

    // Emit notification to target doctor
    req.io.to(`doctor_${doctorId}`).emit('medical_record_shared', {
      medicalRecord,
      sharedBy: req.user.fullName,
      message: `Medical record shared with you: ${medicalRecord.title}`
    });

    res.json({
      success: true,
      message: 'Medical record shared successfully'
    });
  } catch (error) {
    console.error('Error sharing medical record:', error);
    res.status(500).json({
      success: false,
      message: 'Error sharing medical record'
    });
  }
});

export default router;
