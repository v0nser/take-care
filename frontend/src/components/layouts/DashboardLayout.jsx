import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { useSocket } from '../../contexts/SocketContext'
import { useNotifications } from '../../hooks/useNotifications'
import {
  Heart,
  Calendar,
  Users,
  FileText,
  CreditCard,
  User,
  Settings,
  Menu,
  X,
  Moon,
  Sun,
  Wifi,
  WifiOff,
  ChevronDown,
  LogOut,
  Home,

  Bell,
  HelpCircle,
  BarChart3,
  Stethoscope,
  Shield,
  Activity,
  Clock,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Zap,
  TrendingUp,
  Plus,
  Filter,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  MousePointer2,
  Radio,
  Star,
} from 'lucide-react'
import { clsx } from 'clsx'
import ConnectionStatus from '../ui/ConnectionStatus'
import ResponsiveSearchBar from '../ui/ResponsiveSearchBar'
import CompactSearchBar from '../ui/CompactSearchBar'
import Chatbot from '../dashboards/Chatbot'
import { useApi } from '../../contexts/ApiContext'

function formatWhen(iso) {
  const d = new Date(iso)
  const diff = (Date.now() - d.getTime()) / 1000
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`
  return d.toLocaleString()
}

const DashboardLayout = () => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { isConnected, socket } = useSocket()
  const { apiCall } = useApi()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebarCollapsed')
    return saved ? JSON.parse(saved) : false
  })
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState({})
  const [upcomingCount, setUpcomingCount] = useState(0)

  const userRole = user?.role || 'patient'
  
  console.log('🏠 DashboardLayout - Role detection:', {
    userId: user?.id,
    role: user?.role,
    finalRole: userRole,
    currentPath: location.pathname
  })

  // Load upcoming appointments count
  useEffect(() => {
    const loadUpcoming = async () => {
      try {
        const res = await apiCall('/appointments', 'GET', { upcoming: 'true', limit: 20 })
        if (res.success && Array.isArray(res.appointments)) {
          setUpcomingCount(res.appointments.length)
        } else if (res.success && Array.isArray(res.data?.appointments)) {
          setUpcomingCount(res.data.appointments.length)
        } else {
          setUpcomingCount(0)
        }
      } catch (e) {
        setUpcomingCount(0)
      }
    }
    loadUpcoming()
    if (!socket) return
    const refetch = () => loadUpcoming()
    socket.on('new_appointment', refetch)
    socket.on('appointment_update', refetch)
    socket.on('appointment_cancelled', refetch)
    socket.on('appointment_completed', refetch)
    return () => {
      socket.off('new_appointment', refetch)
      socket.off('appointment_update', refetch)
      socket.off('appointment_cancelled', refetch)
      socket.off('appointment_completed', refetch)
    }
  }, [apiCall, socket])

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  // Save sidebar collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed))
  }, [sidebarCollapsed])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowUserMenu(false)
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Settings', href: '/dashboard/settings', icon: Settings, gradient: 'from-gray-500 to-gray-700' },
    ]

    switch (userRole) {
      case 'admin':
        return [
          { name: 'Overview', href: '/dashboard/admin', icon: BarChart3, badge: null, gradient: 'from-purple-500 to-indigo-600' },
          { name: 'Users', href: '/dashboard/users', icon: Users, badge: '24', gradient: 'from-blue-500 to-cyan-600' },
          { name: 'Appointments', href: '/dashboard/appointments', icon: Calendar, badge: '8', gradient: 'from-green-500 to-emerald-600' },
          { name: 'Payments', href: '/dashboard/payments', icon: CreditCard, badge: null, gradient: 'from-yellow-500 to-orange-600' },
          { name: 'Medical Records', href: '/dashboard/records', icon: FileText, badge: null, gradient: 'from-pink-500 to-rose-600' },
          { name: 'Activity Logs', href: '/dashboard/logs', icon: Activity, badge: null, gradient: 'from-red-500 to-pink-600' },
          ...baseItems,
        ]
      case 'doctor':
        return [
          { name: 'Overview', href: '/dashboard/doctor', icon: Stethoscope, badge: null, gradient: 'from-emerald-500 to-teal-600' },
          { 
            name: 'Appointments', 
            href: '/dashboard/appointments', 
            icon: Calendar, 
            badge: null, 
            gradient: 'from-blue-500 to-indigo-600',
            subItems: [
              { name: 'View Appointments', href: '/dashboard/appointments' },
              { name: 'Manage Appointments', href: '/dashboard/appointments/manage' },
              { name: 'Set Availability', href: '/dashboard/availability' }
            ]
          },
          { name: 'Patients', href: '/dashboard/patients', icon: Users, badge: '48', gradient: 'from-purple-500 to-violet-600' },
          { name: 'Medical Records', href: '/dashboard/records', icon: FileText, badge: null, gradient: 'from-cyan-500 to-blue-600' },
          { name: 'Payments', href: '/dashboard/payments', icon: CreditCard, badge: null, gradient: 'from-yellow-500 to-amber-600' },
          ...baseItems,
        ]
      case 'patient':
      default:
        return [
          { name: 'Overview', href: '/dashboard/patient', icon: Heart, badge: null, gradient: 'from-pink-500 to-rose-600' },
          {
            name: 'Appointments',
            href: '/dashboard/appointments',
            icon: Calendar,
            badge: upcomingCount > 0 ? `${upcomingCount}` : null,
            gradient: 'from-blue-500 to-indigo-600',
            subItems: [
              { name: 'View Appointments', href: '/dashboard/appointments' },
              { name: 'Book Appointment', href: '/dashboard/appointments/book' }
            ]
          },
          // { name: 'Find Doctors', href: '/dashboard/doctors', icon: Users, badge: null, gradient: 'from-green-500 to-emerald-600' },
          { name: 'Services', href: '/dashboard/services', icon: Stethoscope, badge: null, gradient: 'from-indigo-500 to-purple-600' },
          { 
            name: 'Diagnostics', 
            href: '/dashboard/diagnostics', 
            icon: Activity, 
            badge: null, 
            gradient: 'from-amber-500 to-orange-600'
          },
          { name: 'Medical Records', href: '/dashboard/records', icon: FileText, badge: null, gradient: 'from-purple-500 to-violet-600' },
          { name: 'Payments', href: '/dashboard/payments', icon: CreditCard, badge: null, gradient: 'from-yellow-500 to-orange-600' },
          // { name: 'Profile', href: '/dashboard/profile', icon: User, badge: null, gradient: 'from-cyan-500 to-blue-600' },
          ...baseItems,
        ]
    }
  }

  const navigationItems = getNavigationItems()

  // Get current page info for breadcrumbs
  const getCurrentPageInfo = () => {
    const currentItem = navigationItems.find(item => item.href === location.pathname)
    return currentItem || { name: 'Dashboard', href: location.pathname, icon: Home }
  }

  const currentPage = getCurrentPageInfo()

  // Role-specific dashboard titles and descriptions
  const getDashboardInfo = () => {
    switch (userRole) {
      case 'admin':
        return {
          title: 'Admin Command Center',
          description: 'Orchestrate system operations and monitor performance',
          roleIcon: Shield,
          roleColor: 'from-purple-600 to-indigo-700',
          accentColor: 'purple'
        }
      case 'doctor':
        return {
          title: 'Medical Practice Hub',
          description: 'Manage patient care and clinical operations',
          roleIcon: Stethoscope,
          roleColor: 'from-emerald-600 to-teal-700',
          accentColor: 'emerald'
        }
      case 'patient':
      default:
        return {
          title: 'Health Portal',
          description: 'Your gateway to personalized healthcare',
          roleIcon: Heart,
          roleColor: 'from-pink-600 to-rose-700',
          accentColor: 'pink'
        }
    }
  }

  const dashboardInfo = getDashboardInfo()
  const RoleIcon = dashboardInfo.roleIcon
  const { items: notifications, unreadCount, markRead } = useNotifications()


  // Sidebar Component
  const Sidebar = ({ isDesktop = false }) => (
    <div className="flex flex-col h-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-gray-800/20 dark:via-gray-900/30 dark:to-gray-800/20 animate-pulse"></div>
      
      {/* Header */}
      <div className={clsx(
        "relative flex items-center border-b border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 overflow-hidden",
        sidebarCollapsed && isDesktop ? "p-3 justify-center" : "p-6 justify-between"
      )}>
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-purple-50/20 to-pink-50/30 dark:from-blue-900/10 dark:via-purple-900/5 dark:to-pink-900/10 animate-pulse"></div>
        
        <div className={clsx(
          "flex items-center transition-all duration-300 relative z-10",
          sidebarCollapsed && isDesktop ? "space-x-0" : "space-x-3"
        )}>
          <div className={clsx(
            "rounded-2xl bg-gradient-to-br shadow-lg transform transition-all duration-500 hover:scale-110 cursor-pointer group",
            `${dashboardInfo.roleColor}`,
            sidebarCollapsed && isDesktop ? "p-2 rotate-0 hover:rotate-12" : "p-3 rotate-3 hover:rotate-0"
          )}>
            <RoleIcon className={clsx(
              "text-white transition-all duration-300 drop-shadow-sm",
              sidebarCollapsed && isDesktop ? "h-5 w-5" : "h-6 w-6"
            )} />
            
            {/* Subtle glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          {(!sidebarCollapsed || !isDesktop) && (
            <div className="transition-all duration-300">
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-gray-600 dark:from-white dark:via-blue-200 dark:to-gray-300 bg-clip-text text-transparent">
                TakeCare
                <span className="ml-1 text-xs text-blue-500 dark:text-blue-400">Pro</span>
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize font-medium flex items-center space-x-1">
                <Radio className="h-3 w-3 text-green-500 animate-pulse" />
                <span>{userRole} Portal</span>
                {isConnected && <Star className="h-3 w-3 text-yellow-500" />}
              </p>
            </div>
          )}
        </div>
        
        {!isDesktop && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 hover:scale-110 relative z-10"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        )}
      </div>

      {/* Quick Stats */}
      {(!sidebarCollapsed || !isDesktop) && (
        <div className="relative p-4 animate-in slide-in-from-left duration-300">
          <div className="grid grid-cols-2 gap-3">
            <div className="group relative bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-400/10 dark:to-cyan-400/10 rounded-2xl p-3 border border-blue-200/20 dark:border-blue-700/20 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="flex items-center space-x-2">
                  <div className="p-1 rounded-lg bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors duration-300">
                    <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 group-hover:text-blue-800 dark:group-hover:text-blue-200 transition-colors duration-300">Active</span>
                </div>
                <p className="text-lg font-bold text-blue-800 dark:text-blue-200 mt-1 group-hover:scale-110 transition-transform duration-300 origin-left">
                  {dashboardInfo?.activeAppointments || 0}
                </p>
              </div>
              
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </div>
            
            <div className="group relative bg-gradient-to-br from-green-500/10 to-emerald-500/10 dark:from-green-400/10 dark:to-emerald-400/10 rounded-2xl p-3 border border-green-200/20 dark:border-green-700/20 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative z-10">
                <div className="flex items-center space-x-2">
                  <div className="p-1 rounded-lg bg-green-500/20 group-hover:bg-green-500/30 transition-colors duration-300">
                    <Zap className="h-4 w-4 text-green-600 dark:text-green-400 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                  </div>
                  <span className="text-xs font-semibold text-green-700 dark:text-green-300 group-hover:text-green-800 dark:group-hover:text-green-200 transition-colors duration-300">Today</span>
                </div>
                <p className="text-lg font-bold text-green-800 dark:text-green-200 mt-1 group-hover:scale-110 transition-transform duration-300 origin-left">
                  {dashboardInfo?.todayAppointments || 0}
                </p>
              </div>
              
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={clsx(
        "relative flex-1 overflow-y-auto transition-all duration-300",
        sidebarCollapsed && isDesktop ? "px-2 py-3 space-y-2" : "p-4 space-y-2"
      )}>
        {navigationItems.map((item, index) => {
          const Icon = item.icon
          const isActive = location.pathname === item.href || (item.subItems && item.subItems.some(subItem => location.pathname === subItem.href))
          const isExpanded = expandedMenus[item.name]
          const hasSubItems = item.subItems && item.subItems.length > 0
          
          const handleClick = (e) => {
            console.log('🔥 Navigation clicked:', item.name, 'href:', item.href, 'collapsed:', sidebarCollapsed, 'hasSubItems:', hasSubItems);
            
            // Stop event propagation to prevent any interference
            e.preventDefault();
            e.stopPropagation();
            
            if (sidebarCollapsed && isDesktop && hasSubItems) {
              // In collapsed mode, navigate to main route instead of expanding
              console.log('🔥 Navigating to (collapsed with subitems):', item.href);
              navigate(item.href);
            } else if (hasSubItems) {
              // For items with sub-items, just expand/collapse the menu
              // Don't navigate automatically - let user choose from sub-items
              console.log('🔥 Expanding menu for:', item.name);
              setExpandedMenus(prev => ({
                ...prev,
                [item.name]: !prev[item.name]
              }))
            } else {
              // For items without sub-items, navigate using React Router
              console.log('🔥 Navigating to (no subitems):', item.href);
              navigate(item.href);
            }
          }
          
          // Collapsed mode - show only icons
          if (sidebarCollapsed && isDesktop) {
            return (
              <div key={item.name} className="relative group w-full flex justify-center mb-1">
                <button
                  onClick={handleClick}
                  className={clsx(
                    'relative flex items-center justify-center cursor-pointer rounded-2xl w-14 h-14 transition-all duration-500 transform hover:scale-110 hover:rotate-3',
                    'shadow-lg hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 z-10',
                    'before:absolute before:inset-0 before:rounded-2xl before:transition-all before:duration-300',
                    isActive
                      ? `bg-gradient-to-br ${item.gradient} shadow-xl shadow-blue-500/25 text-white scale-105`
                      : 'bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50'
                  )}
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                  type="button"
                  aria-label={item.name}
                >
                  {/* Animated background ring */}
                  <div className={clsx(
                    'absolute inset-0 rounded-2xl transition-all duration-300 pointer-events-none',
                    isActive 
                      ? 'bg-gradient-to-br from-white/20 to-transparent animate-pulse' 
                      : 'group-hover:bg-gradient-to-br group-hover:from-blue-50/50 group-hover:to-purple-50/50 dark:group-hover:from-blue-900/20 dark:group-hover:to-purple-900/20'
                  )}></div>
                  
                  {/* Icon with enhanced effects */}
                  <div className="relative z-10 pointer-events-none">
                    <Icon className={clsx(
                      'h-6 w-6 transition-all duration-300 transform group-hover:scale-110',
                      isActive 
                        ? 'text-white drop-shadow-sm' 
                        : 'text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                    )} />
                    
                    {/* Active indicator pulse */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-full bg-white/30 animate-ping pointer-events-none"></div>
                    )}
                  </div>
                  
                  {/* Enhanced badge with animation */}
                  {item.badge && (
                    <div className="absolute -top-1 -right-1 z-20 pointer-events-none">
                      <span className="relative flex h-5 w-5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold items-center justify-center shadow-lg">
                          {item.badge > 9 ? '9+' : item.badge}
                        </span>
                      </span>
                    </div>
                  )}
                  
                  {/* Hover glow effect */}
                  <div className={clsx(
                    'absolute inset-0 rounded-2xl transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none',
                    'bg-gradient-to-r from-blue-400/10 to-purple-400/10 blur-sm'
                  )}></div>
                </button>
                
                {/* Enhanced tooltip with better design */}
                <div className="absolute left-16 top-1/2 transform -translate-y-1/2 z-[60] opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 pointer-events-none">
                  <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-700 dark:to-gray-600 text-white text-sm px-3 py-2 rounded-lg shadow-2xl whitespace-nowrap border border-gray-700/50">
                    <div className="flex items-center space-x-2">
                      <Icon className="h-3 w-3" />
                      <span className="font-medium">{item.name}</span>
                      {hasSubItems && (
                        <div className="flex items-center space-x-1">
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                          <span className="text-xs text-gray-300">{item.subItems.length} items</span>
                        </div>
                      )}
                    </div>
                    
                    {hasSubItems && (
                      <div className="mt-2 text-xs text-gray-300 border-t border-gray-600 pt-2">
                        {item.name === 'Diagnostics' ? 'Click to see options, then choose "Quick Book" for direct access' : 'Click to expand menu'}
                      </div>
                    )}
                    
                    {/* Arrow pointer */}
                    <div className="absolute right-full top-1/2 transform -translate-y-1/2">
                      <div className="border-8 border-transparent border-r-gray-900 dark:border-r-gray-700"></div>
                    </div>
                    
                    {/* Subtle glow */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-sm -z-10"></div>
                  </div>
                </div>
                
                {/* Click ripple effect */}
                <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                  <div className="absolute inset-0 bg-white/20 transform scale-0 group-active:scale-100 transition-transform duration-200 rounded-2xl pointer-events-none"></div>
                </div>
              </div>
            )
          }
          
          // Expanded mode - full navigation
          return (
            <div key={item.name}>
              <button
                onClick={handleClick}
                className={clsx(
                  'group flex items-center justify-between px-4 py-4 rounded-2xl text-sm font-medium transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg cursor-pointer w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500/50',
                  isActive
                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 shadow-lg border border-blue-200/50 dark:border-blue-700/50'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:hover:from-gray-800/50 dark:hover:to-gray-700/50 hover:text-gray-900 dark:hover:text-white'
                )}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
                type="button"
                aria-label={item.name}
              >
                <div className="flex items-center space-x-3">
                  <div className={clsx(
                    'p-2 rounded-xl transition-all duration-300',
                    isActive 
                      ? `bg-gradient-to-br ${item.gradient} shadow-lg` 
                      : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gradient-to-br group-hover:from-gray-200 group-hover:to-gray-300 dark:group-hover:from-gray-700 dark:group-hover:to-gray-600'
                  )}>
                    <Icon className={clsx(
                      'h-4 w-4 transition-colors duration-300',
                      isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                    )} />
                  </div>
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {item.badge && (
                    <div className="relative">
                      <span className="px-2.5 py-1 text-xs font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full shadow-lg animate-pulse">
                        {item.badge}
                      </span>
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full animate-ping"></span>
                    </div>
                  )}
                  {hasSubItems && (
                    <ChevronDown className={clsx(
                      'h-4 w-4 transition-transform duration-300',
                      isExpanded ? 'rotate-180' : 'rotate-0'
                    )} />
                  )}
                </div>
              </button>
              
              {/* Sub-items */}
              {hasSubItems && isExpanded && (
                <div className="ml-4 mt-3 space-y-2 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                  <div className="text-xs text-gray-500 font-medium mb-2">
                    {item.name === 'Diagnostics' ? '📋 Choose your diagnostics action:' : 'Choose an option:'}
                  </div>
                  {item.subItems.map((subItem) => {
                    const isSubActive = location.pathname === subItem.href
                    const isSpecial = subItem.special
                    return (
                      <Link
                        key={subItem.name}
                        to={subItem.href}
                        className={clsx(
                          'flex items-center px-4 py-3 rounded-xl text-sm transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 border',
                          isSpecial 
                            ? 'border-orange-300 dark:border-orange-600 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 text-orange-700 dark:text-orange-300 hover:from-orange-100 hover:to-amber-100'
                            : isSubActive
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium border-blue-300 dark:border-blue-600'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border-gray-200 dark:border-gray-700'
                        )}
                      >
                        <div className={clsx(
                          'w-2 h-2 rounded-full mr-3',
                          isSpecial ? 'bg-orange-500' : isSubActive ? 'bg-blue-500' : 'bg-gray-400'
                        )}></div>
                        {subItem.name}
                        {isSpecial && (
                          <span className="ml-auto text-xs bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-full font-medium">
                            Recommended
                          </span>
                        )}
                        {isSubActive && !isSpecial && (
                          <span className="ml-auto text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">
                            Active
                          </span>
                        )}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* User section */}
      <div className={clsx(
        "relative border-t border-gray-200/50 dark:border-gray-700/50 transition-all duration-300",
        sidebarCollapsed && isDesktop ? "p-2" : "p-4"
      )}>
        {sidebarCollapsed && isDesktop ? (
          <div className="flex justify-center">
            <div className="relative group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl cursor-pointer hover:scale-110 transition-all duration-500 transform hover:rotate-6 border-2 border-white/20">
                <span className="text-white text-sm font-bold drop-shadow-lg">
                  {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </span>
                
                {/* Animated ring */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
              </div>
              
              {/* Enhanced status indicator */}
              <div className={clsx(
                'absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-3 border-white dark:border-gray-800 shadow-lg',
                isConnected ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-pink-500'
              )}>
                <div className={clsx(
                  'absolute inset-0 rounded-full animate-ping',
                  isConnected ? 'bg-green-400' : 'bg-red-400'
                )}></div>
              </div>
              
              {/* Enhanced tooltip */}
              <div className="absolute left-16 top-1/2 transform -translate-y-1/2 z-50 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 pointer-events-none">
                <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-700 dark:to-gray-600 text-white text-sm px-3 py-2 rounded-lg shadow-2xl whitespace-nowrap border border-gray-700/50">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-gray-300 capitalize">{userRole}</p>
                    </div>
                    <div className={clsx(
                      'w-2 h-2 rounded-full',
                      isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                    )}></div>
                  </div>
                  
                  {/* Arrow pointer */}
                  <div className="absolute right-full top-1/2 transform -translate-y-1/2">
                    <div className="border-8 border-transparent border-r-gray-900 dark:border-r-gray-700"></div>
                  </div>
                  
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-sm -z-10"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative group cursor-pointer">
            {/* Hover glow effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-all duration-300 blur-sm"></div>
            
            <div className="relative flex items-center space-x-3 p-4 rounded-2xl bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-700/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1">
              {/* Enhanced avatar */}
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <span className="text-white text-sm font-bold drop-shadow-lg">
                    {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </span>
                  
                  {/* Inner glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                {/* Enhanced status with animation */}
                <div className={clsx(
                  'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 shadow-lg transition-all duration-300',
                  isConnected ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-red-400 to-pink-500'
                )}>
                  <div className={clsx(
                    'absolute inset-0 rounded-full transition-all duration-300',
                    isConnected ? 'bg-green-400 animate-ping opacity-75' : 'bg-red-400 animate-pulse'
                  )}></div>
                </div>
              </div>
              
              {/* Enhanced user info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate flex items-center space-x-2">
                  <span>{user?.firstName} {user?.lastName}</span>
                  <Star className="h-3 w-3 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate flex items-center space-x-1">
                  <span>{user?.email}</span>
                  <MousePointer2 className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
                </p>
              </div>
              
              {/* Enhanced sparkles with animation */}
              <div className="relative">
                <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse transition-all duration-300 group-hover:scale-125 group-hover:rotate-12" />
                <div className="absolute inset-0 text-yellow-400 animate-ping opacity-25">
                  <Sparkles className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setSidebarOpen(false)} 
          />
          <div className="relative flex w-full max-w-xs flex-col bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl transform transition-transform duration-300">
            <Sidebar isDesktop={false} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className={clsx(
        "hidden md:fixed md:inset-y-0 md:flex md:flex-col z-40 transition-all duration-300",
        sidebarCollapsed ? "md:w-20" : "md:w-80"
      )}>
        <Sidebar isDesktop={true} />
      </div>

      {/* Main content */}
      <div className={clsx(
        "flex flex-col min-h-screen transition-all duration-300",
        sidebarCollapsed ? "md:pl-20" : "md:pl-80"
      )}>
        {/* Top header */}
        <header className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border-b border-gray-200/30 dark:border-gray-700/30 shadow-xl shadow-gray-900/5 dark:shadow-black/20">
          {/* Elegant gradient background overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/20 via-white/10 to-purple-50/20 dark:from-blue-900/10 dark:via-transparent dark:to-purple-900/10"></div>
          
          <div className="relative flex items-center justify-between px-6 lg:px-8 h-24">
            {/* Left section */}
            <div className="flex items-center space-x-8">
              {/* Mobile menu button - Enhanced */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-4 rounded-3xl bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200/50 dark:border-gray-600/50 group"
              >
                <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
              </button>

              {/* Desktop sidebar collapse button - Elegant */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hidden md:flex items-center justify-center relative group p-4 rounded-3xl bg-white/60 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-xl"
                title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                {/* Elegant animated background */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                {/* Icon with sophisticated animation */}
                <div className="relative z-10 transform transition-all duration-500 group-hover:scale-110">
                  {sidebarCollapsed ? (
                    <PanelLeftOpen className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transform transition-all duration-500 group-hover:rotate-12" />
                  ) : (
                    <PanelLeftClose className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transform transition-all duration-500 group-hover:-rotate-12" />
                  )}
                </div>
                
                {/* Elegant tooltip */}
                <div className="absolute top-full mt-3 left-1/2 transform -translate-x-1/2 bg-gray-900/95 dark:bg-gray-700/95 text-white text-sm px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 shadow-2xl backdrop-blur-sm font-medium">
                  {sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-6 border-transparent border-b-gray-900/95 dark:border-b-gray-700/95"></div>
                </div>
              </button>

              {/* Elegant Breadcrumbs */}
              <nav className="hidden lg:flex items-center space-x-4">
                <div className="flex items-center space-x-3 text-sm">
                  <Link 
                    to="/dashboard" 
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 font-semibold tracking-wide rounded-xl hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
                  >
                    Dashboard
                  </Link>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span className="px-4 py-2 font-bold text-gray-900 dark:text-white bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl border border-blue-200/30 dark:border-blue-700/30">
                    {currentPage.name}
                  </span>
                </div>
              </nav>
            </div>

            {/* Center - Elegant Search */}
            <div className="hidden sm:flex flex-1 max-w-2xl mx-12">
              <CompactSearchBar 
                placeholder="Search patients, appointments, records, payments..."
                compact={false}
              />
            </div>

            {/* Mobile Search Button - Visible on small screens */}
            <div className="sm:hidden flex-1 px-4">
              <CompactSearchBar 
                placeholder="Search patients, appointments, records, payments..."
                compact={true}
                mobileVariant="overlay"
              />
            </div>

            {/* Right section - Elegant */}
            <div className="flex items-center space-x-4">
              {/* Theme toggle - Elegant */}
              <button
                onClick={toggleTheme}
                className="p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-xl"
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-yellow-500 group-hover:rotate-180 group-hover:scale-110 transition-all duration-500" />
                ) : (
                  <Moon className="h-5 w-5 text-indigo-600 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500" />
                )}
              </button>

              {/* Connection status - Refined */}
              <div className="p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-xl shadow-lg" title={isConnected ? 'Connected' : 'Disconnected'}>
                {isConnected ? (
                  <div className="relative">
                    <Wifi className="h-5 w-5 text-emerald-500" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
                  </div>
                ) : (
                  <WifiOff className="h-5 w-5 text-red-500 animate-pulse" />
                )}
              </div>

              {/* Notifications - Elegant */}
              <div className="relative dropdown-container">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 relative group border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-xl"
                >
                  <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
                  {unreadCount > 0 && (
                    <>
                      <div className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="absolute top-3 right-3 w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
                    </>
                  )}
                </button>
                
                {/* Enhanced Notifications dropdown - keeping existing */}
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-4 w-96 bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/30 dark:border-gray-700/30 z-50 transform animate-in slide-in-from-top-2">
                    <div className="p-6 border-b border-gray-200/30 dark:border-gray-700/30">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white tracking-wide">Notifications</h3>
                        <span className="px-3 py-1 text-xs font-semibold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full">
                          {unreadCount} new
                        </span>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                     {notifications.map((n) => (
                       <div
                         key={n._id}
                         onClick={() => markRead(n._id)}
                         className="p-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-all duration-300 border-b border-gray-100/50 dark:border-gray-700/50 last:border-b-0 group cursor-pointer"
                       >
                         <div className="flex items-start space-x-3">
                           <div className={`w-2 h-2 rounded-full mt-2 ${n.readAt ? 'bg-gray-300' : 'bg-blue-500'}`} />
                           <div className="flex-1">
                             <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                               {n.title}
                             </p>
                             <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
                               {formatWhen(n.createdAt)}
                             </p>
                             {n.message && (
                               <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                                 {n.message}
                               </p>
                             )}
                           </div>
                         </div>
                       </div>
                     ))}
                    </div>
                    <div className="p-4 border-t border-gray-200/30 dark:border-gray-700/30">
                      <button className="w-full text-center text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-300 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20">
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>

              

              {/* Enhanced User menu - Premium */}
              <div className="relative dropdown-container">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-3 p-3 rounded-2xl bg-white/60 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group border border-gray-200/50 dark:border-gray-600/50 backdrop-blur-xl"
                >
                  <div className="relative">
                    <div className="w-11 h-11 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-white text-sm font-bold tracking-wide">
                        {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800 shadow-sm">
                      <div className="w-full h-full bg-emerald-400 rounded-full animate-ping"></div>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:rotate-180 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300" />
                </button>
                
                {/* Enhanced User dropdown */}
                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-3 w-72 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 z-50 transform animate-in slide-in-from-top-2">
                    <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-white text-lg font-bold">
                            {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {user?.firstName} {user?.lastName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user?.email}
                          </p>
                          <span className={clsx(
                            'inline-flex items-center px-3 py-1 mt-2 text-xs font-medium rounded-full capitalize',
                            dashboardInfo.accentColor === 'purple' && 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
                            dashboardInfo.accentColor === 'emerald' && 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
                            dashboardInfo.accentColor === 'pink' && 'bg-pink-100 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400'
                          )}>
                            <span className="w-1.5 h-1.5 bg-current rounded-full mr-1.5"></span>
                            {userRole}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="py-2">
                      <Link
                        to="/dashboard/profile"
                        className="flex items-center px-6 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="h-4 w-4 mr-4 group-hover:scale-110 transition-transform" />
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          setSidebarCollapsed(!sidebarCollapsed)
                          setShowUserMenu(false)
                        }}
                        className="hidden md:flex w-full items-center px-6 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                      >
                        {sidebarCollapsed ? (
                          <PanelLeftOpen className="h-4 w-4 mr-4 group-hover:scale-110 transition-transform" />
                        ) : (
                          <PanelLeftClose className="h-4 w-4 mr-4 group-hover:scale-110 transition-transform" />
                        )}
                        {sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                      </button>
                      <Link
                        to="/dashboard/settings"
                        className="flex items-center px-6 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="h-4 w-4 mr-4 group-hover:rotate-90 transition-transform duration-500" />
                        Settings
                      </Link>
                      <hr className="my-2 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={() => {
                          logout()
                          setShowUserMenu(false)
                        }}
                        className="w-full flex items-center px-6 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                      >
                        <LogOut className="h-4 w-4 mr-4 group-hover:translate-x-1 transition-transform" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 relative overflow-hidden">
          <div className="h-full p-6">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* AI Chatbot */}
      <Chatbot role={userRole} />
    </div>
  )
}

export default DashboardLayout
