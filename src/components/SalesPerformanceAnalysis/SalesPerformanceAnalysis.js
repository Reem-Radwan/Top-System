
// // components/SalesPerformanceAnalysis.js
// import React, { useState, useEffect } from 'react';
// import salesPerformanceService from '../../data/salesPerformanceService';
// import Toast from './Toast';
// import './salesPerformanceAnalysis.css';

// const SalesPerformanceAnalysis = () => {
//   // State management
//   const [companies, setCompanies] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [selectedCompany, setSelectedCompany] = useState('');
//   const [selectedProject, setSelectedProject] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
  
//   // Analysis data
//   const [priceRangeData, setPriceRangeData] = useState(null);
//   const [unitModelData, setUnitModelData] = useState(null);
//   const [premiumData, setPremiumData] = useState({});
  
//   // Current view states
//   const [currentAnalysisType, setCurrentAnalysisType] = useState('all');
//   const [currentPremiumType, setCurrentPremiumType] = useState('all');
  
//   // Toast notifications
//   const [toasts, setToasts] = useState([]);
  
//   // Total units for percentage calculation
//   const [priceRangeTotalUnits, setPriceRangeTotalUnits] = useState(0);

//   // Load companies on mount
//   useEffect(() => {
//     loadCompanies();
//     // Scroll to top when component mounts
//     window.scrollTo(0, 0);
    
//     // Check for saved dark mode preference
//     const savedDarkMode = localStorage.getItem('spa-dark-mode') === 'true';
//     setDarkMode(savedDarkMode);
//   }, []);

//   // Apply dark mode to document
//   useEffect(() => {
//     if (darkMode) {
//       document.documentElement.setAttribute('data-theme', 'dark');
//     } else {
//       document.documentElement.removeAttribute('data-theme');
//     }
//     localStorage.setItem('spa-dark-mode', darkMode);
//   }, [darkMode]);

//   const toggleDarkMode = () => {
//     setDarkMode(prev => !prev);
//   };

//   // Auto-load data when project changes
//   useEffect(() => {
//     if (selectedProject) {
//       loadAllData();
//     }
//   }, [selectedProject]);

//   const loadCompanies = async () => {
//     try {
//       const response = await salesPerformanceService.getCompanies();
//       if (response.success) {
//         setCompanies(response.data);
//       }
//     } catch (error) {
//       showToast('danger', 'Failed to load companies');
//     }
//   };

//   const handleCompanyChange = async (e) => {
//     const companyId = e.target.value;
//     setSelectedCompany(companyId);
//     setSelectedProject('');
//     setProjects([]);
//     resetAnalysisData();

//     if (companyId) {
//       try {
//         const response = await salesPerformanceService.getCompanyProjects(companyId);
//         if (response.success) {
//           setProjects(response.data);
//         }
//       } catch (error) {
//         showToast('danger', 'Failed to load projects');
//       }
//     }
//   };

//   const handleProjectChange = (e) => {
//     const projectId = e.target.value;
//     setSelectedProject(projectId);
    
//     if (!projectId) {
//       resetAnalysisData();
//     }
//   };

//   const loadAllData = async () => {
//     if (!selectedProject) return;

//     setLoading(true);
    
//     try {
//       // Load all analysis data
//       await Promise.all([
//         loadPriceRangeData(),
//         loadUnitModelData(),
//         loadAllPremiumData()
//       ]);
      
//       showToast('success', 'All data loaded successfully');
//     } catch (error) {
//       showToast('danger', 'Failed to load data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadPriceRangeData = async () => {
//     const response = await salesPerformanceService.getSalesAnalysisData(selectedProject);
//     if (response.success) {
//       setPriceRangeData(response.data);
//       setPriceRangeTotalUnits(response.data.totals?.all || 0);
//     }
//   };

//   const loadUnitModelData = async () => {
//     const response = await salesPerformanceService.getSalesAnalysisByUnitModel(selectedProject);
//     if (response.success) {
//       setUnitModelData(response.data);
//     }
//   };

//   const loadAllPremiumData = async () => {
//     const premiumTypes = ['main_view', 'secondary_view', 'north_breeze', 'corners', 'accessibility'];
//     const premiumResults = {};

//     for (const type of premiumTypes) {
//       const response = await salesPerformanceService.getPremiumAnalysisData(selectedProject, type);
//       if (response.success) {
//         premiumResults[type] = response.data;
//       }
//     }

//     setPremiumData(premiumResults);
//   };

//   const resetAnalysisData = () => {
//     setPriceRangeData(null);
//     setUnitModelData(null);
//     setPremiumData({});
//     setCurrentAnalysisType('all');
//     setCurrentPremiumType('all');
//     setPriceRangeTotalUnits(0);
//   };

//   const handleReset = () => {
//     setSelectedCompany('');
//     setSelectedProject('');
//     setProjects([]);
//     resetAnalysisData();
//   };

//   const handleDownloadAll = async () => {
//     if (!hasData) {
//       showToast('warning', 'No data to download');
//       return;
//     }

//     try {
//       // Dynamically import xlsx library
//       const XLSX = await import('xlsx');
      
//       // Create a new workbook
//       const workbook = XLSX.utils.book_new();
      
//       // Helper function to create worksheet data
//       const createWorksheetData = (headers, rows, totals, type) => {
//         const data = [];
        
//         // Add headers
//         data.push(headers);
        
//         // Add data rows
//         rows.forEach(row => {
//           data.push(row);
//         });
        
//         // Add grand total
//         if (totals) {
//           data.push(totals);
//         }
        
//         return data;
//       };

//       // Export Price Range Analysis
//       if (priceRangeData && priceRangeData.price_ranges) {
//         const { price_ranges, totals } = priceRangeData;
//         const totalBreakdownSum = price_ranges.reduce((sum, range) => sum + (range.breakdown_percent || 0), 0);
        
//         const headers = [
//           'PRICE RANGE',
//           'ALL',
//           'BREAKDOWN',
//           'UNRELEASED',
//           'UNRELEASED %',
//           'RELEASED',
//           'RELEASED %',
//           'AVAILABLE',
//           'SOLD/BOOKED',
//           'SALES % FROM RELEASED',
//           'SALES % FROM TOTAL'
//         ];
        
//         const rows = price_ranges.map(range => {
//           const unreleased = range.all - range.released;
//           const unreleasedPercent = range.all > 0 ? ((unreleased / range.all) * 100).toFixed(1) + '%' : '-';
//           const releasedPercent = range.all > 0 ? ((range.released / range.all) * 100).toFixed(1) + '%' : '-';
//           const salesFromReleasedPercent = range.released > 0 ? ((range.sold_booked / range.released) * 100).toFixed(1) + '%' : '-';
//           const salesFromTotalPercent = range.all > 0 ? ((range.sold_booked / range.all) * 100).toFixed(1) + '%' : '-';
          
//           return [
//             `${formatPriceEGP(range.from)} - ${formatPriceEGP(range.to)}`,
//             range.all || '-',
//             range.breakdown_percent > 0 ? range.breakdown_percent.toFixed(1) + '%' : '-',
//             unreleased || '-',
//             unreleasedPercent,
//             range.released || '-',
//             releasedPercent,
//             range.available || '-',
//             range.sold_booked || '-',
//             salesFromReleasedPercent,
//             salesFromTotalPercent
//           ];
//         });
        
//         const totalUnreleased = (totals.all || 0) - (totals.released || 0);
//         const totalUnreleasedPercent = totals.all > 0 ? ((totalUnreleased / totals.all) * 100).toFixed(1) + '%' : '-';
//         const totalReleasedPercent = totals.all > 0 ? ((totals.released / totals.all) * 100).toFixed(1) + '%' : '-';
//         const totalSalesFromReleasedPercent = totals.released > 0 ? ((totals.sold_booked / totals.released) * 100).toFixed(1) + '%' : '-';
//         const totalSalesFromTotalPercent = totals.all > 0 ? ((totals.sold_booked / totals.all) * 100).toFixed(1) + '%' : '-';
        
//         const grandTotal = [
//           'GRAND TOTAL',
//           totals.all || '-',
//           totalBreakdownSum > 0 ? totalBreakdownSum.toFixed(1) + '%' : '100%',
//           totalUnreleased || '-',
//           totalUnreleasedPercent,
//           totals.released || '-',
//           totalReleasedPercent,
//           totals.available || '-',
//           totals.sold_booked || '-',
//           totalSalesFromReleasedPercent,
//           totalSalesFromTotalPercent
//         ];
        
//         const wsData = createWorksheetData(headers, rows, grandTotal);
//         const ws = XLSX.utils.aoa_to_sheet(wsData);
//         XLSX.utils.book_append_sheet(workbook, ws, 'Price Range Analysis');
//       }

//       // Export Unit Model Analysis
//       if (unitModelData && unitModelData.unit_models) {
//         const { unit_models, totals } = unitModelData;
//         const totalBreakdownSum = unit_models.reduce((sum, model) => sum + (model.breakdown_percent || 0), 0);
        
//         const headers = [
//           'UNIT MODEL',
//           'ALL',
//           'BREAKDOWN',
//           'UNRELEASED',
//           'UNRELEASED %',
//           'RELEASED',
//           'RELEASED %',
//           'AVAILABLE',
//           'SOLD/BOOKED',
//           'SALES % FROM RELEASED',
//           'SALES % FROM TOTAL'
//         ];
        
//         const rows = unit_models.map(model => {
//           const unreleased = model.all - model.released;
//           const unreleasedPercent = model.all > 0 ? ((unreleased / model.all) * 100).toFixed(1) + '%' : '-';
//           const releasedPercent = model.all > 0 ? ((model.released / model.all) * 100).toFixed(1) + '%' : '-';
//           const salesFromReleasedPercent = model.released > 0 ? ((model.sold_booked / model.released) * 100).toFixed(1) + '%' : '-';
//           const salesFromTotalPercent = model.all > 0 ? ((model.sold_booked / model.all) * 100).toFixed(1) + '%' : '-';
          
//           return [
//             model.unit_model || 'N/A',
//             model.all || '-',
//             model.breakdown_percent > 0 ? model.breakdown_percent.toFixed(1) + '%' : '-',
//             unreleased || '-',
//             unreleasedPercent,
//             model.released || '-',
//             releasedPercent,
//             model.available || '-',
//             model.sold_booked || '-',
//             salesFromReleasedPercent,
//             salesFromTotalPercent
//           ];
//         });
        
