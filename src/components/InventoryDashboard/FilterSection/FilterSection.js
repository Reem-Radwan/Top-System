// import React, { useState } from 'react';
// import './filtersection.css'

// const FilterSection = ({ filterOptions, filters, onFilterChange }) => {
//   const [expandedFilter, setExpandedFilter] = useState(null); // Only one at a time

//   const toggleFilter = (filterId) => {
//     setExpandedFilter(prev => prev === filterId ? null : filterId);
//   };

//   const handleCheckboxChange = (filterType, value, checked) => {
//     const currentValues = filters[filterType] || [];
//     let newValues;
    
//     if (checked) {
//       newValues = [...currentValues, value];
//     } else {
//       newValues = currentValues.filter(v => v !== value);
//     }
    
//     onFilterChange(filterType, newValues);
//   };

//   const selectAll = (filterType) => {
//     onFilterChange(filterType, filterOptions[filterType]);
//   };

//   const deselectAll = (filterType) => {
//     onFilterChange(filterType, []);
//   };

//   const selectAllFilters = () => {
//     Object.keys(filterOptions).forEach(key => {
//       onFilterChange(key, filterOptions[key]);
//     });
//   };

//   const deselectAllFilters = () => {
//     Object.keys(filterOptions).forEach(key => {
//       onFilterChange(key, []);
//     });
//   };

//   const renderFilter = (id, title, filterType) => {
//     const isExpanded = expandedFilter === id;
//     const options = filterOptions[filterType] || [];
//     const selectedValues = filters[filterType] || [];

//     return (
//       <div className="filter-card" key={id}>
//         <div className="filter-header" onClick={() => toggleFilter(id)}>
//           <div className="filter-title">
//             {title}
//             {/* <span className="filter-count">{selectedValues.length}/{options.length}</span> */}
//           </div>
//           <button className={`filter-toggle ${isExpanded ? 'expanded' : ''}`}>
//             ▼
//           </button>
//         </div>
//         {isExpanded && (
//           <>
//             <div className="filter-options">
//               {options.map(option => (
//                 <div key={option} className="filter-option">
//                   <input
//                     type="checkbox"
//                     id={`${filterType}-${option}`}
//                     value={option}
//                     checked={selectedValues.includes(option)}
//                     onChange={(e) => handleCheckboxChange(filterType, option, e.target.checked)}
//                   />
//                   <label htmlFor={`${filterType}-${option}`}>{option}</label>
//                 </div>
//               ))}
//             </div>
//             <div className="filter-quick-actions">
//               <button className="btn btn-sm btn-ghost" onClick={() => selectAll(filterType)}>
//                 Select All
//               </button>
//               <button className="btn btn-sm btn-ghost" onClick={() => deselectAll(filterType)}>
//                 Clear
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="filters-container">
//       <div className="filters-header">
//         <h3>Filters</h3>
//         <div className="filter-actions">
//           <button className="btn btn-sm btn-primary" onClick={selectAllFilters}>
//             Select All
//           </button>
//           <button className="btn btn-sm btn-secondary" onClick={deselectAllFilters}>
//             Deselect All
//           </button>
//         </div>
//       </div>

//       <div className="filter-grid">
//         {renderFilter('projectFilter', '📁 Project', 'projects')}
//         {renderFilter('unitTypeFilter', '🏠 Unit Type', 'unitTypes')}
//         {renderFilter('statusFilter', '📊 Status', 'statuses')}
//         {renderFilter('areaFilter', '📏 Area', 'areas')}
//         {renderFilter('cityFilter', '🌆 City', 'cities')}
//       </div>
//     </div>
//   );
// };

// export default FilterSection;









// import React, { useState } from 'react';
// import './filtersection.css';

// const FilterSection = ({ filterOptions, filters, onFilterChange }) => {
//   const [expandedFilter, setExpandedFilter] = useState(null);

//   const toggleFilter = (filterId) => {
//     setExpandedFilter(prev => prev === filterId ? null : filterId);
//   };

