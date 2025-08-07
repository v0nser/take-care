import express from 'express';
import Appointment from '../models/Appointment.js';
import ActivityLog from '../models/ActivityLog.js';
import { authenticate, authorize, logActivity } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/meetings/create
 * @desc    Create Jitsi Meet link for appointment
 * @access  Private (Doctor/Admin)
 */
router.post('/create', authenticate, authorize('doctor', 'admin'), logActivity('meeting_create', 'meeting'), async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: 'Appointment ID is required'
      });
    }

    const appointment = await Appointment.findById(appointmentId)
      .populate('patient', 'firstName lastName email')
      .populate('doctor', 'firstName lastName');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check if doctor owns this appointment or is admin
    if (req.user.role === 'doctor' && appointment.doctor._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if appointment is confirmed
    if (appointment.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Meeting can only be created for confirmed appointments'
      });
    }

    // Generate unique meeting ID and link
    const meetingId = `takecare-${appointmentId}-${Date.now()}`;
    const meetingLink = `https://${process.env.JITSI_MEET_DOMAIN || 'meet.jit.si'}/${meetingId}`;

    // Update appointment with meeting details
    appointment.meetingId = meetingId;
    appointment.meetingLink = meetingLink;
    await appointment.save();

    // Emit real-time notification to patient
    req.io.to(`user_${appointment.patient._id}`).emit('meeting_created', {
      appointment,
      meetingLink,
      message: 'Video meeting link created for your appointment'
    });

    res.json({
      success: true,
      message: 'Meeting created successfully',
      meetingId,
      meetingLink,
      appointment: {
        id: appointment._id,
        date: appointment.appointmentDate,
        time: appointment.appointmentTime,
        patient: appointment.patient.fullName,
        doctor: appointment.doctor.fullName
      }
    });
  } catch (error) {
    console.error('Error creating meeting:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating meeting'
    });
  }
});

/**
 * @route   GET /api/meetings/appointment/:id
 * @desc    Get meeting details for appointment
 * @access  Private
 */
router.get('/appointment/:id', authenticate, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'firstName lastName')
      .populate('doctor', 'firstName lastName');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check access permissions
    const hasAccess = 
      req.user.role === 'admin' ||
      appointment.patient._id.toString() === req.user._id.toString() ||
      appointment.doctor._id.toString() === req.user._id.toString();

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (!appointment.meetingLink) {
      return res.status(404).json({
        success: false,
        message: 'No meeting link found for this appointment'
      });
    }

    res.json({
      success: true,
      meeting: {
        meetingId: appointment.meetingId,
        meetingLink: appointment.meetingLink,
        appointment: {
          id: appointment._id,
          date: appointment.appointmentDate,
          time: appointment.appointmentTime,
          status: appointment.status,
          patient: appointment.patient.fullName,
          doctor: appointment.doctor.fullName
        }
      }
    });
  } catch (error) {
    console.error('Error fetching meeting details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching meeting details'
    });
  }
});

/**
 * @route   POST /api/meetings/:id/join
 * @desc    Log meeting join event
 * @access  Private
 */
router.post('/:id/join', authenticate, logActivity('meeting_join', 'meeting'), async (req, res) => {
  try {
    const appointmentId = req.params.id;
    
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check access permissions
    const hasAccess = 
      req.user.role === 'admin' ||
      appointment.patient.toString() === req.user._id.toString() ||
      appointment.doctor.toString() === req.user._id.toString();

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update meeting started status
    if (!appointment.meetingStarted) {
      appointment.meetingStarted = true;
      await appointment.save();
    }

    // Emit notification to other party
    const otherPartyId = appointment.patient.toString() === req.user._id.toString()
      ? appointment.doctor
      : appointment.patient;

    req.io.to(`user_${otherPartyId}`).emit('user_joined_meeting', {
      appointmentId,
      userRole: req.user.role,
      userName: req.user.fullName,
      message: `${req.user.fullName} has joined the meeting`
    });

    res.json({
      success: true,
      message: 'Meeting join logged successfully',
      meetingLink: appointment.meetingLink
    });
  } catch (error) {
    console.error('Error logging meeting join:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging meeting join'
    });
  }
});

/**
 * @route   POST /api/meetings/:id/end
 * @desc    End meeting and log duration
 * @access  Private
 */
