// import React, { useState, useEffect, useRef } from 'react';
// import { getCompanyUnits } from '../../../data/inventorymockData';
// import { generatePDFReport } from '../Pdfgenerator';
// import FilterSection from '../FilterSection/FilterSection';
// import KPISection from '../KpiSection/KpiSection';
// import ChartsSection from '../ChartsSection/ChartsSection';
// import UnitMetricsCharts from '../UnitMetricsCharts/Unitmetricscharts';
// import DataTable from '../DataTable/DataTable';
// import PivotTable from '../PivotTable';
// import InvStatusPivot from '../Invstatuspivot'
// import './dashboard.css';
// import SalesProgressPivot from '../SalesProgressPivot/SalesProgressPivot'
// import DeliveryPlanPivot from '../DeliveryPlanPivot/DeliveryPlanPivot';

// const Dashboard = ({ companyId, companyName, onViewChange }) => {
//   const [units, setUnits] = useState([]);
//   const [filteredUnits, setFilteredUnits] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [generatingPDF, setGeneratingPDF] = useState(false);
//   const [currentView, setCurrentView] = useState('home');
  
//   const tabsContainerRef = useRef(null);

//   // Start with EMPTY filters
//   const [filters, setFilters] = useState({
//     projects: [],
//     unitTypes: [],
//     contractPaymentPlans: [],
//     statuses: [],
//     areas: [],
//     cities: [],
//     salesDateRange: { start: null, end: null },
//     deliveryDateRange: { start: null, end: null },
//   });

//   // ✅ Available options (what can be selected based on filters)
//   const [availableOptions, setAvailableOptions] = useState({
//     projects: [],
//     unitTypes: [],
//     contractPaymentPlans: [],
//     statuses: [],
//     areas: [],
//     cities: [],
//   });

