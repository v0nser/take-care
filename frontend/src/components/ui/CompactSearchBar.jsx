import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Search, X, Clock, User, Calendar, FileText, CreditCard, Activity, Filter, Loader2, Sparkles, Zap, ArrowUp, ArrowDown, CornerDownLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApi } from '../../contexts/ApiContext';
import { SearchFilter } from './filters';

// Enhanced Search Button Component with better accessibility
const SearchButton = ({ onClick, className = "", variant = "default", isExpanded = false, ariaLabel = "Toggle search" }) => (
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

// Enhanced Search Input Component with better accessibility and keyboard support
const SearchInput = ({ 
  inputRef, 
  searchQuery, 
  setSearchQuery, 
  onFocus, 
  onBlur,
  placeholder, 
  onClear, 
  onSubmit, 
  isLoading, 
  variant = "default",
  compact = false,
  onKeyDown,
  ariaLabel = "Search input"
}) => (
  <form onSubmit={onSubmit} className="relative w-full" role="search">
    <div className="relative group">
      {/* Enhanced glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/20 to-blue-500/30 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-700"></div>
      
      {/* Search input container */}
      <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl border-2 border-gray-200/50 dark:border-gray-600/50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:border-blue-300/50 dark:group-hover:border-blue-600/50 group-focus-within:border-blue-400 dark:group-focus-within:border-blue-500 min-w-[600px] lg:min-w-[600px] md:min-w-[500px] sm:min-w-[400px] max-w-full">
        
        {/* Search icon with animation */}
        <div className="absolute left-5 top-1/2 transform -translate-y-1/2">
          <div className="relative">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-all duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>
        
        {/* Enhanced search input */}
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          aria-label={ariaLabel}
          aria-describedby="search-description"
          className={`
            w-full pl-14 pr-40 py-4 bg-transparent border-none outline-none
            text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
            text-base font-medium tracking-wide
            transition-all duration-300
            focus:outline-none focus:ring-0
            ${compact ? 'py-3 text-sm' : 'py-4 text-base'}
          `}
        />
        
        {/* Clear button with enhanced styling */}
        {searchQuery && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className="absolute right-36 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-300 hover:scale-110 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 group/clear focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <X className="h-4 w-4 group-hover/clear:rotate-90 transition-transform duration-300" />
          </button>
        )}
        
        {/* Loading indicator with animation */}
        {isLoading && (
          <div className="absolute right-36 top-1/2 transform -translate-y-1/2" aria-label="Searching...">
            <div className="relative">
              <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-sm animate-pulse"></div>
            </div>
          </div>
        )}
        
        {/* Enhanced search button */}
        <button
          type="submit"
          aria-label="Submit search"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white rounded-2xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group/btn focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <span className="flex items-center space-x-2">
            <Search className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-300" />
            <span>Search</span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    </div>
    <div id="search-description" className="sr-only">Search across all records and data</div>
  </form>
);

// Enhanced Filter Button Component
const FilterButton = ({ onClick, isActive, className = "", ariaLabel = "Toggle search filters" }) => (
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    aria-expanded={isActive}
    className={`
      relative overflow-hidden group transition-all duration-500 ease-out
      p-3 rounded-2xl font-medium
      ${isActive 
        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl shadow-blue-500/25 scale-105' 
        : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-700/80 border border-gray-200/50 dark:border-gray-600/50'
      }
      backdrop-blur-xl shadow-lg hover:shadow-xl hover:scale-110 transform
      focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:ring-offset-2
      ${className}
    `}
    title="Search Filters"
  >
    {/* Animated background */}
    <div className={`
      absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl 
      opacity-0 group-hover:opacity-100 transition-opacity duration-500
      ${isActive ? 'opacity-100' : ''}
    `}></div>
    
    {/* Icon with enhanced styling */}
    <div className="relative z-10 flex items-center space-x-2">
      <Filter className="h-4 w-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
      <span className="text-sm font-medium">Filters</span>
    </div>
    
    {/* Glow effect */}
    <div className={`
      absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-2xl 
      opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl
      ${isActive ? 'opacity-100' : ''}
    `}></div>
  </button>
);

