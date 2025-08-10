import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, User, Calendar, FileText, CreditCard, Activity, Filter, Loader2, ChevronDown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApi } from '../../contexts/ApiContext';
import { SearchFilter } from './filters';

const MobileSearchBar = ({ 
  placeholder = "Search...",
  className = "",
  showFilters = true,
  onSearch = null,
  variant = "fullscreen" // "fullscreen", "overlay", "bottom-sheet"
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  
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

  // Close search on route change
  useEffect(() => {
    setIsSearchOpen(false);
    setSearchResults([]);
    setSuggestions([]);
  }, [location.pathname]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setSearchResults([]);
        setSuggestions([]);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isSearchOpen]);

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
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    setSuggestions([]);
  };

  const handleSuggestionClick = (suggestion) => {
    navigate(suggestion.href);
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    setSuggestions([]);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSuggestions([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const openSearch = () => {
    setIsSearchOpen(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    setSuggestions([]);
  };



  const getResultIcon = (type) => {
    switch (type) {
      case 'user':
        return <User className="h-5 w-5 text-blue-500" />;
      case 'appointment':
        return <Calendar className="h-5 w-5 text-green-500" />;
      case 'medicalRecord':
        return <FileText className="h-5 w-5 text-purple-500" />;
      case 'payment':
        return <CreditCard className="h-5 w-5 text-yellow-500" />;
      case 'activityLog':
        return <Activity className="h-5 w-5 text-red-500" />;
      default:
        return <Search className="h-5 w-5 text-gray-500" />;
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

  // Search Button (always visible)
  if (!isSearchOpen) {
    return (
      <button
        onClick={openSearch}
        className={`
          w-full p-4 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl 
          border border-gray-200/50 dark:border-gray-600/50 shadow-lg 
          hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group
          ${className}
        `}
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/40 transition-colors duration-300">
            <Search className="h-5 w-5 text-blue-500" />
          </div>
          <span className="text-gray-500 dark:text-gray-400 text-left">
            {placeholder}
          </span>
        </div>
      </button>
    );
  }

  // Fullscreen Search Interface
  if (variant === "fullscreen") {
    return (
      <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900" ref={searchRef}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={closeSearch}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Search</h2>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        {/* Search Input */}
        <div className="p-4">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Start typing to search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-20 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                autoFocus
              />
              
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-16 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
              
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors duration-200"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="px-4 pb-4">
            <button
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Filter by: {selectedFilter === 'all' ? 'All types' : selectedFilter}
              </span>
              <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${showFiltersPanel ? 'rotate-180' : ''}`} />
            </button>
            
            {showFiltersPanel && (
              <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                <SearchFilter
                  selectedFilter={selectedFilter}
                  setSelectedFilter={setSelectedFilter}
                  showFilters={true}
                  userRole={userRole}
                  variant="mobile"
                  showLabel={false}
                  className="p-0"
                />
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <span className="ml-3 text-gray-600 dark:text-gray-400">Searching...</span>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 pb-4">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Results ({searchResults.length})
              </h3>
              <div className="space-y-2">
                {searchResults.map((result, index) => (
                  <button
                    key={`${result.type}-${index}`}
                    onClick={() => handleResultClick(result)}
                    className="w-full flex items-start space-x-3 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getResultIcon(result.type)}
                    </div>
                    
                    <div className="flex-1 text-left min-w-0">
                      <div className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                        {result.displayName}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {result.subtitle}
                      </div>
                      {result.date && (
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(result.date)}
                          </span>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search Suggestions */}
        {suggestions.length > 0 && searchResults.length === 0 && !isLoading && (
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 pb-4">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Quick Suggestions
              </h3>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={`suggestion-${index}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full flex items-start space-x-3 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getResultIcon(suggestion.type)}
                    </div>
                    
                    <div className="flex-1 text-left min-w-0">
                      <div className="text-base font-medium text-gray-900 dark:text-white mb-1">
                        {suggestion.text}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {suggestion.subtitle}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* No Results */}
        {searchResults.length === 0 && suggestions.length === 0 && !isLoading && searchQuery.trim().length >= 2 && (
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="text-center">
              <Search className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No results found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search terms or filters
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {searchQuery.trim().length === 0 && (
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="text-center">
              <Search className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Start searching
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Type to search across patients, appointments, records, and more
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default overlay variant
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" ref={searchRef}>
      <div className="absolute top-0 left-0 right-0 bg-white dark:bg-gray-900 rounded-b-3xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={closeSearch}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          >
            <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Search</h2>
          <div className="w-10"></div>
        </div>

        {/* Search Input */}
        <div className="p-4">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Start typing to search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-20 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                autoFocus
              />
              
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-16 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
              
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors duration-200"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          {/* Filters */}
          {showFilters && (
            <div className="px-4 pb-4">
              <button
                onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700"
              >
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Filter by: {selectedFilter === 'all' ? 'All types' : selectedFilter}
                </span>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${showFiltersPanel ? 'rotate-180' : ''}`} />
              </button>
              
              {showFiltersPanel && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                  <SearchFilter
                    selectedFilter={selectedFilter}
                    setSelectedFilter={setSelectedFilter}
                    showFilters={true}
                    userRole={userRole}
                    variant="mobile"
                    showLabel={false}
                    className="p-0"
                  />
                </div>
              )}
            </div>
          )}

          {/* Results and Suggestions */}
          {searchResults.length > 0 && (
            <div className="px-4 pb-4">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Results ({searchResults.length})
              </h3>
              <div className="space-y-2">
                {searchResults.map((result, index) => (
                  <button
                    key={`${result.type}-${index}`}
                    onClick={() => handleResultClick(result)}
                    className="w-full flex items-start space-x-3 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getResultIcon(result.type)}
                    </div>
                    
                    <div className="flex-1 text-left min-w-0">
                      <div className="text-base font-semibold text-gray-900 dark:text-white mb-1">
                        {result.displayName}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {result.subtitle}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {suggestions.length > 0 && searchResults.length === 0 && (
            <div className="px-4 pb-4">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                Quick Suggestions
              </h3>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={`suggestion-${index}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full flex items-start space-x-3 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getResultIcon(suggestion.type)}
                    </div>
                    
                    <div className="flex-1 text-left min-w-0">
                      <div className="text-base font-medium text-gray-900 dark:text-white mb-1">
                        {suggestion.text}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {suggestion.subtitle}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileSearchBar; 