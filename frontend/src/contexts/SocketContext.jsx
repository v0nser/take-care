import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { useAuth } from './AuthContext'
import { io } from 'socket.io-client'
import toast from 'react-hot-toast'

const SocketContext = createContext({
  socket: null,
  isConnected: false,
  connectionStatus: 'disconnected', // 'connecting', 'connected', 'disconnected', 'error'
  lastConnected: null,
  reconnectAttempts: 0,
})

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

export const SocketProvider = ({ children }) => {
  const { getToken, user, isAuthenticated } = useAuth()
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState('disconnected')
  const [lastConnected, setLastConnected] = useState(null)
  const [reconnectAttempts, setReconnectAttempts] = useState(0)
  const reconnectTimeoutRef = useRef(null)
  const maxReconnectAttempts = 5

  // Cleanup function
  const cleanup = (socketInstance) => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    
    if (socketInstance) {
      socketInstance.removeAllListeners()
      socketInstance.disconnect()
    }
  }

  const connectSocket = async () => {
    // Don't connect if user is not authenticated
    if (!isAuthenticated || !user) {
      setConnectionStatus('disconnected')
      return
    }

    // Don't reconnect if max attempts reached
    if (reconnectAttempts >= maxReconnectAttempts) {
      setConnectionStatus('error')
      console.error('Max reconnection attempts reached')
      return
    }

    try {
      setConnectionStatus('connecting')
      console.log(`Socket connection attempt ${reconnectAttempts + 1}/${maxReconnectAttempts}`)
      
      const token = await getToken()
      if (!token) {
        throw new Error('No authentication token available')
      }
      
      // Create unique socket instance ID for multiple frontend instances
      const instanceId = typeof __INSTANCE_ID__ !== 'undefined' ? __INSTANCE_ID__ : 'default'
      const port = typeof __PORT__ !== 'undefined' ? __PORT__ : 'unknown'
      
      const socketInstance = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
        auth: {
          token,
          instanceId, // Send instance ID to backend
          port,       // Send port info to backend
        },
        transports: ['websocket', 'polling'], // Fallback to polling if websocket fails
        autoConnect: true,
        forceNew: true,
        timeout: 10000, // 10 second timeout
        reconnection: true,
        reconnectionAttempts: 3,
        reconnectionDelay: 1000,
        // Add unique query parameters to distinguish instances
        query: {
          instanceId,
          port,
          timestamp: Date.now(),
        }
      })

      // Connection event handlers
      socketInstance.on('connect', () => {
        console.log('✅ Socket connected successfully')
        setIsConnected(true)
        setConnectionStatus('connected')
        setLastConnected(new Date())
        setReconnectAttempts(0) // Reset attempts on successful connection
        
        // Join user-specific room
        if (user?.id || user?._id) {
          const userId = user.id || user._id
          socketInstance.emit('join_user_room', userId)
          console.log(`Joined user room: ${userId}`)
          
          // Join role-specific room for doctors
          if (user.role === 'doctor') {
            socketInstance.emit('join_doctor_room', userId)
            console.log(`Joined doctor room: ${userId}`)
          }
        }
        
        // Clear reconnection timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current)
          reconnectTimeoutRef.current = null
        }

        // Show success toast only on reconnection
        if (reconnectAttempts > 0) {
          toast.success('Connection restored')
        }
      })

      socketInstance.on('disconnect', (reason) => {
        console.log('❌ Socket disconnected:', reason)
        setIsConnected(false)
        setConnectionStatus('disconnected')
        
        // Handle different disconnect reasons
        if (reason === 'io server disconnect') {
          // Server initiated disconnect, try to reconnect
          console.log('Server disconnected, attempting reconnection...')
          scheduleReconnect()
        } else if (reason === 'transport close' || reason === 'transport error') {
          // Network issues, try to reconnect
          console.log('Network issue detected, attempting reconnection...')
          scheduleReconnect()
        }
        // 'io client disconnect' means client initiated, don't reconnect
      })

      socketInstance.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error.message)
        setIsConnected(false)
        setConnectionStatus('error')
        
        // Only show error toast if it's not a retry attempt
        if (reconnectAttempts === 0) {
          toast.error('Connection failed. Retrying...')
        }
        
        scheduleReconnect()
      })

      // Authentication error
      socketInstance.on('auth_error', (error) => {
        console.error('❌ Socket authentication error:', error)
        setConnectionStatus('error')
        toast.error('Authentication failed. Please log in again.')
        cleanup(socketInstance)
      })

      // Real-time event handlers
      socketInstance.on('new_appointment', (data) => {
        console.log('📅 New appointment notification:', data)
        toast.success(`New appointment request from ${data.appointment?.patient?.firstName || 'Patient'}`)
      })

      socketInstance.on('appointment_update', (data) => {
        console.log('📅 Appointment update:', data)
        toast.success(data.message || 'Appointment updated')
      })

      socketInstance.on('appointment_cancelled', (data) => {
        console.log('❌ Appointment cancelled:', data)
        toast.error(data.message || 'Appointment cancelled')
      })

      socketInstance.on('appointment_completed', (data) => {
        console.log('✅ Appointment completed:', data)
        toast.success(data.message || 'Appointment completed')
      })

      socketInstance.on('payment_success', (data) => {
        console.log('💳 Payment success:', data)
        toast.success(data.message || 'Payment successful')
      })

      socketInstance.on('meeting_created', (data) => {
        console.log('🎥 Meeting created:', data)
        toast.success(data.message || 'Video meeting ready')
      })

      socketInstance.on('meeting_ended', (data) => {
        console.log('🎥 Meeting ended:', data)
        toast.info(data.message || 'Meeting ended')
      })

      socketInstance.on('user_joined_meeting', (data) => {
        console.log('👤 User joined meeting:', data)
        toast.info(data.message || 'User joined meeting')
      })

      socketInstance.on('new_medical_record', (data) => {
        console.log('📋 New medical record:', data)
        toast.success(data.message || 'New medical record added')
      })

      socketInstance.on('medical_record_updated', (data) => {
        console.log('📋 Medical record updated:', data)
        toast.info(data.message || 'Medical record updated')
      })

      socketInstance.on('medical_record_shared', (data) => {
        console.log('📋 Medical record shared:', data)
        toast.info(data.message || 'Medical record shared')
      })

      socketInstance.on('test_notification', (data) => {
        console.log('🧪 Test notification:', data)
        toast.success(`Test: ${data.message}`)
      })

      socketInstance.on('broadcast_all', (data) => {
        console.log('📢 Broadcast to all:', data)
        toast.info(`Admin: ${data.message}`)
      })

      socketInstance.on('broadcast_patient', (data) => {
        console.log('📢 Broadcast to patients:', data)
        if (user?.role === 'patient') {
          toast.info(`Admin: ${data.message}`)
        }
      })

      socketInstance.on('broadcast_doctor', (data) => {
        console.log('📢 Broadcast to doctors:', data)
        if (user?.role === 'doctor') {
          toast.info(`Admin: ${data.message}`)
        }
      })

      setSocket(socketInstance)
      
    } catch (error) {
      console.error('❌ Failed to connect socket:', error)
      setIsConnected(false)
      setConnectionStatus('error')
      
      scheduleReconnect()
    }
  }

  const scheduleReconnect = () => {
    if (reconnectAttempts >= maxReconnectAttempts) {
      setConnectionStatus('error')
      toast.error('Unable to establish connection. Please refresh the page.')
      return
    }

    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000) // Exponential backoff, max 30s
    console.log(`Scheduling reconnection in ${delay}ms (attempt ${reconnectAttempts + 1}/${maxReconnectAttempts})`)
    
    setReconnectAttempts(prev => prev + 1)
    
    reconnectTimeoutRef.current = setTimeout(() => {
      connectSocket()
    }, delay)
  }

  // Connect when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      connectSocket()
    } else {
      // Cleanup when user logs out
      cleanup(socket)
      setSocket(null)
      setIsConnected(false)
      setConnectionStatus('disconnected')
      setReconnectAttempts(0)
    }

    // Cleanup on unmount
    return () => {
      cleanup(socket)
    }
  }, [isAuthenticated, user?.id, user?._id])

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      console.log('📶 Browser is online')
      if (!isConnected && isAuthenticated && user) {
        setReconnectAttempts(0) // Reset attempts when coming back online
        connectSocket()
      }
    }

    const handleOffline = () => {
      console.log('📵 Browser is offline')
      setConnectionStatus('disconnected')
      toast.error('You are offline')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [isConnected, isAuthenticated, user])

  const value = {
    socket,
    isConnected,
    connectionStatus,
    lastConnected,
    reconnectAttempts,
    maxReconnectAttempts,
    isOnline: navigator.onLine,
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}
