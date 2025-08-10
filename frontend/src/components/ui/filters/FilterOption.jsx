import React from 'react';

const FilterOption = ({ 
  value, 
  label, 
  icon: Icon, 
  isSelected = false, 
  onClick, 
  variant = "default",
  className = "",
  disabled = false,
  count = null,
  badge = null
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick(value);
    }
  };

  const baseClasses = `
    flex items-center space-x-2 px-2 py-1 rounded-xl text-xs font-medium transition-all duration-300
    ${variant === "mobile" || variant === "navbar" ? "px-2 py-1" : "px-3 py-1.5"}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
  `;

  const selectedClasses = isSelected
    ? 'bg-blue-500 text-white shadow-lg'
    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600';

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${selectedClasses}
        ${className}
      `}
      title={label}
    >
      {Icon && <Icon className="h-3 w-3" />}
      <span>{label}</span>
      
      {/* Optional count badge */}
      {count !== null && (
        <span className={`
          ml-1 px-1.5 py-0.5 rounded-full text-xs font-medium
          ${isSelected 
            ? 'bg-white/20 text-white' 
            : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
          }
        `}>
          {count}
        </span>
      )}
      
      {/* Optional custom badge */}
      {badge && (
        <span className={`
          ml-1 px-1.5 py-0.5 rounded-full text-xs font-medium
          ${badge.variant === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
            badge.variant === 'warning' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
            badge.variant === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
            'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          }
        `}>
          {badge.text}
        </span>
      )}
    </button>
  );
};

export default FilterOption; 