//         const totalUnreleased = (totals.all || 0) - (totals.released || 0);
//         const totalUnreleasedPercent = totals.all > 0 ? ((totalUnreleased / totals.all) * 100).toFixed(1) + '%' : '-';
//         const totalReleasedPercent = totals.all > 0 ? ((totals.released / totals.all) * 100).toFixed(1) + '%' : '-';
//         const totalSalesFromReleasedPercent = totals.released > 0 ? ((totals.sold_booked / totals.released) * 100).toFixed(1) + '%' : '-';
//         const totalSalesFromTotalPercent = totals.all > 0 ? ((totals.sold_booked / totals.all) * 100).toFixed(1) + '%' : '-';
        
//         const grandTotal = [
//           'GRAND TOTAL',
//           totals.all || '-',
//           totalBreakdownSum > 0 ? totalBreakdownSum.toFixed(1) + '%' : '100%',
//           totalUnreleased || '-',
//           totalUnreleasedPercent,
//           totals.released || '-',
//           totalReleasedPercent,
//           totals.available || '-',
//           totals.sold_booked || '-',
//           totalSalesFromReleasedPercent,
//           totalSalesFromTotalPercent
//         ];
        
//         const wsData = createWorksheetData(headers, rows, grandTotal);
//         const ws = XLSX.utils.aoa_to_sheet(wsData);
//         XLSX.utils.book_append_sheet(workbook, ws, 'Unit Model Analysis');
//       }

//       // Export Premium Analysis
//       Object.keys(premiumData).forEach(premiumType => {
//         const currentData = premiumData[premiumType];
//         if (currentData && currentData.premium_groups) {
//           const { premium_groups, totals } = currentData;
//           const totalBreakdownSum = premium_groups.reduce((sum, group) => {
//             const breakdownPercent = totals.all > 0 ? (group.all / totals.all) * 100 : 0;
//             return sum + breakdownPercent;
//           }, 0);
          
//           const headers = [
//             formatPremiumType(premiumType).toUpperCase(),
//             'ALL',
//             'PREMIUM %',
//             'BREAKDOWN %',
//             'UNRELEASED',
//             'UNRELEASED %',
//             'RELEASED',
//             'RELEASED %',
//             'AVAILABLE',
//             'SOLD/BOOKED',
//             'SALES % FROM RELEASED',
//             'SALES % FROM TOTAL'
//           ];
          
//           const rows = premium_groups.map(group => {
//             const unreleased = group.all - group.released;
//             const unreleasedPercent = group.all > 0 ? ((unreleased / group.all) * 100).toFixed(1) + '%' : '-';
//             const breakdownPercent = totals.all > 0 ? ((group.all / totals.all) * 100).toFixed(1) + '%' : '-';
//             const releasedPercent = group.all > 0 ? ((group.released / group.all) * 100).toFixed(1) + '%' : '-';
//             const salesFromReleasedPercent = group.released > 0 ? ((group.sold_booked / group.released) * 100).toFixed(1) + '%' : '-';
//             const salesFromTotalPercent = group.all > 0 ? ((group.sold_booked / group.all) * 100).toFixed(1) + '%' : '-';
            
//             return [
//               group.premium_value || 'N/A',
//               group.all || '-',
//               group.premium_percent > 0 ? group.premium_percent.toFixed(1) + '%' : '-',
//               breakdownPercent,
//               unreleased || '-',
//               unreleasedPercent,
//               group.released || '-',
//               releasedPercent,
//               group.available || '-',
//               group.sold_booked || '-',
//               salesFromReleasedPercent,
//               salesFromTotalPercent
//             ];
//           });
          
//           const totalUnreleased = (totals.all || 0) - (totals.released || 0);
//           const totalUnreleasedPercent = totals.all > 0 ? ((totalUnreleased / totals.all) * 100).toFixed(1) + '%' : '-';
//           const totalReleasedPercent = totals.all > 0 ? ((totals.released / totals.all) * 100).toFixed(1) + '%' : '-';
//           const totalSalesFromReleasedPercent = totals.released > 0 ? ((totals.sold_booked / totals.released) * 100).toFixed(1) + '%' : '-';
//           const totalSalesFromTotalPercent = totals.all > 0 ? ((totals.sold_booked / totals.all) * 100).toFixed(1) + '%' : '-';
          
//           const grandTotal = [
//             'GRAND TOTAL',
//             totals.all || '-',
//             '-',
//             totalBreakdownSum > 0 ? totalBreakdownSum.toFixed(1) + '%' : '-',
//             totalUnreleased || '-',
//             totalUnreleasedPercent,
//             totals.released || '-',
//             totalReleasedPercent,
//             totals.available || '-',
//             totals.sold_booked || '-',
//             totalSalesFromReleasedPercent,
//             totalSalesFromTotalPercent
//           ];
          
//           const wsData = createWorksheetData(headers, rows, grandTotal);
//           const ws = XLSX.utils.aoa_to_sheet(wsData);
          
//           // Clean sheet name (max 31 chars, no special chars)
//           const sheetName = formatPremiumType(premiumType).substring(0, 31);
//           XLSX.utils.book_append_sheet(workbook, ws, sheetName);
//         }
//       });

//       // Generate filename with timestamp
//       const timestamp = new Date().toISOString().split('T')[0];
//       const projectName = projects.find(p => p.id.toString() === selectedProject)?.name || 'Project';
//       const filename = `Sales_Performance_${projectName}_${timestamp}.xlsx`;

//       // Write and download
//       XLSX.writeFile(workbook, filename);
      
//       showToast('success', 'Excel file downloaded successfully');
//     } catch (error) {
//       console.error('Download error:', error);
//       showToast('danger', 'Failed to download Excel file');
//     }
//   };

//   const handleAnalysisTypeClick = (type) => {
//     setCurrentAnalysisType(type);
//     setTimeout(() => {
//       const element = document.getElementById('spa-analysis-section');
//       if (element) {
//         element.scrollIntoView({ behavior: 'smooth', block: 'start' });
//       }
//     }, 100);
//   };

//   const handlePremiumTypeClick = (type) => {
//     setCurrentPremiumType(type);
//     setTimeout(() => {
//       const element = document.getElementById('spa-premium-section');
//       if (element) {
//         element.scrollIntoView({ behavior: 'smooth', block: 'start' });
//       }
//     }, 100);
//   };

//   const showToast = (type, message) => {
//     const id = Date.now();
//     setToasts(prev => [...prev, { id, type, message }]);
//   };

//   const removeToast = (id) => {
//     setToasts(prev => prev.filter(toast => toast.id !== id));
//   };

//   const formatPriceEGP = (price) => {
//     if (price >= 1000000) {
//       return (price / 1000000).toFixed(2) + 'M';
//     } else if (price >= 1000) {
//       return (price / 1000).toFixed(0) + 'K';
//     } else {
//       return price.toFixed(0);
//     }
//   };

//   const formatPremiumType = (type) => {
//     const mapping = {
//       'main_view': 'Main View',
//       'secondary_view': 'Secondary View',
//       'north_breeze': 'North Breeze',
//       'corners': 'Corners',
//       'accessibility': 'Accessibility'
//     };
//     return mapping[type] || type;
//   };

//   const renderPriceRangeTable = () => {
//     if (!priceRangeData || !priceRangeData.price_ranges) return null;

//     const { price_ranges, totals } = priceRangeData;
    
//     // Calculate sum of breakdown percentages for grand total
//     const totalBreakdownSum = price_ranges.reduce((sum, range) => sum + (range.breakdown_percent || 0), 0);

//     return (
//       <div className="spa-tbl-wrapper">
//         <table className="spa-tbl">
//           <thead>
//             <tr className="spa-tbl-head-main">
//               <th rowSpan="2" className="spa-tbl-sticky-col spa-tbl-highlight-col">PRICE RANGE</th>
//               <th colSpan="2" className="spa-tbl-head-primary">TOTAL UNITS</th>
//               <th colSpan="2" className="spa-tbl-head-normal">UNRELEASED UNITS</th>
//               <th colSpan="2" className="spa-tbl-head-normal">RELEASED UNITS</th>
//               <th colSpan="2" className="spa-tbl-head-normal">CURRENT STATUS</th>
//               <th colSpan="2" className="spa-tbl-head-orange">SALES PERFORMANCE</th>
//             </tr>
//             <tr className="spa-tbl-head-sub">
//               <th className="spa-tbl-highlight-col">ALL</th>
//               <th>BREAKDOWN</th>
//               <th>UNRELEASED</th>
//               <th>UNRELEASED %</th>
//               <th>RELEASED</th>
//               <th>RELEASED %</th>
//               <th>AVAILABLE</th>
//               <th>SOLD/BOOKED</th>
//               <th className="spa-tbl-highlight-gray">SALES % FROM RELEASED</th>
//               <th className="spa-tbl-highlight-orange">SALES % FROM TOTAL</th>
//             </tr>
//           </thead>
//           <tbody>
//             {price_ranges.map((range, index) => {
//               const unreleased = range.all - range.released;
//               const unreleasedPercent = range.all > 0 ? (unreleased / range.all) * 100 : 0;
//               const releasedPercent = range.all > 0 ? (range.released / range.all) * 100 : 0;
//               const salesFromReleasedPercent = range.released > 0 ? (range.sold_booked / range.released) * 100 : 0;
//               const salesFromTotalPercent = range.all > 0 ? (range.sold_booked / range.all) * 100 : 0;