// Enhanced Search Results Component with keyboard navigation
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
    const iconClasses = "h-5 w-5";
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
    : "absolute top-full left-0 right-0 mt-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/30 dark:border-gray-700/30 z-50 max-h-96 overflow-y-auto";

  return (
    <div className={containerClasses} role="listbox" aria-label="Search results">
      {/* Enhanced header */}
      <div className="p-4 border-b border-gray-200/30 dark:border-gray-700/30 bg-gradient-to-r from-gray-50/50 to-blue-50/30 dark:from-gray-700/30 dark:to-blue-900/20 rounded-t-3xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                Search Results
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
              </p>
            </div>
          </div>
          <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">
            {selectedFilter === 'all' ? 'All types' : selectedFilter}
          </div>
        </div>
      </div>
      
      {/* Enhanced results list */}
      <div className={variant === "mobile" || variant === "navbar" ? "max-h-64 overflow-y-auto" : "py-2"}>
        {searchResults.map((result, index) => (
          <button
            key={`${result.type}-${result.id || index}`}
            onClick={() => handleResultClick(result)}
            onMouseEnter={() => onResultHover?.(index)}
            role="option"
            aria-selected={index === selectedIndex}
            className={`
              w-full flex items-start space-x-4 p-4 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/30 
              dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-300 group
              ${variant === "mobile" || variant === "navbar" ? "p-4" : "p-4"}
              border-b border-gray-100/50 dark:border-gray-700/30 last:border-b-0
              ${index === selectedIndex ? 'bg-gradient-to-r from-blue-50/50 to-purple-50/30 dark:from-blue-900/20 dark:to-purple-900/20 ring-2 ring-blue-500/20' : ''}
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-1
            `}
          >
            {/* Enhanced icon container */}
            <div className="flex-shrink-0 mt-1">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                {getResultIcon(result.type)}
              </div>
            </div>
            
            {/* Enhanced content */}
            <div className="flex-1 text-left min-w-0">
              <div className="text-sm font-bold text-gray-900 dark:text-white 
                           group-hover:text-blue-600 dark:group-hover:text-blue-400 
                           transition-colors duration-300 truncate">
                {result.displayName}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                {result.subtitle}
              </div>
              {result.date && (
                <div className="flex items-center space-x-2 mt-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-400 font-medium">
                      {formatDate(result.date)}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Enhanced arrow indicator */}
            <div className="flex-shrink-0 mt-1">
              <div className="w-6 h-6 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-3 w-3 text-gray-400 group-hover:text-blue-500 transition-colors duration-300" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Enhanced Search Suggestions Component
const SearchSuggestions = ({ 
  suggestions, 
  showResults, 
  isSearchFocused, 
  handleSuggestionClick, 
  variant = "default",
  selectedIndex = -1,
  onSuggestionHover
}) => {
  if (!showResults || suggestions.length === 0 || !isSearchFocused) return null;

  const containerClasses = variant === "mobile" || variant === "navbar"
    ? "border-t border-gray-200/30 dark:border-gray-700/30"
    : "absolute top-full left-0 right-0 mt-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/30 dark:border-gray-700/30 z-50 max-h-96 overflow-y-auto";

  return (
    <div className={containerClasses} role="listbox" aria-label="Search suggestions">
      {/* Enhanced header */}
      <div className="p-4 border-b border-gray-200/30 dark:border-gray-700/30 bg-gradient-to-r from-gray-50/50 to-green-50/30 dark:from-gray-700/30 dark:to-green-900/20 rounded-t-3xl">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Suggestions
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {suggestions.length} {suggestions.length === 1 ? 'suggestion' : 'suggestions'} available
            </p>
          </div>
        </div>
      </div>
      
      {/* Enhanced suggestions list */}
      <div className={variant === "mobile" || variant === "navbar" ? "max-h-64 overflow-y-auto" : "py-2"}>
        {suggestions.map((suggestion, index) => (
          <button
            key={`suggestion-${index}`}
            onClick={() => handleSuggestionClick(suggestion)}
            onMouseEnter={() => onSuggestionHover?.(index)}
            role="option"
            aria-selected={index === selectedIndex}
            className={`
              w-full flex items-start space-x-4 p-4 hover:bg-gradient-to-r hover:from-green-50/50 hover:to-emerald-50/30 
              dark:hover:from-green-900/20 dark:hover:to-emerald-900/20 transition-all duration-300 group
              ${variant === "mobile" || variant === "navbar" ? "p-4" : "p-4"}
              border-b border-gray-100/50 dark:border-gray-700/30 last:border-b-0
              ${index === selectedIndex ? 'bg-gradient-to-r from-green-50/50 to-emerald-50/30 dark:from-green-900/20 dark:to-emerald-900/20 ring-2 ring-green-500/20' : ''}
              focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:ring-offset-1
            `}
          >
            {/* Enhanced icon container */}
            <div className="flex-shrink-0 mt-1">
              <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-700 dark:to-emerald-800 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Search className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            
            {/* Enhanced content */}
            <div className="flex-1 text-left min-w-0">
              <div className="text-sm font-bold text-gray-900 dark:text-white 
                           group-hover:text-green-600 dark:group-hover:text-green-400 
                           transition-colors duration-300 truncate">
                {suggestion.displayName}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                {suggestion.subtitle}
              </div>
            </div>
            
            {/* Enhanced arrow indicator */}
            <div className="flex-shrink-0 mt-1">
              <div className="w-6 h-6 bg-gradient-to-r from-green-100 to-emerald-200 dark:from-green-700 dark:to-emerald-800 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-3 w-3 text-green-500 group-hover:text-emerald-600 transition-colors duration-300" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Enhanced No Results Component
const NoResults = ({ showResults, searchResults, isLoading, variant = "default", searchQuery }) => {
  if (!showResults || searchResults.length > 0 || isLoading) return null;

  const containerClasses = variant === "mobile" || variant === "navbar"
    ? "border-t border-gray-200/30 dark:border-gray-700/30"
    : "absolute top-full left-0 right-0 mt-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/30 dark:border-gray-700/30 z-50";

  return (
    <div className={containerClasses} role="status" aria-live="polite">
      <div className="p-8 text-center">
        {/* Enhanced empty state */}
        <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <Search className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          No results found for "{searchQuery}"
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Try adjusting your search terms or filters
        </p>
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
          <span>Try different keywords</span>
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
          <span>Check your filters</span>
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

// Keyboard navigation hook
const useKeyboardNavigation = (results, suggestions, onResultClick, onSuggestionClick) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isNavigatingResults, setIsNavigatingResults] = useState(true);

  const totalItems = (isNavigatingResults ? results : suggestions).length;

  const handleKeyDown = useCallback((e) => {
    if (totalItems === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => {
          const newIndex = prev < totalItems - 1 ? prev + 1 : 0;
          return newIndex;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => {
          const newIndex = prev > 0 ? prev - 1 : totalItems - 1;
          return newIndex;
        });
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          if (isNavigatingResults) {
            onResultClick(results[selectedIndex]);
          } else {
            onSuggestionClick(suggestions[selectedIndex]);
          }
        }
        break;
      case 'Tab':
        if (e.shiftKey) {
          // Switch between results and suggestions
          setIsNavigatingResults(prev => !prev);
          setSelectedIndex(-1);
        }
        break;
    }
  }, [totalItems, selectedIndex, isNavigatingResults, results, suggestions, onResultClick, onSuggestionClick]);

  const resetSelection = useCallback(() => {
    setSelectedIndex(-1);
    setIsNavigatingResults(true);
  }, []);

  return { selectedIndex, isNavigatingResults, handleKeyDown, resetSelection };
};

const CompactSearchBar = ({ 
  placeholder = "Search across all records...",
  className = "",
  onSearch = null,
  compact = false,
  variant = "default" // "default", "navbar", "mobile"
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState(null);
  
  const { user } = useAuth();
  const { apiCall } = useApi();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  const userRole = user?.role || 'patient';

  // Memoized search function for better performance
  const performSearch = useCallback(async (query) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await apiCall('/search', 'GET', {
        query: query.trim(),
        type: selectedFilter !== 'all' ? selectedFilter : undefined,
        role: userRole
      });

      if (response.success) {
        setSearchResults(response.data.results);
        setShowResults(true);
      } else {
        setError(response.message || 'Search failed');
      }
    } catch (error) {
      console.error('Search error:', error);
      setError('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [apiCall, selectedFilter, userRole]);

  // Memoized suggestions function
  const getSuggestions = useCallback(async (query) => {
    if (!query.trim()) return;

    try {
      const response = await apiCall('/search/suggestions', 'GET', {
        query: query.trim(),
        type: selectedFilter !== 'all' ? selectedFilter : undefined
      });

      if (response.success) {
        setSuggestions(response.data.suggestions);
      }
    } catch (error) {
      console.error('Suggestions error:', error);
      // Don't show error for suggestions as it's not critical
    }
  }, [apiCall, selectedFilter]);

  // Enhanced result click handler
  const handleResultClick = useCallback((result) => {
    if (result?.href) {
      navigate(result.href);
      setShowResults(false);
      setSearchQuery('');
      setIsSearchFocused(false);
      if (variant === "mobile" || variant === "navbar") {
        setIsExpanded(false);
      }
      setShowFilters(false);
    }
  }, [navigate, variant]);

  // Enhanced suggestion click handler
  const handleSuggestionClick = useCallback((suggestion) => {
    if (suggestion?.href) {
      navigate(suggestion.href);
      setSuggestions([]);
      setSearchQuery('');
      setShowResults(false);
      setIsSearchFocused(false);
      if (variant === "mobile" || variant === "navbar") {
        setIsExpanded(false);
      }
      setShowFilters(false);
    }
  }, [navigate, variant]);

  // Keyboard navigation
  const { selectedIndex, isNavigatingResults, handleKeyDown, resetSelection } = useKeyboardNavigation(
    searchResults,
    suggestions,
    handleResultClick,
    handleSuggestionClick
  );

  // Debounce search query with useCallback for better performance
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Perform search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length >= 2) {
      performSearch(debouncedQuery);
    } else {
      setSearchResults([]);
      setSuggestions([]);
      setShowResults(false);
    }
  }, [debouncedQuery, performSearch]);

  // Get search suggestions
  useEffect(() => {
    if (searchQuery.trim().length >= 1) {
      getSuggestions(searchQuery);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery, getSuggestions]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
        setIsSearchFocused(false);
        if (variant === "mobile" || variant === "navbar") {
          setIsExpanded(false);
        }
        setShowFilters(false);
        resetSelection();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [variant, resetSelection]);

  // Close search results on route change
  useEffect(() => {
    setShowResults(false);
    setIsSearchFocused(false);
    if (variant === "mobile" || variant === "navbar") {
      setIsExpanded(false);
    }
    setShowFilters(false);
    resetSelection();
  }, [location.pathname, variant, resetSelection]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery);
      if (onSearch) {
        onSearch(searchQuery);
      }
    }
  }, [searchQuery, performSearch, onSearch]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setSuggestions([]);
    setShowResults(false);
    setIsSearchFocused(false);
    setError(null);
    resetSelection();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [resetSelection]);

  const toggleSearch = useCallback(() => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [isExpanded]);

  const toggleFilters = useCallback(() => {
    setShowFilters(!showFilters);
  }, [showFilters]);

  const handleInputFocus = useCallback(() => {
    setIsSearchFocused(true);
    if (searchQuery.trim().length >= 2) {
      setShowResults(true);
    }
  }, [searchQuery]);

  const handleInputBlur = useCallback(() => {
    // Delay to allow click events to fire
    setTimeout(() => {
      if (!searchRef.current?.contains(document.activeElement)) {
        setIsSearchFocused(false);
      }
    }, 150);
  }, []);

  // Enhanced keyboard navigation for input
  const handleInputKeyDown = useCallback((e) => {
    handleKeyDown(e);
    
    // Additional keyboard shortcuts
    if (e.key === 'Escape') {
      clearSearch();
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  }, [handleKeyDown, clearSearch]);

  // Memoized result hover handler
  const handleResultHover = useCallback((index) => {
    if (isNavigatingResults) {
      // Only update if we're navigating results
      return;
    }
  }, [isNavigatingResults]);

  // Memoized suggestion hover handler
  const handleSuggestionHover = useCallback((index) => {
    if (!isNavigatingResults) {
      // Only update if we're navigating suggestions
      return;
    }
  }, [isNavigatingResults]);

  // Mobile/Navbar variant with enhanced dropdown animation
  if (variant === "mobile" || variant === "navbar") {
    return (
      <div className={`relative ${className}`} ref={searchRef}>
        {/* Enhanced Search Button */}
        <SearchButton 
          onClick={toggleSearch} 
          variant={variant}
          isExpanded={isExpanded}
          ariaLabel="Toggle search panel"
        />

        {/* Enhanced Dropdown Search Panel */}
        <div className={`
          absolute top-full right-0 mt-4 w-[500px] lg:w-[500px] md:w-[450px] sm:w-[400px] bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl 
          rounded-3xl shadow-2xl border border-gray-200/30 dark:border-gray-700/30 z-50
          transform transition-all duration-700 ease-out
          ${isExpanded 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
          }
        `}>
          {/* Enhanced Search Input */}
          <div className="p-6">
            <SearchInput
              inputRef={inputRef}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder={placeholder}
              onClear={clearSearch}
              onSubmit={handleSearch}
              isLoading={isLoading}
              variant={variant}
              compact={compact}
              onKeyDown={handleInputKeyDown}
              ariaLabel="Search in mobile panel"
            />
          </div>

          {/* Enhanced Filter Button */}
          <div className="px-6 pb-4">
            <FilterButton 
              onClick={toggleFilters}
              isActive={showFilters}
              ariaLabel="Toggle search filters in mobile panel"
            />
          </div>

          {/* Enhanced Filter Options */}
          {showFilters && (
            <div className="px-6 pb-4">
              <SearchFilter
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
                showFilters={true}
                userRole={userRole}
                variant={variant}
                showLabel={true}
                labelText="Search Filters"
              />
            </div>
          )}

          {/* Enhanced Search Results */}
          <SearchResults
            searchResults={searchResults}
            showResults={showResults}
            selectedFilter={selectedFilter}
            handleResultClick={handleResultClick}
            variant={variant}
            selectedIndex={isNavigatingResults ? selectedIndex : -1}
            onResultHover={handleResultHover}
          />

          {/* Enhanced Search Suggestions */}
          <SearchSuggestions
            suggestions={suggestions}
            showResults={showResults}
            isSearchFocused={isSearchFocused}
            handleSuggestionClick={handleSuggestionClick}
            variant={variant}
            selectedIndex={!isNavigatingResults ? selectedIndex : -1}
            onSuggestionHover={handleSuggestionHover}
          />

          {/* Enhanced No Results Message */}
          <NoResults
            showResults={showResults}
            searchResults={searchResults}
            isLoading={isLoading}
            variant={variant}
            searchQuery={searchQuery}
          />

          {/* Error Message */}
          {error && (
            <div className="px-6 pb-4">
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default variant with enhanced styling
  return (
    <div className={`relative ${className}`} ref={searchRef}>
      {/* Enhanced Search Input */}
      <SearchInput
        inputRef={inputRef}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        onClear={clearSearch}
        onSubmit={handleSearch}
        isLoading={isLoading}
        variant={variant}
        compact={compact}
        onKeyDown={handleInputKeyDown}
        ariaLabel="Search input"
      />

      {/* Enhanced Filter Button - Positioned to the right of search input */}
      <div className="absolute right-36 top-1/2 transform -translate-y-1/2">
        <FilterButton 
          onClick={toggleFilters}
          isActive={showFilters}
          ariaLabel="Toggle search filters"
        />
      </div>

      {/* Enhanced Filter Options */}
      {showFilters && (
        <div className="absolute top-full right-0 mt-4 w-72 bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/30 dark:border-gray-700/30 z-50 transform animate-in slide-in-from-top-2">
          <SearchFilter
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            showFilters={true}
            userRole={userRole}
            variant={variant}
            showLabel={true}
            labelText="Search Filters"
          />
        </div>
      )}

      {/* Enhanced Search Results Dropdown */}
      <SearchResults
        searchResults={searchResults}
        showResults={showResults}
        selectedFilter={selectedFilter}
        handleResultClick={handleResultClick}
        variant={variant}
        selectedIndex={isNavigatingResults ? selectedIndex : -1}
        onResultHover={handleResultHover}
      />

      {/* Enhanced Search Suggestions Dropdown */}
      <SearchSuggestions
        suggestions={suggestions}
        showResults={showResults}
        isSearchFocused={isSearchFocused}
        handleSuggestionClick={handleSuggestionClick}
        variant={variant}
        selectedIndex={!isNavigatingResults ? selectedIndex : -1}
        onSuggestionHover={handleSuggestionHover}
      />

      {/* Enhanced No Results Message */}
      <NoResults
        showResults={showResults}
        searchResults={searchResults}
        isLoading={isLoading}
        variant={variant}
        searchQuery={searchQuery}
      />

      {/* Error Message */}
      {error && (
        <div className="absolute top-full left-0 right-0 mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 z-50">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Keyboard Navigation Help */}
      {showResults && (searchResults.length > 0 || suggestions.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
          <div className="flex items-center justify-center space-x-4">
            <span className="flex items-center space-x-1">
              <ArrowUp className="h-3 w-3" />
              <ArrowDown className="h-3 w-3" />
              <span>Navigate</span>
            </span>
            <span className="flex items-center space-x-1">
                                      <CornerDownLeft className="h-3 w-3" />
              <span>Select</span>
            </span>
            <span className="flex items-center space-x-1">
              <span>Tab</span>
              <span>Switch</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompactSearchBar; 