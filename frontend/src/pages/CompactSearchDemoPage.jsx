import React from 'react';
import CompactSearchBar from '../components/ui/CompactSearchBar';

const CompactSearchDemoPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Compact Search Bar Demo
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Improved search experience with filters moved to a funnel icon
            </p>
          </div>

          {/* Desktop Search Demo */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-gray-200/30 dark:border-gray-700/30 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Desktop Search Bar
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              The filter section is now hidden by default and accessible via the funnel icon on the right.
            </p>
            <div className="flex justify-center">
              <CompactSearchBar 
                placeholder="Search patients, appointments, records, payments..."
                compact={false}
                className="w-full max-w-2xl"
              />
            </div>
          </div>

          {/* Mobile Search Demo */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-gray-200/30 dark:border-gray-700/30 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Mobile Search Bar
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Compact mobile experience with filters accessible via the funnel icon in the dropdown.
            </p>
            <div className="flex justify-center">
              <CompactSearchBar 
                placeholder="Search patients, appointments, records, payments..."
                compact={true}
                variant="mobile"
                className="w-full max-w-sm"
              />
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/30 dark:border-gray-700/30 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                🎯 Cleaner Interface
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Removed the filter section from the main search bar for a cleaner, more focused search experience.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/30 dark:border-gray-700/30 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                🔍 Smart Filter Access
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Filters are now accessible via a funnel icon, keeping them available when needed but out of the way.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/30 dark:border-gray-700/30 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                📱 Better Mobile Experience
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Optimized for mobile devices with compact design and intuitive filter access.
              </p>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/30 dark:border-gray-700/30 shadow-xl">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                ⚡ Improved Performance
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Faster rendering and better user experience with streamlined search functionality.
              </p>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-blue-50/80 dark:bg-blue-900/20 backdrop-blur-xl rounded-3xl p-8 mt-8 border border-blue-200/30 dark:border-blue-700/30">
            <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-4">
              How to Use
            </h3>
            <div className="space-y-4 text-blue-800 dark:text-blue-200">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  1
                </div>
                <p>Click the search bar to start typing your search query</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  2
                </div>
                <p>Click the funnel icon (🔍) to access search filters</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  3
                </div>
                <p>Select your desired filter type (Users, Appointments, etc.)</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                  4
                </div>
                <p>View search results and click on any result to navigate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompactSearchDemoPage; 