import React, { useState } from 'react';
import { TestTube, Clock, AlertCircle, Calendar, LogIn, Star, Heart } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useQuickBooking } from '../../contexts/QuickBookingContext';

const TestCard = ({ test }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { addToQuickBooking, removeFromQuickBooking, isInQuickBooking } = useQuickBooking();



  // Note: location is imported but used for other purposes if needed

  const handleBookNow = () => {
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }
    
    // Always navigate to dashboard booking path when authenticated
    const finalBookingPath = isAuthenticated ? '/dashboard/diagnostics/booking' : '/diagnostics/booking';
    
    navigate(finalBookingPath, { 
      state: { 
        selectedTests: [test._id || test.id],
        type: 'test'
      } 
    });
  };

  const handleLogin = () => {
    navigate('/login', { 
      state: { 
        redirectTo: '/dashboard/diagnostics/booking',
        redirectState: { 
          selectedTests: [test._id || test.id],
          type: 'test'
        }
      } 
    });
  };

  const handleCloseLoginPrompt = () => {
    setShowLoginPrompt(false);
  };

  const handleQuickBookingClick = (e) => {
    e.stopPropagation(); // Prevent card click event
    const testId = test._id || test.id;
    
    if (isInQuickBooking(testId, 'test')) {
      removeFromQuickBooking(testId, 'test');
    } else {
      addToQuickBooking(test, 'test');
    }
  };

  const getSampleTypeColor = (sampleType) => {
    const colors = {
      'Blood': 'text-red-600 bg-red-50 border-red-200',
      'Urine': 'text-amber-600 bg-amber-50 border-amber-200',
      'Stool': 'text-orange-600 bg-orange-50 border-orange-200',
      'Saliva': 'text-blue-600 bg-blue-50 border-blue-200',
      'Tissue': 'text-purple-600 bg-purple-50 border-purple-200'
    };
    return colors[sampleType] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const getUrgencyColor = (urgency) => {
    const colors = {
      'Normal': 'text-green-600 bg-green-50 border-green-200',
      'Urgent': 'text-orange-600 bg-orange-50 border-orange-200',
      'Emergency': 'text-red-600 bg-red-50 border-red-200'
    };
    return colors[urgency] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <>
      <div 
        className={`group relative bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 overflow-hidden ${
          isHovered ? 'shadow-xl scale-[1.02] -translate-y-1' : 'hover:shadow-lg'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Premium Badge and Quick Booking Icon */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          {/* Quick Booking Heart Icon */}
          <button
            onClick={handleQuickBookingClick}
            className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${
              isInQuickBooking(test._id || test.id, 'test')
                ? 'text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/20'
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
            }`}
            title={isInQuickBooking(test._id || test.id, 'test') ? 'Remove from quick booking' : 'Add to quick booking'}
          >
            <Heart 
              className={`w-5 h-5 ${
                isInQuickBooking(test._id || test.id, 'test') ? 'fill-current' : ''
              }`} 
            />
          </button>

          {/* Premium Badge */}
          {test.popular && (
            <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
              <Star className="w-3 h-3 fill-current" />
              Popular
            </div>
          )}
        </div>

        {/* Gradient Background Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-900/20 dark:via-transparent dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <TestTube className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-200">
                {test.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {test.description}
              </p>
            </div>
          </div>

          {/* Test Details Grid */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Sample Type */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${getSampleTypeColor(test.sampleType)}`}>
              <div className="w-2 h-2 rounded-full bg-current"></div>
              {test.sampleType}
            </div>

            {/* Urgency */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${getUrgencyColor(test.urgency)}`}>
              <AlertCircle className="w-3 h-3" />
              {test.urgency}
            </div>

            {/* Processing Time */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm">
              <Clock className="w-3 h-3" />
              {test.processingTime}
            </div>

            {/* Fasting Required */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium ${
              test.fastingRequired 
                ? 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' 
                : 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            }`}>
              <Calendar className="w-3 h-3" />
              {test.fastingRequired ? 'Fasting Required' : 'No Fasting'}
            </div>
          </div>

          {/* Price Section */}
          <div className="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 rounded-lg border border-gray-200 dark:border-gray-600">
            <div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Price</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(test.price)}
                </span>
                {test.originalPrice && test.originalPrice > test.price && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
                    {formatPrice(test.originalPrice)}
                  </span>
                )}
              </div>
            </div>
            {test.originalPrice && test.originalPrice > test.price && (
              <div className="text-right">
                <div className="text-xs text-gray-600 dark:text-gray-400">You save</div>
                <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                  {formatPrice(test.originalPrice - test.price)}
                </div>
              </div>
            )}
          </div>

          {/* Fasting Warning */}
          {test.fastingRequired && (
            <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-amber-700 dark:text-amber-300">
                  <span className="font-medium">Fasting Required:</span> Please fast for {test.fastingHours || 8} hours before the test
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleBookNow}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
              isAuthenticated
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              {isAuthenticated ? (
                <>
                  <TestTube className="w-4 h-4" />
                  Book This Test
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign in to Book
                </>
              )}
            </div>
          </button>
        </div>

      </div>

      {/* Enhanced Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 transform animate-in zoom-in-95 duration-200">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <LogIn className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Sign In Required
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Please sign in to book diagnostic tests and access personalized healthcare services.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Sign In & Continue Booking
              </button>
              <button
                onClick={handleCloseLoginPrompt}
                className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-3 px-4 rounded-xl font-medium transition-colors duration-200"
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

export default TestCard;