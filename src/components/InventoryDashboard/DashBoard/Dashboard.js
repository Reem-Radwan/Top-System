
// import React, { useState, useEffect, useCallback } from 'react';
// import { getCompanyUnits } from '../../data/inventorymockData';
// import { generatePDFReport } from './Pdfgenerator';
// import FilterSection from './FilterSection';
// import KPISection from './KpiSection';
// import ChartsSection from './ChartsSection';
// import UnitMetricsCharts from './Unitmetricscharts';
// import DataTable from './DataTable';

// const Dashboard = ({ companyId, companyName }) => {
//   const [units, setUnits] = useState([]);
//   const [filteredUnits, setFilteredUnits] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [generatingPDF, setGeneratingPDF] = useState(false);
  
//   // Filter states
//   const [filters, setFilters] = useState({
//     projects: [],
//     unitTypes: [],
//     contractPaymentPlans: [],
//     statuses: [],
//     areas: [],
//     cities: [],
//     salesDateRange: { start: null, end: null },
//     deliveryDateRange: { start: null, end: null }
//   });

//   // Available filter options
//   const [filterOptions, setFilterOptions] = useState({
//     projects: [],
//     unitTypes: [],
//     contractPaymentPlans: [],
//     statuses: [],
//     areas: [],
//     cities: []
//   });

//   useEffect(() => {
//     loadCompanyData();
//   }, [companyId]);

//   useEffect(() => {
//     applyFilters();
//   }, [units, filters]);

//   const loadCompanyData = async () => {
//     setLoading(true);
//     try {
//       const data = await getCompanyUnits(companyId);
//       setUnits(data.units);
//       initializeFilterOptions(data.units);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error loading company data:', error);
//       setLoading(false);
//     }
//   };

//   const initializeFilterOptions = (unitsData) => {
//     const getUniqueValues = (field) => {
//       return [...new Set(unitsData.map(u => u[field]).filter(Boolean))];
//     };

//     const options = {
//       projects: getUniqueValues('project'),
//       unitTypes: getUniqueValues('unit_type'),
//       contractPaymentPlans: getUniqueValues('adj_contract_payment_plan'),
//       statuses: getUniqueValues('status'),
//       areas: getUniqueValues('area_range'),
//       cities: getUniqueValues('city')
//     };

//     setFilterOptions(options);

//     // Initialize all filters as selected
//     setFilters({
//       projects: options.projects,
//       unitTypes: options.unitTypes,
//       contractPaymentPlans: options.contractPaymentPlans,
//       statuses: options.statuses,
//       areas: options.areas,
//       cities: options.cities,
//       salesDateRange: { start: null, end: null },
//       deliveryDateRange: { start: null, end: null }
//     });
//   };

//   const applyFilters = useCallback(() => {
//     let filtered = units.filter(unit => {
//       // Basic filters
//       const matchesBasicFilters = (
//         (filters.projects.length === 0 || filters.projects.includes(unit.project)) &&
//         (filters.unitTypes.length === 0 || filters.unitTypes.includes(unit.unit_type)) &&
//         (filters.contractPaymentPlans.length === 0 || filters.contractPaymentPlans.includes(unit.adj_contract_payment_plan)) &&
//         (filters.statuses.length === 0 || filters.statuses.includes(unit.status)) &&
//         (filters.areas.length === 0 || filters.areas.includes(unit.area_range)) &&
//         (filters.cities.length === 0 || filters.cities.includes(unit.city))
//       );

//       if (!matchesBasicFilters) return false;

//       // Sales date range filter
//       if (filters.salesDateRange.start || filters.salesDateRange.end) {
//         if (!unit.reservation_date) return false;
//         const reservationDate = new Date(unit.reservation_date);
//         const afterStart = !filters.salesDateRange.start || reservationDate >= filters.salesDateRange.start;
//         const beforeEnd = !filters.salesDateRange.end || reservationDate <= filters.salesDateRange.end;
//         if (!afterStart || !beforeEnd) return false;
//       }

//       // Delivery date range filter
//       if (filters.deliveryDateRange.start || filters.deliveryDateRange.end) {
//         if (!unit.development_delivery_date) return false;
//         const deliveryDate = new Date(unit.development_delivery_date);
//         const afterStart = !filters.deliveryDateRange.start || deliveryDate >= filters.deliveryDateRange.start;
//         const beforeEnd = !filters.deliveryDateRange.end || deliveryDate <= filters.deliveryDateRange.end;
//         if (!afterStart || !beforeEnd) return false;
//       }

//       return true;
//     });

//     setFilteredUnits(filtered);
//   }, [units, filters]);

//   const updateFilter = (filterType, values) => {
//     setFilters(prev => ({
//       ...prev,
//       [filterType]: values
//     }));
//   };

//   const updateDateRange = (rangeType, start, end) => {
//     setFilters(prev => ({
//       ...prev,
//       [rangeType]: { start, end }
//     }));
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
//           <p className="loading-text">Generating Report...</p>
//         </div>
//       )}
      
//       <div className="dashboard-container">
//         <div className="dashboard-header">
//           <div className="quick-stats">
//             <div className="quick-stat-item">
//               <span className="quick-stat-label">Total Units</span>
//               <span className="quick-stat-value">{filteredUnits.length}</span>
//             </div>
//             <div className="quick-stat-divider"></div>
//             <div className="quick-stat-item">
//               <span className="quick-stat-label">Total Value</span>
//               <span className="quick-stat-value">
//                 {new Intl.NumberFormat('en-US', {
//                   notation: 'compact',
//                   compactDisplay: 'short',
//                   maximumFractionDigits: 1
//                 }).format(
//                   filteredUnits.reduce((sum, unit) => sum + (parseFloat(unit.sales_value) || 0), 0)
//                 )} EGP
//               </span>
//             </div>
//           </div>
          
