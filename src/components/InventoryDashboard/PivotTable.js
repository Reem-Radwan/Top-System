
import React, { useState, useMemo, useEffect, useRef } from 'react';
import './pivottable.css';


const PivotTable = ({ units }) => {
  // State for expand/collapse
  const [expandedCities, setExpandedCities] = useState({});
  const [expandedProjects, setExpandedProjects] = useState({});
  const [expandedTypes, setExpandedTypes] = useState({});
  
  // State for column visibility
  const [visibleColumns, setVisibleColumns] = useState({
    percentage: true,
    noOfUnits: true,
    sellableArea: true,
    salesValue: true,
    minPSM: true,
    avgPSM: true,
    maxPSM: true,
    minUnitPrice: true,
    avgUnitPrice: true,
    maxUnitPrice: true
  });

  // State for row visibility (hierarchy levels)
  const [visibleRows, setVisibleRows] = useState({
    cities: true,
    projects: true,
    unitTypes: true,
    areaRanges: true
  });

  // State for column dropdown visibility
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);
  
  // State for row dropdown visibility
  const [showRowDropdown, setShowRowDropdown] = useState(false);

  // State for active category (Sold/Unsold)
  const [activeCategory, setActiveCategory] = useState('unsold');

  // Refs for dropdown detection
  const columnDropdownRef = useRef(null);
  const rowDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
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
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Calculate hierarchical pivot data
  const pivotData = useMemo(() => {
    const cityMap = {};

    units.forEach(unit => {
      const city = unit.city || 'Unknown';
      const project = unit.project || 'Unknown';
      const unitType = unit.unit_type || 'Unknown';
      const areaRange = unit.area_range || 'Unknown';
      const status = unit.status || 'Unknown';
      
      // Determine if sold or unsold
      const isSold = status === 'Contracted' || status === 'Reserved';
      const category = isSold ? 'sold' : 'unsold';

      // Initialize city
      if (!cityMap[city]) {
        cityMap[city] = {
          name: city,
          sold: { units: [], count: 0, totalArea: 0, totalValue: 0 },
          unsold: { units: [], count: 0, totalArea: 0, totalValue: 0 },
          projects: {}
        };
      }

      // Add to city category
      cityMap[city][category].units.push(unit);
      cityMap[city][category].count++;
      cityMap[city][category].totalArea += parseFloat(unit.sellable_area) || 0;
      cityMap[city][category].totalValue += parseFloat(unit.sales_value) || 0;

      // Initialize project
      if (!cityMap[city].projects[project]) {
        cityMap[city].projects[project] = {
          name: project,
          sold: { units: [], count: 0, totalArea: 0, totalValue: 0 },
          unsold: { units: [], count: 0, totalArea: 0, totalValue: 0 },
          unitTypes: {}
        };
      }

      // Add to project category
      cityMap[city].projects[project][category].units.push(unit);
      cityMap[city].projects[project][category].count++;
      cityMap[city].projects[project][category].totalArea += parseFloat(unit.sellable_area) || 0;
      cityMap[city].projects[project][category].totalValue += parseFloat(unit.sales_value) || 0;

      // Initialize unit type
      if (!cityMap[city].projects[project].unitTypes[unitType]) {
        cityMap[city].projects[project].unitTypes[unitType] = {
          name: unitType,
          sold: { units: [], count: 0, totalArea: 0, totalValue: 0 },
          unsold: { units: [], count: 0, totalArea: 0, totalValue: 0 },
          areaRanges: {}
        };
      }

      // Add to unit type category
      cityMap[city].projects[project].unitTypes[unitType][category].units.push(unit);
      cityMap[city].projects[project].unitTypes[unitType][category].count++;
      cityMap[city].projects[project].unitTypes[unitType][category].totalArea += parseFloat(unit.sellable_area) || 0;
      cityMap[city].projects[project].unitTypes[unitType][category].totalValue += parseFloat(unit.sales_value) || 0;

      // Initialize area range
      if (!cityMap[city].projects[project].unitTypes[unitType].areaRanges[areaRange]) {
        cityMap[city].projects[project].unitTypes[unitType].areaRanges[areaRange] = {
          name: areaRange,
          sold: { units: [], count: 0, totalArea: 0, totalValue: 0 },
          unsold: { units: [], count: 0, totalArea: 0, totalValue: 0 }
        };
      }

      // Add to area range category
      const areaData = cityMap[city].projects[project].unitTypes[unitType].areaRanges[areaRange];
      areaData[category].units.push(unit);
      areaData[category].count++;
      areaData[category].totalArea += parseFloat(unit.sellable_area) || 0;
      areaData[category].totalValue += parseFloat(unit.sales_value) || 0;
    });

    return Object.values(cityMap);
  }, [units]);

  // Calculate metrics for a category
  const calculateMetrics = (categoryData, totalUnitsInLevel) => {
    if (!categoryData || categoryData.count === 0) {
      return {
        percentage: '0%',
        count: 0,
        totalArea: 0,
        totalValue: 0,
        minPSM: 0,
        avgPSM: 0,
        maxPSM: 0,
        minPrice: 0,
        avgPrice: 0,
        maxPrice: 0
      };
    }

    const { units, count, totalArea, totalValue } = categoryData;
    
    // Calculate PSM values
    const psmValues = units.map(u => parseFloat(u.psm) || 0).filter(v => v > 0);
    const priceValues = units.map(u => parseFloat(u.interest_free_unit_price) || 0).filter(v => v > 0);

    const totalUnits = count;
    // Calculate percentage based on TOTAL units in this level (sold + unsold)
    const percentage = totalUnitsInLevel > 0 ? ((count / totalUnitsInLevel) * 100).toFixed(2) : 0;

    return {
      percentage: `${percentage}%`,
      count: totalUnits,
      totalArea: Math.round(totalArea),
      totalValue: Math.round(totalValue),
      minPSM: psmValues.length > 0 ? Math.round(Math.min(...psmValues)) : 0,
      avgPSM: psmValues.length > 0 ? Math.round(psmValues.reduce((a, b) => a + b, 0) / psmValues.length) : 0,
      maxPSM: psmValues.length > 0 ? Math.round(Math.max(...psmValues)) : 0,
      minPrice: priceValues.length > 0 ? Math.round(Math.min(...priceValues)) : 0,
      avgPrice: priceValues.length > 0 ? Math.round(priceValues.reduce((a, b) => a + b, 0) / priceValues.length) : 0,
      maxPrice: priceValues.length > 0 ? Math.round(Math.max(...priceValues)) : 0
    };
  };

  // Format number with commas
  const formatNumber = (num) => {
    return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
  };

  // Toggle city expansion
