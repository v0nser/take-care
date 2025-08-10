import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, User, Calendar, FileText, CreditCard, Activity, Filter, Loader2, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApi } from '../../contexts/ApiContext';
import { SearchFilter } from './filters';

// Mobile Search Button Component
const MobileSearchButton = ({ onClick, className = "", variant = "default" }) => (
  <button
    onClick={onClick}
    className={`
      p-3 rounded-2xl bg-white/60 dark:bg-gray-800/60 hover:bg-white dark:hover:bg-gray-700/80 
      backdrop-blur-xl border border-gray-200/50 dark:border-gray-600/50 shadow-lg hover:shadow-xl 
      transition-all duration-300 hover:scale-110 group
      ${variant === "navbar" ? "p-2" : "p-3"}
      ${className}
    `}
  >
    <Search className={`
      h-5 w-5 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 
      transition-all duration-300
      ${variant === "navbar" ? "h-4 w-4" : "h-5 w-5"}
    `} />
  </button>
);

// Search Input Component
const SearchInput = ({ 
  inputRef, 
  searchQuery, 
  setSearchQuery, 
  onFocus, 
  placeholder, 
  onClear, 
  onSubmit, 
  isLoading, 
  variant = "default",
  compact = false 
}) => (
  <form onSubmit={onSubmit} className="relative">
    <div className={`
      relative transition-all duration-300 group
      ${variant === "mobile" || variant === "navbar" ? "w-full" : "w-full max-w-2xl"}
      ${compact ? "w-full" : ""}
    `}>
      {/* Elegant glow effect for default variant */}
      {variant === "default" && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/15 to-blue-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-all duration-500"></div>
      )}
      
      <div className="relative">
        {/* Search icon */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <Search className={`
            h-5 w-5 transition-all duration-300
            ${variant === "default" ? "text-gray-400" : "text-gray-400"}
            ${compact ? "h-4 w-4" : "h-5 w-5"}
          `} />
        </div>
        
        {/* Search input */}
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={onFocus}
          className={`
            w-full pl-12 pr-20 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl 
            border border-gray-200/50 dark:border-gray-600/50 rounded-3xl 
            focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 
            text-sm placeholder-gray-500 dark:placeholder-gray-400 
            transition-all duration-300 hover:bg-white dark:hover:bg-gray-700/80 
            shadow-lg hover:shadow-xl font-medium
            ${compact ? 'py-2 text-sm' : ''}
            ${variant === "mobile" || variant === "navbar" ? 'rounded-2xl' : 'rounded-3xl'}
          `}
        />
        
        {/* Clear button */}
        {searchQuery && (
          <button
            type="button"
            onClick={onClear}
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
);

// Filter Options Component - Now using modular SearchFilter
const FilterOptions = ({ selectedFilter, setSelectedFilter, showFilters, userRole, variant = "default" }) => {
  return (
    <SearchFilter
      selectedFilter={selectedFilter}
      setSelectedFilter={setSelectedFilter}
      showFilters={showFilters}
      userRole={userRole}
      variant={variant}
      showLabel={variant === "mobile" || variant === "navbar"}
      labelText="Search Filters"
    />
  );
};

// Search Results Component
const SearchResults = ({ 
  searchResults, 
  showResults, 
  selectedFilter, 
  handleResultClick, 
  variant = "default" 
}) => {
  if (!showResults || searchResults.length === 0) return null;

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

  const containerClasses = variant === "mobile" || variant === "navbar"
    ? "border-t border-gray-200/30 dark:border-gray-700/30"
    : "absolute top-full left-0 right-0 mt-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/30 dark:border-gray-700/30 z-50 max-h-96 overflow-y-auto";

  return (
    <div className={containerClasses}>
      <div className="p-3 border-b border-gray-200/30 dark:border-gray-700/30">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Results ({searchResults.length})
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {selectedFilter === 'all' ? 'All types' : selectedFilter}
          </span>
        </div>
      </div>
      
      <div className={variant === "mobile" || variant === "navbar" ? "max-h-64 overflow-y-auto" : "py-2"}>
        {searchResults.map((result, index) => (
          <button
            key={`${result.type}-${index}`}
            onClick={() => handleResultClick(result)}
            className={`
              w-full flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 
              transition-all duration-200 group
              ${variant === "mobile" || variant === "navbar" ? "p-3" : "p-4"}
            `}
          >
            <div className="flex-shrink-0 mt-1">
              {getResultIcon(result.type)}
            </div>
            
            <div className="flex-1 text-left min-w-0">
              <div className="text-sm font-semibold text-gray-900 dark:text-white 
                           group-hover:text-blue-600 dark:group-hover:text-blue-400 
                           transition-colors duration-200 truncate">
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
            
            {variant === "default" && (
              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// Search Suggestions Component
const SearchSuggestions = ({ 
  suggestions, 
  showResults, 
  isSearchFocused, 
  handleSuggestionClick, 
  variant = "default" 
}) => {
  if (suggestions.length === 0 || showResults || !isSearchFocused) return null;

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

  const containerClasses = variant === "mobile" || variant === "navbar"
    ? "border-t border-gray-200/30 dark:border-gray-700/30"
    : "absolute top-full left-0 right-0 mt-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/30 dark:border-gray-700/30 z-50";

  return (
    <div className={containerClasses}>
      <div className="p-3 border-b border-gray-200/30 dark:border-gray-700/30">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          Quick Suggestions
        </h3>
      </div>
      
      <div className={variant === "mobile" || variant === "navbar" ? "max-h-48 overflow-y-auto" : "py-2"}>
        {suggestions.map((suggestion, index) => (
          <button
            key={`suggestion-${index}`}
            onClick={() => handleSuggestionClick(suggestion)}
            className={`
              w-full flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 
              transition-all duration-200 group
              ${variant === "mobile" || variant === "navbar" ? "p-3" : "p-3"}
            `}
          >
            <div className="flex-shrink-0 mt-1">
              {getResultIcon(suggestion.type)}
            </div>
            
            <div className="flex-1 text-left min-w-0">
              <div className="text-sm font-medium text-gray-900 dark:text-white 
                           group-hover:text-blue-600 dark:group-hover:text-blue-400 
                           transition-colors duration-200 truncate">
                {suggestion.text}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                {suggestion.subtitle}
              </div>
            </div>
            
            {variant === "default" && (
              <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

// No Results Component
const NoResults = ({ showResults, searchResults, isLoading, variant = "default" }) => {
  if (!showResults || searchResults.length > 0 || isLoading) return null;

  const containerClasses = variant === "mobile" || variant === "navbar"
    ? "p-6 text-center border-t border-gray-200/30 dark:border-gray-700/30"
    : "absolute top-full left-0 right-0 mt-3 bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-gray-200/30 dark:border-gray-700/30 z-50 p-6 text-center";

  return (
    <div className={containerClasses}>
      <Search className={`${variant === "mobile" || variant === "navbar" ? "h-8 w-8" : "h-12 w-12"} text-gray-300 mx-auto mb-2`} />
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
        No results found
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Try adjusting your search terms or filters
      </p>
    </div>
  );
};

const SearchBar = ({ 
  placeholder = "Search across all records...",
  className = "",
  showFilters = true,
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
        if (variant === "mobile" || variant === "navbar") {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [variant]);

  // Close search results on route change
  useEffect(() => {
    setShowResults(false);
    setIsSearchFocused(false);
    if (variant === "mobile" || variant === "navbar") {
      setIsExpanded(false);
    }
  }, [location.pathname, variant]);

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
    if (variant === "mobile" || variant === "navbar") {
      setIsExpanded(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    navigate(suggestion.href);
    setSuggestions([]);
    setSearchQuery('');
    setShowResults(false);
    setIsSearchFocused(false);
    if (variant === "mobile" || variant === "navbar") {
      setIsExpanded(false);
    }
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

  const toggleSearch = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  // Mobile/Navbar variant with dropdown animation
  if (variant === "mobile" || variant === "navbar") {
    return (
      <div className={`relative ${className}`} ref={searchRef}>
        {/* Search Button - Always visible */}
        <MobileSearchButton 
          onClick={toggleSearch} 
          variant={variant}
        />

        {/* Dropdown Search Panel */}
        <div className={`
          absolute top-full right-0 mt-3 w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl 
          rounded-3xl shadow-2xl border border-gray-200/30 dark:border-gray-700/30 z-50
          transform transition-all duration-500 ease-out
          ${isExpanded 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
          }
        `}>
          {/* Search Input */}
          <div className="p-4">
            <SearchInput
              inputRef={inputRef}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onFocus={() => setIsSearchFocused(true)}
              placeholder={placeholder}
              onClear={clearSearch}
              onSubmit={handleSearch}
              isLoading={isLoading}
              variant={variant}
              compact={compact}
            />
          </div>

          {/* Filter Options */}
          <FilterOptions
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            showFilters={showFilters}
            userRole={userRole}
            variant={variant}
          />

          {/* Search Results */}
          <SearchResults
            searchResults={searchResults}
            showResults={showResults}
            selectedFilter={selectedFilter}
            handleResultClick={handleResultClick}
            variant={variant}
          />

          {/* Search Suggestions */}
          <SearchSuggestions
            suggestions={suggestions}
            showResults={showResults}
            isSearchFocused={isSearchFocused}
            handleSuggestionClick={handleSuggestionClick}
            variant={variant}
          />

          {/* No Results Message */}
          <NoResults
            showResults={showResults}
            searchResults={searchResults}
            isLoading={isLoading}
            variant={variant}
          />
        </div>
      </div>
    );
  }

  // Default variant (existing functionality)
  return (
    <div className={`relative ${className}`} ref={searchRef}>
      {/* Search Input */}
      <SearchInput
        inputRef={inputRef}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onFocus={() => setIsSearchFocused(true)}
        placeholder={placeholder}
        onClear={clearSearch}
        onSubmit={handleSearch}
        isLoading={isLoading}
        variant={variant}
        compact={compact}
      />

      {/* Filter Options */}
      <FilterOptions
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        showFilters={showFilters}
        userRole={userRole}
        variant={variant}
      />

      {/* Search Results Dropdown */}
      <SearchResults
        searchResults={searchResults}
        showResults={showResults}
        selectedFilter={selectedFilter}
        handleResultClick={handleResultClick}
        variant={variant}
      />

      {/* Search Suggestions Dropdown */}
      <SearchSuggestions
        suggestions={suggestions}
        showResults={showResults}
        isSearchFocused={isSearchFocused}
        handleSuggestionClick={handleSuggestionClick}
        variant={variant}
      />

      {/* No Results Message */}
      <NoResults
        showResults={showResults}
        searchResults={searchResults}
        isLoading={isLoading}
        variant={variant}
      />
    </div>
  );
};

export default SearchBar; 