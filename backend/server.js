import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/database.js';
import jwt from 'jsonwebtoken';
import User from './models/User.js';

// Route imports
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import appointmentRoutes from './routes/appointments.js';
import medicalRecordRoutes from './routes/medicalRecords.js';
import paymentRoutes from './routes/payments.js';
import meetingRoutes from './routes/meetings.js';
import notificationRoutes from './routes/notifications.js';
import logRoutes from './routes/logs.js';
import availabilityRoutes from './routes/availability.js';
import searchRoutes from './routes/search.js';
import seedRoutes from './routes/seed.js';
import diagnosticRoutes from './routes/diagnostics.js';

// Load environment variables
dotenv.config();

// Increase event listener limit
process.setMaxListeners(20);

const app = express();
const server = createServer(app);

// Define allowed origins for development and production
const allowedOrigins = [
  // Development origins
  'http://localhost:5173',  // Doctor portal
  'http://localhost:5174',  // Patient portal
  'http://localhost:5175',  // Admin portal
  
  // Production origins
  'https://doctor.app.com',
  'https://patient.app.com', 
  'https://admin.app.com',
  
  // Fallback origins (can be removed in production)
  process.env.FRONTEND_URL,
  "https://take-care-dev.netlify.app",
  "https://take-care.netlify.app"
].filter(Boolean); // Remove undefined values

// Socket.IO setup with CORS configuration
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  },
  transports: ['websocket', 'polling'],
  allowEIO3: true
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Make io available to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/diagnostics', diagnosticRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'TakeCare Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Socket.IO authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return next(new Error('Authentication token missing'));
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return next(new Error('User not found'));
    }

    if (!user.isActive) {
      return next(new Error('Account is deactivated'));
    }

    // Attach user info to socket
    socket.user = user;
    
    console.log(`🔌 Socket auth: ${user.email} (${user.role}) - Socket: ${socket.id}`);
    next();
  } catch (error) {
    console.error('Socket authentication error:', error.message);
    next(new Error('Authentication failed'));
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  const { user } = socket;
  console.log(`✅ User connected: ${user.email} (${user.role}) - Socket: ${socket.id}`);

  // Join role-based room
  const roleRoom = `role_${user.role}`;
  socket.join(roleRoom);
  console.log(`👥 User ${user.email} joined role room: ${roleRoom}`);

  // Join user-specific room for private messages
  const userRoom = `user_${user._id}`;
  socket.join(userRoom);
  console.log(`👤 User ${user.email} joined user room: ${userRoom}`);

  // Emit user online event to all users in the same role room
  socket.to(roleRoom).emit('user_online', {
    userId: user._id,
    email: user.email,
    role: user.role,
    timestamp: new Date().toISOString()
  });

  // Emit user online event to all connected clients (for admin monitoring)
  io.emit('user_status_change', {
    userId: user._id,
    email: user.email,
    role: user.role,
    status: 'online',
    timestamp: new Date().toISOString()
  });

  // Handle joining specific rooms
  socket.on('join_room', (roomName) => {
    // Validate room name format to prevent security issues
    if (typeof roomName === 'string' && roomName.startsWith('appointment_')) {
      socket.join(roomName);
      console.log(`📅 User ${user.email} joined appointment room: ${roomName}`);
    }
  });

  socket.on('leave_room', (roomName) => {
    socket.leave(roomName);
    console.log(`📤 User ${user.email} left room: ${roomName}`);
  });

  // Handle private messages
  socket.on('private_message', (data) => {
    const { recipientId, message } = data;
    
    if (recipientId && message) {
      const recipientRoom = `user_${recipientId}`;
      socket.to(recipientRoom).emit('private_message', {
        senderId: user._id,
        senderEmail: user.email,
        message,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Handle role-specific events
  if (user.role === 'doctor') {
    socket.on('doctor_availability_update', (data) => {
      // Emit to all patients
      socket.to('role_patient').emit('doctor_availability_updated', {
        doctorId: user._id,
        doctorName: user.name || user.email,
        ...data,
        timestamp: new Date().toISOString()
      });
    });
  }

  if (user.role === 'patient') {
    socket.on('appointment_request', (data) => {
      // Emit to all doctors
      socket.to('role_doctor').emit('new_appointment_request', {
        patientId: user._id,
        patientName: user.name || user.email,
        ...data,
        timestamp: new Date().toISOString()
      });
    });
  }

  if (user.role === 'admin') {
    socket.on('admin_broadcast', (data) => {
      // Admin can broadcast to all users
      io.emit('admin_broadcast', {
        adminId: user._id,
        adminName: user.name || user.email,
        ...data,
        timestamp: new Date().toISOString()
      });
    });
  }

  // Handle disconnection
  socket.on('disconnect', (reason) => {
    console.log(`❌ User disconnected: ${user.email} (${user.role}) - Socket: ${socket.id} - ${reason}`);

    // Emit user offline event to role room
    socket.to(roleRoom).emit('user_offline', {
      userId: user._id,
      email: user.email,
      role: user.role,
      timestamp: new Date().toISOString()
    });

    // Emit user offline event to all connected clients
    io.emit('user_status_change', {
      userId: user._id,
      email: user.email,
      role: user.role,
      status: 'offline',
      timestamp: new Date().toISOString()
    });
  });

  // Handle authentication errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
    if (error.message.includes('Authentication')) {
      socket.emit('auth_error', { message: error.message });
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 TakeCare Backend Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Allowed Origins: ${allowedOrigins.join(', ')}`);
  console.log(`💳 Payment Service: ${process.env.RAZORPAY_KEY_ID ? '✅ Enabled' : '⚠️ Disabled (add RAZORPAY_KEY_ID to enable)'}`);
});
