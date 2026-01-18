
// import React, { useState, useMemo, useEffect, useRef } from 'react';
// import './invstatuspivot.css';

// const InvStatusPivot = ({ units }) => {
//   // State for expand/collapse
//   const [expandedCities, setExpandedCities] = useState({});
//   const [expandedProjects, setExpandedProjects] = useState({});
//   const [expandedTypes, setExpandedTypes] = useState({});
  
//   // State for active status
//   const [activeStatus, setActiveStatus] = useState('available');
  
//   // State for column visibility
//   const [visibleColumns, setVisibleColumns] = useState({
//     percentage: true,
//     noOfUnits: true,
//     salesValue: true
//   });

//   // State for row visibility
//   const [visibleRows, setVisibleRows] = useState({
//     cities: true,
//     projects: true,
//     unitTypes: true
//   });

//   // State for dropdowns
//   const [showColumnDropdown, setShowColumnDropdown] = useState(false);
//   const [showRowDropdown, setShowRowDropdown] = useState(false);

//   // Refs for dropdown detection
//   const columnDropdownRef = useRef(null);
//   const rowDropdownRef = useRef(null);
//   const pivotScrollRef = useRef(null);

//   // Status definitions with contracted having gray theme
//   const statuses = [
//     { key: 'available', label: '📦 AVAILABLE', theme: 'blue' },
//     { key: 'unreleased', label: '🔒 UNRELEASED', theme: 'blue' },
//     { key: 'blocked', label: '🚫 BLOCKED DEVELOPMENT', theme: 'blue' },
//     { key: 'reserved', label: '⏳ RESERVED', theme: 'blue' },
//     { key: 'hold', label: '⏸️ HOLD', theme: 'blue' },
//     { key: 'partner', label: '🤝 PARTNER', theme: 'blue' },
//     { key: 'contracted', label: '✅ CONTRACTED', theme: 'gray' }
//   ];

//   // Get current status theme
//   const getCurrentStatusTheme = () => {
//     const currentStatus = statuses.find(s => s.key === activeStatus);
//     return currentStatus?.theme || 'blue';
//   };

//   // Map unit status to status keys
//   const getStatusKey = (unitStatus) => {
//     const statusMap = {
//       'Available': 'available',
//       'Unreleased': 'unreleased',
//       'Blocked Development': 'blocked',
//       'Reserved': 'reserved',
//       'Hold': 'hold',
//       'Partner': 'partner',
//       'Contracted': 'contracted'
//     };
//     return statusMap[unitStatus] || 'available';
//   };

