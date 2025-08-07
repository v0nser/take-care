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
import seedRoutes from './routes/seed.js';
import jwt from 'jsonwebtoken';
import User from './models/User.js';

// Load environment variables
dotenv.config();

// Increase event listener limit
process.setMaxListeners(20);

const app = express();
const server = createServer(app);

// Socket.IO setup for real-time notifications
const io = new Server(server, {
  cors: {
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "https://take-care-dev.netlify.app",
      "https://take-care.netlify.app"
    ],
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "https://take-care-dev.netlify.app",
    "https://take-care.netlify.app"
  ],
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

    // Attach user to socket
    socket.user = user;
    next();
  } catch (error) {
    console.error('Socket authentication error:', error.message);
    next(new Error('Authentication failed'));
  }
});

io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.user.email} (${socket.id})`);

  // Automatically join user to their room
  socket.join(`user_${socket.user._id}`);
  console.log(`User ${socket.user._id} joined their room`);

  // Join role-specific room for doctors
  if (socket.user.role === 'doctor') {
    socket.join(`doctor_${socket.user._id}`);
    console.log(`Doctor ${socket.user._id} joined doctor room`);
  }

  socket.on('join_user_room', (userId) => {
    // Verify user can only join their own room
    if (userId === socket.user._id.toString()) {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined their room`);
    } else {
      console.warn(`User ${socket.user._id} tried to join room for user ${userId}`);
    }
  });

  socket.on('join_doctor_room', (doctorId) => {
    // Verify user is a doctor and can only join their own room
    if (socket.user.role === 'doctor' && doctorId === socket.user._id.toString()) {
      socket.join(`doctor_${doctorId}`);
      console.log(`Doctor ${doctorId} joined their room`);
    } else {
      console.warn(`User ${socket.user._id} (${socket.user.role}) tried to join doctor room ${doctorId}`);
    }
  });

  socket.on('disconnect', (reason) => {
    console.log(`❌ User disconnected: ${socket.user.email} (${socket.id}) - ${reason}`);
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