//           <div className="dashboard-controls">
//             <button 
//               className="btn btn-primary pdf-btn" 
//               onClick={handleGeneratePDF}
//               disabled={generatingPDF || filteredUnits.length === 0}
//             >
//               📄 Generate  Report
//             </button>
//             <button className="refresh-btn" onClick={loadCompanyData}>
//               🔄 Refresh
//             </button>
//           </div>
//         </div>

//         <FilterSection
//           filterOptions={filterOptions}
//           filters={filters}
//           onFilterChange={updateFilter}
//         />

//         <KPISection units={filteredUnits} />

//         <ChartsSection
//           units={filteredUnits}
//           allUnits={units}
//           filters={filters}
//           onDateRangeChange={updateDateRange}
//           onFilterChange={updateFilter}
//         />

//         <UnitMetricsCharts units={filteredUnits} />

//         <DataTable units={filteredUnits} />
//       </div>
//     </>
//   );
// };

// export default Dashboard;


// import React, { useState, useEffect, useCallback } from 'react';
// import { getCompanyUnits } from '../../data/inventorymockData';
// import { generatePDFReport } from './Pdfgenerator';
// import FilterSection from './FilterSection';
// import KPISection from './KpiSection';
// import ChartsSection from './ChartsSection';
// import UnitMetricsCharts from './Unitmetricscharts';
// import DataTable from './DataTable';
// import './dashboard.css'

// const Dashboard = ({ companyId, companyName }) => {
//   const [units, setUnits] = useState([]);
//   const [filteredUnits, setFilteredUnits] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [generatingPDF, setGeneratingPDF] = useState(false);

//   // Filters state
//   const [filters, setFilters] = useState({
//     projects: [],
//     unitTypes: [],
//     contractPaymentPlans: [],
//     statuses: [],
//     areas: [],
//     cities: [],
//     salesDateRange: { start: null, end: null },
//     deliveryDateRange: { start: null, end: null }
//   });

//   // Filter options
//   const [filterOptions, setFilterOptions] = useState({
//     projects: [],
//     unitTypes: [],
//     contractPaymentPlans: [],
//     statuses: [],
//     areas: [],
//     cities: []
//   });

//   // Initialize filter options
//   const initializeFilterOptions = useCallback((unitsData) => {
//     const getUniqueValues = (field) =>
//       [...new Set(unitsData.map(u => u[field]).filter(Boolean))];

//     const options = {
//       projects: getUniqueValues('project'),
//       unitTypes: getUniqueValues('unit_type'),
//       contractPaymentPlans: getUniqueValues('adj_contract_payment_plan'),
//       statuses: getUniqueValues('status'),
//       areas: getUniqueValues('area_range'),
//       cities: getUniqueValues('city')
//     };

//     setFilterOptions(options);

//     setFilters({
//       projects: options.projects,
//       unitTypes: options.unitTypes,
//       contractPaymentPlans: options.contractPaymentPlans,
//       statuses: options.statuses,
//       areas: options.areas,
//       cities: options.cities,
//       salesDateRange: { start: null, end: null },
//       deliveryDateRange: { start: null, end: null }
//     });
//   }, []);

//   // Load company data
//   const loadCompanyData = useCallback(async () => {
//     setLoading(true);
//     try {
//       const data = await getCompanyUnits(companyId);
//       setUnits(data.units);
//       initializeFilterOptions(data.units);
//     } catch (error) {
//       console.error('Error loading company data:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [companyId, initializeFilterOptions]);

//   // Apply filters
//   const applyFilters = useCallback(() => {
//     const filtered = units.filter(unit => {
//       const matchesBasicFilters =
//         (filters.projects.length === 0 || filters.projects.includes(unit.project)) &&
//         (filters.unitTypes.length === 0 || filters.unitTypes.includes(unit.unit_type)) &&
//         (filters.contractPaymentPlans.length === 0 ||
//           filters.contractPaymentPlans.includes(unit.adj_contract_payment_plan)) &&
//         (filters.statuses.length === 0 || filters.statuses.includes(unit.status)) &&
//         (filters.areas.length === 0 || filters.areas.includes(unit.area_range)) &&
//         (filters.cities.length === 0 || filters.cities.includes(unit.city));

//       if (!matchesBasicFilters) return false;

//       // Sales date filter
//       if (filters.salesDateRange.start || filters.salesDateRange.end) {
//         if (!unit.reservation_date) return false;
//         const date = new Date(unit.reservation_date);
//         if (
//           (filters.salesDateRange.start && date < filters.salesDateRange.start) ||
//           (filters.salesDateRange.end && date > filters.salesDateRange.end)
//         ) {
//           return false;
//         }
//       }

//       // Delivery date filter
//       if (filters.deliveryDateRange.start || filters.deliveryDateRange.end) {
//         if (!unit.development_delivery_date) return false;
//         const date = new Date(unit.development_delivery_date);
//         if (
//           (filters.deliveryDateRange.start && date < filters.deliveryDateRange.start) ||
//           (filters.deliveryDateRange.end && date > filters.deliveryDateRange.end)
//         ) {
//           return false;
//         }
//       }

//       return true;
//     });

//     setFilteredUnits(filtered);
//   }, [units, filters]);

//   // Effects
//   useEffect(() => {
//     loadCompanyData();
//   }, [loadCompanyData]);

//   useEffect(() => {
//     applyFilters();
//   }, [applyFilters]);

//   // Handlers
//   const updateFilter = (filterType, values) => {
//     setFilters(prev => ({ ...prev, [filterType]: values }));
//   };

