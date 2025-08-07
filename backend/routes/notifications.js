import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/notifications
 * @desc    Get user's notifications
 * @access  Private
 */
router.get('/', authenticate, async (req, res) => {
  try {
    // For this implementation, we'll return a simple response
    // In a production app, you might want to store notifications in the database
    res.json({
      success: true,
      message: 'Notifications are handled via real-time Socket.IO events',
      instructions: {
        realTimeEvents: [
          'new_appointment',
          'appointment_update',
          'appointment_cancelled',
          'appointment_completed',
          'payment_success',
          'meeting_created',
          'meeting_ended',
          'new_medical_record',
          'medical_record_updated',
          'medical_record_shared'
        ],
        usage: 'Connect to Socket.IO and listen for these events in your frontend'
      }
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications'
    });
  }
});

/**
 * @route   POST /api/notifications/test
 * @desc    Send a test notification (for development)
 * @access  Private
 */
router.post('/test', authenticate, (req, res) => {
  try {
    const { message, type = 'info' } = req.body;

    // Emit test notification
    req.io.to(`user_${req.user._id}`).emit('test_notification', {
      message: message || 'This is a test notification',
      type,
      timestamp: new Date().toISOString(),
      user: req.user.fullName
    });

    res.json({
      success: true,
      message: 'Test notification sent successfully'
    });
  } catch (error) {
    console.error('Error sending test notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending test notification'
    });
  }
});

/**
 * @route   POST /api/notifications/broadcast
 * @desc    Send broadcast notification (Admin only)
 * @access  Private (Admin)
 */
router.post('/broadcast', authenticate, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can send broadcast notifications'
      });
    }

    const { message, type = 'info', targetRole } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Emit broadcast notification
    const eventName = targetRole ? `broadcast_${targetRole}` : 'broadcast_all';
    
    req.io.emit(eventName, {
      message,
      type,
      timestamp: new Date().toISOString(),
      from: 'TakeCare Admin'
    });

    res.json({
      success: true,
      message: 'Broadcast notification sent successfully',
      sentTo: targetRole || 'all users'
    });
  } catch (error) {
    console.error('Error sending broadcast notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending broadcast notification'
    });
  }
});

export default router;
