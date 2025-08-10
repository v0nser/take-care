import { useEffect, useRef, useState, useCallback } from 'react';
import socketClient from '../utils/socketClient.js';

export const useSocket = (token, options = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [error, setError] = useState(null);
  const eventListenersRef = useRef(new Map());

  // Connect to socket when component mounts or token changes
  useEffect(() => {
    if (!token) {
      setConnectionStatus('disconnected');
      setIsConnected(false);
      return;
    }

    try {
      setConnectionStatus('connecting');
      setError(null);
      
      // Connect to socket
      socketClient.connect(token, options);
      
      // Update local state
      setIsConnected(socketClient.isSocketConnected());
      setConnectionStatus(socketClient.getConnectionStatus());
      
    } catch (err) {
      setError(err.message);
      setConnectionStatus('error');
      setIsConnected(false);
    }

    // Cleanup function
    return () => {
      // Remove all event listeners added by this hook
      eventListenersRef.current.forEach((callback, eventName) => {
        socketClient.off(eventName, callback);
      });
      eventListenersRef.current.clear();
    };
  }, [token, options]);

  // Listen to connection status changes
  useEffect(() => {
    const handleConnect = () => {
      setIsConnected(true);
      setConnectionStatus('connected');
      setError(null);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      setConnectionStatus('disconnected');
    };

    const handleError = (event) => {
      setError(event.detail?.message || 'Connection error');
      setConnectionStatus('error');
    };

    // Listen to socket events
    window.addEventListener('socket_connect', handleConnect);
    window.addEventListener('socket_disconnect', handleDisconnect);
    window.addEventListener('socket_connect_error', handleError);
    window.addEventListener('socket_auth_error', handleError);

    return () => {
      window.removeEventListener('socket_connect', handleConnect);
      window.removeEventListener('socket_disconnect', handleDisconnect);
      window.removeEventListener('socket_connect_error', handleError);
      window.removeEventListener('socket_auth_error', handleError);
    };
  }, []);

  // Add event listener
  const on = useCallback((eventName, callback) => {
    if (eventListenersRef.current.has(eventName)) {
      // Remove previous listener
      const prevCallback = eventListenersRef.current.get(eventName);
      socketClient.off(eventName, prevCallback);
    }
    
    // Add new listener
    eventListenersRef.current.set(eventName, callback);
    socketClient.on(eventName, callback);
  }, []);

  // Remove event listener
  const off = useCallback((eventName) => {
    if (eventListenersRef.current.has(eventName)) {
      const callback = eventListenersRef.current.get(eventName);
      socketClient.off(eventName, callback);
      eventListenersRef.current.delete(eventName);
    }
  }, []);

  // Emit event
  const emit = useCallback((eventName, data) => {
    socketClient.emit(eventName, data);
  }, []);

  // Join room
  const joinRoom = useCallback((roomName) => {
    socketClient.joinRoom(roomName);
  }, []);

  // Leave room
  const leaveRoom = useCallback((roomName) => {
    socketClient.leaveRoom(roomName);
  }, []);

  // Send private message
  const sendPrivateMessage = useCallback((recipientId, message) => {
    socketClient.sendPrivateMessage(recipientId, message);
  }, []);

  // Role-specific methods
  const updateDoctorAvailability = useCallback((data) => {
    socketClient.updateDoctorAvailability(data);
  }, []);

  const sendAppointmentRequest = useCallback((data) => {
    socketClient.sendAppointmentRequest(data);
  }, []);

  const sendAdminBroadcast = useCallback((data) => {
    socketClient.sendAdminBroadcast(data);
  }, []);

  // Disconnect
  const disconnect = useCallback(() => {
    socketClient.disconnect();
    setIsConnected(false);
    setConnectionStatus('disconnected');
  }, []);

  return {
    // State
    isConnected,
    connectionStatus,
    error,
    
    // Methods
    on,
    off,
    emit,
    joinRoom,
    leaveRoom,
    sendPrivateMessage,
    updateDoctorAvailability,
    sendAppointmentRequest,
    sendAdminBroadcast,
    disconnect,
    
    // Direct access to socket client
    socket: socketClient.socket,
    socketId: socketClient.getSocketId()
  };
}; 