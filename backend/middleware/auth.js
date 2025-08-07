import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';

// Generate JWT token
export const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Generate refresh token
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '30d' }
  );
};

// Middleware to authenticate user using JWT
export const authenticate = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from database
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Token is invalid - user not found.'
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated. Please contact support.'
        });
      }

      if (user.isLocked) {
        return res.status(401).json({
          success: false,
          message: 'Account is temporarily locked due to multiple failed login attempts.'
        });
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token has expired.'
        });
      } else if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Token is invalid.'
        });
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during authentication.'
    });
  }
};

// Middleware to authorize based on roles
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      // Log unauthorized access attempt
      ActivityLog.logActivity({
        user: req.user._id,
        action: 'unauthorized_access',
        resourceType: 'system',
        description: `Unauthorized access attempt to ${req.originalUrl}`,
        status: 'warning',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        metadata: {
          requiredRoles: allowedRoles,
          userRole: req.user.role,
          url: req.originalUrl,
          method: req.method
        }
      });

      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

// Middleware to check if user is active
export const checkActiveUser = (req, res, next) => {
  if (!req.user.isActive) {
    return res.status(403).json({
      success: false,
      message: 'Account is deactivated. Please contact support.'
    });
  }
  next();
};

// Middleware to log API activity
export const logActivity = (action, resourceType) => {
  return async (req, res, next) => {
    const startTime = Date.now();
    
    // Store original json method
    const originalJson = res.json;
    
    // Override res.json to log after response
    res.json = function(data) {
      const duration = Date.now() - startTime;
      const status = res.statusCode >= 400 ? 'failure' : 'success';
      
      // Log activity (don't await to avoid blocking response)
      ActivityLog.logActivity({
        user: req.user?._id,
        action,
        resourceType,
        resourceId: req.params.id || req.body.id || null,
        description: `${req.method} ${req.originalUrl}`,
        status,
        duration,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        metadata: {
          method: req.method,
          url: req.originalUrl,
          params: req.params,
          query: req.query,
          statusCode: res.statusCode
        }
      }).catch(error => {
        console.error('Error logging activity:', error);
      });
      
      // Call original json method
      return originalJson.call(this, data);
    };
    
    next();
  };
};

// Optional middleware - only authenticate if token is provided
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(); // Continue without authentication
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from database
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.isActive && !user.isLocked) {
        req.user = user;
      }
    } catch (error) {
      // Ignore token errors for optional auth
    }

    next();
  } catch (error) {
    console.error('Optional authentication error:', error);
    next(); // Continue without authentication on error
  }
};

export default { authenticate, authorize, checkActiveUser, logActivity, optionalAuth };