//   const handleCheckboxChange = (filterType, value, checked) => {
//     const currentValues = filters[filterType] || [];
//     let newValues;
    
//     if (checked) {
//       newValues = [...currentValues, value];
//     } else {
//       newValues = currentValues.filter(v => v !== value);
//     }
    
//     onFilterChange(filterType, newValues);
//   };

//   const selectAll = (filterType) => {
//     onFilterChange(filterType, filterOptions[filterType]);
//   };

//   const deselectAll = (filterType) => {
//     onFilterChange(filterType, []);
//   };

//   const selectAllFilters = () => {
//     Object.keys(filterOptions).forEach(key => {
//       onFilterChange(key, filterOptions[key]);
//     });
//   };

//   const deselectAllFilters = () => {
//     Object.keys(filterOptions).forEach(key => {
//       onFilterChange(key, []);
//     });
//   };

//   const renderFilter = (id, title, filterType) => {
//     const isExpanded = expandedFilter === id;
//     const options = filterOptions[filterType] || [];
//     const selectedValues = filters[filterType] || [];

//     return (
//       <div className={`filter-card ${isExpanded ? 'expanded' : ''}`} key={id}>
//         <div className="filter-header" onClick={() => toggleFilter(id)}>
//           <div className="filter-title">
//             {title}
//             {/* <span className="filter-count">{selectedValues.length}/{options.length}</span> */}
//           </div>
//           <button 
//             className={`filter-toggle ${isExpanded ? 'expanded' : ''}`}
//             aria-label={isExpanded ? 'Collapse filter' : 'Expand filter'}
//             type="button"
//           >
//             ▼
//           </button>
//         </div>
        
//         {isExpanded && (
//           <div className="filter-content">
//             <div className="filter-options">
//               {options.length > 0 ? (
//                 options.map(option => (
//                   <div key={option} className="filter-option">
//                     <input
//                       type="checkbox"
//                       id={`${filterType}-${option}`}
//                       value={option}
//                       checked={selectedValues.includes(option)}
//                       onChange={(e) => handleCheckboxChange(filterType, option, e.target.checked)}
//                       aria-label={`Select ${option}`}
//                     />
//                     <label htmlFor={`${filterType}-${option}`}>
//                       {option}
//                     </label>
//                   </div>
//                 ))
//               ) : (
//                 <div className="empty-state">
//                   No options available
//                 </div>
//               )}
//             </div>
            
//             <div className="filter-quick-actions">
//               <button 
//                 className="btn btn-sm btn-ghost" 
//                 onClick={() => selectAll(filterType)}
//                 type="button"
//               >
//                 Select All
//               </button>
//               <button 
//                 className="btn btn-sm btn-ghost" 
//                 onClick={() => deselectAll(filterType)}
//                 type="button"
//               >
//                 Clear
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="filters-container">
//       <div className="filters-header">
//         <h3>Filters</h3>
//         <div className="filter-actions">
//           <button 
//             className="btn btn-sm btn-primary" 
//             onClick={selectAllFilters}
//             type="button"
//           >
//             Select All
//           </button>
//           <button 
//             className="btn btn-sm btn-secondary" 
//             onClick={deselectAllFilters}
//             type="button"
//           >
//             Clear All
//           </button>
//         </div>
//       </div>

//       <div className="filter-grid">
//         {renderFilter('projectFilter', '📁 Project', 'projects')}
//         {renderFilter('unitTypeFilter', '🏠 Unit Type', 'unitTypes')}
//         {renderFilter('statusFilter', '📊 Status', 'statuses')}
//         {renderFilter('areaFilter', '📏 Area', 'areas')}
//         {renderFilter('cityFilter', '🌆 City', 'cities')}
//       </div>
//     </div>
//   );
// };

// export default FilterSection;





// import React, { useState } from 'react';
// import './filtersection.css'

