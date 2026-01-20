import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getCompanyUnits } from '../../../data/inventorymockData';
import { generatePDFReport } from '../Pdfgenerator';
import FilterSection from '../FilterSection/FilterSection';
import KPISection from '../KpiSection/KpiSection';
import ChartsSection from '../ChartsSection/ChartsSection';
import UnitMetricsCharts from '../UnitMetricsCharts/Unitmetricscharts';
import DataTable from '../DataTable/DataTable';
import PivotTable from '../PivotTable';
import InvStatusPivot from '../Invstatuspivot'
import './dashboard.css';
import SalesProgressPivot from '../SalesProgressPivot/SalesProgressPivot'
import DeliveryPlanPivot from '../DeliveryPlanPivot/DeliveryPlanPivot';

const Dashboard = ({ companyId, companyName, onViewChange }) => {
  const [units, setUnits] = useState([]);
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  
  // Mobile navigation tabs ref for scrolling
  const tabsContainerRef = useRef(null);
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

  // Scroll to last tab on mobile when component mounts
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768 && tabsContainerRef.current) {
        // Scroll to the end (right side) to show the last tabs
        setTimeout(() => {
          tabsContainerRef.current.scrollLeft = tabsContainerRef.current.scrollWidth;
        }, 100);
      }
    };

    // Initial scroll
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle view change and scroll on mobile
  const handleViewChange = (view) => {
    setCurrentView(view);
    
    // Scroll tabs container to show active tab on mobile
    if (window.innerWidth <= 768 && tabsContainerRef.current) {
      setTimeout(() => {
        const activeTab = tabsContainerRef.current.querySelector('.dashboard-tab.active');
        if (activeTab) {
          activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }
      }, 50);
    }
  };

  // Notify parent when view changes
  useEffect(() => {
    if (onViewChange) {
      onViewChange(currentView);
    }
  }, [currentView, onViewChange]);

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

  const applyFilters = useCallback(() => {
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

  useEffect(() => {
    if (internalUpdateRef.current) {
      internalUpdateRef.current = false;
      return;
    }
    applyFilters();
  }, [applyFilters]);

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
        {/* Page Title Header */}
        {/* <div className="dashboard-page-header">
          <h1 className="page-title">{getPageTitle()}</h1>
        </div> */}

        {/* Tab Navigation - Always Visible */}
        <div className="dashboard-tabs-container">
          <div className="dashboard-tabs" ref={tabsContainerRef}>
            <button 
              className={`dashboard-tab ${currentView === 'home' ? 'active' : ''}`}
              onClick={() => handleViewChange('home')}
            >
              🏠 Home Page
            </button>
            <button 
              className={`dashboard-tab ${currentView === 'project-data' ? 'active' : ''}`}
              onClick={() => handleViewChange('project-data')}
            >
              📊 Project Data
            </button>
            <button 
              className={`dashboard-tab ${currentView === 'inv-status' ? 'active' : ''}`}
              onClick={() => handleViewChange('inv-status')}
            >
              📦 Inv Status
            </button>
            <button 
              className={`dashboard-tab ${currentView === 'sales-progress' ? 'active' : ''}`}
              onClick={() => handleViewChange('sales-progress')}
            >
              📈 Sales Progress
            </button>
            <button 
              className={`dashboard-tab ${currentView === 'delivery-plan' ? 'active' : ''}`}
              onClick={() => handleViewChange('delivery-plan')}
            >
              🚚 Delivery Plan
            </button>
          </div>
        </div>

        {/* Home Page View */}
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
            
            <DataTable units={filteredUnits} />
          </div>
        )}

        {/* Project Data View */}
        {currentView === 'project-data' && (
          <div className="project-data-view">
            <div className="pivot-section">
              <PivotTable units={filteredUnits} />
            </div>
          </div>
        )}

        {/* Inv Status View */}
        {currentView === 'inv-status' && (
          <div className="inv-status-view">
            <InvStatusPivot units={filteredUnits} />
          </div>
        )}

        {/* Sales Progress View */}
         {currentView === 'sales-progress' && (
          <div className="sales-progress-view">
            <SalesProgressPivot units={filteredUnits} />
          </div>
        )}

        {/* Delivery Plan View */}
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