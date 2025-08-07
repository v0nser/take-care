import { useState, useEffect } from 'react';
import { useApi } from '../../contexts/ApiContext';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Clock, Plus, Trash2, Save, X, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const DoctorAvailability = () => {
  const { availability } = useApi();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('schedule'); // schedule, blocked-dates, settings
  
  // Schedule state
  const [weeklySchedule, setWeeklySchedule] = useState({
    monday: { isAvailable: false, startTime: '09:00', endTime: '17:00', slots: [] },
    tuesday: { isAvailable: false, startTime: '09:00', endTime: '17:00', slots: [] },
    wednesday: { isAvailable: false, startTime: '09:00', endTime: '17:00', slots: [] },
    thursday: { isAvailable: false, startTime: '09:00', endTime: '17:00', slots: [] },
    friday: { isAvailable: false, startTime: '09:00', endTime: '17:00', slots: [] },
    saturday: { isAvailable: false, startTime: '09:00', endTime: '17:00', slots: [] },
    sunday: { isAvailable: false, startTime: '09:00', endTime: '17:00', slots: [] }
  });
  
  // Settings state
  const [settings, setSettings] = useState({
    defaultSlotDuration: 30,
    bufferTime: 10,
    maxAdvanceBooking: 30,
    isAcceptingNewPatients: true,
    timezone: 'Asia/Kolkata'
  });
  
  // Blocked dates state
  const [blockedDates, setBlockedDates] = useState([]);
  const [newBlockedDate, setNewBlockedDate] = useState({
    date: '',
    reason: '',
    isRecurring: false,
    recurringType: ''
  });

  const daysOfWeek = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const response = await availability.getMySchedule();
      
      if (response.data.availability) {
        const availability = response.data.availability;
        
        // Update weekly schedule
        if (availability.weeklySchedule) {
          setWeeklySchedule(availability.weeklySchedule);
        }
        
        // Update settings
        setSettings({
          defaultSlotDuration: availability.defaultSlotDuration || 30,
          bufferTime: availability.bufferTime || 10,
          maxAdvanceBooking: availability.maxAdvanceBooking || 30,
          isAcceptingNewPatients: availability.isAcceptingNewPatients !== false,
          timezone: availability.timezone || 'Asia/Kolkata'
        });
        
        // Update blocked dates
        setBlockedDates(availability.blockedDates || []);
      }
    } catch (error) {
      toast.error('Failed to fetch availability');
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = async (day) => {
    try {
      const daySchedule = weeklySchedule[day];
      const response = await availability.generateSlots({
        startTime: daySchedule.startTime,
        endTime: daySchedule.endTime,
        duration: settings.defaultSlotDuration,
        buffer: settings.bufferTime
      });
      
      const updatedSchedule = {
        ...weeklySchedule,
        [day]: {
          ...daySchedule,
          slots: response.data.slots
        }
      };
      
      setWeeklySchedule(updatedSchedule);
      toast.success(`Time slots generated for ${day}`);
    } catch (error) {
      toast.error('Failed to generate time slots');
      console.error('Error generating slots:', error);
    }
  };

  const handleDayToggle = (day) => {
    const updatedSchedule = {
      ...weeklySchedule,
      [day]: {
        ...weeklySchedule[day],
        isAvailable: !weeklySchedule[day].isAvailable
      }
    };
    setWeeklySchedule(updatedSchedule);
  };

  const handleTimeChange = (day, timeType, value) => {
    const updatedSchedule = {
      ...weeklySchedule,
      [day]: {
        ...weeklySchedule[day],
        [timeType]: value,
        slots: [] // Reset slots when time changes
      }
    };
    setWeeklySchedule(updatedSchedule);
  };

  const saveSchedule = async () => {
    try {
      setLoading(true);
      await availability.updateMySchedule({
        weeklySchedule,
        ...settings
      });
      toast.success('Schedule updated successfully');
    } catch (error) {
      toast.error('Failed to update schedule');
      console.error('Error updating schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBlockedDate = async () => {
    if (!newBlockedDate.date || !newBlockedDate.reason) {
      toast.error('Please provide both date and reason');
      return;
    }

    try {
      setLoading(true);
      await availability.blockDate(newBlockedDate);
      
      setBlockedDates([...blockedDates, newBlockedDate]);
      setNewBlockedDate({
        date: '',
        reason: '',
        isRecurring: false,
        recurringType: ''
      });
      
      toast.success('Date blocked successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to block date');
      console.error('Error blocking date:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeBlockedDate = async (date) => {
    try {
      setLoading(true);
      await availability.unblockDate({ date });
      
      setBlockedDates(blockedDates.filter(blocked => blocked.date !== date));
      toast.success('Date unblocked successfully');
    } catch (error) {
      toast.error('Failed to unblock date');
      console.error('Error unblocking date:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderScheduleTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Weekly Schedule
        </h3>
        <button
          onClick={saveSchedule}
          disabled={loading}
          className="btn-primary disabled:opacity-50"
        >
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Saving...' : 'Save Schedule'}
        </button>
      </div>

      <div className="space-y-4">
        {daysOfWeek.map(({ key, label }) => {
          const daySchedule = weeklySchedule[key];
          
          return (
            <div
              key={key}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={daySchedule.isAvailable}
                      onChange={() => handleDayToggle(key)}
                      className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="ml-2 text-lg font-medium text-gray-900 dark:text-white capitalize">
                      {label}
                    </span>
                  </label>
                </div>
                
                {daySchedule.isAvailable && (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <input
                        type="time"
                        value={daySchedule.startTime}
                        onChange={(e) => handleTimeChange(key, 'startTime', e.target.value)}
                        className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        value={daySchedule.endTime}
                        onChange={(e) => handleTimeChange(key, 'endTime', e.target.value)}
                        className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-800"
                      />
                    </div>
                    
                    <button
                      onClick={() => generateTimeSlots(key)}
                      className="btn-outline text-sm"
                    >
                      Generate Slots
                    </button>
                  </div>
                )}
              </div>
              
              {daySchedule.isAvailable && daySchedule.slots && daySchedule.slots.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Generated Time Slots ({daySchedule.slots.length} slots)
                  </h4>
                  <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
                    {daySchedule.slots.map((slot, index) => (
                      <div
                        key={index}
                        className="px-2 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded text-xs text-center"
                      >
                        {slot.startTime}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderBlockedDatesTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Blocked Dates
      </h3>

      {/* Add New Blocked Date */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">
          Block a Date
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <input
              type="date"
              value={newBlockedDate.date}
              onChange={(e) => setNewBlockedDate(prev => ({ ...prev, date: e.target.value }))}
              min={format(new Date(), 'yyyy-MM-dd')}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Reason
            </label>
            <input
              type="text"
              value={newBlockedDate.reason}
              onChange={(e) => setNewBlockedDate(prev => ({ ...prev, reason: e.target.value }))}
              placeholder="e.g., Holiday, Conference, Personal"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={newBlockedDate.isRecurring}
              onChange={(e) => setNewBlockedDate(prev => ({ ...prev, isRecurring: e.target.checked }))}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Recurring block
            </span>
          </label>
          
          <button
            onClick={addBlockedDate}
            disabled={loading || !newBlockedDate.date || !newBlockedDate.reason}
            className="btn-primary disabled:opacity-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Block Date
          </button>
        </div>
      </div>

      {/* Existing Blocked Dates */}
      <div className="space-y-3">
        {blockedDates.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No blocked dates</p>
          </div>
        ) : (
          blockedDates.map((blocked, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <Calendar className="h-5 w-5 text-red-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {format(new Date(blocked.date), 'EEEE, MMMM d, yyyy')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {blocked.reason}
                    {blocked.isRecurring && (
                      <span className="ml-2 px-2 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded text-xs">
                        Recurring {blocked.recurringType}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => removeBlockedDate(blocked.date)}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Availability Settings
      </h3>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Default Slot Duration (minutes)
            </label>
            <select
              value={settings.defaultSlotDuration}
              onChange={(e) => setSettings(prev => ({ ...prev, defaultSlotDuration: parseInt(e.target.value) }))}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>1 hour</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Buffer Time (minutes)
            </label>
            <select
              value={settings.bufferTime}
              onChange={(e) => setSettings(prev => ({ ...prev, bufferTime: parseInt(e.target.value) }))}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
            >
              <option value={0}>No buffer</option>
              <option value={5}>5 minutes</option>
              <option value={10}>10 minutes</option>
              <option value={15}>15 minutes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Maximum Advance Booking (days)
            </label>
            <input
              type="number"
              value={settings.maxAdvanceBooking}
              onChange={(e) => setSettings(prev => ({ ...prev, maxAdvanceBooking: parseInt(e.target.value) }))}
              min={1}
              max={365}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Timezone
            </label>
            <select
              value={settings.timezone}
              onChange={(e) => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="Europe/London">Europe/London (GMT)</option>
              <option value="Asia/Dubai">Asia/Dubai (GST)</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.isAcceptingNewPatients}
              onChange={(e) => setSettings(prev => ({ ...prev, isAcceptingNewPatients: e.target.checked }))}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Currently accepting new patients
            </span>
          </label>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={saveSchedule}
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Manage Availability
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Set your working hours, block dates, and configure appointment settings
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'schedule', label: 'Weekly Schedule' },
            { id: 'blocked-dates', label: 'Blocked Dates' },
            { id: 'settings', label: 'Settings' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                py-2 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
        {activeTab === 'schedule' && renderScheduleTab()}
        {activeTab === 'blocked-dates' && renderBlockedDatesTab()}
        {activeTab === 'settings' && renderSettingsTab()}
      </div>
    </div>
  );
};

export default DoctorAvailability; 