import { useAuth } from '../contexts/AuthContext';
import PatientAppointments from '../components/appointments/PatientAppointments';
import AppointmentManagement from '../components/appointments/AppointmentManagement';
import { Calendar, ArrowLeft, Users, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const AppointmentsPage = () => {
  const { user } = useAuth();

  // Render different components based on user role
  const renderAppointmentsContent = () => {
    switch (user?.role) {
      case 'doctor':
        return <AppointmentManagement />;
      case 'patient':
        return <PatientAppointments />;
      case 'admin':
        return (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Admin View
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              As an admin, you can view all appointments from the admin dashboard.
            </p>
            <Link
              to="/dashboard/admin"
              className="btn-primary inline-flex items-center"
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Go to Admin Dashboard
            </Link>
          </div>
        );
      default:
        return (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please log in to view your appointments.
            </p>
          </div>
        );
    }
  };

  const getPageTitle = () => {
    switch (user?.role) {
      case 'doctor':
        return 'Appointment Management';
      case 'patient':
        return 'My Appointments';
      case 'admin':
        return 'Appointments Overview';
      default:
        return 'Appointments';
    }
  };

  const getPageDescription = () => {
    switch (user?.role) {
      case 'doctor':
        return 'Manage appointment requests, conduct consultations, and handle video calls';
      case 'patient':
        return 'View and manage all your scheduled appointments';
      case 'admin':
        return 'Overview of all appointments in the system';
      default:
        return 'View and manage appointments';
    }
  };

  const getIconColor = () => {
    switch (user?.role) {
      case 'doctor':
        return 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400';
      case 'patient':
        return 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400';
      case 'admin':
        return 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400';
      default:
        return 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
        
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getIconColor()}`}>
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {getPageTitle()}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {getPageDescription()}
            </p>
          </div>
        </div>
      </div>

      {/* Appointments Content */}
      {renderAppointmentsContent()}
    </div>
  );
};

export default AppointmentsPage; 