//   const updateDateRange = (rangeType, start, end) => {
//     setFilters(prev => ({ ...prev, [rangeType]: { start, end } }));
//   };

//   const handleGeneratePDF = async () => {
//     setGeneratingPDF(true);
//     try {
//       await generatePDFReport(companyName, filteredUnits.length, units.length);
//     } catch (error) {
//       console.error('Error generating PDF:', error);
//       alert('Error generating PDF report.');
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
//       <div className="dashboard-container">

//         <FilterSection
//           filterOptions={filterOptions}
//           filters={filters}
//           onFilterChange={updateFilter}
//         />

//         <KPISection units={filteredUnits} />

//         <ChartsSection
//           units={filteredUnits}
//           allUnits={units}
//           filters={filters}
//           onDateRangeChange={updateDateRange}
//           onFilterChange={updateFilter}
//         />

//         <UnitMetricsCharts units={filteredUnits} />

//         <DataTable units={filteredUnits} />
//       </div>
//     </>
//   );
// };

// export default Dashboard;






// import React, { useState, useEffect, useCallback } from 'react';
// import { getCompanyUnits } from '../../data/inventorymockData';
// import { generatePDFReport } from './Pdfgenerator';
// import FilterSection from './FilterSection';
// import KPISection from './KpiSection';
// import ChartsSection from './ChartsSection';
// import UnitMetricsCharts from './Unitmetricscharts';
// import DataTable from './DataTable';
// import './dashboard.css'

// const Dashboard = ({ companyId, companyName }) => {
//   const [units, setUnits] = useState([]);
//   const [filteredUnits, setFilteredUnits] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [generatingPDF, setGeneratingPDF] = useState(false);
//   const isUpdatingFiltersRef = React.useRef(false);
  
//   // Filter states
//   const [filters, setFilters] = useState({
//     projects: [],
//     unitTypes: [],
//     contractPaymentPlans: [],
//     statuses: [],
//     areas: [],
//     cities: [],
//     salesDateRange: { start: null, end: null },
//     deliveryDateRange: { start: null, end: null }
//   });

//   // Available filter options
//   const [filterOptions, setFilterOptions] = useState({
//     projects: [],
//     unitTypes: [],
//     contractPaymentPlans: [],
//     statuses: [],
//     areas: [],
//     cities: []
//   });

//   useEffect(() => {
//     loadCompanyData();
//   }, [companyId]);

//   useEffect(() => {
//     // Skip if we're internally updating filters to prevent infinite loop
//     if (isUpdatingFiltersRef.current) {
//       isUpdatingFiltersRef.current = false;
//       return;
//     }
//     applyFilters();
//   }, [units, filters]);

//   const loadCompanyData = async () => {
//     setLoading(true);
//     try {
//       const data = await getCompanyUnits(companyId);
//       setUnits(data.units);
//       initializeFilterOptions(data.units);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error loading company data:', error);
//       setLoading(false);
//     }
//   };

//   const initializeFilterOptions = (unitsData) => {
//     const getUniqueValues = (field) => {
//       return [...new Set(unitsData.map(u => u[field]).filter(Boolean))];
//     };

//     const options = {
//       projects: getUniqueValues('project'),
//       unitTypes: getUniqueValues('unit_type'),
//       contractPaymentPlans: getUniqueValues('adj_contract_payment_plan'),
//       statuses: getUniqueValues('status'),
//       areas: getUniqueValues('area_range'),
//       cities: getUniqueValues('city')
//     };

//     setFilterOptions(options);

//     // Initialize all filters as SELECTED (show all data by default)
//     setFilters({
//       projects: options.projects,
//       unitTypes: options.unitTypes,
//       contractPaymentPlans: options.contractPaymentPlans,
//       statuses: options.statuses,
//       areas: options.areas,
//       cities: options.cities,
//       salesDateRange: { start: null, end: null },
//       deliveryDateRange: { start: null, end: null }
//     });
//   };

//   // Update available filter options based on currently filtered data
//   const updateAvailableFilterOptions = (filteredData) => {
//     const getUniqueValues = (field) => {
//       return [...new Set(filteredData.map(u => u[field]).filter(Boolean))];
//     };

//     const newOptions = {
//       projects: getUniqueValues('project'),
//       unitTypes: getUniqueValues('unit_type'),
//       contractPaymentPlans: getUniqueValues('adj_contract_payment_plan'),
//       statuses: getUniqueValues('status'),
//       areas: getUniqueValues('area_range'),
//       cities: getUniqueValues('city')
//     };

//     setFilterOptions(newOptions);
    
//     // Update selected filters to only include values that still exist in new options
//     // Set flag to prevent infinite loop
//     isUpdatingFiltersRef.current = true;
//     setFilters(prevFilters => ({
//       ...prevFilters,
//       projects: prevFilters.projects.filter(p => newOptions.projects.includes(p)),
//       unitTypes: prevFilters.unitTypes.filter(t => newOptions.unitTypes.includes(t)),
//       contractPaymentPlans: prevFilters.contractPaymentPlans.filter(c => newOptions.contractPaymentPlans.includes(c)),
//       statuses: prevFilters.statuses.filter(s => newOptions.statuses.includes(s)),
//       areas: prevFilters.areas.filter(a => newOptions.areas.includes(a)),
//       cities: prevFilters.cities.filter(c => newOptions.cities.includes(c))
//     }));
//   };

