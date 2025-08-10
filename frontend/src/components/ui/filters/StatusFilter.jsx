import React from 'react';
import { CheckCircle, Clock, XCircle, AlertCircle, Pause, Play } from 'lucide-react';
import BaseFilter from './BaseFilter';
import FilterOption from './FilterOption';

const StatusFilter = ({ 
  selectedStatus, 
  setSelectedStatus, 
  showFilters = true, 
  variant = "default",
  className = "",
  showLabel = true,
  labelText = "Status",
  disabled = false,
  counts = null,
  customStatuses = null,
  multiSelect = false,
  selectedStatuses = []
}) => {
  const getDefaultStatuses = () => {
    return customStatuses || [
      { value: 'all', label: 'All', icon: CheckCircle, color: 'gray' },
      { value: 'active', label: 'Active', icon: CheckCircle, color: 'green' },
      { value: 'pending', label: 'Pending', icon: Clock, color: 'yellow' },
      { value: 'completed', label: 'Completed', icon: CheckCircle, color: 'blue' },
      { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'red' },
      { value: 'on-hold', label: 'On Hold', icon: Pause, color: 'orange' },
      { value: 'in-progress', label: 'In Progress', icon: Play, color: 'purple' }
    ];
  };

  const statuses = getDefaultStatuses();

  const handleStatusChange = (statusValue) => {
    if (setSelectedStatus && !disabled) {
      if (multiSelect) {
        // Handle multi-select
        if (statusValue === 'all') {
          setSelectedStatus(['all']);
        } else {
          const current = selectedStatuses.includes('all') ? [] : [...selectedStatuses];
          if (current.includes(statusValue)) {
            const filtered = current.filter(s => s !== statusValue);
            setSelectedStatus(filtered.length === 0 ? ['all'] : filtered);
          } else {
            setSelectedStatus([...current, statusValue]);
          }
        }
      } else {
        // Handle single select
        setSelectedStatus(statusValue);
      }
    }
  };

  const isStatusSelected = (statusValue) => {
    if (multiSelect) {
      return selectedStatuses.includes(statusValue) || 
             (selectedStatuses.length === 0 && statusValue === 'all') ||
             (selectedStatuses.includes('all') && statusValue === 'all');
    }
    return selectedStatus === statusValue;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      green: 'text-green-500',
      yellow: 'text-yellow-500',
      blue: 'text-blue-500',
      red: 'text-red-500',
      orange: 'text-orange-500',
      purple: 'text-purple-500',
      gray: 'text-gray-500'
    };
    return colorMap[status.color] || 'text-gray-500';
  };

  return (
    <BaseFilter
      variant={variant}
      showFilters={showFilters}
      showLabel={showLabel}
      labelText={labelText}
      className={className}
    >
      {statuses.map((status) => {
        const count = counts?.[status.value];
        const isSelected = isStatusSelected(status.value);
        
        return (
          <FilterOption
            key={status.value}
            value={status.value}
            label={status.label}
            icon={status.icon}
            isSelected={isSelected}
            onClick={handleStatusChange}
            variant={variant}
            disabled={disabled}
            count={count}
            className={getStatusColor(status)}
          />
        );
      })}
    </BaseFilter>
  );
};

export default StatusFilter; 