import React, { useEffect, useState } from 'react';
import { useSocket } from '../../hooks/useSocket.js';

const AdminPortalExample = ({ token }) => {
  const [onlineUsers, setOnlineUsers] = useState({
    doctors: [],
    patients: [],
    admins: []
  });
  const [userStatusHistory, setUserStatusHistory] = useState([]);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [systemStats, setSystemStats] = useState({
    totalOnline: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalAdmins: 0
  });

  const {
    isConnected,
    connectionStatus,
    error,
    on,
    off,
    emit,
    sendAdminBroadcast
  } = useSocket(token, {
    serverUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000'
  });

  // Listen for user status changes
  useEffect(() => {
    on('user_status_change', (data) => {
      const { userId, email, role, status, timestamp } = data;
      
      // Update user status history
      setUserStatusHistory(prev => [...prev, { userId, email, role, status, timestamp }]);
      
      // Update online users count
      if (status === 'online') {
        setOnlineUsers(prev => ({
          ...prev,
          [role + 's']: [...prev[role + 's'], { userId, email, role, timestamp }]
        }));
      } else if (status === 'offline') {
        setOnlineUsers(prev => ({
          ...prev,
          [role + 's']: prev[role + 's'].filter(user => user.userId !== userId)
        }));
      }
    });

    // Listen for role-specific events
    on('user_online', (data) => {
      if (data.role === 'admin') {
        setOnlineUsers(prev => ({
          ...prev,
          admins: [...prev.admins, data]
        }));
      }
    });

    on('user_offline', (data) => {
      if (data.role === 'admin') {
        setOnlineUsers(prev => ({
          ...prev,
          admins: prev.admins.filter(user => user.userId !== data.userId)
        }));
      }
    });

    // Cleanup
    return () => {
      off('user_status_change');
      off('user_online');
      off('user_offline');
    };
  }, [on, off]);

  // Update system stats when online users change
  useEffect(() => {
    const totalDoctors = onlineUsers.doctors.length;
    const totalPatients = onlineUsers.patients.length;
    const totalAdmins = onlineUsers.admins.length;
    const totalOnline = totalDoctors + totalPatients + totalAdmins;

    setSystemStats({
      totalOnline,
      totalDoctors,
      totalPatients,
      totalAdmins
    });
  }, [onlineUsers]);

  // Send broadcast to all users
  const handleBroadcast = () => {
    if (!broadcastMessage.trim()) {
      alert('Please enter a message to broadcast');
      return;
    }

    const broadcastData = {
      message: broadcastMessage,
      type: 'announcement',
      priority: 'normal',
      timestamp: new Date().toISOString()
    };

    sendAdminBroadcast(broadcastData);
    setBroadcastMessage('');
    alert('Broadcast sent to all users!');
  };

  // Send emergency broadcast
  const handleEmergencyBroadcast = () => {
    const emergencyData = {
      message: 'EMERGENCY: System maintenance scheduled for tonight at 2 AM. Please save your work.',
      type: 'emergency',
      priority: 'high',
      timestamp: new Date().toISOString()
    };

    sendAdminBroadcast(emergencyData);
    alert('Emergency broadcast sent!');
  };

  // Clear user status history
  const clearHistory = () => {
    setUserStatusHistory([]);
  };

  // Get user count by role
  const getUserCountByRole = (role) => {
    return onlineUsers[role + 's']?.length || 0;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-red-600">Admin Portal - Socket.IO Example</h2>
      
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

      {/* System Statistics */}
      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border text-center">
          <div className="text-2xl font-bold text-blue-600">{systemStats.totalOnline}</div>
          <div className="text-sm text-gray-600">Total Online</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg border text-center">
          <div className="text-2xl font-bold text-green-600">{systemStats.totalDoctors}</div>
          <div className="text-sm text-gray-600">Doctors Online</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg border text-center">
          <div className="text-2xl font-bold text-purple-600">{systemStats.totalPatients}</div>
          <div className="text-sm text-gray-600">Patients Online</div>
        </div>
        <div className="p-4 bg-red-50 rounded-lg border text-center">
          <div className="text-2xl font-bold text-red-600">{systemStats.totalAdmins}</div>
          <div className="text-sm text-gray-600">Admins Online</div>
        </div>
      </div>

      {/* Online Users by Role */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Doctors */}
        <div className="p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2 text-green-600">
            Online Doctors ({getUserCountByRole('doctor')})
          </h3>
          {onlineUsers.doctors.length > 0 ? (
            <div className="space-y-2">
              {onlineUsers.doctors.map(doctor => (
                <div key={doctor.userId} className="p-2 bg-green-50 rounded text-sm">
                  <div className="font-medium">{doctor.email}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(doctor.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No doctors online</p>
          )}
        </div>

        {/* Patients */}
        <div className="p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2 text-blue-600">
            Online Patients ({getUserCountByRole('patient')})
          </h3>
          {onlineUsers.patients.length > 0 ? (
            <div className="space-y-2">
              {onlineUsers.patients.map(patient => (
                <div key={patient.userId} className="p-2 bg-blue-50 rounded text-sm">
                  <div className="font-medium">{patient.email}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(patient.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No patients online</p>
          )}
        </div>

        {/* Admins */}
        <div className="p-4 rounded-lg border">
          <h3 className="text-lg font-semibold mb-2 text-red-600">
            Online Admins ({getUserCountByRole('admin')})
          </h3>
          {onlineUsers.admins.length > 0 ? (
            <div className="space-y-2">
              {onlineUsers.admins.map(admin => (
                <div key={admin.userId} className="p-2 bg-red-50 rounded text-sm">
                  <div className="font-medium">{admin.email}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(admin.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No other admins online</p>
          )}
        </div>
      </div>

      {/* Broadcast System */}
      <div className="mb-6 p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">Broadcast System</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Broadcast Message:</label>
            <textarea
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              placeholder="Enter message to broadcast to all users..."
              className="w-full p-2 border rounded"
              rows="3"
            />
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handleBroadcast}
              disabled={!broadcastMessage.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Send Broadcast
            </button>
            <button
              onClick={handleEmergencyBroadcast}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Emergency Broadcast
            </button>
          </div>
        </div>
      </div>

      {/* User Status History */}
      <div className="mb-6 p-4 rounded-lg border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">User Status History ({userStatusHistory.length})</h3>
          <button
            onClick={clearHistory}
            className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
          >
            Clear History
          </button>
        </div>
        
        {userStatusHistory.length > 0 ? (
          <div className="max-h-64 overflow-y-auto space-y-2">
            {userStatusHistory.slice(-20).reverse().map((entry, index) => (
              <div key={index} className={`p-2 rounded text-sm ${
                entry.status === 'online' ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-medium">{entry.email}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    entry.status === 'online' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                  }`}>
                    {entry.status}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {entry.role} • {new Date(entry.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No status changes recorded</p>
        )}
      </div>

      {/* System Actions */}
      <div className="p-4 rounded-lg border">
        <h3 className="text-lg font-semibold mb-2">System Actions</h3>
        <div className="flex gap-3">
          <button
            onClick={() => emit('admin_system_check', { action: 'health_check', timestamp: new Date().toISOString() })}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            System Health Check
          </button>
          <button
            onClick={() => emit('admin_user_audit', { action: 'audit_users', timestamp: new Date().toISOString() })}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            User Audit
          </button>
          <button
            onClick={() => emit('admin_metrics', { action: 'get_metrics', timestamp: new Date().toISOString() })}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Get Metrics
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPortalExample; 