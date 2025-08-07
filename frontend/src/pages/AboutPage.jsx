import React from 'react';
import { 
  Heart, 
  Users, 
  Award, 
  Zap, 
  Shield, 
  Clock, 
  Star, 
  ArrowRight,
  Target,
  Lightbulb,
  TrendingUp,
  Settings,
  CheckCircle,
  Globe,
  Smartphone,
  Monitor,
  Database,
  Lock
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import Navbar from '../components/layouts/Navbar.jsx';
import Footer from '../components/layouts/Footer.jsx';

const AboutPage = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const solutions = [
    {
      icon: Settings,
      title: 'Dynamic Operation Tools',
      description: 'Revolutionize your daily operations with our advanced tools that bring a new level of efficiency and ease. From intuitive scheduling systems to comprehensive patient management software, our solutions are designed to simplify complex workflows, alleviate administrative burdens, and ensure coordinated, top-notch care delivery.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: TrendingUp,
      title: 'Cutting-Edge Execution Systems',
      description: 'Boost your facility\'s performance with our state-of-the-art execution systems. With real-time data analytics and seamless integration, our tools enable precise tracking of patient progress, smooth communication between healthcare providers, and timely interventions.',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Database,
      title: 'All-Inclusive Management Platforms',
      description: 'Our management platforms offer a complete approach to running healthcare facilities with ease. Featuring robust tools for compliance, resource management, and financial oversight, our solutions empower you to make strategic decisions.',
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  const features = [
    {
      icon: Zap,
      title: 'Pioneering Technology',
      description: 'Integrate cutting-edge innovations like automation, IoT devices, and AI-driven analytics to streamline operations, enhance efficiency, and enable data-driven decision-making.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Heart,
      title: 'Patient-Centric Approach',
      description: 'Our tools prioritize patient well-being, offering exceptional, personalized care. We blend advanced technology with compassion to empower patients.',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: TrendingUp,
      title: 'Enhanced Efficiency',
      description: 'Experience streamlined operations, improved communication, and reduced administrative load with cutting-edge technology. Team focus shifts to strategic initiatives.',
      color: 'from-purple-500 to-indigo-500'
    },
    {
      icon: Globe,
      title: 'Flexible Solutions',
      description: 'Scalable solutions for healthcare providers, from nursing homes to laboratories, offer efficiency improvements, patient care enhancements, and operational streamlining.',
      color: 'from-rose-500 to-pink-500'
    }
  ];

  const stats = [
    { label: 'Quality Doctors', value: '500+', icon: Users },
    { label: 'Medical Research Professionals', value: '200+', icon: Award },
    { label: 'Positive Consultation', value: '99.5%', icon: Star },
    { label: '24 Hours Support', value: '24/7', icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 font-inter">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-playfair font-black tracking-tight mb-8">
            <span className="text-gradient-primary bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Revolutionizing Healthcare
            </span>
            <br />
            <span className="text-gradient-secondary bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              with Next-Generation Solutions
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            At Take Care, we are igniting a transformation in healthcare facilities, from Nursing Homes to Laboratory Centres.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-playfair font-bold mb-8 text-gradient-primary">
                About Take Care
              </h2>
              <div className="space-y-6 text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  Our cutting-edge solutions are designed to energize your operations, enhance execution, and elevate management, all with a singular focus: delivering outstanding patient care. We understand that each healthcare setting comes with its unique challenges and demands, which is why our innovative tools and services are tailored to meet diverse needs.
                </p>
                <p>
                  Our comprehensive approach includes advanced software systems for patient management, state-of-the-art diagnostic equipment, and robust training programs to ensure that your staff is equipped with the latest knowledge and skills.
                </p>
                <p>
                  At Take Care, we're not just about making healthcare efficient; we're about making it humane. We believe that the true measure of success lies in the smiles of the patients we serve and the satisfaction of the caregivers who dedicate their lives to helping others.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-3xl text-white">
                <h3 className="text-2xl font-bold mb-4">Quality Healthcare</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3" />
                    <span>Only Qualified Doctors</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3" />
                    <span>Medical Research Professionals</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3" />
                    <span>Advanced Technology</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold mb-8 text-gradient-primary">
              Our Vision
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Imagine a world where every healthcare facility operates with flawless precision and exceptional efficiency. We at Take Care, are turning that vision into reality.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
              <Target className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold mb-4">Redefining Healthcare</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our goal is to redefine the landscape of healthcare management, ensuring that every patient receives the highest quality of care while your facility thrives with streamlined operations and innovative tools.
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
              <Lightbulb className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-bold mb-4">Continuous Innovation</h3>
              <p className="text-gray-600 dark:text-gray-300">
                By staying at the forefront of technological advancements and industry best practices, we ensure that our clients are always equipped with the latest tools and strategies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold mb-8 text-gradient-primary">
              Our Solution
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {solutions.map((solution, index) => {
              const Icon = solution.icon;
              return (
                <div key={index} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className={`inline-flex p-4 bg-gradient-to-br ${solution.color} rounded-xl mb-6`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{solution.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{solution.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-slate-700">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold mb-8 text-gradient-primary">
              Why Partner with Us?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className={`inline-flex p-4 bg-gradient-to-br ${feature.color} rounded-xl mb-6`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold mb-8 text-gradient-primary">
              Experience
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.value}</div>
                  <div className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage; 