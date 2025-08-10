import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, Calendar, Clock, Star, TrendingUp, 
  Sparkles, Eye, Grid3X3, ChevronRight, Search
} from 'lucide-react';
import { getPopularSpecialties, medicalSpecialties } from '../../utils/servicesData';
import { useAuth } from '../../contexts/AuthContext';

const ServicesSection = ({ showTitle = true, maxItems = 8, showViewAll = true }) => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const popularSpecialties = getPopularSpecialties();
  const displaySpecialties = popularSpecialties.slice(0, maxItems);

  const handleBookAppointment = (specialtyId) => {
    if (isSignedIn) {
      // User is authenticated, proceed to booking
      navigate(`/dashboard/appointments/book?specialty=${specialtyId}`);
    } else {
      // User not authenticated, redirect to login with return URL
      const returnUrl = encodeURIComponent(`/dashboard/appointments/book?specialty=${specialtyId}`);
      navigate(`/login?returnUrl=${returnUrl}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {showTitle && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Our Medical Services
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Expert care across all specialties
              </p>
            </div>
          </div>
          {showViewAll && (
            <Link
              to="/services"
              className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors group"
            >
              <span>View All Services</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          )}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Grid3X3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {medicalSpecialties.length}+
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                Specialties
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200 dark:border-green-700/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                24/7
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                Emergency Care
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-4 border border-orange-200 dark:border-orange-700/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Star className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">
                4.8★
              </p>
              <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
                Patient Rating
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                500+
              </p>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                Doctors
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displaySpecialties.map((specialty) => {
          const Icon = specialty.icon;
          
          return (
            <div 
              key={specialty.id}
              className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600 hover:-translate-y-1 cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${specialty.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-medium rounded-full flex items-center space-x-1">
                  <Star className="h-3 w-3" />
                  <span>Popular</span>
                </span>
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {specialty.name}
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                {specialty.description}
              </p>

              {/* Key Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Wait Time:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{specialty.waitTime}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">From:</span>
                  <span className="font-medium text-green-600 dark:text-green-400">{specialty.consultationFee}</span>
                </div>
              </div>

              {/* Popular Conditions */}
              <div className="mb-4">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Common Treatments:</p>
                <div className="flex flex-wrap gap-1">
                  {specialty.conditions.slice(0, 3).map((condition, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                    >
                      {condition}
                    </span>
                  ))}
                  {specialty.conditions.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs rounded-full">
                      +{specialty.conditions.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handleBookAppointment(specialty.id)}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-300 flex items-center justify-center space-x-2 text-sm"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Book Now</span>
                </button>
                <Link
                  to={`/services/${specialty.id}`}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors duration-300 flex items-center justify-center"
                >
                  <Eye className="h-4 w-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Access */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700/50">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Can't find what you're looking for?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Search through all our medical specialties or contact our support team for guidance.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Link
              to="/services"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-300 flex items-center space-x-2"
            >
              <Search className="h-4 w-4" />
              <span>Browse All Services</span>
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 border border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg font-medium transition-colors duration-300"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesSection; 