//               return (
//                 <tr key={index}>
//                   <td className="spa-tbl-sticky-col spa-tbl-txt-left spa-tbl-highlight-col">{formatPriceEGP(range.from)} - {formatPriceEGP(range.to)}</td>
//                   <td className="spa-tbl-highlight-col">{range.all || '-'}</td>
//                   <td>{range.breakdown_percent > 0 ? range.breakdown_percent.toFixed(1) + '%' : '-'}</td>
//                   <td>{unreleased || '-'}</td>
//                   <td>{unreleasedPercent > 0 ? unreleasedPercent.toFixed(1) + '%' : '-'}</td>
//                   <td>{range.released || '-'}</td>
//                   <td>{releasedPercent > 0 ? releasedPercent.toFixed(1) + '%' : '-'}</td>
//                   <td>{range.available || '-'}</td>
//                   <td>{range.sold_booked || '-'}</td>
//                   <td className="spa-tbl-progress-cell spa-tbl-highlight-gray">
//                     <div className="spa-tbl-progress-txt">
//                       {salesFromReleasedPercent > 0 ? salesFromReleasedPercent.toFixed(1) + '%' : '-'}
//                     </div>
//                     {salesFromReleasedPercent > 0 && (
//                       <div className="spa-tbl-progress-bar">
//                         <div className="spa-tbl-progress-fill spa-tbl-progress-gray" style={{ width: `${salesFromReleasedPercent}%` }}></div>
//                       </div>
//                     )}
//                   </td>
//                   <td className="spa-tbl-progress-cell spa-tbl-highlight-orange">
//                     <div className="spa-tbl-progress-txt">
//                       {salesFromTotalPercent > 0 ? salesFromTotalPercent.toFixed(1) + '%' : '-'}
//                     </div>
//                     {salesFromTotalPercent > 0 && (
//                       <div className="spa-tbl-progress-bar">
//                         <div className="spa-tbl-progress-fill spa-tbl-progress-orange" style={{ width: `${salesFromTotalPercent}%` }}></div>
//                       </div>
//                     )}
//                   </td>
//                 </tr>
//               );
//             })}
//             {renderGrandTotalRow(totals, 'price', totalBreakdownSum)}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   const renderUnitModelTable = () => {
//     if (!unitModelData || !unitModelData.unit_models) return null;

//     const { unit_models, totals } = unitModelData;
    
//     // Calculate sum of breakdown percentages for grand total
//     const totalBreakdownSum = unit_models.reduce((sum, model) => sum + (model.breakdown_percent || 0), 0);

//     return (
//       <div className="spa-tbl-wrapper">
//         <table className="spa-tbl">
//           <thead>
//             <tr className="spa-tbl-head-main">
//               <th rowSpan="2" className="spa-tbl-sticky-col spa-tbl-highlight-col">UNIT MODEL</th>
//               <th colSpan="2" className="spa-tbl-head-primary">TOTAL UNITS</th>
//               <th colSpan="2" className="spa-tbl-head-normal">UNRELEASED UNITS</th>
//               <th colSpan="2" className="spa-tbl-head-normal">RELEASED UNITS</th>
//               <th colSpan="2" className="spa-tbl-head-normal">CURRENT STATUS</th>
//               <th colSpan="2" className="spa-tbl-head-orange">SALES PERFORMANCE</th>
//             </tr>
//             <tr className="spa-tbl-head-sub">
//               <th className="spa-tbl-highlight-col">ALL</th>
//               <th>BREAKDOWN</th>
//               <th>UNRELEASED</th>
//               <th>UNRELEASED %</th>
//               <th>RELEASED</th>
//               <th>RELEASED %</th>
//               <th>AVAILABLE</th>
//               <th>SOLD/BOOKED</th>
//               <th className="spa-tbl-highlight-gray">SALES % FROM RELEASED</th>
//               <th className="spa-tbl-highlight-orange">SALES % FROM TOTAL</th>
//             </tr>
//           </thead>
//           <tbody>
//             {unit_models.map((model, index) => {
//               const unreleased = model.all - model.released;
//               const unreleasedPercent = model.all > 0 ? (unreleased / model.all) * 100 : 0;
//               const releasedPercent = model.all > 0 ? (model.released / model.all) * 100 : 0;
//               const salesFromReleasedPercent = model.released > 0 ? (model.sold_booked / model.released) * 100 : 0;
//               const salesFromTotalPercent = model.all > 0 ? (model.sold_booked / model.all) * 100 : 0;

//               return (
//                 <tr key={index}>
//                   <td className="spa-tbl-sticky-col spa-tbl-txt-left spa-tbl-highlight-col">{model.unit_model || 'N/A'}</td>
//                   <td className="spa-tbl-highlight-col">{model.all || '-'}</td>
//                   <td>{model.breakdown_percent > 0 ? model.breakdown_percent.toFixed(1) + '%' : '-'}</td>
//                   <td>{unreleased || '-'}</td>
//                   <td>{unreleasedPercent > 0 ? unreleasedPercent.toFixed(1) + '%' : '-'}</td>
//                   <td>{model.released || '-'}</td>
//                   <td>{releasedPercent > 0 ? releasedPercent.toFixed(1) + '%' : '-'}</td>
//                   <td>{model.available || '-'}</td>
//                   <td>{model.sold_booked || '-'}</td>
//                   <td className="spa-tbl-progress-cell spa-tbl-highlight-gray">
//                     <div className="spa-tbl-progress-txt">
//                       {salesFromReleasedPercent > 0 ? salesFromReleasedPercent.toFixed(1) + '%' : '-'}
//                     </div>
//                     {salesFromReleasedPercent > 0 && (
//                       <div className="spa-tbl-progress-bar">
//                         <div className="spa-tbl-progress-fill spa-tbl-progress-gray" style={{ width: `${salesFromReleasedPercent}%` }}></div>
//                       </div>
//                     )}
//                   </td>
//                   <td className="spa-tbl-progress-cell spa-tbl-highlight-orange">
//                     <div className="spa-tbl-progress-txt">
//                       {salesFromTotalPercent > 0 ? salesFromTotalPercent.toFixed(1) + '%' : '-'}
//                     </div>
//                     {salesFromTotalPercent > 0 && (
//                       <div className="spa-tbl-progress-bar">
//                         <div className="spa-tbl-progress-fill spa-tbl-progress-orange" style={{ width: `${salesFromTotalPercent}%` }}></div>
//                       </div>
//                     )}
//                   </td>
//                 </tr>
//               );
//             })}
//             {renderGrandTotalRow(totals, 'model', totalBreakdownSum)}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   const renderPremiumTable = (premiumType) => {
//     const currentData = premiumData[premiumType];
//     if (!currentData || !currentData.premium_groups) return null;

//     const { premium_groups, totals } = currentData;
    
//     // Calculate sum of breakdown percentages for grand total
//     const totalBreakdownSum = premium_groups.reduce((sum, group) => {
//       const breakdownPercent = totals.all > 0 ? (group.all / totals.all) * 100 : 0;
//       return sum + breakdownPercent;
//     }, 0);

//     return (
//       <div className="spa-premium-tbl-container" key={premiumType}>
//         <h4 className="spa-premium-tbl-title">
//           <svg className="spa-premium-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
//             <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
//           </svg>
//           {formatPremiumType(premiumType)}
//         </h4>
//         <div className="spa-tbl-wrapper">
//           <table className="spa-tbl">
//             <thead>
//               <tr className="spa-tbl-head-main">
//                 <th rowSpan="2" className="spa-tbl-sticky-col spa-tbl-highlight-col">{formatPremiumType(premiumType).toUpperCase()}</th>
//                 <th colSpan="3" className="spa-tbl-head-primary">TOTAL UNITS</th>
//                 <th colSpan="2" className="spa-tbl-head-normal">UNRELEASED UNITS</th>
//                 <th colSpan="2" className="spa-tbl-head-normal">RELEASED UNITS</th>
//                 <th colSpan="2" className="spa-tbl-head-normal">CURRENT STATUS</th>
//                 <th colSpan="2" className="spa-tbl-head-orange">SALES PERFORMANCE</th>
//               </tr>
//               <tr className="spa-tbl-head-sub">
//                 <th className="spa-tbl-highlight-col">ALL</th>
//                 <th>PREMIUM %</th>
//                 <th>BREAKDOWN %</th>
//                 <th>UNRELEASED</th>
//                 <th>UNRELEASED %</th>
//                 <th>RELEASED</th>
//                 <th>RELEASED %</th>
//                 <th>AVAILABLE</th>
//                 <th>SOLD/BOOKED</th>
//                 <th className="spa-tbl-highlight-gray">SALES % FROM RELEASED</th>
//                 <th className="spa-tbl-highlight-orange">SALES % FROM TOTAL</th>
//               </tr>
//             </thead>
//             <tbody>
//               {premium_groups.map((group, index) => {
//                 const unreleased = group.all - group.released;
//                 const unreleasedPercent = group.all > 0 ? (unreleased / group.all) * 100 : 0;
//                 const breakdownPercent = totals.all > 0 ? (group.all / totals.all) * 100 : 0;
//                 const releasedPercent = group.all > 0 ? (group.released / group.all) * 100 : 0;
//                 const salesFromReleasedPercent = group.released > 0 ? (group.sold_booked / group.released) * 100 : 0;
//                 const salesFromTotalPercent = group.all > 0 ? (group.sold_booked / group.all) * 100 : 0;

//                 return (
//                   <tr key={index}>
//                     <td className="spa-tbl-sticky-col spa-tbl-txt-left spa-tbl-highlight-col">{group.premium_value || 'N/A'}</td>
//                     <td className="spa-tbl-highlight-col">{group.all || '-'}</td>
//                     <td>{group.premium_percent > 0 ? group.premium_percent.toFixed(1) + '%' : '-'}</td>
//                     <td>{breakdownPercent > 0 ? breakdownPercent.toFixed(1) + '%' : '-'}</td>
//                     <td>{unreleased || '-'}</td>
//                     <td>{unreleasedPercent > 0 ? unreleasedPercent.toFixed(1) + '%' : '-'}</td>
//                     <td>{group.released || '-'}</td>
//                     <td>{releasedPercent > 0 ? releasedPercent.toFixed(1) + '%' : '-'}</td>
//                     <td>{group.available || '-'}</td>
//                     <td>{group.sold_booked || '-'}</td>
//                     <td className="spa-tbl-progress-cell spa-tbl-highlight-gray">
//                       <div className="spa-tbl-progress-txt">
//                         {salesFromReleasedPercent > 0 ? salesFromReleasedPercent.toFixed(1) + '%' : '-'}
//                       </div>
//                       {salesFromReleasedPercent > 0 && (
//                         <div className="spa-tbl-progress-bar">
//                           <div className="spa-tbl-progress-fill spa-tbl-progress-gray" style={{ width: `${salesFromReleasedPercent}%` }}></div>
//                         </div>
//                       )}
//                     </td>
//                     <td className="spa-tbl-progress-cell spa-tbl-highlight-orange">
//                       <div className="spa-tbl-progress-txt">
//                         {salesFromTotalPercent > 0 ? salesFromTotalPercent.toFixed(1) + '%' : '-'}
//                       </div>
//                       {salesFromTotalPercent > 0 && (
//                         <div className="spa-tbl-progress-bar">
//                           <div className="spa-tbl-progress-fill spa-tbl-progress-orange" style={{ width: `${salesFromTotalPercent}%` }}></div>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 );
//               })}
//               {renderGrandTotalRow(totals, 'premium', totalBreakdownSum)}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     );
//   };