//   // Close dropdowns on outside click
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (columnDropdownRef.current && !columnDropdownRef.current.contains(event.target)) {
//         setShowColumnDropdown(false);
//       }
//       if (rowDropdownRef.current && !rowDropdownRef.current.contains(event.target)) {
//         setShowRowDropdown(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // Reset horizontal scroll on mobile
//   useEffect(() => {
//     if (pivotScrollRef.current) {
//       pivotScrollRef.current.scrollLeft = 0;
//     }
//   }, []);

//   // Calculate hierarchical data
//   const pivotData = useMemo(() => {
//     const cityMap = {};

//     units.forEach(unit => {
//       const city = unit.city || 'Unknown';
//       const project = unit.project || 'Unknown';
//       const unitType = unit.unit_type || 'Unknown';
//       const statusKey = getStatusKey(unit.status);

//       // Initialize city
//       if (!cityMap[city]) {
//         cityMap[city] = { 
//           name: city, 
//           statusData: {}, 
//           projects: {},
//           totalUnits: 0
//         };
//         statuses.forEach(s => {
//           cityMap[city].statusData[s.key] = { count: 0, value: 0 };
//         });
//       }

//       // Add to city totals
//       cityMap[city].totalUnits++;
//       cityMap[city].statusData[statusKey].count++;
//       cityMap[city].statusData[statusKey].value += parseFloat(unit.sales_value) || 0;

//       // Initialize project
//       if (!cityMap[city].projects[project]) {
//         cityMap[city].projects[project] = { 
//           name: project, 
//           statusData: {}, 
//           unitTypes: {},
//           totalUnits: 0
//         };
//         statuses.forEach(s => {
//           cityMap[city].projects[project].statusData[s.key] = { count: 0, value: 0 };
//         });
//       }

//       // Add to project totals
//       cityMap[city].projects[project].totalUnits++;
//       cityMap[city].projects[project].statusData[statusKey].count++;
//       cityMap[city].projects[project].statusData[statusKey].value += parseFloat(unit.sales_value) || 0;

//       // Initialize unit type
//       if (!cityMap[city].projects[project].unitTypes[unitType]) {
//         cityMap[city].projects[project].unitTypes[unitType] = { 
//           name: unitType, 
//           statusData: {},
//           totalUnits: 0
//         };
//         statuses.forEach(s => {
//           cityMap[city].projects[project].unitTypes[unitType].statusData[s.key] = { count: 0, value: 0 };
//         });
//       }

//       // Add to unit type totals
//       cityMap[city].projects[project].unitTypes[unitType].totalUnits++;
//       cityMap[city].projects[project].unitTypes[unitType].statusData[statusKey].count++;
//       cityMap[city].projects[project].unitTypes[unitType].statusData[statusKey].value += parseFloat(unit.sales_value) || 0;
//     });

//     return Object.values(cityMap);
//   }, [units]);

//   const formatNumber = (num) => num.toLocaleString('en-US', { maximumFractionDigits: 0 });
  
//   const calculatePercentage = (count, total) => {
//     return total === 0 ? '0%' : `${((count / total) * 100).toFixed(2)}%`;
//   };

//   const toggleCity = (cityName) => {
//     setExpandedCities(prev => ({
//       ...prev,
//       [cityName]: !(prev[cityName] === true)
//     }));
//   };

//   const toggleProject = (cityName, projectName) => {
//     const key = `${cityName}-${projectName}`;
//     setExpandedProjects(prev => ({
//       ...prev,
//       [key]: !prev[key]
//     }));
//   };

//   const toggleType = (cityName, projectName, typeName) => {
//     const key = `${cityName}-${projectName}-${typeName}`;
//     setExpandedTypes(prev => ({
//       ...prev,
//       [key]: !prev[key]
//     }));
//   };
  
//   const toggleColumn = (columnKey) => setVisibleColumns(prev => ({ ...prev, [columnKey]: !prev[columnKey] }));
//   const toggleRow = (rowKey) => setVisibleRows(prev => ({ ...prev, [rowKey]: !prev[rowKey] }));
  
//   const toggleColumnDropdown = (e) => {
//     e.stopPropagation();
//     setShowColumnDropdown(prev => !prev);
//     setShowRowDropdown(false);
//   };
  
//   const toggleRowDropdown = (e) => {
//     e.stopPropagation();
//     setShowRowDropdown(prev => !prev);
//     setShowColumnDropdown(false);
//   };

//   const expandAll = () => {
//     const newCities = {}, newProjects = {}, newTypes = {};
//     pivotData.forEach(city => {
//       newCities[city.name] = true;
//       Object.keys(city.projects).forEach(projectName => {
//         const projectKey = `${city.name}-${projectName}`;
//         newProjects[projectKey] = true;
        
//         const project = city.projects[projectName];
//         Object.keys(project.unitTypes).forEach(typeName => {
//           const typeKey = `${city.name}-${projectName}-${typeName}`;
//           newTypes[typeKey] = true;
//         });
//       });
//     });
//     setExpandedCities(newCities);
//     setExpandedProjects(newProjects);
//     setExpandedTypes(newTypes);
//   };

//   const collapseAll = () => {
//     setExpandedCities({});
//     setExpandedProjects({});
//     setExpandedTypes({});
//   };

//   // Generic render row function
//   const renderRow = (level, name, data, totalUnits, expandable, expanded, onToggle, indent = 0) => {
//     const percentage = calculatePercentage(data.count, totalUnits);
    
//     return (
//       <tr className={`data-row level-${level}`}>
//         <td className="group-column" style={{ paddingLeft: `${indent * 20 + 10}px` }}>
//           {expandable && (
//             <button
//               className="expand-btn"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 e.preventDefault();
//                 onToggle();
//               }}
//             >
//               {expanded ? '▼' : '▶'}
//             </button>
//           )}
//           <span className={`level-${level}-label`}>{name}</span>
//         </td>
//         {visibleColumns.percentage && <td className="metric-cell">{percentage}</td>}
//         {visibleColumns.noOfUnits && <td className="metric-cell">{formatNumber(data.count)}</td>}
//         {visibleColumns.salesValue && <td className="metric-cell">{formatNumber(data.value)}</td>}
//       </tr>
//     );
//   };

//   const currentTheme = getCurrentStatusTheme();

//   return (
//     <div className={`pivot-table-container theme-${currentTheme}`}>
//       {/* Status Tabs */}
//       <div className="category-toggle">
//         {statuses.map(status => (
//           <button
//             key={status.key}
//             className={`category-btn ${activeStatus === status.key ? 'active' : ''}`}
//             onClick={() => setActiveStatus(status.key)}
//           >
//             {status.label}
//           </button>
//         ))}
//       </div>

//       {/* Controls */}
//       <div className="pivot-controls">
//         <div className="expand-controls">
//           <button className="control-btn" onClick={expandAll}>▼ Collapse All</button>
//           <button className="control-btn" onClick={collapseAll}>▶ Expand All</button>
//         </div>

//         <div className="dropdown-controls">
//           <div className="row-toggle" ref={rowDropdownRef}>
//             <button className="control-btn" onClick={toggleRowDropdown}>
//               📋 Rows/Fields {showRowDropdown ? '▲' : '▼'}
//             </button>
//             {showRowDropdown && (
//               <div className="row-dropdown">
//                 <div className="dropdown-section">
//                   <h4>Hierarchy Levels</h4>
//                   <label>
//                     <input 
//                       type="checkbox" 
//                       checked={visibleRows.cities} 
//                       onChange={() => toggleRow('cities')} 
//                     />
//                     📍 Cities
//                   </label>
//                   <label>
//                     <input 
//                       type="checkbox" 
//                       checked={visibleRows.projects} 
//                       onChange={() => toggleRow('projects')}
//                       disabled={!visibleRows.cities}
//                     />
//                     📁 Projects
//                   </label>
//                   <label>
//                     <input 
//                       type="checkbox" 
//                       checked={visibleRows.unitTypes} 
//                       onChange={() => toggleRow('unitTypes')}
//                       disabled={!visibleRows.projects}
//                     />
//                     🏠 Unit Types
//                   </label>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div className="column-toggle" ref={columnDropdownRef}>
//             <button className="control-btn" onClick={toggleColumnDropdown}>
//               ⚙️ Columns {showColumnDropdown ? '▲' : '▼'}
//             </button>
//             {showColumnDropdown && (
//               <div className="column-dropdown">
//                 <div className="dropdown-section">
//                   <h4>Data Fields</h4>
//                   {Object.keys(visibleColumns).map(key => (
//                     <label key={key}>
//                       <input
//                         type="checkbox"
//                         checked={visibleColumns[key]}
//                         onChange={() => toggleColumn(key)}
//                       />
//                       {key === 'percentage' ? 'Percentage' :
//                        key === 'noOfUnits' ? 'No. of Units' :
//                        key === 'salesValue' ? 'Sales Value' : key}
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Pivot Table */}
//       <div className="pivot-table-scroll" ref={pivotScrollRef}>
//         <table className="pivot-table">
//           <thead>
//             <tr className="header-row">
//               <th className="group-header">GROUP</th>
//               {visibleColumns.percentage && <th>PERCENTAGE</th>}
//               {visibleColumns.noOfUnits && <th>NO. OF UNITS</th>}
//               {visibleColumns.salesValue && <th>SALES VALUE</th>}
//             </tr>
//           </thead>
//           <tbody>
//             {visibleRows.cities && pivotData.map(city => {
//               const cityData = city.statusData[activeStatus] || { count: 0, value: 0 };
//               const isCityExpanded = expandedCities[city.name] !== true;
//               const cityHasExpandable = visibleRows.projects;

