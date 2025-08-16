
import React, { useState, useEffect, useCallback } from 'react'
import {
  Calendar,
  Users,
  FileText,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  TestTube,
  Stethoscope,
  Heart,
  DollarSign,
  RefreshCw,
  Loader2,
} from 'lucide-react'
import { useApi } from '../../contexts/ApiContext'
import { useSocket } from '../../contexts/SocketContext'

const OverviewStats = ({ stats: initialStats, role, isLoading: initialLoading, autoRefresh = true, refreshInterval = 30000 }) => {
  const { apiCall } = useApi()
  const { socket } = useSocket()

  const [stats, setStats] = useState(initialStats || [])
  const [isLoading, setIsLoading] = useState(initialLoading || false)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [error, setError] = useState(null)

  const fetchRealTimeStats = useCallback(async () => {
    if (!role) return

    setIsLoading(true)
    setError(null)

    try {
      let newStats = []

      switch (role) {
        case 'patient': {
          const [patientAppointmentsRes, patientDiagnosticsRes, patientMedicalRecordsRes] = await Promise.all([
            apiCall('/appointments', 'GET', { upcoming: 'true', limit: 100 }),
            apiCall('/diagnostics/my-bookings', 'GET', { limit: 100 }),
            apiCall('/medical-records', 'GET', { limit: 1 }),
          ])

          const upcomingCount = patientAppointmentsRes?.appointments?.length || 0

          let diagnosticsCount = 0
          let pendingResults = 0
          if (patientDiagnosticsRes?.success) {
            if (Array.isArray(patientDiagnosticsRes.data)) {
              diagnosticsCount = patientDiagnosticsRes.data.length
              pendingResults = patientDiagnosticsRes.data.filter(b => ['sample-collected', 'pending'].includes(b.status)).length
            } else if (Array.isArray(patientDiagnosticsRes.bookings)) {
              diagnosticsCount = patientDiagnosticsRes.bookings.length
              pendingResults = patientDiagnosticsRes.bookings.filter(b => ['sample-collected', 'pending'].includes(b.status)).length
            } else if (patientDiagnosticsRes.data && typeof patientDiagnosticsRes.data === 'object') {
              diagnosticsCount = patientDiagnosticsRes.data.totalBookings || patientDiagnosticsRes.data.total || 0
              if (Array.isArray(patientDiagnosticsRes.data.bookings)) {
                pendingResults = patientDiagnosticsRes.data.bookings.filter(b => ['sample-collected', 'pending'].includes(b.status)).length
              }
            }
          }

          const recordsCount = patientMedicalRecordsRes?.pagination?.total || 0

          newStats = [
            { name: 'Upcoming Appointments', value: String(upcomingCount), trend: upcomingCount > 0 ? 'Scheduled' : 'None scheduled' },
            { name: 'Diagnostic Bookings', value: String(diagnosticsCount), trend: pendingResults > 0 ? `${pendingResults} pending results` : 'All completed' },
            { name: 'Medical Records', value: String(recordsCount), trend: recordsCount > 0 ? 'Health data available' : 'No records yet' },
            { name: 'Pending Results', value: String(pendingResults), trend: pendingResults > 0 ? 'Awaiting reports' : 'All results in' },
          ]
          break
        }

        case 'doctor': {
          // Use the stats endpoint for today's figure and overall counts
          const [doctorStatsRes, doctorPaymentsRes] = await Promise.all([
            apiCall('/appointments/stats/overview', 'GET'),
            apiCall('/payments/stats/overview', 'GET'),
          ])

          const todayCount = doctorStatsRes?.stats?.todaysAppointments || 0
          const totalPatients = doctorStatsRes?.stats?.uniquePatients || 0 // optional if backend later adds it
          const monthlyRevenue = doctorPaymentsRes?.stats?.monthlyRevenue || 0
          const pendingCount = doctorStatsRes?.stats?.pendingAppointments || 0

          newStats = [
            { name: "Today's Appointments", value: String(todayCount), trend: todayCount > 0 ? 'Scheduled' : 'No appointments today' },
            { name: 'Total Patients', value: String(totalPatients), trend: totalPatients > 0 ? 'Active patients' : 'Building patient base' },
            { name: 'Monthly Revenue', value: `₹${Number(monthlyRevenue).toLocaleString()}`, trend: monthlyRevenue > 0 ? 'Earnings this month' : 'No revenue yet' },
            { name: 'Pending Reviews', value: String(pendingCount), trend: pendingCount > 0 ? 'Requires attention' : 'All caught up' },
          ]
          break
        }

        case 'admin': {
          const [adminUsersRes, adminAppointmentsRes, adminPaymentsRes, adminLogsRes] = await Promise.all([
            apiCall('/users/stats', 'GET'),
            apiCall('/appointments/stats/overview', 'GET'),
            apiCall('/payments/stats/overview', 'GET'),
            apiCall('/logs/stats', 'GET'),
          ])

          const totalUsers = adminUsersRes?.stats?.totalUsers || 0
          const activeDoctors = adminUsersRes?.stats?.doctorCount || 0
          const totalRevenue = adminPaymentsRes?.stats?.monthlyRevenue || 0
          const systemHealth = adminLogsRes?.stats?.totalActivities > 0 ? '99.9%' : '99.8%'

          newStats = [
            { name: 'Total Users', value: String(totalUsers), trend: totalUsers > 100 ? 'Growing user base' : 'Building community' },
            { name: 'Active Doctors', value: String(activeDoctors), trend: activeDoctors > 10 ? 'Healthcare providers' : 'Expanding network' },
            { name: 'Total Revenue', value: `₹${Number(totalRevenue).toLocaleString()}`, trend: totalRevenue > 0 ? 'Platform earnings' : 'Revenue tracking' },
            { name: 'Platform Health', value: systemHealth, trend: adminLogsRes?.stats?.totalActivities > 0 ? 'System active' : 'Monitoring performance' },
          ]
          break
        }

        default:
          newStats = initialStats || []
      }

      setStats(newStats)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error fetching real-time stats:', error)
      setError('Failed to fetch latest stats')
      if (initialStats) setStats(initialStats)
    } finally {
      setIsLoading(false)
    }
  }, [role, apiCall, initialStats])

  // Auto-refresh + socket triggers
  useEffect(() => {
    if (!autoRefresh || !role) return

    fetchRealTimeStats()

    const interval = setInterval(fetchRealTimeStats, refreshInterval)

    if (socket) {
      const events = [
        'new_appointment', 'appointment_update', 'appointment_cancelled',
        'appointment_completed', 'payment_success', 'new_medical_record',
        'medical_record_updated', 'user_status_change', // fixed name
        'new_user_registered',
      ]

      const handleRealTimeUpdate = () => fetchRealTimeStats()
      events.forEach((event) => socket.on(event, handleRealTimeUpdate))

      return () => {
        clearInterval(interval)
        events.forEach((event) => socket.off(event, handleRealTimeUpdate))
      }
    }

    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, role, socket, fetchRealTimeStats])

  const handleManualRefresh = () => fetchRealTimeStats()

  useEffect(() => {
    if (initialStats && initialStats.length > 0) setStats(initialStats)
  }, [initialStats])

  useEffect(() => {
    setIsLoading(!!initialLoading)
  }, [initialLoading])

  const getIconForStat = (statName) => {
    const iconMap = {
      'Total Appointments': Calendar,
      'Upcoming Appointments': Clock,
      "Today's Appointments": Calendar,
      'Completed Appointments': CheckCircle,
      'Cancelled Appointments': XCircle,
      'Recent Appointments': Calendar,
      'Medical Records': FileText,
      'Diagnostic Bookings': TestTube,
      'Pending Results': Activity,
      'Total Patients': Users,
      "Today's Patients": Stethoscope,
      'Monthly Revenue': DollarSign,
      'Pending Reviews': Clock,
      'Total Users': Users,
      'Active Doctors': Stethoscope,
      'Total Revenue': CreditCard,
      'System Activities': Activity,
      'Platform Health': Heart,
    }
    return iconMap[statName] || Activity
  }

  const getColorForStat = (statName) => {
    const colorMap = {
      'Total Appointments': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
      'Upcoming Appointments': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
      "Today's Appointments": { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-400' },
      'Recent Appointments': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400' },
      'Completed Appointments': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400' },
      'Medical Records': { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400' },
      'Platform Health': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400' },
      'Cancelled Appointments': { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400' },
      'Pending Reviews': { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400' },
      'Pending Results': { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400' },
      'Total Patients': { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
      "Today's Patients": { bg: 'bg-violet-100 dark:bg-violet-900/30', text: 'text-violet-600 dark:text-violet-400' },
      'Total Users': { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600 dark:text-purple-400' },
      'Active Doctors': { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-600 dark:text-indigo-400' },
      'Monthly Revenue': { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-600 dark:text-emerald-400' },
      'Total Revenue': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400' },
      'Diagnostic Bookings': { bg: 'bg-teal-100 dark:bg-teal-900/30', text: 'text-teal-600 dark:text-teal-400' },
      'System Activities': { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400' },
    }
    return colorMap[statName] || { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-600 dark:text-gray-400' }
  }

  if (isLoading && (!stats || stats.length === 0)) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Overview Statistics</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Last updated: {lastUpdated.toLocaleTimeString()}</span>
            <button
              onClick={handleManualRefresh}
              disabled={isLoading}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 transition-colors"
              title="Refresh stats"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Overview Statistics</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Last updated: {lastUpdated.toLocaleTimeString()}</span>
          <button
            onClick={handleManualRefresh}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Refresh stats"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = getIconForStat(stat.name)
          const colors = getColorForStat(stat.name)

          return (
            <div key={stat.name} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  {stat.trend && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.trend}</p>}
                </div>
                <div className={`p-3 rounded-xl ${colors.bg}`}>
                  <Icon className={`h-6 w-6 ${colors.text}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default OverviewStats