// const FilterSection = ({ filterOptions, filters, onFilterChange }) => {
//   const [expandedFilter, setExpandedFilter] = useState(null);

//   const toggleFilter = (filterId) => {
//     setExpandedFilter(prev => prev === filterId ? null : filterId);
//   };

//   const handleCheckboxChange = (filterType, value, checked) => {
//     const currentValues = filters[filterType] || [];
//     let newValues;
    
//     if (checked) {
//       newValues = [...currentValues, value];
//     } else {
//       newValues = currentValues.filter(v => v !== value);
//     }
    
//     onFilterChange(filterType, newValues);
//   };

//   const selectAll = (filterType) => {
//     onFilterChange(filterType, filterOptions[filterType]);
//   };

//   const deselectAll = (filterType) => {
//     onFilterChange(filterType, []);
//   };

//   const selectAllFilters = () => {
//     Object.keys(filterOptions).forEach(key => {
//       onFilterChange(key, filterOptions[key]);
//     });
//   };

//   const deselectAllFilters = () => {
//     Object.keys(filterOptions).forEach(key => {
//       onFilterChange(key, []);
//     });
//   };

//   // Check if any filter has selections
//   const hasAnySelection = () => {
//     return Object.keys(filters).some(key => {
//       const value = filters[key];
//       return Array.isArray(value) && value.length > 0;
//     });
//   };

//   const renderFilter = (id, title, filterType) => {
//     const isExpanded = expandedFilter === id;
//     const options = filterOptions[filterType] || [];
//     const selectedValues = filters[filterType] || [];
//     const allSelected = selectedValues.length === options.length && options.length > 0;
//     const noneSelected = selectedValues.length === 0;

//     return (
//       <div className={`filter-card ${isExpanded ? 'expanded' : ''}`} key={id}>
//         <div className="filter-header" onClick={() => toggleFilter(id)}>
//           <div className="filter-title">
//             {title}
//             <span className="filter-count">({selectedValues.length}/{options.length})</span>
//           </div>
//           <button 
//             className={`filter-toggle ${isExpanded ? 'expanded' : ''}`}
//             aria-label={isExpanded ? 'Collapse filter' : 'Expand filter'}
//             type="button"
//           >
//             ▼
//           </button>
//         </div>
        
//         {isExpanded && (
//           <div className="filter-content">
//             <div className="filter-options">
//               {options.length > 0 ? (
//                 options.map(option => (
//                   <div key={option} className="filter-option">
//                     <input
//                       type="checkbox"
//                       id={`${filterType}-${option}`}
//                       value={option}
//                       checked={selectedValues.includes(option)}
//                       onChange={(e) => handleCheckboxChange(filterType, option, e.target.checked)}
//                       aria-label={`Select ${option}`}
//                     />
//                     <label htmlFor={`${filterType}-${option}`}>
//                       {option}
//                     </label>
//                   </div>
//                 ))
//               ) : (
//                 <div className="empty-state">
//                   No options available
//                 </div>
//               )}
//             </div>
            
//             <div className="filter-quick-actions">
//               <button 
//                 className="btn btn-sm btn-ghost" 
//                 onClick={() => selectAll(filterType)}
//                 disabled={allSelected}
//                 type="button"
//                 style={{ opacity: allSelected ? 0.5 : 1, cursor: allSelected ? 'not-allowed' : 'pointer' }}
//               >
//                 Select All
//               </button>
//               <button 
//                 className="btn btn-sm btn-ghost" 
//                 onClick={() => deselectAll(filterType)}
//                 disabled={noneSelected}
//                 type="button"
//                 style={{ opacity: noneSelected ? 0.5 : 1, cursor: noneSelected ? 'not-allowed' : 'pointer' }}
//               >
//                 Clear
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="filters-container">
//       <div className="filters-header">
//         <h3>Filters</h3>
//         <div className="filter-actions">
//           <button 
//             className="btn btn-sm btn-primary" 
//             onClick={selectAllFilters}
//             type="button"
//           >
//             Select All
//           </button>
//           <button 
//             className="btn btn-sm btn-secondary" 
//             onClick={deselectAllFilters}
//             disabled={!hasAnySelection()}
//             type="button"
//             style={{ opacity: !hasAnySelection() ? 0.5 : 1, cursor: !hasAnySelection() ? 'not-allowed' : 'pointer' }}
//           >
//             Clear All
//           </button>
//         </div>
//       </div>

