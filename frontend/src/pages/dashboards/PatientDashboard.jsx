import { useAuth } from '../../contexts/AuthContext'
import { Calendar, Users, FileText, CreditCard, Clock, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import ServicesSection from '../../components/services/ServicesSection'

const PatientDashboard = () => {
  const { user } = useAuth()

  const stats = [
    {
      name: 'Upcoming Appointments',
      value: '3',
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Medical Records',
      value: '12',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Total Payments',
      value: '₹8,500',
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Doctors Consulted',
      value: '5',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  const recentAppointments = [
    {
      id: 1,
      doctor: 'Dr. Sarah Wilson',
      specialization: 'Cardiology',
      date: '2024-01-15',
      time: '10:00 AM',
      status: 'confirmed',
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      specialization: 'Dermatology',
      date: '2024-01-18',
      time: '2:30 PM',
      status: 'pending',
    },
  ]

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
            <div className="bg-white/20 px-3 py-1 rounded-full">
              <span className="text-sm font-medium">❤️ Patient Dashboard</span>
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

      {/* Recent Appointments */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Recent Appointments
          </h3>
        </div>
        <div className="card-content">
          <div className="space-y-4">
            {recentAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
              >
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {appointment.doctor}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {appointment.specialization}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {appointment.date} at {appointment.time}
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-content">
            <div className="text-center py-6">
              <Calendar className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Book New Appointment
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Schedule a consultation with our expert doctors
              </p>
              <Link to="/dashboard/appointments/book" className="btn-primary">
                Book Appointment
              </Link>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="text-center py-6">
              <FileText className="h-12 w-12 text-secondary-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                View Medical Records
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Access your complete medical history
              </p>
              <button className="btn-secondary">
                View Records
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Medical Services Section */}
      <div className="card">
        <div className="card-content">
          <ServicesSection showTitle={true} maxItems={8} showViewAll={true} />
        </div>
      </div>
    </div>
  )
}

export default PatientDashboard
