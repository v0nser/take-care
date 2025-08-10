import React from 'react';
import { Search, User, Calendar, FileText, CreditCard, Activity } from 'lucide-react';
import BaseFilter from './BaseFilter';
import FilterOption from './FilterOption';

const SearchFilter = ({ 
  selectedFilter, 
  setSelectedFilter, 
  showFilters = true, 
  userRole = 'patient',
  variant = "default",
  className = "",
  showLabel = true,
  labelText = "Search Filters",
  disabled = false,
  counts = null,
  customOptions = null
}) => {
  const getDefaultFilterOptions = () => {
    const baseOptions = [
      { value: 'all', label: 'All', icon: Search },
      { value: 'users', label: 'Users', icon: User },
      { value: 'appointments', label: 'Appointments', icon: Calendar },
      { value: 'medicalRecords', label: 'Medical Records', icon: FileText },
      { value: 'payments', label: 'Payments', icon: CreditCard }
    ];

    if (userRole === 'admin') {
      baseOptions.push({ value: 'activityLogs', label: 'Activity Logs', icon: Activity });
    }

    return baseOptions;
  };

  const filterOptions = customOptions || getDefaultFilterOptions();

  const handleFilterChange = (filterValue) => {
    if (setSelectedFilter && !disabled) {
      setSelectedFilter(filterValue);
    }
  };

  return (
    <BaseFilter
      variant={variant}
      showFilters={showFilters}
      showLabel={showLabel}
      labelText={labelText}
      className={className}
    >
      {filterOptions.map((option) => {
        const count = counts?.[option.value];
        const isSelected = selectedFilter === option.value;
        
        return (
          <FilterOption
            key={option.value}
            value={option.value}
            label={option.label}
            icon={option.icon}
            isSelected={isSelected}
            onClick={handleFilterChange}
            variant={variant}
            disabled={disabled}
            count={count}
            badge={option.badge}
          />
        );
      })}
    </BaseFilter>
  );
};

export default SearchFilter; 