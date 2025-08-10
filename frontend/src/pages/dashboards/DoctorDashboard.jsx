import { useAuth } from '../../contexts/AuthContext'
import { useApi } from '../../contexts/ApiContext'
import { Calendar, Users, FileText, CreditCard, Clock, Stethoscope, RefreshCw, Settings, Video, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react'

const DoctorDashboard = () => {
  const { user } = useAuth()
  const { apiCall } = useApi()
  
  const [stats, setStats] = useState([])
  const [todaysAppointments, setTodaysAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0]
      
      // Fetch today's appointments
      const appointmentsResponse = await apiCall('/appointments', 'GET', {
        date: today,
        limit: 10
      })

      // Fetch appointment statistics
      const statsResponse = await apiCall('/appointments/stats/overview', 'GET')

      // Fetch payment statistics
      const paymentsResponse = await apiCall('/payments/stats/overview', 'GET')

      if (appointmentsResponse.success) {
        setTodaysAppointments(appointmentsResponse.appointments || [])
      }

      // Calculate stats from real data
      const todayAppointments = appointmentsResponse.success ? appointmentsResponse.appointments?.length || 0 : 0
      const totalPatients = statsResponse.success ? statsResponse.stats?.uniquePatients || 0 : 0
      const monthlyRevenue = paymentsResponse.success ? paymentsResponse.stats?.monthlyRevenue || 0 : 0
      const pendingReviews = statsResponse.success ? statsResponse.stats?.pendingAppointments || 0 : 0

      const newStats = [
        {
          name: "Today's Appointments",
          value: todayAppointments.toString(),
          icon: Calendar,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
        },
        {
          name: 'Total Patients',
          value: totalPatients.toString(),
          icon: Users,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
        },
        {
          name: 'Monthly Revenue',
          value: `₹${monthlyRevenue.toLocaleString()}`,
          icon: CreditCard,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
        },
        {
          name: 'Pending Reviews',
          value: pendingReviews.toString(),
          icon: Clock,
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

  const formatTime = (timeString) => {
    if (!timeString) return ''
    return timeString
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
      case 'in-progress':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-accent-600 to-primary-600 dark:from-accent-700 dark:to-primary-700 rounded-lg px-6 py-8 text-white">
          <div className="flex items-center space-x-4">
            <Stethoscope className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Loading Dashboard...</h1>
              <p className="text-accent-100 dark:text-accent-200">Please wait while we fetch your data</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-accent-600" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-accent-600 to-primary-600 dark:from-accent-700 dark:to-primary-700 rounded-lg px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Stethoscope className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">
                Good morning, Dr. {user?.lastName}!
              </h1>
              <p className="text-accent-100 dark:text-accent-200">
                You have {todaysAppointments.length} appointments scheduled for today. Let's make a difference!
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <div className="bg-white/20 px-3 py-1 rounded-full">
                <span className="text-sm font-medium">🩺 Doctor Dashboard</span>
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

      {/* Today's Appointments */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Today's Appointments</h2>
          <Link to="/dashboard/appointments" className="btn-primary btn-sm">
            View All
          </Link>
        </div>
        <div className="card-content">
          {todaysAppointments.length > 0 ? (
            <div className="space-y-4">
              {todaysAppointments.map((appointment) => (
                <div key={appointment._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-accent-100 dark:bg-accent-900/30 rounded-full flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-accent-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {appointment.patient?.firstName} {appointment.patient?.lastName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {appointment.reason || 'Consultation'}
                      </p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span>{formatTime(appointment.appointmentTime)}</span>
                        {appointment.consultationType && (
                          <span className="flex items-center space-x-1">
                            <Video className="h-3 w-3" />
                            <span>{appointment.consultationType}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                    {appointment.consultationFee && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        ₹{appointment.consultationFee}
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
                No appointments today
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You don't have any appointments scheduled for today.
              </p>
              <Link to="/dashboard/availability" className="btn-primary">
                Set Availability
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/dashboard/appointments" className="card hover:shadow-lg transition-shadow">
          <div className="card-content text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Manage Appointments
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              View and manage all your patient appointments
            </p>
          </div>
        </Link>

        <Link to="/dashboard/availability" className="card hover:shadow-lg transition-shadow">
          <div className="card-content text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Set Availability
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Configure your working hours and availability
            </p>
          </div>
        </Link>

        <Link to="/dashboard/patients" className="card hover:shadow-lg transition-shadow">
          <div className="card-content text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Patient Records
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Access patient medical history and records
            </p>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Recent Activity</h2>
        </div>
        <div className="card-content">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Dashboard refreshed
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Just now
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {todaysAppointments.length} appointments loaded
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Today's schedule
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard
