import express from 'express';
import crypto from 'crypto';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import { authenticate, authorize, generateToken, generateRefreshToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
  const { email, password, firstName, lastName, role } = req.body;

  try {
    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: email, password, firstName, lastName'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      role: role || 'patient' // Default to patient if no role provided
    });

    await user.save();

    // Log registration activity
    await ActivityLog.logActivity({
      user: user._id,
      action: 'register',
      resourceType: 'user',
      resourceId: user._id.toString(),
      description: `New user registered: ${user.fullName}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        },
        token,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during registration'
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({
        success: false,
        message: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.'
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      // Increment login attempts
      await user.incLoginAttempts();
      
      await ActivityLog.logActivity({
        user: user._id,
        action: 'failed_login',
        resourceType: 'user',
        resourceId: user._id.toString(),
        description: `Failed login attempt for: ${user.email}`,
        status: 'warning',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Log successful login
    await ActivityLog.logActivity({
      user: user._id,
      action: 'login',
      resourceType: 'user',
      resourceId: user._id.toString(),
      description: `User logged in: ${user.fullName}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          lastLogin: user.lastLogin
        },
        token,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during login'
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user profile
 * @access  Private
 */
router.get('/me', authenticate, (req, res) => {
  res.json({
    success: true,
    data: {
      user: {
        id: req.user._id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        fullName: req.user.fullName,
        role: req.user.role,
        isEmailVerified: req.user.isEmailVerified,
        lastLogin: req.user.lastLogin,
        profileImage: req.user.profileImage,
        phone: req.user.phone,
        dateOfBirth: req.user.dateOfBirth,
        gender: req.user.gender,
        address: req.user.address
      }
    }
  });
});

/**
 * @route   PUT /api/auth/role
 * @desc    Update user role (Admin only or self-assignment for new users)
 * @access  Private
 */
router.put('/role', authenticate, async (req, res) => {
  const { role } = req.body;

  if (!role) {
    return res.status(400).json({
      success: false,
      message: 'Role is required'
    });
  }
  
  if (!['patient', 'doctor', 'admin'].includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role specified.'
    });
  }

  try {
    // Allow users without a role to set their own role (for initial setup)
    // Or allow admins to change any user's role
    if (req.user.role && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only administrators can change user roles'
      });
    }

    // Update user role
    req.user.role = role;
    await req.user.save();
    
    await ActivityLog.logActivity({
      user: req.user._id,
      action: 'role_change',
      resourceType: 'user',
      resourceId: req.user._id.toString(),
      description: `User role changed to ${role}`,
      metadata: { newRole: role }
    });

    res.json({
      success: true,
      message: 'Role updated successfully',
      data: {
        user: {
          id: req.user._id,
          email: req.user.email,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          fullName: req.user.fullName,
          role: req.user.role
        }
      }
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update role'
    });
  }
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticate, async (req, res) => {
  const { firstName, lastName, phone, address, dateOfBirth, bio } = req.body;

  try {
    // Validation
    if (!firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'First name and last name are required'
      });
    }

    // Update user profile
    const updatedData = {
      firstName,
      lastName,
    };

    // Add optional fields only if provided
    if (phone !== undefined) updatedData.phone = phone;
    if (address !== undefined) updatedData.address = address;
    if (dateOfBirth !== undefined) updatedData.dateOfBirth = dateOfBirth;
    if (bio !== undefined) updatedData.bio = bio;

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updatedData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Log activity
    await ActivityLog.logActivity({
      user: req.user._id,
      action: 'profile_update',
      resourceType: 'user',
      resourceId: req.user._id.toString(),
      description: 'User profile updated',
      metadata: { updatedFields: Object.keys(updatedData) }
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while updating the profile'
    });
  }
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post('/logout', authenticate, async (req, res) => {
  try {
    // Log logout activity
    await ActivityLog.logActivity({
      user: req.user._id,
      action: 'logout',
      resourceType: 'user',
      resourceId: req.user._id.toString(),
      description: `User logged out: ${req.user.fullName}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Error during logout'
    });
  }
});

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      // Don't reveal if email exists or not
      return res.json({
        success: true,
        message: 'If an account with this email exists, you will receive a password reset link'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // TODO: Send email with reset link
    // For now, just log the token (in production, send via email)
    console.log('Password reset token for', email, ':', resetToken);

    await ActivityLog.logActivity({
      user: user._id,
      action: 'password_reset_request',
      resourceType: 'user',
      resourceId: user._id.toString(),
      description: `Password reset requested for: ${user.email}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'If an account with this email exists, you will receive a password reset link'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password using token
 * @access  Public
 */
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  try {
    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Password reset token is invalid or has expired'
      });
    }

    // Update password
    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    await ActivityLog.logActivity({
      user: user._id,
      action: 'password_reset',
      resourceType: 'user',
      resourceId: user._id.toString(),
      description: `Password reset completed for: ${user.email}`,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    res.json({
      success: true,
      message: 'Password reset successful'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

export default router;
