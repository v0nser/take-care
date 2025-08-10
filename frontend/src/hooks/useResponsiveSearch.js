import { useState, useEffect } from 'react';

const useResponsiveSearch = () => {
  const [searchVariant, setSearchVariant] = useState('default');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      
      if (width < 640) { // sm breakpoint
        setIsMobile(true);
        setIsTablet(false);
        setSearchVariant('mobile');
      } else if (width < 1024) { // lg breakpoint
        setIsMobile(false);
        setIsTablet(true);
        setSearchVariant('navbar');
      } else {
        setIsMobile(false);
        setIsTablet(false);
        setSearchVariant('default');
      }
    };

    // Check on mount
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const getSearchProps = (props = {}) => {
    const baseProps = {
      variant: searchVariant,
      compact: isMobile || isTablet,
      ...props
    };

    // Mobile-specific optimizations
    if (isMobile) {
      baseProps.showFilters = props.showFilters !== false; // Default to true on mobile
      baseProps.placeholder = props.placeholder || "Search...";
    }

    // Tablet-specific optimizations
    if (isTablet) {
      baseProps.showFilters = props.showFilters !== false;
      baseProps.compact = true;
    }

    return baseProps;
  };

  return {
    searchVariant,
    isMobile,
    isTablet,
    getSearchProps,
    // Convenience methods
    shouldUseMobileSearch: isMobile,
    shouldUseCompactSearch: isMobile || isTablet,
    // Screen size helpers
    screenSize: {
      width: typeof window !== 'undefined' ? window.innerWidth : 0,
      height: typeof window !== 'undefined' ? window.innerHeight : 0,
    }
  };
};

export default useResponsiveSearch; 