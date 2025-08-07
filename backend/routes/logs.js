import express from 'express';
import ActivityLog from '../models/ActivityLog.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/logs
 * @desc    Get activity logs
 * @access  Private (Admin)
 */
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      action, 
      status, 
      userId, 
      resourceType,
      startDate,
      endDate 
    } = req.query;

    let query = {};

    // Filters
    if (action) query.action = action;
    if (status) query.status = status;
    if (userId) query.user = userId;
    if (resourceType) query.resourceType = resourceType;

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const logs = await ActivityLog.find(query)
      .populate('user', 'firstName lastName email role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await ActivityLog.countDocuments(query);

    res.json({
      success: true,
      logs,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activity logs'
    });
  }
});

/**
 * @route   GET /api/logs/my
 * @desc    Get current user's activity logs
 * @access  Private
 */
router.get('/my', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 50, action } = req.query;

    let query = { user: req.user._id };
    if (action) query.action = action;

    const logs = await ActivityLog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await ActivityLog.countDocuments(query);

    res.json({
      success: true,
      logs,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching user activity logs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching your activity logs'
    });
  }
});

/**
 * @route   GET /api/logs/stats
 * @desc    Get activity statistics
 * @access  Private (Admin)
 */
router.get('/stats', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { timeframe = '7d' } = req.query;
    
    // Calculate date range
    const now = new Date();
    const startDate = new Date();
    
    switch (timeframe) {
      case '1d':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    const timeQuery = { createdAt: { $gte: startDate } };

    // Total activities
    const totalActivities = await ActivityLog.countDocuments(timeQuery);
    
    // Activities by status
    const statusStats = await ActivityLog.aggregate([
      { $match: timeQuery },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Activities by action
    const actionStats = await ActivityLog.aggregate([
      { $match: timeQuery },
      { $group: { _id: '$action', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Activities by resource type
    const resourceStats = await ActivityLog.aggregate([
      { $match: timeQuery },
      { $group: { _id: '$resourceType', count: { $sum: 1 } } }
    ]);

    // Most active users
    const userStats = await ActivityLog.aggregate([
      { $match: timeQuery },
      { $group: { _id: '$user', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          count: 1,
          'user.firstName': 1,
          'user.lastName': 1,
          'user.email': 1,
          'user.role': 1
        }
      }
    ]);

    // Daily activity trend
    const dailyTrend = await ActivityLog.aggregate([
      { $match: timeQuery },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    res.json({
      success: true,
      stats: {
        timeframe,
        period: {
          start: startDate,
          end: now
        },
        totalActivities,
        statusStats,
        actionStats,
        resourceStats,
        userStats,
        dailyTrend
      }
    });
  } catch (error) {
    console.error('Error fetching activity statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching activity statistics'
    });
  }
});

/**
 * @route   GET /api/logs/actions
 * @desc    Get available log actions
 * @access  Private (Admin)
 */
router.get('/actions', authenticate, authorize('admin'), async (req, res) => {
  try {
    const actions = await ActivityLog.distinct('action');
    
    res.json({
      success: true,
      actions: actions.sort()
    });
  } catch (error) {
    console.error('Error fetching log actions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching log actions'
    });
  }
});

/**
 * @route   GET /api/logs/resources
 * @desc    Get available resource types
 * @access  Private (Admin)
 */
router.get('/resources', authenticate, authorize('admin'), async (req, res) => {
  try {
    const resourceTypes = await ActivityLog.distinct('resourceType');
    
    res.json({
      success: true,
      resourceTypes: resourceTypes.sort()
    });
  } catch (error) {
    console.error('Error fetching resource types:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching resource types'
    });
  }
});

/**
 * @route   DELETE /api/logs/cleanup
 * @desc    Clean up old logs (Admin only)
 * @access  Private (Admin)
 */
router.delete('/cleanup', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { olderThan = '90d' } = req.query;
    
    // Calculate cutoff date
    const cutoffDate = new Date();
    const days = parseInt(olderThan.replace('d', ''));
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const result = await ActivityLog.deleteMany({
      createdAt: { $lt: cutoffDate }
    });

    await ActivityLog.logActivity({
      user: req.user._id,
      action: 'logs_cleanup',
      resourceType: 'system',
      description: `Cleaned up ${result.deletedCount} old activity logs`,
      metadata: {
        deletedCount: result.deletedCount,
        cutoffDate: cutoffDate.toISOString()
      }
    });

    res.json({
      success: true,
      message: `Cleaned up ${result.deletedCount} old activity logs`,
      deletedCount: result.deletedCount,
      cutoffDate
    });
  } catch (error) {
    console.error('Error cleaning up logs:', error);
    res.status(500).json({
      success: false,
      message: 'Error cleaning up logs'
    });
  }
});

export default router;
