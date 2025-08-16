import React from 'react';
import { Search } from 'lucide-react';

const SearchButton = ({ 
  onClick, 
  className = "", 
  variant = "default", 
  isExpanded = false, 
  ariaLabel = "Toggle search" 
}) => (
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    aria-expanded={isExpanded}
    className={`
      relative overflow-hidden group transition-all duration-500 ease-out
      ${variant === "navbar" ? "p-3" : "p-4"}
      ${isExpanded 
        ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-white shadow-2xl shadow-blue-500/25 scale-110' 
        : 'bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-700/80 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 shadow-lg hover:shadow-xl'
      }
      backdrop-blur-xl border border-gray-200/50 dark:border-gray-600/50 rounded-2xl
      hover:scale-105 transform transition-all duration-300
      focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:ring-offset-2
      ${className}
    `}
  >
    {/* Animated background gradient */}
    <div className={`
      absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 
      opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl
      ${isExpanded ? 'opacity-100' : ''}
    `}></div>
    
    {/* Icon with enhanced styling */}
    <div className="relative z-10 flex items-center justify-center">
      <Search className={`
        transition-all duration-300
        ${variant === "navbar" ? "h-5 w-5" : "h-6 w-6"}
        ${isExpanded ? 'rotate-12 scale-110' : 'group-hover:rotate-6 group-hover:scale-110'}
      `} />
    </div>
    
    {/* Glow effect */}
    <div className={`
      absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-2xl 
      opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl
      ${isExpanded ? 'opacity-100' : ''}
    `}></div>
  </button>
);

export default SearchButton; 