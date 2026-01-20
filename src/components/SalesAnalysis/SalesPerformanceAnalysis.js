// components/SalesPerformanceAnalysis.js
import React, { useState, useEffect } from 'react';
import salesPerformanceService from '../../data/salesPerformanceService';
import Toast from './Toast';
import './salesPerformanceAnalysis.css';

const SalesPerformanceAnalysis = () => {
  // State management
  const [companies, setCompanies] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showPremiumAnalysis, setShowPremiumAnalysis] = useState(false);
  
  // Analysis data
  const [priceRangeData, setPriceRangeData] = useState(null);
  const [unitModelData, setUnitModelData] = useState(null);
  const [premiumData, setPremiumData] = useState({});
  
  // Current view states
  const [currentAnalysisType, setCurrentAnalysisType] = useState('all');
  const [currentPremiumType, setCurrentPremiumType] = useState('all');
  
  // Toast notifications
  const [toasts, setToasts] = useState([]);
  
  // Stored data for switching views
  const [allAnalysisData, setAllAnalysisData] = useState({});
  const [allPremiumData, setAllPremiumData] = useState({});
  
  // Total units for percentage calculation
  const [priceRangeTotalUnits, setPriceRangeTotalUnits] = useState(0);

  // Load companies on mount
  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      const response = await salesPerformanceService.getCompanies();
      if (response.success) {
        setCompanies(response.data);
      }
    } catch (error) {
      showToast('danger', 'Failed to load companies');
    }
  };

  const handleCompanyChange = async (e) => {
    const companyId = e.target.value;
    setSelectedCompany(companyId);
    setSelectedProject('');
    setProjects([]);
    setShowAnalysis(false);
    setShowPremiumAnalysis(false);

    if (companyId) {
      try {
        const response = await salesPerformanceService.getCompanyProjects(companyId);
        if (response.success) {
          setProjects(response.data);
        }
      } catch (error) {
        showToast('danger', 'Failed to load projects');
      }
    }
  };

  const handleProjectChange = (e) => {
    setSelectedProject(e.target.value);
    setShowAnalysis(false);
    setShowPremiumAnalysis(false);
  };

  const loadAllAnalysisData = async () => {
    if (!selectedProject) {
      showToast('warning', 'Please select a project first');
      return;
    }

    setLoading(true);
    
    try {
      // Load price range data
      const priceResponse = await salesPerformanceService.getSalesAnalysisData(selectedProject);
      if (priceResponse.success) {
        setPriceRangeData(priceResponse.data);
        setAllAnalysisData(prev => ({ ...prev, priceRange: priceResponse.data }));
        setPriceRangeTotalUnits(priceResponse.data.totals?.all || 0);
      }

      // Load unit model data
      const modelResponse = await salesPerformanceService.getSalesAnalysisByUnitModel(selectedProject);
      if (modelResponse.success) {
        setUnitModelData(modelResponse.data);
        setAllAnalysisData(prev => ({ ...prev, unitModel: modelResponse.data }));
      }

      setShowAnalysis(true);
      setCurrentAnalysisType('all');
      
      setTimeout(() => {
        smoothScrollToAnalysis();
      }, 100);
      
      showToast('success', 'Analysis loaded successfully');
    } catch (error) {
      showToast('danger', 'Failed to load analysis data');
    } finally {
      setLoading(false);
    }
  };

  const loadPremiumAnalysis = async (premiumType) => {
    if (!selectedProject) {
      showToast('warning', 'Please select a project first');
      return;
    }

    setLoading(true);

    try {
      const response = await salesPerformanceService.getPremiumAnalysisData(selectedProject, premiumType);
      if (response.success) {
        setPremiumData(prev => ({ ...prev, [premiumType]: response.data }));
        setAllPremiumData(prev => ({ ...prev, [premiumType]: response.data }));
        setShowPremiumAnalysis(true);
        setCurrentPremiumType(premiumType);
        
        setTimeout(() => {
          smoothScrollToPremium();
        }, 100);
        
        showToast('success', `${formatPremiumType(premiumType)} analysis loaded successfully`);
      }
    } catch (error) {
      showToast('danger', 'Failed to load premium analysis');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalysisTypeClick = (type) => {
    setCurrentAnalysisType(type);
    setShowAnalysis(true);
    
    setTimeout(() => {
      smoothScrollToAnalysis();
    }, 100);
  };

  const handlePremiumTypeClick = (type) => {
    if (type === 'all') {
      setCurrentPremiumType('all');
      setShowPremiumAnalysis(false);
      return;
    }

    if (allPremiumData[type]) {
      setCurrentPremiumType(type);
      setPremiumData(prev => ({ ...prev, [type]: allPremiumData[type] }));
      setShowPremiumAnalysis(true);
      
      setTimeout(() => {
        smoothScrollToPremium();
      }, 100);
    } else {
      loadPremiumAnalysis(type);
    }
  };

  const handleReset = () => {
    setSelectedCompany('');
    setSelectedProject('');
    setProjects([]);
    setShowAnalysis(false);
    setShowPremiumAnalysis(false);
    setPriceRangeData(null);
    setUnitModelData(null);
    setPremiumData({});
    setAllAnalysisData({});
    setAllPremiumData({});
    setCurrentAnalysisType('all');
    setCurrentPremiumType('all');
    setPriceRangeTotalUnits(0);
  };

  const smoothScrollToAnalysis = () => {
    const element = document.getElementById('analysisContent');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const smoothScrollToPremium = () => {
    const element = document.getElementById('premiumAnalysisContent');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const showToast = (type, message) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const formatPriceEGP = (price) => {
    if (price >= 1000000) {
      return (price / 1000000).toFixed(2) + 'M EGP';
    } else if (price >= 1000) {
      return (price / 1000).toFixed(2) + 'K EGP';
    } else {
      return price.toFixed(0) + ' EGP';
    }
  };

  const formatPremiumType = (type) => {
    const mapping = {
      'main_view': 'Main View',
      'secondary_view': 'Secondary View',
      'north_breeze': 'North Breeze',
      'corners': 'Corners',
      'accessibility': 'Accessibility',
      'special_premiums': 'Special Premiums',
      'special_discounts': 'Special Discounts'
    };
    return mapping[type] || type;
  };

  const renderPriceRangeTable = () => {
    if (!priceRangeData || !priceRangeData.price_ranges) return null;

    const { price_ranges, totals } = priceRangeData;

    return (
      <div className="table-responsive">
        <table className="pivot-table">
          <thead>
            <tr className="bg-dark-header">
              <th className="price-range-header">PRICE RANGE</th>
              <th colSpan="3" className="bg-primary text-white">TOTAL UNITS</th>
              <th colSpan="2" className="text-white">UNRELEASED UNITS</th>
              <th colSpan="2" className="text-white">RELEASED UNITS</th>
              <th colSpan="2" className="text-white">CURRENT STATUS</th>
              <th colSpan="2" className="bg-orange text-white">SALES PERFORMANCE</th>
            </tr>
            <tr className="bg-light">
              <th></th>
              <th>ALL</th>
              <th>BREAKDOWN</th>
              <th>TOTAL BREAKDOWN %</th>
              <th>UNRELEASED</th>
              <th>UNRELEASED %</th>
              <th>RELEASED</th>
              <th>RELEASED %</th>
              <th>AVAILABLE</th>
              <th>SOLD/BOOKED</th>
              <th>SALES % FROM RELEASED</th>
              <th>SALES % FROM TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {price_ranges.map((range, index) => {
              const unreleased = range.all - range.released;
              const unreleasedPercent = range.all > 0 ? (unreleased / range.all) * 100 : 0;
              const releasedPercent = range.all > 0 ? (range.released / range.all) * 100 : 0;
              const salesFromReleasedPercent = range.released > 0 ? (range.sold_booked / range.released) * 100 : 0;
              const salesFromTotalPercent = range.all > 0 ? (range.sold_booked / range.all) * 100 : 0;

              return (
                <tr key={index}>
                  <td className="text-start">{formatPriceEGP(range.from)} - {formatPriceEGP(range.to)}</td>
                  <td>{range.all || '-'}</td>
                  <td>{range.breakdown_percent > 0 ? range.breakdown_percent.toFixed(1) + '%' : '-'}</td>
                  <td>{range.breakdown_percent > 0 ? range.breakdown_percent.toFixed(1) + '%' : '-'}</td>
                  <td>{unreleased || '-'}</td>
                  <td>{unreleasedPercent > 0 ? unreleasedPercent.toFixed(1) + '%' : '-'}</td>
                  <td>{range.released || '-'}</td>
                  <td>{releasedPercent > 0 ? releasedPercent.toFixed(1) + '%' : '-'}</td>
                  <td>{range.available || '-'}</td>
                  <td>{range.sold_booked || '-'}</td>
                  <td className="percentage-cell">
                    <div className="percentage-text">
                      {salesFromReleasedPercent > 0 ? salesFromReleasedPercent.toFixed(1) + '%' : '-'}
                    </div>
                    {salesFromReleasedPercent > 0 && (
                      <div className="progress">
                        <div 
                          className="progress-bar bg-gray" 
                          style={{ width: `${salesFromReleasedPercent}%` }}
                        ></div>
                      </div>
                    )}
                  </td>
                  <td className="percentage-cell">
                    <div className="percentage-text">
                      {salesFromTotalPercent > 0 ? salesFromTotalPercent.toFixed(1) + '%' : '-'}
                    </div>
                    {salesFromTotalPercent > 0 && (
                      <div className="progress">
                        <div 
                          className="progress-bar bg-success" 
                          style={{ width: `${salesFromTotalPercent}%` }}
                        ></div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {renderGrandTotalRow(totals, 'price')}
          </tbody>
        </table>
      </div>
    );
  };

  const renderUnitModelTable = () => {
    if (!unitModelData || !unitModelData.unit_models) return null;

    const { unit_models, totals } = unitModelData;

    return (
      <div className="table-responsive">
        <table className="pivot-table">
          <thead>
            <tr className="bg-dark-header">
              <th className="unit-model-header">UNIT MODEL</th>
              <th colSpan="2" className="bg-primary text-white">TOTAL UNITS</th>
              <th colSpan="2" className="text-white">UNRELEASED UNITS</th>
              <th colSpan="2" className="text-white">RELEASED UNITS</th>
              <th colSpan="2" className="text-white">CURRENT STATUS</th>
              <th colSpan="2" className="bg-orange text-white">SALES PERFORMANCE</th>
            </tr>
            <tr className="bg-light">
              <th></th>
              <th>ALL</th>
              <th>BREAKDOWN</th>
              <th>UNRELEASED</th>
              <th>UNRELEASED %</th>
              <th>RELEASED</th>
              <th>RELEASED %</th>
              <th>AVAILABLE</th>
              <th>SOLD/BOOKED</th>
              <th>SALES % FROM RELEASED</th>
              <th>SALES % FROM TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {unit_models.map((model, index) => {
              const unreleased = model.all - model.released;
              const unreleasedPercent = model.all > 0 ? (unreleased / model.all) * 100 : 0;
              const releasedPercent = model.all > 0 ? (model.released / model.all) * 100 : 0;
              const salesFromReleasedPercent = model.released > 0 ? (model.sold_booked / model.released) * 100 : 0;
              const salesFromTotalPercent = model.all > 0 ? (model.sold_booked / model.all) * 100 : 0;

              return (
                <tr key={index}>
                  <td className="text-start">{model.unit_model || 'N/A'}</td>
                  <td>{model.all || '-'}</td>
                  <td>{model.breakdown_percent > 0 ? model.breakdown_percent.toFixed(1) + '%' : '-'}</td>
                  <td>{unreleased || '-'}</td>
                  <td>{unreleasedPercent > 0 ? unreleasedPercent.toFixed(1) + '%' : '-'}</td>
                  <td>{model.released || '-'}</td>
                  <td>{releasedPercent > 0 ? releasedPercent.toFixed(1) + '%' : '-'}</td>
                  <td>{model.available || '-'}</td>
                  <td>{model.sold_booked || '-'}</td>
                  <td className="percentage-cell">
                    <div className="percentage-text">
                      {salesFromReleasedPercent > 0 ? salesFromReleasedPercent.toFixed(1) + '%' : '-'}
                    </div>
                    {salesFromReleasedPercent > 0 && (
                      <div className="progress">
                        <div 
                          className="progress-bar bg-gray" 
                          style={{ width: `${salesFromReleasedPercent}%` }}
                        ></div>
                      </div>
                    )}
                  </td>
                  <td className="percentage-cell">
                    <div className="percentage-text">
                      {salesFromTotalPercent > 0 ? salesFromTotalPercent.toFixed(1) + '%' : '-'}
                    </div>
                    {salesFromTotalPercent > 0 && (
                      <div className="progress">
                        <div 
                          className="progress-bar bg-success" 
                          style={{ width: `${salesFromTotalPercent}%` }}
                        ></div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {renderGrandTotalRow(totals, 'model')}
          </tbody>
        </table>
      </div>
    );
  };

  const renderPremiumTable = () => {
    const currentData = premiumData[currentPremiumType];
    if (!currentData || !currentData.premium_groups) return null;

    const { premium_groups, totals } = currentData;

    return (
      <div className="table-responsive">
        <table className="pivot-table">
          <thead>
            <tr className="bg-dark-header">
              <th className="premium-header">{formatPremiumType(currentPremiumType).toUpperCase()}</th>
              <th colSpan="3" className="bg-primary text-white">TOTAL UNITS</th>
              <th colSpan="2" className="text-white">UNRELEASED UNITS</th>
              <th colSpan="2" className="text-white">RELEASED UNITS</th>
              <th colSpan="2" className="text-white">CURRENT STATUS</th>
              <th colSpan="2" className="bg-orange text-white">SALES PERFORMANCE</th>
            </tr>
            <tr className="bg-light">
              <th></th>
              <th>ALL</th>
              <th>PREMIUM %</th>
              <th>BREAKDOWN %</th>
              <th>UNRELEASED</th>
              <th>UNRELEASED %</th>
              <th>RELEASED</th>
              <th>RELEASED %</th>
              <th>AVAILABLE</th>
              <th>SOLD/BOOKED</th>
              <th>SALES % FROM RELEASED</th>
              <th>SALES % FROM TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {premium_groups.map((group, index) => {
              const unreleased = group.all - group.released;
              const unreleasedPercent = group.all > 0 ? (unreleased / group.all) * 100 : 0;
              const breakdownPercent = totals.all > 0 ? (group.all / totals.all) * 100 : 0;
              const releasedPercent = totals.all > 0 ? (group.released / totals.all) * 100 : 0;
              const salesFromReleasedPercent = group.released > 0 ? (group.sold_booked / group.released) * 100 : 0;
              const salesFromTotalPercent = group.all > 0 ? (group.sold_booked / group.all) * 100 : 0;

              return (
                <tr key={index}>
                  <td className="text-start">{group.premium_value || 'N/A'}</td>
                  <td>{group.all || '-'}</td>
                  <td>{group.premium_percent > 0 ? group.premium_percent.toFixed(1) + '%' : '-'}</td>
                  <td>{breakdownPercent > 0 ? breakdownPercent.toFixed(1) + '%' : '-'}</td>
                  <td>{unreleased || '-'}</td>
                  <td>{unreleasedPercent > 0 ? unreleasedPercent.toFixed(1) + '%' : '-'}</td>
                  <td>{group.released || '-'}</td>
                  <td>{releasedPercent > 0 ? releasedPercent.toFixed(1) + '%' : '-'}</td>
                  <td>{group.available || '-'}</td>
                  <td>{group.sold_booked || '-'}</td>
                  <td className="percentage-cell">
                    <div className="percentage-text">
                      {salesFromReleasedPercent > 0 ? salesFromReleasedPercent.toFixed(1) + '%' : '-'}
                    </div>
                    {salesFromReleasedPercent > 0 && (
                      <div className="progress">
                        <div 
                          className="progress-bar bg-gray" 
                          style={{ width: `${salesFromReleasedPercent}%` }}
                        ></div>
                      </div>
                    )}
                  </td>
                  <td className="percentage-cell">
                    <div className="percentage-text">
                      {salesFromTotalPercent > 0 ? salesFromTotalPercent.toFixed(1) + '%' : '-'}
                    </div>
                    {salesFromTotalPercent > 0 && (
                      <div className="progress">
                        <div 
                          className="progress-bar bg-success" 
                          style={{ width: `${salesFromTotalPercent}%` }}
                        ></div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {renderGrandTotalRow(totals, 'premium')}
          </tbody>
        </table>
      </div>
    );
  };

  const renderGrandTotalRow = (totals, type) => {
    const totalUnreleased = (totals.all || 0) - (totals.released || 0);
    const totalUnreleasedPercent = totals.all > 0 ? (totalUnreleased / totals.all) * 100 : 0;
    const totalBreakdownPercent = priceRangeTotalUnits > 0 ? (totals.all / priceRangeTotalUnits) * 100 : 0;
    const totalSalesFromReleasedPercent = totals.released > 0 ? (totals.sold_booked / totals.released) * 100 : 0;
    const totalSalesFromTotalPercent = totals.all > 0 ? (totals.sold_booked / totals.all) * 100 : 0;

    if (type === 'price') {
      return (
        <tr className="grand-total-row">
          <td className="text-center fw-bold">GRAND TOTAL</td>
          <td>{totals.all || '-'}</td>
          <td>-</td>
          <td>{totalBreakdownPercent > 0 ? totalBreakdownPercent.toFixed(1) + '%' : '-'}</td>
          <td>{totalUnreleased || '-'}</td>
          <td>{totalUnreleasedPercent > 0 ? totalUnreleasedPercent.toFixed(1) + '%' : '-'}</td>
          <td>{totals.released || '-'}</td>
          <td>{totals.all > 0 ? ((totals.released / totals.all) * 100).toFixed(1) + '%' : '-'}</td>
          <td>{totals.available || '-'}</td>
          <td>{totals.sold_booked || '-'}</td>
          <td className="percentage-cell">
            <div className="percentage-text">
              {totalSalesFromReleasedPercent > 0 ? totalSalesFromReleasedPercent.toFixed(1) + '%' : '-'}
            </div>
            {totalSalesFromReleasedPercent > 0 && (
              <div className="progress">
                <div 
                  className="progress-bar bg-gray" 
                  style={{ width: `${totalSalesFromReleasedPercent}%` }}
                ></div>
              </div>
            )}
          </td>
          <td className="percentage-cell">
            <div className="percentage-text">
              {totalSalesFromTotalPercent > 0 ? totalSalesFromTotalPercent.toFixed(1) + '%' : '-'}
            </div>
            {totalSalesFromTotalPercent > 0 && (
              <div className="progress">
                <div 
                  className="progress-bar bg-success" 
                  style={{ width: `${totalSalesFromTotalPercent}%` }}
                ></div>
              </div>
            )}
          </td>
        </tr>
      );
    } else if (type === 'model') {
      return (
        <tr className="grand-total-row">
          <td className="text-center fw-bold">GRAND TOTAL</td>
          <td>{totals.all || '-'}</td>
          <td>-</td>
          <td>{totalUnreleased || '-'}</td>
          <td>{totalUnreleasedPercent > 0 ? totalUnreleasedPercent.toFixed(1) + '%' : '-'}</td>
          <td>{totals.released || '-'}</td>
          <td>{totals.all > 0 ? ((totals.released / totals.all) * 100).toFixed(1) + '%' : '-'}</td>
          <td>{totals.available || '-'}</td>
          <td>{totals.sold_booked || '-'}</td>
          <td className="percentage-cell">
            <div className="percentage-text">
              {totalSalesFromReleasedPercent > 0 ? totalSalesFromReleasedPercent.toFixed(1) + '%' : '-'}
            </div>
            {totalSalesFromReleasedPercent > 0 && (
              <div className="progress">
                <div 
                  className="progress-bar bg-gray" 
                  style={{ width: `${totalSalesFromReleasedPercent}%` }}
                ></div>
              </div>
            )}
          </td>
          <td className="percentage-cell">
            <div className="percentage-text">
              {totalSalesFromTotalPercent > 0 ? totalSalesFromTotalPercent.toFixed(1) + '%' : '-'}
            </div>
            {totalSalesFromTotalPercent > 0 && (
              <div className="progress">
                <div 
                  className="progress-bar bg-success" 
                  style={{ width: `${totalSalesFromTotalPercent}%` }}
                ></div>
              </div>
            )}
          </td>
        </tr>
      );
    } else {
      return (
        <tr className="grand-total-row">
          <td className="text-center fw-bold">GRAND TOTAL</td>
          <td>{totals.all || '-'}</td>
          <td>-</td>
          <td>{totalBreakdownPercent > 0 ? totalBreakdownPercent.toFixed(1) + '%' : '-'}</td>
          <td>{totalUnreleased || '-'}</td>
          <td>{totalUnreleasedPercent > 0 ? totalUnreleasedPercent.toFixed(1) + '%' : '-'}</td>
          <td>{totals.released || '-'}</td>
          <td>{totals.all > 0 ? ((totals.released / totals.all) * 100).toFixed(1) + '%' : '-'}</td>
          <td>{totals.available || '-'}</td>
          <td>{totals.sold_booked || '-'}</td>
          <td className="percentage-cell">
            <div className="percentage-text">
              {totalSalesFromReleasedPercent > 0 ? totalSalesFromReleasedPercent.toFixed(1) + '%' : '-'}
            </div>
            {totalSalesFromReleasedPercent > 0 && (
              <div className="progress">
                <div 
                  className="progress-bar bg-gray" 
                  style={{ width: `${totalSalesFromReleasedPercent}%` }}
                ></div>
              </div>
            )}
          </td>
          <td className="percentage-cell">
            <div className="percentage-text">
              {totalSalesFromTotalPercent > 0 ? totalSalesFromTotalPercent.toFixed(1) + '%' : '-'}
            </div>
            {totalSalesFromTotalPercent > 0 && (
              <div className="progress">
                <div 
                  className="progress-bar bg-success" 
                  style={{ width: `${totalSalesFromTotalPercent}%` }}
                ></div>
              </div>
            )}
          </td>
        </tr>
      );
    }
  };

  return (
    <div className="sales-performance-container">
      {/* Toast Container */}
      <div className="toast-container">
        {toasts.map(toast => (
          <Toast 
            key={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="container">
        {/* Page Title - Inventory Style */}
        <div className="page-title-container">
          <div className="page-title-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect x="4" y="4" width="24" height="24" rx="3" stroke="#e2740a" strokeWidth="2.5"/>
              <rect x="10" y="14" width="4" height="10" fill="#10b981"/>
              <rect x="14" y="10" width="4" height="14" fill="#e2740a"/>
              <rect x="18" y="16" width="4" height="8" fill="#3b82f6"/>
            </svg>
          </div>
          <div className="page-title-wrapper">
            <h1 className="page-title">Sales Performance Analysis</h1>
            {/* <div className="page-title-underline"></div> */}
          </div>
        </div>
        {/* Selection Card */}
        <div className="card selection-card">
          <div className="card-header">
            <h2 className="card-title">Select Project for Analysis</h2>
          </div>
          <div className="card-body">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="companySelect">Company</label>
                <select
                  id="companySelect"
                  className="form-select"
                  value={selectedCompany}
                  onChange={handleCompanyChange}
                >
                  <option value="">-- Select Company --</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCompany && (
                <div className="form-group">
                  <label htmlFor="projectSelect">Project</label>
                  <select
                    id="projectSelect"
                    className="form-select"
                    value={selectedProject}
                    onChange={handleProjectChange}
                  >
                    <option value="">-- Select Project --</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="button-group">
              <button
                className="btn btn-primary"
                onClick={loadAllAnalysisData}
                disabled={!selectedProject || loading}
              >
                {loading ? 'Loading...' : 'Load Analysis'}
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleReset}
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading analysis data...</p>
          </div>
        )}

        {/* Analysis Content */}
        {showAnalysis && (
          <div id="analysisContent" className="analysis-content">
            <div className="card">
              <div className="card-header">
                <div className="analysis-type-buttons">
                  <button
                    className={`analysis-type-btn ${currentAnalysisType === 'all' ? 'active' : ''}`}
                    onClick={() => handleAnalysisTypeClick('all')}
                  >
                    All
                  </button>
                  <button
                    className={`analysis-type-btn ${currentAnalysisType === 'priceRange' ? 'active' : ''}`}
                    onClick={() => handleAnalysisTypeClick('priceRange')}
                  >
                    Price Range
                  </button>
                  <button
                    className={`analysis-type-btn ${currentAnalysisType === 'unitModel' ? 'active' : ''}`}
                    onClick={() => handleAnalysisTypeClick('unitModel')}
                  >
                    Unit Model
                  </button>
                </div>
              </div>
              <div className="card-body">
                {(currentAnalysisType === 'all' || currentAnalysisType === 'priceRange') && (
                  <div className="analysis-section">
                    <h3 className="section-title">Price Range Analysis</h3>
                    {renderPriceRangeTable()}
                  </div>
                )}

                {(currentAnalysisType === 'all' || currentAnalysisType === 'unitModel') && (
                  <div className="analysis-section">
                    <h3 className="section-title">Unit Model Analysis</h3>
                    {renderUnitModelTable()}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Premium Analysis Selection */}
        {showAnalysis && (
          <div className="card premium-selection-card">
            <div className="card-header">
              <h2 className="card-title">Premium Analysis</h2>
            </div>
            <div className="card-body">
              <div className="premium-analysis-buttons">
                <button
                  className={`premium-analysis-btn ${currentPremiumType === 'all' ? 'active' : ''}`}
                  onClick={() => handlePremiumTypeClick('all')}
                >
                  All
                </button>
                <button
                  className={`premium-analysis-btn ${currentPremiumType === 'main_view' ? 'active' : ''}`}
                  onClick={() => handlePremiumTypeClick('main_view')}
                >
                  Main View
                </button>
                <button
                  className={`premium-analysis-btn ${currentPremiumType === 'secondary_view' ? 'active' : ''}`}
                  onClick={() => handlePremiumTypeClick('secondary_view')}
                >
                  Secondary View
                </button>
                <button
                  className={`premium-analysis-btn ${currentPremiumType === 'north_breeze' ? 'active' : ''}`}
                  onClick={() => handlePremiumTypeClick('north_breeze')}
                >
                  North Breeze
                </button>
                <button
                  className={`premium-analysis-btn ${currentPremiumType === 'corners' ? 'active' : ''}`}
                  onClick={() => handlePremiumTypeClick('corners')}
                >
                  Corners
                </button>
                <button
                  className={`premium-analysis-btn ${currentPremiumType === 'accessibility' ? 'active' : ''}`}
                  onClick={() => handlePremiumTypeClick('accessibility')}
                >
                  Accessibility
                </button>
                <button
                  className={`premium-analysis-btn ${currentPremiumType === 'special_premiums' ? 'active' : ''}`}
                  onClick={() => handlePremiumTypeClick('special_premiums')}
                >
                  Special Premiums
                </button>
                <button
                  className={`premium-analysis-btn ${currentPremiumType === 'special_discounts' ? 'active' : ''}`}
                  onClick={() => handlePremiumTypeClick('special_discounts')}
                >
                  Special Discounts
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Premium Analysis Content */}
        {showPremiumAnalysis && currentPremiumType !== 'all' && (
          <div id="premiumAnalysisContent" className="premium-analysis-content">
            <div className="card">
              <div className="card-header">
                <h3 className="section-title">{formatPremiumType(currentPremiumType)} Analysis</h3>
              </div>
              <div className="card-body">
                {renderPremiumTable()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesPerformanceAnalysis;