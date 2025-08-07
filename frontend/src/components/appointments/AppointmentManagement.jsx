import { useState, useEffect } from 'react';
import { useApi } from '../../contexts/ApiContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Calendar, Clock, User, Check, X, Video, MessageSquare, 
  FileText, Phone, Mail, Filter, Search, ChevronDown, ExternalLink 
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const AppointmentManagement = () => {
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
    date: '',
    search: ''
  });
  
  // Modal states
  const [modalAction, setModalAction] = useState(null); // 'accept', 'reject', 'complete', 'view'
  const [actionData, setActionData] = useState({
    notes: '',
    diagnosis: '',
    prescription: [],
    cancellationReason: ''
  });

  const statusOptions = [
    { value: 'all', label: 'All Appointments' },
    { value: 'pending', label: 'Pending Approval' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
    rescheduled: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
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
        doctorId: user._id,
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
        apt.patient?.firstName?.toLowerCase().includes(searchLower) ||
        apt.patient?.lastName?.toLowerCase().includes(searchLower) ||
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
        case 'accept':
          response = await appointmentsApi.updateStatus(selectedAppointment._id, {
            status: 'confirmed',
            notes: actionData.notes
          });
          toast.success('Appointment confirmed successfully');
          break;
          
        case 'reject':
          response = await appointmentsApi.updateStatus(selectedAppointment._id, {
            status: 'cancelled',
            cancellationReason: actionData.cancellationReason
          });
          toast.success('Appointment cancelled');
          break;
          
        case 'complete':
          response = await appointmentsApi.complete(selectedAppointment._id, {
            diagnosis: actionData.diagnosis,
            prescription: actionData.prescription.filter(p => p.medicine),
            notes: actionData.notes
          });
          toast.success('Appointment completed successfully');
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
      notes: '',
      diagnosis: '',
      prescription: [{ medicine: '', dosage: '', frequency: '', duration: '', instructions: '' }],
      cancellationReason: ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedAppointment(null);
    setModalAction(null);
    setShowModal(false);
    setActionData({
      notes: '',
      diagnosis: '',
      prescription: [],
      cancellationReason: ''
    });
  };

  const addPrescriptionItem = () => {
    setActionData(prev => ({
      ...prev,
      prescription: [
        ...prev.prescription,
        { medicine: '', dosage: '', frequency: '', duration: '', instructions: '' }
      ]
    }));
  };

  const updatePrescriptionItem = (index, field, value) => {
    setActionData(prev => ({
      ...prev,
      prescription: prev.prescription.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const removePrescriptionItem = (index) => {
    setActionData(prev => ({
      ...prev,
      prescription: prev.prescription.filter((_, i) => i !== index)
    }));
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
              {appointment.patient?.firstName} {appointment.patient?.lastName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {appointment.patient?.email}
            </p>
            {appointment.patient?.phone && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {appointment.patient?.phone}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[appointment.status]}`}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </span>
          
          {appointment.status === 'confirmed' && appointment.meetingLink && (
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="h-4 w-4 mr-2" />
          {format(new Date(appointment.appointmentDate), 'EEEE, MMMM d, yyyy')}
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Clock className="h-4 w-4 mr-2" />
          {appointment.appointmentTime}
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

      {appointment.status === 'confirmed' && appointment.meetingLink && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-green-700 dark:text-green-300">
              <Video className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Video consultation ready</span>
            </div>
            <button
              onClick={() => openJitsiMeeting(appointment)}
              className="flex items-center text-green-600 dark:text-green-400 hover:underline text-sm"
            >
              Join Call
              <ExternalLink className="h-3 w-3 ml-1" />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Fee: ₹{appointment.consultationFee}
        </div>
        
        <div className="flex items-center space-x-2">
          {appointment.status === 'pending' && (
            <>
              <button
                onClick={() => openModal(appointment, 'reject')}
                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Reject Appointment"
              >
                <X className="h-4 w-4" />
              </button>
              <button
                onClick={() => openModal(appointment, 'accept')}
                className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                title="Accept Appointment"
              >
                <Check className="h-4 w-4" />
              </button>
            </>
          )}
          
          {appointment.status === 'confirmed' && (
            <button
              onClick={() => openModal(appointment, 'complete')}
              className="btn-primary text-sm"
            >
              Complete Consultation
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

  const renderModal = () => {
    if (!showModal || !selectedAppointment) return null;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={closeModal} />
          
          <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {modalAction === 'accept' && 'Accept Appointment'}
                {modalAction === 'reject' && 'Reject Appointment'}
                {modalAction === 'complete' && 'Complete Consultation'}
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
              {/* Patient Info */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Patient Information</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Name:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">
                      {selectedAppointment.patient?.firstName} {selectedAppointment.patient?.lastName}
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
                </div>
              </div>

              {/* Action-specific forms */}
              {modalAction === 'accept' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Notes (optional)
                  </label>
                  <textarea
                    value={actionData.notes}
                    onChange={(e) => setActionData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add any notes for the patient..."
                    rows={3}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
                  />
                </div>
              )}

              {modalAction === 'reject' && (
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

              {modalAction === 'complete' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Diagnosis
                    </label>
                    <textarea
                      value={actionData.diagnosis}
                      onChange={(e) => setActionData(prev => ({ ...prev, diagnosis: e.target.value }))}
                      placeholder="Enter diagnosis..."
                      rows={3}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Prescription
                      </label>
                      <button
                        onClick={addPrescriptionItem}
                        className="btn-outline text-sm"
                      >
                        Add Medicine
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {actionData.prescription.map((item, index) => (
                        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="Medicine name"
                              value={item.medicine}
                              onChange={(e) => updatePrescriptionItem(index, 'medicine', e.target.value)}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Dosage"
                              value={item.dosage}
                              onChange={(e) => updatePrescriptionItem(index, 'dosage', e.target.value)}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-sm"
                            />
                            <input
                              type="text"
                              placeholder="Frequency"
                              value={item.frequency}
                              onChange={(e) => updatePrescriptionItem(index, 'frequency', e.target.value)}
                              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-sm"
                            />
                            <div className="flex space-x-2">
                              <input
                                type="text"
                                placeholder="Duration"
                                value={item.duration}
                                onChange={(e) => updatePrescriptionItem(index, 'duration', e.target.value)}
                                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-sm"
                              />
                              <button
                                onClick={() => removePrescriptionItem(index)}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          <textarea
                            placeholder="Instructions"
                            value={item.instructions}
                            onChange={(e) => updatePrescriptionItem(index, 'instructions', e.target.value)}
                            rows={2}
                            className="w-full mt-2 p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Doctor Notes
                    </label>
                    <textarea
                      value={actionData.notes}
                      onChange={(e) => setActionData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Additional notes..."
                      rows={3}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
                    />
                  </div>
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
                  disabled={loading || (modalAction === 'reject' && !actionData.cancellationReason)}
                  className="btn-primary disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 
                    modalAction === 'accept' ? 'Accept Appointment' :
                    modalAction === 'reject' ? 'Reject Appointment' :
                    'Complete Consultation'
                  }
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Appointment Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your appointment requests and consultations
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              Date
            </label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Search by patient name, reason, or symptoms..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
              />
            </div>
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
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAppointments.map(renderAppointmentCard)}
        </div>
      )}

      {/* Modal */}
      {renderModal()}
    </div>
  );
};

export default AppointmentManagement; 