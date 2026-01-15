import React, { useState } from 'react';

const FilterSection = ({ filterOptions, filters, onFilterChange }) => {
  const [expandedFilter, setExpandedFilter] = useState(null); // Only one at a time

  const toggleFilter = (filterId) => {
    setExpandedFilter(prev => prev === filterId ? null : filterId);
  };

  const handleCheckboxChange = (filterType, value, checked) => {
    const currentValues = filters[filterType] || [];
    let newValues;
    
    if (checked) {
      newValues = [...currentValues, value];
    } else {
      newValues = currentValues.filter(v => v !== value);
    }
    
    onFilterChange(filterType, newValues);
  };

  const selectAll = (filterType) => {
    onFilterChange(filterType, filterOptions[filterType]);
  };

  const deselectAll = (filterType) => {
    onFilterChange(filterType, []);
  };

  const selectAllFilters = () => {
    Object.keys(filterOptions).forEach(key => {
      onFilterChange(key, filterOptions[key]);
    });
  };

  const deselectAllFilters = () => {
    Object.keys(filterOptions).forEach(key => {
      onFilterChange(key, []);
    });
  };

  const renderFilter = (id, title, filterType) => {
    const isExpanded = expandedFilter === id;
    const options = filterOptions[filterType] || [];
    const selectedValues = filters[filterType] || [];

    return (
      <div className="filter-card" key={id}>
        <div className="filter-header" onClick={() => toggleFilter(id)}>
          <div className="filter-title">
            {title}
            <span className="filter-count">{selectedValues.length}/{options.length}</span>
          </div>
          <button className={`filter-toggle ${isExpanded ? 'expanded' : ''}`}>
            ▼
          </button>
        </div>
        {isExpanded && (
          <>
            <div className="filter-options">
              {options.map(option => (
                <div key={option} className="filter-option">
                  <input
                    type="checkbox"
                    id={`${filterType}-${option}`}
                    value={option}
                    checked={selectedValues.includes(option)}
                    onChange={(e) => handleCheckboxChange(filterType, option, e.target.checked)}
                  />
                  <label htmlFor={`${filterType}-${option}`}>{option}</label>
                </div>
              ))}
            </div>
            <div className="filter-quick-actions">
              <button className="btn btn-sm btn-ghost" onClick={() => selectAll(filterType)}>
                Select All
              </button>
              <button className="btn btn-sm btn-ghost" onClick={() => deselectAll(filterType)}>
                Clear
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="filters-container">
      <div className="filters-header">
        <h3>Filters</h3>
        <div className="filter-actions">
          <button className="btn btn-sm btn-primary" onClick={selectAllFilters}>
            Select All
          </button>
          <button className="btn btn-sm btn-secondary" onClick={deselectAllFilters}>
            Deselect All
          </button>
        </div>
      </div>

      <div className="filter-grid">
        {renderFilter('projectFilter', '📁 Project', 'projects')}
        {renderFilter('unitTypeFilter', '🏠 Unit Type', 'unitTypes')}
        {renderFilter('statusFilter', '📊 Status', 'statuses')}
        {renderFilter('areaFilter', '📏 Area', 'areas')}
        {renderFilter('cityFilter', '🌆 City', 'cities')}
      </div>
    </div>
  );
};

export default FilterSection;