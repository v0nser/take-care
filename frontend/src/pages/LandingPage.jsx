import React, { useState, useEffect } from 'react';
import {
  Heart,
  Calendar,
  Users,
  Shield,
  Star,
  ArrowRight,
  Stethoscope,
  Activity,
  Play,
  CheckCircle,
  Award,
  Sparkles,
  Video,
  FileText,
  Clock,
  Phone,
  Lock,
  Globe,
  Zap,
  Home,
  ChevronDown,
  Menu,
  X,
  MessageCircle,
  TrendingUp,
  Brain,
  Droplet,
  HeartPulse,
  Microscope,
  Plus,
  ChevronRight,
  Package
} from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';

import Footer from '../components/layouts/Footer.jsx';
import Navbar from '../components/layouts/Navbar.jsx';
import { getPopularSpecialties } from '../utils/servicesData';

// === Modern, Elegant Custom Styles ===
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

  /* Smart overflow prevention - allow elements to be fully visible */
  html, body {
    overflow-x: hidden;
    max-width: 100%;
  }
  
  * {
    box-sizing: border-box;
  }
  
  /* Main page container with proper overflow handling */
  .page-container {
    position: relative;
    width: 100%;
    overflow-x: hidden;
    overflow-y: visible;
  }
  
  /* Hero section with full element visibility */
  .hero-section {
    position: relative;
    width: 100%;
    overflow: visible;
    padding-left: 100px;
    padding-right: 100px;
  }
  
  /* Responsive padding adjustments */
  @media (max-width: 1200px) {
    .hero-section {
      padding-left: 50px;
      padding-right: 50px;
    }
  }
  
  @media (max-width: 768px) {
    .hero-section {
      padding-left: 20px;
      padding-right: 20px;
    }
  }

  .font-jakarta {
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .font-inter {
    font-family: 'Inter', sans-serif;
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-up {
    opacity: 0;
    animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-15px) rotate(1deg); }
  }
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }

  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  .animate-slide-in-left {
    opacity: 0;
    animation: slideInLeft 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
  .animate-scale-in {
    opacity: 0;
    animation: scaleIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7); }
    70% { box-shadow: 0 0 0 10px rgba(102, 126, 234, 0); }
    100% { box-shadow: 0 0 0 0 rgba(102, 126, 234, 0); }
  }
  .pulse {
    animation: pulse 2s infinite;
  }

  .hover-lift {
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .hover-lift:hover {
    transform: translateY(-12px);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  }

  .text-gradient {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .text-gradient-blue {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .card-glass {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
  @media (prefers-color-scheme: dark) {
    .card-glass {
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(148, 163, 184, 0.1);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }
  }

  .border-highlight {
    border: 1px solid rgba(99, 102, 241, 0.2);
  }

  .bg-card {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .glass-button {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    transition: all 0.3s ease;
  }
  .glass-button:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  .gradient-bg {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .gradient-border {
    position: relative;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2px;
    border-radius: 1rem;
  }
  .gradient-border > * {
    background: white;
    border-radius: calc(1rem - 2px);
  }
  @media (prefers-color-scheme: dark) {
    .gradient-border > * {
      background: #0f172a;
    }
  }

  /* Floating shapes - positioned to stay within bounds */
  .floating-shape {
    position: absolute;
    filter: blur(40px);
    opacity: 0.15;
    z-index: -1;
    pointer-events: none;
  }
  
  .shape-1 {
    width: 400px;
    height: 400px;
    background: #667eea;
    top: 10%;
    left: 0;
    transform: translateX(-20%);
  }
  
  .shape-2 {
    width: 300px;
    height: 300px;
    background: #764ba2;
    bottom: 15%;
    right: 0;
    transform: translateX(20%);
  }
  
  .shape-3 {
    width: 200px;
    height: 200px;
    background: #10b981;
    top: 40%;
    right: 0;
  }
  
  .grid-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236366F1' fill-opacity='0.05' fill-rule='evenodd'%3E%3Ccircle cx='10' cy='10' r='1'/%3E%3C/g%3E%3C/svg%3E");
  }
  
  .dot-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='10' height='10' viewBox='0 0 10 10' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236366F1' fill-opacity='0.08' fill-rule='evenodd'%3E%3Ccircle cx='5' cy='5' r='1'/%3E%3C/g%3E%3C/svg%3E");
  }
  
  .honeycomb-pattern {
    background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366F1' fill-opacity='0.05'%3E%3Cpath d='M20 0l10 5.77 10 5.77v11.54l-10 5.77-10 5.77-10-5.77-10-5.77V11.54L10 5.77 20 0zm0 4l8 4.62v9.23l-8 4.62-8-4.62v-9.23L12 4h8zm-8 14.46L4 23.08v9.23l8 4.62 8-4.62v-9.23l-8-4.62zm16 0l8 4.62v9.23l-8 4.62-8-4.62v-9.23l8-4.62z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }

  /* Circular video styles */
  .circular-video-container {
    position: relative;
    width: 500px;
    height: 500px;
    margin: 0 auto;
    max-width: 100%;
    overflow: visible;
  }
  
  @media (max-width: 768px) {
    .circular-video-container {
      width: 400px;
      height: 400px;
    }
  }
  
  @media (max-width: 480px) {
    .circular-video-container {
      width: 320px;
      height: 320px;
    }
  }

  .circular-video {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.35);
    max-width: 100%;
  }
  
  /* Better floating elements positioning */
  .floating-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: visible;
  }
  
  /* Responsive adjustments for floating elements */
  @media (max-width: 768px) {
    .floating-element-1,
    .floating-element-2,
    .floating-element-3,
    .floating-element-4 {
      transform: scale(0.8);
    }
  }
  
  @media (max-width: 480px) {
    .floating-element-1,
    .floating-element-2,
    .floating-element-3,
    .floating-element-4 {
      transform: scale(0.6);
    }
  }

  .circular-video video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    max-width: 100%;
  }

  .floating-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .floating-element {
    position: absolute;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 14px;
    font-weight: 600;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  }

  /* Light mode floating elements */
  @media (prefers-color-scheme: light) {
    .floating-element {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(15px);
      border: 1px solid rgba(99, 102, 241, 0.2);
      color: #1f2937;
      box-shadow: 0 8px 32px rgba(99, 102, 241, 0.15);
    }
  }

  /* Dark mode floating elements */
  @media (prefers-color-scheme: dark) {
    .floating-element {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: white;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    }
  }

  .floating-element-1 {
    width: 90px;
    height: 90px;
    top: -15px;
    right: -10px;
    background: linear-gradient(135deg, #667eea, #764ba2);
  }

  .floating-element-2 {
    width: 70px;
    height: 70px;
    bottom: -10px;
    left: -10px;
    background: linear-gradient(135deg, #10b981, #059669);
  }

  .floating-element-3 {
    width: 50px;
    height: 50px;
    top: 50%;
    right: -10px;
    background: linear-gradient(135deg, #f59e0b, #d97706);
  }

  .floating-element-4 {
    width: 60px;
    height: 60px;
    bottom: 30%;
    left: -10px;
    background: linear-gradient(135deg, #ef4444, #dc2626);
  }

  .pulse-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 120%;
    height: 120%;
    border: 3px solid rgba(102, 126, 234, 0.4);
    border-radius: 50%;
    animation: pulse-ring 2.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
  }

  @keyframes pulse-ring {
    0% {
      transform: translate(-50%, -50%) scale(0.8);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(1.3);
      opacity: 0;
    }
  }

  .rotating-border {
    position: absolute;
    top: -8px;
    left: -8px;
    right: -8px;
    bottom: -8px;
    border-radius: 50%;
    background: conic-gradient(from 0deg, #667eea, #764ba2, #10b981, #f59e0b, #ef4444, #667eea);
    animation: rotate 10s linear infinite;
  }

  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .rotating-border::after {
    content: '';
    position: absolute;
    top: 4px;
    left: 4px;
    right: 4px;
    bottom: 4px;
    background: white;
    border-radius: 50%;
  }

  /* Light mode rotating border */
  @media (prefers-color-scheme: light) {
    .rotating-border::after {
      background: #000000;
    }
  }

  /* Dark mode rotating border */
  @media (prefers-color-scheme: dark) {
    .rotating-border::after {
      background: #d8d8d8;
    }
  }

  /* Light mode improvements */
  @media (prefers-color-scheme: light) {
    .floating-shape {
      opacity: 0.08;
    }
    
    .shape-1 {
      background: #667eea;
    }
    
    .shape-2 {
      background: #764ba2;
    }
    
    .shape-3 {
      background: #10b981;
    }
  }

  /* Dark mode improvements */
  @media (prefers-color-scheme: dark) {
    .floating-shape {
      opacity: 0.15;
    }
  }

  /* Enhanced service card icons for better visibility */
  .service-icon-container {
    position: relative;
    overflow: hidden;
  }

  .service-icon-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
    border-radius: inherit;
  }

  /* Light mode service card improvements */
  @media (prefers-color-scheme: light) {
    .service-icon-container::before {
      background: linear-gradient(45deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1));
    }
  }
`;

// === Feature Card (Calm, Clinical) ===
const FeatureCard = ({ feature, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.1
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        duration: 0.5,
        ease: "backOut",
        delay: index * 0.1 + 0.2
      }
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      ref={ref}
      className="p-8 rounded-xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300/50 dark:hover:border-blue-700/50 transition-all duration-500 shadow-lg hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20"
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover="hover"
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      <motion.div 
        className="flex items-center mb-6"
        variants={iconVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        whileHover="hover"
      >
        <div className={`p-3 rounded-lg ${feature.color} text-white shadow-sm service-icon-container`}>
          <feature.icon className="h-6 w-6" />
        </div>
      </motion.div>
      <motion.h3 
        className="text-xl font-semibold text-gray-900 dark:text-white mb-3"
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
      >
        {feature.title}
      </motion.h3>
      <motion.p 
        className="text-gray-700 dark:text-gray-300 leading-relaxed"
        initial={{ opacity: 0, x: -20 }}
        animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ delay: index * 0.1 + 0.4, duration: 0.5 }}
      >
        {feature.description}
      </motion.p>
    </motion.div>
  );
};

// === Testimonial Card (Human-Centered) ===
const TestimonialCard = ({ testimonial, index }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 60,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.15
      }
    },
    hover: {
      y: -10,
      scale: 1.03,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const starsVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.15 + 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const starVariants = {
    hidden: { opacity: 0, scale: 0, rotate: -180 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotate: 0,
      transition: {
        duration: 0.4,
        ease: "backOut"
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: index * 0.15 + 0.5
      }
    }
  };

  const avatarVariants = {
    hidden: { scale: 0, rotate: -90 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: "backOut",
        delay: index * 0.15 + 0.7
      }
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      ref={ref}
      className="p-8 rounded-xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300/50 dark:hover:border-blue-700/50 transition-all duration-500 shadow-lg hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20"
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover="hover"
      style={{ animationDelay: `${index * 0.15}s` }}
    >
      <motion.div 
        className="flex gap-1 mb-4"
        variants={starsVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        {[...Array(5)].map((_, i) => (
          <motion.div key={i} variants={starVariants}>
            <Star
              className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-500 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
            />
          </motion.div>
        ))}
      </motion.div>
      
      <motion.p 
        className="text-gray-700 dark:text-gray-300 italic leading-relaxed mb-6"
        variants={textVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        "{testimonial.content}"
      </motion.p>
      
      <motion.div 
        className="flex items-center"
        variants={textVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
      >
        <motion.div 
          className={`w-12 h-12 rounded-full ${testimonial.color} flex items-center justify-center text-white font-bold text-lg service-icon-container`}
          variants={avatarVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          whileHover="hover"
        >
          {testimonial.name.split(' ').map(n => n[0]).join('')}
        </motion.div>
        <motion.div 
          className="ml-4"
          initial={{ opacity: 0, x: 20 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
          transition={{ delay: index * 0.15 + 0.8, duration: 0.5 }}
        >
          <div className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// === Service Card (Real Medical Context) ===
const ServiceCard = ({ specialty, index }) => {
  const Icon = specialty.icon;
  
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.1
      }
    },
    hover: {
      y: -8,
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: {
        duration: 0.5,
        ease: "backOut",
        delay: index * 0.1 + 0.2
      }
    },
    hover: {
      scale: 1.2,
      rotate: 10,
      transition: { duration: 0.2 }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1 + 0.3
      }
    }
  };

  return (
    <motion.div 
      className="group bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 transition-all duration-500"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, threshold: 0.1 }}
    >
      <motion.div 
        className={`p-5 bg-gradient-to-r ${specialty.color} rounded-t-xl service-icon-container`}
        variants={iconVariants}
        initial="hidden"
        whileInView="visible"
        whileHover="hover"
        viewport={{ once: true, threshold: 0.1 }}
      >
        <Icon className="h-8 w-8 text-white drop-shadow-lg" />
      </motion.div>
      <motion.div 
        className="p-6 bg-white/50 dark:bg-gray-800/50"
        variants={contentVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, threshold: 0.1 }}
      >
        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {specialty.name}
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-400 mt-2 line-clamp-2">
          {specialty.description}
        </p>
        <motion.div 
          className="mt-4 flex justify-between items-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 0.5, duration: 0.4 }}
          viewport={{ once: true, threshold: 0.1 }}
        >
          <span className="text-sm font-medium text-green-600 dark:text-green-400">
            {specialty.consultationFee}
          </span>
          <Link
            to={`/services/${specialty.id}`}
            className="text-blue-600 dark:text-blue-400 text-xs font-medium flex items-center hover:underline group/link"
          >
            Details
            <motion.div
              className="ml-1"
              whileHover={{ x: 3 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight className="h-3 w-3" />
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// === Enhanced Navbar ===
<Navbar />

// === Enhanced Circular Video Component ===
const CircularVideoHero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -100]);
  const scale = useTransform(scrollY, [0, 1000], [1, 0.8]);
  const rotate = useTransform(scrollY, [0, 1000], [0, 360]);

  const springY = useSpring(y, { stiffness: 100, damping: 30 });
  const springScale = useSpring(scale, { stiffness: 100, damping: 30 });
  const springRotate = useSpring(rotate, { stiffness: 50, damping: 30 });

  const videoVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.3
      }
    }
  };

  const floatingVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        delay: 0.5 + (i * 0.1)
      }
    })
  };

  const pulseVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: [0.8, 1.2, 0.8],
      opacity: [0, 1, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const rotateVariants = {
    hidden: { rotate: 0 },
    visible: {
      rotate: 360,
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  // Placeholder for actual video source
  const videoSrc = "https://res.cloudinary.com/do8hbv0g6/video/upload/v1755318583/Online_Doctor_Consultation_Video_Ready_hy0gd8.mp4";

  return (
    <motion.div 
      className="circular-video-container"
      style={{ y: springY, scale: springScale }}
      variants={videoVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Rotating gradient border */}
      <motion.div 
        className="rotating-border"
        variants={rotateVariants}
        initial="hidden"
        animate="visible"
      />
      
      {/* Main circular video */}
      <div className="circular-video">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1576091160558-4b3a113f51d5?auto=format&fit=crop&w=800&q=80"
        >
          <source src={videoSrc} type="video/mp4" />
          <track kind="captions" src="" default />
          Your browser does not support the video tag.
        </video>
        
        {/* Video overlay - adaptive opacity for light/dark mode */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray/20 via-transparent to-transparent dark:from-black/40 pointer-events-none rounded-full" />
        
        {/* Live indicator - repositioned for better visibility */}
        <motion.div 
          className="absolute top-6 right-6 bg-red-500/95 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm font-semibold flex items-center gap-2 shadow-lg"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <motion.div 
            className="bg-white h-2 w-2 rounded-full"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          LIVE
        </motion.div>
        
        {/* Enhanced Doctor Info - Much more prominent */}
        <motion.div 
          className="absolute bottom-6 left-16 text-white"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <div className="bg-white/90 dark:bg-black/70 backdrop-blur-md px-6 py-4 rounded-2xl border border-gray-200/50 dark:border-white/30 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="font-bold text-xl text-gray-900 dark:text-white mb-1">Dr. Sarah Chen</div>
                <div className="text-sm text-blue-600 dark:text-blue-200 font-medium">Cardiologist</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600 dark:text-green-300 font-medium">Available Now</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating elements around the video */}
      <div className="floating-elements">
        <motion.div 
          className="floating-element floating-element-1"
          custom={0}
          variants={floatingVariants}
          initial="hidden"
          animate="visible"
        >
          <Users className="h-6 w-6" />
        </motion.div>
        
        <motion.div 
          className="floating-element floating-element-2"
          custom={1}
          variants={floatingVariants}
          initial="hidden"
          animate="visible"
        >
          <CheckCircle className="h-5 w-5" />
        </motion.div>
        
        <motion.div 
          className="floating-element floating-element-3"
          custom={2}
          variants={floatingVariants}
          initial="hidden"
          animate="visible"
        >
          <Star className="h-4 w-4" />
        </motion.div>
        
        <motion.div 
          className="floating-element floating-element-4"
          custom={3}
          variants={floatingVariants}
          initial="hidden"
          animate="visible"
        >
          <Heart className="h-5 w-5" />
        </motion.div>
      </div>

      {/* Pulsing ring effect */}
      <motion.div 
        className="pulse-ring"
        variants={pulseVariants}
        initial="hidden"
        animate="visible"
      />

      {/* Enhanced Testimonial snippet below */}
      <motion.div 
        className="mt-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-gray-200/50 dark:border-gray-700/50"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
          ))}
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-sm italic leading-relaxed mb-4">
          "TakeCare has transformed how I manage my healthcare. The convenience is unmatched."
        </p>
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
            MJ
          </div>
          <div className="ml-3">
            <div className="text-sm font-semibold text-gray-900 dark:text-white">Michael J.</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Patient for 2+ years</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// === Main Component ===
const LandingPage = () => {
  const { isSignedIn } = useAuth();

  const features = [
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Book appointments in seconds. Our AI finds the best times with your preferred doctors.',
      color: 'bg-blue-600',
    },
    {
      icon: Video,
      title: 'Crystal-Clear Visits',
      description: 'High-definition video calls with zero lag. No downloads. Just click and connect.',
      color: 'bg-emerald-600',
    },
    {
      icon: Shield,
      title: 'Private & Secure',
      description: 'HIPAA-compliant. Your data stays yours — encrypted and never sold.',
      color: 'bg-purple-600',
    },
    {
      icon: FileText,
      title: 'One Health Record',
      description: 'All your history, prescriptions, and results in one secure place.',
      color: 'bg-amber-600',
    },
  ];

  const stats = [
    { label: 'Patients Served', value: '50K+' },
    { label: 'Doctors Connected', value: '2,500+' },
    { label: 'Consultations', value: '250K+' },
    { label: 'Satisfaction Rate', value: '99%' },
  ];

  const testimonials = [
    {
      name: 'Sarah Chen, MD',
      role: 'Cardiologist, Stanford Medicine',
      content: 'TakeCare lets me focus on patients, not paperwork. The platform just works.',
      rating: 5,
      color: 'bg-gradient-to-br from-blue-500 to-purple-600'
    },
    {
      name: 'Michael R.',
      role: 'Patient, 2 years',
      content: 'I used to dread doctor visits. Now I book in 30 seconds and talk from my couch.',
      rating: 5,
      color: 'bg-gradient-to-br from-green-500 to-emerald-600'
    },
    {
      name: 'Dr. Emily Watson',
      role: 'Pediatrician, Mayo Clinic',
      content: 'The security and simplicity are unmatched. It\'s the only telehealth tool my clinic trusts.',
      rating: 5,
      color: 'bg-gradient-to-br from-purple-500 to-pink-600'
    },
  ];

  // Specialty icons
  const specialtyIcons = {
    Heart,
    Users,
    Activity,
    Stethoscope,
    Brain,
    Droplet,
    HeartPulse,
    Microscope
  };

  return (
    <div className="page-container min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 font-inter">
      <style>{customStyles}</style>
      
      {/* Floating shapes for visual enhancement */}
      <div className="floating-shape shape-1 hidden lg:block"></div>
      <div className="floating-shape shape-2 hidden lg:block"></div>
      <div className="floating-shape shape-3 hidden lg:block"></div>
      
      <Navbar />

      {/* === Hero Section (Modern & Elegant) === */}
      <section className="hero-section relative pt-32 pb-64">
        {/* Background Elements */}
        <motion.div 
          className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-blue-100/40 to-purple-100/40 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-3xl -z-10"
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-emerald-100/30 to-blue-100/30 dark:from-emerald-900/15 dark:to-blue-900/15 rounded-full blur-3xl -z-10"
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -3, 0]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left Content - Text & CTA */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* AI-Powered Badge */}
            <motion.div 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-semibold border border-blue-200/50 dark:border-blue-700/30"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
              </motion.div>
              AI-Powered Healthcare
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-jakarta font-bold leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Healthcare that <span className="text-gradient">adapts to you</span>
            </motion.h1>

            {/* Description */}
            <motion.p 
              className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-medium max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Experience the future of medicine with intelligent scheduling, instant video consultations, and personalized care that fits seamlessly into your lifestyle.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              {isSignedIn ? (
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    to="/dashboard"
                    className="group relative inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 overflow-hidden border border-blue-500/20"
                  >
                    {/* Enhanced shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                    
                    {/* Subtle inner glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Content */}
                    <span className="relative z-10 text-lg">Access Dashboard</span>
                    <ArrowRight className="ml-3 h-6 w-6 relative z-10 transform group-hover:translate-x-2 transition-transform duration-300" />
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Link
                    to="/register"
                    className="group relative inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 overflow-hidden border border-blue-500/20"
                  >
                    {/* Enhanced shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
                    
                    {/* Subtle inner glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Content */}
                    <span className="relative z-10 text-lg">Start Free Trial</span>
                    <ArrowRight className="ml-3 h-6 w-6 relative z-10 transform group-hover:translate-x-2 transition-transform duration-300" />
                  </Link>
                </motion.div>
              )}
              
              <motion.button 
                className="group relative inline-flex items-center justify-center px-10 py-4 bg-white/5 backdrop-blur-xl border border-white/30 text-white font-bold rounded-2xl hover:bg-white/15 hover:border-white/50 hover:shadow-2xl hover:shadow-white/10 transition-all duration-500 overflow-hidden"
                whileHover={{ scale: 1.03, y: -3 }}
                whileTap={{ scale: 0.97 }}
              >
                {/* Enhanced background glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-blue-500/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Subtle border glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/50 to-purple-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                
                {/* Content */}
                <motion.div
                  className="relative z-10"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Play className="h-6 w-6 mr-3 inline-block" />
                </motion.div>
                <span className="relative z-10 text-lg">Watch Demo</span>
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>HIPAA Compliant</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Lock className="h-4 w-4 text-blue-500" />
                <span>No Credit Card</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
              >
                <Phone className="h-4 w-4 text-purple-500" />
                <span>24/7 Support</span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Content - Video & Doctor Info */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <CircularVideoHero />
          </motion.div>
        </div>
      </section>

      {/* === Features === */}
      <section className="px-6 lg:px-10 py-32 bg-gradient-to-br from-gray-50 via-white to-blue-50/30 dark:from-slate-900/50 dark:via-slate-900 dark:to-blue-900/10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-24"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, threshold: 0.1 }}
          >
            <motion.div 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-semibold mb-6 border border-blue-200/50 dark:border-blue-700/30"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true, threshold: 0.1 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="service-icon-container"
              >
                <Zap className="h-4 w-4 mr-2 text-purple-500" />
              </motion.div>
              Powered by AI
            </motion.div>
            <motion.h2 
              className="text-5xl md:text-6xl font-jakarta font-bold mb-6 text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true, threshold: 0.1 }}
            >
              Intelligent tools for <span className="text-gradient">exceptional care</span>
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: true, threshold: 0.1 }}
            >
              Experience healthcare reimagined with cutting-edge technology that makes every interaction seamless and personalized.
            </motion.p>
          </motion.div>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true, threshold: 0.1 }}
          >
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* === Services Preview === */}
      <section className="px-6 lg:px-10 py-32">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, threshold: 0.1 }}
          >
            <motion.div 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-900/30 dark:to-blue-900/30 rounded-full text-emerald-700 dark:text-emerald-300 text-sm font-semibold mb-6 border border-emerald-200/50 dark:border-emerald-700/30"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true, threshold: 0.1 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="service-icon-container"
              >
                <Stethoscope className="h-4 w-4 mr-2 text-blue-500" />
              </motion.div>
              Comprehensive Care
            </motion.div>
            <motion.h2 
              className="text-5xl md:text-6xl font-jakarta font-bold mb-6 text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true, threshold: 0.1 }}
            >
              Expert care across <span className="text-gradient">every specialty</span>
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: true, threshold: 0.1 }}
            >
              From dermatology to cardiology, our board-certified specialists provide world-class care with cutting-edge technology.
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true, threshold: 0.1 }}
          >
            {getPopularSpecialties().slice(0, 8).map((specialty, index) => (
              <ServiceCard key={specialty.id} specialty={specialty} index={index} />
            ))}
          </motion.div>

          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true, threshold: 0.1 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/services"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 group"
              >
                Explore All Specialties
                <motion.div
                  className="ml-2"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* === Diagnostics Section === */}
      <section className="px-6 lg:px-10 py-32 bg-gradient-to-br from-gray-50 via-white to-emerald-50/30 dark:from-slate-900/50 dark:via-slate-900 dark:to-emerald-900/10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, threshold: 0.1 }}
          >
            <motion.div 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-full text-emerald-700 dark:text-emerald-300 text-sm font-semibold mb-6 border border-emerald-200/50 dark:border-emerald-700/30"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true, threshold: 0.1 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="service-icon-container"
              >
                <Microscope className="h-4 w-4 mr-2 text-teal-500" />
              </motion.div>
              Advanced Diagnostics
            </motion.div>
            <motion.h2 
              className="text-5xl md:text-6xl font-jakarta font-bold mb-6 text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true, threshold: 0.1 }}
            >
              Precision diagnostics for <span className="text-gradient">accurate results</span>
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: true, threshold: 0.1 }}
            >
              State-of-the-art diagnostic services with rapid turnaround times, comprehensive packages, and expert analysis by certified professionals.
            </motion.p>
          </motion.div>

          {/* Diagnostic Categories */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true, threshold: 0.1 }}
          >
            {/* Blood Tests */}
            <motion.div 
              className="group bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 hover:shadow-xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/20 transition-all duration-500"
              whileHover={{ y: -8, scale: 1.02 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              viewport={{ once: true, threshold: 0.1 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Droplet className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Blood Tests</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Comprehensive blood panels including CBC, metabolic profiles, hormone tests, and specialized markers for early disease detection.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Starting at ₹299</span>
                <Link
                  to="/diagnostics"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center group/link"
                >
                  Book Now
                  <ArrowRight className="h-4 w-4 ml-1 group-hover/link:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </motion.div>

            {/* Imaging Services */}
            <motion.div 
              className="group bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 hover:shadow-xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/20 transition-all duration-500"
              whileHover={{ y: -8, scale: 1.02 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              viewport={{ once: true, threshold: 0.1 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Activity className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Imaging Services</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Advanced imaging including X-rays, ultrasounds, CT scans, and MRIs with AI-powered analysis and expert radiologist review.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Starting at ₹599</span>
                <Link
                  to="/diagnostics"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center group/link"
                >
                  Book Now
                  <ArrowRight className="h-4 w-4 ml-1 group-hover/link:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </motion.div>

            {/* Health Packages */}
            <motion.div 
              className="group bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 hover:shadow-xl hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/20 transition-all duration-500"
              whileHover={{ y: -8, scale: 1.02 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              viewport={{ once: true, threshold: 0.1 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Package className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Health Packages</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                Comprehensive health checkup packages designed for different age groups and health goals with detailed reports and consultations.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Starting at ₹999</span>
                <Link
                  to="/diagnostics"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center group/link"
                >
                  Book Now
                  <ArrowRight className="h-4 w-4 ml-1 group-hover/link:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            </motion.div>
          </motion.div>

          {/* Diagnostic Features */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            viewport={{ once: true, threshold: 0.1 }}
          >
            {[
              { icon: Clock, title: "Same Day Results", description: "Most tests completed within 24 hours" },
              { icon: Shield, title: "NABL Certified", description: "Internationally recognized quality standards" },
              { icon: Users, title: "Expert Team", description: "Board-certified pathologists & technicians" },
              { icon: Zap, title: "Home Collection", description: "Free sample collection at your doorstep" }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="text-center p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 + (index * 0.1), duration: 0.6 }}
                viewport={{ once: true, threshold: 0.1 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA for Diagnostics */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            viewport={{ once: true, threshold: 0.1 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/diagnostics"
                className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 group"
              >
                Book Diagnostic Tests
                <motion.div
                  className="ml-2"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.div>
              </Link>
            </motion.div>
            <p className="text-gray-600 dark:text-gray-400 mt-4 text-sm">
              Free home collection • Same day results • Expert consultation included
            </p>
          </motion.div>
        </div>
      </section>

      {/* === Stats === */}
      <section className="px-6 lg:px-10 py-32  dark:from-slate-900 dark:via-teal-900 dark:to-blue-900 bg-gradient-to-br from-slate-100 via-blue-100 to-purple-100 text-white dark:text-white text-slate-300 dark:text-slate-100 relative overflow-hidden">
        {/* Background Elements */}
        <motion.div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366F1' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            opacity: 0.2
          }}
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <div className="max-w-6xl mx-auto relative">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, threshold: 0.1 }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-jakarta font-bold mb-6 text-slate-900 dark:text-white"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true, threshold: 0.1 }}
            >
              Trusted by <span className="text-blue-600 dark:text-blue-800">millions</span> worldwide
            </motion.h2>
            <motion.p 
              className="text-xl text-slate-300 dark:text-blue-100/80 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true, threshold: 0.1 }}
            >
              Our platform has transformed healthcare delivery across the globe
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true, threshold: 0.1 }}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="text-center group"
                initial={{ opacity: 0, y: 50, scale: 0.8 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.15 + 0.5, 
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1]
                }}
                viewport={{ once: true, threshold: 0.1 }}
                whileHover={{ 
                  y: -8,
                  scale: 1.05,
                  transition: { duration: 0.3 }
                }}
              >
                <motion.div 
                  className="w-24 h-24 mx-auto mb-6 bg-white/10 dark:bg-white/10 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-white/20 flex items-center justify-center group-hover:bg-white/20 dark:group-hover:bg-white/20 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 dark:hover:shadow-blue-500/30"
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 5,
                    transition: { duration: 0.3 }
                  }}
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: index * 0.15 + 0.7, 
                    duration: 0.8,
                    ease: "backOut"
                  }}
                  viewport={{ once: true, threshold: 0.1 }}
                >
                  <motion.div
                    className="text-4xl font-bold text-slate-900 dark:text-white"
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ 
                      delay: index * 0.15 + 0.9, 
                      duration: 0.6, 
                      ease: "backOut" 
                    }}
                    viewport={{ once: true, threshold: 0.1 }}
                  >
                    {stat.value}
                  </motion.div>
                </motion.div>
                <motion.div 
                  className="text-slate-700 dark:text-blue-100/80 font-semibold text-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: index * 0.15 + 1.1, 
                    duration: 0.6 
                  }}
                  viewport={{ once: true, threshold: 0.1 }}
                >
                  {stat.label}
                </motion.div>
                
                {/* Animated underline */}
                <motion.div 
                  className="w-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto mt-4 rounded-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: 48 }}
                  transition={{ 
                    delay: index * 0.15 + 1.3, 
                    duration: 0.8,
                    ease: "easeOut"
                  }}
                  viewport={{ once: true, threshold: 0.1 }}
                  whileHover={{ width: 64 }}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* === Testimonials === */}
      <section className="px-6 lg:px-10 py-32 bg-gray-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, threshold: 0.1 }}
          >
            <motion.div 
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-full text-purple-700 dark:text-purple-300 text-sm font-semibold mb-6 border border-purple-200/50 dark:border-purple-700/30"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true, threshold: 0.1 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                <MessageCircle className="h-4 w-4 mr-2 text-pink-500" />
              </motion.div>
              Real Stories
            </motion.div>
            <motion.h2 
              className="text-5xl md:text-6xl font-jakarta font-bold mb-6 text-gray-900 dark:text-white"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true, threshold: 0.1 }}
            >
              What people say about <span className="text-gradient">TakeCare</span>
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: true, threshold: 0.1 }}
            >
              Hear from healthcare professionals and patients who've experienced the difference.
            </motion.p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true, threshold: 0.1 }}
          >
            {testimonials.map((t, index) => (
              <TestimonialCard key={index} testimonial={t} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* === CTA Final === */}
      <section className="px-6 lg:px-10 py-32 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 dark:from-slate-900 dark:via-blue-900 dark:to-purple-900 bg-gradient-to-br from-slate-100 via-blue-100 to-purple-100 text-white dark:text-white text-slate-900 dark:text-slate-100 relative overflow-hidden">
        {/* Background Elements */}
        <motion.div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366F1' fill-opacity='0.05'%3E%3Cpath d='M20 0l10 5.77 10 5.77v11.54l-10 5.77-10 5.77-10-5.77-10-5.77V11.54L10 5.77 20 0zm0 4l8 4.62v9.23l-8 4.62-8-4.62v-9.23L12 4h8zm-8 14.46L4 23.08v9.23l8 4.62 8-4.62v-9.23l-8-4.62zm16 0l8 4.62v9.23l-8 4.62-8-4.62v-9.23l8-4.62z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            opacity: 0.1
          }}
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        <motion.div 
          className="max-w-4xl mx-auto text-center relative z-10"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, threshold: 0.1 }}
        >
          <motion.div 
            className="inline-flex items-center px-6 py-3 bg-white/20 dark:bg-white/20 backdrop-blur-sm rounded-full text-white dark:text-white text-slate-900 dark:text-white text-sm font-semibold mb-6 border border-white/30 dark:border-white/30"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            viewport={{ once: true, threshold: 0.1 }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              className="service-icon-container"
            >
              <Award className="h-4 w-4 mr-2" />
            </motion.div>
            Join 50,000+ satisfied users
          </motion.div>
          
          <motion.h2 
            className="text-4xl md:text-5xl font-jakarta font-bold mb-6 text-slate-900 dark:text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true, threshold: 0.1 }}
          >
            Ready to make healthcare easier?
          </motion.h2>
          <motion.p 
            className="text-slate-700 dark:text-gray-200 text-lg mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            viewport={{ once: true, threshold: 0.1 }}
          >
            Join thousands who've reclaimed their time and peace of mind with TakeCare.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            viewport={{ once: true, threshold: 0.1 }}
          >
            {isSignedIn ? (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/dashboard" className="inline-flex items-center justify-center bg-white text-gray-900 font-semibold px-10 py-4 rounded-xl hover:bg-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl min-w-[200px]">
                  Open Dashboard
                </Link>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/register" className="inline-flex items-center justify-center bg-white text-gray-900 font-semibold px-10 py-4 rounded-xl hover:bg-gray-200 transition-all duration-300 shadow-lg hover:shadow-xl min-w-[200px]">
                  Start Free Trial
                </Link>
              </motion.div>
            )}
            <motion.button 
              className="inline-flex items-center justify-center border border-white/30 dark:border-white/30 text-white dark:text-white font-medium px-10 py-4 rounded-xl hover:bg-white/10 dark:hover:bg-white/10 transition-all duration-300 min-w-[200px]"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              whileTap={{ scale: 0.95 }}
            >
              Talk to Sales
            </motion.button>
          </motion.div>
          <motion.p 
            className="text-slate-600 dark:text-gray-400 text-sm mt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            viewport={{ once: true, threshold: 0.1 }}
          >
            No credit card required. Cancel anytime.
          </motion.p>
          
          {/* Trust indicators */}
          <motion.div 
            className="flex flex-wrap justify-center gap-8 mt-10 text-sm text-blue-600 dark:text-blue-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            viewport={{ once: true, threshold: 0.1 }}
          >
            {[
              { icon: Shield, text: "HIPAA Compliant" },
              { icon: Globe, text: "Global Access" },
              { icon: Clock, text: "24/7 Availability" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + (index * 0.1), duration: 0.5 }}
                viewport={{ once: true, threshold: 0.1 }}
                whileHover={{ scale: 1.05, x: 5 }}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;