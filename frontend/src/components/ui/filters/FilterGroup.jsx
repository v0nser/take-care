import React, { useState } from 'react';
import { Filter, ChevronDown, ChevronUp, X } from 'lucide-react';

const FilterGroup = ({ 
  children, 
  title = "Filters",
  variant = "default",
  className = "",
  collapsible = true,
  defaultCollapsed = false,
  showClearAll = true,
  onClearAll = null,
  activeFilterCount = 0,
  maxHeight = null
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const handleClearAll = () => {
    if (onClearAll) {
      onClearAll();
    }
  };

  const toggleCollapse = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const containerClasses = `
    ${variant === "mobile" || variant === "navbar" ? "px-4 pb-4" : "mb-4"}
    ${className}
  `;

  const headerClasses = `
    flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 
    border border-gray-200/30 dark:border-gray-700/30 cursor-pointer
    ${collapsible ? 'hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors duration-200' : ''}
  `;

  const contentClasses = `
    ${isCollapsed ? 'hidden' : ''}
    ${variant === "mobile" || variant === "navbar" ? 'pt-3' : 'pt-3'}
  `;

  const contentStyle = maxHeight && !isCollapsed ? { maxHeight: maxHeight, overflowY: 'auto' } : {};

  return (
    <div className={containerClasses}>
      {/* Filter Group Header */}
      <div className={headerClasses} onClick={toggleCollapse}>
        <div className="flex items-center space-x-3">
          <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="font-medium text-gray-700 dark:text-gray-300">{title}</span>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
              {activeFilterCount}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {showClearAll && activeFilterCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClearAll();
              }}
              className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
              title="Clear all filters"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
            </button>
          )}
          
          {collapsible && (
            <div className="p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
              {isCollapsed ? (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Filter Group Content */}
      <div className={contentClasses} style={contentStyle}>
        {children}
      </div>
    </div>
  );
};

export default FilterGroup; 