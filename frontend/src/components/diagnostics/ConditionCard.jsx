import React from 'react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useQuickBooking } from '../../contexts/QuickBookingContext';

const ConditionCard = ({ condition }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToQuickBooking, removeFromQuickBooking, isInQuickBooking } = useQuickBooking();

  const handleViewTests = () => {
    // Always navigate to dashboard booking path when authenticated
    const finalBookingPath = isAuthenticated ? '/dashboard/diagnostics/booking' : '/diagnostics/booking';
    
    navigate(finalBookingPath, { 
      state: { 
        selectedTests: condition.tests,
        type: 'condition',
        conditionName: condition.name
      } 
    });
  };

  const handleQuickBookingClick = (e) => {
    e.stopPropagation(); // Prevent card click event
    const conditionId = condition.id;
    
    if (isInQuickBooking(conditionId, 'condition')) {
      removeFromQuickBooking(conditionId, 'condition');
    } else {
      addToQuickBooking(condition, 'condition');
    }
  };

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Quick Booking Heart Icon */}
      <button
        onClick={handleQuickBookingClick}
        className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-200 hover:scale-110 z-10 ${
          isInQuickBooking(condition.id, 'condition')
            ? 'text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/20'
            : 'text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
        }`}
        title={isInQuickBooking(condition.id, 'condition') ? 'Remove from quick booking' : 'Add to quick booking'}
      >
        <Heart 
          className={`w-5 h-5 ${
            isInQuickBooking(condition.id, 'condition') ? 'fill-current' : ''
          }`} 
        />
      </button>

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-3 rounded-lg ${condition.bgColor}`}>
          <condition.icon className={`w-6 h-6 ${condition.color.replace('from-', 'text-').replace(' to-', '')}`} />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{condition.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{condition.tests.length} tests available</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
        {condition.description}
      </p>

      {/* Symptoms */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Common Symptoms:</h4>
        <div className="flex flex-wrap gap-2">
          {condition.symptoms.map((symptom, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
            >
              {symptom}
            </span>
          ))}
        </div>
      </div>

      {/* Tests Preview */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Recommended Tests:</h4>
        <div className="grid grid-cols-2 gap-2">
          {condition.tests.slice(0, 4).map((testId, index) => {
            // This would typically fetch test details from the test ID
            const testName = testId.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
            
            return (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="truncate">{testName}</span>
              </div>
            );
          })}
          {condition.tests.length > 4 && (
            <div className="text-sm text-gray-500 dark:text-gray-400 col-span-2">
              +{condition.tests.length - 4} more tests
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={handleViewTests}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors duration-200 ${condition.color.replace('from-', 'bg-gradient-to-r from-').replace(' to-', ' to-')} hover:opacity-90`}
      >
        View All Tests
      </button>
    </div>
  );
};

export default ConditionCard; 