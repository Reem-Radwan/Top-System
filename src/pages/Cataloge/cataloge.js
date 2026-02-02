import React, { useState, useEffect, useMemo, useRef } from 'react';
import Swal from 'sweetalert2';
import './cataloge.css';
import { mockUnits, mockCompanies } from '../../data/catalogedata';

/* --- HELPER COMPONENTS --- */

// Status Badge Component
const StatusBadge = ({ status }) => {
  const getStatusClass = (status) => {
    if (!status) return 'status-cell status-available';
    
    const statusLower = status.toLowerCase();
    if (statusLower.includes('available')) return 'status-cell status-available';
    if (statusLower.includes('reserved')) return 'status-cell status-reserved';
    if (statusLower.includes('sold')) return 'status-cell status-sold';
    if (statusLower.includes('pending')) return 'status-cell status-pending';
    return 'status-cell status-available';
  };
  
  const getStatusText = (status) => {
    if (!status) return 'Available';
    return status;
  };
  
  return (
    <span className={getStatusClass(status)}>
      {getStatusText(status)}
    </span>
  );
};

// Finishing Badge Component
const FinishingBadge = ({ finishing }) => {
  const getFinishingClass = (finishing) => {
    if (!finishing) return 'finishing-cell finishing-standard';
    
    const finishingLower = finishing.toLowerCase();
    if (finishingLower.includes('premium')) return 'finishing-cell finishing-premium';
    if (finishingLower.includes('luxury')) return 'finishing-cell finishing-luxury';
    if (finishingLower.includes('ultra')) return 'finishing-cell finishing-ultra';
    return 'finishing-cell finishing-standard';
  };
  
  return (
    <span className={getFinishingClass(finishing)}>
      {finishing || 'Standard'}
    </span>
  );
};

