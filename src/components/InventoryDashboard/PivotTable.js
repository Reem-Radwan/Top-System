// import React, { useState, useMemo, useEffect, useRef } from "react";
// import "./pivottable.css";

// const PivotTable = ({ units }) => {
//   // Initialize all cities as expanded by default
//   const [expandedCities, setExpandedCities] = useState(() => {
//     const initialExpanded = {};
//     return initialExpanded;
//   });

//   const [expandedProjects, setExpandedProjects] = useState({});
//   const [expandedTypes, setExpandedTypes] = useState({});

//   // State for column visibility
//   const [visibleColumns, setVisibleColumns] = useState({
//     percentage: true,
//     noOfUnits: true,
//     sellableArea: true,
//     salesValue: true,
//     minPSM: true,
//     avgPSM: true,
//     maxPSM: true,
//     minUnitPrice: true,
//     avgUnitPrice: true,
//     maxUnitPrice: true,
//   });

//   // State for row visibility (hierarchy levels)
//   const [visibleRows, setVisibleRows] = useState({
//     cities: true,
//     projects: true,
//     unitTypes: true,
//     areaRanges: true,
//   });

//   // State for column dropdown visibility
//   const [showColumnDropdown, setShowColumnDropdown] = useState(false);

//   // State for row dropdown visibility
//   const [showRowDropdown, setShowRowDropdown] = useState(false);

//   // State for active category (Sold/Unsold)
//   const [activeCategory, setActiveCategory] = useState("unsold");

//   // Refs for dropdown detection
//   const columnDropdownRef = useRef(null);
//   const rowDropdownRef = useRef(null);

//   // Ref for horizontal scroll reset (mobile)
//   const pivotScrollRef = useRef(null);

//   // Calculate hierarchical pivot data
//   const pivotData = useMemo(() => {
//     const cityMap = {};

//     units.forEach((unit) => {
//       const city = unit.city || "Unknown";
//       const project = unit.project || "Unknown";
//       const unitType = unit.unit_type || "Unknown";
//       const areaRange = unit.area_range || "Unknown";
//       const status = unit.status || "Unknown";

//       // Determine if sold or unsold
//       const isSold = status === "Contracted" || status === "Reserved";
//       const category = isSold ? "sold" : "unsold";

//       // Initialize city
//       if (!cityMap[city]) {
//         cityMap[city] = {
//           name: city,
//           sold: { units: [], count: 0, totalArea: 0, totalValue: 0 },
//           unsold: { units: [], count: 0, totalArea: 0, totalValue: 0 },
//           projects: {},
//         };
//       }

//       // Add to city category
//       cityMap[city][category].units.push(unit);
//       cityMap[city][category].count++;
//       cityMap[city][category].totalArea += parseFloat(unit.sellable_area) || 0;
//       cityMap[city][category].totalValue += parseFloat(unit.sales_value) || 0;

//       // Initialize project
//       if (!cityMap[city].projects[project]) {
//         cityMap[city].projects[project] = {
//           name: project,
//           sold: { units: [], count: 0, totalArea: 0, totalValue: 0 },
//           unsold: { units: [], count: 0, totalArea: 0, totalValue: 0 },
//           unitTypes: {},
//         };
//       }

//       // Add to project category
//       cityMap[city].projects[project][category].units.push(unit);
//       cityMap[city].projects[project][category].count++;
//       cityMap[city].projects[project][category].totalArea +=
//         parseFloat(unit.sellable_area) || 0;
//       cityMap[city].projects[project][category].totalValue +=
//         parseFloat(unit.sales_value) || 0;

//       // Initialize unit type
//       if (!cityMap[city].projects[project].unitTypes[unitType]) {
//         cityMap[city].projects[project].unitTypes[unitType] = {
//           name: unitType,
//           sold: { units: [], count: 0, totalArea: 0, totalValue: 0 },
//           unsold: { units: [], count: 0, totalArea: 0, totalValue: 0 },
//           areaRanges: {},
//         };
//       }

//       // Add to unit type category
//       cityMap[city].projects[project].unitTypes[unitType][category].units.push(
//         unit,
//       );
//       cityMap[city].projects[project].unitTypes[unitType][category].count++;
//       cityMap[city].projects[project].unitTypes[unitType][category].totalArea +=
//         parseFloat(unit.sellable_area) || 0;
//       cityMap[city].projects[project].unitTypes[unitType][
//         category
//       ].totalValue += parseFloat(unit.sales_value) || 0;

//       // Initialize area range
//       if (
//         !cityMap[city].projects[project].unitTypes[unitType].areaRanges[
//           areaRange
//         ]
//       ) {
//         cityMap[city].projects[project].unitTypes[unitType].areaRanges[
//           areaRange
//         ] = {
//           name: areaRange,
//           sold: { units: [], count: 0, totalArea: 0, totalValue: 0 },
//           unsold: { units: [], count: 0, totalArea: 0, totalValue: 0 },
//         };
//       }

//       // Add to area range category
//       const areaData =
//         cityMap[city].projects[project].unitTypes[unitType].areaRanges[
//           areaRange
//         ];
//       areaData[category].units.push(unit);
//       areaData[category].count++;
//       areaData[category].totalArea += parseFloat(unit.sellable_area) || 0;
//       areaData[category].totalValue += parseFloat(unit.sales_value) || 0;
//     });

//     return Object.values(cityMap);
//   }, [units]);

//   // Initialize all cities as expanded when component mounts or pivotData changes
//   useEffect(() => {
//     const initialExpandedCities = {};
//     pivotData.forEach((city) => {
//       initialExpandedCities[city.name] = true;
//     });
//     setExpandedCities(initialExpandedCities);
//   }, [pivotData]);

//   // Close dropdowns when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         columnDropdownRef.current &&
//         !columnDropdownRef.current.contains(event.target)
//       ) {
//         setShowColumnDropdown(false);
//       }
//       if (
//         rowDropdownRef.current &&
//         !rowDropdownRef.current.contains(event.target)
//       ) {
//         setShowRowDropdown(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // Ensure mobile horizontal scroll starts from the beginning
//   useEffect(() => {
//     if (pivotScrollRef.current) {
//       pivotScrollRef.current.scrollLeft = 0;
//     }
//   }, []);

//   // Calculate metrics for a category - memoized to prevent recalculations
//   const calculateMetrics = useMemo(() => {
//     return (categoryData, totalUnitsInLevel) => {
//       if (!categoryData || categoryData.count === 0) {
//         return {
//           percentage: "0%",
//           count: 0,
//           totalArea: 0,
//           totalValue: 0,
//           minPSM: 0,
//           avgPSM: 0,
//           maxPSM: 0,
//           minPrice: 0,
//           avgPrice: 0,
//           maxPrice: 0,
//         };
//       }

//       const { units, count, totalArea, totalValue } = categoryData;

//       // Calculate PSM values
//       const psmValues = units
//         .map((u) => parseFloat(u.psm) || 0)
//         .filter((v) => v > 0);
//       const priceValues = units
//         .map((u) => parseFloat(u.interest_free_unit_price) || 0)
//         .filter((v) => v > 0);

