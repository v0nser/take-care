import React from 'react';
import SearchBar from './SearchBar';
import MobileSearchBar from './MobileSearchBar';
import CompactSearchBar from './CompactSearchBar';
import useResponsiveSearch from '../../hooks/useResponsiveSearch';

const ResponsiveSearchBar = ({ 
  placeholder = "Search across all records...",
  className = "",
  showFilters = true,
  onSearch = null,
  compact = false,
  forceVariant = null, // Override automatic detection
  mobileVariant = "fullscreen", // "fullscreen", "overlay"
  ...props 
}) => {
  const { 
    searchVariant, 
    isMobile, 
    isTablet, 
    getSearchProps,
    shouldUseMobileSearch 
  } = useResponsiveSearch();

  // Use forced variant if provided, otherwise use detected variant
  const finalVariant = forceVariant || searchVariant;

  // Determine which component to render
  const shouldRenderMobileSearch = shouldUseMobileSearch || finalVariant === 'mobile';
  const shouldRenderCompactSearch = isMobile || isTablet || compact;

  // Get optimized props for the current screen size
  const searchProps = getSearchProps({
    placeholder,
    className,
    showFilters,
    onSearch,
    compact: shouldRenderCompactSearch,
    ...props
  });

  // Render CompactSearchBar for small screens (better mobile experience)
  if (shouldRenderMobileSearch) {
    return (
      <CompactSearchBar
        {...searchProps}
        variant="mobile"
        className={`${className} mobile-search`}
      />
    );
  }

  // Render regular SearchBar for larger screens
  return (
    <SearchBar
      {...searchProps}
      variant={finalVariant}
      className={`${className} desktop-search`}
    />
  );
};

export default ResponsiveSearchBar; 