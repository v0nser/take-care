import express from 'express';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import { authenticate, authorize, logActivity } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   GET /api/users/profile
 * @desc    Get current user's complete profile
 * @access  Private
 */
router.get('/profile', authenticate, logActivity('profile_view', 'user'), (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

/**
 * @route   PUT /api/users/profile
 * @desc    Update current user's profile
 * @access  Private
 */
router.put('/profile', authenticate, logActivity('profile_update', 'user'), async (req, res) => {
  try {
    const updateData = req.body;
    
    // Remove fields that shouldn't be updated this way
    // Remove sensitive fields from update
    delete updateData.password;
    delete updateData.role;
    delete updateData._id;
    delete updateData.__v;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating profile'
    });
  }
});

/**
 * @route   GET /api/users/doctors
 * @desc    Get all doctors for appointment booking
 * @access  Private (Patient)
 */
router.get('/doctors', authenticate, authorize('patient', 'admin'), async (req, res) => {
  try {
    const { specialization, page = 1, limit = 10 } = req.query;
    
    const query = { role: 'doctor', isActive: true };
    if (specialization) {
      query.specialization = { $regex: specialization, $options: 'i' };
    }

    const doctors = await User.find(query)
      .select('firstName lastName specialization qualifications experience consultationFee profileImage availability')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ experience: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      doctors,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctors'
    });
  }
});

/**
 * @route   GET /api/users/doctor/:id
 * @desc    Get specific doctor details
 * @access  Private
 */
router.get('/doctor/:id', authenticate, async (req, res) => {
  try {
    const doctor = await User.findOne({
      _id: req.params.id,
      role: 'doctor',
      isActive: true
    }).select('-password -lastLogin');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found'
      });
    }

    res.json({
      success: true,
      doctor
    });
  } catch (error) {
    console.error('Error fetching doctor:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching doctor details'
    });
  }
});

/**
 * @route   GET /api/users/all
 * @desc    Get all users (Admin only)
 * @access  Private (Admin)
 */
router.get('/all', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;
    
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

/**
 * @route   PUT /api/users/:id/toggle-status
 * @desc    Toggle user active status (Admin only)
 * @access  Private (Admin)
 */
router.put('/:id/toggle-status', authenticate, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    await ActivityLog.logActivity({
      user: req.user._id,
      action: user.isActive ? 'user_activate' : 'user_deactivate',
      resourceType: 'user',
      resourceId: user._id.toString(),
      description: `User ${user.fullName} ${user.isActive ? 'activated' : 'deactivated'}`,
      metadata: { targetUser: user.fullName, newStatus: user.isActive }
    });

    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user status'
    });
  }
});

/**
 * @route   GET /api/users/stats
 * @desc    Get user statistics (Admin only)
 * @access  Private (Admin)
 */
router.get('/stats', authenticate, authorize('admin'), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const patientCount = await User.countDocuments({ role: 'patient' });
    const doctorCount = await User.countDocuments({ role: 'doctor' });
    const adminCount = await User.countDocuments({ role: 'admin' });

    // Recent registrations (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentRegistrations = await User.countDocuments({
      createdAt: { $gte: weekAgo }
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        patientCount,
        doctorCount,
        adminCount,
        recentRegistrations
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics'
    });
  }
});

export default router;
