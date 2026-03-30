
// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import Swal from 'sweetalert2';
// import './cataloge.css';
// import { mockUnits, mockCompanies } from '../../data/catalogedata';

// /* ─────────────────────────────────────────────
//    HELPER COMPONENTS
// ───────────────────────────────────────────── */

// const StatusBadge = ({ status }) => {
//   const st = (status || '').toLowerCase();
//   let cls = 'status-cell status-default';
//   if (st.includes('available'))                                                      cls = 'status-cell status-available';
//   else if (st.includes('blocked'))                                                   cls = 'status-cell status-blocked';
//   else if (st.includes('contracted') || st.includes('reserved') || st.includes('sold'))
//                                                                                      cls = 'status-cell status-booked';
//   return <span className={cls}>{status || 'Available'}</span>;
// };

// const FinishingBadge = ({ finishing }) => {
//   const fin = finishing || 'Standard';
//   const fl  = fin.toLowerCase();
//   let cls = 'finishing-cell finishing-standard';
//   if      (fl.includes('ultra'))                                                     cls = 'finishing-cell finishing-ultra';
//   else if (fl.includes('luxury'))                                                    cls = 'finishing-cell finishing-luxury';
//   else if (fl.includes('premium'))                                                   cls = 'finishing-cell finishing-premium';
//   else if (fl.includes('fully finished') || fl.includes('finished'))                cls = 'finishing-cell finishing-finished';
//   else if (fl.includes('core') || fl.includes('shell'))                             cls = 'finishing-cell finishing-core';
//   return <span className={cls}>{fin}</span>;
// };

// /* ── Pagination ── */
// const Pagination = ({ totalItems, currentPage, rowsPerPage, onPageChange }) => {
//   const totalPages = Math.ceil(totalItems / rowsPerPage);
//   if (totalPages <= 1) return null;

//   const startIdx = (currentPage - 1) * rowsPerPage + 1;
//   const endIdx   = Math.min(currentPage * rowsPerPage, totalItems);

//   let s = Math.max(1, currentPage - 2);
//   let e = Math.min(totalPages, currentPage + 2);
//   if (s === 1) e = Math.min(5, totalPages);
//   if (e === totalPages) s = Math.max(1, totalPages - 4);

//   const pages = [];
//   for (let i = s; i <= e; i++) pages.push(i);

//   return (
//     <div className="pagination-wrapper">
//       <div className="text-muted small">
//         Showing <b>{startIdx}</b> to <b>{endIdx}</b> of <b>{totalItems}</b> units
//       </div>
//       <nav>
//         <ul className="pagination mb-0">
//           <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
//             <button className="page-link" onClick={() => onPageChange(Math.max(1, currentPage - 1))}>Previous</button>
//           </li>

//           {s > 1 && (
//             <>
//               <li className="page-item"><button className="page-link" onClick={() => onPageChange(1)}>1</button></li>
//               {s > 2 && <li className="page-item disabled"><button className="page-link">...</button></li>}
//             </>
//           )}

//           {pages.map(p => (
//             <li key={p} className={`page-item ${p === currentPage ? 'active' : ''}`}>
//               <button className="page-link" onClick={() => onPageChange(p)}>{p}</button>
//             </li>
//           ))}

//           {e < totalPages && (
//             <>
//               {e < totalPages - 1 && <li className="page-item disabled"><button className="page-link">...</button></li>}
//               <li className="page-item"><button className="page-link" onClick={() => onPageChange(totalPages)}>{totalPages}</button></li>
//             </>
//           )}

//           <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
//             <button className="page-link" onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}>Next</button>
//           </li>
//         </ul>
//       </nav>
//     </div>
//   );
// };

// /* ── Layout / Brochure Modal ── */
// const LayoutModal = ({ images, onClose }) => {
//   const [idx, setIdx] = useState(0);
//   if (!images || images.length === 0) return null;

//   const next = () => setIdx(p => (p + 1) % images.length);
//   const prev = () => setIdx(p => (p - 1 + images.length) % images.length);

//   return (
//     <div className="layout-modal-overlay show" onClick={onClose}>
//       <div className="layout-modal-content" onClick={e => e.stopPropagation()}>
//         <button className="close-modal-btn" onClick={onClose}>&times;</button>
//         <button type="button" className="layout-arrow layout-arrow-left" onClick={prev}>
//           <i className="fa-solid fa-chevron-left" />
//         </button>
//         <button type="button" className="layout-arrow layout-arrow-right" onClick={next}>
//           <i className="fa-solid fa-chevron-right" />
//         </button>
//         <div style={{ textAlign: 'center' }}>
//           <img src={images[idx]} alt={`Layout ${idx + 1}`} className="carousel-img" />
//           <div style={{ marginTop: 20, fontWeight: 500 }}>
//             <span>{idx + 1} / {images.length}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ─────────────────────────────────────────────
//    DATE HIERARCHY FILTER
// ───────────────────────────────────────────── */
// const monthNames = [
//   'January','February','March','April','May','June',
//   'July','August','September','October','November','December',
// ];

// const DateHierarchyFilter = ({ data, colKey, selectedValues, onChange }) => {
//   const [expandedYears, setExpandedYears] = useState({});

//   const hierarchy = useMemo(() => {
//     const h = {};
//     data.forEach(row => {
//       const raw = row[colKey];
//       if (!raw) return;
//       const d = new Date(raw);
//       if (isNaN(d.getTime())) return;
//       const year  = d.getFullYear();
//       const month = d.getMonth();
//       if (!h[year]) h[year] = {};
//       if (!h[year][month]) h[year][month] = [];
//       h[year][month].push(raw);
//     });
//     return h;
//   }, [data, colKey]);

//   const years = Object.keys(hierarchy).sort().reverse();
//   if (years.length === 0) return <div className="text-muted small p-2">No dates available</div>;

//   const toggleYear = year => setExpandedYears(p => ({ ...p, [year]: !p[year] }));

//   const handleMonthChange = (vals, checked) => {
//     let next = [...(selectedValues || [])];
//     if (checked) next = [...new Set([...next, ...vals])];
//     else         next = next.filter(v => !vals.includes(v));
//     onChange(next);
//   };

//   const handleYearChange = (year, checked) => {
//     const allVals = Object.values(hierarchy[year]).flat();
//     handleMonthChange(allVals, checked);
//   };

//   return (
//     <ul className="date-hierarchy-list">
//       {years.map(year => {
//         const months      = Object.keys(hierarchy[year]).sort((a, b) => +a - +b);
//         const allVals     = Object.values(hierarchy[year]).flat();
//         const yearChecked = allVals.length > 0 && allVals.every(v => (selectedValues || []).includes(v));

//         return (
//           <li key={year} className="date-year-item">
//             <div className="date-year-header">
//               <input
//                 type="checkbox"
//                 className="year-cb"
//                 checked={yearChecked}
//                 onChange={e => handleYearChange(year, e.target.checked)}
//                 style={{ marginRight: 8, accentColor: '#d97706' }}
//               />
//               <span className="date-year-label" onClick={() => toggleYear(year)}>{year}</span>
//               <i
//                 className={`fa-solid fa-chevron-down date-year-toggle ${expandedYears[year] ? 'rotated' : ''}`}
//                 onClick={() => toggleYear(year)}
//               />
//             </div>
//             <ul className={`date-month-list ${expandedYears[year] ? 'expanded' : ''}`}>
//               {months.map(m => {
//                 const vals     = hierarchy[year][m];
//                 const mChecked = vals.every(v => (selectedValues || []).includes(v));
//                 return (
//                   <li key={m} className="date-month-item">
//                     <input
//                       type="checkbox"
//                       checked={mChecked}
//                       onChange={e => handleMonthChange(vals, e.target.checked)}
//                       style={{ marginRight: 8, accentColor: '#d97706' }}
//                     />
//                     {monthNames[+m]}
//                   </li>
//                 );
//               })}
//             </ul>
//           </li>
//         );
//       })}
//     </ul>
//   );
// };

// const ALL_COLUMNS = [
//   { key: 'unit_code',                 label: 'Unit Code' },
//   { key: 'project',                   label: 'Project' },
//   { key: 'status',                    label: 'Status' },
//   { key: 'sales_phasing',             label: 'Phasing' },
//   { key: 'num_bedrooms',              label: 'Bedrooms' },
//   { key: 'building_type',             label: 'Building' },
//   { key: 'unit_type',                 label: 'Type' },
//   { key: 'unit_model',                label: 'Model' },
//   { key: 'development_delivery_date', label: 'Delivery',        type: 'date' },
//   { key: 'finishing_specs',           label: 'Finishing' },
//   { key: 'sellable_area',             label: 'Gross Area (m²)', type: 'range', rangeKey: 'area',      isArea: true  },
//   { key: 'land_area',                 label: 'Land (m²)',       type: 'range', rangeKey: 'land',      isArea: true  },
//   { key: 'garden_area',               label: 'Garden (m²)',     type: 'range', rangeKey: 'garden',    isArea: true  },
//   { key: 'penthouse_area',            label: 'Penthouse (m²)',  type: 'range', rangeKey: 'penthouse', isArea: true  },
//   { key: 'roof_terraces_area',        label: 'Roof (m²)',       type: 'range', rangeKey: 'roof',      isArea: true  },
//   { key: 'interest_free_unit_price',  label: 'Price (EGP)',     type: 'range', rangeKey: 'price',     isPrice: true },
// ];


// function passesRangeFilters(item, filters, skipRangeKey) {
//   for (const col of ALL_COLUMNS) {
//     if (!col.rangeKey) continue;
//     if (col.rangeKey === skipRangeKey) continue;

//     const val    = parseFloat(item[col.key]) || 0;
//     const minKey = `${col.rangeKey}Min`;
//     const maxKey = `${col.rangeKey}Max`;

