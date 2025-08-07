import DatabaseSeeder from '../components/debug/DatabaseSeeder';
import DashboardLayout from '../components/layouts/DashboardLayout';
import { Database, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const DatabaseSeederPage = () => {
  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Not Available
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Database seeder is only available in development mode.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <Link
              to="/dashboard"
              className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Database Seeder
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Development tool to populate the database with sample data for testing
                </p>
              </div>
            </div>
          </div>

          {/* Database Seeder Component */}
          <DatabaseSeeder />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DatabaseSeederPage; 