//       {!hasAnySelection() && (
//         <div className="filter-notice" style={{
//           padding: '12px 16px',
//           margin: '16px 0',
//           background: 'var(--color-warning-bg, #fff3cd)',
//           border: '1px solid var(--color-warning-border, #ffc107)',
//           borderRadius: '8px',
//           color: 'var(--color-warning-text, #856404)',
//           fontSize: '14px',
//           display: 'flex',
//           alignItems: 'center',
//           gap: '8px'
//         }}>
//           <span style={{ fontSize: '18px' }}>ℹ️</span>
//           <span>No filters selected. Please select filters to view data.</span>
//         </div>
//       )}

//       <div className="filter-grid">
//         {renderFilter('projectFilter', '📁 Project', 'projects')}
//         {renderFilter('unitTypeFilter', '🏠 Unit Type', 'unitTypes')}
//         {renderFilter('statusFilter', '📊 Status', 'statuses')}
//         {renderFilter('areaFilter', '📏 Area', 'areas')}
//         {renderFilter('cityFilter', '🌆 City', 'cities')}
//       </div>
//     </div>
//   );
// };

// export default FilterSection;









// import React, { useState } from 'react';
// import './filtersection.css'

// const FilterSection = ({ filterOptions, availableOptions, filters, onFilterChange }) => {
//   const [expandedFilter, setExpandedFilter] = useState(null);

//   const toggleFilter = (filterId) => {
//     setExpandedFilter(prev => prev === filterId ? null : filterId);
//   };

//   const handleCheckboxChange = (filterType, value, checked) => {
//     const currentValues = filters[filterType] || [];
//     let newValues;
    
//     if (checked) {
//       newValues = [...currentValues, value];
//     } else {
//       newValues = currentValues.filter(v => v !== value);
//     }
    
//     onFilterChange(filterType, newValues);
//   };

//   const selectAll = (filterType) => {
//     onFilterChange(filterType, filterOptions[filterType]);
//   };

//   const deselectAll = (filterType) => {
//     onFilterChange(filterType, []);
//   };

//   const selectAllFilters = () => {
//     Object.keys(filterOptions).forEach(key => {
//       onFilterChange(key, filterOptions[key]);
//     });
//   };

//   const deselectAllFilters = () => {
//     Object.keys(filterOptions).forEach(key => {
//       onFilterChange(key, []);
//     });
//   };

//   // Check if any filter has selections
//   const hasAnySelection = () => {
//     return Object.keys(filters).some(key => {
//       const value = filters[key];
//       return Array.isArray(value) && value.length > 0;
//     });
//   };

//   const renderFilter = (id, title, filterType) => {
//     const isExpanded = expandedFilter === id;
//     const options = filterOptions[filterType] || [];
//     const available = availableOptions ? availableOptions[filterType] || [] : options;
//     const selectedValues = filters[filterType] || [];
//     const allSelected = selectedValues.length === options.length && options.length > 0;
//     const noneSelected = selectedValues.length === 0;

//     return (
//       <div className={`filter-card ${isExpanded ? 'expanded' : ''}`} key={id}>
//         <div className="filter-header" onClick={() => toggleFilter(id)}>
//           <div className="filter-title">
//             {title}
//             <span className="filter-count">({selectedValues.length}/{options.length})</span>
//           </div>
//           <button 
//             className={`filter-toggle ${isExpanded ? 'expanded' : ''}`}
//             aria-label={isExpanded ? 'Collapse filter' : 'Expand filter'}
//             type="button"
//           >
//             ▼
//           </button>
//         </div>
        
