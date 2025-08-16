import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  diagnosticTests, 
  diagnosticConditions, 
  diagnosticPackages,
  getPopularTests,
  getPopularPackages
} from '../../utils/servicesData';
import TestCard from '../diagnostics/TestCard';
import ConditionCard from '../diagnostics/ConditionCard';
import PackageCard from '../components/diagnostics/PackageCard';

const DiagnosticServicesSection = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tests');

  const popularTests = getPopularTests();
  const popularPackages = getPopularPackages();

  const handleViewAll = (type) => {
    navigate('/diagnostics', { state: { activeTab: type } });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tests':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">Popular Tests</h3>
              <button
                onClick={() => handleViewAll('tests')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View All Tests →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {popularTests.slice(0, 8).map(test => (
                <TestCard key={test.id} test={test} />
              ))}
            </div>
          </div>
        );

      case 'conditions':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">Health Conditions</h3>
              <button
                onClick={() => handleViewAll('conditions')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View All Conditions →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {diagnosticConditions.slice(0, 6).map(condition => (
                <ConditionCard key={condition.id} condition={condition} />
              ))}
            </div>
          </div>
        );

      case 'packages':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">Health Packages</h3>
              <button
                onClick={() => handleViewAll('packages')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                View All Packages →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularPackages.slice(0, 6).map(pkg => (
                <PackageCard key={pkg.id} package={pkg} />
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Diagnostic Services
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive health screening with state-of-the-art diagnostic facilities. 
            Get accurate results and expert insights for better health management.
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8 justify-center">
            {[
              { id: 'tests', name: 'Tests', count: diagnosticTests.length },
              { id: 'conditions', name: 'Conditions', count: diagnosticConditions.length },
              { id: 'packages', name: 'Packages', count: diagnosticPackages.length }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name}
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs font-medium">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {renderTabContent()}

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Book Your Tests?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Choose from our wide range of diagnostic tests and health packages. 
              Get accurate results with fast turnaround times and expert consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/diagnostics')}
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Browse All Services
              </button>
              <button
                onClick={() => navigate('/diagnostics/booking')}
                className="px-8 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiagnosticServicesSection; 