//     if (filters[minKey] && val < parseFloat(filters[minKey])) return false;
//     if (filters[maxKey] && val > parseFloat(filters[maxKey])) return false;
//   }
//   return true;
// }

// /**
//  * Returns true if `item` passes every active CHECKBOX / DATE filter.
//  * `skipColKey` — that column's filter is ignored (faceted behaviour).
//  */
// function passesCheckboxFilters(item, filters, skipColKey) {
//   for (const [k, v] of Object.entries(filters)) {
//     if (k.endsWith('Min') || k.endsWith('Max')) continue;
//     if (k === skipColKey) continue;
//     if (Array.isArray(v) && v.length > 0 && !v.includes(String(item[k]))) return false;
//   }
//   return true;
// }

// /* ─────────────────────────────────────────────
//    MAIN COMPONENT
// ───────────────────────────────────────────── */
// function Catalog() {
//   const [selectedCompany, setSelectedCompany] = useState('');
//   const [activeData,      setActiveData]      = useState([]);
//   const [filteredData,    setFilteredData]    = useState([]);

//   const [filters,         setFilters]         = useState({});
//   const [activeDropdown,  setActiveDropdown]  = useState(null);
//   const [dropdownPos,     setDropdownPos]     = useState({ top: 0, left: 0 });
//   const [searchTerms,     setSearchTerms]     = useState({});

//   const [currentPage,     setCurrentPage]     = useState(1);
//   const rowsPerPage = 50;

//   const tableScrollRef = useRef(null);
//   const [modalImages,   setModalImages]       = useState(null);

//   /* ── SweetAlert helpers ── */
//   const handleBuy = (code, project) => {
//     Swal.fire({
//       icon: 'info',
//       title: 'Reserve Unit',
//       text: `Reservation request for unit ${code} (${project}) would be submitted here.`,
//       confirmButtonColor: '#d97706',
//     });
//   };

//   const handleMapClick = unit => {
//     if (unit.project_id && unit.map_focus_code) {
//       Swal.fire({
//         toast: true, position: 'top-end', icon: 'info',
//         title: `Redirecting to map: ${unit.map_focus_code}`,
//         showConfirmButton: false, timer: 2000,
//       });
//       return;
//     }
//     Swal.fire({
//       icon: 'warning', title: 'Not Pinned',
//       text: 'This unit location is not mapped.', confirmButtonColor: '#d97706',
//     });
//   };

//   /* ── Company selection ── */
//   const handleCompanyChange = e => {
//     const id = parseInt(e.target.value, 10);
//     setSelectedCompany(id || '');
//     setFilters({});
//     setActiveDropdown(null);
//     setSearchTerms({});
//     setCurrentPage(1);
//     if (!id) { setActiveData([]); setFilteredData([]); return; }
//     const units = mockUnits.filter(u => u.company_id === id);
//     setActiveData(units);
//     setFilteredData(units);
//   };

//   /* ── Current page slice ── */
//   const currentData = useMemo(() => {
//     const start = (currentPage - 1) * rowsPerPage;
//     return filteredData.slice(start, start + rowsPerPage);
//   }, [filteredData, currentPage, rowsPerPage]);

//   /* ── Visible columns — based on current page data only ── */
//   const visibleColumns = useMemo(() => {
//     if (!selectedCompany || currentData.length === 0) return ALL_COLUMNS;
//     return ALL_COLUMNS.filter(col =>
//       currentData.some(row => {
//         const v = row[col.key];
//         if (v === null || v === undefined || v === '') return false;
//         if (typeof v === 'number' && v === 0) return false;
//         return true;
//       })
//     );
//   }, [currentData, selectedCompany]);

//   /* ── "Show on Map" button visibility ── */
//   const showMapBtn = useMemo(() => {
//     const projects = [...new Set(filteredData.map(u => u.project))];
//     return projects.length === 1 && filteredData.length > 0;
//   }, [filteredData]);

//   /* ─────────────────────────────────────────────
//      RANGE STATS  (mirrors pure-HTML getRangeStats)

//      Computes min/max for a column from the subset of
//      activeData that passes ALL OTHER filters — so the
//      placeholder updates as other filters are applied.
//   ───────────────────────────────────────────── */
//   const computeRangeStats = (colKey, rangeKey) => {
//     let min = Infinity, max = -Infinity;

//     activeData.forEach(item => {
//       if (!passesRangeFilters(item, filters, rangeKey)) return;
//       if (!passesCheckboxFilters(item, filters))        return;

//       const v = parseFloat(item[colKey]) || 0;
//       if (v > 0) {
//         if (v < min) min = v;
//         if (v > max) max = v;
//       }
//     });

//     return {
//       min: isFinite(min) ? min : null,
//       max: isFinite(max) ? max : null,
//     };
//   };

//   /* ─────────────────────────────────────────────
//      FACETED CHECKBOX OPTIONS  (mirrors pure-HTML getFacetedOptions)

//      Options for a column are built from rows that pass
//      ALL other active filters, but NOT the filter for
//      the column being opened.
//   ───────────────────────────────────────────── */
//   const getOptions = colKey => {
//     const relevant = activeData.filter(item =>
//       passesRangeFilters(item, filters) &&
//       passesCheckboxFilters(item, filters, colKey)
//     );

//     const vals = [...new Set(relevant.map(r => r[colKey]))].filter(
//       v => v !== null && v !== undefined && v !== '' && v !== 0
//     );
//     const term = (searchTerms[colKey] || '').toLowerCase();
//     const searched = term ? vals.filter(v => String(v).toLowerCase().includes(term)) : vals;
//     return searched.sort((a, b) =>
//       !isNaN(a) && !isNaN(b) ? +a - +b : String(a).localeCompare(String(b))
//     );
//   };

//   /* ─────────────────────────────────────────────
//      APPLY FILTERS  (mirrors pure-HTML applyFilters)

//      Covers every range key:
//        area | land | garden | penthouse | roof | price
//      plus all checkbox / date filters.
//   ───────────────────────────────────────────── */
//   useEffect(() => {
//     if (!selectedCompany) return;

//     const res = activeData.filter(item =>
//       passesRangeFilters(item, filters) &&
//       passesCheckboxFilters(item, filters)
//     );

//     setFilteredData(res);
//     setCurrentPage(1);
//     if (tableScrollRef.current) tableScrollRef.current.scrollTop = 0;
//   }, [filters, activeData, selectedCompany]);

//   /* ── Dropdown toggle ── */
//   const toggleDropdown = (e, key) => {
//     e.stopPropagation();
//     if (activeDropdown === key) { setActiveDropdown(null); return; }

//     const rect        = e.currentTarget.getBoundingClientRect();
//     const dropW       = 290;          // wider than the largest dropdown (range = 280px)
//     const gap         = 8;
//     const viewW       = window.innerWidth;

//     // Prefer opening flush with the button's left edge.
//     // If that overflows the right side of the viewport,
//     // anchor the dropdown's RIGHT edge to the button's RIGHT edge instead.
//     let left;
//     if (rect.left + dropW + gap > viewW) {
//       left = rect.right - dropW;     // right-align to button
//       if (left < 4) left = 4;        // never bleed off left edge either
//     } else {
//       left = rect.left;
//     }

//     setDropdownPos({ top: rect.bottom + gap, left });
//     setActiveDropdown(key);
//   };

//   /* ── Checkbox filter change ── */
//   const handleCheckbox = (key, value) => {
//     setFilters(prev => {
//       const cur = prev[key] || [];
//       const upd = cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value];
//       return { ...prev, [key]: upd };
//     });
//   };

//   /* ── Range filter change ── */
//   const handleRange = (key, val) => setFilters(prev => ({ ...prev, [key]: val }));

//   /* ── Date filter change ── */
//   const handleDateFilter = (colKey, vals) =>
//     setFilters(prev => ({ ...prev, [colKey]: vals }));

//   /* ── Reset all filters ── */
//   const resetFilters = () => {
//     setFilters({});
//     setActiveDropdown(null);
//     setSearchTerms({});
//   };

//   /* ── Close dropdown on outside click ── */
//   useEffect(() => {
//     const close = () => setActiveDropdown(null);
//     window.addEventListener('click', close);
//     return () => window.removeEventListener('click', close);
//   }, []);

//   const handlePageChange = page => {
//     setCurrentPage(page);
//     if (tableScrollRef.current) tableScrollRef.current.scrollTop = 0;
//   };

//   /* ── Formatters ── */
//   const fmtNum  = n => (n ? parseFloat(n).toLocaleString('en-US') : '0');
//   const fmtArea = n =>
//     !n || n === 0
//       ? <span className="text-muted" style={{ opacity: 0.25 }}>-</span>
//       : parseFloat(n).toFixed(2);

//   const canClear = Object.keys(filters).length > 0;

//   /* ── Is a filter active for a column? ── */
//   const isFilterActive = col =>
//     (Array.isArray(filters[col.key]) && filters[col.key].length > 0) ||
//     (col.type === 'range' &&
//       (filters[`${col.rangeKey}Min`] || filters[`${col.rangeKey}Max`]));

//   /* ── "Show on Map" redirect ── */
//   const redirectToMap = () => {
//     if (!filteredData.length) return;
//     Swal.fire({
//       toast: true, position: 'top-end', icon: 'info',
//       title: `Showing ${filteredData.length} units on map`,
//       showConfirmButton: false, timer: 2000,
//     });
//   };

  
//   const renderRangeFilter = col => {
//     const stats = computeRangeStats(col.key, col.rangeKey);

//     const fmtStat = v => {
//       if (v === null) return null;
//       if (col.isArea)  return parseFloat(v).toFixed(2);
//       if (col.isPrice) return fmtNum(v);
//       return String(v);
//     };

//     const pMin = stats.min !== null ? `Min: ${fmtStat(stats.min)}` : 'Min';
//     const pMax = stats.max !== null ? `Max: ${fmtStat(stats.max)}` : 'Max';

