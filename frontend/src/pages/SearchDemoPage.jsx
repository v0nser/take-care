import React, { useState } from 'react';
import { Search, Smartphone, Monitor, Tablet } from 'lucide-react';
import ResponsiveSearchBar from '../components/ui/ResponsiveSearchBar';
import SearchBar from '../components/ui/SearchBar';
import MobileSearchBar from '../components/ui/MobileSearchBar';
import useResponsiveSearch from '../hooks/useResponsiveSearch';

const SearchDemoPage = () => {
  const [selectedVariant, setSelectedVariant] = useState('auto');
  const [searchQuery, setSearchQuery] = useState('');
  const { isMobile, isTablet, searchVariant, screenSize } = useResponsiveSearch();

  const handleSearch = (query) => {
    setSearchQuery(query);
    console.log('Search performed:', query);
  };

  const variants = [
    { value: 'auto', label: 'Auto Detect', icon: Monitor, description: 'Automatically adapts to screen size' },
    { value: 'default', label: 'Desktop', icon: Monitor, description: 'Full-featured desktop search' },
    { value: 'navbar', label: 'Navbar', icon: Tablet, description: 'Compact navbar search' },
    { value: 'mobile', label: 'Mobile', icon: Smartphone, description: 'Mobile-optimized search' }
  ];

  const mobileVariants = [
    { value: 'fullscreen', label: 'Fullscreen', description: 'Takes over the entire screen' },
    { value: 'overlay', label: 'Overlay', description: 'Overlays on top of content' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 bg-clip-text text-transparent mb-4">
            Search Component Demo
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Explore the responsive search components that automatically adapt to different screen sizes
          </p>
        </div>

        {/* Screen Size Info */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 mb-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Current Screen Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-2xl">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{screenSize.width}px</div>
              <div className="text-sm text-blue-600 dark:text-blue-400">Width</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-2xl">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{screenSize.height}px</div>
              <div className="text-sm text-purple-600 dark:text-purple-400">Height</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-2xl">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">Detected</div>
            </div>
          </div>
        </div>

        {/* Variant Selection */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 mb-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Search Variant</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {variants.map((variant) => (
              <button
                key={variant.value}
                onClick={() => setSelectedVariant(variant.value)}
                className={`
                  p-4 rounded-2xl border-2 transition-all duration-300 text-left group
                  ${selectedVariant === variant.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 shadow-lg'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }
                `}
              >
                <div className="flex items-center space-x-3 mb-2">
                  <variant.icon className={`
                    h-6 w-6 transition-colors duration-300
                    ${selectedVariant === variant.value
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400'
                    }
                  `} />
                  <span className={`
                    font-semibold transition-colors duration-300
                    ${selectedVariant === variant.value
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400'
                    }
                  `}>
                    {variant.label}
                  </span>
                </div>
                <p className={`
                  text-sm transition-colors duration-300
                  ${selectedVariant === variant.value
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
                  }
                `}>
                  {variant.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Search Component Demo */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Search Component</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              ResponsiveSearchBar (Auto-detect)
            </h3>
            <ResponsiveSearchBar
              placeholder="Search across all records..."
              showFilters={true}
              onSearch={handleSearch}
              className="mb-4"
            />
          </div>

          {selectedVariant !== 'auto' && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {variants.find(v => v.value === selectedVariant)?.label} Variant
              </h3>
              <SearchBar
                placeholder="Search across all records..."
                showFilters={true}
                variant={selectedVariant}
                onSearch={handleSearch}
                className="mb-4"
              />
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Mobile Search Variants
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Fullscreen</h4>
                <MobileSearchBar
                  placeholder="Fullscreen search..."
                  variant="fullscreen"
                  onSearch={handleSearch}
                />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Overlay</h4>
                <MobileSearchBar
                  placeholder="Overlay search..."
                  variant="overlay"
                  onSearch={handleSearch}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Search Results</h2>
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-2xl p-4">
              <div className="flex items-center space-x-3">
                <Search className="h-6 w-6 text-blue-500" />
                <div>
                  <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                    Search performed successfully!
                  </p>
                  <p className="text-blue-700 dark:text-blue-200">
                    Query: "{searchQuery}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Usage Instructions */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Usage Instructions</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">ResponsiveSearchBar (Recommended)</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Automatically switches between SearchBar and MobileSearchBar based on screen size.
              </p>
              <code className="text-sm bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                &lt;ResponsiveSearchBar placeholder="Search..." /&gt;
              </code>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Manual Variant Selection</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Force a specific variant regardless of screen size.
              </p>
              <code className="text-sm bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                &lt;SearchBar variant="mobile" /&gt;
              </code>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Mobile-First Search</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Use MobileSearchBar for touch-optimized mobile experiences.
              </p>
              <code className="text-sm bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                &lt;MobileSearchBar variant="fullscreen" /&gt;
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchDemoPage; 