//   const renderGrandTotalRow = (totals, type, breakdownSum = 0) => {
//     const totalUnreleased = (totals.all || 0) - (totals.released || 0);
//     const totalUnreleasedPercent = totals.all > 0 ? (totalUnreleased / totals.all) * 100 : 0;
//     const totalReleasedPercent = totals.all > 0 ? (totals.released / totals.all) * 100 : 0;
//     const totalSalesFromReleasedPercent = totals.released > 0 ? (totals.sold_booked / totals.released) * 100 : 0;
//     const totalSalesFromTotalPercent = totals.all > 0 ? (totals.sold_booked / totals.all) * 100 : 0;

//     if (type === 'price') {
//       return (
//         <tr className="spa-tbl-grand-total">
//           <td className="spa-tbl-sticky-col spa-tbl-highlight-col">GRAND TOTAL</td>
//           <td className="spa-tbl-highlight-col">{totals.all || '-'}</td>
//           <td>{breakdownSum > 0 ? breakdownSum.toFixed(1) + '%' : '100%'}</td>
//           <td>{totalUnreleased || '-'}</td>
//           <td>{totalUnreleasedPercent > 0 ? totalUnreleasedPercent.toFixed(1) + '%' : '-'}</td>
//           <td>{totals.released || '-'}</td>
//           <td>{totalReleasedPercent > 0 ? totalReleasedPercent.toFixed(1) + '%' : '-'}</td>
//           <td>{totals.available || '-'}</td>
//           <td>{totals.sold_booked || '-'}</td>
//           <td className="spa-tbl-progress-cell spa-tbl-highlight-gray">
//             <div className="spa-tbl-progress-txt">
//               {totalSalesFromReleasedPercent > 0 ? totalSalesFromReleasedPercent.toFixed(1) + '%' : '-'}
//             </div>
//             {totalSalesFromReleasedPercent > 0 && (
//               <div className="spa-tbl-progress-bar">
//                 <div className="spa-tbl-progress-fill spa-tbl-progress-gray" style={{ width: `${totalSalesFromReleasedPercent}%` }}></div>
//               </div>
//             )}
//           </td>
//           <td className="spa-tbl-progress-cell spa-tbl-highlight-orange">
//             <div className="spa-tbl-progress-txt">
//               {totalSalesFromTotalPercent > 0 ? totalSalesFromTotalPercent.toFixed(1) + '%' : '-'}
//             </div>
//             {totalSalesFromTotalPercent > 0 && (
//               <div className="spa-tbl-progress-bar">
//                 <div className="spa-tbl-progress-fill spa-tbl-progress-orange" style={{ width: `${totalSalesFromTotalPercent}%` }}></div>
//               </div>
//             )}
//           </td>
//         </tr>
//       );
//     } else if (type === 'model') {
//       return (
//         <tr className="spa-tbl-grand-total">
//           <td className="spa-tbl-sticky-col spa-tbl-highlight-col">GRAND TOTAL</td>
//           <td className="spa-tbl-highlight-col">{totals.all || '-'}</td>
//           <td>{breakdownSum > 0 ? breakdownSum.toFixed(1) + '%' : '100%'}</td>
//           <td>{totalUnreleased || '-'}</td>
//           <td>{totalUnreleasedPercent > 0 ? totalUnreleasedPercent.toFixed(1) + '%' : '-'}</td>
//           <td>{totals.released || '-'}</td>
//           <td>{totalReleasedPercent > 0 ? totalReleasedPercent.toFixed(1) + '%' : '-'}</td>
//           <td>{totals.available || '-'}</td>
//           <td>{totals.sold_booked || '-'}</td>
//           <td className="spa-tbl-progress-cell spa-tbl-highlight-gray">
//             <div className="spa-tbl-progress-txt">
//               {totalSalesFromReleasedPercent > 0 ? totalSalesFromReleasedPercent.toFixed(1) + '%' : '-'}
//             </div>
//             {totalSalesFromReleasedPercent > 0 && (
//               <div className="spa-tbl-progress-bar">
//                 <div className="spa-tbl-progress-fill spa-tbl-progress-gray" style={{ width: `${totalSalesFromReleasedPercent}%` }}></div>
//               </div>
//             )}
//           </td>
//           <td className="spa-tbl-progress-cell spa-tbl-highlight-orange">
//             <div className="spa-tbl-progress-txt">
//               {totalSalesFromTotalPercent > 0 ? totalSalesFromTotalPercent.toFixed(1) + '%' : '-'}
//             </div>
//             {totalSalesFromTotalPercent > 0 && (
//               <div className="spa-tbl-progress-bar">
//                 <div className="spa-tbl-progress-fill spa-tbl-progress-orange" style={{ width: `${totalSalesFromTotalPercent}%` }}></div>
//               </div>
//             )}
//           </td>
//         </tr>
//       );
//     } else {
//       return (
//         <tr className="spa-tbl-grand-total">
//           <td className="spa-tbl-sticky-col spa-tbl-highlight-col">GRAND TOTAL</td>
//           <td className="spa-tbl-highlight-col">{totals.all || '-'}</td>
//           <td>-</td>
//           <td>{breakdownSum > 0 ? breakdownSum.toFixed(1) + '%' : '-'}</td>
//           <td>{totalUnreleased || '-'}</td>
//           <td>{totalUnreleasedPercent > 0 ? totalUnreleasedPercent.toFixed(1) + '%' : '-'}</td>
//           <td>{totals.released || '-'}</td>
//           <td>{totalReleasedPercent > 0 ? totalReleasedPercent.toFixed(1) + '%' : '-'}</td>
//           <td>{totals.available || '-'}</td>
//           <td>{totals.sold_booked || '-'}</td>
//           <td className="spa-tbl-progress-cell spa-tbl-highlight-gray">
//             <div className="spa-tbl-progress-txt">
//               {totalSalesFromReleasedPercent > 0 ? totalSalesFromReleasedPercent.toFixed(1) + '%' : '-'}
//             </div>
//             {totalSalesFromReleasedPercent > 0 && (
//               <div className="spa-tbl-progress-bar">
//                 <div className="spa-tbl-progress-fill spa-tbl-progress-gray" style={{ width: `${totalSalesFromReleasedPercent}%` }}></div>
//               </div>
//             )}
//           </td>
//           <td className="spa-tbl-progress-cell spa-tbl-highlight-orange">
//             <div className="spa-tbl-progress-txt">
//               {totalSalesFromTotalPercent > 0 ? totalSalesFromTotalPercent.toFixed(1) + '%' : '-'}
//             </div>
//             {totalSalesFromTotalPercent > 0 && (
//               <div className="spa-tbl-progress-bar">
//                 <div className="spa-tbl-progress-fill spa-tbl-progress-orange" style={{ width: `${totalSalesFromTotalPercent}%` }}></div>
//               </div>
//             )}
//           </td>
//         </tr>
//       );
//     }
//   };

//   const hasData = priceRangeData || unitModelData || Object.keys(premiumData).length > 0;

//   return (
//     <div className="spa-main-container">
//       {/* Toast Container */}
//       <div className="spa-toast-wrapper">
//         {toasts.map(toast => (
//           <Toast 
//             key={toast.id}
//             type={toast.type}
//             message={toast.message}
//             onClose={() => removeToast(toast.id)}
//           />
//         ))}
//       </div>

//       <div className="spa-content-wrapper">
//         {/* Dashboard-style Header */}
//         <div className="spa-dashboard-header">
//           <h1 className="spa-header-title">
//             <span style={{fontSize: '1.8rem', filter: 'none', WebkitTextFillColor: 'initial' }}>📊</span>
//             <span className='h1-color' >Sales Performance Analysis</span>
//           </h1>

//           <div className="spa-header-center">
//             <select
//               className="spa-header-select"
//               value={selectedCompany}
//               onChange={handleCompanyChange}
//             >
//               <option value="">Select Company</option>
//               {companies.map(company => (
//                 <option key={company.id} value={company.id}>{company.name}</option>
//               ))}
//             </select>

//             {selectedCompany && (
//               <select
//                 className="spa-header-select"
//                 value={selectedProject}
//                 onChange={handleProjectChange}
//               >
//                 <option value="">Select Project</option>
//                 {projects.map(project => (
//                   <option key={project.id} value={project.id}>{project.name}</option>
//                 ))}
//               </select>
//             )}
//           </div>

//           <div className="spa-header-right">
//             <button className="spa-header-btn spa-btn-secondary" onClick={handleReset}>
//               <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
//                 <path d="M14 8A6 6 0 1 1 8 2v4l3-3-3-3v4a6 6 0 0 0 0 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
//               </svg>
//               Reset
//             </button>
//             <button 
//               className="spa-header-btn spa-btn-primary" 
//               onClick={handleDownloadAll}
//               disabled={!hasData}
//             >
//               <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
//                 <path d="M8 2v8m0 0l3-3m-3 3L5 7m9 7H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
//               </svg>
//               Download All
//             </button>
//             <button 
//               className="spa-header-btn spa-btn-icon" 
//               onClick={toggleDarkMode}
//               title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
//               aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
//             >
//               <div className="spa-theme-toggle-icon">
//                 {darkMode ? '☀️' : '🌙'}
//               </div>
//             </button>
//           </div>
//         </div>

//         {/* Loading Spinner */}
//         {loading && (
//           <div className="spa-loading">
//             <div className="spa-loading-spinner"></div>
//             <p className="spa-loading-text">Loading data...</p>
//           </div>
//         )}

//         {/* Analysis Section */}
//         {hasData && !loading && (
//           <>
//             <div id="spa-analysis-section" className="spa-section">
//               <div className="spa-section-header">
//                 <h2 className="spa-section-title">
//                   <svg className="spa-section-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
//                     <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
//                     <rect x="7" y="11" width="3" height="8" fill="currentColor"/>
//                     <rect x="10.5" y="7" width="3" height="12" fill="currentColor"/>
//                     <rect x="14" y="13" width="3" height="6" fill="currentColor"/>
//                   </svg>
//                   Sales Analysis
//                 </h2>
//                 <div className="spa-tab-buttons">
//                   <button
//                     className={`spa-tab-btn ${currentAnalysisType === 'all' ? 'spa-tab-btn-active' : ''}`}
//                     onClick={() => handleAnalysisTypeClick('all')}
//                   >
//                     All
//                   </button>
//                   <button
//                     className={`spa-tab-btn ${currentAnalysisType === 'priceRange' ? 'spa-tab-btn-active' : ''}`}
//                     onClick={() => handleAnalysisTypeClick('priceRange')}
//                   >
//                     Price Range
//                   </button>
//                   <button
//                     className={`spa-tab-btn ${currentAnalysisType === 'unitModel' ? 'spa-tab-btn-active' : ''}`}
//                     onClick={() => handleAnalysisTypeClick('unitModel')}
//                   >
//                     Unit Model
//                   </button>
//                 </div>
//               </div>

