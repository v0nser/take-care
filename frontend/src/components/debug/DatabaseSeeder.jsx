import { useState, useEffect } from 'react';
import { Database, Users, Calendar, UserCheck, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useApi } from '../../contexts/ApiContext';
import toast from 'react-hot-toast';

const DatabaseSeeder = () => {
  const { api } = useApi();
  const [loading, setLoading] = useState(false);
  const [seedStatus, setSeedStatus] = useState(null);
  const [seededData, setSeededData] = useState(null);

  const checkSeedStatus = async () => {
    try {
      const response = await api.api.get('/seed/status');
      setSeedStatus(response.data);
    } catch (error) {
      console.error('Error checking seed status:', error);
      toast.error('Failed to check database status');
    }
  };

  const seedDatabase = async () => {
    if (!window.confirm('This will clear all existing data and create sample data. Continue?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await api.api.post('/seed/database');
      
      if (response.data.success) {
        setSeededData(response.data);
        toast.success('Database seeded successfully!');
        await checkSeedStatus();
      }
    } catch (error) {
      console.error('Error seeding database:', error);
      toast.error(error.response?.data?.message || 'Failed to seed database');
    } finally {
      setLoading(false);
    }
  };

  // Auto-check status on mount
  useEffect(() => {
    checkSeedStatus();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Database Seeder
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Development tool to populate database with sample data
            </p>
          </div>
        </div>

        {/* Environment Warning */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-2" />
            <span className="text-yellow-800 dark:text-yellow-200 font-medium">
              Development Mode Only
            </span>
          </div>
          <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
            This tool is only available in development environment and will clear all existing data.
          </p>
        </div>

        {/* Current Status */}
        {seedStatus && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Current Database Status
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <Users className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {seedStatus.counts.doctors}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Doctors</div>
              </div>
              
              <div className="text-center">
                <UserCheck className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {seedStatus.counts.patients}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Patients</div>
              </div>
              
              <div className="text-center">
                <Calendar className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {seedStatus.counts.appointments}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Appointments</div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-center">
              {seedStatus.isSeeded ? (
                <div className="flex items-center text-green-600 dark:text-green-400">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">Database has sample data</span>
                </div>
              ) : (
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">Database is empty</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sample Data Overview */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
            What will be created:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">👨‍⚕️ Doctors (6)</h4>
              <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                <li>• Dr. Sarah Wilson (Cardiology)</li>
                <li>• Dr. Michael Chen (Dermatology)</li>
                <li>• Dr. Priya Sharma (Pediatrics)</li>
                <li>• Dr. James Rodriguez (Orthopedics)</li>
                <li>• Dr. Emily Johnson (Psychiatry)</li>
                <li>• Dr. David Kim (General Medicine)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">👤 Patients (3)</h4>
              <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                <li>• John Doe</li>
                <li>• Alice Smith</li>
                <li>• Robert Brown</li>
              </ul>
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2 mt-3">📅 Features</h4>
              <ul className="space-y-1 text-blue-700 dark:text-blue-300">
                <li>• Doctor availability schedules</li>
                <li>• Sample appointments</li>
                <li>• Admin user</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            onClick={checkSeedStatus}
            disabled={loading}
            className="btn-outline"
          >
            Refresh Status
          </button>
          
          <button
            onClick={seedDatabase}
            disabled={loading}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Seeding Database...
              </div>
            ) : (
              'Seed Database'
            )}
          </button>
        </div>

        {/* Success Message with Credentials */}
        {seededData && (
          <div className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-center mb-3">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
              <span className="font-semibold text-green-800 dark:text-green-200">
                Database seeded successfully!
              </span>
            </div>
            
            <div className="text-sm text-green-700 dark:text-green-300">
              <h4 className="font-medium mb-2">🔑 Login Credentials:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-800 rounded p-3">
                  <h5 className="font-medium text-gray-900 dark:text-white">Admin</h5>
                  <p>Email: {seededData.credentials.admin.email}</p>
                  <p>Password: {seededData.credentials.admin.password}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded p-3">
                  <h5 className="font-medium text-gray-900 dark:text-white">Sample Doctor</h5>
                  <p>Email: {seededData.credentials.sampleDoctor.email}</p>
                  <p>Password: {seededData.credentials.sampleDoctor.password}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded p-3">
                  <h5 className="font-medium text-gray-900 dark:text-white">Sample Patient</h5>
                  <p>Email: {seededData.credentials.samplePatient.email}</p>
                  <p>Password: {seededData.credentials.samplePatient.password}</p>
                </div>
              </div>
              <p className="mt-3 text-center">
                <strong>All doctor and patient passwords are: password123</strong>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseSeeder; 