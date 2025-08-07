import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Send, 
  Clock,
  MessageSquare,
  User,
  ArrowRight
} from 'lucide-react';
import Navbar from '../components/layouts/Navbar.jsx';
import Footer from '../components/layouts/Footer.jsx';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Address',
      content: '23/9 Naktala Road, Flat No-S4, 2nd Floor, Kolkata, West Bengal, 700047, India.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Phone,
      title: 'Call Us Now',
      content: '+91-9230982692',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Mail,
      title: 'Mail Us Now',
      content: 'info@takecareglobal.com',
      color: 'from-purple-500 to-indigo-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 font-inter">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-playfair font-black tracking-tight mb-8">
            <span className="text-gradient-primary bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Start Your Transformation
            </span>
            <br />
            <span className="text-gradient-secondary bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Today
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Leap into the future with us and revolutionize the face of healthcare! Let's explore how our pioneering solutions can energize your facility and transform patient care into an experience of excellence.
          </p>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold mb-8 text-gradient-primary">
              Contact Us
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Have any questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div key={index} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className={`inline-flex p-4 bg-gradient-to-br ${info.color} rounded-xl mb-6`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{info.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{info.content}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold mb-8 text-gradient-primary">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Together, we'll carve out a new path in healthcare history! Come, be a part of this groundbreaking journey!
            </p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Your Name"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Your Email"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Subject"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="6"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Leave a message here..."
                    required
                  />
                </div>
              </div>
              
              <div className="text-center">
                <button
                  type="submit"
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center mx-auto"
                >
                  <span className="flex items-center">
                    Send Message
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Map/Location Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold mb-8 text-gradient-primary">
              Find Us
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Visit our office in Kolkata, West Bengal
            </p>
          </div>
          
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl">
            <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-slate-700 dark:to-slate-600">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <MapPin className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">TakeCare Global</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    23/9 Naktala Road, Flat No-S4, 2nd Floor<br />
                    Kolkata, West Bengal, 700047, India
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage; 