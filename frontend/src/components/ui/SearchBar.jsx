import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Clock, User, Calendar, FileText, CreditCard, Activity, Filter, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApi } from '../../contexts/ApiContext';

const SearchBar = ({ 
  placeholder = "Search across all records...",
  className = "",
  showFilters = true,
  onSearch = null,
  compact = false 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  const { user } = useAuth();
  const { apiCall } = useApi();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  const userRole = user?.role || 'patient';

  // Debounce search query
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
    }
  }, [debouncedQuery]);

  // Get search suggestions
  useEffect(() => {
    if (searchQuery.trim().length >= 1) {
      getSuggestions(searchQuery);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close search results on route change
  useEffect(() => {
    setShowResults(false);
    setIsSearchFocused(false);
  }, [location.pathname]);

  const performSearch = async (query) => {
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await apiCall('/search', 'GET', {
        query: query.trim(),
        type: selectedFilter !== 'all' ? selectedFilter : undefined,
        role: userRole
      });

      if (response.success) {
        setSearchResults(response.data.results);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSuggestions = async (query) => {
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
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      performSearch(searchQuery);
      if (onSearch) {
        onSearch(searchQuery);
      }
    }
  };

  const handleResultClick = (result) => {
    navigate(result.href);
    setShowResults(false);
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  const handleSuggestionClick = (suggestion) => {
    navigate(suggestion.href);
    setSuggestions([]);
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSuggestions([]);
    setShowResults(false);
    setIsSearchFocused(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const getFilterOptions = () => {
    const baseOptions = [
      { value: 'all', label: 'All', icon: Search },
      { value: 'users', label: 'Users', icon: User },
      { value: 'appointments', label: 'Appointments', icon: Calendar },
      { value: 'medicalRecords', label: 'Medical Records', icon: FileText },
      { value: 'payments', label: 'Payments', icon: CreditCard }
    ];

    // Only show activity logs for admins
    if (userRole === 'admin') {
      baseOptions.push({ value: 'activityLogs', label: 'Activity Logs', icon: Activity });
    }

    return baseOptions;
  };

  const getResultIcon = (type) => {
    switch (type) {
      case 'user':
        return <User className="h-4 w-4 text-blue-500" />;
      case 'appointment':
        return <Calendar className="h-4 w-4 text-green-500" />;
      case 'medicalRecord':
        return <FileText className="h-4 w-4 text-purple-500" />;
      case 'payment':
        return <CreditCard className="h-4 w-4 text-yellow-500" />;
      case 'activityLog':
        return <Activity className="h-4 w-4 text-red-500" />;
      default:
        return <Search className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      {/* Search Input */}
      <form onSubmit={handleSearch} className="relative">
        <div className={`
          relative transition-all duration-300 group
          ${isSearchFocused ? 'scale-105' : ''}
          ${compact ? 'w-full' : 'w-full max-w-2xl'}
        `}>
          {/* Elegant glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/15 to-blue-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-500"></div>
          
          <div className="relative">
            {/* Search icon */}
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Search className={`
                h-5 w-5 transition-all duration-300
                ${isSearchFocused ? "text-blue-500 scale-110" : "text-gray-400"}
              `} />
            </div>
            
            {/* Search input */}
            <input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className={`
                w-full pl-12 pr-20 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl 
                border border-gray-200/50 dark:border-gray-600/50 rounded-3xl 
                focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
                text-sm placeholder-gray-500 dark:placeholder-gray-400 
                transition-all duration-300 hover:bg-white dark:hover:bg-gray-700/80 
                shadow-lg hover:shadow-xl font-medium
                ${compact ? 'py-2 text-sm' : ''}
              `}
            />
            
            {/* Clear button */}
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-16 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-300 hover:scale-110 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="absolute right-16 top-1/2 transform -translate-y-1/2">
                <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
              </div>
            )}
            
            {/* Search button */}
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Search
            </button>
          </div>
        </div>
      </form>

      {/* Filter Options */}
      {showFilters && (
        <div className="flex items-center space-x-2 mt-3">
          <Filter className="h-4 w-4 text-gray-400" />
          <div className="flex flex-wrap gap-2">
            {getFilterOptions().map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedFilter(option.value)}
                className={`
                  flex items-center space-x-2 px-3 py-1.5 rounded-2xl text-xs font-medium transition-all duration-300
                  ${selectedFilter === option.value
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }
                `}
              >
                <option.icon className="h-3 w-3" />
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Results Dropdown */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/30 dark:border-gray-700/30 z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200/30 dark:border-gray-700/30">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Search Results ({searchResults.length})
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {selectedFilter === 'all' ? 'All types' : selectedFilter}
              </span>
            </div>
          </div>
          
          <div className="py-2">
            {searchResults.map((result, index) => (
              <button
                key={`${result.type}-${index}`}
                onClick={() => handleResultClick(result)}
                className="w-full flex items-start space-x-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 group"
              >
                <div className="flex-shrink-0 mt-1">
                  {getResultIcon(result.type)}
                </div>
                
                <div className="flex-1 text-left min-w-0">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 truncate">
                    {result.displayName}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                    {result.subtitle}
                  </div>
                  {result.date && (
                    <div className="flex items-center space-x-1 mt-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-400">
                        {formatDate(result.date)}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search Suggestions Dropdown */}
      {suggestions.length > 0 && !showResults && isSearchFocused && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/30 dark:border-gray-700/30 z-50">
          <div className="p-3 border-b border-gray-200/30 dark:border-gray-700/30">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Quick Suggestions
            </h3>
          </div>
          
          <div className="py-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={`suggestion-${index}`}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 group"
              >
                <div className="flex-shrink-0 mt-1">
                  {getResultIcon(suggestion.type)}
                </div>
                
                <div className="flex-1 text-left min-w-0">
                  <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 truncate">
                    {suggestion.text}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                    {suggestion.subtitle}
                  </div>
                </div>
                
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No Results Message */}
      {showResults && searchResults.length === 0 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/30 dark:border-gray-700/30 z-50 p-6 text-center">
          <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
            No results found
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Try adjusting your search terms or filters
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchBar; 