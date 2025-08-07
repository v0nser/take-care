import { useState, useEffect } from 'react';
import { useApi } from '../../contexts/ApiContext';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Clock, User, Stethoscope, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay, isAfter, startOfDay } from 'date-fns';
import toast from 'react-hot-toast';

const AppointmentBooking = () => {
  const { users, availability: availabilityApi, appointments } = useApi();
  const { user } = useAuth();
  
  // State management
  const [step, setStep] = useState(1); // 1: Select Doctor, 2: Select Date & Time, 3: Booking Details, 4: Confirmation
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  
  // Calendar and booking state
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()));
  const [availability, setAvailability] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  
  // Booking form state
  const [bookingData, setBookingData] = useState({
    reason: '',
    symptoms: '',
    type: 'consultation',
    notes: ''
  });

  const specializations = [
    'General Medicine',
    'Cardiology',
    'Dermatology',
    'Pediatrics',
    'Orthopedics',
    'Gynecology',
    'Psychiatry',
    'Neurology',
    'Oncology',
    'Radiology'
  ];

  // Fetch doctors on component mount
  useEffect(() => {
    fetchDoctors();
  }, [searchTerm, selectedSpecialization]);

  // Fetch doctor availability when doctor is selected
  useEffect(() => {
    if (selectedDoctor && step === 2) {
      fetchDoctorAvailability();
    }
  }, [selectedDoctor, currentWeek, step]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (selectedSpecialization) params.specialization = selectedSpecialization;
      
      const response = await users.getDoctors(params);
      setDoctors(response.data.doctors);
    } catch (error) {
      toast.error('Failed to fetch doctors');
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctorAvailability = async () => {
    try {
      setLoading(true);
      const startDate = format(currentWeek, 'yyyy-MM-dd');
      const endDate = format(addDays(currentWeek, 6), 'yyyy-MM-dd');
      
      const response = await availabilityApi.getDoctorAvailability(selectedDoctor._id, {
        startDate,
        endDate
      });
      
      // Convert array to object keyed by date for easier lookup
      const availabilityMap = {};
      response.data.availability.forEach(day => {
        availabilityMap[day.date] = day;
      });
      
      setAvailability(availabilityMap);
    } catch (error) {
      toast.error('Failed to fetch doctor availability');
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setStep(2);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleBookingSubmit = async () => {
    try {
      setLoading(true);
      
      const appointmentData = {
        doctorId: selectedDoctor._id,
        appointmentDate: format(selectedDate, 'yyyy-MM-dd'),
        appointmentTime: selectedSlot.startTime,
        reason: bookingData.reason,
        symptoms: bookingData.symptoms ? bookingData.symptoms.split(',').map(s => s.trim()) : [],
        type: bookingData.type
      };

      const response = await appointments.create(appointmentData);
      
      if (response.data.success) {
        toast.success('Appointment booked successfully!');
        setStep(4);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
      console.error('Error booking appointment:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetBooking = () => {
    setStep(1);
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSelectedSlot(null);
    setBookingData({
      reason: '',
      symptoms: '',
      type: 'consultation',
      notes: ''
    });
    setAvailability({});
  };

  const renderDoctorSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Select a Doctor</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Choose from our available healthcare professionals
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search doctors by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            value={selectedSpecialization}
            onChange={(e) => setSelectedSpecialization(e.target.value)}
            className="w-full md:w-48 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">All Specializations</option>
            {specializations.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors Grid */}
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map(doctor => (
            <div
              key={doctor._id}
              onClick={() => handleDoctorSelect(doctor)}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Stethoscope className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Dr. {doctor.firstName} {doctor.lastName}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {doctor.specialization || 'General Medicine'}
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    ₹{doctor.consultationFee || 500}
                  </p>
                </div>
              </div>
              
              {doctor.experience && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  {doctor.experience} years experience
                </p>
              )}
              
              {doctor.bio && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                  {doctor.bio}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderDateTimeSelection = () => {
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Select Date & Time
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Dr. {selectedDoctor.firstName} {selectedDoctor.lastName} - {selectedDoctor.specialization}
            </p>
          </div>
          <button
            onClick={() => setStep(1)}
            className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Doctors
          </button>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentWeek(addDays(currentWeek, -7))}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {format(currentWeek, 'MMMM yyyy')}
          </h3>
          
          <button
            onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
            className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map(date => {
            const dateKey = format(date, 'yyyy-MM-dd');
            const dayAvailability = availability[dateKey];
            const isAvailable = dayAvailability?.isAvailable && dayAvailability.slots.some(slot => !slot.isBooked);
            const isPast = !isAfter(date, startOfDay(new Date()));
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            
            return (
              <div
                key={dateKey}
                onClick={() => !isPast && isAvailable && handleDateSelect(date)}
                className={`
                  p-3 rounded-lg border text-center cursor-pointer transition-colors
                  ${isPast 
                    ? 'border-gray-200 dark:border-gray-700 text-gray-400 cursor-not-allowed' 
                    : isAvailable
                      ? isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                        : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                      : 'border-gray-200 dark:border-gray-700 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {format(date, 'EEE')}
                </div>
                <div className="text-sm font-medium">
                  {format(date, 'd')}
                </div>
                {!isPast && isAvailable && (
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                    Available
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Time Slots */}
        {selectedDate && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Available Time Slots for {format(selectedDate, 'MMMM d, yyyy')}
            </h4>
            
            {(() => {
              const dateKey = format(selectedDate, 'yyyy-MM-dd');
              const dayAvailability = availability[dateKey];
              const availableSlots = dayAvailability?.slots?.filter(slot => !slot.isBooked) || [];
              
              if (availableSlots.length === 0) {
                return (
                  <p className="text-gray-600 dark:text-gray-400">
                    No available slots for this date.
                  </p>
                );
              }
              
              return (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {availableSlots.map(slot => (
                    <button
                      key={slot.startTime}
                      onClick={() => handleSlotSelect(slot)}
                      className={`
                        p-3 rounded-lg border text-center transition-colors
                        ${selectedSlot?.startTime === slot.startTime
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                          : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                        }
                      `}
                    >
                      <Clock className="h-4 w-4 mx-auto mb-1" />
                      <div className="text-sm font-medium">
                        {slot.startTime}
                      </div>
                    </button>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {/* Continue Button */}
        {selectedDate && selectedSlot && (
          <div className="flex justify-end">
            <button
              onClick={() => setStep(3)}
              className="btn-primary"
            >
              Continue to Booking Details
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderBookingForm = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Booking Details
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Dr. {selectedDoctor.firstName} {selectedDoctor.lastName} on{' '}
            {format(selectedDate, 'MMMM d, yyyy')} at {selectedSlot.startTime}
          </p>
        </div>
        <button
          onClick={() => setStep(2)}
          className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Date & Time
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reason for Visit *
            </label>
            <input
              type="text"
              value={bookingData.reason}
              onChange={(e) => setBookingData(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="e.g., Regular checkup, Follow-up consultation"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Symptoms (optional)
            </label>
            <textarea
              value={bookingData.symptoms}
              onChange={(e) => setBookingData(prev => ({ ...prev, symptoms: e.target.value }))}
              placeholder="Describe your symptoms (comma separated)"
              rows={3}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Separate multiple symptoms with commas
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Appointment Type
            </label>
            <select
              value={bookingData.type}
              onChange={(e) => setBookingData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="consultation">Consultation</option>
              <option value="followup">Follow-up</option>
              <option value="checkup">General Checkup</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Additional Notes (optional)
            </label>
            <textarea
              value={bookingData.notes}
              onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any additional information for the doctor"
              rows={3}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Appointment Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Doctor:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Specialization:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              {selectedDoctor.specialization}
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Date:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Time:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              {selectedSlot.startTime} - {selectedSlot.endTime}
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Consultation Fee:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white">
              ₹{selectedDoctor.consultationFee || 500}
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Type:</span>
            <span className="ml-2 font-medium text-gray-900 dark:text-white capitalize">
              {bookingData.type}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <button
          onClick={() => setStep(2)}
          className="btn-outline"
        >
          Back
        </button>
        <button
          onClick={handleBookingSubmit}
          disabled={!bookingData.reason || loading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Booking...' : `Book Appointment - ₹${selectedDoctor.consultationFee || 500}`}
        </button>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
        <Calendar className="h-10 w-10 text-green-600 dark:text-green-400" />
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Appointment Booked Successfully!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Your appointment request has been sent to Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}.
          You will receive a confirmation once the doctor accepts your request.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 max-w-md mx-auto">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Appointment Details
        </h3>
        <div className="space-y-2 text-sm text-left">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Doctor:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              Dr. {selectedDoctor.firstName} {selectedDoctor.lastName}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Date:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {format(selectedDate, 'MMM d, yyyy')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Time:</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {selectedSlot.startTime}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Status:</span>
            <span className="font-medium text-orange-600 dark:text-orange-400">
              Pending Approval
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => window.location.href = '/dashboard'}
          className="btn-primary"
        >
          Go to Dashboard
        </button>
        <button
          onClick={resetBooking}
          className="btn-outline ml-4"
        >
          Book Another Appointment
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[1, 2, 3, 4].map(stepNum => (
              <div
                key={stepNum}
                className={`flex items-center ${stepNum < 4 ? 'flex-1' : ''}`}
              >
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${step >= stepNum
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                    }
                  `}
                >
                  {stepNum}
                </div>
                {stepNum < 4 && (
                  <div
                    className={`
                      flex-1 h-1 mx-4
                      ${step > stepNum
                        ? 'bg-blue-600'
                        : 'bg-gray-200 dark:bg-gray-700'
                      }
                    `}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-16 mt-2 text-xs text-gray-600 dark:text-gray-400">
            <span>Select Doctor</span>
            <span>Date & Time</span>
            <span>Details</span>
            <span>Confirmation</span>
          </div>
        </div>

        {/* Step Content */}
        {step === 1 && renderDoctorSelection()}
        {step === 2 && renderDateTimeSelection()}
        {step === 3 && renderBookingForm()}
        {step === 4 && renderConfirmation()}
      </div>
    </div>
  );
};

export default AppointmentBooking; 