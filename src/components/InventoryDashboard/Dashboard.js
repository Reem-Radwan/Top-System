
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


import React, { useState, useEffect, useCallback } from 'react';
import { getCompanyUnits } from '../../data/inventorymockData';
import { generatePDFReport } from './Pdfgenerator';
import FilterSection from './FilterSection';
import KPISection from './KpiSection';
import ChartsSection from './ChartsSection';
import UnitMetricsCharts from './Unitmetricscharts';
import DataTable from './DataTable';
import './dashboard.css'

const Dashboard = ({ companyId, companyName }) => {
  const [units, setUnits] = useState([]);
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    projects: [],
    unitTypes: [],
    contractPaymentPlans: [],
    statuses: [],
    areas: [],
    cities: [],
    salesDateRange: { start: null, end: null },
    deliveryDateRange: { start: null, end: null }
  });

  // Filter options
  const [filterOptions, setFilterOptions] = useState({
    projects: [],
    unitTypes: [],
    contractPaymentPlans: [],
    statuses: [],
    areas: [],
    cities: []
  });

  // Initialize filter options
  const initializeFilterOptions = useCallback((unitsData) => {
    const getUniqueValues = (field) =>
      [...new Set(unitsData.map(u => u[field]).filter(Boolean))];

    const options = {
      projects: getUniqueValues('project'),
      unitTypes: getUniqueValues('unit_type'),
      contractPaymentPlans: getUniqueValues('adj_contract_payment_plan'),
      statuses: getUniqueValues('status'),
      areas: getUniqueValues('area_range'),
      cities: getUniqueValues('city')
    };

    setFilterOptions(options);

    setFilters({
      projects: options.projects,
      unitTypes: options.unitTypes,
      contractPaymentPlans: options.contractPaymentPlans,
      statuses: options.statuses,
      areas: options.areas,
      cities: options.cities,
      salesDateRange: { start: null, end: null },
      deliveryDateRange: { start: null, end: null }
    });
  }, []);

  // Load company data
  const loadCompanyData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCompanyUnits(companyId);
      setUnits(data.units);
      initializeFilterOptions(data.units);
    } catch (error) {
      console.error('Error loading company data:', error);
    } finally {
      setLoading(false);
    }
  }, [companyId, initializeFilterOptions]);

  // Apply filters
  const applyFilters = useCallback(() => {
    const filtered = units.filter(unit => {
      const matchesBasicFilters =
        (filters.projects.length === 0 || filters.projects.includes(unit.project)) &&
        (filters.unitTypes.length === 0 || filters.unitTypes.includes(unit.unit_type)) &&
        (filters.contractPaymentPlans.length === 0 ||
          filters.contractPaymentPlans.includes(unit.adj_contract_payment_plan)) &&
        (filters.statuses.length === 0 || filters.statuses.includes(unit.status)) &&
        (filters.areas.length === 0 || filters.areas.includes(unit.area_range)) &&
        (filters.cities.length === 0 || filters.cities.includes(unit.city));

      if (!matchesBasicFilters) return false;

      // Sales date filter
      if (filters.salesDateRange.start || filters.salesDateRange.end) {
        if (!unit.reservation_date) return false;
        const date = new Date(unit.reservation_date);
        if (
          (filters.salesDateRange.start && date < filters.salesDateRange.start) ||
          (filters.salesDateRange.end && date > filters.salesDateRange.end)
        ) {
          return false;
        }
      }

      // Delivery date filter
      if (filters.deliveryDateRange.start || filters.deliveryDateRange.end) {
        if (!unit.development_delivery_date) return false;
        const date = new Date(unit.development_delivery_date);
        if (
          (filters.deliveryDateRange.start && date < filters.deliveryDateRange.start) ||
          (filters.deliveryDateRange.end && date > filters.deliveryDateRange.end)
        ) {
          return false;
        }
      }

      return true;
    });

    setFilteredUnits(filtered);
  }, [units, filters]);

  // Effects
  useEffect(() => {
    loadCompanyData();
  }, [loadCompanyData]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Handlers
  const updateFilter = (filterType, values) => {
    setFilters(prev => ({ ...prev, [filterType]: values }));
  };

  const updateDateRange = (rangeType, start, end) => {
    setFilters(prev => ({ ...prev, [rangeType]: { start, end } }));
  };

  const handleGeneratePDF = async () => {
    setGeneratingPDF(true);
    try {
      await generatePDFReport(companyName, filteredUnits.length, units.length);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report.');
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
      <div className="dashboard-container">

        <FilterSection
          filterOptions={filterOptions}
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
