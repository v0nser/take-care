import React from 'react';
import { Search, X, Loader2 } from 'lucide-react';

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
      <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl border-2 border-gray-200/50 dark:border-gray-600/50 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:border-blue-300/50 dark:group-hover:border-blue-600/50 group-focus-within:border-blue-400 dark:group-focus-within:border-blue-500 min-w-[400px] lg:min-w-[500px] md:min-w-[400px] sm:min-w-[300px] max-w-full">
        
        {/* Search icon with animation */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
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
            w-full pl-12 pr-32 py-3 bg-transparent border-none outline-none
            text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400
            text-sm font-medium tracking-wide
            transition-all duration-300
            focus:outline-none focus:ring-0
            ${compact ? 'py-2 text-xs' : 'py-3 text-sm'}
          `}
        />
        
        {/* Clear button with enhanced styling */}
        {searchQuery && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className="absolute right-28 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-300 hover:scale-110 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 group/clear focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <X className="h-4 w-4 group-hover/clear:rotate-90 transition-transform duration-300" />
          </button>
        )}
        
        {/* Loading indicator with animation */}
        {isLoading && (
          <div className="absolute right-28 top-1/2 transform -translate-y-1/2" aria-label="Searching...">
            <div className="relative">
              <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-sm animate-pulse"></div>
            </div>
          </div>
        )}
        
        {/* Enhanced search button */}
        <button
          type="submit"
          aria-label="Submit search"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white rounded-2xl font-semibold text-xs shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group/btn focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <span className="flex items-center space-x-1">
            <Search className="h-3 w-3 group-hover/btn:scale-110 transition-transform duration-300" />
            <span>Search</span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
        </button>
      </div>
    </div>
    <div id="search-description" className="sr-only">Search across all records and data</div>
  </form>
);

export default SearchInput; 