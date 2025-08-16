import express from 'express';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import MedicalRecord from '../models/MedicalRecord.js';
import Payment from '../models/Payment.js';
import ActivityLog from '../models/ActivityLog.js';
import DoctorAvailability from '../models/DoctorAvailability.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Unified search endpoint
router.get('/', authenticate, async (req, res) => {
  try {
    const { query, type, role, page = 1, limit = 20 } = req.query;
    const userRole = req.user.role;
    const userId = req.user.id;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const searchQuery = query.trim();
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const results = {
      users: [],
      appointments: [],
      medicalRecords: [],
      payments: [],
      activityLogs: [],
      totalResults: 0,
      hasMore: false
    };

    // Search Users (with role-based restrictions)
    if (!type || type === 'users' || type === 'all') {
      let userSearchQuery = {
        $or: [
          { firstName: { $regex: searchQuery, $options: 'i' } },
          { lastName: { $regex: searchQuery, $options: 'i' } },
          { email: { $regex: searchQuery, $options: 'i' } },
          { specialization: { $regex: searchQuery, $options: 'i' } },
          { phone: { $regex: searchQuery, $options: 'i' } }
        ]
      };

      // Role-based restrictions
      if (userRole === 'patient') {
        userSearchQuery.role = 'doctor';
      } else if (userRole === 'doctor') {
        userSearchQuery.role = { $in: ['patient', 'doctor'] };
      }
      // Admins can search all users

      const users = await User.find(userSearchQuery)
        .select('firstName lastName email role specialization phone profileImage')
        .limit(parseInt(limit))
        .skip(skip)
        .lean();

      results.users = users.map(user => ({
        ...user,
        type: 'user',
        displayName: `${user.firstName} ${user.lastName}`,
        subtitle: user.role === 'doctor' ? user.specialization : user.role,
        href: `/dashboard/users/${user._id}`
      }));
    }

    // Search Appointments (with role-based restrictions)
    if (!type || type === 'appointments' || type === 'all') {
      let appointmentSearchQuery = {
        $or: [
          { reason: { $regex: searchQuery, $options: 'i' } },
          { symptoms: { $regex: searchQuery, $options: 'i' } },
          { notes: { $regex: searchQuery, $options: 'i' } },
          { diagnosis: { $regex: searchQuery, $options: 'i' } },
          { type: { $regex: searchQuery, $options: 'i' } },
          { consultationType: { $regex: searchQuery, $options: 'i' } }
        ]
      };

      // Role-based restrictions
      if (userRole === 'patient') {
        appointmentSearchQuery.patient = userId;
      } else if (userRole === 'doctor') {
        appointmentSearchQuery.doctor = userId;
      }
      // Admins can search all appointments

      const appointments = await Appointment.find(appointmentSearchQuery)
        .populate('patient', 'firstName lastName email')
        .populate('doctor', 'firstName lastName email specialization')
        .limit(parseInt(limit))
        .skip(skip)
        .lean();

      results.appointments = appointments.map(appointment => ({
        ...appointment,
        type: 'appointment',
        displayName: `Appointment - ${appointment.patient?.firstName} ${appointment.patient?.lastName}`,
        subtitle: `${appointment.type} - ${appointment.reason}`,
        href: `/dashboard/appointments/${appointment._id}`,
        date: appointment.appointmentDate
      }));
    }

    // Search Medical Records (with role-based restrictions)
    if (!type || type === 'medicalRecords' || type === 'all') {
      let recordSearchQuery = {
        $or: [
          { title: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
          { 'diagnosis.condition': { $regex: searchQuery, $options: 'i' } },
          { 'symptoms.symptom': { $regex: searchQuery, $options: 'i' } },
          { 'prescription.medicine': { $regex: searchQuery, $options: 'i' } },
          { recordType: { $regex: searchQuery, $options: 'i' } }
        ]
      };

      // Role-based restrictions
      if (userRole === 'patient') {
        recordSearchQuery.patient = userId;
      } else if (userRole === 'doctor') {
        recordSearchQuery.doctor = userId;
      }
      // Admins can search all records

      const medicalRecords = await MedicalRecord.find(recordSearchQuery)
        .populate('patient', 'firstName lastName email')
        .populate('doctor', 'firstName lastName email')
        .limit(parseInt(limit))
        .skip(skip)
        .lean();

      results.medicalRecords = medicalRecords.map(record => ({
        ...record,
        type: 'medicalRecord',
        displayName: `${record.recordType} - ${record.title}`,
        subtitle: `${record.patient?.firstName} ${record.patient?.lastName}`,
        href: `/dashboard/records/${record._id}`,
        date: record.date
      }));
    }

    // Search Payments (with role-based restrictions)
    if (!type || type === 'payments' || type === 'all') {
      let paymentSearchQuery = {
        $or: [
          { paymentMethod: { $regex: searchQuery, $options: 'i' } },
          { status: { $regex: searchQuery, $options: 'i' } },
          { transactionId: { $regex: searchQuery, $options: 'i' } }
        ]
      };

      // Role-based restrictions
      if (userRole === 'patient') {
        paymentSearchQuery.user = userId;
      } else if (userRole === 'doctor') {
        paymentSearchQuery.doctor = userId;
      }
      // Admins can search all payments

      const payments = await Payment.find(paymentSearchQuery)
        .populate('user', 'firstName lastName email')
        .populate('doctor', 'firstName lastName email')
        .limit(parseInt(limit))
        .skip(skip)
        .lean();

      results.payments = payments.map(payment => ({
        ...payment,
        type: 'payment',
        displayName: `Payment - ${payment.paymentMethod}`,
        subtitle: `${payment.user ? payment.user.firstName + ' ' + payment.user.lastName : 'Unknown User'} - ₹${payment.amount}`,
        href: `/dashboard/payments/${payment._id}`,
        date: payment.createdAt
      }));
    }

    // Search Activity Logs (admin only)
    if ((!type || type === 'activityLogs' || type === 'all') && userRole === 'admin') {
      const activityLogs = await ActivityLog.find({
        $or: [
          { action: { $regex: searchQuery, $options: 'i' } },
          { description: { $regex: searchQuery, $options: 'i' } },
          { 'user.firstName': { $regex: searchQuery, $options: 'i' } },
          { 'user.lastName': { $regex: searchQuery, $options: 'i' } }
        ]
      })
        .populate('user', 'firstName lastName email')
        .limit(parseInt(limit))
        .skip(skip)
        .lean();

      results.activityLogs = activityLogs.map(log => ({
        ...log,
        type: 'activityLog',
        displayName: `${log.action} - ${log.user?.firstName} ${log.user?.lastName}`,
        subtitle: log.description,
        href: `/dashboard/logs/${log._id}`,
        date: log.timestamp
      }));
    }

    // Calculate total results and check if there are more
    const totalResults = results.users.length + results.appointments.length + 
                        results.medicalRecords.length + results.payments.length + 
                        results.activityLogs.length;
    
    results.totalResults = totalResults;
    results.hasMore = totalResults >= parseInt(limit);

    // Combine all results
    const allResults = [
      ...results.users,
      ...results.appointments,
      ...results.medicalRecords,
      ...results.payments,
      ...results.activityLogs
    ].sort((a, b) => {
      // Exact matches first
      const aExact = a.displayName.toLowerCase() === searchQuery.toLowerCase() ||
                     a.subtitle.toLowerCase() === searchQuery.toLowerCase();
      const bExact = b.displayName.toLowerCase() === searchQuery.toLowerCase() ||
                     b.subtitle.toLowerCase() === searchQuery.toLowerCase();
      
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      
      // Then by date (newer first)
      if (a.date && b.date) {
        return new Date(b.date) - new Date(a.date);
      }
      
      return 0;
    });

    res.json({
      success: true,
      data: {
        results: allResults,
        totalResults,
        hasMore: results.hasMore,
        query: searchQuery,
        filters: { type, role }
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error performing search',
      error: error.message
    });
  }
});

// Get search suggestions (for autocomplete)
router.get('/suggestions', authenticate, async (req, res) => {
  try {
    const { query, type } = req.query;
    const userRole = req.user.role;
    const userId = req.user.id;

    if (!query || query.trim().length < 1) {
      return res.json({
        success: true,
        data: { suggestions: [] }
      });
    }

    const searchQuery = query.trim();
    const suggestions = [];

    // Quick suggestions for users
    if (!type || type === 'users' || type === 'all') {
      let userQuery = {
        $or: [
          { firstName: { $regex: searchQuery, $options: 'i' } },
          { lastName: { $regex: searchQuery, $options: 'i' } },
          { email: { $regex: searchQuery, $options: 'i' } }
        ]
      };

      if (userRole === 'patient') {
        userQuery.role = 'doctor';
      }

      const users = await User.find(userQuery)
        .select('firstName lastName email role specialization')
        .limit(5)
        .lean();

      suggestions.push(...users.map(user => ({
        type: 'user',
        displayName: `${user.firstName} ${user.lastName}`,
        subtitle: user.role === 'doctor' ? user.specialization : user.role,
        href: `/dashboard/users/${user._id}`
      })));
    }

    // Quick suggestions for appointments
    if (!type || type === 'appointments' || type === 'all') {
      let appointmentQuery = {
        $or: [
          { reason: { $regex: searchQuery, $options: 'i' } },
          { type: { $regex: searchQuery, $options: 'i' } }
        ]
      };

      if (userRole === 'patient') {
        appointmentQuery.patient = userId;
      } else if (userRole === 'doctor') {
        appointmentQuery.doctor = userId;
      }

      const appointments = await Appointment.find(appointmentQuery)
        .populate('patient', 'firstName lastName')
        .populate('doctor', 'firstName lastName')
        .limit(3)
        .lean();

      suggestions.push(...appointments.map(appointment => ({
        type: 'appointment',
        displayName: `${appointment.type} - ${appointment.reason}`,
        subtitle: `${appointment.patient?.firstName} ${appointment.patient?.lastName}`,
        href: `/dashboard/appointments/${appointment._id}`
      })));
    }

    res.json({
      success: true,
      data: { suggestions: suggestions.slice(0, 8) }
    });

  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting search suggestions',
      error: error.message
    });
  }
});

export default router;