//       const totalUnits = count;
//       // Calculate percentage based on TOTAL units in this level (sold + unsold)
//       const percentage =
//         totalUnitsInLevel > 0
//           ? ((count / totalUnitsInLevel) * 100).toFixed(2)
//           : 0;

//       return {
//         percentage: `${percentage}%`,
//         count: totalUnits,
//         totalArea: Math.round(totalArea),
//         totalValue: Math.round(totalValue),
//         minPSM: psmValues.length > 0 ? Math.round(Math.min(...psmValues)) : 0,
//         avgPSM:
//           psmValues.length > 0
//             ? Math.round(
//                 psmValues.reduce((a, b) => a + b, 0) / psmValues.length,
//               )
//             : 0,
//         maxPSM: psmValues.length > 0 ? Math.round(Math.max(...psmValues)) : 0,
//         minPrice:
//           priceValues.length > 0 ? Math.round(Math.min(...priceValues)) : 0,
//         avgPrice:
//           priceValues.length > 0
//             ? Math.round(
//                 priceValues.reduce((a, b) => a + b, 0) / priceValues.length,
//               )
//             : 0,
//         maxPrice:
//           priceValues.length > 0 ? Math.round(Math.max(...priceValues)) : 0,
//       };
//     };
//   }, []);

//   // Format number with commas - memoized
//   const formatNumber = useMemo(() => {
//     return (num) => {
//       return num.toLocaleString("en-US", { maximumFractionDigits: 0 });
//     };
//   }, []);

//   // Toggle city expansion
//   const toggleCity = (cityName) => {
//     setExpandedCities((prev) => ({
//       ...prev,
//       [cityName]: !prev[cityName],
//     }));
//   };

//   // Toggle project expansion
//   const toggleProject = (cityName, projectName) => {
//     const key = `${cityName}-${projectName}`;
//     setExpandedProjects((prev) => ({
//       ...prev,
//       [key]: !prev[key],
//     }));
//   };

//   // Toggle unit type expansion
//   const toggleType = (cityName, projectName, typeName) => {
//     const key = `${cityName}-${projectName}-${typeName}`;
//     setExpandedTypes((prev) => ({
//       ...prev,
//       [key]: !prev[key],
//     }));
//   };

//   // Toggle column visibility
//   const toggleColumn = (columnKey) => {
//     setVisibleColumns((prev) => ({
//       ...prev,
//       [columnKey]: !prev[columnKey],
//     }));
//   };

//   // Toggle column dropdown visibility
//   const toggleColumnDropdown = (e) => {
//     e.stopPropagation();
//     setShowColumnDropdown((prev) => !prev);
//     setShowRowDropdown(false);
//   };

//   // Toggle row dropdown visibility
//   const toggleRowDropdown = (e) => {
//     e.stopPropagation();
//     setShowRowDropdown((prev) => !prev);
//     setShowColumnDropdown(false);
//   };

//   // Toggle row visibility
//   const toggleRow = (rowKey) => {
//     setVisibleRows((prev) => ({
//       ...prev,
//       [rowKey]: !prev[rowKey],
//     }));
//   };

//   // Expand all (cities, projects, and types)
//   const expandAll = () => {
//     const newExpandedCities = {};
//     const newExpandedProjects = {};
//     const newExpandedTypes = {};

//     pivotData.forEach((city) => {
//       newExpandedCities[city.name] = true;
//       Object.keys(city.projects).forEach((projectName) => {
//         const projectKey = `${city.name}-${projectName}`;
//         newExpandedProjects[projectKey] = true;

//         const project = city.projects[projectName];
//         Object.keys(project.unitTypes).forEach((typeName) => {
//           const typeKey = `${city.name}-${projectName}-${typeName}`;
//           newExpandedTypes[typeKey] = true;
//         });
//       });
//     });

//     setExpandedCities(newExpandedCities);
//     setExpandedProjects(newExpandedProjects);
//     setExpandedTypes(newExpandedTypes);
//   };

//   // Collapse everything to show only cities
//   const collapseAll = () => {
//     // Collapse all cities (hides projects and everything below)
//     setExpandedCities({});
//     setExpandedProjects({});
//     setExpandedTypes({});
//   };

//   // Collapse to show cities and projects only (initial/default state)
//   const collapseToProjectsOnly = () => {
//     // Expand all cities, collapse all projects and types
//     const newExpandedCities = {};
//     pivotData.forEach((city) => {
//       newExpandedCities[city.name] = true;
//     });
//     setExpandedCities(newExpandedCities);
//     setExpandedProjects({});
//     setExpandedTypes({});
//   };

//   // Check if everything is expanded - memoized for performance
//   const isEverythingExpanded = useMemo(() => {
//     // Check if all cities are expanded
//     const allCitiesExpanded = pivotData.every(
//       (city) => expandedCities[city.name],
//     );

//     // Check if all projects are expanded (for expanded cities)
//     let allProjectsExpanded = true;
//     pivotData.forEach((city) => {
//       if (expandedCities[city.name]) {
//         Object.keys(city.projects).forEach((projectName) => {
//           const projectKey = `${city.name}-${projectName}`;
//           if (!expandedProjects[projectKey]) {
//             allProjectsExpanded = false;
//           }
//         });
//       }
//     });

//     // Check if all types are expanded (for expanded projects)
//     let allTypesExpanded = true;
//     pivotData.forEach((city) => {
//       if (expandedCities[city.name]) {
//         Object.keys(city.projects).forEach((projectName) => {
//           const projectKey = `${city.name}-${projectName}`;
//           if (expandedProjects[projectKey]) {
//             const project = city.projects[projectName];
//             Object.keys(project.unitTypes).forEach((typeName) => {
//               const typeKey = `${city.name}-${projectName}-${typeName}`;
//               if (!expandedTypes[typeKey]) {
//                 allTypesExpanded = false;
//               }
//             });
//           }
//         });
//       }
//     });

//     return allCitiesExpanded && allProjectsExpanded && allTypesExpanded;
//   }, [pivotData, expandedCities, expandedProjects, expandedTypes]);

//   // Check if we're at the collapsed state (only cities visible)
//   const isEverythingCollapsed = useMemo(() => {
//     // Check if all cities are collapsed
//     const allCitiesCollapsed = pivotData.every(
//       (city) => !expandedCities[city.name],
//     );

//     // Check if all projects are collapsed
//     const allProjectsCollapsed = Object.keys(expandedProjects).length === 0;

//     // Check if all types are collapsed
//     const allTypesCollapsed = Object.keys(expandedTypes).length === 0;

//     return allCitiesCollapsed && allProjectsCollapsed && allTypesCollapsed;
//   }, [pivotData, expandedCities, expandedProjects, expandedTypes]);

//   // Check if we're at the default state (cities expanded, projects collapsed)
//   const isDefaultState = useMemo(() => {
//     // Check if all cities are expanded
//     const allCitiesExpanded = pivotData.every(
//       (city) => expandedCities[city.name],
//     );

//     // Check if all projects are collapsed
//     const allProjectsCollapsed = Object.keys(expandedProjects).length === 0;

//     // Check if all types are collapsed
//     const allTypesCollapsed = Object.keys(expandedTypes).length === 0;

