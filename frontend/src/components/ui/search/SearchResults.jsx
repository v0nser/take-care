import React from 'react';
import { User, Calendar, FileText, CreditCard, Activity, Search, Clock, Sparkles, Zap } from 'lucide-react';

const SearchResults = ({ 
  searchResults, 
  showResults, 
  selectedFilter, 
  handleResultClick, 
  variant = "default",
  selectedIndex = -1,
  onResultHover
}) => {
  if (!showResults || searchResults.length === 0) return null;

  const getResultIcon = (type) => {
    const iconClasses = "h-4 w-4";
    switch (type) {
      case 'user':
        return <User className={`${iconClasses} text-blue-500`} />;
      case 'appointment':
        return <Calendar className={`${iconClasses} text-green-500`} />;
      case 'medicalRecord':
        return <FileText className={`${iconClasses} text-purple-500`} />;
      case 'payment':
        return <CreditCard className={`${iconClasses} text-yellow-500`} />;
      case 'activityLog':
        return <Activity className={`${iconClasses} text-red-500`} />;
      default:
        return <Search className={`${iconClasses} text-gray-500`} />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (error) {
      return '';
    }
  };

  const containerClasses = variant === "mobile" || variant === "navbar"
    ? "border-t border-gray-200/30 dark:border-gray-700/30"
    : "absolute top-full left-0 right-0 mt-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/30 dark:border-gray-700/30 z-50 max-h-80 overflow-y-auto";

  return (
    <div className={containerClasses} role="listbox" aria-label="Search results">
      {/* Header */}
      <div className="p-3 border-b border-gray-200/30 dark:border-gray-700/30 bg-gradient-to-r from-gray-50/50 to-blue-50/30 dark:from-gray-700/30 dark:to-blue-900/20 rounded-t-3xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-gray-900 dark:text-white">
                Search Results
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
              </p>
            </div>
          </div>
          <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">
            {selectedFilter === 'all' ? 'All' : selectedFilter}
          </div>
        </div>
      </div>
      
      {/* Results list */}
      <div className={variant === "mobile" || variant === "navbar" ? "max-h-56 overflow-y-auto" : "py-1"}>
        {searchResults.map((result, index) => (
          <button
            key={`${result.type}-${result.id || index}`}
            onClick={() => handleResultClick(result)}
            onMouseEnter={() => onResultHover?.(index)}
            role="option"
            aria-selected={index === selectedIndex}
            className={`
              w-full flex items-start space-x-3 p-3 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/30 
              dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-300 group
              border-b border-gray-100/50 dark:border-gray-700/30 last:border-b-0
              ${index === selectedIndex ? 'bg-gradient-to-r from-blue-50/50 to-purple-50/30 dark:from-blue-900/20 dark:to-purple-900/20 ring-2 ring-blue-500/20' : ''}
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-1
            `}
          >
            {/* Icon container */}
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {getResultIcon(result.type)}
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 text-left min-w-0">
              <div className="text-sm font-bold text-gray-900 dark:text-white 
                           group-hover:text-blue-600 dark:group-hover:text-blue-400 
                           transition-colors duration-300 truncate">
                {result.displayName}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                {result.subtitle}
              </div>
              {result.date && (
                <div className="flex items-center space-x-1 mt-1">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-2.5 w-2.5 text-gray-400" />
                    <span className="text-xs text-gray-400 font-medium">
                      {formatDate(result.date)}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Arrow indicator */}
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-5 h-5 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-md flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-2.5 w-2.5 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchResults; 