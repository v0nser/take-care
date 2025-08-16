import { useAuth } from '../../contexts/AuthContext'
import { useApi } from '../../contexts/ApiContext'
import { Calendar, Users, FileText, CreditCard, Clock, Heart, RefreshCw, Loader2, TestTube, Activity } from 'lucide-react'
import { Link } from 'react-router-dom'
import ServicesSection from '../../components/services/ServicesSection'
import OverviewStats from '../../components/dashboards/OverviewStats'
import RecentActivity from '../../components/dashboards/RecentActivity'
import Chatbot from '../../components/dashboards/Chatbot'
import { useState, useEffect, useCallback } from 'react'
import { useSocket } from '../../contexts/SocketContext'

const PatientDashboard = () => {
  const { user } = useAuth()
  const { apiCall } = useApi()
  const { socket } = useSocket()
  
  const [stats, setStats] = useState([])
  const [recentAppointments, setRecentAppointments] = useState([])
  const [diagnosticBookings, setDiagnosticBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Fetch appointments
      const appointmentsResponse = await apiCall('/appointments', 'GET', {
        upcoming: 'true',
        limit: 5
      })

      // Fetch all appointments for stats
      const allAppointmentsResponse = await apiCall('/appointments', 'GET', {
        limit: 100
      })

      // Fetch diagnostic bookings
      const diagnosticsResponse = await apiCall('/diagnostics/my-bookings', 'GET', {
        limit: 5
      })

      // Fetch medical records count
      const medicalRecordsResponse = await apiCall('/medical-records', 'GET', {
        limit: 1
      })

      // Calculate stats from real data
      const upcomingAppointments = appointmentsResponse.success ? appointmentsResponse.appointments?.length || 0 : 0
      const completedAppointments = allAppointmentsResponse.success ? 
        allAppointmentsResponse.appointments?.filter(apt => apt.status === 'completed').length || 0 : 0
      const diagnosticBookingsData = diagnosticsResponse.success && Array.isArray(diagnosticsResponse.data) 
        ? diagnosticsResponse.data : []
      const diagnosticBookingCount = diagnosticBookingsData.length
      const pendingResults = diagnosticBookingsData.filter(booking => 
        booking.status === 'sample-collected' || booking.status === 'pending'
      ).length

      if (appointmentsResponse.success) {
        setRecentAppointments(appointmentsResponse.appointments || [])
      }

      if (diagnosticsResponse.success) {
        setDiagnosticBookings(diagnosticBookingsData)
      }
      const medicalRecordsCount = medicalRecordsResponse.success ? medicalRecordsResponse.pagination?.total || 0 : 0

      const newStats = [
        {
          name: 'Upcoming Appointments',
          value: upcomingAppointments,
          trend: upcomingAppointments > 0 ? 'Scheduled' : 'None scheduled'
        },
        {
          name: 'Diagnostic Bookings',
          value: diagnosticBookingCount,
          trend: pendingResults > 0 ? `${pendingResults} pending results` : 'All completed'
        },
        {
          name: 'Completed Appointments',
          value: completedAppointments,
          trend: completedAppointments > 0 ? 'Treatment history' : 'No history yet'
        },
        {
          name: 'Medical Records',
          value: medicalRecordsCount,
          trend: medicalRecordsCount > 0 ? 'Health data available' : 'No records yet'
        }
      ]

      setStats(newStats)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [apiCall])

  // Fetch data on component mount and on realtime events
  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  useEffect(() => {
    if (!socket) return
    const refetch = () => fetchDashboardData()
    socket.on('new_appointment', refetch)
    socket.on('appointment_update', refetch)
    socket.on('appointment_cancelled', refetch)
    socket.on('appointment_completed', refetch)
    socket.on('new_medical_record', refetch)
    socket.on('medical_record_updated', refetch)
    socket.on('payment_success', refetch)
    return () => {
      socket.off('new_appointment', refetch)
      socket.off('appointment_update', refetch)
      socket.off('appointment_cancelled', refetch)
      socket.off('appointment_completed', refetch)
      socket.off('new_medical_record', refetch)
      socket.off('medical_record_updated', refetch)
      socket.off('payment_success', refetch)
    }
  }, [socket, fetchDashboardData])

  const handleRefresh = () => {
    fetchDashboardData()
  }



  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-700 dark:to-secondary-700 rounded-lg px-6 py-8 text-white">
          <div className="flex items-center space-x-4">
            <Heart className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Loading Dashboard...</h1>
              <p className="text-primary-100 dark:text-primary-200">Please wait while we fetch your data</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-700 dark:to-secondary-700 rounded-lg px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Heart className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">
                Welcome, {user?.firstName}!
              </h1>
              <p className="text-primary-100 dark:text-primary-200">
                Your health journey continues here. Stay on track with your appointments and records.
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <div className="bg-white/20 px-3 py-1 rounded-full">
                <span className="text-sm font-medium">❤️ Patient Dashboard</span>
              </div>
              <button 
                onClick={handleRefresh}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
                title="Refresh dashboard data"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
            
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-700 dark:text-red-300">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Overview Stats */}
      <OverviewStats 
        stats={stats} 
        role="patient" 
        isLoading={isLoading}
        autoRefresh={true}
        refreshInterval={30000}
      />

      {/* Recent Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivity
          title="Recent Appointments"
          items={recentAppointments}
          type="appointments"
          role="patient"
          viewAllLink="/dashboard/appointments"
          isLoading={isLoading}
        />
        
        <RecentActivity
          title="Diagnostic Bookings"
          items={diagnosticBookings}
          type="diagnostics"
          role="patient"
          viewAllLink="/dashboard/diagnostics"
          isLoading={isLoading}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/dashboard/appointments/book" className="card hover:shadow-lg transition-shadow">
          <div className="card-content text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Book Appointment
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Schedule a consultation with our healthcare professionals
            </p>
          </div>
        </Link>

        <Link to="/dashboard/records" className="card hover:shadow-lg transition-shadow">
          <div className="card-content text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              View Records
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Access your medical history and health records
            </p>
          </div>
        </Link>

        <Link to="/dashboard/diagnostics" className="card hover:shadow-lg transition-shadow">
          <div className="card-content text-center">
            <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <TestTube className="h-8 w-8 text-teal-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Diagnostic Tests
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Book lab tests and health checkup packages
            </p>
          </div>
        </Link>
      </div>

      {/* Services Section */}
      <ServicesSection />
      
      {/* AI Chatbot */}
      <Chatbot role="patient" />
    </div>
  )
}

export default PatientDashboard