//   const applyFilters = useCallback(() => {
//     let filtered = units.filter(unit => {
//       // Basic filters - if filter is empty OR unit matches selected values
//       const matchesProject = filters.projects.length === 0 || filters.projects.includes(unit.project);
//       const matchesUnitType = filters.unitTypes.length === 0 || filters.unitTypes.includes(unit.unit_type);
//       const matchesPaymentPlan = filters.contractPaymentPlans.length === 0 || filters.contractPaymentPlans.includes(unit.adj_contract_payment_plan);
//       const matchesStatus = filters.statuses.length === 0 || filters.statuses.includes(unit.status);
//       const matchesArea = filters.areas.length === 0 || filters.areas.includes(unit.area_range);
//       const matchesCity = filters.cities.length === 0 || filters.cities.includes(unit.city);

//       const matchesBasicFilters = (
//         matchesProject &&
//         matchesUnitType &&
//         matchesPaymentPlan &&
//         matchesStatus &&
//         matchesArea &&
//         matchesCity
//       );

//       if (!matchesBasicFilters) return false;

//       // Sales date range filter
//       if (filters.salesDateRange.start || filters.salesDateRange.end) {
//         if (!unit.reservation_date) return false;
//         const reservationDate = new Date(unit.reservation_date);
//         const afterStart = !filters.salesDateRange.start || reservationDate >= filters.salesDateRange.start;
//         const beforeEnd = !filters.salesDateRange.end || reservationDate <= filters.salesDateRange.end;
//         if (!afterStart || !beforeEnd) return false;
//       }

//       // Delivery date range filter
//       if (filters.deliveryDateRange.start || filters.deliveryDateRange.end) {
//         if (!unit.development_delivery_date) return false;
//         const deliveryDate = new Date(unit.development_delivery_date);
//         const afterStart = !filters.deliveryDateRange.start || deliveryDate >= filters.deliveryDateRange.start;
//         const beforeEnd = !filters.deliveryDateRange.end || deliveryDate <= filters.deliveryDateRange.end;
//         if (!afterStart || !beforeEnd) return false;
//       }

//       return true;
//     });

//     setFilteredUnits(filtered);
    
//     // Update available filter options based on filtered data
//     updateAvailableFilterOptions(filtered);
//   }, [units, filters]);

//   const updateFilter = (filterType, values) => {
//     setFilters(prev => ({
//       ...prev,
//       [filterType]: values
//     }));
//   };

//   const updateDateRange = (rangeType, start, end) => {
//     setFilters(prev => ({
//       ...prev,
//       [rangeType]: { start, end }
//     }));
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
//         <div className="dashboard-header">
//           <div className="quick-stats">
//             <div className="quick-stat-item">
//               <span className="quick-stat-label">Total Units</span>
//               <span className="quick-stat-value">{filteredUnits.length}</span>
//             </div>
//             <div className="quick-stat-divider"></div>
//             <div className="quick-stat-item">
//               <span className="quick-stat-label">Total Value</span>
//               <span className="quick-stat-value">
//                 {new Intl.NumberFormat('en-US', {
//                   notation: 'compact',
//                   compactDisplay: 'short',
//                   maximumFractionDigits: 1
//                 }).format(
//                   filteredUnits.reduce((sum, unit) => sum + (parseFloat(unit.sales_value) || 0), 0)
//                 )} EGP
//               </span>
//             </div>
//           </div>
          
//           <div className="dashboard-controls">
//             <button 
//               className="btn btn-primary pdf-btn" 
//               onClick={handleGeneratePDF}
//               disabled={generatingPDF || filteredUnits.length === 0}
//             >
//               📄 Generate PDF Report
//             </button>
//             <button className="refresh-btn" onClick={loadCompanyData}>
//               🔄 Refresh
//             </button>
//           </div>
//         </div>

//         <FilterSection
//           filterOptions={filterOptions}
//           filters={filters}
//           onFilterChange={updateFilter}
//         />

//         <KPISection units={filteredUnits} />

//         <ChartsSection
//           units={filteredUnits}
//           allUnits={units}
//           filters={filters}
//           onDateRangeChange={updateDateRange}
//           onFilterChange={updateFilter}
//         />

//         <UnitMetricsCharts units={filteredUnits} />

//         <DataTable units={filteredUnits} />
//       </div>
//     </>
//   );
// };

// export default Dashboard;



// import React, { useState, useEffect, useCallback } from 'react';
// import { getCompanyUnits } from '../../data/inventorymockData';
// import { generatePDFReport } from './Pdfgenerator';
// import FilterSection from './FilterSection';
// import KPISection from './KpiSection';
// import ChartsSection from './ChartsSection';
// import UnitMetricsCharts from './Unitmetricscharts';
// import DataTable from './DataTable';
// import './dashboard.css'


// const Dashboard = ({ companyId, companyName }) => {
//   const [units, setUnits] = useState([]);
//   const [filteredUnits, setFilteredUnits] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [generatingPDF, setGeneratingPDF] = useState(false);
//   const isUpdatingFiltersRef = React.useRef(false);
  
//   // Filter states
//   const [filters, setFilters] = useState({
//     projects: [],
//     unitTypes: [],
//     contractPaymentPlans: [],
//     statuses: [],
//     areas: [],
//     cities: [],
//     salesDateRange: { start: null, end: null },
//     deliveryDateRange: { start: null, end: null }
//   });

//   // Available filter options
//   const [filterOptions, setFilterOptions] = useState({
//     projects: [],
//     unitTypes: [],
//     contractPaymentPlans: [],
//     statuses: [],
//     areas: [],
//     cities: []
//   });

//   // All possible filter options (never changes after initial load)
//   const [allFilterOptions, setAllFilterOptions] = useState({
//     projects: [],
//     unitTypes: [],
//     contractPaymentPlans: [],
//     statuses: [],
//     areas: [],
//     cities: []
//   });

//   useEffect(() => {
//     loadCompanyData();
//   }, [companyId]);