//     return allCitiesExpanded && allProjectsCollapsed && allTypesCollapsed;
//   }, [pivotData, expandedCities, expandedProjects, expandedTypes]);

//   // Render row for any level - memoized callback
//   const renderRow = useMemo(() => {
//     return (
//       level,
//       name,
//       metrics,
//       expandable,
//       expanded,
//       onToggle,
//       indent = 0,
//     ) => {
//       return (
//         <tr className={`pivot-row level-${level}`} key={name}>
//           <td
//             className="group-column"
//             style={{ paddingLeft: `${indent * 20 + 10}px` }}
//           >
//             {expandable && (
//               <button
//                 className="expand-btn"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   e.preventDefault();
//                   onToggle();
//                 }}
//               >
//                 {expanded ? "▼" : "▶"}
//               </button>
//             )}
//             <span className={`level-${level}-label`}>{name}</span>
//           </td>
//           {visibleColumns.percentage && (
//             <td className="metric-cell">{metrics.percentage}</td>
//           )}
//           {visibleColumns.noOfUnits && (
//             <td className="metric-cell">{formatNumber(metrics.count)}</td>
//           )}
//           {visibleColumns.sellableArea && (
//             <td className="metric-cell">{formatNumber(metrics.totalArea)}</td>
//           )}
//           {visibleColumns.salesValue && (
//             <td className="metric-cell">{formatNumber(metrics.totalValue)}</td>
//           )}
//           {visibleColumns.minPSM && (
//             <td className="metric-cell">{formatNumber(metrics.minPSM)}</td>
//           )}
//           {visibleColumns.avgPSM && (
//             <td className="metric-cell">{formatNumber(metrics.avgPSM)}</td>
//           )}
//           {visibleColumns.maxPSM && (
//             <td className="metric-cell">{formatNumber(metrics.maxPSM)}</td>
//           )}
//           {visibleColumns.minUnitPrice && (
//             <td className="metric-cell">{formatNumber(metrics.minPrice)}</td>
//           )}
//           {visibleColumns.avgUnitPrice && (
//             <td className="metric-cell">{formatNumber(metrics.avgPrice)}</td>
//           )}
//           {visibleColumns.maxUnitPrice && (
//             <td className="metric-cell">{formatNumber(metrics.maxPrice)}</td>
//           )}
//         </tr>
//       );
//     };
//   }, [visibleColumns, formatNumber]);

//   // Set initial state to show cities expanded but projects collapsed
//   useEffect(() => {
//     if (pivotData.length > 0) {
//       collapseToProjectsOnly();
//     }
//   }, [pivotData]);

//   return (
//     <div
//   className={`soldtable-container ${activeCategory === "sold" ? "theme-unsold" : "theme-sold"}`}
// >
//       {/* Category Toggle - Centered */}
//       <div className="category-toggle centered-tabs">
//         <button
//           className={`category-btn ${activeCategory === "unsold" ? "active" : ""}`}
//           onClick={() => setActiveCategory("unsold")}
//         >
//           📦 UNSOLD
//         </button>

//         <button
//           className={`category-btn ${activeCategory === "sold" ? "active" : ""}`}
//           onClick={() => setActiveCategory("sold")}
//         >
//           ✅ SOLD
//         </button>
//       </div>

//       {/* Controls - Always on the left side */}
//       <div className="pivot-controls always-left-controls">
//         <div className="controls-group">
//           {/* Main control button - shows different actions based on state */}
//           {isEverythingCollapsed ? (
//             <button className="control-btn" onClick={collapseToProjectsOnly}>
//               ▼ Show Projects
//             </button>
//           ) : isDefaultState ? (
//             <button className="control-btn" onClick={expandAll}>
//               ▼ Expand All
//             </button>
//           ) : isEverythingExpanded ? (
//             <button className="control-btn" onClick={collapseAll}>
//               ◀ Collapse All
//             </button>
//           ) : (
//             <button className="control-btn" onClick={collapseAll}>
//               ◀ Collapse All
//             </button>
//           )}

//           {/* Rows/Fields Dropdown */}
//           <div className="row-toggle" ref={rowDropdownRef}>
//             <button className="control-btn" onClick={toggleRowDropdown}>
//               📋 Rows {showRowDropdown ? "▲" : "▼"}
//             </button>
//             {showRowDropdown && (
//               <div className="row-dropdown">
//                 <div className="dropdown-section">
//                   <h4>Hierarchy Levels</h4>
//                   <label>
//                     <input
//                       type="checkbox"
//                       checked={visibleRows.cities}
//                       onChange={() => toggleRow("cities")}
//                     />
//                     📍 Cities
//                   </label>
//                   <label>
//                     <input
//                       type="checkbox"
//                       checked={visibleRows.projects}
//                       onChange={() => toggleRow("projects")}
//                       disabled={!visibleRows.cities}
//                     />
//                     📁 Projects
//                   </label>
//                   <label>
//                     <input
//                       type="checkbox"
//                       checked={visibleRows.unitTypes}
//                       onChange={() => toggleRow("unitTypes")}
//                       disabled={!visibleRows.projects}
//                     />
//                     🏠 Unit Types
//                   </label>
//                   <label>
//                     <input
//                       type="checkbox"
//                       checked={visibleRows.areaRanges}
//                       onChange={() => toggleRow("areaRanges")}
//                       disabled={!visibleRows.unitTypes}
//                     />
//                     📏 Area Ranges
//                   </label>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Columns Dropdown */}
//           <div className="column-toggle" ref={columnDropdownRef}>
//             <button className="control-btn" onClick={toggleColumnDropdown}>
//               ⚙️ Columns {showColumnDropdown ? "▲" : "▼"}
//             </button>
//             {showColumnDropdown && (
//               <div className="column-dropdown">
//                 <div className="dropdown-section">
//                   <h4>Data Fields</h4>
//                   {Object.keys(visibleColumns).map((key) => (
//                     <label key={key}>
//                       <input
//                         type="checkbox"
//                         checked={visibleColumns[key]}
//                         onChange={() => toggleColumn(key)}
//                       />
//                       {key === "percentage"
//                         ? "%"
//                         : key === "noOfUnits"
//                           ? "Units"
//                           : key === "sellableArea"
//                             ? "Total Area"
//                             : key === "salesValue"
//                               ? " Total Sales"
//                               : key === "minPSM"
//                                 ? "Min PSM"
//                                 : key === "avgPSM"
//                                   ? "Avg PSM"
//                                   : key === "maxPSM"
//                                     ? "Max PSM"
//                                     : key === "minUnitPrice"
//                                       ? "Min Price"
//                                       : key === "avgUnitPrice"
//                                         ? "Avg Price"
//                                         : key === "maxUnitPrice"
//                                           ? "Max Price"
//                                           : key
//                                               .replace(/([A-Z])/g, " $1")
//                                               .trim()}
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
//         <table className="pivot-tables">
//           <thead>
//             <tr className="header-row">
//               <th className="group-header"></th>
//               {visibleColumns.percentage && <th className="col-group-1">%</th>}
//               {visibleColumns.noOfUnits && (
//                 <th className="col-group-1">UNITS</th>
//               )}
//               {visibleColumns.sellableArea && (
//                 <th className="col-group-1">TOTAL AREA</th>
//               )}
//               {visibleColumns.salesValue && (
//                 <th className="col-group-1">TOTAL SALES</th>
//               )}
//               {visibleColumns.minPSM && (
//                 <th className="col-group-2">MIN PSM</th>
//               )}
//               {visibleColumns.avgPSM && (
//                 <th className="col-group-2">AVG PSM</th>
//               )}
//               {visibleColumns.maxPSM && (
//                 <th className="col-group-2">MAX PSM</th>
//               )}
//               {visibleColumns.minUnitPrice && <th>MIN PRICE</th>}
//               {visibleColumns.avgUnitPrice && <th>AVG PRICE</th>}
//               {visibleColumns.maxUnitPrice && <th>MAX PRICE</th>}
//             </tr>
//           </thead>
//           <tbody>
//             {visibleRows.cities &&
//               pivotData.map((city) => {
//                 // Calculate total units in city (sold + unsold)
//                 const cityTotalUnits = city.sold.count + city.unsold.count;
//                 const cityMetrics = calculateMetrics(
//                   city[activeCategory],
//                   cityTotalUnits,
//                 );
//                 const isCityExpanded = expandedCities[city.name];
//                 const cityHasExpandable = visibleRows.projects; // City can expand if projects are visible