//         {isExpanded && (
//           <div className="filter-content">
//             <div className="filter-options">
//               {options.length > 0 ? (
//                 options.map(option => {
//                   const isAvailable = available.includes(option);
//                   return (
//                     <div key={option} className={`filter-option ${!isAvailable ? 'disabled' : ''}`}>
//                       <input
//                         type="checkbox"
//                         id={`${filterType}-${option}`}
//                         value={option}
//                         checked={selectedValues.includes(option)}
//                         disabled={!isAvailable}
//                         onChange={(e) => handleCheckboxChange(filterType, option, e.target.checked)}
//                         aria-label={`Select ${option}`}
//                       />
//                       <label htmlFor={`${filterType}-${option}`} style={{ opacity: isAvailable ? 1 : 0.4 }}>
//                         {option}
//                       </label>
//                     </div>
//                   );
//                 })
//               ) : (
//                 <div className="empty-state">
//                   No options available
//                 </div>
//               )}
//             </div>
            
//             <div className="filter-quick-actions">
//               <button 
//                 className="btn btn-sm btn-ghost" 
//                 onClick={() => selectAll(filterType)}
//                 disabled={allSelected}
//                 type="button"
//                 style={{ opacity: allSelected ? 0.5 : 1, cursor: allSelected ? 'not-allowed' : 'pointer' }}
//               >
//                 Select All
//               </button>
//               <button 
//                 className="btn btn-sm btn-ghost" 
//                 onClick={() => deselectAll(filterType)}
//                 disabled={noneSelected}
//                 type="button"
//                 style={{ opacity: noneSelected ? 0.5 : 1, cursor: noneSelected ? 'not-allowed' : 'pointer' }}
//               >
//                 Clear
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="filters-container">
//       <div className="filters-header">
//         <h3>Filters</h3>
//         <div className="filter-actions">
//           <button 
//             className="btn btn-sm btn-primary" 
//             onClick={selectAllFilters}
//             type="button"
//           >
//             Select All
//           </button>
//           <button 
//             className="btn btn-sm btn-secondary" 
//             onClick={deselectAllFilters}
//             disabled={!hasAnySelection()}
//             type="button"
//             style={{ opacity: !hasAnySelection() ? 0.5 : 1, cursor: !hasAnySelection() ? 'not-allowed' : 'pointer' }}
//           >
//             Clear All
//           </button>
//         </div>
//       </div>

//       {!hasAnySelection() && (
//         <div className="filter-notice" style={{
//           padding: '12px 16px',
//           margin: '16px 0',
//           background: 'var(--color-warning-bg, #fff3cd)',
//           border: '1px solid var(--color-warning-border, #ffc107)',
//           borderRadius: '8px',
//           color: 'var(--color-warning-text, #856404)',
//           fontSize: '14px',
//           display: 'flex',
//           alignItems: 'center',
//           gap: '8px'
//         }}>
//           <span style={{ fontSize: '18px' }}>ℹ️</span>
//           <span>No filters selected. Please select filters to view data.</span>
//         </div>
//       )}

//       <div className="filter-grid">
//         {renderFilter('projectFilter', '📁 Project', 'projects')}
//         {renderFilter('unitTypeFilter', '🏠 Unit Type', 'unitTypes')}
//         {renderFilter('statusFilter', '📊 Status', 'statuses')}
//         {renderFilter('areaFilter', '📏 Area', 'areas')}
//         {renderFilter('cityFilter', '🌆 City', 'cities')}
//       </div>
//     </div>
//   );
// };

// export default FilterSection;




import React, { useState } from 'react';
import './filtersection.css';

