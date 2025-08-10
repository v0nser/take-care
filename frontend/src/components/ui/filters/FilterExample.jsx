import React, { useState } from 'react';
import { SearchFilter, DateRangeFilter, StatusFilter, FilterGroup } from './index';

const FilterExample = ({ 
  variant = "default",
  showLabels = true,
  className = ""
}) => {
  const [filters, setFilters] = useState({
    searchType: 'all',
    dateRange: { start: null, end: null },
    status: 'all',
    statuses: ['all']
  });

  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchTypeChange = (value) => {
    setFilters(prev => ({ ...prev, searchType: value }));
  };

  const handleDateChange = (start, end) => {
    setFilters(prev => ({ ...prev, dateRange: { start, end } }));
  };

  const handleStatusChange = (value) => {
    setFilters(prev => ({ ...prev, status: value }));
  };

  const handleStatusesChange = (values) => {
    setFilters(prev => ({ ...prev, statuses: values }));
  };

  const clearAllFilters = () => {
    setFilters({
      searchType: 'all',
      dateRange: { start: null, end: null },
      status: 'all',
      statuses: ['all']
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.searchType !== 'all') count++;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.status !== 'all') count++;
    if (filters.statuses.length > 0 && !filters.statuses.includes('all')) count++;
    return count;
  };

  const performSearch = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockResults = [
        { id: 1, type: 'user', name: 'John Doe', status: 'active', date: '2024-01-15' },
        { id: 2, type: 'appointment', name: 'Checkup', status: 'pending', date: '2024-01-20' },
        { id: 3, type: 'medicalRecord', name: 'Blood Test', status: 'completed', date: '2024-01-10' }
      ];
      
      setResults(mockResults);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Filter Group */}
      <FilterGroup
        title="Search & Filters"
        variant={variant}
        activeFilterCount={getActiveFilterCount()}
        onClearAll={clearAllFilters}
        collapsible={true}
        defaultCollapsed={false}
      >
        <div className="space-y-4">
          {/* Search Type Filter */}
          <SearchFilter
            selectedFilter={filters.searchType}
            setSelectedFilter={handleSearchTypeChange}
            userRole="admin"
            variant={variant}
            showLabel={showLabels}
            labelText="Search Type"
          />

          {/* Date Range Filter */}
          <DateRangeFilter
            startDate={filters.dateRange.start}
            endDate={filters.dateRange.end}
            onDateChange={handleDateChange}
            variant={variant}
            showLabel={showLabels}
            labelText="Date Range"
          />

          {/* Status Filter */}
          <StatusFilter
            selectedStatus={filters.status}
            setSelectedStatus={handleStatusChange}
            variant={variant}
            showLabel={showLabels}
            labelText="Status"
          />

          {/* Multi-Select Status Filter */}
          <StatusFilter
            selectedStatuses={filters.statuses}
            setSelectedStatus={handleStatusesChange}
            multiSelect={true}
            variant={variant}
            showLabel={showLabels}
            labelText="Multiple Statuses"
          />
        </div>
      </FilterGroup>

      {/* Search Button */}
      <div className="flex justify-center">
        <button
          onClick={performSearch}
          disabled={isLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? 'Searching...' : 'Search with Filters'}
        </button>
      </div>

      {/* Current Filter State */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Current Filter State
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400">
          <div><strong>Search Type:</strong> {filters.searchType}</div>
          <div><strong>Status:</strong> {filters.status}</div>
          <div><strong>Statuses:</strong> {filters.statuses.join(', ')}</div>
          <div>
            <strong>Date Range:</strong> {
              filters.dateRange.start && filters.dateRange.end
                ? `${filters.dateRange.start.toLocaleDateString()} - ${filters.dateRange.end.toLocaleDateString()}`
                : 'None'
            }
          </div>
          <div><strong>Active Filters:</strong> {getActiveFilterCount()}</div>
          <div><strong>Results:</strong> {results.length}</div>
        </div>
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Search Results ({results.length})
          </h3>
          <div className="space-y-2">
            {results.map((result) => (
              <div
                key={result.id}
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {result.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Type: {result.type} | Status: {result.status}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {result.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterExample; 