router.post('/:id/end', authenticate, logActivity('meeting_end', 'meeting'), async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const { duration } = req.body; // duration in minutes
    
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    // Check access permissions
    const hasAccess = 
      req.user.role === 'admin' ||
      appointment.patient.toString() === req.user._id.toString() ||
      appointment.doctor.toString() === req.user._id.toString();

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update appointment with meeting end details
    appointment.meetingEndTime = new Date();
    if (duration) {
      appointment.duration = duration;
    }
    await appointment.save();

    await ActivityLog.logActivity({
      user: req.user._id,
      action: 'meeting_end',
      resourceType: 'meeting',
      resourceId: appointmentId,
      description: `Meeting ended for appointment`,
      metadata: {
        duration: duration || 'unknown',
        endedBy: req.user.fullName,
        appointmentId
      }
    });

    // Emit notification to other party
    const otherPartyId = appointment.patient.toString() === req.user._id.toString()
      ? appointment.doctor
      : appointment.patient;

    req.io.to(`user_${otherPartyId}`).emit('meeting_ended', {
      appointmentId,
      endedBy: req.user.fullName,
      message: `Meeting has been ended by ${req.user.fullName}`
    });

    res.json({
      success: true,
      message: 'Meeting ended successfully'
    });
  } catch (error) {
    console.error('Error ending meeting:', error);
    res.status(500).json({
      success: false,
      message: 'Error ending meeting'
    });
  }
});

/**
 * @route   GET /api/meetings/config
 * @desc    Get Jitsi Meet configuration
 * @access  Private
 */
router.get('/config', authenticate, (req, res) => {
  res.json({
    success: true,
    config: {
      domain: process.env.JITSI_MEET_DOMAIN || 'meet.jit.si',
      appId: process.env.JITSI_APP_ID || null,
      // Default Jitsi Meet configuration options
      options: {
        width: '100%',
        height: '600px',
        parentNode: null, // Will be set by frontend
        configOverwrite: {
          startWithAudioMuted: true,
          startWithVideoMuted: false,
          enableWelcomePage: false,
          prejoinPageEnabled: false,
          disableModeratorIndicator: true,
          disableShortcuts: true,
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop',
            'fullscreen', 'fodeviceselection', 'hangup',
            'profile', 'info', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'settings',
            'raisehand', 'videoquality', 'filmstrip',
            'feedback', 'stats', 'shortcuts', 'tileview', 'videobackgroundblur',
            'download', 'help', 'mute-everyone', 'security'
          ],
          SETTINGS_SECTIONS: ['devices', 'language', 'moderator', 'profile', 'calendar'],
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_BRAND_WATERMARK: false,
          BRAND_WATERMARK_LINK: "",
          SHOW_POWERED_BY: false,
          DISABLE_VIDEO_BACKGROUND: false,
          DISABLE_BLUR: false
        }
      }
    }
  });
});

/**
 * @route   GET /api/meetings/active
 * @desc    Get active meetings for user
 * @access  Private
 */
router.get('/active', authenticate, async (req, res) => {
  try {
    let query = {
      meetingStarted: true,
      meetingEndTime: null,
      status: 'confirmed'
    };

    // Filter by user role
    if (req.user.role === 'patient') {
      query.patient = req.user._id;
    } else if (req.user.role === 'doctor') {
      query.doctor = req.user._id;
    }

    const activeMeetings = await Appointment.find(query)
      .populate('patient', 'firstName lastName profileImage')
      .populate('doctor', 'firstName lastName specialization profileImage')
      .select('meetingId meetingLink appointmentDate appointmentTime meetingStarted patient doctor')
      .sort({ appointmentDate: -1 });

    res.json({
      success: true,
      activeMeetings
    });
  } catch (error) {
    console.error('Error fetching active meetings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching active meetings'
    });
  }
});

/**
 * @route   GET /api/meetings/history
 * @desc    Get meeting history for user
 * @access  Private
 */
router.get('/history', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    let query = {
      meetingStarted: true,
      meetingEndTime: { $ne: null }
    };

    // Filter by user role
    if (req.user.role === 'patient') {
      query.patient = req.user._id;
    } else if (req.user.role === 'doctor') {
      query.doctor = req.user._id;
    }

    const meetingHistory = await Appointment.find(query)
      .populate('patient', 'firstName lastName profileImage')
      .populate('doctor', 'firstName lastName specialization profileImage')
      .select('meetingId appointmentDate appointmentTime duration meetingEndTime patient doctor reason')
      .sort({ meetingEndTime: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments(query);

    res.json({
      success: true,
      meetingHistory,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching meeting history:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching meeting history'
    });
  }
});

export default router;
