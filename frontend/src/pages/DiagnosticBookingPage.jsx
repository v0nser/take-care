import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Calendar, Clock, User, CreditCard, CheckCircle, 
  Building, Home, AlertCircle, MapPin, Phone,
  Mail, FileText, ArrowLeft, ArrowRight, Lock
} from 'lucide-react';
import { 
  collectionTypes,
  checkFastingRequirements
} from '../utils/servicesData';
import { useApi } from '../contexts/ApiContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import useRazorpay from '../hooks/useRazorpay';

const DiagnosticBookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { apiCall } = useApi();
  const { isSignedIn, user } = useAuth();
  const { processDiagnosticPayment } = useRazorpay();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedTestsData, setSelectedTestsData] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    selectedTests: [],
    type: 'test',
    collectionType: 'lab-visit',
    date: '',
    time: '',
    patientDetails: {
      name: '',
      age: '',
      gender: '',
      phone: '',
      email: '',
      address: '',
      pincode: ''
    },
    paymentMethod: 'razorpay',
    termsAccepted: false
  });

  const [availableSlots] = useState([
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
    '04:00 PM', '05:00 PM', '06:00 PM'
  ]);

  useEffect(() => {
    if (location.state) {
      const { selectedTests, type, conditionName, packageId, packageName, selectedPackages } = location.state;

      // Normalize tests to array of string IDs
      const normalizedTestIds = Array.isArray(selectedTests)
        ? selectedTests.map(t => (typeof t === 'object' ? (t._id || t.id) : t))
        : selectedTests ? [selectedTests] : [];

      setBookingData(prev => ({
        ...prev,
        selectedTests: normalizedTestIds,
        type: type || 'test',
        conditionName: conditionName || '',
        packageId: packageId || '',
        packageName: packageName || ''
      }));
      
      // Fetch test details if tests are selected
      if (normalizedTestIds.length > 0) {
        fetchTestDetails(normalizedTestIds);
      }
    }
  }, [location.state, apiCall]);

  const fetchTestDetails = async (testIds) => {
    if (!testIds || testIds.length === 0) {
      setSelectedTestsData([]);
      return;
    }
    
    try {
      const testDetails = [];
      for (const testId of testIds) {
        const response = await apiCall(`/diagnostics/tests/${testId}`, 'GET');
        if (response.success && response.data) {
          testDetails.push(response.data);
        }
      }
      setSelectedTestsData(testDetails);
    } catch (error) {
      console.error('Error fetching test details:', error);
      setSelectedTestsData([]);
    }
  };

  const getSelectedTestsDetails = () => {
    return selectedTestsData || [];
  };

  const getTotalPrice = () => {
    const tests = getSelectedTestsDetails();
    if (!tests || tests.length === 0) return 0;
    return tests.reduce((total, test) => total + (test.price || 0), 0);
  };

  const getFastingWarning = () => {
    if (!bookingData.selectedTests || bookingData.selectedTests.length === 0) {
      return { warning: false, message: '' };
    }
    return checkFastingRequirements(bookingData.selectedTests);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setBookingData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setBookingData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async () => {
    if (!isSignedIn) {
      setShowLoginModal(true);
      return;
    }

    if (!selectedTestsData || selectedTestsData.length === 0) {
      alert('No tests selected. Please go back and select tests first.');
      return;
    }

    try {
      setLoading(true);
      
      // Prepare booking data
      const tests = selectedTestsData.map(test => ({
        testId: test._id || test.id,
        price: test.price
      }));
      
      const packages = [];
      if (bookingData.type === 'package' && bookingData.packageId) {
        packages.push({
          packageId: bookingData.packageId,
          price: getTotalPrice()
        });
      }
      
      const bookingPayload = {
        tests,
        packages,
        collectionType: bookingData.collectionType,
        scheduledDate: bookingData.date,
        scheduledTime: bookingData.time,
        patientDetails: bookingData.patientDetails,
        totalAmount: getTotalPrice(),
        paymentMethod: bookingData.paymentMethod
      };
      
      // Create booking via API
      const response = await apiCall('/diagnostics/bookings', 'POST', bookingPayload);
      
      if (response.success) {
        const created = response.booking || response.data?.booking || {};
        const createdBookingId = created._id || created.id;
        // Trigger Razorpay payment
        await processDiagnosticPayment(createdBookingId, {
          name: bookingData.patientDetails?.name || user?.firstName || 'Patient',
          email: bookingData.patientDetails?.email || user?.email || '',
          phone: bookingData.patientDetails?.phone || ''
        });
        
        alert(`Booking successful! Your booking ID is: ${created.bookingId || 'N/A'}`);
        navigate(isSignedIn ? '/dashboard/diagnostics' : '/diagnostics');
      } else {
        alert('Booking failed. Please try again.');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
            step <= currentStep 
              ? 'bg-blue-600 border-blue-600 text-white' 
              : 'border-gray-300 text-gray-500'
          }`}>
            {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
          </div>
          {step < 4 && (
            <div className={`w-16 h-1 mx-2 ${
              step < currentStep ? 'bg-blue-600' : 'bg-gray-300'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Select Collection Type</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {collectionTypes.map(type => (
          <div
            key={type.id}
            className={`p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              bookingData.collectionType === type.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            } ${!type.available ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={() => type.available && handleInputChange('collectionType', type.id)}
          >
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-lg ${
                type.available ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                {type.isMain ? <Building className="w-6 h-6 text-blue-600" /> : <Home className="w-6 h-6 text-gray-600" />}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{type.name}</h3>
                <p className="text-sm text-gray-600">{type.description}</p>
                {!type.available && type.note && (
                  <p className="text-sm text-orange-600 mt-1">{type.note}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-gray-900 mb-3">Booking Summary</h3>
        <div className="space-y-2">
          {bookingData.type === 'package' && (
            <div className="flex justify-between text-sm">
              <span>Package:</span>
              <span className="font-medium">{bookingData.packageName}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span>Tests:</span>
            <span className="font-medium">{bookingData.selectedTests?.length || 0}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Total Amount:</span>
            <span className="font-bold text-blue-600">₹{getTotalPrice()}</span>
          </div>
        </div>
      </div>

      {getFastingWarning().warning && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-amber-800">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Fasting Required</span>
          </div>
          <p className="text-sm text-amber-700 mt-1">
            {getFastingWarning().message}
          </p>
        </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Select Date & Time</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Date
        </label>
        <input
          type="date"
          value={bookingData.date}
          onChange={(e) => handleInputChange('date', e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Time Slot
        </label>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {availableSlots.map(slot => (
            <button
              key={slot}
              onClick={() => handleInputChange('time', slot)}
              className={`p-3 text-sm font-medium rounded-lg border transition-colors duration-200 ${
                bookingData.time === slot
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-blue-800 mb-2">
          {bookingData.collectionType === 'lab-visit' ? <Building className="w-5 h-5" /> : <Home className="w-5 h-5" />}
          <span className="font-medium">
            {bookingData.collectionType === 'lab-visit' ? 'Lab Visit' : 'Home Collection'}
          </span>
        </div>
        <p className="text-sm text-blue-700">
          {bookingData.collectionType === 'lab-visit' 
            ? 'Please arrive at the lab 10 minutes before your scheduled time.'
            : 'Our phlebotomist will arrive at your doorstep at the scheduled time.'
          }
        </p>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Patient Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={bookingData.patientDetails.name}
            onChange={(e) => handleInputChange('patientDetails.name', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age *
          </label>
          <input
            type="number"
            value={bookingData.patientDetails.age}
            onChange={(e) => handleInputChange('patientDetails.age', e.target.value)}
            min="1"
            max="120"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender *
          </label>
          <select
            value={bookingData.patientDetails.gender}
            onChange={(e) => handleInputChange('patientDetails.gender', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            value={bookingData.patientDetails.phone}
            onChange={(e) => handleInputChange('patientDetails.phone', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={bookingData.patientDetails.email}
            onChange={(e) => handleInputChange('patientDetails.email', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pincode *
          </label>
          <input
            type="text"
            value={bookingData.patientDetails.pincode}
            onChange={(e) => handleInputChange('patientDetails.pincode', e.target.value)}
            pattern="[0-9]{6}"
            maxLength="6"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Address
        </label>
        <textarea
          value={bookingData.patientDetails.address}
          onChange={(e) => handleInputChange('patientDetails.address', e.target.value)}
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {bookingData.collectionType === 'home-collection' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-amber-800">
            <MapPin className="w-5 h-5" />
            <span className="font-medium">Home Collection Available</span>
          </div>
          <p className="text-sm text-amber-700 mt-1">
            We'll verify your pincode and confirm home collection availability.
          </p>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Review & Payment</h2>
      
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>
        
        <div className="space-y-4">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Collection Type:</span>
            <span className="font-medium">
              {bookingData.collectionType === 'lab-visit' ? 'Lab Visit' : 'Home Collection'}
            </span>
          </div>
          
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Date & Time:</span>
            <span className="font-medium">
              {bookingData.date} at {bookingData.time}
            </span>
          </div>
          
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Patient:</span>
            <span className="font-medium">{bookingData.patientDetails.name}</span>
          </div>
          
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600">Tests:</span>
            <span className="font-medium">{bookingData.selectedTests?.length || 0}</span>
          </div>
          
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Total Amount:</span>
            <span className="text-xl font-bold text-blue-600">₹{getTotalPrice()}</span>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Method
        </label>
        <div className="border border-gray-300 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-blue-600" />
            <span className="font-medium">Razorpay</span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Secure payment gateway with multiple payment options
          </p>
        </div>
      </div>

      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="terms"
          checked={bookingData.termsAccepted}
          onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
          className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          required
        />
        <label htmlFor="terms" className="text-sm text-gray-700">
          I agree to the terms and conditions and privacy policy. I understand that fasting tests should be booked for morning slots.
        </label>
      </div>

      {getFastingWarning().warning && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            <span className="font-medium">Important Reminder</span>
          </div>
          <p className="text-sm text-red-700 mt-1">
            {getFastingWarning().message}
          </p>
        </div>
      )}
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return null;
    }
  };

  const canProceed = () => {
    // If no tests are selected, can't proceed
    if (!bookingData?.selectedTests?.length) return false;
    
    switch (currentStep) {
      case 1: return bookingData.collectionType;
      case 2: return bookingData.date && bookingData.time;
      case 3: return (
        bookingData.patientDetails.name &&
        bookingData.patientDetails.age &&
        bookingData.patientDetails.gender &&
        bookingData.patientDetails.phone &&
        bookingData.patientDetails.pincode
      );
      case 4: return bookingData.termsAccepted;
      default: return false;
    }
  };

  // Login Modal
  const LoginModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Login Required</h3>
          <p className="text-gray-600 mt-2">
            Please sign in to complete your diagnostic test booking
          </p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/register')}
            className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Create Account
          </button>
          <button
            onClick={() => setShowLoginModal(false)}
            className="w-full text-gray-500 py-2 px-4 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );



  // Early return if no tests are selected
  if (!location.state?.selectedTests?.length) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">No Tests Selected</h1>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              It looks like you haven't selected any diagnostic tests or packages yet. 
              Please go back to the diagnostics page to select tests first.
            </p>
            <button
              onClick={() => navigate(isSignedIn ? '/dashboard/diagnostics' : '/diagnostics')}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Browse Diagnostics
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Book Diagnostic Tests</h1>
          <p className="text-gray-600 mt-2">Complete your booking in 4 simple steps</p>
        </div>

        {renderStepIndicator()}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {renderCurrentStep()}

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>

            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-colors duration-200 ${
                  canProceed()
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canProceed() || loading}
                className={`flex items-center gap-2 px-8 py-3 rounded-lg font-medium text-white transition-colors duration-200 ${
                  canProceed() && !loading
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <LoadingSpinner />
                    Processing...
                  </>
                ) : (
                  <>
                    Confirm Booking
                    <CheckCircle className="w-4 h-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && <LoginModal />}
    </div>
  );
};

export default DiagnosticBookingPage; 