//   useEffect(() => {
//     // Skip if we're internally updating filters to prevent infinite loop
//     if (isUpdatingFiltersRef.current) {
//       isUpdatingFiltersRef.current = false;
//       return;
//     }
//     applyFilters();
//   }, [units, filters]);

//   const loadCompanyData = async () => {
//     setLoading(true);
//     try {
//       const data = await getCompanyUnits(companyId);
//       setUnits(data.units);
//       initializeFilterOptions(data.units);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error loading company data:', error);
//       setLoading(false);
//     }
//   };

//   const initializeFilterOptions = (unitsData) => {
//     const getUniqueValues = (field) => {
//       return [...new Set(unitsData.map(u => u[field]).filter(Boolean))];
//     };

//     const options = {
//       projects: getUniqueValues('project'),
//       unitTypes: getUniqueValues('unit_type'),
//       contractPaymentPlans: getUniqueValues('adj_contract_payment_plan'),
//       statuses: getUniqueValues('status'),
//       areas: getUniqueValues('area_range'),
//       cities: getUniqueValues('city')
//     };

//     // Store all possible options (never changes)
//     setAllFilterOptions(options);
//     // Initially, available options = all options
//     setFilterOptions(options);

//     // Initialize all filters as SELECTED (show all data by default)
//     setFilters({
//       projects: options.projects,
//       unitTypes: options.unitTypes,
//       contractPaymentPlans: options.contractPaymentPlans,
//       statuses: options.statuses,
//       areas: options.areas,
//       cities: options.cities,
//       salesDateRange: { start: null, end: null },
//       deliveryDateRange: { start: null, end: null }
//     });
//   };

//   // Update available filter options based on currently filtered data
//   const updateAvailableFilterOptions = (filteredData) => {
//     const getUniqueValues = (field) => {
//       return [...new Set(filteredData.map(u => u[field]).filter(Boolean))];
//     };

//     const newOptions = {
//       projects: getUniqueValues('project'),
//       unitTypes: getUniqueValues('unit_type'),
//       contractPaymentPlans: getUniqueValues('adj_contract_payment_plan'),
//       statuses: getUniqueValues('status'),
//       areas: getUniqueValues('area_range'),
//       cities: getUniqueValues('city')
//     };

//     setFilterOptions(newOptions);
//     // Don't update selected filters - keep them as is
//     // FilterSection will handle disabling non-existent options
//   };

//   const applyFilters = useCallback(() => {
//     let filtered = units.filter(unit => {
//       // Basic filters - if filter is empty OR unit matches selected values
//       const matchesProject = filters.projects.length === 0 || filters.projects.includes(unit.project);
//       const matchesUnitType = filters.unitTypes.length === 0 || filters.unitTypes.includes(unit.unit_type);
//       const matchesPaymentPlan = filters.contractPaymentPlans.length === 0 || filters.contractPaymentPlans.includes(unit.adj_contract_payment_plan);
//       const matchesStatus = filters.statuses.length === 0 || filters.statuses.includes(unit.status);
//       const matchesArea = filters.areas.length === 0 || filters.areas.includes(unit.area_range);
//       const matchesCity = filters.cities.length === 0 || filters.cities.includes(unit.city);

//       const matchesBasicFilters = (
//         matchesProject &&
//         matchesUnitType &&
//         matchesPaymentPlan &&
//         matchesStatus &&
//         matchesArea &&
//         matchesCity
//       );

//       if (!matchesBasicFilters) return false;

//       // Sales date range filter
//       if (filters.salesDateRange.start || filters.salesDateRange.end) {
//         if (!unit.reservation_date) return false;
//         const reservationDate = new Date(unit.reservation_date);
//         const afterStart = !filters.salesDateRange.start || reservationDate >= filters.salesDateRange.start;
//         const beforeEnd = !filters.salesDateRange.end || reservationDate <= filters.salesDateRange.end;
//         if (!afterStart || !beforeEnd) return false;
//       }

//       // Delivery date range filter
//       if (filters.deliveryDateRange.start || filters.deliveryDateRange.end) {
//         if (!unit.development_delivery_date) return false;
//         const deliveryDate = new Date(unit.development_delivery_date);
//         const afterStart = !filters.deliveryDateRange.start || deliveryDate >= filters.deliveryDateRange.start;
//         const beforeEnd = !filters.deliveryDateRange.end || deliveryDate <= filters.deliveryDateRange.end;
//         if (!afterStart || !beforeEnd) return false;
//       }

//       return true;
//     });

//     setFilteredUnits(filtered);
    
//     // Update available filter options based on filtered data
//     updateAvailableFilterOptions(filtered);
//   }, [units, filters]);

//   const updateFilter = (filterType, values) => {
//     setFilters(prev => ({
//       ...prev,
//       [filterType]: values
//     }));
//   };

//   const updateDateRange = (rangeType, start, end) => {
//     setFilters(prev => ({
//       ...prev,
//       [rangeType]: { start, end }
//     }));
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
//         <div className="dashboard-header">
//           <div className="quick-stats">
//             <div className="quick-stat-item">
//               <span className="quick-stat-label">Total Units</span>
//               <span className="quick-stat-value">{filteredUnits.length}</span>
//             </div>
//             <div className="quick-stat-divider"></div>
//             <div className="quick-stat-item">
//               <span className="quick-stat-label">Total Value</span>
//               <span className="quick-stat-value">
//                 {new Intl.NumberFormat('en-US', {
//                   notation: 'compact',
//                   compactDisplay: 'short',
//                   maximumFractionDigits: 1
//                 }).format(
//                   filteredUnits.reduce((sum, unit) => sum + (parseFloat(unit.sales_value) || 0), 0)
//                 )} EGP
//               </span>
//             </div>
//           </div>
          