//     return (
//       <div className="range-inputs">
//         <label className="small" style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>
//           Filter Range
//         </label>
//         <div className="range-input-group">
//           <input
//             type="number"
//             className="range-min"
//             placeholder={pMin}
//             value={filters[`${col.rangeKey}Min`] || ''}
//             onChange={e => handleRange(`${col.rangeKey}Min`, e.target.value)}
//           />
//           <input
//             type="number"
//             className="range-max"
//             placeholder={pMax}
//             value={filters[`${col.rangeKey}Max`] || ''}
//             onChange={e => handleRange(`${col.rangeKey}Max`, e.target.value)}
//           />
//         </div>
//       </div>
//     );
//   };

//   /* ─────────────────────────────────────────
//      RENDER
//   ───────────────────────────────────────── */
//   return (
//     <div className="App" id="catalog">

//       {/* ── SEARCH SECTION ── */}
//       <div className="catalog-search-section">
//         <div className="catalog-search-top">

//           <div className="catalog-search-title">
//             <span className="catalog-header-icon">
//               <i className="fa-solid fa-building" />
//             </span>
//             <span className="catalog-header-title">Units Inventory</span>

//             <div className="catalog-header-select-wrap">
//               <select
//                 className="catalog-header-select"
//                 value={selectedCompany || ''}
//                 onChange={handleCompanyChange}
//               >
//                 <option value="">Select Company...</option>
//                 {mockCompanies.map(c => (
//                   <option key={c.id} value={c.id}>{c.name}</option>
//                 ))}
//               </select>
//               <span className="catalog-header-select-caret">
//                 <i className="fa-solid fa-caret-down" />
//               </span>
//             </div>
//           </div>

//           <div className="catalog-search-meta">
//             <button
//               type="button"
//               className="catalog-header-map"
//               style={{ display: showMapBtn ? 'inline-flex' : 'none' }}
//               onClick={redirectToMap}
//             >
//               <i className="fa-solid fa-map-location-dot" /> Show on Map
//             </button>

//             <span className="catalog-header-count">
//               <strong>{filteredData.length}</strong> units
//             </span>

//             <button
//               type="button"
//               className="catalog-header-clear"
//               onClick={resetFilters}
//               disabled={!canClear}
//             >
//               <i className="fa-solid fa-filter-circle-xmark" style={{ marginRight: 4 }} />
//               Clear All Filters
//             </button>
//           </div>

//         </div>
//       </div>

//       {/* ── TABLE AREA ── */}
//       <div className="container-new-new">

//         {!selectedCompany ? (
//           <div id="emptyState" className="empty-state">
//             <h4>Please select a company to view inventory.</h4>
//           </div>
//         ) : (
//           <div className="table-container-new-new" ref={tableScrollRef} tabIndex={0}>
//             <table className="modern-table">
//               <thead>
//                 <tr>
//                   {visibleColumns.map(col => (
//                     <th key={col.key}>
//                       <div className="th-content">
//                         {col.label}
//                         <button
//                           className={`header-filter-btn ${isFilterActive(col) ? 'active' : ''}`}
//                           onClick={e => toggleDropdown(e, col.key)}
//                           title={`Filter by ${col.label}`}
//                         >
//                           <i className="fa-solid fa-filter" />
//                         </button>
//                       </div>
//                     </th>
//                   ))}
//                   <th style={{ minWidth: 140 }}>Actions</th>
//                 </tr>
//               </thead>

//               <tbody>
//                 {currentData.length > 0 ? currentData.map((unit, i) => (
//                   <tr key={i}>
//                     {visibleColumns.map(col => {
//                       if (col.key === 'unit_code')
//                         return (
//                           <td key={col.key}>
//                             <span className="unit-code-badge">{unit[col.key]}</span>
//                           </td>
//                         );
//                       if (col.key === 'status')
//                         return <td key={col.key}><StatusBadge status={unit[col.key]} /></td>;
//                       if (col.key === 'finishing_specs')
//                         return <td key={col.key}><FinishingBadge finishing={unit[col.key]} /></td>;
//                       if (col.isPrice)
//                         return (
//                           <td key={col.key}>
//                             <span className="price-text">{fmtNum(unit[col.key])}</span>
//                           </td>
//                         );
//                       if (col.isArea)
//                         return <td key={col.key}>{fmtArea(unit[col.key])}</td>;
//                       return <td key={col.key}>{unit[col.key]}</td>;
//                     })}

//                     <td style={{ textAlign: 'center' }}>
//                       {/* Brochure / Layout images */}
//                       <button
//                         className="action-icon-btn ai-brochure"
//                         title="View Layouts"
//                         disabled={!unit.layout_images?.length}
//                         onClick={() =>
//                           unit.layout_images?.length && setModalImages(unit.layout_images)
//                         }
//                       >
//                         <i className="fa-regular fa-images" />
//                       </button>

//                       {/* Map */}
//                       <button
//                         className="action-icon-btn ai-map-available"
//                         title="View on Masterplan"
//                         disabled={!unit.project_id || !unit.map_focus_code}
//                         onClick={() => handleMapClick(unit)}
//                       >
//                         <i className="fa-solid fa-map-location-dot" />
//                       </button>

//                       {/* Reserve */}
//                       <button
//                         className="action-icon-btn ai-reserve"
//                         title="Reserve"
//                         onClick={() => handleBuy(unit.unit_code, unit.project)}
//                       >
//                         <i className="fa-solid fa-cart-shopping" />
//                       </button>
//                     </td>
//                   </tr>
//                 )) : (
//                   <tr>
//                     <td colSpan={visibleColumns.length + 1} className="no-results">
//                       <h6 className="text-muted">No units match these filters.</h6>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}

//         {/* ── PAGINATION ── */}
//         {selectedCompany && (
//           <Pagination
//             totalItems={filteredData.length}
//             currentPage={currentPage}
//             rowsPerPage={rowsPerPage}
//             onPageChange={handlePageChange}
//           />
//         )}

//       </div>

//       {/* ── FILTER DROPDOWNS (portal-style, fixed position) ── */}
//       {activeDropdown && (() => {
//         const col = ALL_COLUMNS.find(c => c.key === activeDropdown);
//         if (!col) return null;

//         return (
//           <div
//             className={`custom-dropdown-menu ${col.type === 'range' ? 'range-filter' : ''}`}
//             style={{ display: 'block', top: dropdownPos.top, left: dropdownPos.left }}
//             onClick={e => e.stopPropagation()}
//           >
//             {col.type === 'range' ? (
//               /* ── Range filter — Gross Area, Land, Garden,
//                     Penthouse, Roof, Price all use this ── */
//               renderRangeFilter(col)

//             ) : col.type === 'date' ? (
//               /* ── Date hierarchy filter ── */
//               <DateHierarchyFilter
//                 data={activeData}
//                 colKey={col.key}
//                 selectedValues={filters[col.key] || []}
//                 onChange={vals => handleDateFilter(col.key, vals)}
//               />

//             ) : (
//               /* ── Checkbox filter ── */
//               <>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
//                   <input
//                     type="text"
//                     className="dropdown-search"
//                     placeholder="Search..."
//                     value={searchTerms[col.key] || ''}
//                     onChange={e =>
//                       setSearchTerms(p => ({ ...p, [col.key]: e.target.value }))
//                     }
//                     autoFocus
//                   />
//                 </div>
//                 <div className="dropdown-options-list">
//                   {getOptions(col.key).map((opt, idx) => (
//                     <label key={idx} className="dropdown-option-item">
//                       <input
//                         type="checkbox"
//                         checked={filters[col.key]?.includes(String(opt)) || false}
//                         onChange={() => handleCheckbox(col.key, String(opt))}
//                         style={{ accentColor: '#d97706', marginRight: 8 }}
//                       />
//                       {col.isPrice ? fmtNum(opt) : opt}
//                     </label>
//                   ))}
//                   {getOptions(col.key).length === 0 && (
//                     <div
//                       className="text-muted small"
//                       style={{ textAlign: 'center', padding: '8px' }}
//                     >
//                       No results
//                     </div>
//                   )}
//                 </div>
//               </>
//             )}
//           </div>
//         );
//       })()}

//       {/* ── LAYOUT MODAL ── */}
//       {modalImages && (
//         <LayoutModal images={modalImages} onClose={() => setModalImages(null)} />
//       )}

//     </div>
//   );
// }

// export default Catalog;






// // ─────────────────────────────────────────────────────────────────────────────
// // cataloge.jsx  –  synced brochure/map icons + pulsing pin + back-nav
// // ─────────────────────────────────────────────────────────────────────────────
// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import Swal from 'sweetalert2';
// import './cataloge.css';
// import { mockUnits, mockCompanies } from '../../data/catalogedata';

// /* ── Toast ── */
// function Toast({ message, onClose }) {
//   useEffect(() => { const t = setTimeout(onClose, 4500); return () => clearTimeout(t); }, [onClose]);
//   return (
//     <>
//       <style>{`@keyframes toastIn{from{opacity:0;transform:translateY(-14px)}to{opacity:1;transform:translateY(0)}}`}</style>
//       <div style={{ position:'fixed',top:20,right:20,zIndex:99999,background:'#fff',color:'#16a34a',border:'1px solid #bbf7d0',borderRadius:10,padding:'12px 16px',display:'flex',alignItems:'center',gap:10,boxShadow:'0 6px 24px rgba(0,0,0,0.12)',fontSize:13,fontWeight:600,maxWidth:320,animation:'toastIn 0.3s ease' }}>
//         <i className="fa-solid fa-circle-check" style={{fontSize:16,color:'#16a34a',flexShrink:0}}/>
//         <span style={{flex:1}}>{message}</span>
//         <button onClick={onClose} style={{background:'none',border:'none',color:'#86efac',cursor:'pointer',fontSize:18,lineHeight:1,flexShrink:0,padding:'0 2px'}}>&times;</button>
//       </div>
//     </>
//   );
// }