//               return (
//                 <React.Fragment key={city.name}>
//                   {/* City Row */}
//                   {renderRow(
//                     0,
//                     `📍 ${city.name}`,
//                     cityData,
//                     city.totalUnits,
//                     cityHasExpandable,
//                     isCityExpanded,
//                     () => toggleCity(city.name),
//                     0
//                   )}

//                   {/* Projects */}
//                   {visibleRows.projects && isCityExpanded && Object.values(city.projects).map(project => {
//                     const projectKey = `${city.name}-${project.name}`;
//                     const projectData = project.statusData[activeStatus] || { count: 0, value: 0 };
//                     const isProjectExpanded = expandedProjects[projectKey];
//                     const projectHasExpandable = visibleRows.unitTypes;

//                     return (
//                       <React.Fragment key={projectKey}>
//                         {/* Project Row */}
//                         {renderRow(
//                           1,
//                           `📁 ${project.name}`,
//                           projectData,
//                           project.totalUnits,
//                           projectHasExpandable,
//                           isProjectExpanded,
//                           () => toggleProject(city.name, project.name),
//                           1
//                         )}

//                         {/* Unit Types */}
//                         {visibleRows.unitTypes && isProjectExpanded && Object.values(project.unitTypes).map(unitType => {
//                           const typeKey = `${city.name}-${project.name}-${unitType.name}`;
//                           const typeData = unitType.statusData[activeStatus] || { count: 0, value: 0 };
//                           const isTypeExpanded = expandedTypes[typeKey];