//           <div className="dashboard-controls">
//             <button 
//               className="btn btn-primary pdf-btn" 
//               onClick={handleGeneratePDF}
//               disabled={generatingPDF || filteredUnits.length === 0}
//             >
//               📄 Generate PDF Report
//             </button>
//             <button className="refresh-btn" onClick={loadCompanyData}>
//               🔄 Refresh
//             </button>
//           </div>
//         </div>

//         <FilterSection
//           filterOptions={allFilterOptions}
//           availableOptions={filterOptions}
//           filters={filters}
//           onFilterChange={updateFilter}
//         />

//         <KPISection units={filteredUnits} />

//         <ChartsSection
//           units={filteredUnits}
//           allUnits={units}
//           filters={filters}
//           onDateRangeChange={updateDateRange}
//           onFilterChange={updateFilter}
//         />

//         <UnitMetricsCharts units={filteredUnits} />

//         <DataTable units={filteredUnits} />
//       </div>
//     </>
//   );
// };

// export default Dashboard;





// import React, { useState, useEffect, useCallback } from 'react';
// import { getCompanyUnits } from '../../data/inventorymockData';
// import { generatePDFReport } from './Pdfgenerator';
// import FilterSection from './FilterSection';
// import KPISection from './KpiSection';
// import ChartsSection from './ChartsSection';
// import UnitMetricsCharts from './Unitmetricscharts';
// import DataTable from './DataTable';
// import './dashboard.css'

// const Dashboard = ({ companyId, companyName }) => {
//   const [units, setUnits] = useState([]);
//   const [filteredUnits, setFilteredUnits] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [generatingPDF, setGeneratingPDF] = useState(false);
//   const isUpdatingFiltersRef = React.useRef(false);
  
//   // Filter states
//   const [filters, setFilters] = useState({
//     projects: [],
//     unitTypes: [],
//     contractPaymentPlans: [],
//     statuses: [],
//     areas: [],
//     cities: [],
//     salesDateRange: { start: null, end: null },
//     deliveryDateRange: { start: null, end: null }
//   });

//   // Available filter options
//   const [filterOptions, setFilterOptions] = useState({
//     projects: [],
//     unitTypes: [],
//     contractPaymentPlans: [],
//     statuses: [],
//     areas: [],
//     cities: []
//   });

//   // All possible filter options (never changes after initial load)
//   const [allFilterOptions, setAllFilterOptions] = useState({
//     projects: [],
//     unitTypes: [],
//     contractPaymentPlans: [],
//     statuses: [],
//     areas: [],
//     cities: []
//   });

//   useEffect(() => {
//     loadCompanyData();
//   }, [companyId]);

//   useEffect(() => {
//     // Skip if we're internally updating filters to prevent infinite loop
//     if (isUpdatingFiltersRef.current) {
//       isUpdatingFiltersRef.current = false;
//       return;
//     }
//     applyFilters();
//   }, [units, filters]);

//   const loadCompanyData = async () => {
//     setLoading(true);
//     try {
//       const data = await getCompanyUnits(companyId);
//       setUnits(data.units);
//       initializeFilterOptions(data.units);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error loading company data:', error);
//       setLoading(false);
//     }
//   };

//   const initializeFilterOptions = (unitsData) => {
//     const getUniqueValues = (field) => {
//       return [...new Set(unitsData.map(u => u[field]).filter(Boolean))];
//     };

//     const options = {
//       projects: getUniqueValues('project'),
//       unitTypes: getUniqueValues('unit_type'),
//       contractPaymentPlans: getUniqueValues('adj_contract_payment_plan'),
//       statuses: getUniqueValues('status'),
//       areas: getUniqueValues('area_range'),
//       cities: getUniqueValues('city')
//     };

//     // Store all possible options (never changes)
//     setAllFilterOptions(options);
//     // Initially, available options = all options
//     setFilterOptions(options);

//     // Initialize all filters as SELECTED (show all data by default)
//     setFilters({
//       projects: options.projects,
//       unitTypes: options.unitTypes,
//       contractPaymentPlans: options.contractPaymentPlans,
//       statuses: options.statuses,
//       areas: options.areas,
//       cities: options.cities,
//       salesDateRange: { start: null, end: null },
//       deliveryDateRange: { start: null, end: null }
//     });
//   };

//   // Update available filter options based on currently filtered data
//   const updateAvailableFilterOptions = (filteredData) => {
//     const getUniqueValues = (field) => {
//       return [...new Set(filteredData.map(u => u[field]).filter(Boolean))];
//     };

//     const newOptions = {
//       projects: getUniqueValues('project'),
//       unitTypes: getUniqueValues('unit_type'),
//       contractPaymentPlans: getUniqueValues('adj_contract_payment_plan'),
//       statuses: getUniqueValues('status'),
//       areas: getUniqueValues('area_range'),
//       cities: getUniqueValues('city')
//     };

//     console.log('Updating available options:', {
//       totalUnits: filteredData.length,
//       availableProjects: newOptions.projects,
//       availableTypes: newOptions.unitTypes
//     });

//     setFilterOptions(newOptions);
//     // Don't update selected filters - keep them as is
//     // FilterSection will handle disabling non-existent options
//   };

//   const applyFilters = useCallback(() => {
//     let filtered = units.filter(unit => {
//       // Basic filters - if filter is empty OR unit matches selected values
//       const matchesProject = filters.projects.length === 0 || filters.projects.includes(unit.project);
//       const matchesUnitType = filters.unitTypes.length === 0 || filters.unitTypes.includes(unit.unit_type);
//       const matchesPaymentPlan = filters.contractPaymentPlans.length === 0 || filters.contractPaymentPlans.includes(unit.adj_contract_payment_plan);
//       const matchesStatus = filters.statuses.length === 0 || filters.statuses.includes(unit.status);
//       const matchesArea = filters.areas.length === 0 || filters.areas.includes(unit.area_range);
//       const matchesCity = filters.cities.length === 0 || filters.cities.includes(unit.city);

