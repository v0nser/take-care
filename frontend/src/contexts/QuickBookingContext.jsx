import React, { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

const QuickBookingContext = createContext({
  quickBookingItems: [],
  addToQuickBooking: () => {},
  removeFromQuickBooking: () => {},
  clearQuickBooking: () => {},
  getQuickBookingCount: () => 0,
  isInQuickBooking: () => false,
});

export const useQuickBooking = () => {
  const context = useContext(QuickBookingContext);
  if (context === undefined) {
    throw new Error('useQuickBooking must be used within a QuickBookingProvider');
  }
  return context;
};

export const QuickBookingProvider = ({ children }) => {
  const [quickBookingItems, setQuickBookingItems] = useState([]);

  const addToQuickBooking = (item, type = 'test') => {
    const itemId = item._id || item.id;
    const exists = quickBookingItems.find(
      (qItem) => qItem.id === itemId && qItem.type === type
    );

    if (exists) {
      toast.error('Item already in quick booking');
      return;
    }

    const quickBookingItem = {
      id: itemId,
      name: item.name,
      price: item.price,
      type: type, // 'test' or 'package'
      data: item, // Store the full item data
    };

    setQuickBookingItems((prev) => [...prev, quickBookingItem]);
    toast.success(`${item.name} added to quick booking!`);
  };

  const removeFromQuickBooking = (itemId, type) => {
    setQuickBookingItems((prev) =>
      prev.filter((item) => !(item.id === itemId && item.type === type))
    );
    toast.success('Item removed from quick booking');
  };

  const clearQuickBooking = () => {
    setQuickBookingItems([]);
    toast.success('Quick booking cleared');
  };

  const getQuickBookingCount = () => quickBookingItems.length;

  const isInQuickBooking = (itemId, type) => {
    return quickBookingItems.some(
      (item) => item.id === itemId && item.type === type
    );
  };

  const getTotalPrice = () => {
    return quickBookingItems.reduce((total, item) => total + (item.price || 0), 0);
  };

  const value = {
    quickBookingItems,
    addToQuickBooking,
    removeFromQuickBooking,
    clearQuickBooking,
    getQuickBookingCount,
    isInQuickBooking,
    getTotalPrice,
  };

  return (
    <QuickBookingContext.Provider value={value}>
      {children}
    </QuickBookingContext.Provider>
  );
};

export default QuickBookingContext; 