// Pagination
const Pagination = ({ totalItems, currentPage, rowsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  if (totalPages <= 1) return null;

  const startIdx = (currentPage - 1) * rowsPerPage + 1;
  const endIdx = Math.min(currentPage * rowsPerPage, totalItems);

  const pages = [];
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  if (startPage === 1) endPage = Math.min(5, totalPages);
  if (endPage === totalPages) startPage = Math.max(1, totalPages - 4);

  for (let i = startPage; i <= endPage; i++) pages.push(i);

  return (
    <div className="pagination-wrapper">
      <div className="text-muted small">
        Showing <b>{startIdx}</b> to <b>{endIdx}</b> of <b>{totalItems}</b> units
      </div>
      <nav>
        <ul className="pagination pagination-sm mb-0">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            >
              Previous
            </button>
          </li>

          {pages.map((p) => (
            <li key={p} className={`page-item ${p === currentPage ? 'active' : ''}`}>
              <button className="page-link" onClick={() => onPageChange(p)}>
                {p}
              </button>
            </li>
          ))}

          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

/* Layout / Brochure Modal (carousel) */
const LayoutModal = ({ images, onClose }) => {
  const [idx, setIdx] = useState(0);

  if (!images || images.length === 0) return null;

  const next = () => setIdx((prev) => (prev + 1) % images.length);
  const prev = () => setIdx((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="layout-modal-overlay" onClick={onClose}>
      <div className="layout-modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-modal-btn" onClick={onClose}>
          &times;
        </span>

        <button type="button" className="layout-arrow layout-arrow-left" onClick={prev}>
          <i className="fa-solid fa-chevron-left" />
        </button>
        <button type="button" className="layout-arrow layout-arrow-right" onClick={next}>
          <i className="fa-solid fa-chevron-right" />
        </button>

        <div className="text-center">
          <img src={images[idx]} alt={`Layout ${idx + 1}`} className="carousel-img" />
          <div className="carousel-nav">
            <div className="carousel-counter">
              {idx + 1} / {images.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Search/toolbar section */
const CatalogSearchSection = ({
  selectedCompany,
  onCompanyChange,
  companies,
  foundCount,
  canClear,
  onClear,
}) => {
  return (
    <div className="catalog-search-section">
      <div className="catalog-search-top">
        <div className="catalog-search-title">
          <span className="catalog-header-icon">
            <i className="fa-solid fa-building"></i>
          </span>
          <span className="catalog-header-title">Units Inventory</span>
        </div>

        <div className="catalog-search-meta">
          {selectedCompany ? (
            <>
              <span className="catalog-header-count">
                <strong>{foundCount}</strong> units
              </span>
              <button
                type="button"
                className="catalog-header-clear"
                onClick={onClear}
                disabled={!canClear}
                style={!canClear ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
              >
                <i className="fa-solid fa-filter-circle-xmark me-1"></i>
                Clear All Filters
              </button>
            </>
          ) : (
            <span className="catalog-header-count">
              <strong>0</strong> units
            </span>
          )}
        </div>
      </div>

      <div className="catalog-search-controls">
        <div className="catalog-header-select-wrap">
          <select
            className="catalog-header-select"
            onChange={onCompanyChange}
            value={selectedCompany || ''}
          >
            <option value="">Select Company...</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <span className="catalog-header-select-caret">
            <i className="fa-solid fa-caret-down"></i>
          </span>
        </div>
      </div>
    </div>
  );
};

/* --- MAIN COMPONENT --- */

function Catalog() {
  const [selectedCompany, setSelectedCompany] = useState('');
  const [activeData, setActiveData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [filters, setFilters] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [searchTerms, setSearchTerms] = useState({});

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(50);

  const tableScrollRef = useRef(null);
  const filterButtonRefs = useRef({});

  const [modalImages, setModalImages] = useState(null);

  const allColumns = [
    { key: 'unit_code', label: 'Unit Code' },
    { key: 'project', label: 'Project' },
    { key: 'status', label: 'Status' },
    { key: 'sales_phasing', label: 'Phasing' },
    { key: 'num_bedrooms', label: 'Bedrooms' },
    { key: 'building_type', label: 'Building' },
    { key: 'unit_type', label: 'Type' },
    { key: 'unit_model', label: 'Model' },
    { key: 'development_delivery_date', label: 'Delivery' },
    { key: 'finishing_specs', label: 'Finishing' },
    { key: 'sellable_area', label: 'Gross Area (m²)', type: 'range', rangeKey: 'area' },
    { key: 'garden_area', label: 'Garden (m²)' },
    { key: 'land_area', label: 'Land (m²)' },
    { key: 'penthouse_area', label: 'Penthouse (m²)' },
    { key: 'roof_terraces_area', label: 'Roof (m²)' },
    { key: 'interest_free_unit_price', label: 'Price (EGP)', isPrice: true, type: 'range', rangeKey: 'price' },
  ];

  /* --- ACTION HANDLERS (SweetAlert2) --- */

  const handleBuy = (unitCode) => {
    Swal.fire({
      icon: 'success',
      title: 'Request Sent',
      text: `Purchase request for ${unitCode} initiated!`,
      confirmButtonColor: '#f97316',
      confirmButtonText: 'Continue',
      background: '#f9fafb',
      color: '#1f2937',
    });
  };

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 1700,
    timerProgressBar: true,
    background: '#1f2937',
    color: '#f9fafb',
  });

  const handleMapClick = (unit) => {
    if (unit.project_id && unit.map_focus_code) {
      Toast.fire({
        icon: 'info',
        title: `Redirecting to map: ${unit.map_focus_code}`,
      });
      return;
    }

    Swal.fire({
      icon: 'warning',
      title: 'Location Not Found',
      text: `The unit "${unit.unit_code}" has not been pinned to the masterplan yet.`,
      footer: '<span style="font-size: 0.85rem;">Please contact admin.</span>',
      confirmButtonColor: '#d97706',
      confirmButtonText: 'Understood',
      background: '#f9fafb',
      color: '#1f2937',
    });
  };

  /* --- COMPANY SELECTION --- */
  const handleCompanyChange = (e) => {
    const companyId = parseInt(e.target.value, 10);
    setSelectedCompany(companyId || '');
    setFilters({});
    setActiveDropdown(null);
    setSearchTerms({});
    setCurrentPage(1);

    if (!companyId) {
      setActiveData([]);
      setFilteredData([]);
      return;
    }

    const companyUnits = mockUnits.filter((u) => u.company_id === companyId);
    setActiveData(companyUnits);
    setFilteredData(companyUnits);
  };

  /* --- VISIBLE COLUMNS (based on ALL filtered data - for filter options) --- */
  const visibleColumns = useMemo(() => {
    if (!selectedCompany || filteredData.length === 0) return allColumns;

    return allColumns.filter((col) =>
      filteredData.some((row) => {
        const val = row[col.key];
        if (val === null || val === undefined || val === '') return false;
        if (typeof val === 'number' && val === 0) return false;
        return true;
      })
    );
  }, [filteredData, selectedCompany]);

  /* --- RENDER HELPERS --- */
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  /* --- VISIBLE COLUMNS FOR CURRENT PAGE (hide columns with no data on this page) --- */
  const visibleColumnsForPage = useMemo(() => {
    if (!selectedCompany || currentData.length === 0) return visibleColumns;

    // Filter columns based on current page data
    return visibleColumns.filter((col) =>
      currentData.some((row) => {
        const val = row[col.key];
        if (val === null || val === undefined || val === '') return false;
        if (typeof val === 'number' && val === 0) return false;
        return true;
      })
    );
  }, [currentData, visibleColumns, selectedCompany]);

  /* --- RANGE STATS --- */
  const rangeStats = useMemo(() => {
    const baseFiltered = activeData.filter((item) => {
      for (const [key, selectedVals] of Object.entries(filters)) {
        if (['areaMin', 'areaMax', 'priceMin', 'priceMax'].includes(key)) continue;
        if (selectedVals && selectedVals.length > 0) {
          if (!selectedVals.includes(String(item[key]))) return false;
        }
      }
      return true;
    });

    let areaMin = Infinity, areaMax = -Infinity;
    let priceMin = Infinity, priceMax = -Infinity;

    baseFiltered.forEach((u) => {
      const area = parseFloat(u.sellable_area) || 0;
      const price = parseFloat(u.interest_free_unit_price) || 0;

      if (area > 0) {
        if (area < areaMin) areaMin = area;
        if (area > areaMax) areaMax = area;
      }

      if (price > 0) {
        if (price < priceMin) priceMin = price;
        if (price > priceMax) priceMax = price;
      }
    });

    if (!isFinite(areaMin)) areaMin = '';
    if (!isFinite(areaMax)) areaMax = '';
    if (!isFinite(priceMin)) priceMin = '';
    if (!isFinite(priceMax)) priceMax = '';

    return { areaMin, areaMax, priceMin, priceMax };
  }, [activeData, filters]);

  /* --- FILTER LOGIC --- */
  const handleSearchChange = (key, value) => {
    setSearchTerms((prev) => ({ ...prev, [key]: value }));
  };

  const getOptionsForColumn = (colKey) => {
    const relevantData = activeData.filter((item) => {
      const area = parseFloat(item.sellable_area) || 0;
      if (filters.areaMin && area < parseFloat(filters.areaMin)) return false;
      if (filters.areaMax && area > parseFloat(filters.areaMax)) return false;

      const price = parseFloat(item.interest_free_unit_price) || 0;
      if (filters.priceMin && price < parseFloat(filters.priceMin)) return false;
      if (filters.priceMax && price > parseFloat(filters.priceMax)) return false;

      for (const [key, selectedVals] of Object.entries(filters)) {
        if (key === colKey || ['areaMin', 'areaMax', 'priceMin', 'priceMax'].includes(key)) continue;
        if (selectedVals && selectedVals.length > 0) {
          if (!selectedVals.includes(String(item[key]))) return false;
        }
      }
      return true;
    });

    const values = [...new Set(relevantData.map((item) => item[colKey]))].filter(
      (v) => v !== null && v !== undefined && v !== '' && v !== 0
    );

    const term = (searchTerms[colKey] || '').toLowerCase();
    const searchedValues = term ? values.filter((v) => String(v).toLowerCase().includes(term)) : values;

    return searchedValues.sort((a, b) => {
      if (!isNaN(parseFloat(a)) && !isNaN(parseFloat(b))) return parseFloat(a) - parseFloat(b);
      return String(a).localeCompare(String(b));
    });
  };

  useEffect(() => {
    if (!selectedCompany) return;

    const res = activeData.filter((item) => {
      const area = parseFloat(item.sellable_area) || 0;
      const price = parseFloat(item.interest_free_unit_price) || 0;

      if (filters.areaMin && area < parseFloat(filters.areaMin)) return false;
      if (filters.areaMax && area > parseFloat(filters.areaMax)) return false;

      if (filters.priceMin && price < parseFloat(filters.priceMin)) return false;
      if (filters.priceMax && price > parseFloat(filters.priceMax)) return false;

      for (const [key, selectedVals] of Object.entries(filters)) {
        if (['areaMin', 'areaMax', 'priceMin', 'priceMax'].includes(key)) continue;
        if (selectedVals && selectedVals.length > 0) {
          const itemVal = String(item[key]);
          if (!selectedVals.includes(itemVal)) return false;
        }
      }
      return true;
    });

    setFilteredData(res);
    setCurrentPage(1);
    if (tableScrollRef.current) tableScrollRef.current.scrollTop = 0;
  }, [filters, activeData, selectedCompany]);

  /* --- HANDLERS --- */
  const toggleFilterDropdown = (e, key) => {
    e.stopPropagation();
    
    if (activeDropdown === key) {
      setActiveDropdown(null);
      return;
    }
    
    // Calculate position for the dropdown
    const buttonRect = e.currentTarget.getBoundingClientRect();
    const dropdownWidth = 250; // Match CSS width
    const dropdownTop = buttonRect.bottom + 8; // 8px gap below button
    let dropdownLeft = buttonRect.left;
    
    // Check if dropdown would overflow viewport on the right
    const viewportWidth = window.innerWidth;
    const wouldOverflow = (dropdownLeft + dropdownWidth) > viewportWidth;
    
    if (wouldOverflow) {
      // Position dropdown to the left of the button, aligned to button's right edge
      dropdownLeft = buttonRect.right - dropdownWidth;
      
      // Make sure it doesn't overflow on the left side either
      if (dropdownLeft < 0) {
        dropdownLeft = 10; // 10px from left edge
      }
    }
    
    setDropdownPosition({ top: dropdownTop, left: dropdownLeft });
    setActiveDropdown(key);
  };

  const handleCheckboxChange = (key, value) => {
    setFilters((prev) => {
      const current = prev[key] || [];
      const updated = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      return { ...prev, [key]: updated };
    });
  };

  const handleRangeChange = (key, val) => {
    setFilters((prev) => ({ ...prev, [key]: val }));
  };

  const resetFilters = () => {
    setFilters({});
    setActiveDropdown(null);
    setSearchTerms({});
  };

  const fmtNum = (n) => (n ? parseFloat(n).toLocaleString() : '0');
  const fmtArea = (n) =>
    !n || n === 0 ? <span className="text-muted opacity-25">-</span> : parseFloat(n).toFixed(2);

  useEffect(() => {
    const close = () => setActiveDropdown(null);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (tableScrollRef.current) tableScrollRef.current.scrollTop = 0;
  };

  const canClear = Object.keys(filters).length > 0;

  return (
    <div className="App" id="catalog">
      <CatalogSearchSection
        selectedCompany={selectedCompany}
        onCompanyChange={handleCompanyChange}
        companies={mockCompanies}
        foundCount={filteredData.length}
        canClear={canClear}
        onClear={resetFilters}
      />

      <div className="container-new-new">
        {!selectedCompany ? (
          <div className="text-center mt-5 text-muted">
            <h4>Please select a company to view inventory.</h4>
          </div>
        ) : (
          <div className="table-container-new-new" ref={tableScrollRef} tabIndex={0}>
            <table className="modern-table">
              <thead>
                <tr>
                  {/* Use visibleColumns for header (keeps all columns with data) */}
                  {visibleColumns.map((col, idx) => {
                    const isActive =
                      (filters[col.key] && filters[col.key].length > 0) ||
                      (col.type === 'range' &&
                        (filters[`${col.rangeKey}Min`] || filters[`${col.rangeKey}Max`]));

                    const isRightAligned = idx > visibleColumns.length - 3;
                    
                    // Check if column should be hidden on current page
                    const isVisibleOnPage = visibleColumnsForPage.some(c => c.key === col.key);

                    return (
                      <th 
                        key={col.key} 
                        className={isRightAligned ? 'th-right-align' : ''}
                        style={!isVisibleOnPage ? { display: 'none' } : undefined}
                      >
                        <div className="th-content">
                          {col.label}
                          <button
                            className={`header-filter-btn ${isActive ? 'active' : ''}`}
                            onClick={(e) => toggleFilterDropdown(e, col.key)}
                            title={`Filter by ${col.label}`}
                          >
                            <i className="fa-solid fa-filter"></i>
                          </button>

                          {activeDropdown === col.key && (
                            <div 
                              className="custom-dropdown-menu" 
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                top: `${dropdownPosition.top}px`,
                                left: `${dropdownPosition.left}px`
                              }}
                            >
                              {col.type === 'range' ? (
                                <div className="p-2">
                                  <label className="small fw-bold mb-1">{col.label} Range</label>
                                  <div className="d-flex gap-2">
                                    {col.rangeKey === 'area' ? (
                                      <>
                                        <input
                                          type="number"
                                          className="form-control form-control-sm"
                                          placeholder={
                                            rangeStats.areaMin !== ''
                                              ? `Min: ${rangeStats.areaMin.toFixed(2)}`
                                              : 'Min'
                                          }
                                          value={filters.areaMin || ''}
                                          onChange={(e) => handleRangeChange('areaMin', e.target.value)}
                                        />
                                        <input
                                          type="number"
                                          className="form-control form-control-sm"
                                          placeholder={
                                            rangeStats.areaMax !== ''
                                              ? `Max: ${rangeStats.areaMax.toFixed(2)}`
                                              : 'Max'
                                          }
                                          value={filters.areaMax || ''}
                                          onChange={(e) => handleRangeChange('areaMax', e.target.value)}
                                        />
                                      </>
                                    ) : (
                                      <>
                                        <input
                                          type="number"
                                          className="form-control form-control-sm"
                                          placeholder={
                                            rangeStats.priceMin !== ''
                                              ? `Min: ${Number(rangeStats.priceMin).toLocaleString()}`
                                              : 'Min'
                                          }
                                          value={filters.priceMin || ''}
                                          onChange={(e) => handleRangeChange('priceMin', e.target.value)}
                                        />
                                        <input
                                          type="number"
                                          className="form-control form-control-sm"
                                          placeholder={
                                            rangeStats.priceMax !== ''
                                              ? `Max: ${Number(rangeStats.priceMax).toLocaleString()}`
                                              : 'Max'
                                          }
                                          value={filters.priceMax || ''}
                                          onChange={(e) => handleRangeChange('priceMax', e.target.value)}
                                        />
                                      </>
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="d-flex justify-content-between align-items-center mb-1">
                                    <input
                                      type="text"
                                      className="dropdown-search"
                                      placeholder={`Search ${col.label}...`}
                                      value={searchTerms[col.key] || ''}
                                      onChange={(e) => handleSearchChange(col.key, e.target.value)}
                                      autoFocus
                                    />
                                    {filters[col.key]?.length > 0 && (
                                      <button
                                        type="button"
                                        className="btn btn-sm text-danger border-0 bg-transparent small"
                                        onClick={() =>
                                          setFilters((prev) => ({
                                            ...prev,
                                            [col.key]: [],
                                          }))
                                        }
                                      >
                                        Clear
                                      </button>
                                    )}
                                  </div>

                                  <div className="dropdown-options-list">
                                    {getOptionsForColumn(col.key).map((opt, i) => (
                                      <label key={i} className="dropdown-option-item">
                                        <input
                                          type="checkbox"
                                          className="me-2"
                                          checked={filters[col.key]?.includes(String(opt)) || false}
                                          onChange={() => handleCheckboxChange(col.key, String(opt))}
                                        />
                                        {col.isPrice ? fmtNum(opt) : opt}
                                      </label>
                                    ))}

                                    {getOptionsForColumn(col.key).length === 0 && (
                                      <div className="text-muted small text-center p-2">
                                        No results found
                                      </div>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </th>
                    );
                  })}

                  <th className="text-end">Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentData.length > 0 ? (
                  currentData.map((unit, idx) => (
                    <tr key={idx}>
                      {/* Use visibleColumns to match header structure */}
                      {visibleColumns.map((col) => {
                        // Check if column should be hidden on current page
                        const isVisibleOnPage = visibleColumnsForPage.some(c => c.key === col.key);
                        
                        if (col.key === 'unit_code') {
                          return (
                            <td key={col.key} style={!isVisibleOnPage ? { display: 'none' } : undefined}>
                              <span className="unit-code-badge">{unit[col.key]}</span>
                            </td>
                          );
                        }
                        if (col.key === 'status') {
                          return (
                            <td key={col.key} style={!isVisibleOnPage ? { display: 'none' } : undefined}>
                              <StatusBadge status={unit[col.key]} />
                            </td>
                          );
                        }
                        if (col.key === 'finishing_specs') {
                          return (
                            <td key={col.key} style={!isVisibleOnPage ? { display: 'none' } : undefined}>
                              <FinishingBadge finishing={unit[col.key]} />
                            </td>
                          );
                        }
                        if (col.isPrice) {
                          return (
                            <td key={col.key} style={!isVisibleOnPage ? { display: 'none' } : undefined}>
                              <span className="price-text">{fmtNum(unit[col.key])}</span>
                            </td>
                          );
                        }
                        if (col.key.includes('area')) {
                          return (
                            <td key={col.key} style={!isVisibleOnPage ? { display: 'none' } : undefined}>
                              {fmtArea(unit[col.key])}
                            </td>
                          );
                        }
                        return (
                          <td key={col.key} style={!isVisibleOnPage ? { display: 'none' } : undefined}>
                            {unit[col.key]}
                          </td>
                        );
                      })}

                      <td className="text-end">
                        <button
                          className={`action-icon-btn ${
                            unit.layout_images?.length > 0 ? 'ai-brochure' : 'ai-disabled'
                          }`}
                          title="View brochure"
                          onClick={() => unit.layout_images?.length > 0 && setModalImages(unit.layout_images)}
                          disabled={!unit.layout_images?.length}
                        >
                          <i className="fa-regular fa-file-pdf"></i>
                        </button>

                        <button
                          className={`action-icon-btn ${
                            unit.project_id && unit.map_focus_code ? 'ai-map-available' : 'ai-map-missing'
                          }`}
                          title="View on masterplan"
                          onClick={() => handleMapClick(unit)}
                          disabled={!unit.project_id || !unit.map_focus_code}
                        >
                          <i className="fa-solid fa-map-location-dot"></i>
                        </button>

                        <button
                          className="action-icon-btn ai-reserve"
                          title="Reserve unit"
                          onClick={() => handleBuy(unit.unit_code)}
                        >
                          <i className="fa-solid fa-clipboard-check"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={visibleColumns.length + 1} className="text-center py-5">
                      <h6 className="text-muted">No units match these filters.</h6>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {selectedCompany && filteredData.length > 0 && (
          <Pagination
            totalItems={filteredData.length}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {modalImages && <LayoutModal images={modalImages} onClose={() => setModalImages(null)} />}
    </div>
  );
}

export default Catalog;