//       const matchesBasicFilters = (
//         matchesProject &&
//         matchesUnitType &&
//         matchesPaymentPlan &&
//         matchesStatus &&
//         matchesArea &&
//         matchesCity
//       );

//       if (!matchesBasicFilters) return false;

//       // Sales date range filter
//       if (filters.salesDateRange.start || filters.salesDateRange.end) {
//         if (!unit.reservation_date) return false;
//         const reservationDate = new Date(unit.reservation_date);
//         const afterStart = !filters.salesDateRange.start || reservationDate >= filters.salesDateRange.start;
//         const beforeEnd = !filters.salesDateRange.end || reservationDate <= filters.salesDateRange.end;
//         if (!afterStart || !beforeEnd) return false;
//       }

//       // Delivery date range filter
//       if (filters.deliveryDateRange.start || filters.deliveryDateRange.end) {
//         if (!unit.development_delivery_date) return false;
//         const deliveryDate = new Date(unit.development_delivery_date);
//         const afterStart = !filters.deliveryDateRange.start || deliveryDate >= filters.deliveryDateRange.start;
//         const beforeEnd = !filters.deliveryDateRange.end || deliveryDate <= filters.deliveryDateRange.end;
//         if (!afterStart || !beforeEnd) return false;
//       }

//       return true;
//     });

//     setFilteredUnits(filtered);
    
//     // Update available filter options based on filtered data
//     updateAvailableFilterOptions(filtered);
//   }, [units, filters]);

//   const updateFilter = (filterType, values) => {
//     setFilters(prev => ({
//       ...prev,
//       [filterType]: values
//     }));
//   };

//   const updateDateRange = (rangeType, start, end) => {
//     setFilters(prev => ({
//       ...prev,
//       [rangeType]: { start, end }
//     }));
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
//         <div className="dashboard-header">
//           <div className="quick-stats">
//             <div className="quick-stat-item">
//               <span className="quick-stat-label">Total Units</span>
//               <span className="quick-stat-value">{filteredUnits.length}</span>
//             </div>
//             <div className="quick-stat-divider"></div>
//             <div className="quick-stat-item">
//               <span className="quick-stat-label">Total Value</span>
//               <span className="quick-stat-value">
//                 {new Intl.NumberFormat('en-US', {
//                   notation: 'compact',
//                   compactDisplay: 'short',
//                   maximumFractionDigits: 1
//                 }).format(
//                   filteredUnits.reduce((sum, unit) => sum + (parseFloat(unit.sales_value) || 0), 0)
//                 )} EGP
//               </span>
//             </div>
//           </div>
          
//           <div className="dashboard-controls">
//             <button 
//               className="btn btn-primary pdf-btn" 
//               onClick={handleGeneratePDF}
//               disabled={generatingPDF || filteredUnits.length === 0}
//             >
//               📄 Generate PDF Report
//             </button>
//             <button className="refresh-btn" onClick={loadCompanyData}>
//               🔄 Refresh
//             </button>
//           </div>
//         </div>

//         <FilterSection
//           filterOptions={allFilterOptions}
//           availableOptions={filterOptions}
//           filters={filters}
//           onFilterChange={updateFilter}
//         />

//         <KPISection units={filteredUnits} />

//         <ChartsSection
//           units={filteredUnits}
//           allUnits={units}
//           filters={filters}
//           onDateRangeChange={updateDateRange}
//           onFilterChange={updateFilter}
//         />

//         <UnitMetricsCharts units={filteredUnits} />

//         <DataTable units={filteredUnits} />
//       </div>
//     </>
//   );
// };

// export default Dashboard;



import React, { useState, useEffect } from 'react';
import { getCompanyUnits } from '../../../data/inventorymockData'
import { generatePDFReport } from '../Pdfgenerator';
import FilterSection from '../FilterSection/FilterSection';
import KPISection from '../KpiSection/KpiSection';
import ChartsSection from '../ChartsSection/ChartsSection';
import UnitMetricsCharts from '../UnitMetricsCharts/Unitmetricscharts';
import DataTable from '../DataTable/DataTable';
import './dashboard.css';