// /* ── Badges ── */
// const StatusBadge = ({ status }) => {
//   const s = (status||'').toLowerCase();
//   let c = 'status-cell status-default';
//   if (s.includes('available')) c='status-cell status-available';
//   else if (s.includes('blocked')) c='status-cell status-blocked';
//   else if (s.includes('contracted')||s.includes('reserved')||s.includes('sold')) c='status-cell status-booked';
//   return <span className={c}>{status||'Available'}</span>;
// };
// const FinishingBadge = ({ finishing }) => {
//   const f=(finishing||'Standard'), fl=f.toLowerCase();
//   let c='finishing-cell finishing-standard';
//   if(fl.includes('ultra'))c='finishing-cell finishing-ultra';
//   else if(fl.includes('luxury'))c='finishing-cell finishing-luxury';
//   else if(fl.includes('premium'))c='finishing-cell finishing-premium';
//   else if(fl.includes('fully finished')||fl.includes('finished'))c='finishing-cell finishing-finished';
//   else if(fl.includes('core')||fl.includes('shell'))c='finishing-cell finishing-core';
//   return <span className={c}>{f}</span>;
// };

// /* ── Pagination ── */
// const Pagination = ({ totalItems, currentPage, rowsPerPage, onPageChange }) => {
//   const tp=Math.ceil(totalItems/rowsPerPage); if(tp<=1)return null;
//   const s1=(currentPage-1)*rowsPerPage+1, e1=Math.min(currentPage*rowsPerPage,totalItems);
//   let s=Math.max(1,currentPage-2),e=Math.min(tp,currentPage+2);
//   if(s===1)e=Math.min(5,tp); if(e===tp)s=Math.max(1,tp-4);
//   const pages=[]; for(let i=s;i<=e;i++)pages.push(i);
//   return (
//     <div className="pagination-wrapper">
//       <div className="text-muted small">Showing <b>{s1}</b>–<b>{e1}</b> of <b>{totalItems}</b></div>
//       <nav><ul className="pagination mb-0">
//         <li className={`page-item ${currentPage===1?'disabled':''}`}><button className="page-link" onClick={()=>onPageChange(Math.max(1,currentPage-1))}>Previous</button></li>
//         {s>1&&<><li className="page-item"><button className="page-link" onClick={()=>onPageChange(1)}>1</button></li>{s>2&&<li className="page-item disabled"><button className="page-link">…</button></li>}</>}
//         {pages.map(p=><li key={p} className={`page-item ${p===currentPage?'active':''}`}><button className="page-link" onClick={()=>onPageChange(p)}>{p}</button></li>)}
//         {e<tp&&<>{e<tp-1&&<li className="page-item disabled"><button className="page-link">…</button></li>}<li className="page-item"><button className="page-link" onClick={()=>onPageChange(tp)}>{tp}</button></li></>}
//         <li className={`page-item ${currentPage===tp?'disabled':''}`}><button className="page-link" onClick={()=>onPageChange(Math.min(tp,currentPage+1))}>Next</button></li>
//       </ul></nav>
//     </div>
//   );
// };

// /* ── Brochure Modal — same carousel as masterplan ── */
// const LayoutModal = ({ images, onClose }) => {
//   const [idx,setIdx]=useState(0);
//   if(!images?.length)return null;
//   const next=()=>setIdx(p=>(p+1)%images.length);
//   const prev=()=>setIdx(p=>(p-1+images.length)%images.length);
//   return (
//     <div className="layout-modal-overlay show" onClick={onClose}>
//       <div className="layout-modal-content" onClick={e=>e.stopPropagation()}>
//         <button type="button" className="close-modal-btn" onClick={onClose}>&times;</button>
//         {images.length>1&&<>
//           <button type="button" className="layout-arrow layout-arrow-left" onClick={prev}><i className="fa-solid fa-chevron-left"/></button>
//           <button type="button" className="layout-arrow layout-arrow-right" onClick={next}><i className="fa-solid fa-chevron-right"/></button>
//         </>}
//         <div style={{textAlign:'center'}}>
//           <img src={images[idx]} alt={`Layout ${idx+1}`} className="carousel-img"/>
//           {images.length>1&&<div style={{marginTop:14,fontWeight:500,color:'#6b7280'}}>{idx+1} / {images.length}</div>}
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ── Date hierarchy filter ── */
// const monthNames=['January','February','March','April','May','June','July','August','September','October','November','December'];
// const DateHierarchyFilter=({data,colKey,selectedValues,onChange})=>{
//   const [exp,setExp]=useState({});
//   const h=useMemo(()=>{const h={};data.forEach(r=>{const raw=r[colKey];if(!raw)return;const d=new Date(raw);if(isNaN(d))return;const y=d.getFullYear(),m=d.getMonth();if(!h[y])h[y]={};if(!h[y][m])h[y][m]=[];h[y][m].push(raw);});return h;},[data,colKey]);
//   const years=Object.keys(h).sort().reverse();
//   if(!years.length)return<div className="text-muted small p-2">No dates</div>;
//   const toggle=y=>setExp(p=>({...p,[y]:!p[y]}));
//   const hM=(vals,chk)=>{let n=[...(selectedValues||[])];if(chk)n=[...new Set([...n,...vals])];else n=n.filter(v=>!vals.includes(v));onChange(n);};
//   return<ul className="date-hierarchy-list">{years.map(y=>{const ms=Object.keys(h[y]).sort((a,b)=>+a-+b),all=Object.values(h[y]).flat(),ck=all.length>0&&all.every(v=>(selectedValues||[]).includes(v));return<li key={y} className="date-year-item"><div className="date-year-header"><input type="checkbox" checked={ck} onChange={e=>hM(all,e.target.checked)} style={{marginRight:8,accentColor:'#d97706'}}/><span className="date-year-label" onClick={()=>toggle(y)}>{y}</span><i className={`fa-solid fa-chevron-down date-year-toggle ${exp[y]?'rotated':''}`} onClick={()=>toggle(y)}/></div><ul className={`date-month-list ${exp[y]?'expanded':''}`}>{ms.map(m=>{const vals=h[y][m],mck=vals.every(v=>(selectedValues||[]).includes(v));return<li key={m} className="date-month-item"><input type="checkbox" checked={mck} onChange={e=>hM(vals,e.target.checked)} style={{marginRight:8,accentColor:'#d97706'}}/>{monthNames[+m]}</li>;})}</ul></li>;})}
//   </ul>;
// };

// /* ── Columns ── */
// const ALL_COLUMNS=[
//   {key:'unit_code',label:'Unit Code'},{key:'project',label:'Project'},{key:'status',label:'Status'},
//   {key:'sales_phasing',label:'Phasing'},{key:'num_bedrooms',label:'Bedrooms'},{key:'building_type',label:'Building'},
//   {key:'unit_type',label:'Type'},{key:'unit_model',label:'Model'},
//   {key:'development_delivery_date',label:'Delivery',type:'date'},
//   {key:'finishing_specs',label:'Finishing'},
//   {key:'sellable_area',label:'Gross Area (m²)',type:'range',rangeKey:'area',isArea:true},
//   {key:'land_area',label:'Land (m²)',type:'range',rangeKey:'land',isArea:true},
//   {key:'garden_area',label:'Garden (m²)',type:'range',rangeKey:'garden',isArea:true},
//   {key:'penthouse_area',label:'Penthouse (m²)',type:'range',rangeKey:'penthouse',isArea:true},
//   {key:'roof_terraces_area',label:'Roof (m²)',type:'range',rangeKey:'roof',isArea:true},
//   {key:'interest_free_unit_price',label:'Price (EGP)',type:'range',rangeKey:'price',isPrice:true},
// ];
// const passesRange=(item,filters,skip)=>{for(const c of ALL_COLUMNS){if(!c.rangeKey||c.rangeKey===skip)continue;const v=parseFloat(item[c.key])||0;if(filters[`${c.rangeKey}Min`]&&v<parseFloat(filters[`${c.rangeKey}Min`]))return false;if(filters[`${c.rangeKey}Max`]&&v>parseFloat(filters[`${c.rangeKey}Max`]))return false;}return true;};
// const passesChk=(item,filters,skip)=>{for(const[k,v]of Object.entries(filters)){if(k.endsWith('Min')||k.endsWith('Max')||k===skip)continue;if(Array.isArray(v)&&v.length>0&&!v.includes(String(item[k])))return false;}return true;};

// /* ── Main ── */
// export default function Catalog(){
//   const [selCo,setSelCo]=useState('');
//   const [active,setActive]=useState([]);
//   const [filtered,setFiltered]=useState([]);
//   const [filters,setFilters]=useState({});
//   const [activeDD,setActiveDD]=useState(null);
//   const [ddPos,setDdPos]=useState({top:0,left:0});
//   const [searchT,setSearchT]=useState({});
//   const [page,setPage]=useState(1);
//   const PER=50;
//   const tbRef=useRef(null);
//   const [modal,setModal]=useState(null);
//   const [hlCode,setHlCode]=useState(null);
//   const hlRef=useRef(null);
//   const [toast,setToast]=useState(null);
//   const [single,setSingle]=useState(false);
//   const [retUrl,setRetUrl]=useState(null);

//   useEffect(()=>{
//     const p=new URLSearchParams(window.location.search);
//     const hl=p.get('highlight_code'),co=p.get('company_id'),sm=p.get('single_unit_mode')==='1',ru=p.get('return_url');
//     if(ru)setRetUrl(decodeURIComponent(ru));
//     if(sm)setSingle(true);
//     if(co){
//       const id=parseInt(co,10);
//       if(id){
//         setSelCo(id);
//         const all=mockUnits.filter(u=>u.company_id===id);
//         setActive(all);
//         let disp=all;
//         if(sm&&hl)disp=all.filter(u=>u.unit_code===hl);
//         setFiltered(disp);
//         if(hl){setHlCode(hl);const i=disp.findIndex(u=>u.unit_code===hl);if(i!==-1)setPage(Math.floor(i/PER)+1);setToast(`Showing details for unit: ${hl}`);}
//         const url=new URL(window.location.href);
//         ['highlight_code','company_id','single_unit_mode','return_url'].forEach(k=>url.searchParams.delete(k));
//         window.history.replaceState({},``,url);
//       }
//     }
//   },[]);