//                 return (
//                   <React.Fragment key={city.name}>
//                     {/* City Row */}
//                     {renderRow(
//                       0,
//                       `📍 ${city.name}`,
//                       cityMetrics,
//                       cityHasExpandable,
//                       isCityExpanded,
//                       () => toggleCity(city.name),
//                       0,
//                     )}

//                     {/* Projects */}
//                     {visibleRows.projects &&
//                       isCityExpanded &&
//                       Object.values(city.projects).map((project) => {
//                         // Calculate total units in project (sold + unsold)
//                         const projectTotalUnits =
//                           project.sold.count + project.unsold.count;
//                         const projectMetrics = calculateMetrics(
//                           project[activeCategory],
//                           projectTotalUnits,
//                         );
//                         const projectKey = `${city.name}-${project.name}`;
//                         const isProjectExpanded = expandedProjects[projectKey];
//                         const projectHasExpandable = visibleRows.unitTypes; // Project can expand if unitTypes are visible

//                         return (
//                           <React.Fragment key={projectKey}>
//                             {/* Project Row */}
//                             {renderRow(
//                               1,
//                               `📁 ${project.name}`,
//                               projectMetrics,
//                               projectHasExpandable,
//                               isProjectExpanded,
//                               () => toggleProject(city.name, project.name),
//                               1,
//                             )}

//                             {/* Unit Types */}
//                             {visibleRows.unitTypes &&
//                               isProjectExpanded &&
//                               Object.values(project.unitTypes).map(
//                                 (unitType) => {
//                                   // Calculate total units in type (sold + unsold)
//                                   const typeTotalUnits =
//                                     unitType.sold.count + unitType.unsold.count;
//                                   const typeMetrics = calculateMetrics(
//                                     unitType[activeCategory],
//                                     typeTotalUnits,
//                                   );
//                                   const typeKey = `${city.name}-${project.name}-${unitType.name}`;
//                                   const isTypeExpanded = expandedTypes[typeKey];
//                                   const typeHasExpandable =
//                                     visibleRows.areaRanges; // Type can expand if areaRanges are visible

//                                   return (
//                                     <React.Fragment key={typeKey}>
//                                       {/* Unit Type Row */}
//                                       {renderRow(
//                                         2,
//                                         `🏠 ${unitType.name}`,
//                                         typeMetrics,
//                                         typeHasExpandable,
//                                         isTypeExpanded,
//                                         () =>
//                                           toggleType(
//                                             city.name,
//                                             project.name,
//                                             unitType.name,
//                                           ),
//                                         2,
//                                       )}

//                                       {/* Area Ranges */}
//                                       {visibleRows.areaRanges &&
//                                         isTypeExpanded &&
//                                         Object.values(unitType.areaRanges).map(
//                                           (areaRange) => {
//                                             // Calculate total units in area (sold + unsold)
//                                             const areaTotalUnits =
//                                               areaRange.sold.count +
//                                               areaRange.unsold.count;
//                                             const areaMetrics =
//                                               calculateMetrics(
//                                                 areaRange[activeCategory],
//                                                 areaTotalUnits,
//                                               );

//                                             return renderRow(
//                                               3,
//                                               `📏 ${areaRange.name}`,
//                                               areaMetrics,
//                                               false,
//                                               false,
//                                               null,
//                                               3,
//                                             );
//                                           },
//                                         )}
//                                     </React.Fragment>
//                                   );
//                                 },
//                               )}
//                           </React.Fragment>
//                         );
//                       })}
//                   </React.Fragment>
//                 );
//               })}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default PivotTable;




















import React, { useState, useMemo, useEffect, useRef } from "react";
import "./pivottable.css"; // Changed CSS file name


