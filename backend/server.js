import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/database.js';
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
import jwt from 'jsonwebtoken';
import User from './models/User.js';

// Load environment variables
dotenv.config();

// Increase event listener limit
process.setMaxListeners(20);

const app = express();
const server = createServer(app);

// Define allowed origins
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "http://localhost:5174",
  "https://take-care-dev.netlify.app",
  "https://take-care.netlify.app",
  "https://take-care.netlify.app"
];

// Socket.IO setup for real-time notifications
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }
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

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'TakeCare Backend API is running',
    timestamp: new Date().toISOString()
  });
});

// Socket.IO connection handling with authentication
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    const instanceId = socket.handshake.auth.instanceId || 'default';
    const port = socket.handshake.auth.port || 'unknown';
    
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

    // Attach user and instance info to socket
    socket.user = user;
    socket.instanceId = instanceId;
    socket.port = port;
    
    console.log(`🔌 Socket auth: ${user.email} (${user.role}) - Instance: ${instanceId}, Port: ${port}`);
    next();
  } catch (error) {
    console.error('Socket authentication error:', error.message);
    next(new Error('Authentication failed'));
  }
});

io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.user.email} (${socket.user.role}) - Instance: ${socket.instanceId}, Port: ${socket.port}, Socket: ${socket.id}`);

  // Create instance-specific room names to avoid conflicts
  const userRoom = `user_${socket.user._id}_${socket.instanceId}`;
  const doctorRoom = `doctor_${socket.user._id}_${socket.instanceId}`;
  
  // Automatically join user to their instance-specific room
  socket.join(userRoom);
  console.log(`User ${socket.user._id} joined instance room: ${userRoom}`);

  // Join role-specific room for doctors (instance-specific)
  if (socket.user.role === 'doctor') {
    socket.join(doctorRoom);
    console.log(`Doctor ${socket.user._id} joined instance doctor room: ${doctorRoom}`);
  }

  socket.on('join_user_room', (userId) => {
    // Verify user can only join their own room
    if (userId === socket.user._id.toString()) {
      const userRoom = `user_${userId}_${socket.instanceId}`;
      socket.join(userRoom);
      console.log(`User ${userId} joined instance room: ${userRoom}`);
    } else {
      console.warn(`User ${socket.user._id} tried to join room for user ${userId}`);
    }
  });

  socket.on('join_doctor_room', (doctorId) => {
    // Verify user is a doctor and can only join their own room
    if (socket.user.role === 'doctor' && doctorId === socket.user._id.toString()) {
      const doctorRoom = `doctor_${doctorId}_${socket.instanceId}`;
      socket.join(doctorRoom);
      console.log(`Doctor ${doctorId} joined instance doctor room: ${doctorRoom}`);
    } else {
      console.warn(`User ${socket.user._id} (${socket.user.role}) tried to join doctor room ${doctorId}`);
    }
  });

  socket.on('disconnect', (reason) => {
    console.log(`❌ User disconnected: ${socket.user.email} (${socket.user.role}) - Instance: ${socket.instanceId}, Port: ${socket.port}, Socket: ${socket.id} - ${reason}`);
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
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`💳 Payment Service: ${process.env.RAZORPAY_KEY_ID ? '✅ Enabled' : '⚠️ Disabled (add RAZORPAY_KEY_ID to enable)'}`);
});