//                           return (
//                             <React.Fragment key={typeKey}>
//                               {/* Unit Type Row */}
//                               {renderRow(
//                                 2,
//                                 `🏠 ${unitType.name}`,
//                                 typeData,
//                                 unitType.totalUnits,
//                                 false,
//                                 false,
//                                 () => toggleType(city.name, project.name, unitType.name),
//                                 2
//                               )}
//                             </React.Fragment>
//                           );
//                         })}
//                       </React.Fragment>
//                     );
//                   })}
//                 </React.Fragment>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default InvStatusPivot;



import React, { useState, useMemo, useEffect, useRef } from 'react';
import './invstatuspivot.css';

const InvStatusPivot = ({ units }) => {
  // State for expand/collapse
  const [expandedCities, setExpandedCities] = useState({});
  const [expandedProjects, setExpandedProjects] = useState({});
  const [expandedTypes, setExpandedTypes] = useState({});
  
  // State for active status
  const [activeStatus, setActiveStatus] = useState('available');
  
  // State for column visibility
  const [visibleColumns, setVisibleColumns] = useState({
    percentage: true,
    noOfUnits: true,
    salesValue: true
  });

  // State for row visibility
  const [visibleRows, setVisibleRows] = useState({
    cities: true,
    projects: true,
    unitTypes: true
  });

  // State for dropdowns
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  const [showRowDropdown, setShowRowDropdown] = useState(false);

  // State for mobile scroll indicators
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  // Refs for dropdown detection
  const columnDropdownRef = useRef(null);
  const rowDropdownRef = useRef(null);
  const pivotScrollRef = useRef(null);
  const statusTabsRef = useRef(null);

  // Status definitions with contracted having gray theme
  const statuses = [
    { key: 'available', label: '📦 AVAILABLE', theme: 'blue' },
    { key: 'unreleased', label: '🔒 UNRELEASED', theme: 'blue' },
    { key: 'blocked', label: '🚫 BLOCKED DEVELOPMENT', theme: 'blue' },
    { key: 'reserved', label: '⏳ RESERVED', theme: 'blue' },
    { key: 'hold', label: '⏸️ HOLD', theme: 'blue' },
    { key: 'partner', label: '🤝 PARTNER', theme: 'blue' },
    { key: 'contracted', label: '✅ CONTRACTED', theme: 'gray' }
  ];

  // Get current status theme
  const getCurrentStatusTheme = () => {
    const currentStatus = statuses.find(s => s.key === activeStatus);
    return currentStatus?.theme || 'blue';
  };

  // Map unit status to status keys
  const getStatusKey = (unitStatus) => {
    const statusMap = {
      'Available': 'available',
      'Unreleased': 'unreleased',
      'Blocked Development': 'blocked',
      'Reserved': 'reserved',
      'Hold': 'hold',
      'Partner': 'partner',
      'Contracted': 'contracted'
    };
    return statusMap[unitStatus] || 'available';
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (columnDropdownRef.current && !columnDropdownRef.current.contains(event.target)) {
        setShowColumnDropdown(false);
      }
      if (rowDropdownRef.current && !rowDropdownRef.current.contains(event.target)) {
        setShowRowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset horizontal scroll on mobile
  useEffect(() => {
    if (pivotScrollRef.current) {
      pivotScrollRef.current.scrollLeft = 0;
    }
  }, []);

  // Update scroll indicators for status tabs
  useEffect(() => {
    const updateScrollIndicators = () => {
      const tabsContainer = statusTabsRef.current;
      if (tabsContainer) {
        const { scrollLeft, scrollWidth, clientWidth } = tabsContainer;
        setShowLeftScroll(scrollLeft > 0);
        setShowRightScroll(scrollLeft + clientWidth < scrollWidth - 10);
      }
    };

    const tabsContainer = statusTabsRef.current;
    if (tabsContainer) {
      tabsContainer.addEventListener('scroll', updateScrollIndicators);
      updateScrollIndicators(); // Initial check
      
      // Check on resize
      window.addEventListener('resize', updateScrollIndicators);
      
      return () => {
        tabsContainer.removeEventListener('scroll', updateScrollIndicators);
        window.removeEventListener('resize', updateScrollIndicators);
      };
    }
  }, []);

  // Scroll status tabs left/right
  const scrollTabs = (direction) => {
    const tabsContainer = statusTabsRef.current;
    if (tabsContainer) {
      const scrollAmount = 200;
      tabsContainer.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Calculate hierarchical data
  const pivotData = useMemo(() => {
    const cityMap = {};

    units.forEach(unit => {
      const city = unit.city || 'Unknown';
      const project = unit.project || 'Unknown';
      const unitType = unit.unit_type || 'Unknown';
      const statusKey = getStatusKey(unit.status);

      // Initialize city
      if (!cityMap[city]) {
        cityMap[city] = { 
          name: city, 
          statusData: {}, 
          projects: {},
          totalUnits: 0
        };
        statuses.forEach(s => {
          cityMap[city].statusData[s.key] = { count: 0, value: 0 };
        });
      }

      // Add to city totals
      cityMap[city].totalUnits++;
      cityMap[city].statusData[statusKey].count++;
      cityMap[city].statusData[statusKey].value += parseFloat(unit.sales_value) || 0;

      // Initialize project
      if (!cityMap[city].projects[project]) {
        cityMap[city].projects[project] = { 
          name: project, 
          statusData: {}, 
          unitTypes: {},
          totalUnits: 0
        };
        statuses.forEach(s => {
          cityMap[city].projects[project].statusData[s.key] = { count: 0, value: 0 };
        });
      }

      // Add to project totals
      cityMap[city].projects[project].totalUnits++;
      cityMap[city].projects[project].statusData[statusKey].count++;
      cityMap[city].projects[project].statusData[statusKey].value += parseFloat(unit.sales_value) || 0;

      // Initialize unit type
      if (!cityMap[city].projects[project].unitTypes[unitType]) {
        cityMap[city].projects[project].unitTypes[unitType] = { 
          name: unitType, 
          statusData: {},
          totalUnits: 0
        };
        statuses.forEach(s => {
          cityMap[city].projects[project].unitTypes[unitType].statusData[s.key] = { count: 0, value: 0 };
        });
      }

      // Add to unit type totals
      cityMap[city].projects[project].unitTypes[unitType].totalUnits++;
      cityMap[city].projects[project].unitTypes[unitType].statusData[statusKey].count++;
      cityMap[city].projects[project].unitTypes[unitType].statusData[statusKey].value += parseFloat(unit.sales_value) || 0;
    });

    return Object.values(cityMap);
  }, [units]);

  const formatNumber = (num) => num.toLocaleString('en-US', { maximumFractionDigits: 0 });
  
  const calculatePercentage = (count, total) => {
    return total === 0 ? '0%' : `${((count / total) * 100).toFixed(2)}%`;
  };

  const toggleCity = (cityName) => {
    setExpandedCities(prev => ({
      ...prev,
      [cityName]: !(prev[cityName] === true)
    }));
  };

  const toggleProject = (cityName, projectName) => {
    const key = `${cityName}-${projectName}`;
    setExpandedProjects(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleType = (cityName, projectName, typeName) => {
    const key = `${cityName}-${projectName}-${typeName}`;
    setExpandedTypes(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const toggleColumn = (columnKey) => setVisibleColumns(prev => ({ ...prev, [columnKey]: !prev[columnKey] }));
  const toggleRow = (rowKey) => setVisibleRows(prev => ({ ...prev, [rowKey]: !prev[rowKey] }));
  
  const toggleColumnDropdown = (e) => {
    e.stopPropagation();
    setShowColumnDropdown(prev => !prev);
    setShowRowDropdown(false);
  };
  
  const toggleRowDropdown = (e) => {
    e.stopPropagation();
    setShowRowDropdown(prev => !prev);
    setShowColumnDropdown(false);
  };

  const expandAll = () => {
    const newCities = {}, newProjects = {}, newTypes = {};
    pivotData.forEach(city => {
      newCities[city.name] = true;
      Object.keys(city.projects).forEach(projectName => {
        const projectKey = `${city.name}-${projectName}`;
        newProjects[projectKey] = true;
        
        const project = city.projects[projectName];
        Object.keys(project.unitTypes).forEach(typeName => {
          const typeKey = `${city.name}-${projectName}-${typeName}`;
          newTypes[typeKey] = true;
        });
      });
    });
    setExpandedCities(newCities);
    setExpandedProjects(newProjects);
    setExpandedTypes(newTypes);
  };

  const collapseAll = () => {
    setExpandedCities({});
    setExpandedProjects({});
    setExpandedTypes({});
  };

  // Generic render row function
  const renderRow = (level, name, data, totalUnits, expandable, expanded, onToggle, indent = 0) => {
    const percentage = calculatePercentage(data.count, totalUnits);
    
    return (
      <tr className={`data-row level-${level}`}>
        <td className="group-column" style={{ paddingLeft: `${indent * 20 + 10}px` }}>
          {expandable && (
            <button
              className="expand-btn"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onToggle();
              }}
            >
              {expanded ? '▼' : '▶'}
            </button>
          )}
          <span className={`level-${level}-label`}>{name}</span>
        </td>
        {visibleColumns.percentage && <td className="metric-cell">{percentage}</td>}
        {visibleColumns.noOfUnits && <td className="metric-cell">{formatNumber(data.count)}</td>}
        {visibleColumns.salesValue && <td className="metric-cell">{formatNumber(data.value)}</td>}
      </tr>
    );
  };

  const currentTheme = getCurrentStatusTheme();

  return (
    <div className={`pivot-table-container theme-${currentTheme}`}>
      {/* Status Tabs with Mobile Navigation */}
      <div className="status-tabs-container">
        {showLeftScroll && (
          <button 
            className="scroll-btn scroll-left"
            onClick={() => scrollTabs('left')}
            aria-label="Scroll tabs left"
          >
            ◀
          </button>
        )}
        
        <div className="status-tabs-wrapper" ref={statusTabsRef}>
          <div className="category-toggle">
            {statuses.map(status => (
              <button
                key={status.key}
                className={`category-btn ${activeStatus === status.key ? 'active' : ''}`}
                onClick={() => setActiveStatus(status.key)}
              >
                {status.label}
              </button>
            ))}
          </div>
        </div>
        
        {showRightScroll && (
          <button 
            className="scroll-btn scroll-right"
            onClick={() => scrollTabs('right')}
            aria-label="Scroll tabs right"
          >
            ▶
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="pivot-controls">
        <div className="expand-controls">
          <button className="control-btn" onClick={expandAll}>▼ Collapse All</button>
          <button className="control-btn" onClick={collapseAll}>▶ Expand All</button>
        </div>

        <div className="dropdown-controls">
          <div className="row-toggle" ref={rowDropdownRef}>
            <button className="control-btn" onClick={toggleRowDropdown}>
              📋 Rows/Fields {showRowDropdown ? '▲' : '▼'}
            </button>
            {showRowDropdown && (
              <div className="row-dropdown">
                <div className="dropdown-section">
                  <h4>Hierarchy Levels</h4>
                  <label>
                    <input 
                      type="checkbox" 
                      checked={visibleRows.cities} 
                      onChange={() => toggleRow('cities')} 
                    />
                    📍 Cities
                  </label>
                  <label>
                    <input 
                      type="checkbox" 
                      checked={visibleRows.projects} 
                      onChange={() => toggleRow('projects')}
                      disabled={!visibleRows.cities}
                    />
                    📁 Projects
                  </label>
                  <label>
                    <input 
                      type="checkbox" 
                      checked={visibleRows.unitTypes} 
                      onChange={() => toggleRow('unitTypes')}
                      disabled={!visibleRows.projects}
                    />
                    🏠 Unit Types
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="column-toggle" ref={columnDropdownRef}>
            <button className="control-btn" onClick={toggleColumnDropdown}>
              ⚙️ Columns {showColumnDropdown ? '▲' : '▼'}
            </button>
            {showColumnDropdown && (
              <div className="column-dropdown">
                <div className="dropdown-section">
                  <h4>Data Fields</h4>
                  {Object.keys(visibleColumns).map(key => (
                    <label key={key}>
                      <input
                        type="checkbox"
                        checked={visibleColumns[key]}
                        onChange={() => toggleColumn(key)}
                      />
                      {key === 'percentage' ? 'Percentage' :
                       key === 'noOfUnits' ? 'No. of Units' :
                       key === 'salesValue' ? 'Sales Value' : key}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pivot Table */}
      <div className="pivot-table-scroll" ref={pivotScrollRef}>
        <table className="pivot-table">
          <thead>
            <tr className="header-row">
              <th className="group-header">GROUP</th>
              {visibleColumns.percentage && <th>PERCENTAGE</th>}
              {visibleColumns.noOfUnits && <th>NO. OF UNITS</th>}
              {visibleColumns.salesValue && <th>SALES VALUE</th>}
            </tr>
          </thead>
          <tbody>
            {visibleRows.cities && pivotData.map(city => {
              const cityData = city.statusData[activeStatus] || { count: 0, value: 0 };
              const isCityExpanded = expandedCities[city.name] !== true;
              const cityHasExpandable = visibleRows.projects;

              return (
                <React.Fragment key={city.name}>
                  {/* City Row */}
                  {renderRow(
                    0,
                    `📍 ${city.name}`,
                    cityData,
                    city.totalUnits,
                    cityHasExpandable,
                    isCityExpanded,
                    () => toggleCity(city.name),
                    0
                  )}

                  {/* Projects */}
                  {visibleRows.projects && isCityExpanded && Object.values(city.projects).map(project => {
                    const projectKey = `${city.name}-${project.name}`;
                    const projectData = project.statusData[activeStatus] || { count: 0, value: 0 };
                    const isProjectExpanded = expandedProjects[projectKey];
                    const projectHasExpandable = visibleRows.unitTypes;

                    return (
                      <React.Fragment key={projectKey}>
                        {/* Project Row */}
                        {renderRow(
                          1,
                          `📁 ${project.name}`,
                          projectData,
                          project.totalUnits,
                          projectHasExpandable,
                          isProjectExpanded,
                          () => toggleProject(city.name, project.name),
                          1
                        )}

                        {/* Unit Types */}
                        {visibleRows.unitTypes && isProjectExpanded && Object.values(project.unitTypes).map(unitType => {
                          const typeKey = `${city.name}-${project.name}-${unitType.name}`;
                          const typeData = unitType.statusData[activeStatus] || { count: 0, value: 0 };
                          const isTypeExpanded = expandedTypes[typeKey];

                          return (
                            <React.Fragment key={typeKey}>
                              {/* Unit Type Row */}
                              {renderRow(
                                2,
                                `🏠 ${unitType.name}`,
                                typeData,
                                unitType.totalUnits,
                                false,
                                false,
                                () => toggleType(city.name, project.name, unitType.name),
                                2
                              )}
                            </React.Fragment>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvStatusPivot;