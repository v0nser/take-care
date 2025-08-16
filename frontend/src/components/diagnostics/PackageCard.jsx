import React, { useState } from 'react';
import { Package, Clock, Users, CheckCircle, LogIn, Heart } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useQuickBooking } from '../../contexts/QuickBookingContext';

const PackageCard = ({ package: pkg }) => {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { addToQuickBooking, removeFromQuickBooking, isInQuickBooking } = useQuickBooking();



  // Note: location is imported but used for other purposes if needed

  const handleBookPackage = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    
    // Always navigate to dashboard booking path when authenticated
    const finalBookingPath = isAuthenticated ? '/dashboard/diagnostics/booking' : '/diagnostics/booking';
    
    navigate(finalBookingPath, { 
      state: { 
        selectedTests: pkg.tests,
        type: 'package',
        packageId: pkg._id || pkg.id,
        packageName: pkg.name
      } 
    });
  };

  const handleLogin = () => {
    navigate('/login', { 
      state: { 
        redirectTo: '/dashboard/diagnostics/booking',
        redirectState: { 
          selectedTests: pkg.tests,
          type: 'package',
          packageId: pkg._id || pkg.id,
          packageName: pkg.name
        }
      } 
    });
  };

  const handleCloseLoginPrompt = () => {
    setShowLoginPrompt(false);
  };

  const handleQuickBookingClick = (e) => {
    e.stopPropagation(); // Prevent card click event
    const packageId = pkg._id || pkg.id;
    
    if (isInQuickBooking(packageId, 'package')) {
      removeFromQuickBooking(packageId, 'package');
    } else {
      addToQuickBooking(pkg, 'package');
    }
  };

  return (
    <>
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
        {/* Quick Booking Heart Icon */}
        <button
          onClick={handleQuickBookingClick}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 hover:scale-110 z-10 ${
            isInQuickBooking(pkg._id || pkg.id, 'package')
              ? 'text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/20'
              : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
          }`}
          title={isInQuickBooking(pkg._id || pkg.id, 'package') ? 'Remove from quick booking' : 'Add to quick booking'}
        >
          <Heart 
            className={`w-5 h-5 ${
              isInQuickBooking(pkg._id || pkg.id, 'package') ? 'fill-current' : ''
            }`} 
          />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{pkg.name || 'Health Package'}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{pkg.category || 'General'}</p>
          </div>
          {pkg.popular && (
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium rounded-full">
              Popular
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
          {pkg.description || 'Comprehensive health package with essential tests'}
        </p>

        {/* Price Section */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹{pkg.price || 0}</span>
            {pkg.originalPrice && pkg.savings ? (
              <div className="text-right">
                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">₹{pkg.originalPrice}</span>
                <div className="text-sm font-medium text-green-600 dark:text-green-400">
                  Save ₹{pkg.savings}
                </div>
              </div>
            ) : null}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {pkg.tests && pkg.tests.length ? pkg.tests.length : 0} tests included
          </div>
        </div>

        {/* Tests Preview */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Included Tests:</h4>
          <div className="grid grid-cols-2 gap-2">
            {(pkg.tests || []).slice(0, 6).map((testId, index) => {
              // Handle both string and object test entries safely
              let testName = '';
              
              if (typeof testId === 'string') {
                // Convert test ID to readable name
                testName = testId.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ');
              } else if (typeof testId === 'object' && testId.name) {
                // If testId is an object with a name property
                testName = testId.name;
              } else {
                // Fallback for any other type
                testName = String(testId);
              }
              
              return (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                  <span className="truncate">{testName}</span>
                </div>
              );
            })}
            {(pkg.tests && pkg.tests.length > 6) && (
              <div className="text-sm text-gray-500 dark:text-gray-400 col-span-2">
                +{pkg.tests.length - 6} more tests
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Clock className="w-4 h-4" />
            <span>{pkg.reportTime || '24-48 hours'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Users className="w-4 h-4" />
            <span>{pkg.preparation || 'No special preparation'}</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleBookPackage}
          className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors duration-200 ${
            pkg.color 
              ? pkg.color.replace('from-', 'bg-gradient-to-r from-').replace(' to-', ' to-')
              : 'bg-gradient-to-r from-blue-500 to-blue-600'
          } hover:opacity-90`}
        >
          Book Package
        </button>
      </div>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <LogIn className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Sign In Required</h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You need to sign in to book diagnostic packages. Please sign in to continue with your booking.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={handleLogin}
                className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={handleCloseLoginPrompt}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PackageCard; 