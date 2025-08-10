import { useAuth } from '../../contexts/AuthContext'
import { useApi } from '../../contexts/ApiContext'
import { Calendar, Users, FileText, CreditCard, Clock, Heart, RefreshCw, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import ServicesSection from '../../components/services/ServicesSection'
import { useState, useEffect, useCallback } from 'react'

const PatientDashboard = () => {
  const { user } = useAuth()
  const { apiCall } = useApi()
  
  const [stats, setStats] = useState([])
  const [recentAppointments, setRecentAppointments] = useState([])
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

      // Fetch medical records count
      const medicalRecordsResponse = await apiCall('/medical-records', 'GET', {
        limit: 1
      })

      // Fetch payments
      const paymentsResponse = await apiCall('/payments', 'GET', {
        limit: 1
      })

      if (appointmentsResponse.success) {
        setRecentAppointments(appointmentsResponse.appointments || [])
      }

      // Calculate stats from real data
      const upcomingAppointments = appointmentsResponse.success ? appointmentsResponse.appointments?.length || 0 : 0
      const medicalRecordsCount = medicalRecordsResponse.success ? medicalRecordsResponse.pagination?.total || 0 : 0
      const totalPayments = paymentsResponse.success ? paymentsResponse.payments?.length || 0 : 0
      
      // Count unique doctors from appointments
      const doctorIds = new Set()
      if (appointmentsResponse.success && appointmentsResponse.appointments) {
        appointmentsResponse.appointments.forEach(apt => {
          if (apt.doctor?._id) {
            doctorIds.add(apt.doctor._id.toString())
          }
        })
      }

      const newStats = [
        {
          name: 'Upcoming Appointments',
          value: upcomingAppointments.toString(),
          icon: Calendar,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
        },
        {
          name: 'Medical Records',
          value: medicalRecordsCount.toString(),
          icon: FileText,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
        },
        {
          name: 'Total Payments',
          value: totalPayments.toString(),
          icon: CreditCard,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
        },
        {
          name: 'Doctors Consulted',
          value: doctorIds.size.toString(),
          icon: Users,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
        },
      ]

      setStats(newStats)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError('Failed to load dashboard data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [apiCall])

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const handleRefresh = () => {
    fetchDashboardData()
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    } catch (error) {
      return dateString
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
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
                Welcome back, {user?.firstName}!
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
            <div className="text-xs mt-1 opacity-75">
              Role: {user?.role || 'No role found'}
            </div>
            <div className="text-xs mt-1 opacity-50">
              Debug: {JSON.stringify({
                pub: user?.publicMetadata,
                unsafe: user?.unsafeMetadata,
                userId: user?.id
              })}
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="card">
              <div className="card-content">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {stat.name}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Appointments */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Appointments</h2>
          <Link to="/dashboard/appointments" className="btn-primary btn-sm">
            View All
          </Link>
        </div>
        <div className="card-content">
          {recentAppointments.length > 0 ? (
            <div className="space-y-4">
              {recentAppointments.map((appointment) => (
                <div key={appointment._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Dr. {appointment.doctor?.firstName} {appointment.doctor?.lastName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {appointment.doctor?.specialization || 'General Medicine'}
                      </p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>{formatDate(appointment.appointmentDate)}</span>
                        <span>{appointment.appointmentTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                    {appointment.reason && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs truncate">
                        {appointment.reason}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No upcoming appointments
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You don't have any appointments scheduled at the moment.
              </p>
              <Link to="/dashboard/appointments/book" className="btn-primary">
                Book Appointment
              </Link>
            </div>
          )}
        </div>
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

        <Link to="/dashboard/services" className="card hover:shadow-lg transition-shadow">
          <div className="card-content text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Health Services
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Explore our range of healthcare services and specialties
            </p>
          </div>
        </Link>
      </div>

      {/* Services Section */}
      <ServicesSection />
    </div>
  )
}

export default PatientDashboard
