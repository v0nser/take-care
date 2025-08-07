import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { User, Stethoscope, Shield, ArrowRight, Check } from 'lucide-react';

const RoleSelection = () => {
  const { user, updateRole, isLoading, error } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [localError, setLocalError] = useState('');

  const roles = [
    {
      id: 'patient',
      name: 'Patient',
      description: 'Access your health records, book appointments, and manage your care',
      icon: User,
      color: 'from-blue-500 to-cyan-500',
      features: [
        'Book appointments with doctors',
        'View medical records and test results',
        'Manage prescriptions and treatments',
        'Access telehealth consultations'
      ]
    },
    {
      id: 'doctor',
      name: 'Doctor',
      description: 'Manage patients, appointments, and provide medical care',
      icon: Stethoscope,
      color: 'from-emerald-500 to-teal-500',
      features: [
        'Manage patient appointments',
        'Access patient medical records',
        'Prescribe medications',
        'Conduct virtual consultations'
      ]
    },
    {
      id: 'admin',
      name: 'Administrator',
      description: 'Oversee system operations and manage healthcare facility',
      icon: Shield,
      color: 'from-purple-500 to-indigo-500',
      features: [
        'Manage users and permissions',
        'System configuration and settings',
        'Analytics and reporting',
        'Facility management tools'
      ]
    }
  ];

  const handleRoleSelect = async (role) => {
    console.log('🎯 Role selection clicked:', role);
    
    setSelectedRole(role);
    setLocalError('');

    console.log('🔄 Updating user role to:', role);

    try {
      await updateRole(role);
      
      console.log('✅ Role updated successfully');
      console.log('🚀 Redirecting to dashboard...');
      
      // Navigate to appropriate dashboard
      const dashboardPath = role === 'doctor' ? '/dashboard/doctor' : 
                           role === 'admin' ? '/dashboard/admin' : 
                           '/dashboard/patient';
      
      navigate(dashboardPath);

    } catch (err) {
      console.error('❌ Error updating role:', err);
      setLocalError(`Failed to update role: ${err.message}`);
      setSelectedRole(null);
    }
  };

  // If user already has a role, redirect them to dashboard
  if (user?.role) {
    const dashboardPath = user.role === 'doctor' ? '/dashboard/doctor' : 
                         user.role === 'admin' ? '/dashboard/admin' : 
                         '/dashboard/patient';
    navigate(dashboardPath, { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-playfair font-black tracking-tight mb-6">
            <span className="text-gradient-primary bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Choose Your Role
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Welcome {user?.firstName}! Select your role to access the appropriate features and dashboard
          </p>
        </div>

        {/* Error Display */}
        {(error || localError) && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-center">
              {localError || error}
            </p>
          </div>
        )}

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            const isDisabled = isLoading;
            
            return (
              <div
                key={role.id}
                onClick={() => !isDisabled && handleRoleSelect(role.id)}
                className={`relative group cursor-pointer transition-all duration-500 ${
                  isSelected 
                    ? 'scale-105 shadow-2xl' 
                    : 'hover:scale-102 hover:shadow-xl'
                } ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                {/* Card */}
                <div className={`
                  relative overflow-hidden rounded-3xl border-2 transition-all duration-300
                  ${isSelected 
                    ? 'border-blue-400 bg-white dark:bg-slate-800 shadow-2xl' 
                    : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 group-hover:border-gray-300 dark:group-hover:border-slate-600'
                  }
                `}>
                  
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-5 ${isSelected ? 'opacity-10' : ''}`} />
                  
                  {/* Content */}
                  <div className="relative p-8">
                    {/* Icon and Title */}
                    <div className="flex items-center space-x-4 mb-6">
                      <div className={`
                        p-4 rounded-2xl bg-gradient-to-br ${role.color} shadow-lg
                        ${isSelected ? 'scale-110' : 'group-hover:scale-105'}
                        transition-transform duration-300
                      `}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {role.name}
                        </h3>
                        {isSelected && (
                          <div className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 mt-1">
                            <Check className="h-4 w-4" />
                            <span className="text-sm font-medium">Selected</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                      {role.description}
                    </p>
                    
                    {/* Features */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                        Key Features
                      </h4>
                      <ul className="space-y-2">
                        {role.features.map((feature, index) => (
                          <li key={index} className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <div className={`mt-1.5 h-1.5 w-1.5 rounded-full bg-gradient-to-r ${role.color} flex-shrink-0`} />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Action Button */}
                    <div className="mt-8">
                      <button
                        disabled={isDisabled}
                        className={`
                          w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2
                          ${isSelected 
                            ? `bg-gradient-to-r ${role.color} text-white shadow-lg hover:shadow-xl` 
                            : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 group-hover:bg-gray-200 dark:group-hover:bg-slate-600'
                          }
                          ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                        `}
                      >
                        {isLoading && selectedRole === role.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Updating...</span>
                          </>
                        ) : (
                          <>
                            <span>{isSelected ? 'Confirm Selection' : `Select ${role.name}`}</span>
                            <ArrowRight className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="absolute top-4 right-4">
                      <div className={`p-2 rounded-full bg-gradient-to-r ${role.color} shadow-lg`}>
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Help Text */}
        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Don't worry, you can change your role later in settings if needed
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
