import { useAuth } from '../../contexts/AuthContext'
import { Users, Calendar, CreditCard, Activity, Settings, Shield } from 'lucide-react'

const AdminDashboard = () => {
  const { user } = useAuth()

  const stats = [
    {
      name: 'Total Users',
      value: '2,847',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12%',
      trend: 'up',
    },
    {
      name: 'Active Appointments',
      value: '1,234',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+8%',
      trend: 'up',
    },
    {
      name: 'Monthly Revenue',
      value: '₹4,52,000',
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+23%',
      trend: 'up',
    },
    {
      name: 'System Health',
      value: '99.9%',
      icon: Activity,
      color: 'text-accent-600',
      bgColor: 'bg-accent-50',
      change: '+0.1%',
      trend: 'up',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 rounded-lg px-6 py-8 text-white">
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
      </div>

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
                    <p className={`text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change} from last month
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
    </div>
  )
}

export default AdminDashboard
