import React, { useEffect, useState } from 'react';
import { useSocket } from '../../hooks/useSocket.js';

const DoctorPortalExample = ({ token }) => {
  const [onlinePatients, setOnlinePatients] = useState([]);
  const [appointmentRequests, setAppointmentRequests] = useState([]);
  const [availabilityData, setAvailabilityData] = useState({
    isAvailable: true,
    nextAvailableSlot: new Date().toISOString()
  });

  const {
    isConnected,
    connectionStatus,
    error,
    on,
    off,
    emit,
    updateDoctorAvailability,
    sendPrivateMessage
  } = useSocket(token, {
    serverUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
  });

  // Listen for patient online/offline events
  useEffect(() => {
    on('user_online', (data) => {
      if (data.role === 'patient') {
        setOnlinePatients(prev => [...prev, data]);
      }
    });

    on('user_offline', (data) => {
      if (data.role === 'patient') {
        setOnlinePatients(prev => prev.filter(p => p.userId !== data.userId));
      }
    });

    // Listen for new appointment requests
    on('new_appointment_request', (data) => {
      setAppointmentRequests(prev => [...prev, data]);
    });

    // Cleanup
    return () => {
      off('user_online');
      off('user_offline');
      off('new_appointment_request');
    };
  }, [on, off]);

  // Handle availability update
  const handleAvailabilityUpdate = () => {
    const newAvailability = {
      isAvailable: !availabilityData.isAvailable,
      nextAvailableSlot: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      message: availabilityData.isAvailable ? 'Currently unavailable' : 'Available for consultations'
    };

    setAvailabilityData(newAvailability);
    updateDoctorAvailability(newAvailability);
  };

  // Handle appointment request response
  const handleAppointmentResponse = (patientId, accepted) => {
    const message = accepted 
      ? 'Your appointment request has been accepted. Please check your email for details.'
      : 'Your appointment request has been declined. Please try another time.';

    sendPrivateMessage(patientId, message);
    
    // Remove from requests list
    setAppointmentRequests(prev => prev.filter(req => req.patientId !== patientId));
  };

  // Send broadcast to all patients
  const sendBroadcastToPatients = () => {
    const message = 'Important: I will be unavailable tomorrow due to a conference.';
    emit('doctor_broadcast', { message, timestamp: new Date().toISOString() });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-blue-600">Doctor Portal - Socket.IO Example</h2>
      
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

      {/* Availability Management */}
      <div className="mb-6 p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">Availability Management</h3>
        <div className="flex items-center gap-4 mb-4">
          <span>Status: <strong>{availabilityData.isAvailable ? 'Available' : 'Unavailable'}</strong></span>
          <button
            onClick={handleAvailabilityUpdate}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Toggle Availability
          </button>
        </div>
        <p>Next Available: {new Date(availabilityData.nextAvailableSlot).toLocaleString()}</p>
      </div>

      {/* Online Patients */}
      <div className="mb-6 p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">Online Patients ({onlinePatients.length})</h3>
        {onlinePatients.length > 0 ? (
          <div className="space-y-2">
            {onlinePatients.map(patient => (
              <div key={patient.userId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span>{patient.email}</span>
                <span className="text-green-600 text-sm">Online</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No patients currently online</p>
        )}
      </div>

      {/* Appointment Requests */}
      <div className="mb-6 p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">Appointment Requests ({appointmentRequests.length})</h3>
        {appointmentRequests.length > 0 ? (
          <div className="space-y-3">
            {appointmentRequests.map((request, index) => (
              <div key={index} className="p-3 bg-yellow-50 rounded border">
                <p><strong>Patient:</strong> {request.patientName}</p>
                <p><strong>Request:</strong> {request.message || 'Appointment request'}</p>
                <p><strong>Time:</strong> {new Date(request.timestamp).toLocaleString()}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleAppointmentResponse(request.patientId, true)}
                    className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleAppointmentResponse(request.patientId, false)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No pending appointment requests</p>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
        <div className="flex gap-3">
          <button
            onClick={sendBroadcastToPatients}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Send Broadcast to Patients
          </button>
          <button
            onClick={() => emit('doctor_status_update', { status: 'busy', message: 'In consultation' })}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Set Status to Busy
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorPortalExample; 