//   const toggleCity = (cityName) => {
//     setExpandedCities(prev => ({
//       ...prev,
//       [cityName]: !prev[cityName]
//     }));
//   };

// Toggle city expansion
const toggleCity = (cityName) => {
  setExpandedCities(prev => ({
    ...prev,
    [cityName]: !(prev[cityName] === true) // Explicitly check for true
  }));
};

  // Toggle project expansion
  const toggleProject = (cityName, projectName) => {
    const key = `${cityName}-${projectName}`;
    setExpandedProjects(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Toggle unit type expansion
  const toggleType = (cityName, projectName, typeName) => {
    const key = `${cityName}-${projectName}-${typeName}`;
    setExpandedTypes(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Toggle column visibility
  const toggleColumn = (columnKey) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  // Toggle column dropdown visibility
  const toggleColumnDropdown = (e) => {
    e.stopPropagation();
    setShowColumnDropdown(prev => !prev);
    setShowRowDropdown(false);
  };

  // Toggle row dropdown visibility
  const toggleRowDropdown = (e) => {
    e.stopPropagation();
    setShowRowDropdown(prev => !prev);
    setShowColumnDropdown(false);
  };

  // Toggle row visibility
  const toggleRow = (rowKey) => {
    setVisibleRows(prev => ({
      ...prev,
      [rowKey]: !prev[rowKey]
    }));
  };

  // Expand all
  const expandAll = () => {
    const newExpandedCities = {};
    const newExpandedProjects = {};
    const newExpandedTypes = {};
    
    pivotData.forEach(city => {
      newExpandedCities[city.name] = true;
      Object.keys(city.projects).forEach(projectName => {
        const projectKey = `${city.name}-${projectName}`;
        newExpandedProjects[projectKey] = true;
        
        const project = city.projects[projectName];
        Object.keys(project.unitTypes).forEach(typeName => {
          const typeKey = `${city.name}-${projectName}-${typeName}`;
          newExpandedTypes[typeKey] = true;
        });
      });
    });
    
    setExpandedCities(newExpandedCities);
    setExpandedProjects(newExpandedProjects);
    setExpandedTypes(newExpandedTypes);
  };

  // Collapse all
  const collapseAll = () => {
    setExpandedCities({});
    setExpandedProjects({});
    setExpandedTypes({});
  };

  // Render row for any level
  const renderRow = (level, name, metrics, expandable, expanded, onToggle, indent = 0) => {
    return (
      <tr className={`pivot-row level-${level}`} key={name}>
        <td className="group-column" style={{ paddingLeft: `${indent * 20 + 10}px` }}>
          {expandable && (
            <button 
              className="expand-btn" 
              onClick={(e) => {
                e.stopPropagation();
                onToggle();
              }}
            >
              {expanded ? '▼' : '▶'}
            </button>
          )}
          <span className={`level-${level}-label`}>{name}</span>
        </td>
        {visibleColumns.percentage && <td className="metric-cell">{metrics.percentage}</td>}
        {visibleColumns.noOfUnits && <td className="metric-cell">{formatNumber(metrics.count)}</td>}
        {visibleColumns.sellableArea && <td className="metric-cell">{formatNumber(metrics.totalArea)}</td>}
        {visibleColumns.salesValue && <td className="metric-cell">{formatNumber(metrics.totalValue)}</td>}
        {visibleColumns.minPSM && <td className="metric-cell">{formatNumber(metrics.minPSM)}</td>}
        {visibleColumns.avgPSM && <td className="metric-cell">{formatNumber(metrics.avgPSM)}</td>}
        {visibleColumns.maxPSM && <td className="metric-cell">{formatNumber(metrics.maxPSM)}</td>}
        {visibleColumns.minUnitPrice && <td className="metric-cell">{formatNumber(metrics.minPrice)}</td>}
        {visibleColumns.avgUnitPrice && <td className="metric-cell">{formatNumber(metrics.avgPrice)}</td>}
        {visibleColumns.maxUnitPrice && <td className="metric-cell">{formatNumber(metrics.maxPrice)}</td>}
      </tr>
    );
  };

  return (
    <div className="pivot-table-container">
      {/* Controls */}
      <div className="pivot-controls">
        <div className="category-toggle">
          <button 
            className={`category-btn ${activeCategory === 'unsold' ? 'active' : ''}`}
            onClick={() => setActiveCategory('unsold')}
          >
            📦 UNSOLD
          </button>
          <button 
            className={`category-btn ${activeCategory === 'sold' ? 'active' : ''}`}
            onClick={() => setActiveCategory('sold')}
          >
            ✅ SOLD
          </button>
        </div>

        <div className="expand-controls">
          <button className="control-btn" onClick={expandAll}>▼ Expand All</button>
          <button className="control-btn" onClick={collapseAll}>▶ Collapse All</button>
        </div>

        <div className="dropdown-controls">
          {/* Rows/Fields Dropdown */}
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
                  <label>
                    <input 
                      type="checkbox" 
                      checked={visibleRows.areaRanges}
                      onChange={() => toggleRow('areaRanges')}
                      disabled={!visibleRows.unitTypes}
                    />
                    📏 Area Ranges
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Columns Dropdown */}
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
                       key === 'sellableArea' ? 'Sellable Area' :
                       key === 'salesValue' ? 'Sales Value' :
                       key === 'minPSM' ? 'Min PSM' :
                       key === 'avgPSM' ? 'Avg PSM' :
                       key === 'maxPSM' ? 'Max PSM' :
                       key === 'minUnitPrice' ? 'Min Unit Price' :
                       key === 'avgUnitPrice' ? 'Avg Unit Price' :
                       key === 'maxUnitPrice' ? 'Max Unit Price' :
                       key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pivot Table */}
      <div className="pivot-table-scroll">
        <table className="pivot-table">
          <thead>
            <tr className="header-row">
              <th className="group-header">GROUP</th>
              {visibleColumns.percentage && <th>PERCENTAGE</th>}
              {visibleColumns.noOfUnits && <th>NO. OF UNITS</th>}
              {visibleColumns.sellableArea && <th>SELLABLE AREA</th>}
              {visibleColumns.salesValue && <th>SALES VALUE</th>}
              {visibleColumns.minPSM && <th>MIN PSM</th>}
              {visibleColumns.avgPSM && <th>AVG PSM</th>}
              {visibleColumns.maxPSM && <th>MAX PSM</th>}
              {visibleColumns.minUnitPrice && <th>MIN UNIT PRICE</th>}
              {visibleColumns.avgUnitPrice && <th>AVG UNIT PRICE</th>}
              {visibleColumns.maxUnitPrice && <th>MAX UNIT PRICE</th>}
            </tr>
          </thead>
          <tbody>
            {visibleRows.cities && pivotData.map(city => {
              // Calculate total units in city (sold + unsold)
              const cityTotalUnits = city.sold.count + city.unsold.count;
              const cityMetrics = calculateMetrics(city[activeCategory], cityTotalUnits);
              const isCityExpanded = expandedCities[city.name] !== true// Default true
              const cityHasExpandable = visibleRows.projects; // City can expand if projects are visible

              return (
                <React.Fragment key={city.name}>
                  {/* City Row */}
                  {renderRow(
                    0, 
                    `📍 ${city.name}`, 
                    cityMetrics, 
                    cityHasExpandable, 
                    isCityExpanded,
                    () => toggleCity(city.name),
                    0
                  )}

                  {/* Projects */}
                  {visibleRows.projects && isCityExpanded && Object.values(city.projects).map(project => {
                    // Calculate total units in project (sold + unsold)
                    const projectTotalUnits = project.sold.count + project.unsold.count;
                    const projectMetrics = calculateMetrics(project[activeCategory], projectTotalUnits);
                    const projectKey = `${city.name}-${project.name}`;
                    const isProjectExpanded = expandedProjects[projectKey];
                    const projectHasExpandable = visibleRows.unitTypes; // Project can expand if unitTypes are visible

                    return (
                      <React.Fragment key={projectKey}>
                        {/* Project Row */}
                        {renderRow(
                          1,
                          `📁 ${project.name}`,
                          projectMetrics,
                          projectHasExpandable,
                          isProjectExpanded,
                          () => toggleProject(city.name, project.name),
                          1
                        )}

                        {/* Unit Types */}
                        {visibleRows.unitTypes && isProjectExpanded && Object.values(project.unitTypes).map(unitType => {
                          // Calculate total units in type (sold + unsold)
                          const typeTotalUnits = unitType.sold.count + unitType.unsold.count;
                          const typeMetrics = calculateMetrics(unitType[activeCategory], typeTotalUnits);
                          const typeKey = `${city.name}-${project.name}-${unitType.name}`;
                          const isTypeExpanded = expandedTypes[typeKey];
                          const typeHasExpandable = visibleRows.areaRanges; // Type can expand if areaRanges are visible

                          return (
                            <React.Fragment key={typeKey}>
                              {/* Unit Type Row */}
                              {renderRow(
                                2,
                                `🏠 ${unitType.name}`,
                                typeMetrics,
                                typeHasExpandable,
                                isTypeExpanded,
                                () => toggleType(city.name, project.name, unitType.name),
                                2
                              )}

                              {/* Area Ranges */}
                              {visibleRows.areaRanges && isTypeExpanded && Object.values(unitType.areaRanges).map(areaRange => {
                                // Calculate total units in area (sold + unsold)
                                const areaTotalUnits = areaRange.sold.count + areaRange.unsold.count;
                                const areaMetrics = calculateMetrics(areaRange[activeCategory], areaTotalUnits);

                                return renderRow(
                                  3,
                                  `📏 ${areaRange.name}`,
                                  areaMetrics,
                                  false,
                                  false,
                                  null,
                                  3
                                );
                              })}
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

export default PivotTable;
