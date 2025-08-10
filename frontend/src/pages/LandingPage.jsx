import React, { useState, useEffect } from 'react';
import {
  Heart,
  Calendar,
  Users,
  CreditCard,
  Shield,
  Clock,
  Star,
  ArrowRight,
  Stethoscope,
  Activity,
  Plus,
  CheckCircle,
  Phone,
  Video,
  FileText,
  Award,
  Zap,
  Globe,
  Sparkles,
  ArrowUpRight,
  Play,
  ChevronRight,
  Check,
  Lock,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

import Footer from '../components/layouts/Footer.jsx';
import Navbar from '../components/layouts/Navbar.jsx';
import { getPopularSpecialties } from '../utils/servicesData';

// Enhanced custom styles with more sophisticated animations
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap');

  .font-playfair {
    font-family: 'Playfair Display', serif;
  }
  .font-inter {
    font-family: 'Inter', sans-serif;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-20px) rotate(5deg); }
  }
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }

  @keyframes pulse-glow {
    0%, 100% { 
      box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
      transform: scale(1);
    }
    50% { 
      box-shadow: 0 0 40px rgba(59, 130, 246, 0.6);
      transform: scale(1.05);
    }
  }
  .animate-pulse-glow {
    animation: pulse-glow 3s ease-in-out infinite;
  }

  @keyframes slideInUp {
    from { 
      opacity: 0; 
      transform: translateY(30px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
  .animate-slide-in-up {
    animation: slideInUp 0.8s ease-out forwards;
  }

  @keyframes fadeInScale {
    from { 
      opacity: 0; 
      transform: scale(0.9); 
    }
    to { 
      opacity: 1; 
      transform: scale(1); 
    }
  }
  .animate-fade-in-scale {
    animation: fadeInScale 0.6s ease-out forwards;
  }

  .gradient-text {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .gradient-border {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 1px;
    border-radius: 12px;
  }

  .glass-effect {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .hover-lift {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .hover-lift:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }

  .text-gradient-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .text-gradient-secondary {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .bg-gradient-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .bg-gradient-secondary {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }

  .bg-gradient-dark {
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  }
`;

const FeatureCard = ({ feature, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const Icon = feature.icon;

  return (
    <div
      ref={ref}
      className={`group relative p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-slate-700/50 hover-lift ${
        inView ? 'animate-fade-in-scale' : 'opacity-0'
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        <div className={`inline-flex p-4 bg-gradient-to-br ${feature.color} rounded-xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        
        <h3 className="text-xl font-bold font-inter text-gray-900 dark:text-white mb-4 group-hover:text-gradient-primary transition-all duration-300">
          {feature.title}
        </h3>
        
        <p className="font-inter text-gray-600 dark:text-gray-300 leading-relaxed">
          {feature.description}
        </p>
        
        <div className="mt-6 flex items-center text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-sm font-medium">Learn more</span>
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ stat, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const Icon = stat.icon;

  return (
    <div
      ref={ref}
      className={`text-center group ${
        inView ? 'animate-slide-in-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="inline-flex p-4 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon className="h-8 w-8 text-blue-300" />
      </div>
      <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-playfair">{stat.value}</div>
      <div className="text-blue-200 font-inter font-medium">{stat.label}</div>
    </div>
  );
};

const TestimonialCard = ({ testimonial, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      className={`glass-effect p-8 rounded-2xl hover-lift ${
        inView ? 'animate-fade-in-scale' : 'opacity-0'
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
        ))}
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed font-inter">
        "{testimonial.content}"
      </p>
      <div>
        <div className="font-semibold font-inter text-gray-900 dark:text-white">{testimonial.name}</div>
        <div className="text-gray-600 dark:text-gray-400 text-sm font-inter">{testimonial.role}</div>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: Calendar,
      title: 'Intelligent Scheduling',
      description: 'AI-powered appointment booking that learns your preferences and finds optimal time slots with top healthcare professionals.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Video,
      title: 'Premium Telemedicine',
      description: 'Crystal-clear HD video consultations with enterprise-grade security and seamless screen sharing capabilities.',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Shield,
      title: 'Military-Grade Security',
      description: 'End-to-end encryption with SOC 2 Type II compliance and HIPAA certification protecting your sensitive health data.',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: Activity,
      title: 'Advanced Analytics',
      description: 'Real-time health insights powered by machine learning with personalized recommendations and predictive care.',
      color: 'from-rose-500 to-pink-500'
    },
    {
      icon: FileText,
      title: 'Unified Health Records',
      description: 'Comprehensive digital health records with seamless integration across all healthcare providers and systems.',
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: Award,
      title: 'Elite Medical Network',
      description: 'Access to board-certified specialists and top-tier medical institutions with rigorous credentialing standards.',
      color: 'from-violet-500 to-purple-500'
    },
  ];

  const stats = [
    { label: 'Active Patients', value: '50K+', icon: Users },
    { label: 'Medical Professionals', value: '2,500+', icon: Stethoscope },
    { label: 'Consultations Completed', value: '250K+', icon: Video },
    { label: 'Patient Satisfaction', value: '99.2%', icon: Star }
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Cardiologist, Stanford Medical',
      content: 'TakeCare has transformed how I practice medicine. The platform is intuitive, secure, and my patients love the seamless experience.',
      rating: 5
    },
    {
      name: 'Michael Rodriguez',
      role: 'Patient',
      content: 'The quality of care I receive through TakeCare is exceptional. Booking appointments is effortless and the video quality is outstanding.',
      rating: 5
    },
    {
      name: 'Dr. Emily Watson',
      role: 'Pediatrician, Mayo Clinic',
      content: 'The security features give me complete confidence. It\'s healthcare technology that actually works for both providers and patients.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-hidden font-inter">
      <style>{customStyles}</style>
      
      <Navbar />
      
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 opacity-30 dark:opacity-20">
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 lg:px-8 pt-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 backdrop-blur-md"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">

          {/* Badge */}
          <div className="mt-4 mb-8 animate-slide-in-up">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full border border-blue-200 dark:border-blue-700 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-sm font-medium font-inter text-blue-800 dark:text-blue-300">Next-Generation Healthcare Platform</span>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-playfair font-black tracking-tight mb-8 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            <span className="text-gradient-primary">
              Healthcare
            </span>
            <br />
            <span className="text-gradient-secondary">
              Reimagined
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed font-inter animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
            Experience the future of healthcare with AI-powered consultations, seamless appointment booking, and enterprise-grade security for your medical records.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
            {isSignedIn ? (
              <a 
                href="/dashboard" 
                className="group relative px-10 py-5 bg-gradient-primary text-white font-bold rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 min-w-[220px] overflow-hidden inline-flex items-center justify-center"
              >
                <span className="relative z-10 flex items-center justify-center">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
            ) : (
              <Link to="/register">
                <button className="group relative px-10 py-5 bg-gradient-primary text-white font-bold rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 min-w-[220px] overflow-hidden">
                  <span className="relative z-10 flex items-center justify-center">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </Link>
            )}
            
            <button className="group px-10 py-5 glass-effect text-gray-900 dark:text-white font-semibold rounded-full hover:bg-white/20 transition-all duration-300 min-w-[220px] flex items-center justify-center">
              <Play className="h-5 w-5 mr-2" />
              Watch Demo
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-80 animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">HIPAA Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">FDA Approved</span>
            </div>
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">ISO 27001 Certified</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full mb-6">
              <span className="text-sm font-medium font-inter text-blue-800 dark:text-blue-300">Advanced Features</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-playfair font-bold mb-8">
              <span className="text-gradient-primary">
                Everything you need for
              </span>
              <br />
              <span className="text-gradient-secondary">
                modern healthcare
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-inter">
              Our comprehensive platform combines cutting-edge technology with human-centered design to deliver exceptional healthcare experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview Section */}
      <section className="relative py-32 px-6 lg:px-8 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-pink-900/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-full mb-6">
              <span className="text-sm font-medium font-inter text-green-800 dark:text-green-300">Medical Excellence</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-playfair font-bold mb-8">
              <span className="text-gradient-primary">
                Comprehensive medical
              </span>
              <br />
              <span className="text-gradient-secondary">
                specialties under one roof
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-inter mb-8">
              Expert healthcare across 25+ medical specialties with state-of-the-art facilities and renowned specialists.
            </p>
            <Link 
              to="/services"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Stethoscope className="h-5 w-5" />
              <span>Explore All Services</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {getPopularSpecialties().slice(0, 8).map((specialty, index) => {
              const Icon = specialty.icon;
              return (
                <div
                  key={specialty.id}
                  className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className={`p-4 rounded-xl bg-gradient-to-r ${specialty.color} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {specialty.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {specialty.description.slice(0, 80)}...
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      {specialty.consultationFee}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {specialty.waitTime}
                    </span>
                  </div>

                  <Link
                    to={`/services/${specialty.id}`}
                    className="mt-4 inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm group-hover:translate-x-1 transition-all duration-300"
                  >
                    Learn More
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-32">
        <div className="absolute inset-0 bg-gradient-dark"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-playfair font-bold text-white mb-8">
              Trusted by healthcare leaders worldwide
            </h2>
            <p className="text-xl text-blue-100 max-w-4xl mx-auto font-inter">
              Join thousands of healthcare providers and patients who have transformed their healthcare experience
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <StatCard key={index} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-32 px-6 lg:px-8">
        <svg
          className="absolute top-0 w-full h-auto text-white dark:text-slate-800 -mt-px transform rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
        >
          <path
            fill="currentColor"
            d="M 1000 0 C 400 100 600 0 0 100 L 0 0 L 1000 0 Z"
          />
        </svg>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-playfair font-bold mb-8">
              <span className="text-gradient-primary">
                What our community says
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-primary"></div>
        <div className="absolute inset-0 bg-black/10"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-playfair font-bold text-white mb-8">
            Ready to transform your healthcare experience?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto font-inter">
            Join thousands of satisfied users and healthcare providers who have revolutionized their healthcare journey with TakeCare.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            {isSignedIn ? (
              <a 
                href="/dashboard" 
                className="group px-10 py-5 bg-white text-gray-900 font-bold rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 min-w-[220px] inline-flex items-center justify-center"
              >
                <span className="flex items-center justify-center">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
            ) : (
              <Link to="/register">
                <button className="group px-10 py-5 bg-white text-gray-900 font-bold rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 min-w-[220px]">
                  <span className="flex items-center justify-center">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </Link>
            )}
            
            <button className="px-10 py-5 text-white font-semibold rounded-full border-2 border-white/30 hover:bg-white/10 transition-all duration-300 min-w-[220px]">
              Schedule a Demo
            </button>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 text-white/70">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Free 30-day trial</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">No setup fees</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default LandingPage;