const FilterSection = ({ filterOptions, availableOptions, filters, onFilterChange }) => {
  const [expandedFilter, setExpandedFilter] = useState(null);

  const toggleFilter = (filterId) => {
    setExpandedFilter((prev) => (prev === filterId ? null : filterId));
  };

  const handleCheckboxChange = (filterType, value, checked) => {
    const currentValues = filters[filterType] || [];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter((v) => v !== value);

    onFilterChange(filterType, newValues);
  };

  const selectAll = (filterType) => {
    onFilterChange(filterType, filterOptions[filterType] || []);
  };

  const deselectAll = (filterType) => {
    onFilterChange(filterType, []);
  };

  const selectAllFilters = () => {
    Object.keys(filterOptions).forEach((key) => {
      onFilterChange(key, filterOptions[key] || []);
    });
  };

  const deselectAllFilters = () => {
    Object.keys(filterOptions).forEach((key) => {
      onFilterChange(key, []);
    });
  };

  const hasAnySelection = () => {
    return Object.keys(filters).some((key) => {
      const value = filters[key];
      return Array.isArray(value) && value.length > 0;
    });
  };

  const renderFilter = (id, title, filterType) => {
    const isExpanded = expandedFilter === id;

    // master list (always visible)
    const options = filterOptions[filterType] || [];

    // available list (for disabling)
    const available = availableOptions?.[filterType] || [];

    const selectedValues = filters[filterType] || [];
    const allSelected = selectedValues.length === options.length && options.length > 0;
    const noneSelected = selectedValues.length === 0;

    return (
      <div className={`filter-card ${isExpanded ? 'expanded' : ''}`} key={id}>
        <div className="filter-header" onClick={() => toggleFilter(id)}>
          <div className="filter-title">
            {title}
            {/* <span className="filter-count">
              ({selectedValues.length}/{options.length})
            </span> */}
          </div>

          <button
            className={`filter-toggle ${isExpanded ? 'expanded' : ''}`}
            aria-label={isExpanded ? 'Collapse filter' : 'Expand filter'}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFilter(id);
            }}
          >
            ▼
          </button>
        </div>

        {isExpanded && (
          <div className="filter-content">
            <div className="filter-options">
              {options.length > 0 ? (
                options.map((option) => {
                  const isAvailable = available.includes(option);

                  return (
                    <div
                      key={option}
                      className={`filter-option ${!isAvailable ? 'disabled' : ''}`}
                      title={!isAvailable ? 'No data for current selection' : ''}
                    >
                      <input
                        type="checkbox"
                        id={`${filterType}-${option}`}
                        value={option}
                        checked={selectedValues.includes(option)}
                        disabled={!isAvailable}
                        onChange={(e) =>
                          handleCheckboxChange(filterType, option, e.target.checked)
                        }
                      />
                      <label
                        htmlFor={`${filterType}-${option}`}
                        style={{ opacity: isAvailable ? 1 : 0.35 }}
                      >
                        {option}
                      </label>
                    </div>
                  );
                })
              ) : (
                <div className="empty-state">No options available</div>
              )}
            </div>

            <div className="filter-quick-actions">
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => selectAll(filterType)}
                disabled={allSelected}
                type="button"
                style={{
                  opacity: allSelected ? 0.5 : 1,
                  cursor: allSelected ? 'not-allowed' : 'pointer',
                }}
              >
                Select All
              </button>

              <button
                className="btn btn-sm btn-ghost"
                onClick={() => deselectAll(filterType)}
                disabled={noneSelected}
                type="button"
                style={{
                  opacity: noneSelected ? 0.5 : 1,
                  cursor: noneSelected ? 'not-allowed' : 'pointer',
                }}
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="filters-container">
      <div className="filters-header">
        <h3>Filters</h3>
        <div className="filter-actions">
          <button className="btn btn-sm btn-primary" onClick={selectAllFilters} type="button">
            Select All
          </button>

          <button
            className="btn btn-sm btn-secondary"
            onClick={deselectAllFilters}
            disabled={!hasAnySelection()}
            type="button"
            style={{
              opacity: !hasAnySelection() ? 0.5 : 1,
              cursor: !hasAnySelection() ? 'not-allowed' : 'pointer',
            }}
          >
            Clear All
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