//   useEffect(()=>{if(hlCode&&hlRef.current)setTimeout(()=>hlRef.current?.scrollIntoView({behavior:'smooth',block:'center'}),300);},[hlCode,page]);
//   useEffect(()=>{if(!hlCode)return;const t=setTimeout(()=>setHlCode(null),5000);return()=>clearTimeout(t);},[hlCode]);

//   const handleBackToMap=()=>{ if(retUrl)window.location.href=retUrl; else window.history.back(); };
//   const handleBuy=(c,pr)=>Swal.fire({icon:'info',title:'Reserve Unit',text:`Reservation for unit ${c} (${pr}).`,confirmButtonColor:'#d97706'});

//   /* ── Navigate to masterplan, pin will pulse via focus_unit ── */
//   const handleMapClick=unit=>{
//     if(!unit.project_id||!unit.map_focus_code){
//       Swal.fire({icon:'warning',title:'Not Pinned',text:'This unit has no masterplan pin.',confirmButtonColor:'#d97706'});
//       return;
//     }
//     const projectUnits=active.filter(u=>u.project_id===unit.project_id&&u.map_focus_code);
//     const codes=projectUnits.map(u=>u.unit_code).join(',');
//     const params=new URLSearchParams();
//     params.set('project_id',String(unit.project_id));
//     params.set('focus_unit',unit.map_focus_code);   // ← triggers glowPulse animation
//     if(codes)params.set('filtered_codes',encodeURIComponent(codes));
//     window.location.href=`/masterplans?${params.toString()}`;
//   };

//   const handleCo=e=>{
//     const id=parseInt(e.target.value,10);setSelCo(id||'');setFilters({});setActiveDD(null);setSearchT({});setPage(1);setHlCode(null);setSingle(false);setRetUrl(null);setToast(null);
//     if(!id){setActive([]);setFiltered([]);return;}
//     const u=mockUnits.filter(x=>x.company_id===id);setActive(u);setFiltered(u);
//   };

//   const cur=useMemo(()=>filtered.slice((page-1)*PER,page*PER),[filtered,page]);
//   const visCols=useMemo(()=>{
//     if(!selCo||!cur.length)return ALL_COLUMNS;
//     return ALL_COLUMNS.filter(col=>cur.some(r=>{const v=r[col.key];return v!==null&&v!==undefined&&v!==''&&!(typeof v==='number'&&v===0);}));
//   },[cur,selCo]);

//   const showMapBtn=useMemo(()=>{
//     if(single)return false;
//     return[...new Set(filtered.map(u=>u.project))].length===1&&filtered.length>0;
//   },[filtered,single]);

//   const rngStats=(ck,rk)=>{let mn=Infinity,mx=-Infinity;active.forEach(it=>{if(!passesRange(it,filters,rk)||!passesChk(it,filters))return;const v=parseFloat(it[ck])||0;if(v>0){if(v<mn)mn=v;if(v>mx)mx=v;}});return{min:isFinite(mn)?mn:null,max:isFinite(mx)?mx:null};};
//   const getOpts=ck=>{const rel=active.filter(it=>passesRange(it,filters)&&passesChk(it,filters,ck));const vals=[...new Set(rel.map(r=>r[ck]))].filter(v=>v!==null&&v!==undefined&&v!==''&&v!==0);const t=(searchT[ck]||'').toLowerCase();return(t?vals.filter(v=>String(v).toLowerCase().includes(t)):vals).sort((a,b)=>!isNaN(a)&&!isNaN(b)?+a-+b:String(a).localeCompare(String(b)));};

//   useEffect(()=>{
//     if(!selCo||single)return;
//     setFiltered(active.filter(it=>passesRange(it,filters)&&passesChk(it,filters)));setPage(1);if(tbRef.current)tbRef.current.scrollTop=0;
//   },[filters,active,selCo,single]);

//   const togDD=(e,k)=>{e.stopPropagation();if(activeDD===k){setActiveDD(null);return;}const r=e.currentTarget.getBoundingClientRect(),dw=290,vw=window.innerWidth,left=r.left+dw+8>vw?Math.max(4,r.right-dw):r.left;setDdPos({top:r.bottom+8,left});setActiveDD(k);};
//   const hCb=(k,v)=>setFilters(p=>{const c=p[k]||[];return{...p,[k]:c.includes(v)?c.filter(x=>x!==v):[...c,v]};});
//   const hRng=(k,v)=>setFilters(p=>({...p,[k]:v}));
//   const hDate=(k,v)=>setFilters(p=>({...p,[k]:v}));
//   const reset=()=>{setFilters({});setActiveDD(null);setSearchT({});};
//   useEffect(()=>{const c=()=>setActiveDD(null);window.addEventListener('click',c);return()=>window.removeEventListener('click',c);},[]);
//   const hPage=p=>{setPage(p);if(tbRef.current)tbRef.current.scrollTop=0;};

//   const fmtN=n=>n?parseFloat(n).toLocaleString('en-US'):'0';
//   const fmtA=n=>(!n||n===0)?<span className="text-muted" style={{opacity:0.25}}>-</span>:parseFloat(n).toFixed(2);
//   const canClear=Object.keys(filters).length>0;
//   const isFAct=col=>(Array.isArray(filters[col.key])&&filters[col.key].length>0)||(col.type==='range'&&(filters[`${col.rangeKey}Min`]||filters[`${col.rangeKey}Max`]));

//   const redirectToMap=()=>{
//     if(!filtered.length)return;
//     const first=filtered.find(u=>u.project_id);
//     if(first?.project_id){
//       const codes=filtered.filter(u=>u.map_focus_code).map(u=>u.unit_code).join(',');
//       const p=new URLSearchParams();p.set('project_id',String(first.project_id));if(codes)p.set('filtered_codes',encodeURIComponent(codes));
//       window.location.href=`/masterplans?${p.toString()}`;return;
//     }
//     Swal.fire({toast:true,position:'top-end',icon:'info',title:`${filtered.length} units`,showConfirmButton:false,timer:2000});
//   };

//   const rndRng=col=>{const st=rngStats(col.key,col.rangeKey),fmt=v=>v===null?null:col.isArea?parseFloat(v).toFixed(2):col.isPrice?fmtN(v):String(v);
//     return<div className="range-inputs"><label className="small" style={{fontWeight:600,display:'block',marginBottom:8}}>Filter Range</label><div className="range-input-group"><input type="number" className="range-min" placeholder={st.min!==null?`Min: ${fmt(st.min)}`:'Min'} value={filters[`${col.rangeKey}Min`]||''} onChange={e=>hRng(`${col.rangeKey}Min`,e.target.value)}/><input type="number" className="range-max" placeholder={st.max!==null?`Max: ${fmt(st.max)}`:'Max'} value={filters[`${col.rangeKey}Max`]||''} onChange={e=>hRng(`${col.rangeKey}Max`,e.target.value)}/></div></div>;
//   };

//   return(
//     <div className="App" id="catalog">
//       {toast&&<Toast message={toast} onClose={()=>setToast(null)}/>}

//       {/* Back banner */}
    

//       {/* Header */}
//       <div className="catalog-search-section">
//         <div className="catalog-search-top">
//           <div className="catalog-search-title">
//             <span className="catalog-header-icon"><i className="fa-solid fa-building"/></span>
//             <span className="catalog-header-title">Units Inventory</span>
//             <div className="catalog-header-select-wrap">
//               <select className="catalog-header-select" value={selCo||''} onChange={handleCo}>
//                 <option value="">Select Company...</option>
//                 {mockCompanies.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
//               </select>
//               <span className="catalog-header-select-caret"><i className="fa-solid fa-caret-down"/></span>
//             </div>
//           </div>
//           <div className="catalog-search-meta">
//             {showMapBtn&&<button type="button" className="catalog-header-map" onClick={redirectToMap}><i className="fa-solid fa-map-location-dot"/> Show on Map</button>}
//             <span className="catalog-header-count"><strong>{filtered.length}</strong> units</span>
//             {!single&&<button type="button" className="catalog-header-clear" onClick={reset} disabled={!canClear}><i className="fa-solid fa-filter-circle-xmark" style={{marginRight:4}}/>Clear Filters</button>}
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="container-new-new">
//         {!selCo?(
//           <div id="emptyState" className="empty-state"><h4>Please select a company to view inventory.</h4></div>
//         ):(
//           <div className="table-container-new-new" ref={tbRef} tabIndex={0}>
//             <table className="modern-table">
//               <thead><tr>
//                 {visCols.map(col=>(
//                   <th key={col.key}>
//                     <div className="th-content">
//                       {col.label}
//                       {!single&&<button className={`header-filter-btn ${isFAct(col)?'active':''}`} onClick={e=>togDD(e,col.key)} title={`Filter by ${col.label}`}><i className="fa-solid fa-filter"/></button>}
//                     </div>
//                   </th>
//                 ))}
//                 <th style={{minWidth:130}}>Actions</th>
//               </tr></thead>
//               <tbody>
//                 {cur.length>0?cur.map((unit,i)=>{
//                   const isHL=unit.unit_code===hlCode;
//                   /* ── Sync with masterplansdata: derive enabled state from actual data ── */
//                   const hasBrochure = Array.isArray(unit.layout_images) && unit.layout_images.length > 0;
//                   const hasMapPin   = !!unit.project_id && !!unit.map_focus_code;
//                   return(
//                     <tr key={i} ref={isHL?hlRef:null} style={isHL?{background:'#fff3cd',outline:'2px solid #ffc107',animation:'hlFade 5s forwards'}:{}}>
//                       {visCols.map(col=>{
//                         if(col.key==='unit_code')return<td key={col.key}><span className="unit-code-badge">{unit[col.key]}</span></td>;
//                         if(col.key==='status')return<td key={col.key}><StatusBadge status={unit[col.key]}/></td>;
//                         if(col.key==='finishing_specs')return<td key={col.key}><FinishingBadge finishing={unit[col.key]}/></td>;
//                         if(col.isPrice)return<td key={col.key}><span className="price-text">{fmtN(unit[col.key])}</span></td>;
//                         if(col.isArea)return<td key={col.key}>{fmtA(unit[col.key])}</td>;
//                         return<td key={col.key}>{unit[col.key]}</td>;
//                       })}
//                       <td style={{textAlign:'center'}}>

