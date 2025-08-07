import { useAuth } from '../../contexts/AuthContext'
import { Calendar, Users, FileText, CreditCard, Clock, Stethoscope, RefreshCw, Settings, Video } from 'lucide-react'
import { Link } from 'react-router-dom'

const DoctorDashboard = () => {
  const { user } = useAuth()

  const handleRefreshUser = () => {
    window.location.reload() // Force a full page reload to update everything
  }

  const stats = [
    {
      name: "Today's Appointments",
      value: '8',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Total Patients',
      value: '124',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Monthly Revenue',
      value: '₹45,000',
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Pending Reviews',
      value: '6',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  const todaysAppointments = [
    {
      id: 1,
      patient: 'John Doe',
      time: '10:00 AM',
      reason: 'Regular Checkup',
      status: 'confirmed',
    },
    {
      id: 2,
      patient: 'Jane Smith',
      time: '11:30 AM',
      reason: 'Follow-up',
      status: 'pending',
    },
    {
      id: 3,
      patient: 'Mike Johnson',
      time: '2:00 PM',
      reason: 'Consultation',
      status: 'confirmed',
    },
  ]

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
                onClick={handleRefreshUser}
                className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
                title="Refresh user data"
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="card">
              <div className="card-content">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {stat.name}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
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
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Today's Appointments
          </h3>
        </div>
        <div className="card-content">
          <div className="space-y-4">
            {todaysAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {appointment.patient}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {appointment.reason}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {appointment.time}
                  </p>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      appointment.status === 'confirmed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                    }`}
                  >
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="text-center py-6">
              <Calendar className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Manage Appointments
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                View and manage your appointment schedule
              </p>
              <Link to="/dashboard/appointments/manage" className="btn-primary">
                View Schedule
              </Link>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="text-center py-6">
              <Users className="h-12 w-12 text-secondary-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Patient Records
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Access patient medical histories
              </p>
              <button className="btn-secondary">
                View Patients
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="text-center py-6">
              <Settings className="h-12 w-12 text-accent-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Manage Availability
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Set your working hours and availability
              </p>
              <Link to="/dashboard/availability" className="btn-outline">
                Set Schedule
              </Link>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="text-center py-6">
              <FileText className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Create Record
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Add new medical records for patients
              </p>
              <button className="btn-outline">
                Add Record
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard
