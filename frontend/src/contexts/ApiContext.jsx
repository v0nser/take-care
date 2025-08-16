import { createContext, useContext, useMemo, useEffect } from 'react'
import { useAuth } from './AuthContext'
import axios from 'axios'

const ApiContext = createContext({})

export const useApi = () => {
  const context = useContext(ApiContext)
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider')
  }
  return context
}

export const ApiProvider = ({ children }) => {
  const { getToken } = useAuth()

  // Create axios instance once
  const api = useMemo(() => axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' },
  }), [])

  // Attach interceptors once
  useEffect(() => {
    const reqId = api.interceptors.request.use(
      async (config) => {
        try {
          const token = await getToken()
          if (token) config.headers.Authorization = `Bearer ${token}`
        } catch (error) {
          console.error('Failed to get auth token:', error)
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    const resId = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.error('Unauthorized request:', error.response.data)
        } else if (error.response?.status === 403) {
          console.error('Forbidden request:', error.response.data)
        } else if (error.response?.status >= 500) {
          console.error('Server error:', error.response.data)
        }
        return Promise.reject(error)
      }
    )

    return () => {
      api.interceptors.request.eject(reqId)
      api.interceptors.response.eject(resId)
    }
  }, [api, getToken])

  // Generic apiCall with proper GET params + backwards-compat payload spreading
  const apiCall = async (endpoint, method = 'GET', data = null, extraHeaders = {}) => {
    try {
      const config = { headers: { ...extraHeaders } }
      let response

      switch (method.toUpperCase()) {
        case 'GET':
          response = await api.get(endpoint, { ...config, params: data || {} })
          break
        case 'POST':
          response = await api.post(endpoint, data, config)
          break
        case 'PUT':
          response = await api.put(endpoint, data, config)
          break
        case 'PATCH':
          response = await api.patch(endpoint, data, config)
          break
        case 'DELETE':
          response = await api.delete(endpoint, { ...config, data })
          break
        default:
          throw new Error(`Unsupported method: ${method}`)
      }

      const payload = response?.data ?? {}
      return {
        success: true,
        // Spread payload so existing callers using .appointments/.stats still work
        ...payload,
        // Also keep raw data available for new callers
        data: payload,
        // Legacy convenience mapping
        booking: payload?.booking || undefined,
      }
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // API methods (kept as in your code)
  const apiMethods = {
    // Auth endpoints
    auth: {
      me: () => api.get('/auth/me'),
      updateRole: (userId, role) => api.put('/auth/role', { userId, role }),
    },

    // User endpoints
    users: {
      getProfile: () => api.get('/users/profile'),
      updateProfile: (data) => api.put('/users/profile', data),
      getDoctors: (params) => api.get('/users/doctors', { params }),
      getDoctor: (id) => api.get(`/users/doctor/${id}`),
      getAllUsers: (params) => api.get('/users/all', { params }),
      toggleUserStatus: (id) => api.put(`/users/${id}/toggle-status`),
      getUserStats: () => api.get('/users/stats'),
    },

    // Appointment endpoints
    appointments: {
      create: (data) => api.post('/appointments', data),
      getAll: (params) => api.get('/appointments', { params }),
      getById: (id) => api.get(`/appointments/${id}`),
      updateStatus: (id, data) => api.put(`/appointments/${id}/status`, data),
      complete: (id, data) => api.put(`/appointments/${id}/complete`, data),
      cancel: (id, data) => api.delete(`/appointments/${id}`, { data }),
      getStats: () => api.get('/appointments/stats/overview'),
    },

    // Availability endpoints
    availability: {
      getDoctorAvailability: (doctorId, params) => api.get(`/availability/doctor/${doctorId}`, { params }),
      getMySchedule: () => api.get('/availability/my-schedule'),
      updateMySchedule: (data) => api.put('/availability/my-schedule', data),
      blockDate: (data) => api.post('/availability/block-date', data),
      unblockDate: (data) => api.delete('/availability/unblock-date', { data }),
      generateSlots: (data) => api.post('/availability/generate-slots', data),
    },

    // Payment endpoints
    payments: {
      createOrder: (data) => api.post('/payments/create-order', data),
      verify: (data) => api.post('/payments/verify', data),
      getAll: (params) => api.get('/payments', { params }),
      getById: (id) => api.get(`/payments/${id}`),
      refund: (id, data) => api.post(`/payments/${id}/refund`, data),
      getStats: () => api.get('/payments/stats/overview'),
    },

    // Medical records endpoints
    medicalRecords: {
      create: (data) => api.post('/medical-records', data),
      getAll: (params) => api.get('/medical-records', { params }),
      getById: (id) => api.get(`/medical-records/${id}`),
      update: (id, data) => api.put(`/medical-records/${id}`, data),
      delete: (id) => api.delete(`/medical-records/${id}`),
      getPatientSummary: (patientId) => api.get(`/medical-records/patient/${patientId}/summary`),
      share: (id, data) => api.post(`/medical-records/${id}/share`, data),
    },

    // Notification endpoints
    notifications: {
      getAll: () => api.get('/notifications'),
      sendTest: (data) => api.post('/notifications/test', data),
      broadcast: (data) => api.post('/notifications/broadcast', data),
    },

    // Activity logs endpoints
    logs: {
      getAll: (params) => api.get('/logs', { params }),
      getMy: (params) => api.get('/logs/my', { params }),
      getStats: (params) => api.get('/logs/stats', { params }),
      getActions: () => api.get('/logs/actions'),
      getResources: () => api.get('/logs/resources'),
      cleanup: (params) => api.delete('/logs/cleanup', { params }),
    },

    // Meetings/Teleconsultation endpoints
    meetings: {
      joinMeeting: (appointmentId) => api.get(`/meetings/${appointmentId}/join`),
      startMeeting: (appointmentId) => api.post(`/meetings/${appointmentId}/start`),
      endMeeting: (appointmentId, data = {}) => api.post(`/meetings/${appointmentId}/end`, data),
      getUpcoming: () => api.get('/meetings/upcoming'),
      sendJoinNotification: (appointmentId) => api.post(`/meetings/${appointmentId}/join-notification`),
      updatePreConsultation: (appointmentId, data) => api.put(`/meetings/${appointmentId}/pre-consultation`, data),
    },

    // Diagnostics endpoints
    diagnostics: {
      create: (data) => api.post('/diagnostics', data),
      myBookings: (params) => api.get('/diagnostics/my-bookings', { params }),
      getById: (id) => api.get(`/diagnostics/${id}`),
      updateStatus: (id, data) => api.patch(`/diagnostics/${id}/status`, data),
      update: (id, data) => api.put(`/diagnostics/${id}`, data),
      cancel: (id, data) => api.patch(`/diagnostics/${id}/cancel`, data),
      adminAll: (params) => api.get('/diagnostics/admin/all', { params }),
    },
  }

  const value = { api, apiCall, ...apiMethods }

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>
}

export default ApiContext