import React, { useState, useEffect } from 'react';
import { 
  diagnosticConditions, 
  sampleTypes,
  diagnosticTests as staticDiagnosticTests,
  diagnosticPackages as staticDiagnosticPackages
} from '../utils/servicesData';
import { useApi } from '../contexts/ApiContext';
import TestCard from '../components/diagnostics/TestCard';
import ConditionCard from '../components/diagnostics/ConditionCard';
import PackageCard from '../components/diagnostics/PackageCard';
import SearchBar from '../components/ui/SearchBar';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import QuickBookingButton from '../components/ui/QuickBookingButton';

const DiagnosticServicesPage = () => {
  const { apiCall } = useApi();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSampleType, setSelectedSampleType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [diagnosticTests, setDiagnosticTests] = useState([]);
  const [diagnosticPackages, setDiagnosticPackages] = useState([]);
  const [popularTests, setPopularTests] = useState([]);
  const [popularPackages, setPopularPackages] = useState([]);

  // Fetch diagnostic data on component mount
  useEffect(() => {
    fetchDiagnosticData();
  }, []);

  const fetchDiagnosticData = async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API first
      try {
        // Fetch all tests
        const testsResponse = await apiCall('/diagnostics/tests', 'GET');
        setDiagnosticTests(testsResponse.data || []);
        
        // Fetch popular tests
        const popularTestsResponse = await apiCall('/diagnostics/tests/popular', 'GET');
        setPopularTests(popularTestsResponse.data || []);
        
        // Fetch all packages
        const packagesResponse = await apiCall('/diagnostics/packages', 'GET');
        setDiagnosticPackages(packagesResponse.data || []);
        
        // Fetch popular packages
        const popularPackagesResponse = await apiCall('/diagnostics/packages/popular', 'GET');
        setPopularPackages(popularPackagesResponse.data || []);
        
        console.log('Diagnostic data fetched from API successfully');
      } catch (apiError) {
        console.warn('API failed, using static data:', apiError);
        
        // Fallback to static data
        setDiagnosticTests(staticDiagnosticTests);
        setPopularTests(staticDiagnosticTests.filter(test => test.popular));
        setDiagnosticPackages(staticDiagnosticPackages);
        setPopularPackages(staticDiagnosticPackages.filter(pkg => pkg.popular));
        
        console.log('Using static diagnostic data:', {
          tests: staticDiagnosticTests.length,
          packages: staticDiagnosticPackages.length
        });
      }
      
    } catch (error) {
      console.error('Error in fetchDiagnosticData:', error);
      
      // Final fallback to static data
      setDiagnosticTests(staticDiagnosticTests);
      setPopularTests(staticDiagnosticTests.filter(test => test.popular));
      setDiagnosticPackages(staticDiagnosticPackages);
      setPopularPackages(staticDiagnosticPackages.filter(pkg => pkg.popular));
    } finally {
      setLoading(false);
    }
  };

  const searchTests = (query) => {
    if (!query.trim()) return diagnosticTests;
    const searchTerm = query.toLowerCase();
    return diagnosticTests.filter(test => 
      (test.name || '').toLowerCase().includes(searchTerm) ||
      (test.category || '').toLowerCase().includes(searchTerm) ||
      (test.description || '').toLowerCase().includes(searchTerm)
    );
  };

  const searchPackages = (query) => {
    if (!query.trim()) return diagnosticPackages;
    const searchTerm = query.toLowerCase();
    return diagnosticPackages.filter(pkg => 
      (pkg.name || '').toLowerCase().includes(searchTerm) ||
      (pkg.category || '').toLowerCase().includes(searchTerm) ||
      (pkg.description || '').toLowerCase().includes(searchTerm)
    );
  };

  const handleSearch = async (query) => {
    setLoading(true);
    setSearchQuery(query);
    
    // Simulate search delay
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const filteredTests = searchQuery 
    ? searchTests(searchQuery)
    : selectedCategory !== 'all' 
      ? diagnosticTests.filter(test => test.category === selectedCategory)
      : selectedSampleType !== 'all'
        ? diagnosticTests.filter(test => (test.sampleType || '').toLowerCase() === selectedSampleType.toLowerCase())
        : diagnosticTests;

  const filteredPackages = searchQuery 
    ? searchPackages(searchQuery)
    : selectedCategory !== 'all'
      ? diagnosticPackages.filter(pkg => pkg.category === selectedCategory)
      : diagnosticPackages;

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'Diabetes', name: 'Diabetes' },
    { id: 'General Health', name: 'General Health' },
    { id: 'Liver Health', name: 'Liver Health' },
    { id: 'Cardiovascular', name: 'Cardiovascular' },
    { id: 'Endocrinology', name: 'Endocrinology' },
    { id: 'Blood Disorders', name: 'Blood Disorders' },
    { id: 'Toxicology', name: 'Toxicology' },
    { id: 'Nutrition', name: 'Nutrition' },
    { id: 'Men Health', name: 'Men Health' },
    { id: 'Women Health', name: 'Women Health' }
  ];



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Enhanced Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/3 rounded-full translate-y-24 -translate-x-24"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Advanced Diagnostic Solutions</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Your Health,
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Our Priority
              </span>
            </h1>
            
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Comprehensive health checkups and laboratory tests with cutting-edge technology, 
              accurate results, and convenient home collection services.
            </p>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold mb-2">500+</div>
                <div className="text-blue-100 text-sm">Tests Available</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold mb-2">50+</div>
                <div className="text-blue-100 text-sm">Health Packages</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold mb-2">24-48hrs</div>
                <div className="text-blue-100 text-sm">Report Delivery</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-3xl font-bold mb-2">99.9%</div>
                <div className="text-blue-100 text-sm">Accuracy Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <SearchBar 
              placeholder="Search tests, packages, or conditions..."
              onSearch={handleSearch}
              className="flex-1 max-w-md"
            />
            
            <div className="flex gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedSampleType}
                onChange={(e) => setSelectedSampleType(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Sample Types</option>
                {sampleTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Unified Content - Apollo Diagnostics Style */}
        <div className="space-y-12">
          
          {/* Popular Health Packages */}
          {popularPackages.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-2 rounded-lg">
                  <span className="text-white text-xl">📦</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Popular Health Packages</h2>
                  <p className="text-gray-600 dark:text-gray-400">Comprehensive health checkup packages</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularPackages.map(pkg => (
                  <PackageCard key={pkg._id || pkg.id} package={pkg} />
                ))}
              </div>
            </div>
          )}

          {/* Popular Tests */}
          {popularTests.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-gray-200 to-blue-600 p-2 rounded-lg">
                  <span className="text-white text-xl">🔬</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Popular Tests</h2>
                  <p className="text-gray-600 dark:text-gray-400">Most commonly booked diagnostic tests</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {popularTests.map(test => (
                  <TestCard key={test._id || test.id} test={test} />
                ))}
              </div>
            </div>
          )}

          {/* Health Conditions */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-gray-200 to-blue-600 p-2 rounded-lg">
                <span className="text-white text-xl">🫀</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tests by Health Conditions</h2>
                <p className="text-gray-600 dark:text-gray-400">Find tests based on your health concerns</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {diagnosticConditions.map(condition => (
                <ConditionCard key={condition.id} condition={condition} />
              ))}
            </div>
          </div>

          {/* All Packages */}
          {filteredPackages.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-violet-600 p-2 rounded-lg">
                  <span className="text-white text-xl">🏥</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Health Packages</h2>
                  <p className="text-gray-600 dark:text-gray-400">Complete list of available health packages</p>
                </div>
              </div>
              {loading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPackages.map(pkg => (
                    <PackageCard key={pkg._id || pkg.id} package={pkg} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* All Tests */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-lg">
                <span className="text-white text-xl">🧪</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Diagnostic Tests</h2>
                <p className="text-gray-600 dark:text-gray-400">Browse all available diagnostic tests</p>
              </div>
            </div>
            {loading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredTests.map(test => (
                  <TestCard key={test._id || test.id} test={test} />
                ))}
              </div>
            )}
            {filteredTests.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No tests found matching your criteria.
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Quick Booking Button */}
      <QuickBookingButton />
    </div>
  );
};

export default DiagnosticServicesPage; 