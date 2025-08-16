import React from 'react';
import { ShoppingCart, Heart, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuickBooking } from '../../contexts/QuickBookingContext';
import { useAuth } from '../../contexts/AuthContext';

const QuickBookingButton = () => {
  const { quickBookingItems, getQuickBookingCount, getTotalPrice } = useQuickBooking();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const count = getQuickBookingCount();

  if (count === 0) return null;

  const handleClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Navigate to booking page with selected items
    const selectedTests = quickBookingItems
      .filter(item => item.type === 'test')
      .map(item => item.id);
    
    const selectedPackages = quickBookingItems
      .filter(item => item.type === 'package')
      .map(item => item.id);

    const bookingPath = isAuthenticated ? '/dashboard/diagnostics/booking' : '/diagnostics/booking';
    
    navigate(bookingPath, {
      state: {
        selectedTests: selectedTests,
        selectedPackages: selectedPackages,
        type: 'multiple',
        fromQuickBooking: true
      }
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleClick}
        className="group relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
        title="Quick Booking"
      >
        {/* Heart Icon */}
        <Heart className="w-6 h-6" />
        
        {/* Count Badge */}
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
          {count}
        </div>

        {/* Hover Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          {count} item{count !== 1 ? 's' : ''} • ₹{getTotalPrice()}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-700"></div>
        </div>

        {/* Ripple Effect */}
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 group-hover:animate-ping"></div>
      </button>
    </div>
  );
};

export default QuickBookingButton; 