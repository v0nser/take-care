import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  IndianRupee, 
  Calendar, 
  Star, 
  CheckCircle, 
  Users, 
  Shield, 
  Award,
  Phone,
  Video,
  MessageCircle,
  ArrowRight,
  Heart,
  Zap,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getSpecialtyById } from '../utils/servicesData';

const ServiceDetailPage = () => {
  const { specialtyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isSignedIn } = useAuth();
  const specialty = getSpecialtyById(specialtyId);

  // Check if we're in dashboard context
  const isInDashboard = location.pathname.startsWith('/dashboard');

  if (!specialty) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Service Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The requested medical service could not be found.</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleBookAppointment = () => {
    if (isSignedIn) {
      navigate(`/dashboard/appointments/book?specialty=${specialtyId}`);
    } else {
      const returnUrl = encodeURIComponent(`/dashboard/appointments/book?specialty=${specialtyId}`);
      navigate(`/login?returnUrl=${returnUrl}`);
    }
  };

  const handleGoBack = () => {
    if (isInDashboard) {
      navigate('/dashboard/services');
    } else {
      navigate('/services');
    }
  };

  const Icon = specialty.icon;

  const consultationTypes = [
    {
      type: 'Video Call',
      icon: Video,
      description: 'Online consultation from home',
      price: specialty.consultationFee,
      available: true,
      popular: true
    },
    {
      type: 'Phone Call',
      icon: Phone,
      description: 'Voice consultation',
      price: '₹400-600',
      available: true,
      popular: false
    },
    {
      type: 'In-Person',
      icon: Users,
      description: 'Visit clinic for consultation',
      price: specialty.consultationFee,
      available: true,
      popular: false
    },
    {
      type: 'Chat',
      icon: MessageCircle,
      description: 'Text-based consultation',
      price: '₹300-500',
      available: false,
      popular: false
    }
  ];

  const features = [
    { icon: Shield, title: 'Verified Doctors', description: 'All specialists are board-certified' },
    { icon: Clock, title: 'Quick Booking', description: 'Get appointments within 24 hours' },
    { icon: Award, title: 'Quality Care', description: 'Highest standards of medical care' },
    { icon: Star, title: 'Top Rated', description: '4.8+ average rating from patients' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleGoBack}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Services
            </button>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Heart className="w-4 h-4 text-red-500" />
                Healthcare Services
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className={`relative overflow-hidden bg-gradient-to-r ${specialty.color} rounded-3xl mb-8`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-10 h-10 text-white" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-white">{specialty.fullName}</h1>
                  {specialty.popular && (
                    <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      <Star className="w-4 h-4 text-yellow-300 fill-current" />
                      <span className="text-white text-sm font-medium">Popular</span>
                    </div>
                  )}
                </div>
                <p className="text-white/90 text-lg md:text-xl mb-6 max-w-3xl">
                  {specialty.description}
                </p>
                
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2 text-white/90">
                    <Clock className="w-5 h-5" />
                    <span>Wait time: {specialty.waitTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <IndianRupee className="w-5 h-5" />
                    <span>From {specialty.consultationFee}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <Calendar className="w-5 h-5" />
                    <span>Available {specialty.availability}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <Star className="w-5 h-5 fill-current" />
                    <span>4.8/5 rating</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <button
                  onClick={handleBookAppointment}
                  className="bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-200 flex items-center gap-2 group shadow-lg"
                >
                  Book Consultation
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Available Doctors', value: '50+', icon: Users, color: 'blue' },
            { label: 'Consultations Today', value: '120+', icon: TrendingUp, color: 'green' },
            { label: 'Success Rate', value: '98%', icon: CheckCircle, color: 'purple' },
            { label: 'Avg Rating', value: '4.8/5', icon: Star, color: 'yellow' }
          ].map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <StatIcon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Consultation Types */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Video className="w-6 h-6 text-blue-600" />
                Consultation Options
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {consultationTypes.map((type, index) => {
                  const TypeIcon = type.icon;
                  return (
                    <div
                      key={type.type}
                      className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                        type.available
                          ? 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer'
                          : 'border-gray-100 dark:border-gray-800 opacity-50'
                      } ${type.popular ? 'ring-2 ring-blue-500/20' : ''}`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {type.popular && (
                        <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                          Popular
                        </div>
                      )}
                      
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          type.available ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-700'
                        }`}>
                          <TypeIcon className={`w-6 h-6 ${
                            type.available ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400'
                          }`} />
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{type.type}</h3>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{type.description}</p>
                          <div className="text-blue-600 dark:text-blue-400 font-medium">{type.price}</div>
                          {!type.available && (
                            <div className="text-gray-400 text-xs mt-1">Coming Soon</div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Services Offered */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Services We Offer
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specialty.services.map((service, index) => (
                  <div
                    key={service}
                    className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-gray-900 dark:text-white font-medium">{service}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Conditions */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-600" />
                Common Conditions We Treat
              </h2>
              
              <div className="flex flex-wrap gap-3">
                {specialty.conditions.map((condition, index) => (
                  <span
                    key={condition}
                    className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-xl font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    {condition}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Book Appointment Card */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Ready to Book?</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                Get expert consultation with our qualified {specialty.name.toLowerCase()} specialists.
              </p>
              
              <button
                onClick={handleBookAppointment}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 group mb-4"
              >
                <Calendar className="w-5 h-5" />
                Book Consultation
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                <Zap className="w-4 h-4 inline mr-1" />
                Quick booking • Same day availability
              </div>
            </div>

            {/* Features */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Why Choose Us?</h3>
              
              <div className="space-y-4">
                {features.map((feature, index) => {
                  const FeatureIcon = feature.icon;
                  return (
                    <div
                      key={feature.title}
                      className="flex items-start gap-3"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FeatureIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{feature.title}</h4>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Need Help?</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">+91 98765 43210</span>
                </div>
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">Live Chat Available</span>
                </div>
              </div>
              
              <button className="w-full mt-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailPage; 