import React, { useEffect, useState } from 'react';
import { useSocket } from '../../hooks/useSocket.js';

const PatientPortalExample = ({ token }) => {
  const [onlineDoctors, setOnlineDoctors] = useState([]);
  const [doctorAvailability, setDoctorAvailability] = useState([]);
  const [privateMessages, setPrivateMessages] = useState([]);
  const [appointmentRequest, setAppointmentRequest] = useState({
    doctorId: '',
    message: '',
    preferredDate: ''
  });

  const {
    isConnected,
    connectionStatus,
    error,
    on,
    off,
    emit,
    sendAppointmentRequest,
    sendPrivateMessage
  } = useSocket(token, {
    serverUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
  });

  // Listen for doctor online/offline events
  useEffect(() => {
    on('user_online', (data) => {
      if (data.role === 'doctor') {
        setOnlineDoctors(prev => [...prev, data]);
      }
    });

    on('user_offline', (data) => {
      if (data.role === 'doctor') {
        setOnlineDoctors(prev => prev.filter(d => d.userId !== data.userId));
      }
    });

    // Listen for doctor availability updates
    on('doctor_availability_updated', (data) => {
      setDoctorAvailability(prev => {
        const existing = prev.find(d => d.doctorId === data.doctorId);
        if (existing) {
          return prev.map(d => d.doctorId === data.doctorId ? { ...d, ...data } : d);
        } else {
          return [...prev, data];
        }
      });
    });

    // Listen for private messages
    on('private_message', (data) => {
      setPrivateMessages(prev => [...prev, data]);
    });

    // Cleanup
    return () => {
      off('user_online');
      off('user_offline');
      off('doctor_availability_updated');
      off('private_message');
    };
  }, [on, off]);

  // Handle appointment request submission
  const handleAppointmentRequest = () => {
    if (!appointmentRequest.doctorId || !appointmentRequest.message) {
      alert('Please fill in all fields');
      return;
    }

    const requestData = {
      doctorId: appointmentRequest.doctorId,
      message: appointmentRequest.message,
      preferredDate: appointmentRequest.preferredDate || new Date().toISOString(),
      timestamp: new Date().toISOString()
    };

    sendAppointmentRequest(requestData);
    
    // Clear form
    setAppointmentRequest({
      doctorId: '',
      message: '',
      preferredDate: ''
    });

    alert('Appointment request sent!');
  };

  // Send private message to a doctor
  const handleSendMessage = (doctorId) => {
    const message = prompt('Enter your message:');
    if (message) {
      sendPrivateMessage(doctorId, message);
    }
  };

  // Join appointment room
  const joinAppointmentRoom = (appointmentId) => {
    emit('join_room', `appointment_${appointmentId}`);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-green-600">Patient Portal - Socket.IO Example</h2>
      
      {/* Connection Status */}
      <div className="mb-6 p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">Connection Status</h3>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500' :
            connectionStatus === 'connecting' ? 'bg-yellow-500' :
            connectionStatus === 'error' ? 'bg-red-500' : 'bg-gray-500'
          }`}></div>
          <span className="capitalize">{connectionStatus}</span>
          {isConnected && <span className="text-green-600">(Connected)</span>}
        </div>
        {error && <p className="text-red-600 mt-2">Error: {error}</p>}
      </div>

      {/* Online Doctors */}
      <div className="mb-6 p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">Online Doctors ({onlineDoctors.length})</h3>
        {onlineDoctors.length > 0 ? (
          <div className="space-y-2">
            {onlineDoctors.map(doctor => (
              <div key={doctor.userId} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                <span>{doctor.email}</span>
                <div className="flex gap-2">
                  <span className="text-green-600 text-sm">Online</span>
                  <button
                    onClick={() => handleSendMessage(doctor.userId)}
                    className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                  >
                    Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No doctors currently online</p>
        )}
      </div>

      {/* Doctor Availability */}
      <div className="mb-6 p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">Doctor Availability Updates</h3>
        {doctorAvailability.length > 0 ? (
          <div className="space-y-3">
            {doctorAvailability.map((availability, index) => (
              <div key={index} className="p-3 bg-green-50 rounded border">
                <p><strong>Doctor:</strong> {availability.doctorName}</p>
                <p><strong>Status:</strong> {availability.isAvailable ? 'Available' : 'Unavailable'}</p>
                <p><strong>Next Slot:</strong> {new Date(availability.nextAvailableSlot).toLocaleString()}</p>
                <p><strong>Message:</strong> {availability.message}</p>
                <p><strong>Updated:</strong> {new Date(availability.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No availability updates received</p>
        )}
      </div>

      {/* Appointment Request Form */}
      <div className="mb-6 p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">Request Appointment</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Select Doctor:</label>
            <select
              value={appointmentRequest.doctorId}
              onChange={(e) => setAppointmentRequest(prev => ({ ...prev, doctorId: e.target.value }))}
              className="w-full p-2 border rounded"
            >
              <option value="">Choose a doctor...</option>
              {onlineDoctors.map(doctor => (
                <option key={doctor.userId} value={doctor.userId}>
                  {doctor.email}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Message:</label>
            <textarea
              value={appointmentRequest.message}
              onChange={(e) => setAppointmentRequest(prev => ({ ...prev, message: e.target.value }))}
              placeholder="Describe your symptoms or reason for appointment..."
              className="w-full p-2 border rounded"
              rows="3"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Preferred Date:</label>
            <input
              type="datetime-local"
              value={appointmentRequest.preferredDate}
              onChange={(e) => setAppointmentRequest(prev => ({ ...prev, preferredDate: e.target.value }))}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <button
            onClick={handleAppointmentRequest}
            disabled={!appointmentRequest.doctorId || !appointmentRequest.message}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Send Appointment Request
          </button>
        </div>
      </div>

      {/* Private Messages */}
      <div className="mb-6 p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">Private Messages ({privateMessages.length})</h3>
        {privateMessages.length > 0 ? (
          <div className="space-y-3">
            {privateMessages.map((message, index) => (
              <div key={index} className="p-3 bg-purple-50 rounded border">
                <p><strong>From:</strong> {message.senderEmail}</p>
                <p><strong>Message:</strong> {message.message}</p>
                <p><strong>Time:</strong> {new Date(message.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No private messages received</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
        <div className="flex gap-3">
          <button
            onClick={() => joinAppointmentRoom('12345')}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Join Appointment Room
          </button>
          <button
            onClick={() => emit('patient_status_update', { status: 'waiting', message: 'Waiting for consultation' })}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Update Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientPortalExample; 