const PivotTable = ({ units }) => {
  // Initialize all cities as expanded by default
  const [expandedCities, setExpandedCities] = useState(() => {
    const initialExpanded = {};
    return initialExpanded;
  });

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
    maxUnitPrice: true,
  });

  // State for row visibility (hierarchy levels)
  const [visibleRows, setVisibleRows] = useState({
    cities: true,
    projects: true,
    unitTypes: true,
    areaRanges: true,
  });

  // State for column dropdown visibility
  const [showColumnDropdown, setShowColumnDropdown] = useState(false);

  // State for row dropdown visibility
  const [showRowDropdown, setShowRowDropdown] = useState(false);

  // State for active category (Sold/Unsold)
  const [activeCategory, setActiveCategory] = useState("unsold");

  // Refs for dropdown detection
  const columnDropdownRef = useRef(null);
  const rowDropdownRef = useRef(null);

  // Ref for horizontal scroll reset (mobile)
  const pivotScrollRef = useRef(null);

  // Calculate hierarchical pivot data
  const pivotData = useMemo(() => {
    const cityMap = {};

    units.forEach((unit) => {
      const city = unit.city || "Unknown";
      const project = unit.project || "Unknown";
      const unitType = unit.unit_type || "Unknown";
      const areaRange = unit.area_range || "Unknown";
      const status = unit.status || "Unknown";

      // Determine if sold or unsold
      const isSold = status === "Contracted" || status === "Reserved";
      const category = isSold ? "sold" : "unsold";

      // Initialize city
      if (!cityMap[city]) {
        cityMap[city] = {
          name: city,
          sold: { units: [], count: 0, totalArea: 0, totalValue: 0 },
          unsold: { units: [], count: 0, totalArea: 0, totalValue: 0 },
          projects: {},
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
          unitTypes: {},
        };
      }

      // Add to project category
      cityMap[city].projects[project][category].units.push(unit);
      cityMap[city].projects[project][category].count++;
      cityMap[city].projects[project][category].totalArea +=
        parseFloat(unit.sellable_area) || 0;
      cityMap[city].projects[project][category].totalValue +=
        parseFloat(unit.sales_value) || 0;

      // Initialize unit type
      if (!cityMap[city].projects[project].unitTypes[unitType]) {
        cityMap[city].projects[project].unitTypes[unitType] = {
          name: unitType,
          sold: { units: [], count: 0, totalArea: 0, totalValue: 0 },
          unsold: { units: [], count: 0, totalArea: 0, totalValue: 0 },
          areaRanges: {},
        };
      }

      // Add to unit type category
      cityMap[city].projects[project].unitTypes[unitType][category].units.push(
        unit,
      );
      cityMap[city].projects[project].unitTypes[unitType][category].count++;
      cityMap[city].projects[project].unitTypes[unitType][category].totalArea +=
        parseFloat(unit.sellable_area) || 0;
      cityMap[city].projects[project].unitTypes[unitType][
        category
      ].totalValue += parseFloat(unit.sales_value) || 0;

      // Initialize area range
      if (
        !cityMap[city].projects[project].unitTypes[unitType].areaRanges[
          areaRange
        ]
      ) {
        cityMap[city].projects[project].unitTypes[unitType].areaRanges[
          areaRange
        ] = {
          name: areaRange,
          sold: { units: [], count: 0, totalArea: 0, totalValue: 0 },
          unsold: { units: [], count: 0, totalArea: 0, totalValue: 0 },
        };
      }

      // Add to area range category
      const areaData =
        cityMap[city].projects[project].unitTypes[unitType].areaRanges[
          areaRange
        ];
      areaData[category].units.push(unit);
      areaData[category].count++;
      areaData[category].totalArea += parseFloat(unit.sellable_area) || 0;
      areaData[category].totalValue += parseFloat(unit.sales_value) || 0;
    });

    return Object.values(cityMap);
  }, [units]);

  // Initialize all cities as expanded when component mounts or pivotData changes
  useEffect(() => {
    const initialExpandedCities = {};
    pivotData.forEach((city) => {
      initialExpandedCities[city.name] = true;
    });
    setExpandedCities(initialExpandedCities);
  }, [pivotData]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        columnDropdownRef.current &&
        !columnDropdownRef.current.contains(event.target)
      ) {
        setShowColumnDropdown(false);
      }
      if (
        rowDropdownRef.current &&
        !rowDropdownRef.current.contains(event.target)
      ) {
        setShowRowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Ensure mobile horizontal scroll starts from the beginning
  useEffect(() => {
    if (pivotScrollRef.current) {
      pivotScrollRef.current.scrollLeft = 0;
    }
  }, []);

  // Calculate metrics for a category - memoized to prevent recalculations
  const calculateMetrics = useMemo(() => {
    return (categoryData, totalUnitsInLevel) => {
      if (!categoryData || categoryData.count === 0) {
        return {
          percentage: "0%",
          count: 0,
          totalArea: 0,
          totalValue: 0,
          minPSM: 0,
          avgPSM: 0,
          maxPSM: 0,
          minPrice: 0,
          avgPrice: 0,
          maxPrice: 0,
        };
      }

      const { units, count, totalArea, totalValue } = categoryData;

      // Calculate PSM values
      const psmValues = units
        .map((u) => parseFloat(u.psm) || 0)
        .filter((v) => v > 0);
      const priceValues = units
        .map((u) => parseFloat(u.interest_free_unit_price) || 0)
        .filter((v) => v > 0);

      const totalUnits = count;
      // Calculate percentage based on TOTAL units in this level (sold + unsold)
      const percentage =
        totalUnitsInLevel > 0
          ? ((count / totalUnitsInLevel) * 100).toFixed(2)
          : 0;

      return {
        percentage: `${percentage}%`,
        count: totalUnits,
        totalArea: Math.round(totalArea),
        totalValue: Math.round(totalValue),
        minPSM: psmValues.length > 0 ? Math.round(Math.min(...psmValues)) : 0,
        avgPSM:
          psmValues.length > 0
            ? Math.round(
                psmValues.reduce((a, b) => a + b, 0) / psmValues.length,
              )
            : 0,
        maxPSM: psmValues.length > 0 ? Math.round(Math.max(...psmValues)) : 0,
        minPrice:
          priceValues.length > 0 ? Math.round(Math.min(...priceValues)) : 0,
        avgPrice:
          priceValues.length > 0
            ? Math.round(
                priceValues.reduce((a, b) => a + b, 0) / priceValues.length,
              )
            : 0,
        maxPrice:
          priceValues.length > 0 ? Math.round(Math.max(...priceValues)) : 0,
      };
    };
  }, []);

  // Format number with commas - memoized
  const formatNumber = useMemo(() => {
    return (num) => {
      return num.toLocaleString("en-US", { maximumFractionDigits: 0 });
    };
  }, []);

  // Toggle city expansion
  const toggleCity = (cityName) => {
    setExpandedCities((prev) => ({
      ...prev,
      [cityName]: !prev[cityName],
    }));
  };

  // Toggle project expansion
  const toggleProject = (cityName, projectName) => {
    const key = `${cityName}-${projectName}`;
    setExpandedProjects((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Toggle unit type expansion
  const toggleType = (cityName, projectName, typeName) => {
    const key = `${cityName}-${projectName}-${typeName}`;
    setExpandedTypes((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Toggle column visibility
  const toggleColumn = (columnKey) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [columnKey]: !prev[columnKey],
    }));
  };

  // Toggle column dropdown visibility
  const toggleColumnDropdown = (e) => {
    e.stopPropagation();
    setShowColumnDropdown((prev) => !prev);
    setShowRowDropdown(false);
  };

  // Toggle row dropdown visibility
  const toggleRowDropdown = (e) => {
    e.stopPropagation();
    setShowRowDropdown((prev) => !prev);
    setShowColumnDropdown(false);
  };

  // Toggle row visibility
  const toggleRow = (rowKey) => {
    setVisibleRows((prev) => ({
      ...prev,
      [rowKey]: !prev[rowKey],
    }));
  };

  // Expand all (cities, projects, and types)
  const expandAll = () => {
    const newExpandedCities = {};
    const newExpandedProjects = {};
    const newExpandedTypes = {};

    pivotData.forEach((city) => {
      newExpandedCities[city.name] = true;
      Object.keys(city.projects).forEach((projectName) => {
        const projectKey = `${city.name}-${projectName}`;
        newExpandedProjects[projectKey] = true;

        const project = city.projects[projectName];
        Object.keys(project.unitTypes).forEach((typeName) => {
          const typeKey = `${city.name}-${projectName}-${typeName}`;
          newExpandedTypes[typeKey] = true;
        });
      });
    });

    setExpandedCities(newExpandedCities);
    setExpandedProjects(newExpandedProjects);
    setExpandedTypes(newExpandedTypes);
  };

  // Collapse everything to show only cities
  const collapseAll = () => {
    // Collapse all cities (hides projects and everything below)
    setExpandedCities({});
    setExpandedProjects({});
    setExpandedTypes({});
  };

  // Collapse to show cities and projects only (initial/default state)
  const collapseToProjectsOnly = () => {
    // Expand all cities, collapse all projects and types
    const newExpandedCities = {};
    pivotData.forEach((city) => {
      newExpandedCities[city.name] = true;
    });
    setExpandedCities(newExpandedCities);
    setExpandedProjects({});
    setExpandedTypes({});
  };

  // Check if everything is expanded - memoized for performance
  const isEverythingExpanded = useMemo(() => {
    // Check if all cities are expanded
    const allCitiesExpanded = pivotData.every(
      (city) => expandedCities[city.name],
    );

    // Check if all projects are expanded (for expanded cities)
    let allProjectsExpanded = true;
    pivotData.forEach((city) => {
      if (expandedCities[city.name]) {
        Object.keys(city.projects).forEach((projectName) => {
          const projectKey = `${city.name}-${projectName}`;
          if (!expandedProjects[projectKey]) {
            allProjectsExpanded = false;
          }
        });
      }
    });

    // Check if all types are expanded (for expanded projects)
    let allTypesExpanded = true;
    pivotData.forEach((city) => {
      if (expandedCities[city.name]) {
        Object.keys(city.projects).forEach((projectName) => {
          const projectKey = `${city.name}-${projectName}`;
          if (expandedProjects[projectKey]) {
            const project = city.projects[projectName];
            Object.keys(project.unitTypes).forEach((typeName) => {
              const typeKey = `${city.name}-${projectName}-${typeName}`;
              if (!expandedTypes[typeKey]) {
                allTypesExpanded = false;
              }
            });
          }
        });
      }
    });

    return allCitiesExpanded && allProjectsExpanded && allTypesExpanded;
  }, [pivotData, expandedCities, expandedProjects, expandedTypes]);

  // Check if we're at the collapsed state (only cities visible)
  const isEverythingCollapsed = useMemo(() => {
    // Check if all cities are collapsed
    const allCitiesCollapsed = pivotData.every(
      (city) => !expandedCities[city.name],
    );

    // Check if all projects are collapsed
    const allProjectsCollapsed = Object.keys(expandedProjects).length === 0;

    // Check if all types are collapsed
    const allTypesCollapsed = Object.keys(expandedTypes).length === 0;

    return allCitiesCollapsed && allProjectsCollapsed && allTypesCollapsed;
  }, [pivotData, expandedCities, expandedProjects, expandedTypes]);

  // Check if we're at the default state (cities expanded, projects collapsed)
  const isDefaultState = useMemo(() => {
    // Check if all cities are expanded
    const allCitiesExpanded = pivotData.every(
      (city) => expandedCities[city.name],
    );

    // Check if all projects are collapsed
    const allProjectsCollapsed = Object.keys(expandedProjects).length === 0;

    // Check if all types are collapsed
    const allTypesCollapsed = Object.keys(expandedTypes).length === 0;

    return allCitiesExpanded && allProjectsCollapsed && allTypesCollapsed;
  }, [pivotData, expandedCities, expandedProjects, expandedTypes]);

  // Render row for any level - memoized callback
  const renderRow = useMemo(() => {
    return (
      level,
      name,
      metrics,
      expandable,
      expanded,
      onToggle,
      indent = 0,
    ) => {
      return (
        <tr className={`pivot-row level-${level}`} key={name}>
          <td
            className="group-column"
            style={{ paddingLeft: `${indent * 20 + 10}px` }}
          >
            {expandable && (
              <button
                className="expand-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onToggle();
                }}
              >
                {expanded ? "▼" : "▶"}
              </button>
            )}
            <span className={`level-${level}-label`}>{name}</span>
          </td>
          {visibleColumns.percentage && (
            <td className="metric-cell">{metrics.percentage}</td>
          )}
          {visibleColumns.noOfUnits && (
            <td className="metric-cell">{formatNumber(metrics.count)}</td>
          )}
          {visibleColumns.sellableArea && (
            <td className="metric-cell">{formatNumber(metrics.totalArea)}</td>
          )}
          {visibleColumns.salesValue && (
            <td className="metric-cell">{formatNumber(metrics.totalValue)}</td>
          )}
          {visibleColumns.minPSM && (
            <td className="metric-cell">{formatNumber(metrics.minPSM)}</td>
          )}
          {visibleColumns.avgPSM && (
            <td className="metric-cell">{formatNumber(metrics.avgPSM)}</td>
          )}
          {visibleColumns.maxPSM && (
            <td className="metric-cell">{formatNumber(metrics.maxPSM)}</td>
          )}
          {visibleColumns.minUnitPrice && (
            <td className="metric-cell">{formatNumber(metrics.minPrice)}</td>
          )}
          {visibleColumns.avgUnitPrice && (
            <td className="metric-cell">{formatNumber(metrics.avgPrice)}</td>
          )}
          {visibleColumns.maxUnitPrice && (
            <td className="metric-cell">{formatNumber(metrics.maxPrice)}</td>
          )}
        </tr>
      );
    };
  }, [visibleColumns, formatNumber]);

  // Set initial state to show cities expanded but projects collapsed
  useEffect(() => {
    if (pivotData.length > 0) {
      collapseToProjectsOnly();
    }
  }, [pivotData]);
  return (
    <div
      className={`pivot-unique-container ${activeCategory === "sold" ? "pivot-theme-unsold" : "pivot-theme-sold"}`}
    >
      {/* Category Toggle */}
      <div className="pivot-category-toggle pivot-centered-tabs">
        <button
          className={`pivot-category-btn ${activeCategory === "unsold" ? "pivot-active" : ""}`}
          onClick={() => setActiveCategory("unsold")}
        >
          📦 UNSOLD
        </button>

        <button
          className={`pivot-category-btn ${activeCategory === "sold" ? "pivot-active" : ""}`}
          onClick={() => setActiveCategory("sold")}
        >
          ✅ SOLD
        </button>
      </div>

      {/* Controls */}
      <div className="pivot-controls-always-left">
        <div className="pivot-controls-group">
          {/* Main control button */}
          {isEverythingCollapsed ? (
            <button className="pivot-control-btn" onClick={collapseToProjectsOnly}>
              ▼ Show Projects
            </button>
          ) : isDefaultState ? (
            <button className="pivot-control-btn" onClick={expandAll}>
              ▼ Expand All
            </button>
          ) : isEverythingExpanded ? (
            <button className="pivot-control-btn" onClick={collapseAll}>
              ◀ Collapse All
            </button>
          ) : (
            <button className="pivot-control-btn" onClick={collapseAll}>
              ◀ Collapse All
            </button>
          )}

          {/* Rows/Fields Dropdown */}
          <div className="pivot-row-toggle" ref={rowDropdownRef}>
            <button className="pivot-control-btn" onClick={toggleRowDropdown}>
              📋 Rows {showRowDropdown ? "▲" : "▼"}
            </button>
            {showRowDropdown && (
              <div className="pivot-row-dropdown">
                <div className="pivot-dropdown-section">
                  <h4>Hierarchy Levels</h4>
                  <label className="pivot-dropdown-label">
                    <input
                      type="checkbox"
                      checked={visibleRows.cities}
                      onChange={() => toggleRow("cities")}
                    />
                    📍 Cities
                  </label>
                  <label className="pivot-dropdown-label">
                    <input
                      type="checkbox"
                      checked={visibleRows.projects}
                      onChange={() => toggleRow("projects")}
                      disabled={!visibleRows.cities}
                    />
                    📁 Projects
                  </label>
                  <label className="pivot-dropdown-label">
                    <input
                      type="checkbox"
                      checked={visibleRows.unitTypes}
                      onChange={() => toggleRow("unitTypes")}
                      disabled={!visibleRows.projects}
                    />
                    🏠 Unit Types
                  </label>
                  <label className="pivot-dropdown-label">
                    <input
                      type="checkbox"
                      checked={visibleRows.areaRanges}
                      onChange={() => toggleRow("areaRanges")}
                      disabled={!visibleRows.unitTypes}
                    />
                    📏 Area Ranges
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Columns Dropdown */}
          <div className="pivot-column-toggle" ref={columnDropdownRef}>
            <button className="pivot-control-btn" onClick={toggleColumnDropdown}>
              ⚙️ Columns {showColumnDropdown ? "▲" : "▼"}
            </button>
            {showColumnDropdown && (
              <div className="pivot-column-dropdown">
                <div className="pivot-dropdown-section">
                  <h4>Data Fields</h4>
                  {Object.keys(visibleColumns).map((key) => (
                    <label className="pivot-dropdown-label" key={key}>
                      <input
                        type="checkbox"
                        checked={visibleColumns[key]}
                        onChange={() => toggleColumn(key)}
                      />
                      {key === "percentage"
                        ? "%"
                        : key === "noOfUnits"
                          ? "Units"
                          : key === "sellableArea"
                            ? "Total Area"
                            : key === "salesValue"
                              ? " Total Sales"
                              : key === "minPSM"
                                ? "Min PSM"
                                : key === "avgPSM"
                                  ? "Avg PSM"
                                  : key === "maxPSM"
                                    ? "Max PSM"
                                    : key === "minUnitPrice"
                                      ? "Min Price"
                                      : key === "avgUnitPrice"
                                        ? "Avg Price"
                                        : key === "maxUnitPrice"
                                          ? "Max Price"
                                          : key
                                              .replace(/([A-Z])/g, " $1")
                                              .trim()}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pivot Table */}
      <div className="pivot-table-scroll-container" ref={pivotScrollRef}>
        <table className="pivot-unique-table">
          <thead>
            <tr className="pivot-header-row">
              <th className="pivot-group-header"></th>
              {visibleColumns.percentage && <th className="pivot-col-group-1">%</th>}
              {visibleColumns.noOfUnits && (
                <th className="pivot-col-group-1">UNITS</th>
              )}
              {visibleColumns.sellableArea && (
                <th className="pivot-col-group-1">TOTAL AREA</th>
              )}
              {visibleColumns.salesValue && (
                <th className="pivot-col-group-1">TOTAL SALES</th>
              )}
              {visibleColumns.minPSM && (
                <th className="pivot-col-group-2">MIN PSM</th>
              )}
              {visibleColumns.avgPSM && (
                <th className="pivot-col-group-2">AVG PSM</th>
              )}
              {visibleColumns.maxPSM && (
                <th className="pivot-col-group-2">MAX PSM</th>
              )}
              {visibleColumns.minUnitPrice && <th className="pivot-min-price-header">MIN PRICE</th>}
              {visibleColumns.avgUnitPrice && <th className="pivot-avg-price-header">AVG PRICE</th>}
              {visibleColumns.maxUnitPrice && <th className="pivot-max-price-header">MAX PRICE</th>}
            </tr>
          </thead>
          <tbody>
            {visibleRows.cities &&
              pivotData.map((city) => {
                const cityTotalUnits = city.sold.count + city.unsold.count;
                const cityMetrics = calculateMetrics(
                  city[activeCategory],
                  cityTotalUnits,
                );
                const isCityExpanded = expandedCities[city.name];
                const cityHasExpandable = visibleRows.projects;

                return (
                  <React.Fragment key={city.name}>
                    {/* City Row */}
                    <tr className={`pivot-row pivot-level-0`} key={city.name}>
                      <td
                        className="pivot-group-column"
                        style={{ paddingLeft: `${0 * 20 + 10}px` }}
                      >
                        {cityHasExpandable && (
                          <button
                            className="pivot-expand-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              toggleCity(city.name);
                            }}
                          >
                            {isCityExpanded ? "▼" : "▶"}
                          </button>
                        )}
                        <span className="pivot-level-0-label">📍 {city.name}</span>
                      </td>
                      {visibleColumns.percentage && (
                        <td className="pivot-metric-cell">{cityMetrics.percentage}</td>
                      )}
                      {visibleColumns.noOfUnits && (
                        <td className="pivot-metric-cell">{formatNumber(cityMetrics.count)}</td>
                      )}
                      {visibleColumns.sellableArea && (
                        <td className="pivot-metric-cell">{formatNumber(cityMetrics.totalArea)}</td>
                      )}
                      {visibleColumns.salesValue && (
                        <td className="pivot-metric-cell">{formatNumber(cityMetrics.totalValue)}</td>
                      )}
                      {visibleColumns.minPSM && (
                        <td className="pivot-metric-cell">{formatNumber(cityMetrics.minPSM)}</td>
                      )}
                      {visibleColumns.avgPSM && (
                        <td className="pivot-metric-cell">{formatNumber(cityMetrics.avgPSM)}</td>
                      )}
                      {visibleColumns.maxPSM && (
                        <td className="pivot-metric-cell">{formatNumber(cityMetrics.maxPSM)}</td>
                      )}
                      {visibleColumns.minUnitPrice && (
                        <td className="pivot-metric-cell">{formatNumber(cityMetrics.minPrice)}</td>
                      )}
                      {visibleColumns.avgUnitPrice && (
                        <td className="pivot-metric-cell">{formatNumber(cityMetrics.avgPrice)}</td>
                      )}
                      {visibleColumns.maxUnitPrice && (
                        <td className="pivot-metric-cell">{formatNumber(cityMetrics.maxPrice)}</td>
                      )}
                    </tr>

                    {/* Projects */}
                    {visibleRows.projects &&
                      isCityExpanded &&
                      Object.values(city.projects).map((project) => {
                        const projectTotalUnits = project.sold.count + project.unsold.count;
                        const projectMetrics = calculateMetrics(
                          project[activeCategory],
                          projectTotalUnits,
                        );
                        const projectKey = `${city.name}-${project.name}`;
                        const isProjectExpanded = expandedProjects[projectKey];
                        const projectHasExpandable = visibleRows.unitTypes;

                        return (
                          <React.Fragment key={projectKey}>
                            {/* Project Row */}
                            <tr className={`pivot-row pivot-level-1`}>
                              <td
                                className="pivot-group-column"
                                style={{ paddingLeft: `${1 * 20 + 10}px` }}
                              >
                                {projectHasExpandable && (
                                  <button
                                    className="pivot-expand-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      e.preventDefault();
                                      toggleProject(city.name, project.name);
                                    }}
                                  >
                                    {isProjectExpanded ? "▼" : "▶"}
                                  </button>
                                )}
                                <span className="pivot-level-1-label">📁 {project.name}</span>
                              </td>
                              {visibleColumns.percentage && (
                                <td className="pivot-metric-cell">{projectMetrics.percentage}</td>
                              )}
                              {visibleColumns.noOfUnits && (
                                <td className="pivot-metric-cell">{formatNumber(projectMetrics.count)}</td>
                              )}
                              {visibleColumns.sellableArea && (
                                <td className="pivot-metric-cell">{formatNumber(projectMetrics.totalArea)}</td>
                              )}
                              {visibleColumns.salesValue && (
                                <td className="pivot-metric-cell">{formatNumber(projectMetrics.totalValue)}</td>
                              )}
                              {visibleColumns.minPSM && (
                                <td className="pivot-metric-cell">{formatNumber(projectMetrics.minPSM)}</td>
                              )}
                              {visibleColumns.avgPSM && (
                                <td className="pivot-metric-cell">{formatNumber(projectMetrics.avgPSM)}</td>
                              )}
                              {visibleColumns.maxPSM && (
                                <td className="pivot-metric-cell">{formatNumber(projectMetrics.maxPSM)}</td>
                              )}
                              {visibleColumns.minUnitPrice && (
                                <td className="pivot-metric-cell">{formatNumber(projectMetrics.minPrice)}</td>
                              )}
                              {visibleColumns.avgUnitPrice && (
                                <td className="pivot-metric-cell">{formatNumber(projectMetrics.avgPrice)}</td>
                              )}
                              {visibleColumns.maxUnitPrice && (
                                <td className="pivot-metric-cell">{formatNumber(projectMetrics.maxPrice)}</td>
                              )}
                            </tr>

                            {/* Unit Types */}
                            {visibleRows.unitTypes &&
                              isProjectExpanded &&
                              Object.values(project.unitTypes).map(
                                (unitType) => {
                                  const typeTotalUnits = unitType.sold.count + unitType.unsold.count;
                                  const typeMetrics = calculateMetrics(
                                    unitType[activeCategory],
                                    typeTotalUnits,
                                  );
                                  const typeKey = `${city.name}-${project.name}-${unitType.name}`;
                                  const isTypeExpanded = expandedTypes[typeKey];
                                  const typeHasExpandable = visibleRows.areaRanges;

                                  return (
                                    <React.Fragment key={typeKey}>
                                      {/* Unit Type Row */}
                                      <tr className={`pivot-row pivot-level-2`}>
                                        <td
                                          className="pivot-group-column"
                                          style={{ paddingLeft: `${2 * 20 + 10}px` }}
                                        >
                                          {typeHasExpandable && (
                                            <button
                                              className="pivot-expand-btn"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                toggleType(city.name, project.name, unitType.name);
                                              }}
                                            >
                                              {isTypeExpanded ? "▼" : "▶"}
                                            </button>
                                          )}
                                          <span className="pivot-level-2-label">🏠 {unitType.name}</span>
                                        </td>
                                        {visibleColumns.percentage && (
                                          <td className="pivot-metric-cell">{typeMetrics.percentage}</td>
                                        )}
                                        {visibleColumns.noOfUnits && (
                                          <td className="pivot-metric-cell">{formatNumber(typeMetrics.count)}</td>
                                        )}
                                        {visibleColumns.sellableArea && (
                                          <td className="pivot-metric-cell">{formatNumber(typeMetrics.totalArea)}</td>
                                        )}
                                        {visibleColumns.salesValue && (
                                          <td className="pivot-metric-cell">{formatNumber(typeMetrics.totalValue)}</td>
                                        )}
                                        {visibleColumns.minPSM && (
                                          <td className="pivot-metric-cell">{formatNumber(typeMetrics.minPSM)}</td>
                                        )}
                                        {visibleColumns.avgPSM && (
                                          <td className="pivot-metric-cell">{formatNumber(typeMetrics.avgPSM)}</td>
                                        )}
                                        {visibleColumns.maxPSM && (
                                          <td className="pivot-metric-cell">{formatNumber(typeMetrics.maxPSM)}</td>
                                        )}
                                        {visibleColumns.minUnitPrice && (
                                          <td className="pivot-metric-cell">{formatNumber(typeMetrics.minPrice)}</td>
                                        )}
                                        {visibleColumns.avgUnitPrice && (
                                          <td className="pivot-metric-cell">{formatNumber(typeMetrics.avgPrice)}</td>
                                        )}
                                        {visibleColumns.maxUnitPrice && (
                                          <td className="pivot-metric-cell">{formatNumber(typeMetrics.maxPrice)}</td>
                                        )}
                                      </tr>

                                      {/* Area Ranges */}
                                      {visibleRows.areaRanges &&
                                        isTypeExpanded &&
                                        Object.values(unitType.areaRanges).map(
                                          (areaRange) => {
                                            const areaTotalUnits = areaRange.sold.count + areaRange.unsold.count;
                                            const areaMetrics = calculateMetrics(
                                              areaRange[activeCategory],
                                              areaTotalUnits,
                                            );

                                            return (
                                              <tr className={`pivot-row pivot-level-3`} key={areaRange.name}>
                                                <td
                                                  className="pivot-group-column"
                                                  style={{ paddingLeft: `${3 * 20 + 10}px` }}
                                                >
                                                  <span className="pivot-level-3-label">📏 {areaRange.name}</span>
                                                </td>
                                                {visibleColumns.percentage && (
                                                  <td className="pivot-metric-cell">{areaMetrics.percentage}</td>
                                                )}
                                                {visibleColumns.noOfUnits && (
                                                  <td className="pivot-metric-cell">{formatNumber(areaMetrics.count)}</td>
                                                )}
                                                {visibleColumns.sellableArea && (
                                                  <td className="pivot-metric-cell">{formatNumber(areaMetrics.totalArea)}</td>
                                                )}
                                                {visibleColumns.salesValue && (
                                                  <td className="pivot-metric-cell">{formatNumber(areaMetrics.totalValue)}</td>
                                                )}
                                                {visibleColumns.minPSM && (
                                                  <td className="pivot-metric-cell">{formatNumber(areaMetrics.minPSM)}</td>
                                                )}
                                                {visibleColumns.avgPSM && (
                                                  <td className="pivot-metric-cell">{formatNumber(areaMetrics.avgPSM)}</td>
                                                )}
                                                {visibleColumns.maxPSM && (
                                                  <td className="pivot-metric-cell">{formatNumber(areaMetrics.maxPSM)}</td>
                                                )}
                                                {visibleColumns.minUnitPrice && (
                                                  <td className="pivot-metric-cell">{formatNumber(areaMetrics.minPrice)}</td>
                                                )}
                                                {visibleColumns.avgUnitPrice && (
                                                  <td className="pivot-metric-cell">{formatNumber(areaMetrics.avgPrice)}</td>
                                                )}
                                                {visibleColumns.maxUnitPrice && (
                                                  <td className="pivot-metric-cell">{formatNumber(areaMetrics.maxPrice)}</td>
                                                )}
                                              </tr>
                                            );
                                          },
                                        )}
                                    </React.Fragment>
                                  );
                                },
                              )}
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

