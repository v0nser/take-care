import express from 'express'
import { authenticate } from '../middleware/auth.js'
import Notification from '../models/Notification.js'

const router = express.Router()

/**
 * GET /api/notifications
 * Return user's notifications
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const list = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()

    res.json({ success: true, notifications: list })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    res.status(500).json({ success: false, message: 'Error fetching notifications' })
  }
})

/**
 * POST /api/notifications/read
 * Mark one notification as read
 * body: { id }
 */
router.post('/read', authenticate, async (req, res) => {
  try {
    const { id } = req.body
    if (!id) return res.status(400).json({ success: false, message: 'id required' })

    await Notification.updateOne({ _id: id, userId: req.user._id }, { $set: { readAt: new Date() } })
    res.json({ success: true })
  } catch (error) {
    console.error('Error marking read:', error)
    res.status(500).json({ success: false, message: 'Error marking notification read' })
  }
})

/**
 * POST /api/notifications/test
 * Send a test notification (and store it)
 */
router.post('/test', authenticate, async (req, res) => {
  try {
    const { message, type = 'info', title = 'Test notification' } = req.body

    // Store
    const doc = await Notification.create({
      userId: req.user._id,
      type,
      title,
      message: message || 'This is a test notification',
      meta: { user: req.user.fullName },
    })

    // Emit to this user
    req.io.to(`user_${req.user._id}`).emit('notification', {
      _id: doc._id,
      type,
      title: doc.title,
      message: doc.message,
      createdAt: doc.createdAt,
      readAt: doc.readAt || null,
    })

    res.json({ success: true, message: 'Test notification sent successfully' })
  } catch (error) {
    console.error('Error sending test notification:', error)
    res.status(500).json({ success: false, message: 'Error sending test notification' })
  }
})

/**
 * POST /api/notifications/broadcast
 * Admin broadcast (optionally store per-user if you want strict persistence)
 */
router.post('/broadcast', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Only admins can send broadcast notifications' })
    }

    const { message, type = 'info', targetRole, title = 'Announcement' } = req.body
    if (!message) return res.status(400).json({ success: false, message: 'Message is required' })

    const eventName = targetRole ? `broadcast_${targetRole}` : 'broadcast_all'
    req.io.emit(eventName, {
      type,
      title,
      message,
      from: 'TakeCare Admin',
      timestamp: new Date().toISOString(),
    })

    // Optional: persist broadcasts per user (loop users & insert docs) if you want them in history
    res.json({ success: true, message: 'Broadcast notification sent successfully', sentTo: targetRole || 'all users' })
  } catch (error) {
    console.error('Error sending broadcast notification:', error)
    res.status(500).json({ success: false, message: 'Error sending broadcast notification' })
  }
})

export default router