//                         {/* Brochure — enabled only when layout_images has items (synced) */}
//                         <button
//                           className="action-icon-btn ai-brochure"
//                           title={hasBrochure?'View Brochure':'No brochure available'}
//                           disabled={!hasBrochure}
//                           style={!hasBrochure?{opacity:0.25,cursor:'not-allowed',pointerEvents:'none'}:{}}
//                           onClick={()=>hasBrochure&&setModal(unit.layout_images)}
//                         ><i className="fa-regular fa-images"/></button>

//                         {/* Masterplan — enabled only when pin exists (synced) + sends focus_unit */}
//                         <button
//                           className="action-icon-btn ai-map-available"
//                           title={hasMapPin?'View on Masterplan (pin will pulse)':'No masterplan pin'}
//                           disabled={!hasMapPin}
//                           style={!hasMapPin?{opacity:0.25,cursor:'not-allowed',pointerEvents:'none'}:{}}
//                           onClick={()=>hasMapPin&&handleMapClick(unit)}
//                         ><i className="fa-solid fa-map-location-dot"/></button>

//                         {/* Reserve — always active */}
//                         <button className="action-icon-btn ai-reserve" title="Reserve" onClick={()=>handleBuy(unit.unit_code,unit.project)}>
//                           <i className="fa-solid fa-cart-shopping"/>
//                         </button>

//                       </td>
//                     </tr>
//                   );
//                 }):(
//                   <tr><td colSpan={visCols.length+1} className="no-results"><h6 className="text-muted">No units match these filters.</h6></td></tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         )}
//         {selCo&&!single&&<Pagination totalItems={filtered.length} currentPage={page} rowsPerPage={PER} onPageChange={hPage}/>}
//       </div>

//       {/* Filter dropdowns */}
//       {!single&&activeDD&&(()=>{
//         const col=ALL_COLUMNS.find(c=>c.key===activeDD); if(!col)return null;
//         return(
//           <div className={`custom-dropdown-menu ${col.type==='range'?'range-filter':''}`} style={{display:'block',top:ddPos.top,left:ddPos.left}} onClick={e=>e.stopPropagation()}>
//             {col.type==='range'?rndRng(col):col.type==='date'?(
//               <DateHierarchyFilter data={active} colKey={col.key} selectedValues={filters[col.key]||[]} onChange={v=>hDate(col.key,v)}/>
//             ):(
//               <>
//                 <div style={{marginBottom:8}}><input type="text" className="dropdown-search" placeholder="Search..." value={searchT[col.key]||''} onChange={e=>setSearchT(p=>({...p,[col.key]:e.target.value}))} autoFocus/></div>
//                 <div className="dropdown-options-list">
//                   {getOpts(col.key).map((opt,i)=>(
//                     <label key={i} className="dropdown-option-item">
//                       <input type="checkbox" checked={filters[col.key]?.includes(String(opt))||false} onChange={()=>hCb(col.key,String(opt))} style={{accentColor:'#d97706',marginRight:8}}/>
//                       {col.isPrice?fmtN(opt):opt}
//                     </label>
//                   ))}
//                   {!getOpts(col.key).length&&<div className="text-muted small" style={{textAlign:'center',padding:8}}>No results</div>}
//                 </div>
//               </>
//             )}
//           </div>
//         );
//       })()}

//       {modal&&<LayoutModal images={modal} onClose={()=>setModal(null)}/>}
//       <style>{`@keyframes hlFade{0%{background:#fff3cd;outline-color:#ffc107}70%{background:#fff3cd;outline-color:#ffc107}100%{background:transparent;outline-color:transparent}}`}</style>
//     </div>
//   );
// }



// ─────────────────────────────────────────────────────────────────────────────
// cataloge.jsx  –  synced brochure/map icons + pulsing pin + back-nav
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Swal from 'sweetalert2';
import './cataloge.css';
import { mockUnits, mockCompanies } from '../../data/catalogedata';

