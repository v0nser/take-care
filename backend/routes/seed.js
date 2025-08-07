import express from 'express';
import seedData from '../utils/seedData.js';

const router = express.Router();

/**
 * @route   POST /api/seed/database
 * @desc    Seed database with sample data (Development only)
 * @access  Public (Development only)
 */
router.post('/database', async (req, res) => {
  // Only allow in development environment
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      success: false,
      message: 'Database seeding is not allowed in production'
    });
  }

  try {
    await seedData();
    
    res.json({
      success: true,
      message: 'Database seeded successfully with sample data',
      data: {
        doctors: 6,
        patients: 3,
        admin: 1,
        appointments: 3,
        availability: 6
      },
      credentials: {
        admin: {
          email: 'admin@takecare.com',
          password: 'admin123'
        },
        sampleDoctor: {
          email: 'dr.sarah.wilson@takecare.com',
          password: 'password123'
        },
        samplePatient: {
          email: 'john.doe@email.com',
          password: 'password123'
        }
      }
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to seed database',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/seed/status
 * @desc    Check if database has sample data
 * @access  Public
 */
router.get('/status', async (req, res) => {
  try {
    // Dynamic imports to avoid circular dependencies
    const { default: User } = await import('../models/User.js');
    const { default: DoctorAvailability } = await import('../models/DoctorAvailability.js');
    const { default: Appointment } = await import('../models/Appointment.js');

    const userCount = await User.countDocuments();
    const doctorCount = await User.countDocuments({ role: 'doctor' });
    const patientCount = await User.countDocuments({ role: 'patient' });
    const availabilityCount = await DoctorAvailability.countDocuments();
    const appointmentCount = await Appointment.countDocuments();

    const isSeeded = userCount > 0 && doctorCount > 0 && availabilityCount > 0;

    res.json({
      success: true,
      isSeeded,
      counts: {
        totalUsers: userCount,
        doctors: doctorCount,
        patients: patientCount,
        availability: availabilityCount,
        appointments: appointmentCount
      }
    });
  } catch (error) {
    console.error('Error checking seed status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check seed status',
      error: error.message
    });
  }
});

export default router; 