import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'
import {
  User,
  Shield,
  Bell,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Save,
  Camera,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  Languages,
  Globe,
  Smartphone,
  Monitor,
  Key,
  Lock,
  AlertTriangle,
  CheckCircle,
  Settings,
  Stethoscope,
  CreditCard,
  FileText,
  UserCheck,
  Activity,
  Database,
  Zap,
  Palette,
  Volume2,
  VolumeX,
  Wifi,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Info,
} from 'lucide-react'
import { clsx } from 'clsx'

const SettingsPage = () => {
  const { user, updateProfile } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Form states
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    dateOfBirth: user?.dateOfBirth || '',
    bio: user?.bio || '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    appointmentReminders: true,
    paymentAlerts: true,
    systemUpdates: false,
    marketingEmails: false,
  })

  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    soundEnabled: true,
    autoSave: true,
    compactView: false,
  })

  // Role-specific settings
  const [doctorSettings, setDoctorSettings] = useState({
    consultationFee: user?.consultationFee || '',
    specialization: user?.specialization || '',
    experience: user?.experience || '',
    qualifications: user?.qualifications || '',
    availability: user?.availability || {},
    acceptNewPatients: true,
    onlineConsultation: true,
  })

  const [adminSettings, setAdminSettings] = useState({
    systemMaintenance: false,
    backupFrequency: 'daily',
    auditLogging: true,
    userRegistration: true,
    dataRetention: '365',
  })

  const userRole = user?.role || 'patient'

  // Tab configuration based on role
  const getTabsForRole = () => {
    const baseTabs = [
      { id: 'profile', name: 'Profile', icon: User },
      { id: 'security', name: 'Security', icon: Shield },
      { id: 'notifications', name: 'Notifications', icon: Bell },
      { id: 'preferences', name: 'Preferences', icon: Settings },
    ]

    switch (userRole) {
      case 'admin':
        return [
          ...baseTabs,
          { id: 'system', name: 'System', icon: Database },
          { id: 'users', name: 'User Management', icon: UserCheck },
        ]
      case 'doctor':
        return [
          ...baseTabs,
          { id: 'practice', name: 'Practice Settings', icon: Stethoscope },
        ]
      default:
        return baseTabs
    }
  }

  const tabs = getTabsForRole()

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 5000)
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateProfile(profileData)
      showMessage('success', 'Profile updated successfully!')
    } catch (error) {
      showMessage('error', error.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('error', 'New passwords do not match')
      return
    }
    setLoading(true)
    try {
      // Implement password change logic
      showMessage('success', 'Password changed successfully!')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      showMessage('error', error.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const handleNotificationUpdate = async () => {
    setLoading(true)
    try {
      // Implement notification settings update
      showMessage('success', 'Notification settings updated!')
    } catch (error) {
      showMessage('error', 'Failed to update notification settings')
    } finally {
      setLoading(false)
    }
  }

  const handlePreferencesUpdate = async () => {
    setLoading(true)
    try {
      // Implement preferences update
      showMessage('success', 'Preferences updated!')
    } catch (error) {
      showMessage('error', 'Failed to update preferences')
    } finally {
      setLoading(false)
    }
  }

  // Profile Tab Content
  const ProfileTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Personal Information
        </h3>
        
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          {/* Profile Picture */}
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {profileData.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </span>
            </div>
            <div>
              <button
                type="button"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <Camera className="h-4 w-4" />
                <span>Change Photo</span>
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                JPG, PNG up to 5MB
              </p>
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={profileData.firstName}
                onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={profileData.lastName}
                onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Mail className="h-4 w-4 inline mr-1" />
                Email
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Phone className="h-4 w-4 inline mr-1" />
                Phone
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Additional Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              <MapPin className="h-4 w-4 inline mr-1" />
              Address
            </label>
            <textarea
              value={profileData.address}
              onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Calendar className="h-4 w-4 inline mr-1" />
                Date of Birth
              </label>
              <input
                type="date"
                value={profileData.dateOfBirth}
                onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Bio
            </label>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              rows={4}
              placeholder="Tell us about yourself..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </form>
      </div>
    </div>
  )

  // Security Tab Content
  const SecurityTab = () => (
    <div className="space-y-6">
      {/* Password Change */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Change Password
        </h3>
        
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
            <span>{loading ? 'Updating...' : 'Update Password'}</span>
          </button>
        </form>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Two-Factor Authentication
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add an extra layer of security to your account
            </p>
          </div>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Enable 2FA
          </button>
        </div>
      </div>

      {/* Login Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Login Activity
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Monitor className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Current Session
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Chrome on Linux • Just now
                </p>
              </div>
            </div>
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  // Notifications Tab Content
  const NotificationsTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Notification Preferences
        </h3>
        
        <div className="space-y-4">
          {Object.entries(notificationSettings).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {getNotificationDescription(key)}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setNotificationSettings({ 
                    ...notificationSettings, 
                    [key]: e.target.checked 
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>

        <button
          onClick={handleNotificationUpdate}
          disabled={loading}
          className="mt-6 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>{loading ? 'Saving...' : 'Save Preferences'}</span>
        </button>
      </div>
    </div>
  )

  // Preferences Tab Content
  const PreferencesTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          General Preferences
        </h3>
        
        <div className="space-y-4">
          {/* Theme */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Palette className="h-5 w-5 text-gray-400" />
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Theme
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Choose your preferred theme
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="text-sm capitalize">{theme}</span>
            </button>
          </div>

          {/* Language */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Languages className="h-5 w-5 text-gray-400" />
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Language
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Select your preferred language
                </p>
              </div>
            </div>
            <select
              value={preferences.language}
              onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          {/* Timezone */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-gray-400" />
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Timezone
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Set your local timezone
                </p>
              </div>
            </div>
            <select
              value={preferences.timezone}
              onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </div>

          {/* Other preferences */}
          {Object.entries({
            soundEnabled: 'Sound Effects',
            autoSave: 'Auto Save',
            compactView: 'Compact View'
          }).map(([key, label]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  {label}
                </h4>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences[key]}
                  onChange={(e) => setPreferences({ 
                    ...preferences, 
                    [key]: e.target.checked 
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>

        <button
          onClick={handlePreferencesUpdate}
          disabled={loading}
          className="mt-6 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>{loading ? 'Saving...' : 'Save Preferences'}</span>
        </button>
      </div>
    </div>
  )

  // Doctor Practice Settings
  const PracticeTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Practice Information
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Specialization
              </label>
              <input
                type="text"
                value={doctorSettings.specialization}
                onChange={(e) => setDoctorSettings({ ...doctorSettings, specialization: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Cardiology"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Years of Experience
              </label>
              <input
                type="number"
                value={doctorSettings.experience}
                onChange={(e) => setDoctorSettings({ ...doctorSettings, experience: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Qualifications
            </label>
            <textarea
              value={doctorSettings.qualifications}
              onChange={(e) => setDoctorSettings({ ...doctorSettings, qualifications: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="List your medical degrees and certifications"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Consultation Fee (USD)
            </label>
            <input
              type="number"
              value={doctorSettings.consultationFee}
              onChange={(e) => setDoctorSettings({ ...doctorSettings, consultationFee: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              min="0"
              step="0.01"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Accept New Patients
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Allow new patients to book appointments
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={doctorSettings.acceptNewPatients}
                  onChange={(e) => setDoctorSettings({ 
                    ...doctorSettings, 
                    acceptNewPatients: e.target.checked 
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Online Consultation
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Offer video/audio consultations
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={doctorSettings.onlineConsultation}
                  onChange={(e) => setDoctorSettings({ 
                    ...doctorSettings, 
                    onlineConsultation: e.target.checked 
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        <button
          disabled={loading}
          className="mt-6 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>{loading ? 'Saving...' : 'Save Practice Settings'}</span>
        </button>
      </div>
    </div>
  )

  // Admin System Settings
  const SystemTab = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          System Configuration
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Maintenance Mode
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Temporarily disable user access for maintenance
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={adminSettings.systemMaintenance}
                onChange={(e) => setAdminSettings({ 
                  ...adminSettings, 
                  systemMaintenance: e.target.checked 
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-red-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Backup Frequency
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                How often to backup system data
              </p>
            </div>
            <select
              value={adminSettings.backupFrequency}
              onChange={(e) => setAdminSettings({ ...adminSettings, backupFrequency: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Data Retention (Days)
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                How long to keep system logs
              </p>
            </div>
            <input
              type="number"
              value={adminSettings.dataRetention}
              onChange={(e) => setAdminSettings({ ...adminSettings, dataRetention: e.target.value })}
              className="w-24 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              min="1"
            />
          </div>
        </div>

        <button
          disabled={loading}
          className="mt-6 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>{loading ? 'Saving...' : 'Save System Settings'}</span>
        </button>
      </div>
    </div>
  )

  const getNotificationDescription = (key) => {
    const descriptions = {
      emailNotifications: 'Receive notifications via email',
      pushNotifications: 'Receive browser push notifications',
      smsNotifications: 'Receive notifications via SMS',
      appointmentReminders: 'Get reminded about upcoming appointments',
      paymentAlerts: 'Receive payment and billing notifications',
      systemUpdates: 'Get notified about system updates and changes',
      marketingEmails: 'Receive marketing and promotional emails',
    }
    return descriptions[key] || ''
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab />
      case 'security':
        return <SecurityTab />
      case 'notifications':
        return <NotificationsTab />
      case 'preferences':
        return <PreferencesTab />
      case 'practice':
        return <PracticeTab />
      case 'system':
        return <SystemTab />
      default:
        return <ProfileTab />
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Settings className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your account settings and preferences
            </p>
          </div>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={clsx(
          'p-4 rounded-lg flex items-center space-x-2',
          message.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
            : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
        )}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertTriangle className="h-5 w-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={clsx(
                      'w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      activeTab === tab.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {renderTabContent()}
        </div>
      </div>
    </div>
  )
}

export default SettingsPage 