/* ── Toast ── */
function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 4500); return () => clearTimeout(t); }, [onClose]);
  return (
    <>
      <style>{`@keyframes toastIn{from{opacity:0;transform:translateY(-14px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ position:'fixed',top:20,right:20,zIndex:99999,background:'#fff',color:'#16a34a',border:'1px solid #bbf7d0',borderRadius:10,padding:'12px 16px',display:'flex',alignItems:'center',gap:10,boxShadow:'0 6px 24px rgba(0,0,0,0.12)',fontSize:13,fontWeight:600,maxWidth:320,animation:'toastIn 0.3s ease' }}>
        <i className="fa-solid fa-circle-check" style={{fontSize:16,color:'#16a34a',flexShrink:0}}/>
        <span style={{flex:1}}>{message}</span>
        <button onClick={onClose} style={{background:'none',border:'none',color:'#86efac',cursor:'pointer',fontSize:18,lineHeight:1,flexShrink:0,padding:'0 2px'}}>&times;</button>
      </div>
    </>
  );
}

/* ── Badges ── */
const StatusBadge = ({ status }) => {
  const s = (status||'').toLowerCase();
  let c = 'status-cell status-default';
  if (s.includes('available')) c='status-cell status-available';
  else if (s.includes('blocked')) c='status-cell status-blocked';
  else if (s.includes('contracted')||s.includes('reserved')||s.includes('sold')) c='status-cell status-booked';
  return <span className={c}>{status||'Available'}</span>;
};
const FinishingBadge = ({ finishing }) => {
  const f=(finishing||'Standard'), fl=f.toLowerCase();
  let c='finishing-cell finishing-standard';
  if(fl.includes('ultra'))c='finishing-cell finishing-ultra';
  else if(fl.includes('luxury'))c='finishing-cell finishing-luxury';
  else if(fl.includes('premium'))c='finishing-cell finishing-premium';
  else if(fl.includes('fully finished')||fl.includes('finished'))c='finishing-cell finishing-finished';
  else if(fl.includes('core')||fl.includes('shell'))c='finishing-cell finishing-core';
  return <span className={c}>{f}</span>;
};

/* ── Pagination ── */
const Pagination = ({ totalItems, currentPage, rowsPerPage, onPageChange }) => {
  const tp=Math.ceil(totalItems/rowsPerPage); if(tp<=1)return null;
  const s1=(currentPage-1)*rowsPerPage+1, e1=Math.min(currentPage*rowsPerPage,totalItems);
  let s=Math.max(1,currentPage-2),e=Math.min(tp,currentPage+2);
  if(s===1)e=Math.min(5,tp); if(e===tp)s=Math.max(1,tp-4);
  const pages=[]; for(let i=s;i<=e;i++)pages.push(i);
  return (
    <div className="pagination-wrapper">
      <div className="text-muted small">Showing <b>{s1}</b>–<b>{e1}</b> of <b>{totalItems}</b></div>
      <nav><ul className="pagination mb-0">
        <li className={`page-item ${currentPage===1?'disabled':''}`}><button className="page-link" onClick={()=>onPageChange(Math.max(1,currentPage-1))}>Previous</button></li>
        {s>1&&<><li className="page-item"><button className="page-link" onClick={()=>onPageChange(1)}>1</button></li>{s>2&&<li className="page-item disabled"><button className="page-link">…</button></li>}</>}
        {pages.map(p=><li key={p} className={`page-item ${p===currentPage?'active':''}`}><button className="page-link" onClick={()=>onPageChange(p)}>{p}</button></li>)}
        {e<tp&&<>{e<tp-1&&<li className="page-item disabled"><button className="page-link">…</button></li>}<li className="page-item"><button className="page-link" onClick={()=>onPageChange(tp)}>{tp}</button></li></>}
        <li className={`page-item ${currentPage===tp?'disabled':''}`}><button className="page-link" onClick={()=>onPageChange(Math.min(tp,currentPage+1))}>Next</button></li>
      </ul></nav>
    </div>
  );
};

/* ── Brochure Modal — same carousel as masterplan ── */
const LayoutModal = ({ images, onClose }) => {
  const [idx,setIdx]=useState(0);
  if(!images?.length)return null;
  const next=()=>setIdx(p=>(p+1)%images.length);
  const prev=()=>setIdx(p=>(p-1+images.length)%images.length);
  return (
    <div className="layout-modal-overlay show" onClick={onClose}>
      <div className="layout-modal-content" onClick={e=>e.stopPropagation()}>
        <button type="button" className="close-modal-btn" onClick={onClose}>&times;</button>
        {images.length>1&&<>
          <button type="button" className="layout-arrow layout-arrow-left" onClick={prev}><i className="fa-solid fa-chevron-left"/></button>
          <button type="button" className="layout-arrow layout-arrow-right" onClick={next}><i className="fa-solid fa-chevron-right"/></button>
        </>}
        <div style={{textAlign:'center'}}>
          <img src={images[idx]} alt={`Layout ${idx+1}`} className="carousel-img"/>
          {images.length>1&&<div style={{marginTop:14,fontWeight:500,color:'#6b7280'}}>{idx+1} / {images.length}</div>}
        </div>
      </div>
    </div>
  );
};

/* ── Date hierarchy filter ── */
const monthNames=['January','February','March','April','May','June','July','August','September','October','November','December'];
const DateHierarchyFilter=({data,colKey,selectedValues,onChange})=>{
  const [exp,setExp]=useState({});
  const h=useMemo(()=>{const h={};data.forEach(r=>{const raw=r[colKey];if(!raw)return;const d=new Date(raw);if(isNaN(d))return;const y=d.getFullYear(),m=d.getMonth();if(!h[y])h[y]={};if(!h[y][m])h[y][m]=[];h[y][m].push(raw);});return h;},[data,colKey]);
  const years=Object.keys(h).sort().reverse();
  if(!years.length)return<div className="text-muted small p-2">No dates</div>;
  const toggle=y=>setExp(p=>({...p,[y]:!p[y]}));
  const hM=(vals,chk)=>{let n=[...(selectedValues||[])];if(chk)n=[...new Set([...n,...vals])];else n=n.filter(v=>!vals.includes(v));onChange(n);};
  return<ul className="date-hierarchy-list">{years.map(y=>{const ms=Object.keys(h[y]).sort((a,b)=>+a-+b),all=Object.values(h[y]).flat(),ck=all.length>0&&all.every(v=>(selectedValues||[]).includes(v));return<li key={y} className="date-year-item"><div className="date-year-header"><input type="checkbox" checked={ck} onChange={e=>hM(all,e.target.checked)} style={{marginRight:8,accentColor:'#d97706'}}/><span className="date-year-label" onClick={()=>toggle(y)}>{y}</span><i className={`fa-solid fa-chevron-down date-year-toggle ${exp[y]?'rotated':''}`} onClick={()=>toggle(y)}/></div><ul className={`date-month-list ${exp[y]?'expanded':''}`}>{ms.map(m=>{const vals=h[y][m],mck=vals.every(v=>(selectedValues||[]).includes(v));return<li key={m} className="date-month-item"><input type="checkbox" checked={mck} onChange={e=>hM(vals,e.target.checked)} style={{marginRight:8,accentColor:'#d97706'}}/>{monthNames[+m]}</li>;})}</ul></li>;})}
  </ul>;
};

/* ── Columns ── */
const ALL_COLUMNS=[
  {key:'unit_code',label:'Unit Code'},{key:'project',label:'Project'},{key:'status',label:'Status'},
  {key:'sales_phasing',label:'Phasing'},{key:'num_bedrooms',label:'Bedrooms'},{key:'building_type',label:'Building'},
  {key:'unit_type',label:'Type'},{key:'unit_model',label:'Model'},
  {key:'development_delivery_date',label:'Delivery',type:'date'},
  {key:'finishing_specs',label:'Finishing'},
  {key:'sellable_area',label:'Gross Area (m²)',type:'range',rangeKey:'area',isArea:true},
  {key:'land_area',label:'Land (m²)',type:'range',rangeKey:'land',isArea:true},
  {key:'garden_area',label:'Garden (m²)',type:'range',rangeKey:'garden',isArea:true},
  {key:'penthouse_area',label:'Penthouse (m²)',type:'range',rangeKey:'penthouse',isArea:true},
  {key:'roof_terraces_area',label:'Roof (m²)',type:'range',rangeKey:'roof',isArea:true},
  {key:'interest_free_unit_price',label:'Price (EGP)',type:'range',rangeKey:'price',isPrice:true},
];
const passesRange=(item,filters,skip)=>{for(const c of ALL_COLUMNS){if(!c.rangeKey||c.rangeKey===skip)continue;const v=parseFloat(item[c.key])||0;if(filters[`${c.rangeKey}Min`]&&v<parseFloat(filters[`${c.rangeKey}Min`]))return false;if(filters[`${c.rangeKey}Max`]&&v>parseFloat(filters[`${c.rangeKey}Max`]))return false;}return true;};
const passesChk=(item,filters,skip)=>{for(const[k,v]of Object.entries(filters)){if(k.endsWith('Min')||k.endsWith('Max')||k===skip)continue;if(Array.isArray(v)&&v.length>0&&!v.includes(String(item[k])))return false;}return true;};

/* ── Main ── */
export default function Catalog(){
  const [selCo,setSelCo]=useState('');
  const [active,setActive]=useState([]);
  const [filtered,setFiltered]=useState([]);
  const [filters,setFilters]=useState({});
  const [activeDD,setActiveDD]=useState(null);
  const [ddPos,setDdPos]=useState({top:0,left:0});
  const [searchT,setSearchT]=useState({});
  const [page,setPage]=useState(1);
  const PER=50;
  const tbRef=useRef(null);
  const [modal,setModal]=useState(null);
  const [hlCode,setHlCode]=useState(null);
  const hlRef=useRef(null);
  const [toast,setToast]=useState(null);
  const [single,setSingle]=useState(false);
  const [retUrl,setRetUrl]=useState(null);

  // ── FIX 1: wrap in useCallback so it's a stable reference and can be
  //           listed in useEffect dependency arrays without causing loops
  const handleBackToMap = useCallback(() => {
    if (retUrl) window.location.href = retUrl;
    else window.history.back();
  }, [retUrl]);

  useEffect(()=>{
    const p=new URLSearchParams(window.location.search);
    const hl=p.get('highlight_code'),co=p.get('company_id'),sm=p.get('single_unit_mode')==='1',ru=p.get('return_url');

    // ── FIX 2: setRetUrl is now used here (was the missing dep warning)
    if(ru) setRetUrl(decodeURIComponent(ru));
    if(sm) setSingle(true);
    if(co){
      const id=parseInt(co,10);
      if(id){
        setSelCo(id);
        const all=mockUnits.filter(u=>u.company_id===id);
        setActive(all);
        let disp=all;
        if(sm&&hl)disp=all.filter(u=>u.unit_code===hl);
        setFiltered(disp);
        if(hl){setHlCode(hl);const i=disp.findIndex(u=>u.unit_code===hl);if(i!==-1)setPage(Math.floor(i/PER)+1);setToast(`Showing details for unit: ${hl}`);}
        const url=new URL(window.location.href);
        ['highlight_code','company_id','single_unit_mode','return_url'].forEach(k=>url.searchParams.delete(k));
        window.history.replaceState({},``,url);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]); // intentionally runs once on mount only

  useEffect(()=>{if(hlCode&&hlRef.current)setTimeout(()=>hlRef.current?.scrollIntoView({behavior:'smooth',block:'center'}),300);},[hlCode,page]);
  useEffect(()=>{if(!hlCode)return;const t=setTimeout(()=>setHlCode(null),5000);return()=>clearTimeout(t);},[hlCode]);

  const handleBuy=(c,pr)=>Swal.fire({icon:'info',title:'Reserve Unit',text:`Reservation for unit ${c} (${pr}).`,confirmButtonColor:'#d97706'});

  /* ── Navigate to masterplan, pin will pulse via focus_unit ── */
  const handleMapClick=unit=>{
    if(!unit.project_id||!unit.map_focus_code){
      Swal.fire({icon:'warning',title:'Not Pinned',text:'This unit has no masterplan pin.',confirmButtonColor:'#d97706'});
      return;
    }
    const projectUnits=active.filter(u=>u.project_id===unit.project_id&&u.map_focus_code);
    const codes=projectUnits.map(u=>u.unit_code).join(',');
    const params=new URLSearchParams();
    params.set('project_id',String(unit.project_id));
    params.set('focus_unit',unit.map_focus_code);
    if(codes)params.set('filtered_codes',encodeURIComponent(codes));
    window.location.href=`/masterplans?${params.toString()}`;
  };

  const handleCo=e=>{
    const id=parseInt(e.target.value,10);setSelCo(id||'');setFilters({});setActiveDD(null);setSearchT({});setPage(1);setHlCode(null);setSingle(false);setRetUrl(null);setToast(null);
    if(!id){setActive([]);setFiltered([]);return;}
    const u=mockUnits.filter(x=>x.company_id===id);setActive(u);setFiltered(u);
  };

  const cur=useMemo(()=>filtered.slice((page-1)*PER,page*PER),[filtered,page]);
  const visCols=useMemo(()=>{
    if(!selCo||!cur.length)return ALL_COLUMNS;
    return ALL_COLUMNS.filter(col=>cur.some(r=>{const v=r[col.key];return v!==null&&v!==undefined&&v!==''&&!(typeof v==='number'&&v===0);}));
  },[cur,selCo]);

  const showMapBtn=useMemo(()=>{
    if(single)return false;
    return[...new Set(filtered.map(u=>u.project))].length===1&&filtered.length>0;
  },[filtered,single]);

  const rngStats=(ck,rk)=>{let mn=Infinity,mx=-Infinity;active.forEach(it=>{if(!passesRange(it,filters,rk)||!passesChk(it,filters))return;const v=parseFloat(it[ck])||0;if(v>0){if(v<mn)mn=v;if(v>mx)mx=v;}});return{min:isFinite(mn)?mn:null,max:isFinite(mx)?mx:null};};
  const getOpts=ck=>{const rel=active.filter(it=>passesRange(it,filters)&&passesChk(it,filters,ck));const vals=[...new Set(rel.map(r=>r[ck]))].filter(v=>v!==null&&v!==undefined&&v!==''&&v!==0);const t=(searchT[ck]||'').toLowerCase();return(t?vals.filter(v=>String(v).toLowerCase().includes(t)):vals).sort((a,b)=>!isNaN(a)&&!isNaN(b)?+a-+b:String(a).localeCompare(String(b)));};

  useEffect(()=>{
    if(!selCo||single)return;
    setFiltered(active.filter(it=>passesRange(it,filters)&&passesChk(it,filters)));setPage(1);if(tbRef.current)tbRef.current.scrollTop=0;
  },[filters,active,selCo,single]);

  const togDD=(e,k)=>{e.stopPropagation();if(activeDD===k){setActiveDD(null);return;}const r=e.currentTarget.getBoundingClientRect(),dw=290,vw=window.innerWidth,left=r.left+dw+8>vw?Math.max(4,r.right-dw):r.left;setDdPos({top:r.bottom+8,left});setActiveDD(k);};
  const hCb=(k,v)=>setFilters(p=>{const c=p[k]||[];return{...p,[k]:c.includes(v)?c.filter(x=>x!==v):[...c,v]};});
  const hRng=(k,v)=>setFilters(p=>({...p,[k]:v}));
  const hDate=(k,v)=>setFilters(p=>({...p,[k]:v}));
  const reset=()=>{setFilters({});setActiveDD(null);setSearchT({});};
  useEffect(()=>{const c=()=>setActiveDD(null);window.addEventListener('click',c);return()=>window.removeEventListener('click',c);},[]);
  const hPage=p=>{setPage(p);if(tbRef.current)tbRef.current.scrollTop=0;};

  const fmtN=n=>n?parseFloat(n).toLocaleString('en-US'):'0';
  const fmtA=n=>(!n||n===0)?<span className="text-muted" style={{opacity:0.25}}>-</span>:parseFloat(n).toFixed(2);
  const canClear=Object.keys(filters).length>0;
  const isFAct=col=>(Array.isArray(filters[col.key])&&filters[col.key].length>0)||(col.type==='range'&&(filters[`${col.rangeKey}Min`]||filters[`${col.rangeKey}Max`]));

  const redirectToMap=()=>{
    if(!filtered.length)return;
    const first=filtered.find(u=>u.project_id);
    if(first?.project_id){
      const codes=filtered.filter(u=>u.map_focus_code).map(u=>u.unit_code).join(',');
      const p=new URLSearchParams();p.set('project_id',String(first.project_id));if(codes)p.set('filtered_codes',encodeURIComponent(codes));
      window.location.href=`/masterplans?${p.toString()}`;return;
    }
    Swal.fire({toast:true,position:'top-end',icon:'info',title:`${filtered.length} units`,showConfirmButton:false,timer:2000});
  };

  const rndRng=col=>{const st=rngStats(col.key,col.rangeKey),fmt=v=>v===null?null:col.isArea?parseFloat(v).toFixed(2):col.isPrice?fmtN(v):String(v);
    return<div className="range-inputs"><label className="small" style={{fontWeight:600,display:'block',marginBottom:8}}>Filter Range</label><div className="range-input-group"><input type="number" className="range-min" placeholder={st.min!==null?`Min: ${fmt(st.min)}`:'Min'} value={filters[`${col.rangeKey}Min`]||''} onChange={e=>hRng(`${col.rangeKey}Min`,e.target.value)}/><input type="number" className="range-max" placeholder={st.max!==null?`Max: ${fmt(st.max)}`:'Max'} value={filters[`${col.rangeKey}Max`]||''} onChange={e=>hRng(`${col.rangeKey}Max`,e.target.value)}/></div></div>;
  };

  return(
    <div className="App" id="catalog">
      {toast&&<Toast message={toast} onClose={()=>setToast(null)}/>}

      {/* ── FIX 3: Back banner now rendered — consumes retUrl + handleBackToMap ── */}
      {retUrl && (
        <div className="back-banner">
          <button type="button" className="back-banner-btn" onClick={handleBackToMap}>
            <i className="fa-solid fa-arrow-left" style={{marginRight:6}}/>
            Back to Map
          </button>
        </div>
      )}

      {/* Header */}
      <div className="catalog-search-section">
        <div className="catalog-search-top">
          <div className="catalog-search-title">
            <span className="catalog-header-icon"><i className="fa-solid fa-building"/></span>
            <span className="catalog-header-title">Units Inventory</span>
            <div className="catalog-header-select-wrap">
              <select className="catalog-header-select" value={selCo||''} onChange={handleCo}>
                <option value="">Select Company...</option>
                {mockCompanies.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <span className="catalog-header-select-caret"><i className="fa-solid fa-caret-down"/></span>
            </div>
          </div>
          <div className="catalog-search-meta">
            {showMapBtn&&<button type="button" className="catalog-header-map" onClick={redirectToMap}><i className="fa-solid fa-map-location-dot"/> Show on Map</button>}
            <span className="catalog-header-count"><strong>{filtered.length}</strong> units</span>
            {!single&&<button type="button" className="catalog-header-clear" onClick={reset} disabled={!canClear}><i className="fa-solid fa-filter-circle-xmark" style={{marginRight:4}}/>Clear Filters</button>}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="container-new-new">
        {!selCo?(
          <div id="emptyState" className="empty-state"><h4>Please select a company to view inventory.</h4></div>
        ):(
          <div className="table-container-new-new" ref={tbRef} tabIndex={0}>
            <table className="modern-table">
              <thead><tr>
                {visCols.map(col=>(
                  <th key={col.key}>
                    <div className="th-content">
                      {col.label}
                      {!single&&<button className={`header-filter-btn ${isFAct(col)?'active':''}`} onClick={e=>togDD(e,col.key)} title={`Filter by ${col.label}`}><i className="fa-solid fa-filter"/></button>}
                    </div>
                  </th>
                ))}
                <th style={{minWidth:130}}>Actions</th>
              </tr></thead>
              <tbody>
                {cur.length>0?cur.map((unit,i)=>{
                  const isHL=unit.unit_code===hlCode;
                  const hasBrochure = Array.isArray(unit.layout_images) && unit.layout_images.length > 0;
                  const hasMapPin   = !!unit.project_id && !!unit.map_focus_code;
                  return(
                    <tr key={i} ref={isHL?hlRef:null} style={isHL?{background:'#fff3cd',outline:'2px solid #ffc107',animation:'hlFade 5s forwards'}:{}}>
                      {visCols.map(col=>{
                        if(col.key==='unit_code')return<td key={col.key}><span className="unit-code-badge">{unit[col.key]}</span></td>;
                        if(col.key==='status')return<td key={col.key}><StatusBadge status={unit[col.key]}/></td>;
                        if(col.key==='finishing_specs')return<td key={col.key}><FinishingBadge finishing={unit[col.key]}/></td>;
                        if(col.isPrice)return<td key={col.key}><span className="price-text">{fmtN(unit[col.key])}</span></td>;
                        if(col.isArea)return<td key={col.key}>{fmtA(unit[col.key])}</td>;
                        return<td key={col.key}>{unit[col.key]}</td>;
                      })}
                      <td style={{textAlign:'center'}}>

                        {/* Brochure — enabled only when layout_images has items */}
                        <button
                          className="action-icon-btn ai-brochure"
                          title={hasBrochure?'View Brochure':'No brochure available'}
                          disabled={!hasBrochure}
                          style={!hasBrochure?{opacity:0.25,cursor:'not-allowed',pointerEvents:'none'}:{}}
                          onClick={()=>hasBrochure&&setModal(unit.layout_images)}
                        ><i className="fa-regular fa-images"/></button>

                        {/* Masterplan — enabled only when pin exists + sends focus_unit */}
                        <button
                          className="action-icon-btn ai-map-available"
                          title={hasMapPin?'View on Masterplan (pin will pulse)':'No masterplan pin'}
                          disabled={!hasMapPin}
                          style={!hasMapPin?{opacity:0.25,cursor:'not-allowed',pointerEvents:'none'}:{}}
                          onClick={()=>hasMapPin&&handleMapClick(unit)}
                        ><i className="fa-solid fa-map-location-dot"/></button>

                        {/* Reserve — always active */}
                        <button className="action-icon-btn ai-reserve" title="Reserve" onClick={()=>handleBuy(unit.unit_code,unit.project)}>
                          <i className="fa-solid fa-cart-shopping"/>
                        </button>

                      </td>
                    </tr>
                  );
                }):(
                  <tr><td colSpan={visCols.length+1} className="no-results"><h6 className="text-muted">No units match these filters.</h6></td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {selCo&&!single&&<Pagination totalItems={filtered.length} currentPage={page} rowsPerPage={PER} onPageChange={hPage}/>}
      </div>

      {/* Filter dropdowns */}
      {!single&&activeDD&&(()=>{
        const col=ALL_COLUMNS.find(c=>c.key===activeDD); if(!col)return null;
        return(
          <div className={`custom-dropdown-menu ${col.type==='range'?'range-filter':''}`} style={{display:'block',top:ddPos.top,left:ddPos.left}} onClick={e=>e.stopPropagation()}>
            {col.type==='range'?rndRng(col):col.type==='date'?(
              <DateHierarchyFilter data={active} colKey={col.key} selectedValues={filters[col.key]||[]} onChange={v=>hDate(col.key,v)}/>
            ):(
              <>
                <div style={{marginBottom:8}}><input type="text" className="dropdown-search" placeholder="Search..." value={searchT[col.key]||''} onChange={e=>setSearchT(p=>({...p,[col.key]:e.target.value}))} autoFocus/></div>
                <div className="dropdown-options-list">
                  {getOpts(col.key).map((opt,i)=>(
                    <label key={i} className="dropdown-option-item">
                      <input type="checkbox" checked={filters[col.key]?.includes(String(opt))||false} onChange={()=>hCb(col.key,String(opt))} style={{accentColor:'#d97706',marginRight:8}}/>
                      {col.isPrice?fmtN(opt):opt}
                    </label>
                  ))}
                  {!getOpts(col.key).length&&<div className="text-muted small" style={{textAlign:'center',padding:8}}>No results</div>}
                </div>
              </>
            )}
          </div>
        );
      })()}

      {modal&&<LayoutModal images={modal} onClose={()=>setModal(null)}/>}
      <style>{`@keyframes hlFade{0%{background:#fff3cd;outline-color:#ffc107}70%{background:#fff3cd;outline-color:#ffc107}100%{background:transparent;outline-color:transparent}}`}</style>
    </div>
  );
}