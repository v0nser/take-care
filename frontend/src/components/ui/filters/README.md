# Modular Filter Components

This directory contains a comprehensive set of modular, reusable filter components that provide consistent filtering functionality across the application.

## Components Overview

### 1. BaseFilter
The foundation component that provides the basic filter structure and styling.

**Props:**
- `children` - Filter content
- `className` - Additional CSS classes
- `variant` - Filter variant ("default", "mobile", "navbar")
- `showFilters` - Whether to show the filter (default: true)
- `showLabel` - Whether to show the filter label (default: true)
- `labelText` - Custom label text (default: "Filters")

**Usage:**
```jsx
import { BaseFilter } from './filters';

<BaseFilter variant="default" showLabel={true} labelText="Custom Filters">
  {/* Filter content goes here */}
</BaseFilter>
```

### 2. FilterOption
A reusable filter option button with support for icons, counts, and badges.

**Props:**
- `value` - Filter option value
- `label` - Display label
- `icon` - Lucide React icon component
- `isSelected` - Whether the option is selected
- `onClick` - Click handler function
- `variant` - Filter variant
- `className` - Additional CSS classes
- `disabled` - Whether the option is disabled
- `count` - Optional count badge
- `badge` - Optional custom badge object

**Usage:**
```jsx
import { FilterOption } from './filters';
import { Search } from 'lucide-react';

<FilterOption
  value="search"
  label="Search"
  icon={Search}
  isSelected={true}
  onClick={handleFilterChange}
  count={5}
  badge={{ text: "New", variant: "success" }}
/>
```

### 3. SearchFilter
A complete search filter component with predefined search type options.

**Props:**
- `selectedFilter` - Currently selected filter value
- `setSelectedFilter` - Function to update selected filter
- `showFilters` - Whether to show filters (default: true)
- `userRole` - User role for role-based filter options
- `variant` - Filter variant
- `className` - Additional CSS classes
- `showLabel` - Whether to show label
- `labelText` - Custom label text
- `disabled` - Whether filters are disabled
- `counts` - Object with counts for each filter option
- `customOptions` - Custom filter options array

**Usage:**
```jsx
import { SearchFilter } from './filters';

<SearchFilter
  selectedFilter={selectedFilter}
  setSelectedFilter={setSelectedFilter}
  userRole="admin"
  variant="default"
  showLabel={true}
/>
```

### 4. DateRangeFilter
A date range filter with preset options and custom date inputs.

**Props:**
- `startDate` - Start date value
- `endDate` - End date value
- `onDateChange` - Function called when dates change
- `showFilters` - Whether to show filters
- `variant` - Filter variant
- `className` - Additional CSS classes
- `showLabel` - Whether to show label
- `labelText` - Custom label text
- `disabled` - Whether filters are disabled
- `presets` - Custom date preset options

**Usage:**
```jsx
import { DateRangeFilter } from './filters';

<DateRangeFilter
  startDate={startDate}
  endDate={endDate}
  onDateChange={handleDateChange}
  variant="default"
  showLabel={true}
/>
```

### 5. StatusFilter
A status filter with support for single and multi-select modes.

**Props:**
- `selectedStatus` - Selected status value (single select)
- `setSelectedStatus` - Function to update selected status
- `selectedStatuses` - Array of selected statuses (multi-select)
- `showFilters` - Whether to show filters
- `variant` - Filter variant
- `className` - Additional CSS classes
- `showLabel` - Whether to show label
- `labelText` - Custom label text
- `disabled` - Whether filters are disabled
- `counts` - Object with counts for each status
- `customStatuses` - Custom status options
- `multiSelect` - Whether to enable multi-select mode

**Usage:**
```jsx
import { StatusFilter } from './filters';

// Single select
<StatusFilter
  selectedStatus={selectedStatus}
  setSelectedStatus={setSelectedStatus}
  variant="default"
/>

// Multi-select
<StatusFilter
  selectedStatuses={selectedStatuses}
  setSelectedStatus={setSelectedStatuses}
  multiSelect={true}
  variant="default"
/>
```

### 6. FilterGroup
A container component that groups multiple filters with collapsible functionality.

**Props:**
- `children` - Filter components to group
- `title` - Group title
- `variant` - Filter variant
- `className` - Additional CSS classes
- `collapsible` - Whether the group is collapsible
- `defaultCollapsed` - Whether the group starts collapsed
- `showClearAll` - Whether to show clear all button
- `onClearAll` - Function called when clear all is clicked
- `activeFilterCount` - Number of active filters
- `maxHeight` - Maximum height for scrollable content

**Usage:**
```jsx
import { FilterGroup } from './filters';

<FilterGroup
  title="Search & Filters"
  variant="default"
  activeFilterCount={3}
  onClearAll={clearAllFilters}
  collapsible={true}
  defaultCollapsed={false}
>
  <SearchFilter {...searchProps} />
  <DateRangeFilter {...dateProps} />
  <StatusFilter {...statusProps} />
</FilterGroup>
```

## Filter Variants

The components support different variants for responsive design:

- **`default`** - Standard desktop layout
- **`mobile`** - Mobile-optimized layout
- **`navbar`** - Compact navbar layout
- **`compact`** - Minimal space layout