//               {(currentAnalysisType === 'all' || currentAnalysisType === 'priceRange') && priceRangeData && (
//                 <div className="spa-table-section">
//                   <h3 className="spa-table-title">Price Range</h3>
//                   {renderPriceRangeTable()}
//                 </div>
//               )}

//               {(currentAnalysisType === 'all' || currentAnalysisType === 'unitModel') && unitModelData && (
//                 <div className="spa-table-section">
//                   <h3 className="spa-table-title">Unit Model</h3>
//                   {renderUnitModelTable()}
//                 </div>
//               )}
//             </div>

//             {/* Premium Analysis Section */}
//             <div id="spa-premium-section" className="spa-section">
//               <div className="spa-section-header">
//                 <h2 className="spa-section-title">
//                   <svg className="spa-section-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
//                     <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
//                   </svg>
//                   Premium Analysis
//                 </h2>
//                 <div className="spa-tab-buttons">
//                   <button
//                     className={`spa-tab-btn ${currentPremiumType === 'all' ? 'spa-tab-btn-active' : ''}`}
//                     onClick={() => handlePremiumTypeClick('all')}
//                   >
//                     All
//                   </button>
//                   <button
//                     className={`spa-tab-btn ${currentPremiumType === 'main_view' ? 'spa-tab-btn-active' : ''}`}
//                     onClick={() => handlePremiumTypeClick('main_view')}
//                   >
//                     Main View
//                   </button>
//                   <button
//                     className={`spa-tab-btn ${currentPremiumType === 'secondary_view' ? 'spa-tab-btn-active' : ''}`}
//                     onClick={() => handlePremiumTypeClick('secondary_view')}
//                   >
//                     Secondary View
//                   </button>
//                   <button
//                     className={`spa-tab-btn ${currentPremiumType === 'north_breeze' ? 'spa-tab-btn-active' : ''}`}
//                     onClick={() => handlePremiumTypeClick('north_breeze')}
//                   >
//                     North Breeze
//                   </button>
//                   <button
//                     className={`spa-tab-btn ${currentPremiumType === 'corners' ? 'spa-tab-btn-active' : ''}`}
//                     onClick={() => handlePremiumTypeClick('corners')}
//                   >
//                     Corners
//                   </button>
//                   <button
//                     className={`spa-tab-btn ${currentPremiumType === 'accessibility' ? 'spa-tab-btn-active' : ''}`}
//                     onClick={() => handlePremiumTypeClick('accessibility')}
//                   >
//                     Accessibility
//                   </button>
//                 </div>
//               </div>

//               <div className="spa-premium-tables">
//                 {currentPremiumType === 'all' ? (
//                   Object.keys(premiumData).map(type => renderPremiumTable(type))
//                 ) : (
//                   renderPremiumTable(currentPremiumType)
//                 )}
//               </div>
//             </div>
//           </>
//         )}