//   // Master lists (ALL possible options)
//   const [allFilterOptions, setAllFilterOptions] = useState({
//     projects: [],
//     unitTypes: [],
//     contractPaymentPlans: [],
//     statuses: [],
//     areas: [],
//     cities: [],
//   });

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth <= 768 && tabsContainerRef.current) {
//         setTimeout(() => {
//           tabsContainerRef.current.scrollLeft = tabsContainerRef.current.scrollWidth;
//         }, 100);
//       }
//     };

//     handleResize();
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const handleViewChange = (view) => {
//     setCurrentView(view);
    
//     if (window.innerWidth <= 768 && tabsContainerRef.current) {
//       setTimeout(() => {
//         const activeTab = tabsContainerRef.current.querySelector('.dashboard-tab.active');
//         if (activeTab) {
//           activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center' });
//         }
//       }, 50);
//     }
//   };

//   useEffect(() => {
//     if (onViewChange) {
//       onViewChange(currentView);
//     }
//   }, [currentView, onViewChange]);

//   useEffect(() => {
//     loadCompanyData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [companyId]);

//   const loadCompanyData = async () => {
//     setLoading(true);
//     try {
//       const data = await getCompanyUnits(companyId);
//       setUnits(data.units);

//       // Extract ALL unique values
//       const allProjects = [...new Set(data.units.map(u => u.project).filter(Boolean))];
//       const allUnitTypes = [...new Set(data.units.map(u => u.unit_type).filter(Boolean))];
//       const allPaymentPlans = [...new Set(data.units.map(u => u.adj_contract_payment_plan).filter(Boolean))];
//       const allStatuses = [...new Set(data.units.map(u => u.status).filter(Boolean))];
//       const allAreas = [...new Set(data.units.map(u => u.area_range).filter(Boolean))];
//       const allCities = [...new Set(data.units.map(u => u.city).filter(Boolean))];

//       const masterOptions = {
//         projects: allProjects,
//         unitTypes: allUnitTypes,
//         contractPaymentPlans: allPaymentPlans,
//         statuses: allStatuses,
//         areas: allAreas,
//         cities: allCities,
//       };

//       setAllFilterOptions(masterOptions);
//       setAvailableOptions(masterOptions);

//       // Keep filters EMPTY on load
//       setFilters({
//         projects: [],
//         unitTypes: [],
//         contractPaymentPlans: [],
//         statuses: [],
//         areas: [],
//         cities: [],
//         salesDateRange: { start: null, end: null },
//         deliveryDateRange: { start: null, end: null },
//       });

//       setLoading(false);
//     } catch (err) {
//       console.error(err);
//       setLoading(false);
//     }
//   };

//   // ✅ DEPENDENT CASCADING: Selected filters remain enabled, unselected filters cascade
//   useEffect(() => {
//     if (units.length === 0) return;

//     console.log('🔄 Applying filters...', filters);

//     // Filter units based on current selections
//     const filtered = units.filter((u) => {
//       const matchProject = filters.projects.length === 0 || filters.projects.includes(u.project);
//       const matchType = filters.unitTypes.length === 0 || filters.unitTypes.includes(u.unit_type);
//       const matchPlan = filters.contractPaymentPlans.length === 0 || 
//                         filters.contractPaymentPlans.includes(u.adj_contract_payment_plan);
//       const matchStatus = filters.statuses.length === 0 || filters.statuses.includes(u.status);
//       const matchArea = filters.areas.length === 0 || filters.areas.includes(u.area_range);
//       const matchCity = filters.cities.length === 0 || filters.cities.includes(u.city);

//       // Sales date range
//       let matchSalesDate = true;
//       if (filters.salesDateRange.start || filters.salesDateRange.end) {
//         if (!u.reservation_date) {
//           matchSalesDate = false;
//         } else {
//           const d = new Date(u.reservation_date);
//           if (isNaN(d.getTime())) {
//             matchSalesDate = false;
//           } else {
//             if (filters.salesDateRange.start && d < filters.salesDateRange.start) matchSalesDate = false;
//             if (filters.salesDateRange.end && d > filters.salesDateRange.end) matchSalesDate = false;
//           }
//         }
//       }

//       // Delivery date range
//       let matchDeliveryDate = true;
//       if (filters.deliveryDateRange.start || filters.deliveryDateRange.end) {
//         if (!u.development_delivery_date) {
//           matchDeliveryDate = false;
//         } else {
//           const d = new Date(u.development_delivery_date);
//           if (isNaN(d.getTime())) {
//             matchDeliveryDate = false;
//           } else {
//             if (filters.deliveryDateRange.start && d < filters.deliveryDateRange.start) matchDeliveryDate = false;
//             if (filters.deliveryDateRange.end && d > filters.deliveryDateRange.end) matchDeliveryDate = false;
//           }
//         }
//       }

//       return matchProject && matchType && matchPlan && matchStatus && 
//              matchArea && matchCity && matchSalesDate && matchDeliveryDate;
//     });

//     console.log('✅ Filtered units:', filtered.length);
//     setFilteredUnits(filtered);

//     // ✅ CORRECTED DEPENDENT CASCADING LOGIC:
//     // Each filter type cascades based on ALL OTHER selected filters
//     // Selected items within a filter stay enabled, but the filter still respects OTHER filter constraints
    
//     // Helper function to get available options for a specific filter type
//     const getAvailableOptionsForFilter = (filterType) => {
//       // Filter units based on ALL OTHER filters (not including the current filter type)
//       const relevantUnits = units.filter((u) => {
//         // Apply all filters EXCEPT the current filter type
//         const matchProject = filterType === 'projects' || filters.projects.length === 0 || filters.projects.includes(u.project);
//         const matchType = filterType === 'unitTypes' || filters.unitTypes.length === 0 || filters.unitTypes.includes(u.unit_type);
//         const matchPlan = filterType === 'contractPaymentPlans' || filters.contractPaymentPlans.length === 0 || 
//                           filters.contractPaymentPlans.includes(u.adj_contract_payment_plan);
//         const matchStatus = filterType === 'statuses' || filters.statuses.length === 0 || filters.statuses.includes(u.status);
//         const matchArea = filterType === 'areas' || filters.areas.length === 0 || filters.areas.includes(u.area_range);
//         const matchCity = filterType === 'cities' || filters.cities.length === 0 || filters.cities.includes(u.city);

//         // Sales date range
//         let matchSalesDate = true;
//         if (filters.salesDateRange.start || filters.salesDateRange.end) {
//           if (!u.reservation_date) {
//             matchSalesDate = false;
//           } else {
//             const d = new Date(u.reservation_date);
//             if (isNaN(d.getTime())) {
//               matchSalesDate = false;
//             } else {
//               if (filters.salesDateRange.start && d < filters.salesDateRange.start) matchSalesDate = false;
//               if (filters.salesDateRange.end && d > filters.salesDateRange.end) matchSalesDate = false;
//             }
//           }
//         }

//         // Delivery date range
//         let matchDeliveryDate = true;
//         if (filters.deliveryDateRange.start || filters.deliveryDateRange.end) {
//           if (!u.development_delivery_date) {
//             matchDeliveryDate = false;
//           } else {
//             const d = new Date(u.development_delivery_date);
//             if (isNaN(d.getTime())) {
//               matchDeliveryDate = false;
//             } else {
//               if (filters.deliveryDateRange.start && d < filters.deliveryDateRange.start) matchDeliveryDate = false;
//               if (filters.deliveryDateRange.end && d > filters.deliveryDateRange.end) matchDeliveryDate = false;
//             }
//           }
//         }

//         return matchProject && matchType && matchPlan && matchStatus && 
//                matchArea && matchCity && matchSalesDate && matchDeliveryDate;
//       });

//       // Extract unique values from relevant units
//       const fieldMap = {
//         projects: 'project',
//         unitTypes: 'unit_type',
//         contractPaymentPlans: 'adj_contract_payment_plan',
//         statuses: 'status',
//         areas: 'area_range',
//         cities: 'city',
//       };

//       const availableValues = [...new Set(relevantUnits.map(u => u[fieldMap[filterType]]).filter(Boolean))];
      
//       // Always include currently selected values to keep them enabled
//       const currentSelections = filters[filterType] || [];
//       const combined = [...new Set([...availableValues, ...currentSelections])];
      
//       return combined;
//     };

//     // Calculate available options for each filter type
//     const availProjects = getAvailableOptionsForFilter('projects');
//     const availUnitTypes = getAvailableOptionsForFilter('unitTypes');
//     const availPaymentPlans = getAvailableOptionsForFilter('contractPaymentPlans');
//     const availStatuses = getAvailableOptionsForFilter('statuses');
//     const availAreas = getAvailableOptionsForFilter('areas');
//     const availCities = getAvailableOptionsForFilter('cities');

//     setAvailableOptions({
//       projects: availProjects,
//       unitTypes: availUnitTypes,
//       contractPaymentPlans: availPaymentPlans,
//       statuses: availStatuses,
//       areas: availAreas,
//       cities: availCities,
//     });

//     console.log('📊 Available options (dependent cascading):', {
//       projects: `${availProjects.length} (${filters.projects.length > 0 ? 'SELECTED - all enabled' : 'cascaded'})`,
//       unitTypes: `${availUnitTypes.length} (${filters.unitTypes.length > 0 ? 'SELECTED - all enabled' : 'cascaded'})`,
//       statuses: `${availStatuses.length} (${filters.statuses.length > 0 ? 'SELECTED - all enabled' : 'cascaded'})`,
//       areas: `${availAreas.length} (${filters.areas.length > 0 ? 'SELECTED - all enabled' : 'cascaded'})`,
//       cities: `${availCities.length} (${filters.cities.length > 0 ? 'SELECTED - all enabled' : 'cascaded'})`,
//     });
//   }, [units, filters, allFilterOptions]);

//   const updateFilter = (filterType, values) => {
//     console.log(`🎯 Updating filter: ${filterType}`, values);
//     setFilters(prev => ({ ...prev, [filterType]: values }));
//   };

//   const updateDateRange = (rangeType, start, end) => {
//     console.log(`📅 Updating date range: ${rangeType}`, { start, end });
//     setFilters(prev => ({ ...prev, [rangeType]: { start, end } }));
//   };

//   const handleGeneratePDF = async () => {
//     setGeneratingPDF(true);
//     try {
//       await generatePDFReport(companyName, filteredUnits.length, units.length);
//     } catch (error) {
//       console.error('Error generating PDF:', error);
//       alert('Error generating PDF report. Please try again.');
//     } finally {
//       setGeneratingPDF(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="dashboard-loading">
//         <div className="spinner spinner-large"></div>
//         <p className="loading-text">Loading {companyName} data...</p>
//       </div>
//     );
//   }

//   return (
//     <>
//       {generatingPDF && (
//         <div className="dashboard-loading">
//           <div className="spinner spinner-large"></div>
//           <p className="loading-text">Generating PDF Report...</p>
//         </div>
//       )}

//       <div className="dashboard-container">
//         {/* Tab Navigation */}
//         <div className="dashboard-tabs-container">
//           <div className="dashboard-tabs" ref={tabsContainerRef}>
//             <button 
//               className={`dashboard-tab ${currentView === 'home' ? 'active' : ''}`}
//               onClick={() => handleViewChange('home')}
//             >
//               🏠 Home Page
//             </button>
//             <button 
//               className={`dashboard-tab ${currentView === 'project-data' ? 'active' : ''}`}
//               onClick={() => handleViewChange('project-data')}
//             >
//               📊 Project Data
//             </button>
//             <button 
//               className={`dashboard-tab ${currentView === 'inv-status' ? 'active' : ''}`}
//               onClick={() => handleViewChange('inv-status')}
//             >
//               📦 Inv Status
//             </button>
//             <button 
//               className={`dashboard-tab ${currentView === 'sales-progress' ? 'active' : ''}`}
//               onClick={() => handleViewChange('sales-progress')}
//             >
//               📈 Sales Progress
//             </button>
//             <button 
//               className={`dashboard-tab ${currentView === 'delivery-plan' ? 'active' : ''}`}
//               onClick={() => handleViewChange('delivery-plan')}
//             >
//               🚚 Delivery Plan
//             </button>
//           </div>
//         </div>

//         {/* Home Page View */}
//         {currentView === 'home' && (
//           <div className="home-view">
//             <FilterSection
//               filterOptions={allFilterOptions}
//               availableOptions={availableOptions}
//               filters={filters}
//               onFilterChange={updateFilter}
//             />

//             <KPISection units={filteredUnits} />

//             <ChartsSection
//               units={filteredUnits}
//               allUnits={units}
//               filters={filters}
//               onDateRangeChange={updateDateRange}
//               onFilterChange={updateFilter}
//             />

//             <UnitMetricsCharts units={filteredUnits} />
            
//             <DataTable units={filteredUnits} />
//           </div>
//         )}

//         {/* Project Data View */}
//         {currentView === 'project-data' && (
//           <div className="project-data-view">
//             <div className="pivot-section">
//               <PivotTable units={filteredUnits} />
//             </div>
//           </div>
//         )}

//         {/* Inv Status View */}
//         {currentView === 'inv-status' && (
//           <div className="inv-status-view">
//             <InvStatusPivot units={filteredUnits} />
//           </div>
//         )}

//         {/* Sales Progress View */}
//         {currentView === 'sales-progress' && (
//           <div className="sales-progress-view">
//             <SalesProgressPivot units={filteredUnits} />
//           </div>
//         )}

//         {/* Delivery Plan View */}
//         {currentView === 'delivery-plan' && (
//           <div className="delivery-plan-view">
//             <DeliveryPlanPivot units={filteredUnits} />
//           </div>
//         )}

//       </div>
//     </>
//   );
// };

// export default Dashboard;



import React, { useState, useEffect, useRef } from 'react';
import { getCompanyUnits } from '../../../data/inventorymockData';
import FilterSection from '../FilterSection/FilterSection';
import KPISection from '../KpiSection/KpiSection';
import ChartsSection from '../ChartsSection/ChartsSection';
import UnitMetricsCharts from '../UnitMetricsCharts/Unitmetricscharts';
import DataTable from '../DataTable/DataTable';
import PivotTable from '../PivotTable';
import InvStatusPivot from '../Invstatuspivot';
import './dashboard.css';
import SalesProgressPivot from '../SalesProgressPivot/SalesProgressPivot';
import DeliveryPlanPivot from '../DeliveryPlanPivot/DeliveryPlanPivot';

const Dashboard = ({ companyId, companyName, onViewChange, currentView, onTabChange }) => {
  const [units, setUnits]               = useState([]);
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [generatingPDF] = useState(false);

  const tabsContainerRef = useRef(null);

  // ── Text / categorical filters ──────────────────────────────────────────────
  const [filters, setFilters] = useState({
    projects:             [],
    unitTypes:            [],
    contractPaymentPlans: [],
    statuses:             [],
    areas:                [],
    cities:               [],
    owners:               [],
    salesDateRange:    { start: null, end: null },
    deliveryDateRange: { start: null, end: null },
  });

  // ── Number range filters ─────────────────────────────────────────────────────
  // Each entry: { min, max, active }
  const [numberRangeFilters, setNumberRangeFilters] = useState({
    grossAreaRange:          { min: 0, max: Infinity, active: false },
    interestFreePriceRange:  { min: 0, max: Infinity, active: false },
    salesValueRange:         { min: 0, max: Infinity, active: false },
    psmRange:                { min: 0, max: Infinity, active: false },
  });

  // ── Available / master options ───────────────────────────────────────────────
  const [availableOptions, setAvailableOptions] = useState({
    projects: [], unitTypes: [], contractPaymentPlans: [],
    statuses: [], areas: [], cities: [], owners: [],
  });
  const [allFilterOptions, setAllFilterOptions] = useState({
    projects: [], unitTypes: [], contractPaymentPlans: [],
    statuses: [], areas: [], cities: [], owners: [],
  });

  // ── Tab scroll on resize ─────────────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768 && tabsContainerRef.current) {
        setTimeout(() => { tabsContainerRef.current.scrollLeft = tabsContainerRef.current.scrollWidth; }, 100);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);



  useEffect(() => { if (onViewChange) onViewChange(currentView); }, [currentView, onViewChange]);

  useEffect(() => { loadCompanyData(); }, [companyId]); // eslint-disable-line

  const loadCompanyData = async () => {
    setLoading(true);
    try {
      const data = await getCompanyUnits(companyId);
      setUnits(data.units);

      const masterOptions = {
        projects:             [...new Set(data.units.map(u => u.project).filter(Boolean))],
        unitTypes:            [...new Set(data.units.map(u => u.unit_type).filter(Boolean))],
        contractPaymentPlans: [...new Set(data.units.map(u => u.adj_contract_payment_plan).filter(Boolean))],
        statuses:             [...new Set(data.units.map(u => u.status).filter(Boolean))],
        areas:                [...new Set(data.units.map(u => u.area_range).filter(Boolean))],
        cities:               [...new Set(data.units.map(u => u.city).filter(Boolean))],
        owners:               [...new Set(data.units.map(u => u.owner).filter(Boolean))],
      };

      setAllFilterOptions(masterOptions);
      setAvailableOptions(masterOptions);
      setFilters({
        projects: [], unitTypes: [], contractPaymentPlans: [],
        statuses: [], areas: [], cities: [], owners: [],
        salesDateRange:    { start: null, end: null },
        deliveryDateRange: { start: null, end: null },
      });
      setNumberRangeFilters({
        grossAreaRange:         { min: 0, max: Infinity, active: false },
        interestFreePriceRange: { min: 0, max: Infinity, active: false },
        salesValueRange:        { min: 0, max: Infinity, active: false },
        psmRange:               { min: 0, max: Infinity, active: false },
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // ── Main filter pipeline ─────────────────────────────────────────────────────
  useEffect(() => {
    if (units.length === 0) return;

    // Column key for each number range filter
    const NUMBER_COL_MAP = {
      grossAreaRange:         'sellable_area',
      interestFreePriceRange: 'interest_free_unit_price',
      salesValueRange:        'sales_value',
      psmRange:               'psm',
    };

    const filtered = units.filter((u) => {
      // Text / categorical
      if (filters.projects.length             && !filters.projects.includes(u.project))                         return false;
      if (filters.unitTypes.length            && !filters.unitTypes.includes(u.unit_type))                      return false;
      if (filters.contractPaymentPlans.length && !filters.contractPaymentPlans.includes(u.adj_contract_payment_plan)) return false;
      if (filters.statuses.length             && !filters.statuses.includes(u.status))                          return false;
      if (filters.areas.length                && !filters.areas.includes(u.area_range))                         return false;
      if (filters.cities.length               && !filters.cities.includes(u.city))                              return false;
      if (filters.owners.length               && !filters.owners.includes(u.owner))                             return false;

      // Number ranges
      for (const [rangeKey, range] of Object.entries(numberRangeFilters)) {
        if (!range.active) continue;
        const col = NUMBER_COL_MAP[rangeKey];
        const val = parseFloat(u[col]);
        if (!isNaN(val) && (val < range.min || val > range.max)) return false;
      }

      // Sales date range
      if (filters.salesDateRange.start || filters.salesDateRange.end) {
        if (!u.reservation_date) return false;
        const d = new Date(u.reservation_date);
        if (isNaN(d.getTime())) return false;
        if (filters.salesDateRange.start && d < filters.salesDateRange.start) return false;
        if (filters.salesDateRange.end   && d > filters.salesDateRange.end)   return false;
      }

      // Delivery date range
      if (filters.deliveryDateRange.start || filters.deliveryDateRange.end) {
        if (!u.development_delivery_date) return false;
        const d = new Date(u.development_delivery_date);
        if (isNaN(d.getTime())) return false;
        if (filters.deliveryDateRange.start && d < filters.deliveryDateRange.start) return false;
        if (filters.deliveryDateRange.end   && d > filters.deliveryDateRange.end)   return false;
      }

      return true;
    });

    setFilteredUnits(filtered);

    // ── Cascading available options ──
    const getAvailableOptionsForFilter = (filterType) => {
      const fieldMap = {
        projects: 'project', unitTypes: 'unit_type',
        contractPaymentPlans: 'adj_contract_payment_plan',
        statuses: 'status', areas: 'area_range', cities: 'city', owners: 'owner',
      };
      const relevantUnits = units.filter((u) => {
        if (filterType !== 'projects'             && filters.projects.length             && !filters.projects.includes(u.project))                         return false;
        if (filterType !== 'unitTypes'            && filters.unitTypes.length            && !filters.unitTypes.includes(u.unit_type))                      return false;
        if (filterType !== 'contractPaymentPlans' && filters.contractPaymentPlans.length && !filters.contractPaymentPlans.includes(u.adj_contract_payment_plan)) return false;
        if (filterType !== 'statuses'             && filters.statuses.length             && !filters.statuses.includes(u.status))                          return false;
        if (filterType !== 'areas'                && filters.areas.length                && !filters.areas.includes(u.area_range))                         return false;
        if (filterType !== 'cities'               && filters.cities.length               && !filters.cities.includes(u.city))                              return false;
        if (filterType !== 'owners'               && filters.owners.length               && !filters.owners.includes(u.owner))                             return false;
        return true;
      });
      const vals = [...new Set(relevantUnits.map(u => u[fieldMap[filterType]]).filter(Boolean))];
      return [...new Set([...vals, ...(filters[filterType] || [])])];
    };

    setAvailableOptions({
      projects:             getAvailableOptionsForFilter('projects'),
      unitTypes:            getAvailableOptionsForFilter('unitTypes'),
      contractPaymentPlans: getAvailableOptionsForFilter('contractPaymentPlans'),
      statuses:             getAvailableOptionsForFilter('statuses'),
      areas:                getAvailableOptionsForFilter('areas'),
      cities:               getAvailableOptionsForFilter('cities'),
      owners:               getAvailableOptionsForFilter('owners'),
    });
  }, [units, filters, numberRangeFilters]);

  // ── Filter updaters ──────────────────────────────────────────────────────────
  const updateFilter = (filterType, values) => {
    setFilters(prev => ({ ...prev, [filterType]: values }));
  };

  const updateDateRange = (rangeType, start, end) => {
    setFilters(prev => ({ ...prev, [rangeType]: { start, end } }));
  };

  // ✅ New: called by DataTable (and any chart) when a number range filter is set
  const updateNumberRange = (rangeKey, min, max, active) => {
    setNumberRangeFilters(prev => ({ ...prev, [rangeKey]: { min, max, active } }));
  };

  // ── Build activeFilters object for DataTable ─────────────────────────────────
  // Maps column keys (used in DataTable) ← → rangeKeys (used in state)
  const RANGE_TO_COL = {
    grossAreaRange:         'sellable_area',
    interestFreePriceRange: 'interest_free_unit_price',
    salesValueRange:        'sales_value',
    psmRange:               'psm',
  };
  const activeFiltersForTable = {
    number: Object.fromEntries(
      Object.entries(numberRangeFilters)
        .filter(([, r]) => r.active)
        .map(([rk, r]) => [RANGE_TO_COL[rk], { min: r.min, max: r.max }])
    ),
    text: {
      project:   filters.projects,
      unit_type: filters.unitTypes,
      status:    filters.statuses,
    },
    date: {}, // date range filters are ranges, not key-sets — no highlight needed
  };



  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner spinner-large" />
        <p className="loading-text">Loading {companyName} data...</p>
      </div>
    );
  }

  return (
    <>
      {generatingPDF && (
        <div className="dashboard-loading">
          <div className="spinner spinner-large" />
          <p className="loading-text">Generating PDF Report...</p>
        </div>
      )}

      <div className="dashboard-container">

        {/* ── Home ── */}
        {currentView === 'home' && (
          <div className="home-view">
            <FilterSection
              filterOptions={allFilterOptions}
              availableOptions={availableOptions}
              filters={filters}
              onFilterChange={updateFilter}
            />

            <KPISection units={filteredUnits} />

            <ChartsSection
              units={filteredUnits}
              allUnits={units}
              filters={filters}
              onDateRangeChange={updateDateRange}
              onFilterChange={updateFilter}
            />

            <UnitMetricsCharts units={filteredUnits} />

            {/* ✅ DataTable now receives all propagation props */}
            <DataTable
              units={filteredUnits}
              allUnits={units}
              onFilterChange={updateFilter}
              onDateRangeChange={updateDateRange}
              onNumberRangeChange={updateNumberRange}
              activeFilters={activeFiltersForTable}
            />
          </div>
        )}

        {currentView === 'project-data' && (
          <div className="project-data-view">
            <div className="pivot-section">
              <PivotTable units={filteredUnits} />
            </div>
          </div>
        )}

        {currentView === 'inv-status' && (
          <div className="inv-status-view">
            <InvStatusPivot units={filteredUnits} />
          </div>
        )}

        {currentView === 'sales-progress' && (
          <div className="sales-progress-view">
            <SalesProgressPivot units={filteredUnits} />
          </div>
        )}

        {currentView === 'delivery-plan' && (
          <div className="delivery-plan-view">
            <DeliveryPlanPivot units={filteredUnits} />
          </div>
        )}

      </div>
    </>
  );
};

export default Dashboard;