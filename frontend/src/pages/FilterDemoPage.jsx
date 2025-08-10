import React, { useState } from 'react';
import { Search, Filter, Calendar, CheckCircle } from 'lucide-react';
import { 
  BaseFilter, 
  FilterOption, 
  SearchFilter, 
  DateRangeFilter, 
  StatusFilter, 
  FilterGroup,
  FILTER_VARIANTS 
} from '../components/ui/filters';

const FilterDemoPage = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedStatuses, setSelectedStatuses] = useState(['all']);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [activeFilters, setActiveFilters] = useState(0);

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
    updateActiveFilters();
  };

  const updateActiveFilters = () => {
    let count = 0;
    if (selectedFilter !== 'all') count++;
    if (selectedStatus !== 'all') count++;
    if (startDate || endDate) count++;
    if (selectedStatuses.length > 0 && !selectedStatuses.includes('all')) count++;
    setActiveFilters(count);
  };

  const clearAllFilters = () => {
    setSelectedFilter('all');
    setSelectedStatus('all');
    setSelectedStatuses(['all']);
    setStartDate(null);
    setEndDate(null);
    setActiveFilters(0);
  };

  // Update active filters when selections change
  React.useEffect(() => {
    updateActiveFilters();
  }, [selectedFilter, selectedStatus, selectedStatuses, startDate, endDate]);

  const customFilterOptions = [
    { value: 'custom1', label: 'Custom Option 1', icon: Search, badge: { text: 'New', variant: 'success' } },
    { value: 'custom2', label: 'Custom Option 2', icon: Filter, count: 5 },
    { value: 'custom3', label: 'Custom Option 3', icon: Calendar, badge: { text: 'Hot', variant: 'warning' } }
  ];

  const customStatuses = [
    { value: 'all', label: 'All', icon: CheckCircle, color: 'gray' },
    { value: 'urgent', label: 'Urgent', icon: CheckCircle, color: 'red' },
    { value: 'normal', label: 'Normal', icon: CheckCircle, color: 'blue' },
    { value: 'low', label: 'Low Priority', icon: CheckCircle, color: 'green' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Modular Filter Components
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Explore the different filter components and their variants
          </p>
        </div>

        {/* Filter Variants */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Default Variant */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Default Variant
            </h2>
            <SearchFilter
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              variant="default"
              showLabel={true}
            />
          </div>

          {/* Mobile Variant */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Mobile Variant
            </h2>
            <SearchFilter
              selectedFilter={selectedFilter}
              setSelectedFilter={setSelectedFilter}
              variant="mobile"
              showLabel={true}
            />
          </div>
        </div>

        {/* Advanced Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Date Range Filter */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Date Range Filter
            </h2>
            <DateRangeFilter
              startDate={startDate}
              endDate={endDate}
              onDateChange={handleDateChange}
              variant="default"
              showLabel={true}
            />
          </div>

          {/* Status Filter */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Status Filter
            </h2>
            <StatusFilter
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
              variant="default"
              showLabel={true}
            />
          </div>
        </div>

        {/* Multi-Select Status Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Multi-Select Status Filter
          </h2>
          <StatusFilter
            selectedStatus={null}
            setSelectedStatus={null}
            selectedStatuses={selectedStatuses}
            setSelectedStatus={setSelectedStatuses}
            multiSelect={true}
            variant="default"
            showLabel={true}
            customStatuses={customStatuses}
          />
        </div>

        {/* Filter Groups */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Filter Groups
          </h2>
          <FilterGroup
            title="Search & Filters"
            variant="default"
            activeFilterCount={activeFilters}
            onClearAll={clearAllFilters}
            collapsible={true}
            defaultCollapsed={false}
          >
            <div className="space-y-6">
              <SearchFilter
                selectedFilter={selectedFilter}
                setSelectedFilter={setSelectedFilter}
                variant="default"
                showLabel={true}
                labelText="Search Type"
              />
              
              <DateRangeFilter
                startDate={startDate}
                endDate={endDate}
                onDateChange={handleDateChange}
                variant="default"
                showLabel={true}
                labelText="Date Range"
              />
              
              <StatusFilter
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                variant="default"
                showLabel={true}
                labelText="Status"
              />
            </div>
          </FilterGroup>
        </div>

        {/* Custom Filter Options */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Custom Filter Options
          </h2>
          <BaseFilter variant="default" showLabel={true} labelText="Custom Options">
            {customFilterOptions.map((option) => (
              <FilterOption
                key={option.value}
                value={option.value}
                label={option.label}
                icon={option.icon}
                isSelected={false}
                onClick={() => {}}
                variant="default"
                count={option.count}
                badge={option.badge}
              />
            ))}
          </BaseFilter>
        </div>

        {/* Current Filter State */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Current Filter State
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Selected Filter:</strong> {selectedFilter}
            </div>
            <div>
              <strong>Selected Status:</strong> {selectedStatus}
            </div>
            <div>
              <strong>Selected Statuses:</strong> {selectedStatuses.join(', ')}
            </div>
            <div>
              <strong>Date Range:</strong> {startDate ? startDate.toLocaleDateString() : 'None'} - {endDate ? endDate.toLocaleDateString() : 'None'}
            </div>
            <div>
              <strong>Active Filters:</strong> {activeFilters}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterDemoPage; 