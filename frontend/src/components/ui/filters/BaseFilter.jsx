import React from 'react';
import { Filter } from 'lucide-react';

const BaseFilter = ({ 
  children, 
  className = "", 
  variant = "default",
  showFilters = true,
  showLabel = true,
  labelText = "Filters"
}) => {
  if (!showFilters) return null;

  return (
    <div className={`
      ${variant === "mobile" || variant === "navbar" ? "px-4 pb-4" : "flex items-center space-x-2 mt-3"}
      ${className}
    `}>
      {showLabel && (
        <div className={`
          ${variant === "mobile" || variant === "navbar" ? "flex items-center space-x-2 mb-3" : "flex items-center space-x-2"}
        `}>
          <Filter className="h-4 w-4 text-gray-400" />
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {variant === "mobile" || variant === "navbar" ? labelText : ""}
          </span>
        </div>
      )}
      <div className={`
        ${variant === "mobile" || variant === "navbar" ? "flex flex-wrap gap-2" : "flex flex-wrap gap-2"}
      `}>
        {children}
      </div>
    </div>
  );
};

export default BaseFilter; 