## Customization

### Custom Filter Options
You can provide custom filter options to override the defaults:

```jsx
const customOptions = [
  { value: 'custom1', label: 'Custom 1', icon: Search },
  { value: 'custom2', label: 'Custom 2', icon: Filter, count: 5 },
  { value: 'custom3', label: 'Custom 3', icon: Calendar, badge: { text: "New", variant: "success" } }
];

<SearchFilter
  customOptions={customOptions}
  // ... other props
/>
```

### Custom Statuses
Define custom status options with colors:

```jsx
const customStatuses = [
  { value: 'urgent', label: 'Urgent', icon: AlertCircle, color: 'red' },
  { value: 'normal', label: 'Normal', icon: CheckCircle, color: 'blue' },
  { value: 'low', label: 'Low Priority', icon: Clock, color: 'green' }
];

<StatusFilter
  customStatuses={customStatuses}
  // ... other props
/>
```

### Custom Date Presets
Override default date presets:

```jsx
const customPresets = [
  { label: 'Last Hour', value: '1hour' },
  { label: 'Last 24 Hours', value: '24hours' },
  { label: 'This Week', value: 'week' }
];

<DateRangeFilter
  presets={customPresets}
  // ... other props
/>
```

## Integration Examples

### Basic Search with Filters
```jsx
import { SearchFilter, DateRangeFilter, StatusFilter } from './filters';

const SearchWithFilters = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');

  return (
    <div className="space-y-4">
      <SearchFilter
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        userRole="admin"
      />
      
      <DateRangeFilter
        startDate={startDate}
        endDate={endDate}
        onDateChange={(start, end) => {
          setStartDate(start);
          setEndDate(end);
        }}
      />
      
      <StatusFilter
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />
    </div>
  );
};
```

### Advanced Filter Group
```jsx
import { FilterGroup, SearchFilter, DateRangeFilter, StatusFilter } from './filters';

const AdvancedFilters = () => {
  const [filters, setFilters] = useState({
    searchType: 'all',
    dateRange: { start: null, end: null },
    status: 'all'
  });

  const clearAllFilters = () => {
    setFilters({
      searchType: 'all',
      dateRange: { start: null, end: null },
      status: 'all'
    });
  };

  const activeFilterCount = Object.values(filters).filter(v => 
    v !== 'all' && !(v.start === null && v.end === null)
  ).length;

  return (
    <FilterGroup
      title="Advanced Filters"
      activeFilterCount={activeFilterCount}
      onClearAll={clearAllFilters}
      collapsible={true}
    >
      <SearchFilter
        selectedFilter={filters.searchType}
        setSelectedFilter={(value) => setFilters(prev => ({ ...prev, searchType: value }))}
        userRole="admin"
      />
      
      <DateRangeFilter
        startDate={filters.dateRange.start}
        endDate={filters.dateRange.end}
        onDateChange={(start, end) => setFilters(prev => ({ 
          ...prev, 
          dateRange: { start, end } 
        }))}
      />
      
      <StatusFilter
        selectedStatus={filters.status}
        setSelectedStatus={(value) => setFilters(prev => ({ ...prev, status: value }))}
      />
    </FilterGroup>
  );
};
```

## Responsive Behavior

All filter components automatically adapt to different screen sizes:

- **Desktop**: Full layout with labels and spacing
- **Tablet**: Compact layout with reduced spacing
- **Mobile**: Mobile-optimized layout with touch-friendly interactions

## Accessibility Features

- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- High contrast support

## Performance Considerations

- Components use React.memo for optimal re-rendering
- Debounced input handling for search filters
- Lazy loading for large filter lists
- Efficient state management

## Migration Guide

### From Old Filter Implementation

**Before:**
```jsx
const FilterOptions = ({ selectedFilter, setSelectedFilter, showFilters, userRole, variant }) => {
  // Custom filter implementation
  return (
    <div className="filter-container">
      {/* Filter buttons */}
    </div>
  );
};
```

**After:**
```jsx
import { SearchFilter } from './filters';

const FilterOptions = ({ selectedFilter, setSelectedFilter, showFilters, userRole, variant }) => {
  return (
    <SearchFilter
      selectedFilter={selectedFilter}
      setSelectedFilter={setSelectedFilter}
      showFilters={showFilters}
      userRole={userRole}
      variant={variant}
    />
  );
};
```

## Troubleshooting

### Common Issues

1. **Filters not showing**: Check `showFilters` prop and ensure it's `true`
2. **Icons not displaying**: Ensure Lucide React icons are properly imported
3. **Responsive issues**: Verify `variant` prop is set correctly
4. **State not updating**: Check that state setter functions are properly passed

### Debug Mode

Enable debug mode by setting the `debug` prop on any filter component:

```jsx
<SearchFilter
  debug={true}
  // ... other props
/>
```

This will log component state changes and prop updates to the console.

## Contributing

When adding new filter components:

1. Follow the existing component structure
2. Include proper TypeScript types
3. Add comprehensive prop documentation
4. Include accessibility features
5. Test across different screen sizes
6. Update this README with examples 