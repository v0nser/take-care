import { io } from 'socket.io-client';

class SocketClient {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.eventListeners = new Map();
    this.connectionStatus = 'disconnected'; // 'connecting', 'connected', 'disconnected', 'error'
  }

  // Initialize socket connection with JWT authentication
  connect(token, options = {}) {
    if (this.socket && this.isConnected) {
      console.log('Socket already connected');
      return this.socket;
    }

    const {
      serverUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000',
      transports = ['websocket', 'polling'],
      timeout = 20000,
      forceNew = true
    } = options;

    try {
      console.log('🔌 Connecting to Socket.IO server:', serverUrl);
      
      this.socket = io(serverUrl, {
        transports,
        timeout,
        forceNew,
        auth: {
          token: token
        },
        extraHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      this.setupEventHandlers();
      this.setupReconnection();
      
      return this.socket;
    } catch (error) {
      console.error('Failed to create socket connection:', error);
      this.connectionStatus = 'error';
      throw error;
    }
  }

  // Setup event handlers
  setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
      this.isConnected = true;
      this.connectionStatus = 'connected';
      this.reconnectAttempts = 0;
      
      // Emit connection event
      this.emit('user_connected', {
        timestamp: new Date().toISOString()
      });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      this.isConnected = false;
      this.connectionStatus = 'disconnected';
      
      if (reason === 'io server disconnect') {
        // Server disconnected us, try to reconnect
        this.socket.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('🔌 Socket connection error:', error);
      this.connectionStatus = 'error';
      
      if (error.message.includes('Authentication')) {
        console.error('Authentication failed, please login again');
        this.disconnect();
        // You can emit a custom event here to handle auth errors in your app
        window.dispatchEvent(new CustomEvent('socket_auth_error', { detail: error }));
      }
    });

    this.socket.on('auth_error', (error) => {
      console.error('🔐 Socket authentication error:', error);
      this.connectionStatus = 'error';
      window.dispatchEvent(new CustomEvent('socket_auth_error', { detail: error }));
    });

    // Handle role-specific events
    this.socket.on('user_online', (data) => {
      console.log('👤 User came online:', data);
      this.emitCustomEvent('user_online', data);
    });

    this.socket.on('user_offline', (data) => {
      console.log('👤 User went offline:', data);
      this.emitCustomEvent('user_offline', data);
    });

    this.socket.on('user_status_change', (data) => {
      console.log('📊 User status changed:', data);
      this.emitCustomEvent('user_status_change', data);
    });

    // Handle private messages
    this.socket.on('private_message', (data) => {
      console.log('💬 Private message received:', data);
      this.emitCustomEvent('private_message', data);
    });

    // Handle role-specific events
    this.socket.on('doctor_availability_updated', (data) => {
      console.log('📅 Doctor availability updated:', data);
      this.emitCustomEvent('doctor_availability_updated', data);
    });

    this.socket.on('new_appointment_request', (data) => {
      console.log('📋 New appointment request:', data);
      this.emitCustomEvent('new_appointment_request', data);
    });

    this.socket.on('admin_broadcast', (data) => {
      console.log('📢 Admin broadcast:', data);
      this.emitCustomEvent('admin_broadcast', data);
    });
  }

  // Setup reconnection logic
  setupReconnection() {
    if (!this.socket) return;

    this.socket.on('disconnect', (reason) => {
      if (reason === 'io client disconnect') {
        // Client disconnected, don't reconnect
        return;
      }

      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
        
        console.log(`🔄 Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
        
        setTimeout(() => {
          if (this.socket && !this.isConnected) {
            this.socket.connect();
          }
        }, delay);
      } else {
        console.error('Max reconnection attempts reached');
        this.connectionStatus = 'error';
      }
    });
  }

  // Emit custom events to the DOM for easy listening
  emitCustomEvent(eventName, data) {
    window.dispatchEvent(new CustomEvent(`socket_${eventName}`, { detail: data }));
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      console.log('🔌 Disconnecting socket');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.connectionStatus = 'disconnected';
      this.reconnectAttempts = 0;
    }
  }

  // Emit events
  emit(eventName, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(eventName, data);
    } else {
      console.warn('Socket not connected, cannot emit event:', eventName);
    }
  }

  // Join rooms
  joinRoom(roomName) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join_room', roomName);
    }
  }

  // Leave rooms
  leaveRoom(roomName) {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave_room', roomName);
    }
  }

  // Send private messages
  sendPrivateMessage(recipientId, message) {
    if (this.socket && this.isConnected) {
      this.socket.emit('private_message', { recipientId, message });
    }
  }

  // Role-specific methods
  updateDoctorAvailability(data) {
    if (this.socket && this.isConnected) {
      this.socket.emit('doctor_availability_update', data);
    }
  }

  sendAppointmentRequest(data) {
    if (this.socket && this.isConnected) {
      this.socket.emit('appointment_request', data);
    }
  }

  sendAdminBroadcast(data) {
    if (this.socket && this.isConnected) {
      this.socket.emit('admin_broadcast', data);
    }
  }

  // Get connection status
  getConnectionStatus() {
    return this.connectionStatus;
  }

  // Check if connected
  isSocketConnected() {
    return this.isConnected && this.socket?.connected;
  }

  // Get socket ID
  getSocketId() {
    return this.socket?.id;
  }

  // Add custom event listener
  on(eventName, callback) {
    if (!this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, []);
    }
    this.eventListeners.get(eventName).push(callback);
    
    // Also listen to the DOM event
    const domEventName = `socket_${eventName}`;
    window.addEventListener(domEventName, callback);
  }

  // Remove custom event listener
  off(eventName, callback) {
    if (this.eventListeners.has(eventName)) {
      const listeners = this.eventListeners.get(eventName);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
    
    // Remove DOM event listener
    const domEventName = `socket_${eventName}`;
    window.removeEventListener(domEventName, callback);
  }

  // Remove all event listeners
  removeAllListeners() {
    this.eventListeners.forEach((listeners, eventName) => {
      listeners.forEach(callback => {
        const domEventName = `socket_${eventName}`;
        window.removeEventListener(domEventName, callback);
      });
    });
    this.eventListeners.clear();
  }
}

// Create singleton instance
const socketClient = new SocketClient();

export default socketClient; 