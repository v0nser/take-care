import { useState, useEffect } from 'react';
import { useApi } from '../../contexts/ApiContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Calendar, Clock, User, X, Video, 
  FileText, Search, Monitor, MapPin, Plus
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const PatientAppointments = () => {
  const { appointments: appointmentsApi } = useApi();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    status: 'all',
    consultationType: 'all',
    date: '',
    search: ''
  });
  
  // Modal states
  const [modalAction, setModalAction] = useState(null); // 'view', 'cancel'
  const [actionData, setActionData] = useState({
    cancellationReason: ''
  });

  const statusOptions = [
    { value: 'all', label: 'All Appointments' },
    { value: 'pending', label: 'Pending Approval' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const consultationTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'in-person', label: 'In-Person' },
    { value: 'teleconsultation', label: 'Teleconsultation' }
  ];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    completed: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
    rescheduled: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, filters]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentsApi.getAll({
        page: 1,
        limit: 50
      });
      setAppointments(response.data.appointments || []);
    } catch (error) {
      toast.error('Failed to fetch appointments');
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = [...appointments];
    
    // Filter by status
    if (filters.status !== 'all') {
      filtered = filtered.filter(apt => apt.status === filters.status);
    }
    
    // Filter by consultation type
    if (filters.consultationType !== 'all') {
      filtered = filtered.filter(apt => apt.consultationType === filters.consultationType);
    }

    // Filter by date
    if (filters.date) {
      filtered = filtered.filter(apt => {
        const aptDate = format(new Date(apt.appointmentDate), 'yyyy-MM-dd');
        return aptDate === filters.date;
      });
    }
    
    // Filter by search term
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(apt => 
        apt.doctor?.firstName?.toLowerCase().includes(searchLower) ||
        apt.doctor?.lastName?.toLowerCase().includes(searchLower) ||
        apt.doctor?.specialization?.toLowerCase().includes(searchLower) ||
        apt.reason?.toLowerCase().includes(searchLower) ||
        apt.symptoms?.some(symptom => symptom.toLowerCase().includes(searchLower))
      );
    }
    
    setFilteredAppointments(filtered);
  };

  const handleAppointmentAction = async (action) => {
    try {
      setLoading(true);
      let response;
      
      switch (action) {
        case 'cancel':
          response = await appointmentsApi.cancel(selectedAppointment._id, {
            cancellationReason: actionData.cancellationReason
          });
          toast.success('Appointment cancelled successfully');
          break;
      }
      
      if (response?.data?.success) {
        await fetchAppointments();
        closeModal();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${action} appointment`);
      console.error(`Error ${action} appointment:`, error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (appointment, action) => {
    setSelectedAppointment(appointment);
    setModalAction(action);
    setActionData({
      cancellationReason: ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedAppointment(null);
    setModalAction(null);
    setShowModal(false);
    setActionData({
      cancellationReason: ''
    });
  };

  const openJitsiMeeting = (appointment) => {
    if (appointment.meetingLink) {
      window.open(appointment.meetingLink, '_blank');
    } else {
      toast.error('Meeting link not available');
    }
  };

  const renderAppointmentCard = (appointment) => (
    <div
      key={appointment._id}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {appointment.doctor?.specialization}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ₹{appointment.doctor?.consultationFee}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 flex-wrap">
          {/* Consultation Type Badge */}
          <span className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center ${
            appointment.consultationType === 'teleconsultation' 
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
          }`}>
            {appointment.consultationType === 'teleconsultation' ? (
              <Monitor className="h-3 w-3 mr-1" />
            ) : (
              <MapPin className="h-3 w-3 mr-1" />
            )}
            {appointment.consultationType === 'teleconsultation' ? 'Teleconsultation' : 'In-Person'}
          </span>
          
          {/* Status Badge */}
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[appointment.status]}`}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1).replace('-', ' ')}
          </span>
          
          {/* Video Call Button */}
          {(appointment.status === 'confirmed' || appointment.status === 'in-progress') && 
           appointment.consultationType === 'teleconsultation' && appointment.meetingLink && (
            <button
              onClick={() => openJitsiMeeting(appointment)}
              className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
              title="Join Video Call"
            >
              <Video className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>{format(new Date(appointment.appointmentDate), 'EEEE, MMMM d, yyyy')}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>{appointment.appointmentTime}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <User className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>₹{appointment.consultationFee}</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
          Reason for Visit:
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {appointment.reason}
        </p>
      </div>

      {appointment.symptoms && appointment.symptoms.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            Symptoms:
          </p>
          <div className="flex flex-wrap gap-1">
            {appointment.symptoms.map((symptom, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
              >
                {symptom}
              </span>
            ))}
          </div>
        </div>
      )}

      {(appointment.status === 'confirmed' || appointment.status === 'in-progress') && 
       appointment.consultationType === 'teleconsultation' && appointment.meetingLink && (
        <div className={`mb-4 p-4 rounded-lg border-l-4 ${
          appointment.status === 'in-progress' 
            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' 
            : 'bg-green-50 dark:bg-green-900/20 border-green-500'
        }`}>
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${
              appointment.status === 'in-progress' 
                ? 'text-blue-700 dark:text-blue-300' 
                : 'text-green-700 dark:text-green-300'
            }`}>
              <Video className="h-5 w-5 mr-2" />
              <div>
                <span className="text-sm font-semibold block">
                  {appointment.status === 'in-progress' ? 'Consultation In Progress' : 'Video Consultation Ready'}
                </span>
                <span className="text-xs opacity-75">
                  Meeting ID: {appointment.jitsiRoomName || 'N/A'}
                </span>
              </div>
            </div>
            <button
              onClick={() => openJitsiMeeting(appointment)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                appointment.status === 'in-progress'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              <Video className="h-4 w-4 mr-2" />
              {appointment.status === 'in-progress' ? 'Rejoin Call' : 'Join Call'}
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          {appointment.status === 'pending' && (
            <button
              onClick={() => openModal(appointment, 'cancel')}
              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Cancel Appointment"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          <button
            onClick={() => openModal(appointment, 'view')}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="View Details"
          >
            <FileText className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              My Appointments
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View and manage all your appointments
            </p>
          </div>
          <Link
            to="/dashboard/appointments/book"
            className="btn-primary inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Book New Appointment
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Filter Appointments
          </h2>
          <button
            onClick={() => setFilters({ status: 'all', consultationType: 'all', date: '', search: '' })}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            Clear All Filters
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Consultation Type
            </label>
            <select
              value={filters.consultationType}
              onChange={(e) => setFilters(prev => ({ ...prev, consultationType: e.target.value }))}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
            >
              {consultationTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
            />
          </div>

        </div>
        
        {/* Search Field - Full Width */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search Appointments
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Search by doctor name, specialization, reason, or symptoms..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Appointments Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">Loading appointments...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No appointments found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {filters.status !== 'all' || filters.date || filters.search
              ? 'Try adjusting your filters to see more appointments.'
              : 'You have no appointments scheduled yet.'
            }
          </p>
          <Link
            to="/dashboard/appointments/book"
            className="btn-primary mt-4 inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Book Your First Appointment
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAppointments.map(renderAppointmentCard)}
        </div>
      )}

      {/* Modal */}
      {showModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={closeModal} />
            
            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {modalAction === 'cancel' && 'Cancel Appointment'}
                  {modalAction === 'view' && 'Appointment Details'}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Doctor Info */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Doctor Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Name:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">
                        Dr. {selectedAppointment.doctor?.firstName} {selectedAppointment.doctor?.lastName}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Specialization:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">
                        {selectedAppointment.doctor?.specialization}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Date:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">
                        {format(new Date(selectedAppointment.appointmentDate), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Time:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">
                        {selectedAppointment.appointmentTime}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Reason:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">
                        {selectedAppointment.reason}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Fee:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">
                        ₹{selectedAppointment.consultationFee}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action-specific forms */}
                {modalAction === 'cancel' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cancellation Reason *
                    </label>
                    <textarea
                      value={actionData.cancellationReason}
                      onChange={(e) => setActionData(prev => ({ ...prev, cancellationReason: e.target.value }))}
                      placeholder="Please provide a reason for cancellation..."
                      rows={3}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
                      required
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {modalAction !== 'view' && (
                <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={closeModal}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAppointmentAction(modalAction)}
                    disabled={loading || (modalAction === 'cancel' && !actionData.cancellationReason)}
                    className="btn-primary disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Cancel Appointment'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;
