import { useState, useEffect } from 'react';
import { useApi } from '../../contexts/ApiContext';
import { 
  Heart, 
  Thermometer, 
  Activity, 
  AlertTriangle, 
  Pill, 
  Save,
  CheckCircle2,
  User
} from 'lucide-react';
import toast from 'react-hot-toast';

const PreConsultationForm = ({ appointmentId, onComplete }) => {
  const { meetings } = useApi();
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [formData, setFormData] = useState({
    chiefComplaint: '',
    currentMedications: [],
    allergies: [],
    vitalSigns: {
      temperature: '',
      bloodPressure: '',
      heartRate: '',
      weight: '',
      height: ''
    },
    urgencyLevel: 'medium'
  });

  const [newMedication, setNewMedication] = useState('');
  const [newAllergy, setNewAllergy] = useState('');

  const urgencyLevels = [
    { value: 'low', label: 'Low', color: 'green', description: 'Non-urgent, routine consultation' },
    { value: 'medium', label: 'Medium', color: 'yellow', description: 'Standard consultation' },
    { value: 'high', label: 'High', color: 'orange', description: 'Needs prompt attention' },
    { value: 'urgent', label: 'Urgent', color: 'red', description: 'Requires immediate attention' }
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    setSaved(false);
  };

  const addMedication = () => {
    if (newMedication.trim()) {
      setFormData(prev => ({
        ...prev,
        currentMedications: [...prev.currentMedications, newMedication.trim()]
      }));
      setNewMedication('');
      setSaved(false);
    }
  };

  const removeMedication = (index) => {
    setFormData(prev => ({
      ...prev,
      currentMedications: prev.currentMedications.filter((_, i) => i !== index)
    }));
    setSaved(false);
  };

  const addAllergy = () => {
    if (newAllergy.trim()) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }));
      setNewAllergy('');
      setSaved(false);
    }
  };

  const removeAllergy = (index) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter((_, i) => i !== index)
    }));
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await meetings.updatePreConsultation(appointmentId, formData);
      setSaved(true);
      toast.success('Pre-consultation form saved successfully!');
      if (onComplete) onComplete();
    } catch (error) {
      toast.error('Failed to save pre-consultation form');
      console.error('Error saving pre-consultation form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Pre-Consultation Form
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Please provide information to help your doctor prepare for the consultation
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Chief Complaint */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <AlertTriangle className="h-4 w-4 inline mr-2" />
            Chief Complaint *
          </label>
          <textarea
            value={formData.chiefComplaint}
            onChange={(e) => handleInputChange('chiefComplaint', e.target.value)}
            placeholder="Describe your main concern or reason for this consultation..."
            rows={3}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>

        {/* Urgency Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Urgency Level
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {urgencyLevels.map(level => (
              <button
                key={level.value}
                type="button"
                onClick={() => handleInputChange('urgencyLevel', level.value)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  formData.urgencyLevel === level.value
                    ? `border-${level.color}-500 bg-${level.color}-50 dark:bg-${level.color}-900/20`
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                <div className={`text-sm font-medium ${
                  formData.urgencyLevel === level.value 
                    ? `text-${level.color}-700 dark:text-${level.color}-300`
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {level.label}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {level.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Current Medications */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Pill className="h-4 w-4 inline mr-2" />
            Current Medications
          </label>
          <div className="space-y-2">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMedication}
                onChange={(e) => setNewMedication(e.target.value)}
                placeholder="Enter medication name and dosage..."
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMedication())}
              />
              <button
                type="button"
                onClick={addMedication}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
            {formData.currentMedications.length > 0 && (
              <div className="space-y-1">
                {formData.currentMedications.map((medication, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded-lg">
                    <span className="text-sm text-gray-900 dark:text-white">{medication}</span>
                    <button
                      type="button"
                      onClick={() => removeMedication(index)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
            {formData.currentMedications.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No current medications listed
              </p>
            )}
          </div>
        </div>

        {/* Allergies */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <AlertTriangle className="h-4 w-4 inline mr-2" />
            Known Allergies
          </label>
          <div className="space-y-2">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                placeholder="Enter allergy (medication, food, environmental)..."
                className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
              />
              <button
                type="button"
                onClick={addAllergy}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
            {formData.allergies.length > 0 && (
              <div className="space-y-1">
                {formData.allergies.map((allergy, index) => (
                  <div key={index} className="flex items-center justify-between bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                    <span className="text-sm text-gray-900 dark:text-white">{allergy}</span>
                    <button
                      type="button"
                      onClick={() => removeAllergy(index)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
            {formData.allergies.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No known allergies listed
              </p>
            )}
          </div>
        </div>

        {/* Vital Signs (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            <Activity className="h-4 w-4 inline mr-2" />
            Vital Signs (if available)
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                <Thermometer className="h-3 w-3 inline mr-1" />
                Temperature (°F)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.vitalSigns.temperature}
                onChange={(e) => handleInputChange('vitalSigns.temperature', e.target.value)}
                placeholder="98.6"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                <Heart className="h-3 w-3 inline mr-1" />
                Blood Pressure
              </label>
              <input
                type="text"
                value={formData.vitalSigns.bloodPressure}
                onChange={(e) => handleInputChange('vitalSigns.bloodPressure', e.target.value)}
                placeholder="120/80"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                <Activity className="h-3 w-3 inline mr-1" />
                Heart Rate (bpm)
              </label>
              <input
                type="number"
                value={formData.vitalSigns.heartRate}
                onChange={(e) => handleInputChange('vitalSigns.heartRate', e.target.value)}
                placeholder="72"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                Weight (lbs)
              </label>
              <input
                type="number"
                value={formData.vitalSigns.weight}
                onChange={(e) => handleInputChange('vitalSigns.weight', e.target.value)}
                placeholder="150"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                Height (inches)
              </label>
              <input
                type="number"
                value={formData.vitalSigns.height}
                onChange={(e) => handleInputChange('vitalSigns.height', e.target.value)}
                placeholder="70"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 text-sm">
            {saved && (
              <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                <span>Form saved successfully</span>
              </div>
            )}
          </div>
          
          <button
            type="submit"
            disabled={loading || !formData.chiefComplaint.trim()}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? 'Saving...' : 'Save Form'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PreConsultationForm; 