//         {!hasData && !loading && selectedProject && (
//           <div className="spa-no-data">
//             <p>No data available for this project</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SalesPerformanceAnalysis;


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
  const [darkMode, setDarkMode] = useState(false);
  
  // Analysis data
  const [priceRangeData, setPriceRangeData] = useState(null);
  const [unitModelData, setUnitModelData] = useState(null);
  const [premiumData, setPremiumData] = useState({});
  
  // Current view states
  const [currentAnalysisType, setCurrentAnalysisType] = useState('all');
  const [currentPremiumType, setCurrentPremiumType] = useState('all');
  
  // Toast notifications
  const [toasts, setToasts] = useState([]);
  
  // Total units for percentage calculation
  const [, setPriceRangeTotalUnits] = useState(0);

  // Load companies on mount
  useEffect(() => {
    loadCompanies();
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('spa-dark-mode') === 'true';
    setDarkMode(savedDarkMode);
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('spa-dark-mode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // Auto-load data when project changes
  useEffect(() => {
    if (selectedProject) {
      loadAllData();
    }
  }, [selectedProject]);

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
    resetAnalysisData();

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
    const projectId = e.target.value;
    setSelectedProject(projectId);
    
    if (!projectId) {
      resetAnalysisData();
    }
  };

  const loadAllData = async () => {
    if (!selectedProject) return;

    setLoading(true);
    
    try {
      // Load all analysis data
      await Promise.all([
        loadPriceRangeData(),
        loadUnitModelData(),
        loadAllPremiumData()
      ]);
      
      showToast('success', 'All data loaded successfully');
    } catch (error) {
      showToast('danger', 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const loadPriceRangeData = async () => {
    const response = await salesPerformanceService.getSalesAnalysisData(selectedProject);
    if (response.success) {
      setPriceRangeData(response.data);
      setPriceRangeTotalUnits(response.data.totals?.all || 0);
    }
  };

  const loadUnitModelData = async () => {
    const response = await salesPerformanceService.getSalesAnalysisByUnitModel(selectedProject);
    if (response.success) {
      setUnitModelData(response.data);
    }
  };

  const loadAllPremiumData = async () => {
    const premiumTypes = ['main_view', 'secondary_view', 'north_breeze', 'corners', 'accessibility'];
    const premiumResults = {};

    for (const type of premiumTypes) {
      const response = await salesPerformanceService.getPremiumAnalysisData(selectedProject, type);
      if (response.success) {
        premiumResults[type] = response.data;
      }
    }

    setPremiumData(premiumResults);
  };

  const resetAnalysisData = () => {
    setPriceRangeData(null);
    setUnitModelData(null);
    setPremiumData({});
    setCurrentAnalysisType('all');
    setCurrentPremiumType('all');
    setPriceRangeTotalUnits(0);
  };

  const handleReset = () => {
    setSelectedCompany('');
    setSelectedProject('');
    setProjects([]);
    resetAnalysisData();
  };

  const handleDownloadAll = async () => {
    if (!hasData) {
      showToast('warning', 'No data to download');
      return;
    }

    try {
      // Dynamically import xlsx library
      const XLSX = await import('xlsx');
      
      // Create a new workbook
      const workbook = XLSX.utils.book_new();
      
      // Helper function to create worksheet data
      const createWorksheetData = (headers, rows, totals, type) => {
        const data = [];
        
        // Add headers
        data.push(headers);
        
        // Add data rows
        rows.forEach(row => {
          data.push(row);
        });
        
        // Add grand total
        if (totals) {
          data.push(totals);
        }
        
        return data;
      };

      // Export Price Range Analysis
      if (priceRangeData && priceRangeData.price_ranges) {
        const { price_ranges, totals } = priceRangeData;
        const totalBreakdownSum = price_ranges.reduce((sum, range) => sum + (range.breakdown_percent || 0), 0);
        
        const headers = [
          'PRICE RANGE',
          'ALL',
          'BREAKDOWN',
          'UNRELEASED',
          'UNRELEASED %',
          'RELEASED',
          'RELEASED %',
          'AVAILABLE',
          'SOLD/BOOKED',
          'SALES % FROM RELEASED',
          'SALES % FROM TOTAL'
        ];
        
        const rows = price_ranges.map(range => {
          const unreleased = range.all - range.released;
          const unreleasedPercent = range.all > 0 ? ((unreleased / range.all) * 100).toFixed(1) + '%' : '-';
          const releasedPercent = range.all > 0 ? ((range.released / range.all) * 100).toFixed(1) + '%' : '-';
          const salesFromReleasedPercent = range.released > 0 ? ((range.sold_booked / range.released) * 100).toFixed(1) + '%' : '-';
          const salesFromTotalPercent = range.all > 0 ? ((range.sold_booked / range.all) * 100).toFixed(1) + '%' : '-';
          
          return [
            `${formatPriceEGP(range.from)} - ${formatPriceEGP(range.to)}`,
            range.all || '-',
            range.breakdown_percent > 0 ? range.breakdown_percent.toFixed(1) + '%' : '-',
            unreleased || '-',
            unreleasedPercent,
            range.released || '-',
            releasedPercent,
            range.available || '-',
            range.sold_booked || '-',
            salesFromReleasedPercent,
            salesFromTotalPercent
          ];
        });
        
        const totalUnreleased = (totals.all || 0) - (totals.released || 0);
        const totalUnreleasedPercent = totals.all > 0 ? ((totalUnreleased / totals.all) * 100).toFixed(1) + '%' : '-';
        const totalReleasedPercent = totals.all > 0 ? ((totals.released / totals.all) * 100).toFixed(1) + '%' : '-';
        const totalSalesFromReleasedPercent = totals.released > 0 ? ((totals.sold_booked / totals.released) * 100).toFixed(1) + '%' : '-';
        const totalSalesFromTotalPercent = totals.all > 0 ? ((totals.sold_booked / totals.all) * 100).toFixed(1) + '%' : '-';
        
        const grandTotal = [
          'GRAND TOTAL',
          totals.all || '-',
          totalBreakdownSum > 0 ? totalBreakdownSum.toFixed(1) + '%' : '100%',
          totalUnreleased || '-',
          totalUnreleasedPercent,
          totals.released || '-',
          totalReleasedPercent,
          totals.available || '-',
          totals.sold_booked || '-',
          totalSalesFromReleasedPercent,
          totalSalesFromTotalPercent
        ];
        
        const wsData = createWorksheetData(headers, rows, grandTotal);
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(workbook, ws, 'Price Range Analysis');
      }

      // Export Unit Model Analysis
      if (unitModelData && unitModelData.unit_models) {
        const { unit_models, totals } = unitModelData;
        const totalBreakdownSum = unit_models.reduce((sum, model) => sum + (model.breakdown_percent || 0), 0);
        
        const headers = [
          'UNIT MODEL',
          'ALL',
          'BREAKDOWN',
          'UNRELEASED',
          'UNRELEASED %',
          'RELEASED',
          'RELEASED %',
          'AVAILABLE',
          'SOLD/BOOKED',
          'SALES % FROM RELEASED',
          'SALES % FROM TOTAL'
        ];
        
        const rows = unit_models.map(model => {
          const unreleased = model.all - model.released;
          const unreleasedPercent = model.all > 0 ? ((unreleased / model.all) * 100).toFixed(1) + '%' : '-';
          const releasedPercent = model.all > 0 ? ((model.released / model.all) * 100).toFixed(1) + '%' : '-';
          const salesFromReleasedPercent = model.released > 0 ? ((model.sold_booked / model.released) * 100).toFixed(1) + '%' : '-';
          const salesFromTotalPercent = model.all > 0 ? ((model.sold_booked / model.all) * 100).toFixed(1) + '%' : '-';
          
          return [
            model.unit_model || 'N/A',
            model.all || '-',
            model.breakdown_percent > 0 ? model.breakdown_percent.toFixed(1) + '%' : '-',
            unreleased || '-',
            unreleasedPercent,
            model.released || '-',
            releasedPercent,
            model.available || '-',
            model.sold_booked || '-',
            salesFromReleasedPercent,
            salesFromTotalPercent
          ];
        });
        
        const totalUnreleased = (totals.all || 0) - (totals.released || 0);
        const totalUnreleasedPercent = totals.all > 0 ? ((totalUnreleased / totals.all) * 100).toFixed(1) + '%' : '-';
        const totalReleasedPercent = totals.all > 0 ? ((totals.released / totals.all) * 100).toFixed(1) + '%' : '-';
        const totalSalesFromReleasedPercent = totals.released > 0 ? ((totals.sold_booked / totals.released) * 100).toFixed(1) + '%' : '-';
        const totalSalesFromTotalPercent = totals.all > 0 ? ((totals.sold_booked / totals.all) * 100).toFixed(1) + '%' : '-';
        
        const grandTotal = [
          'GRAND TOTAL',
          totals.all || '-',
          totalBreakdownSum > 0 ? totalBreakdownSum.toFixed(1) + '%' : '100%',
          totalUnreleased || '-',
          totalUnreleasedPercent,
          totals.released || '-',
          totalReleasedPercent,
          totals.available || '-',
          totals.sold_booked || '-',
          totalSalesFromReleasedPercent,
          totalSalesFromTotalPercent
        ];
        
        const wsData = createWorksheetData(headers, rows, grandTotal);
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(workbook, ws, 'Unit Model Analysis');
      }

      // Export Premium Analysis
      Object.keys(premiumData).forEach(premiumType => {
        const currentData = premiumData[premiumType];
        if (currentData && currentData.premium_groups) {
          const { premium_groups, totals } = currentData;
          const totalBreakdownSum = premium_groups.reduce((sum, group) => {
            const breakdownPercent = totals.all > 0 ? (group.all / totals.all) * 100 : 0;
            return sum + breakdownPercent;
          }, 0);
          
          const headers = [
            formatPremiumType(premiumType).toUpperCase(),
            'ALL',
            'PREMIUM %',
            'BREAKDOWN %',
            'UNRELEASED',
            'UNRELEASED %',
            'RELEASED',
            'RELEASED %',
            'AVAILABLE',
            'SOLD/BOOKED',
            'SALES % FROM RELEASED',
            'SALES % FROM TOTAL'
          ];
          
          const rows = premium_groups.map(group => {
            const unreleased = group.all - group.released;
            const unreleasedPercent = group.all > 0 ? ((unreleased / group.all) * 100).toFixed(1) + '%' : '-';
            const breakdownPercent = totals.all > 0 ? ((group.all / totals.all) * 100).toFixed(1) + '%' : '-';
            const releasedPercent = group.all > 0 ? ((group.released / group.all) * 100).toFixed(1) + '%' : '-';
            const salesFromReleasedPercent = group.released > 0 ? ((group.sold_booked / group.released) * 100).toFixed(1) + '%' : '-';
            const salesFromTotalPercent = group.all > 0 ? ((group.sold_booked / group.all) * 100).toFixed(1) + '%' : '-';
            
            return [
              group.premium_value || 'N/A',
              group.all || '-',
              group.premium_percent > 0 ? group.premium_percent.toFixed(1) + '%' : '-',
              breakdownPercent,
              unreleased || '-',
              unreleasedPercent,
              group.released || '-',
              releasedPercent,
              group.available || '-',
              group.sold_booked || '-',
              salesFromReleasedPercent,
              salesFromTotalPercent
            ];
          });
          
          const totalUnreleased = (totals.all || 0) - (totals.released || 0);
          const totalUnreleasedPercent = totals.all > 0 ? ((totalUnreleased / totals.all) * 100).toFixed(1) + '%' : '-';
          const totalReleasedPercent = totals.all > 0 ? ((totals.released / totals.all) * 100).toFixed(1) + '%' : '-';
          const totalSalesFromReleasedPercent = totals.released > 0 ? ((totals.sold_booked / totals.released) * 100).toFixed(1) + '%' : '-';
          const totalSalesFromTotalPercent = totals.all > 0 ? ((totals.sold_booked / totals.all) * 100).toFixed(1) + '%' : '-';
          
          const grandTotal = [
            'GRAND TOTAL',
            totals.all || '-',
            '-',
            totalBreakdownSum > 0 ? totalBreakdownSum.toFixed(1) + '%' : '-',
            totalUnreleased || '-',
            totalUnreleasedPercent,
            totals.released || '-',
            totalReleasedPercent,
            totals.available || '-',
            totals.sold_booked || '-',
            totalSalesFromReleasedPercent,
            totalSalesFromTotalPercent
          ];
          
          const wsData = createWorksheetData(headers, rows, grandTotal);
          const ws = XLSX.utils.aoa_to_sheet(wsData);
          
          // Clean sheet name (max 31 chars, no special chars)
          const sheetName = formatPremiumType(premiumType).substring(0, 31);
          XLSX.utils.book_append_sheet(workbook, ws, sheetName);
        }
      });

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const projectName = projects.find(p => p.id.toString() === selectedProject)?.name || 'Project';
      const filename = `Sales_Performance_${projectName}_${timestamp}.xlsx`;

      // Write and download
      XLSX.writeFile(workbook, filename);
      
      showToast('success', 'Excel file downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      showToast('danger', 'Failed to download Excel file');
    }
  };

  const handleAnalysisTypeClick = (type) => {
    setCurrentAnalysisType(type);
    setTimeout(() => {
      const element = document.getElementById('spa-analysis-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handlePremiumTypeClick = (type) => {
    setCurrentPremiumType(type);
    setTimeout(() => {
      const element = document.getElementById('spa-premium-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
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
      return (price / 1000000).toFixed(2) + 'M';
    } else if (price >= 1000) {
      return (price / 1000).toFixed(0) + 'K';
    } else {
      return price.toFixed(0);
    }
  };

  const formatPremiumType = (type) => {
    const mapping = {
      'main_view': 'Main View',
      'secondary_view': 'Secondary View',
      'north_breeze': 'North Breeze',
      'corners': 'Corners',
      'accessibility': 'Accessibility'
    };
    return mapping[type] || type;
  };

  const renderPriceRangeTable = () => {
    if (!priceRangeData || !priceRangeData.price_ranges) return null;

    const { price_ranges, totals } = priceRangeData;
    
    // Calculate sum of breakdown percentages for grand total
    const totalBreakdownSum = price_ranges.reduce((sum, range) => sum + (range.breakdown_percent || 0), 0);

    return (
      <div className="spa-tbl-wrapper">
        <table className="spa-tbl">
          <thead>
            <tr className="spa-tbl-head-main">
              <th rowSpan="2" className="spa-tbl-sticky-col spa-tbl-highlight-col">PRICE RANGE</th>
              <th colSpan="2" className="spa-tbl-head-primary">TOTAL UNITS</th>
              <th colSpan="2" className="spa-tbl-head-normal">UNRELEASED UNITS</th>
              <th colSpan="2" className="spa-tbl-head-normal">RELEASED UNITS</th>
              <th colSpan="2" className="spa-tbl-head-normal">CURRENT STATUS</th>
              <th colSpan="2" className="spa-tbl-head-orange">SALES PERFORMANCE</th>
            </tr>
            <tr className="spa-tbl-head-sub">
              <th className="spa-tbl-highlight-col">ALL</th>
              <th>BREAKDOWN</th>
              <th>UNRELEASED</th>
              <th>UNRELEASED %</th>
              <th>RELEASED</th>
              <th>RELEASED %</th>
              <th>AVAILABLE</th>
              <th>SOLD/BOOKED</th>
              <th className="spa-tbl-highlight-gray">SALES % FROM RELEASED</th>
              <th className="spa-tbl-highlight-orange">SALES % FROM TOTAL</th>
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
                  <td className="spa-tbl-sticky-col spa-tbl-txt-left spa-tbl-highlight-col">{formatPriceEGP(range.from)} - {formatPriceEGP(range.to)}</td>
                  <td className="spa-tbl-highlight-col">{range.all || '-'}</td>
                  <td>{range.breakdown_percent > 0 ? range.breakdown_percent.toFixed(1) + '%' : '-'}</td>
                  <td>{unreleased || '-'}</td>
                  <td>{unreleasedPercent > 0 ? unreleasedPercent.toFixed(1) + '%' : '-'}</td>
                  <td>{range.released || '-'}</td>
                  <td>{releasedPercent > 0 ? releasedPercent.toFixed(1) + '%' : '-'}</td>
                  <td>{range.available || '-'}</td>
                  <td>{range.sold_booked || '-'}</td>
                  <td className="spa-tbl-progress-cell spa-tbl-highlight-gray">
                    <div className="spa-tbl-progress-txt">
                      {salesFromReleasedPercent > 0 ? salesFromReleasedPercent.toFixed(1) + '%' : '-'}
                    </div>
                    {salesFromReleasedPercent > 0 && (
                      <div className="spa-tbl-progress-bar">
                        <div className="spa-tbl-progress-fill spa-tbl-progress-gray" style={{ width: `${salesFromReleasedPercent}%` }}></div>
                      </div>
                    )}
                  </td>
                  <td className="spa-tbl-progress-cell spa-tbl-highlight-orange">
                    <div className="spa-tbl-progress-txt">
                      {salesFromTotalPercent > 0 ? salesFromTotalPercent.toFixed(1) + '%' : '-'}
                    </div>
                    {salesFromTotalPercent > 0 && (
                      <div className="spa-tbl-progress-bar">
                        <div className="spa-tbl-progress-fill spa-tbl-progress-orange" style={{ width: `${salesFromTotalPercent}%` }}></div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {renderGrandTotalRow(totals, 'price', totalBreakdownSum)}
          </tbody>
        </table>
      </div>
    );
  };

  const renderUnitModelTable = () => {
    if (!unitModelData || !unitModelData.unit_models) return null;

    const { unit_models, totals } = unitModelData;
    
    // Calculate sum of breakdown percentages for grand total
    const totalBreakdownSum = unit_models.reduce((sum, model) => sum + (model.breakdown_percent || 0), 0);

    return (
      <div className="spa-tbl-wrapper">
        <table className="spa-tbl">
          <thead>
            <tr className="spa-tbl-head-main">
              <th rowSpan="2" className="spa-tbl-sticky-col spa-tbl-highlight-col">UNIT MODEL</th>
              <th colSpan="2" className="spa-tbl-head-primary">TOTAL UNITS</th>
              <th colSpan="2" className="spa-tbl-head-normal">UNRELEASED UNITS</th>
              <th colSpan="2" className="spa-tbl-head-normal">RELEASED UNITS</th>
              <th colSpan="2" className="spa-tbl-head-normal">CURRENT STATUS</th>
              <th colSpan="2" className="spa-tbl-head-orange">SALES PERFORMANCE</th>
            </tr>
            <tr className="spa-tbl-head-sub">
              <th className="spa-tbl-highlight-col">ALL</th>
              <th>BREAKDOWN</th>
              <th>UNRELEASED</th>
              <th>UNRELEASED %</th>
              <th>RELEASED</th>
              <th>RELEASED %</th>
              <th>AVAILABLE</th>
              <th>SOLD/BOOKED</th>
              <th className="spa-tbl-highlight-gray">SALES % FROM RELEASED</th>
              <th className="spa-tbl-highlight-orange">SALES % FROM TOTAL</th>
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
                  <td className="spa-tbl-sticky-col spa-tbl-txt-left spa-tbl-highlight-col">{model.unit_model || 'N/A'}</td>
                  <td className="spa-tbl-highlight-col">{model.all || '-'}</td>
                  <td>{model.breakdown_percent > 0 ? model.breakdown_percent.toFixed(1) + '%' : '-'}</td>
                  <td>{unreleased || '-'}</td>
                  <td>{unreleasedPercent > 0 ? unreleasedPercent.toFixed(1) + '%' : '-'}</td>
                  <td>{model.released || '-'}</td>
                  <td>{releasedPercent > 0 ? releasedPercent.toFixed(1) + '%' : '-'}</td>
                  <td>{model.available || '-'}</td>
                  <td>{model.sold_booked || '-'}</td>
                  <td className="spa-tbl-progress-cell spa-tbl-highlight-gray">
                    <div className="spa-tbl-progress-txt">
                      {salesFromReleasedPercent > 0 ? salesFromReleasedPercent.toFixed(1) + '%' : '-'}
                    </div>
                    {salesFromReleasedPercent > 0 && (
                      <div className="spa-tbl-progress-bar">
                        <div className="spa-tbl-progress-fill spa-tbl-progress-gray" style={{ width: `${salesFromReleasedPercent}%` }}></div>
                      </div>
                    )}
                  </td>
                  <td className="spa-tbl-progress-cell spa-tbl-highlight-orange">
                    <div className="spa-tbl-progress-txt">
                      {salesFromTotalPercent > 0 ? salesFromTotalPercent.toFixed(1) + '%' : '-'}
                    </div>
                    {salesFromTotalPercent > 0 && (
                      <div className="spa-tbl-progress-bar">
                        <div className="spa-tbl-progress-fill spa-tbl-progress-orange" style={{ width: `${salesFromTotalPercent}%` }}></div>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {renderGrandTotalRow(totals, 'model', totalBreakdownSum)}
          </tbody>
        </table>
      </div>
    );
  };

  const renderPremiumTable = (premiumType) => {
    const currentData = premiumData[premiumType];
    if (!currentData || !currentData.premium_groups) return null;

    const { premium_groups, totals } = currentData;
    
    // Calculate sum of breakdown percentages for grand total
    const totalBreakdownSum = premium_groups.reduce((sum, group) => {
      const breakdownPercent = totals.all > 0 ? (group.all / totals.all) * 100 : 0;
      return sum + breakdownPercent;
    }, 0);

    return (
      <div className="spa-premium-tbl-container" key={premiumType}>
        <h4 className="spa-premium-tbl-title">
          <svg className="spa-premium-icon" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
          </svg>
          {formatPremiumType(premiumType)}
        </h4>
        <div className="spa-tbl-wrapper">
          <table className="spa-tbl">
            <thead>
              <tr className="spa-tbl-head-main">
                <th rowSpan="2" className="spa-tbl-sticky-col spa-tbl-highlight-col">{formatPremiumType(premiumType).toUpperCase()}</th>
                <th colSpan="3" className="spa-tbl-head-primary">TOTAL UNITS</th>
                <th colSpan="2" className="spa-tbl-head-normal">UNRELEASED UNITS</th>
                <th colSpan="2" className="spa-tbl-head-normal">RELEASED UNITS</th>
                <th colSpan="2" className="spa-tbl-head-normal">CURRENT STATUS</th>
                <th colSpan="2" className="spa-tbl-head-orange">SALES PERFORMANCE</th>
              </tr>
              <tr className="spa-tbl-head-sub">
                <th className="spa-tbl-highlight-col">ALL</th>
                <th>PREMIUM %</th>
                <th>BREAKDOWN %</th>
                <th>UNRELEASED</th>
                <th>UNRELEASED %</th>
                <th>RELEASED</th>
                <th>RELEASED %</th>
                <th>AVAILABLE</th>
                <th>SOLD/BOOKED</th>
                <th className="spa-tbl-highlight-gray">SALES % FROM RELEASED</th>
                <th className="spa-tbl-highlight-orange">SALES % FROM TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {premium_groups.map((group, index) => {
                const unreleased = group.all - group.released;
                const unreleasedPercent = group.all > 0 ? (unreleased / group.all) * 100 : 0;
                const breakdownPercent = totals.all > 0 ? (group.all / totals.all) * 100 : 0;
                const releasedPercent = group.all > 0 ? (group.released / group.all) * 100 : 0;
                const salesFromReleasedPercent = group.released > 0 ? (group.sold_booked / group.released) * 100 : 0;
                const salesFromTotalPercent = group.all > 0 ? (group.sold_booked / group.all) * 100 : 0;

                return (
                  <tr key={index}>
                    <td className="spa-tbl-sticky-col spa-tbl-txt-left spa-tbl-highlight-col">{group.premium_value || 'N/A'}</td>
                    <td className="spa-tbl-highlight-col">{group.all || '-'}</td>
                    <td>{group.premium_percent > 0 ? group.premium_percent.toFixed(1) + '%' : '-'}</td>
                    <td>{breakdownPercent > 0 ? breakdownPercent.toFixed(1) + '%' : '-'}</td>
                    <td>{unreleased || '-'}</td>
                    <td>{unreleasedPercent > 0 ? unreleasedPercent.toFixed(1) + '%' : '-'}</td>
                    <td>{group.released || '-'}</td>
                    <td>{releasedPercent > 0 ? releasedPercent.toFixed(1) + '%' : '-'}</td>
                    <td>{group.available || '-'}</td>
                    <td>{group.sold_booked || '-'}</td>
                    <td className="spa-tbl-progress-cell spa-tbl-highlight-gray">
                      <div className="spa-tbl-progress-txt">
                        {salesFromReleasedPercent > 0 ? salesFromReleasedPercent.toFixed(1) + '%' : '-'}
                      </div>
                      {salesFromReleasedPercent > 0 && (
                        <div className="spa-tbl-progress-bar">
                          <div className="spa-tbl-progress-fill spa-tbl-progress-gray" style={{ width: `${salesFromReleasedPercent}%` }}></div>
                        </div>
                      )}
                    </td>
                    <td className="spa-tbl-progress-cell spa-tbl-highlight-orange">
                      <div className="spa-tbl-progress-txt">
                        {salesFromTotalPercent > 0 ? salesFromTotalPercent.toFixed(1) + '%' : '-'}
                      </div>
                      {salesFromTotalPercent > 0 && (
                        <div className="spa-tbl-progress-bar">
                          <div className="spa-tbl-progress-fill spa-tbl-progress-orange" style={{ width: `${salesFromTotalPercent}%` }}></div>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {renderGrandTotalRow(totals, 'premium', totalBreakdownSum)}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderGrandTotalRow = (totals, type, breakdownSum = 0) => {
    const totalUnreleased = (totals.all || 0) - (totals.released || 0);
    const totalUnreleasedPercent = totals.all > 0 ? (totalUnreleased / totals.all) * 100 : 0;
    const totalReleasedPercent = totals.all > 0 ? (totals.released / totals.all) * 100 : 0;
    const totalSalesFromReleasedPercent = totals.released > 0 ? (totals.sold_booked / totals.released) * 100 : 0;
    const totalSalesFromTotalPercent = totals.all > 0 ? (totals.sold_booked / totals.all) * 100 : 0;

    if (type === 'price') {
      return (
        <tr className="spa-tbl-grand-total">
          <td className="spa-tbl-sticky-col spa-tbl-highlight-col">GRAND TOTAL</td>
          <td className="spa-tbl-highlight-col">{totals.all || '-'}</td>
          <td>{breakdownSum > 0 ? breakdownSum.toFixed(1) + '%' : '100%'}</td>
          <td>{totalUnreleased || '-'}</td>
          <td>{totalUnreleasedPercent > 0 ? totalUnreleasedPercent.toFixed(1) + '%' : '-'}</td>
          <td>{totals.released || '-'}</td>
          <td>{totalReleasedPercent > 0 ? totalReleasedPercent.toFixed(1) + '%' : '-'}</td>
          <td>{totals.available || '-'}</td>
          <td>{totals.sold_booked || '-'}</td>
          <td className="spa-tbl-progress-cell spa-tbl-highlight-gray">
            <div className="spa-tbl-progress-txt">
              {totalSalesFromReleasedPercent > 0 ? totalSalesFromReleasedPercent.toFixed(1) + '%' : '-'}
            </div>
            {totalSalesFromReleasedPercent > 0 && (
              <div className="spa-tbl-progress-bar">
                <div className="spa-tbl-progress-fill spa-tbl-progress-gray" style={{ width: `${totalSalesFromReleasedPercent}%` }}></div>
              </div>
            )}
          </td>
          <td className="spa-tbl-progress-cell spa-tbl-highlight-orange">
            <div className="spa-tbl-progress-txt">
              {totalSalesFromTotalPercent > 0 ? totalSalesFromTotalPercent.toFixed(1) + '%' : '-'}
            </div>
            {totalSalesFromTotalPercent > 0 && (
              <div className="spa-tbl-progress-bar">
                <div className="spa-tbl-progress-fill spa-tbl-progress-orange" style={{ width: `${totalSalesFromTotalPercent}%` }}></div>
              </div>
            )}
          </td>
        </tr>
      );
    } else if (type === 'model') {
      return (
        <tr className="spa-tbl-grand-total">
          <td className="spa-tbl-sticky-col spa-tbl-highlight-col">GRAND TOTAL</td>
          <td className="spa-tbl-highlight-col">{totals.all || '-'}</td>
          <td>{breakdownSum > 0 ? breakdownSum.toFixed(1) + '%' : '100%'}</td>
          <td>{totalUnreleased || '-'}</td>
          <td>{totalUnreleasedPercent > 0 ? totalUnreleasedPercent.toFixed(1) + '%' : '-'}</td>
          <td>{totals.released || '-'}</td>
          <td>{totalReleasedPercent > 0 ? totalReleasedPercent.toFixed(1) + '%' : '-'}</td>
          <td>{totals.available || '-'}</td>
          <td>{totals.sold_booked || '-'}</td>
          <td className="spa-tbl-progress-cell spa-tbl-highlight-gray">
            <div className="spa-tbl-progress-txt">
              {totalSalesFromReleasedPercent > 0 ? totalSalesFromReleasedPercent.toFixed(1) + '%' : '-'}
            </div>
            {totalSalesFromReleasedPercent > 0 && (
              <div className="spa-tbl-progress-bar">
                <div className="spa-tbl-progress-fill spa-tbl-progress-gray" style={{ width: `${totalSalesFromReleasedPercent}%` }}></div>
              </div>
            )}
          </td>
          <td className="spa-tbl-progress-cell spa-tbl-highlight-orange">
            <div className="spa-tbl-progress-txt">
              {totalSalesFromTotalPercent > 0 ? totalSalesFromTotalPercent.toFixed(1) + '%' : '-'}
            </div>
            {totalSalesFromTotalPercent > 0 && (
              <div className="spa-tbl-progress-bar">
                <div className="spa-tbl-progress-fill spa-tbl-progress-orange" style={{ width: `${totalSalesFromTotalPercent}%` }}></div>
              </div>
            )}
          </td>
        </tr>
      );
    } else {
      return (
        <tr className="spa-tbl-grand-total">
          <td className="spa-tbl-sticky-col spa-tbl-highlight-col">GRAND TOTAL</td>
          <td className="spa-tbl-highlight-col">{totals.all || '-'}</td>
          <td>-</td>
          <td>{breakdownSum > 0 ? breakdownSum.toFixed(1) + '%' : '-'}</td>
          <td>{totalUnreleased || '-'}</td>
          <td>{totalUnreleasedPercent > 0 ? totalUnreleasedPercent.toFixed(1) + '%' : '-'}</td>
          <td>{totals.released || '-'}</td>
          <td>{totalReleasedPercent > 0 ? totalReleasedPercent.toFixed(1) + '%' : '-'}</td>
          <td>{totals.available || '-'}</td>
          <td>{totals.sold_booked || '-'}</td>
          <td className="spa-tbl-progress-cell spa-tbl-highlight-gray">
            <div className="spa-tbl-progress-txt">
              {totalSalesFromReleasedPercent > 0 ? totalSalesFromReleasedPercent.toFixed(1) + '%' : '-'}
            </div>
            {totalSalesFromReleasedPercent > 0 && (
              <div className="spa-tbl-progress-bar">
                <div className="spa-tbl-progress-fill spa-tbl-progress-gray" style={{ width: `${totalSalesFromReleasedPercent}%` }}></div>
              </div>
            )}
          </td>
          <td className="spa-tbl-progress-cell spa-tbl-highlight-orange">
            <div className="spa-tbl-progress-txt">
              {totalSalesFromTotalPercent > 0 ? totalSalesFromTotalPercent.toFixed(1) + '%' : '-'}
            </div>
            {totalSalesFromTotalPercent > 0 && (
              <div className="spa-tbl-progress-bar">
                <div className="spa-tbl-progress-fill spa-tbl-progress-orange" style={{ width: `${totalSalesFromTotalPercent}%` }}></div>
              </div>
            )}
          </td>
        </tr>
      );
    }
  };

  const hasData = priceRangeData || unitModelData || Object.keys(premiumData).length > 0;

  return (
    <div className="spa-main-container">
      {/* Toast Container */}
      <div className="spa-toast-wrapper">
        {toasts.map(toast => (
          <Toast 
            key={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      <div className="spa-content-wrapper">
        {/* Dashboard-style Header */}
        <div className="spa-dashboard-header">
          <h1 className="spa-header-title">
            <span style={{fontSize: '1.8rem', filter: 'none', WebkitTextFillColor: 'initial' }}>📊</span>
            <span className='h1-color' >Sales Performance Analysis</span>
          </h1>

          <div className="spa-header-center">
            <div className="spa-selector-wrapper">
              <label className="spa-selector-label">Select Company </label>
              <div className="spa-selector-container">
                <select
                  className="spa-header-select"
                  value={selectedCompany}
                  onChange={handleCompanyChange}
                >
                  <option value="">Select Company</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>{company.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {selectedCompany && (
              <div className="spa-selector-wrapper">
                <label className="spa-selector-label">Select Project</label>
                <div className="spa-selector-container">
                  <select
                    className="spa-header-select"
                    value={selectedProject}
                    onChange={handleProjectChange}
                  >
                    <option value="">Select Project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          <div className="spa-header-right">
            <button className="spa-header-btn spa-btn-secondary" onClick={handleReset}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M14 8A6 6 0 1 1 8 2v4l3-3-3-3v4a6 6 0 0 0 0 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Reset
            </button>
            <button 
              className="spa-header-btn spa-btn-primary" 
              onClick={handleDownloadAll}
              disabled={!hasData}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v8m0 0l3-3m-3 3L5 7m9 7H2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Download All
            </button>
            <button 
              className="spa-theme-toggle" 
              onClick={toggleDarkMode}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              <div className="spa-theme-toggle-slider">
                {darkMode ? '🌙' : '☀️'}
              </div>
            </button>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="spa-loading">
            <div className="spa-loading-spinner"></div>
            <p className="spa-loading-text">Loading data...</p>
          </div>
        )}

        {/* Analysis Section */}
        {hasData && !loading && (
          <>
            <div id="spa-analysis-section" className="spa-section">
              <div className="spa-section-header">
                <h2 className="spa-section-title">
                  <svg className="spa-section-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                    <rect x="7" y="11" width="3" height="8" fill="currentColor"/>
                    <rect x="10.5" y="7" width="3" height="12" fill="currentColor"/>
                    <rect x="14" y="13" width="3" height="6" fill="currentColor"/>
                  </svg>
                  Sales Analysis
                </h2>
                <div className="spa-tab-buttons">
                  <button
                    className={`spa-tab-btn ${currentAnalysisType === 'all' ? 'spa-tab-btn-active' : ''}`}
                    onClick={() => handleAnalysisTypeClick('all')}
                  >
                    All
                  </button>
                  <button
                    className={`spa-tab-btn ${currentAnalysisType === 'priceRange' ? 'spa-tab-btn-active' : ''}`}
                    onClick={() => handleAnalysisTypeClick('priceRange')}
                  >
                    Price Range
                  </button>
                  <button
                    className={`spa-tab-btn ${currentAnalysisType === 'unitModel' ? 'spa-tab-btn-active' : ''}`}
                    onClick={() => handleAnalysisTypeClick('unitModel')}
                  >
                    Unit Model
                  </button>
                </div>
              </div>

              {(currentAnalysisType === 'all' || currentAnalysisType === 'priceRange') && priceRangeData && (
                <div className="spa-table-section">
                  <h3 className="spa-table-title">Price Range</h3>
                  {renderPriceRangeTable()}
                </div>
              )}

              {(currentAnalysisType === 'all' || currentAnalysisType === 'unitModel') && unitModelData && (
                <div className="spa-table-section">
                  <h3 className="spa-table-title">Unit Model</h3>
                  {renderUnitModelTable()}
                </div>
              )}
            </div>

            {/* Premium Analysis Section */}
            <div id="spa-premium-section" className="spa-section">
              <div className="spa-section-header">
                <h2 className="spa-section-title">
                  <svg className="spa-section-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                  </svg>
                  Premium Analysis
                </h2>
                <div className="spa-tab-buttons">
                  <button
                    className={`spa-tab-btn ${currentPremiumType === 'all' ? 'spa-tab-btn-active' : ''}`}
                    onClick={() => handlePremiumTypeClick('all')}
                  >
                    All
                  </button>
                  <button
                    className={`spa-tab-btn ${currentPremiumType === 'main_view' ? 'spa-tab-btn-active' : ''}`}
                    onClick={() => handlePremiumTypeClick('main_view')}
                  >
                    Main View
                  </button>
                  <button
                    className={`spa-tab-btn ${currentPremiumType === 'secondary_view' ? 'spa-tab-btn-active' : ''}`}
                    onClick={() => handlePremiumTypeClick('secondary_view')}
                  >
                    Secondary View
                  </button>
                  <button
                    className={`spa-tab-btn ${currentPremiumType === 'north_breeze' ? 'spa-tab-btn-active' : ''}`}
                    onClick={() => handlePremiumTypeClick('north_breeze')}
                  >
                    North Breeze
                  </button>
                  <button
                    className={`spa-tab-btn ${currentPremiumType === 'corners' ? 'spa-tab-btn-active' : ''}`}
                    onClick={() => handlePremiumTypeClick('corners')}
                  >
                    Corners
                  </button>
                  <button
                    className={`spa-tab-btn ${currentPremiumType === 'accessibility' ? 'spa-tab-btn-active' : ''}`}
                    onClick={() => handlePremiumTypeClick('accessibility')}
                  >
                    Accessibility
                  </button>
                </div>
              </div>

              <div className="spa-premium-tables">
                {currentPremiumType === 'all' ? (
                  Object.keys(premiumData).map(type => renderPremiumTable(type))
                ) : (
                  renderPremiumTable(currentPremiumType)
                )}
              </div>
            </div>
          </>
        )}

        {!hasData && !loading && selectedProject && (
          <div className="spa-no-data">
            <p>No data available for this project</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesPerformanceAnalysis;