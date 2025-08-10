import React, { useState } from 'react';
import { Calendar, X } from 'lucide-react';
import BaseFilter from './BaseFilter';

const DateRangeFilter = ({ 
  startDate, 
  endDate, 
  onDateChange, 
  showFilters = true, 
  variant = "default",
  className = "",
  showLabel = true,
  labelText = "Date Range",
  disabled = false,
  presets = null
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const defaultPresets = presets || [
    { label: 'Today', value: 'today' },
    { label: 'Last 7 days', value: '7days' },
    { label: 'Last 30 days', value: '30days' },
    { label: 'This month', value: 'month' },
    { label: 'Last month', value: 'lastMonth' },
    { label: 'This year', value: 'year' }
  ];

  const handlePresetClick = (preset) => {
    const now = new Date();
    let start, end;

    switch (preset.value) {
      case 'today':
        start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
        break;
      case '7days':
        start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        end = now;
        break;
      case '30days':
        start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        end = now;
        break;
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth(), 1);
        end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
        break;
      case 'lastMonth':
        start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        break;
      case 'year':
        start = new Date(now.getFullYear(), 0, 1);
        end = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
        break;
      default:
        return;
    }

    onDateChange(start, end);
    setIsOpen(false);
  };

  const handleCustomDateChange = (type, value) => {
    if (type === 'start') {
      onDateChange(new Date(value), endDate);
    } else {
      onDateChange(startDate, new Date(value));
    }
  };

  const clearDates = () => {
    onDateChange(null, null);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toISOString().split('T')[0];
  };

  const hasActiveFilter = startDate || endDate;

  return (
    <BaseFilter
      variant={variant}
      showFilters={showFilters}
      showLabel={showLabel}
      labelText={labelText}
      className={className}
    >
      {/* Date Range Display */}
      {hasActiveFilter && (
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {startDate && endDate 
              ? `${formatDate(startDate)} to ${formatDate(endDate)}`
              : startDate 
                ? `From ${formatDate(startDate)}`
                : `Until ${formatDate(endDate)}`
            }
          </span>
          <button
            onClick={clearDates}
            className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            title="Clear dates"
          >
            <X className="h-3 w-3 text-gray-400" />
          </button>
        </div>
      )}

      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-2">
        {defaultPresets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => handlePresetClick(preset)}
            disabled={disabled}
            className={`
              flex items-center space-x-2 px-2 py-1 rounded-xl text-xs font-medium transition-all duration-300
              ${variant === "mobile" || variant === "navbar" ? "px-2 py-1" : "px-3 py-1.5"}
              ${disabled 
                ? 'opacity-50 cursor-not-allowed' 
                : 'cursor-pointer hover:scale-105 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }
            `}
          >
            <Calendar className="h-3 w-3" />
            <span>{preset.label}</span>
          </button>
        ))}
      </div>

      {/* Custom Date Inputs */}
      <div className="flex flex-wrap gap-2 mt-2">
        <input
          type="date"
          value={formatDate(startDate)}
          onChange={(e) => handleCustomDateChange('start', e.target.value)}
          disabled={disabled}
          className={`
            px-2 py-1 rounded-lg text-xs border border-gray-200 dark:border-gray-600 
            bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
        <span className="text-xs text-gray-400 self-center">to</span>
        <input
          type="date"
          value={formatDate(endDate)}
          onChange={(e) => handleCustomDateChange('end', e.target.value)}
          disabled={disabled}
          className={`
            px-2 py-1 rounded-lg text-xs border border-gray-200 dark:border-gray-600 
            bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
      </div>
    </BaseFilter>
  );
};

export default DateRangeFilter; 