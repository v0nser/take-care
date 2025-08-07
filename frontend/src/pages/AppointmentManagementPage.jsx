import { useAuth } from '../contexts/AuthContext';
import AppointmentManagement from '../components/appointments/AppointmentManagement';
import { Calendar, ArrowLeft, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const AppointmentManagementPage = () => {
  const { user } = useAuth();

  // Redirect non-doctors
  if (user?.role !== 'doctor') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Appointment management is only available for doctors.
          </p>
        </div>
      </div>
    );
  }

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
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Appointment Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage appointment requests, conduct consultations, and handle video calls
            </p>
          </div>
        </div>
      </div>

      {/* Appointment Management Component */}
      <AppointmentManagement />
    </div>
  );
};

export default AppointmentManagementPage; 