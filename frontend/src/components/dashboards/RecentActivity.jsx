import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  TestTube, 
  FileText, 
  Clock, 
  User, 
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

const RecentActivity = ({ 
  title = "Recent Activity", 
  items = [], 
  type = "appointments", // appointments, diagnostics, activity
  role = "patient",
  viewAllLink = "#",
  isLoading = false 
}) => {
  
  const getItemIcon = (item, type) => {
    if (type === 'appointments') {
      return Calendar;
    } else if (type === 'diagnostics') {
      return TestTube;
    } else if (type === 'activity') {
      switch (item.action) {
        case 'appointment_book':
        case 'appointment_update':
          return Calendar;
        case 'diagnostic_book':
          return TestTube;
        case 'record_view':
        case 'record_update':
          return FileText;
        case 'login':
        case 'logout':
          return User;
        default:
          return AlertCircle;
      }
    }
    return Clock;
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'confirmed': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      'pending': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
      'completed': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      'cancelled': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      'scheduled': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
      'sample-collected': 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
      'report-ready': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      'success': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
      'error': 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
      'warning': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
    };
    return statusColors[status] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    // Handle both time strings and full datetime
    if (timeString.includes('T') || timeString.includes(' ')) {
      try {
        return new Date(timeString).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
      } catch {
        return timeString;
      }
    }
    return timeString;
  };

  const renderAppointmentItem = (appointment) => {
    const Icon = getItemIcon(appointment, 'appointments');
    
    return (
      <div key={appointment._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              {role === 'patient' 
                ? `Dr. ${appointment.doctor?.firstName} ${appointment.doctor?.lastName}`
                : `${appointment.patient?.firstName} ${appointment.patient?.lastName}`
              }
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {appointment.doctor?.specialization || appointment.reason || 'Consultation'}
            </p>
            <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span>{formatDate(appointment.appointmentDate)}</span>
              <span>{formatTime(appointment.appointmentTime)}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
            {appointment.status}
          </span>
        </div>
      </div>
    );
  };

  const renderDiagnosticItem = (booking) => {
    const Icon = getItemIcon(booking, 'diagnostics');
    
    return (
      <div key={booking._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
            <Icon className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              {booking.service?.serviceName || booking.selectedPackage?.name || 'Diagnostic Test'}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {booking.service?.category || 'Health Check'}
            </p>
            <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span>{formatDate(booking.schedule?.collectionDate)}</span>
              <span>{booking.schedule?.collectionTime}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
            {booking.status}
          </span>
          {booking.pricing?.finalAmount && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              ₹{booking.pricing.finalAmount}
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderActivityItem = (activity) => {
    const Icon = getItemIcon(activity, 'activity');
    
    return (
      <div key={activity._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
            <Icon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              {activity.action?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {activity.description || activity.resourceType}
            </p>
            <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span>{formatDate(activity.createdAt)}</span>
              <span>{formatTime(activity.createdAt)}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
            {activity.status}
          </span>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg animate-pulse">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
                <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          {viewAllLink && viewAllLink !== '#' && (
            <Link 
              to={viewAllLink} 
              className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              View All
              <ExternalLink className="ml-1 h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
      
      <div className="p-6">
        {items.length > 0 ? (
          <div className="space-y-4">
            {items.map((item) => {
              if (type === 'appointments') return renderAppointmentItem(item);
              if (type === 'diagnostics') return renderDiagnosticItem(item);
              if (type === 'activity') return renderActivityItem(item);
              return null;
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              {type === 'appointments' && <Calendar className="h-8 w-8 text-gray-400" />}
              {type === 'diagnostics' && <TestTube className="h-8 w-8 text-gray-400" />}
              {type === 'activity' && <Clock className="h-8 w-8 text-gray-400" />}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No {type === 'appointments' ? 'appointments' : type === 'diagnostics' ? 'diagnostic bookings' : 'recent activity'} found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {type === 'appointments' && 'Schedule your first appointment to get started'}
              {type === 'diagnostics' && 'Book a diagnostic test to see your bookings here'}
              {type === 'activity' && 'Your recent activities will appear here'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity; 