const Dashboard = ({ companyId, companyName }) => {
  const [units, setUnits] = useState([]);
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  const internalUpdateRef = React.useRef(false);

  const [filters, setFilters] = useState({
    projects: [],
    unitTypes: [],
    contractPaymentPlans: [],
    statuses: [],
    areas: [],
    cities: [],
    salesDateRange: { start: null, end: null },
    deliveryDateRange: { start: null, end: null },
  });

  // Available options for CURRENT filtered result (drives disabled)
  const [availableOptions, setAvailableOptions] = useState({
    projects: [],
    unitTypes: [],
    contractPaymentPlans: [],
    statuses: [],
    areas: [],
    cities: [],
  });

  // Master lists (always visible)
  const [allFilterOptions, setAllFilterOptions] = useState({
    projects: [],
    unitTypes: [],
    contractPaymentPlans: [],
    statuses: [],
    areas: [],
    cities: [],
  });

  useEffect(() => {
    loadCompanyData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  const uniq = (arr) => [...new Set(arr.filter(Boolean))];
  const getUniqueValues = (arr, field) => uniq(arr.map((u) => u[field]));

  const loadCompanyData = async () => {
    setLoading(true);
    try {
      const data = await getCompanyUnits(companyId);
      setUnits(data.units);

      const options = {
        projects: getUniqueValues(data.units, 'project'),
        unitTypes: getUniqueValues(data.units, 'unit_type'),
        contractPaymentPlans: getUniqueValues(data.units, 'adj_contract_payment_plan'),
        statuses: getUniqueValues(data.units, 'status'),
        areas: getUniqueValues(data.units, 'area_range'),
        cities: getUniqueValues(data.units, 'city'),
      };

      setAllFilterOptions(options);
      setAvailableOptions(options);

      // default: select all
      setFilters({
        projects: options.projects,
        unitTypes: options.unitTypes,
        contractPaymentPlans: options.contractPaymentPlans,
        statuses: options.statuses,
        areas: options.areas,
        cities: options.cities,
        salesDateRange: { start: null, end: null },
        deliveryDateRange: { start: null, end: null },
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const updateFilter = (filterType, values) => {
    setFilters((prev) => ({ ...prev, [filterType]: values }));
  };

  const updateDateRange = (rangeType, start, end) => {
    setFilters((prev) => ({ ...prev, [rangeType]: { start, end } }));
  };

  const sanitize = (selected, available) => {
    if (!Array.isArray(selected)) return [];
    if (selected.length === 0) return selected; // empty = no restriction
    const set = new Set(available);
    return selected.filter((v) => set.has(v));
  };

  const sameAsSet = (a = [], b = []) => {
    if (a.length !== b.length) return false;
    const sa = new Set(a);
    for (const x of b) if (!sa.has(x)) return false;
    return true;
  };

  useEffect(() => {
    if (internalUpdateRef.current) {
      internalUpdateRef.current = false;
      return;
    }

    // Step 1: filter using current filters
    const filtered = units.filter((u) => {
      const okProject = filters.projects.length === 0 || filters.projects.includes(u.project);
      const okType = filters.unitTypes.length === 0 || filters.unitTypes.includes(u.unit_type);
      const okPlan =
        filters.contractPaymentPlans.length === 0 ||
        filters.contractPaymentPlans.includes(u.adj_contract_payment_plan);
      const okStatus = filters.statuses.length === 0 || filters.statuses.includes(u.status);
      const okArea = filters.areas.length === 0 || filters.areas.includes(u.area_range);
      const okCity = filters.cities.length === 0 || filters.cities.includes(u.city);

      if (!(okProject && okType && okPlan && okStatus && okArea && okCity)) return false;

      // sales date range
      if (filters.salesDateRange.start || filters.salesDateRange.end) {
        if (!u.reservation_date) return false;
        const d = new Date(u.reservation_date);
        if (Number.isNaN(d.getTime())) return false;
        if (filters.salesDateRange.start && d < filters.salesDateRange.start) return false;
        if (filters.salesDateRange.end && d > filters.salesDateRange.end) return false;
      }

      // delivery date range
      if (filters.deliveryDateRange.start || filters.deliveryDateRange.end) {
        if (!u.development_delivery_date) return false;
        const d = new Date(u.development_delivery_date);
        if (Number.isNaN(d.getTime())) return false;
        if (filters.deliveryDateRange.start && d < filters.deliveryDateRange.start) return false;
        if (filters.deliveryDateRange.end && d > filters.deliveryDateRange.end) return false;
      }

      return true;
    });

    setFilteredUnits(filtered);

    // Step 2: compute available options from the filtered result
    const nextAvailable = {
      projects: getUniqueValues(filtered, 'project'),
      unitTypes: getUniqueValues(filtered, 'unit_type'),
      contractPaymentPlans: getUniqueValues(filtered, 'adj_contract_payment_plan'),
      statuses: getUniqueValues(filtered, 'status'),
      areas: getUniqueValues(filtered, 'area_range'),
      cities: getUniqueValues(filtered, 'city'),
    };

    setAvailableOptions(nextAvailable);

    // Step 3: sanitize selected filters so unavailable items become unchecked+disabled
    const nextFilters = {
      ...filters,
      projects: sanitize(filters.projects, nextAvailable.projects),
      unitTypes: sanitize(filters.unitTypes, nextAvailable.unitTypes),
      contractPaymentPlans: sanitize(filters.contractPaymentPlans, nextAvailable.contractPaymentPlans),
      statuses: sanitize(filters.statuses, nextAvailable.statuses),
      areas: sanitize(filters.areas, nextAvailable.areas),
      cities: sanitize(filters.cities, nextAvailable.cities),
    };

    const changed =
      !sameAsSet(nextFilters.projects, filters.projects) ||
      !sameAsSet(nextFilters.unitTypes, filters.unitTypes) ||
      !sameAsSet(nextFilters.contractPaymentPlans, filters.contractPaymentPlans) ||
      !sameAsSet(nextFilters.statuses, filters.statuses) ||
      !sameAsSet(nextFilters.areas, filters.areas) ||
      !sameAsSet(nextFilters.cities, filters.cities);

    if (changed) {
      internalUpdateRef.current = true;
      setFilters(nextFilters);
    }
  }, [units, filters]);

  const handleGeneratePDF = async () => {
    setGeneratingPDF(true);
    try {
      await generatePDFReport(companyName, filteredUnits.length, units.length);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report. Please try again.');
    } finally {
      setGeneratingPDF(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner spinner-large"></div>
        <p className="loading-text">Loading {companyName} data...</p>
      </div>
    );
  }

  return (
    <>
      {generatingPDF && (
        <div className="dashboard-loading">
          <div className="spinner spinner-large"></div>
          <p className="loading-text">Generating PDF Report...</p>
        </div>
      )}

      <div className="dashboard-container">

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
        <DataTable units={filteredUnits} />
      </div>
    </>
  );
};

export default Dashboard;
