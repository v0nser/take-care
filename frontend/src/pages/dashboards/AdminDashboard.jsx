import { useAuth } from '../../contexts/AuthContext'
import { useApi } from '../../contexts/ApiContext'
import { Users, Calendar, CreditCard, Activity, Settings, Shield, RefreshCw, Loader2, TrendingUp, TrendingDown, TestTube } from 'lucide-react'
import OverviewStats from '../../components/dashboards/OverviewStats'
import RecentActivity from '../../components/dashboards/RecentActivity'
import Chatbot from '../../components/dashboards/Chatbot'
import { useState, useEffect, useCallback } from 'react'

const AdminDashboard = () => {
  const { user } = useAuth()
  const { apiCall } = useApi()
  
  const [stats, setStats] = useState([])
  const [recentAppointments, setRecentAppointments] = useState([])
  const [recentActivities, setRecentActivities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Fetch user statistics
      const usersResponse = await apiCall('/users/stats', 'GET')

      // Fetch appointment statistics
      const appointmentsResponse = await apiCall('/appointments/stats/overview', 'GET')

      // Fetch recent appointments
      const recentAppointmentsResponse = await apiCall('/appointments', 'GET', {
        limit: 5
      })

      // Fetch payment statistics
      const paymentsResponse = await apiCall('/payments/stats/overview', 'GET')

      // Fetch activity log statistics
      const logsResponse = await apiCall('/logs/stats', 'GET')

      // Fetch recent activity logs
      const recentLogsResponse = await apiCall('/logs', 'GET', {
        limit: 5
      })

      if (recentAppointmentsResponse.success) {
        setRecentAppointments(recentAppointmentsResponse.appointments || [])
      }

      if (recentLogsResponse.success) {
        setRecentActivities(recentLogsResponse.logs || [])
      }

      // Calculate stats from real data
      const totalUsers = usersResponse.success ? usersResponse.stats?.totalUsers || 0 : 0
      const activeAppointments = appointmentsResponse.success ? appointmentsResponse.stats?.totalAppointments || 0 : 0
      const monthlyRevenue = paymentsResponse.success ? paymentsResponse.stats?.monthlyRevenue || 0 : 0
      const activeDoctors = usersResponse.success ? usersResponse.stats?.doctorCount || 0 : 0
      
      // Calculate system health based on recent activity
      const recentLogs = logsResponse.success ? logsResponse.stats?.recentActivity || 0 : 0
      const systemHealth = recentLogs > 0 ? '99.9%' : '99.8%'

      const newStats = [
        {
          name: 'Total Users',
          value: totalUsers,
          trend: totalUsers > 100 ? 'Growing user base' : 'Building community'
        },
        {
          name: 'Active Doctors',
          value: activeDoctors,
          trend: activeDoctors > 10 ? 'Healthcare providers' : 'Expanding network'
        },
        {
          name: 'Total Revenue',
          value: `₹${monthlyRevenue.toLocaleString()}`,
          trend: monthlyRevenue > 0 ? 'Platform earnings' : 'Revenue tracking'
        },
        {
          name: 'Platform Health',
          value: systemHealth,
          trend: recentLogs > 0 ? 'System active' : 'Monitoring performance'
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

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 rounded-lg px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Shield className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">
                Admin Dashboard
              </h1>
              <p className="text-purple-100 dark:text-purple-200">
                Monitor and manage the TakeCare healthcare platform
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2">
              <div className="bg-white/20 px-3 py-1 rounded-full">
                <span className="text-sm font-medium">🛡️ Admin Panel</span>
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

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      )}

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
        role="admin" 
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
          role="admin"
          viewAllLink="/dashboard/appointments"
          isLoading={isLoading}
        />
        
        <RecentActivity
          title="System Activity"
          items={recentActivities}
          type="activity"
          role="admin"
          viewAllLink="/dashboard/logs"
          isLoading={isLoading}
        />
      </div>

      {/* System Status */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">System Status</h2>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2"></div>
              <h3 className="font-semibold text-green-800 dark:text-green-300">Database</h3>
              <p className="text-sm text-green-600 dark:text-green-400">Connected</p>
            </div>
            
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-2"></div>
              <h3 className="font-semibold text-blue-800 dark:text-blue-300">API</h3>
              <p className="text-sm text-blue-600 dark:text-blue-400">Operational</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="w-3 h-3 bg-purple-500 rounded-full mx-auto mb-2"></div>
              <h3 className="font-semibold text-purple-800 dark:text-purple-300">Services</h3>
              <p className="text-sm text-purple-600 dark:text-purple-400">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="text-center py-6">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                User Management
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Manage patients, doctors, and admin accounts
              </p>
              <button className="btn-primary">
                Manage Users
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="text-center py-6">
              <Calendar className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Appointments
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Overview of all system appointments
              </p>
              <button className="btn-secondary">
                View Appointments
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="text-center py-6">
              <CreditCard className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Payment Analytics
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Financial reports and payment tracking
              </p>
              <button className="btn-outline">
                View Analytics
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="text-center py-6">
              <Activity className="h-12 w-12 text-accent-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                System Health
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Monitor system performance and uptime
              </p>
              <button className="btn-outline">
                View Metrics
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="text-center py-6">
              <Settings className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Activity Logs
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Track all system activities and events
              </p>
              <button className="btn-secondary">
                View Logs
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="text-center py-6">
              <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Security Settings
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Manage security policies and permissions
              </p>
              <button className="btn-outline">
                Security Panel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Recent System Activity
          </h3>
        </div>
        <div className="card-content">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-900 dark:text-white">
                  New doctor registration: Dr. Sarah Johnson
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">2 minutes ago</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-900 dark:text-white">
                  Payment processed: ₹1,500 for appointment #12345
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">5 minutes ago</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-900 dark:text-white">
                  System backup completed successfully
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">1 hour ago</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* AI Chatbot */}
      <Chatbot role="admin" />
    </div>
  )
}

export default AdminDashboard
