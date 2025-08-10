import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, User, ArrowRight, LogOut, Settings, Sparkles, Crown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import ConnectionStatus from '../ui/ConnectionStatus';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Features', href: '/#features' },
  { name: 'Pricing', href: '/#pricing' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { isSignedIn, user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-b border-gray-200/30 dark:border-slate-700/30 shadow-xl shadow-gray-900/5 dark:shadow-black/20' 
        : 'bg-transparent'
    }`}>
      {/* Elegant gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/20 via-white/10 to-purple-50/20 dark:from-blue-900/10 dark:via-transparent dark:to-purple-900/10 opacity-0 transition-opacity duration-500" 
           style={{ opacity: isScrolled ? 1 : 0 }}></div>
      
      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Elegant Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="group flex items-center space-x-2"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-6">
                  <Crown className="h-5 w-5 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 dark:from-blue-400 dark:via-purple-400 dark:to-blue-500 bg-clip-text text-transparent hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 transition-all duration-300">
                  TakeCare
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium tracking-wider">
                  Healthcare Platform
                </div>
              </div>
            </Link>
          </div>

          {/* Elegant Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="relative group px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-all duration-300 text-sm tracking-wide rounded-2xl hover:bg-blue-50/50 dark:hover:bg-blue-900/20"
              >
                {link.name}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-8 transition-all duration-300 rounded-full"></div>
              </a>
            ))}
          </div>

          {/* Elegant Desktop Auth Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {isSignedIn ? (
              <div className="flex items-center space-x-4">
                {/* Enhanced Connection Status */}
                <div className="p-3 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/50 dark:border-gray-600/50 shadow-lg">
                  <ConnectionStatus />
                </div>
                
                {/* Premium User Menu */}
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 p-3 rounded-2xl bg-white/60 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-700/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-600/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white text-sm font-bold tracking-wide">
                          {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800 shadow-sm">
                        <div className="w-full h-full bg-emerald-400 rounded-full animate-ping"></div>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        Welcome back
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-600 dark:text-gray-400 group-hover:rotate-180 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300" />
                  </button>
                  
                  {/* Premium Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-3 w-72 bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/30 dark:border-gray-700/30 z-50 transform animate-in slide-in-from-top-2">
                      <div className="p-6 border-b border-gray-200/30 dark:border-gray-700/30">
                        <div className="flex items-center space-x-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-white text-lg font-bold">
                              {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-lg font-bold text-gray-900 dark:text-white">
                              {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                              {user?.email}
                            </p>
                            <div className="flex items-center space-x-1 mt-1">
                              <Sparkles className="h-3 w-3 text-yellow-500" />
                              <span className="text-xs text-gray-600 dark:text-gray-400 font-semibold uppercase tracking-wider">
                                Premium Member
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="py-2">
                        <Link
                          to="/dashboard"
                          className="flex items-center px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-300 group"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform duration-300" />
                          Dashboard
                          <ArrowRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                        </Link>
                        <Link
                          to="/dashboard/settings"
                          className="flex items-center px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-300 group"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="h-4 w-4 mr-3 group-hover:rotate-90 transition-transform duration-500" />
                          Settings
                          <ArrowRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                        </Link>
                        <div className="border-t border-gray-200/30 dark:border-gray-700/30 my-2"></div>
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 transition-all duration-300 group"
                        >
                          <LogOut className="h-4 w-4 mr-3 group-hover:translate-x-1 transition-transform duration-300" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="flex items-center space-x-2 px-6 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-all duration-300 text-sm rounded-2xl hover:bg-blue-50/50 dark:hover:bg-blue-900/20 border border-transparent hover:border-blue-200/50 dark:hover:border-blue-700/50"
                >
                  <User className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="group flex items-center space-x-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm tracking-wide"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>
            )}
          </div>

          {/* Elegant Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-700/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-600/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
            >
              {isOpen ? (
                <X className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-red-500 transition-colors duration-300" />
              ) : (
                <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
              )}
            </button>
          </div>
        </div>

        {/* Elegant Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden">
            <div className="px-6 py-6 space-y-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl mt-4 border border-gray-200/30 dark:border-slate-700/30 shadow-2xl">
              {navLinks.map((link, index) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 rounded-2xl font-semibold transition-all duration-300 text-sm tracking-wide transform hover:scale-105"
                  onClick={() => setIsOpen(false)}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {link.name}
                </a>
              ))}
              
              <div className="border-t border-gray-200/30 dark:border-gray-700/30 pt-6 mt-6">
                {isSignedIn ? (
                  <div className="space-y-4">
                    <div className="flex items-center px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                        <span className="text-white text-sm font-bold">
                          {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                          {user?.firstName} {user?.lastName}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          {user?.email}
                        </div>
                      </div>
                    </div>
                    
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 rounded-2xl font-semibold transition-all duration-300 text-sm group"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform duration-300" />
                      Dashboard
                      <ArrowRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    </Link>
                    
                    <button
                      onClick={() => {
                        logout();
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-900/20 rounded-2xl font-semibold transition-all duration-300 text-sm group"
                    >
                      <LogOut className="h-4 w-4 mr-3 group-hover:translate-x-1 transition-transform duration-300" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 rounded-2xl font-semibold transition-all duration-300 text-sm border border-gray-200/50 dark:border-gray-600/50"
                      onClick={() => setIsOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white rounded-2xl font-bold shadow-lg transition-all duration-300 text-sm group"
                      onClick={() => setIsOpen(false)}
                    >
                      Get Started
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 