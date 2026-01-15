// import React, { useMemo, useState } from 'react';
// // Version: Updated tooltip position - Jan 14, 2026
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Tooltip,
//   Legend
// } from 'chart.js';
// import { Bar } from 'react-chartjs-2';
// import ChartModal from './Chartmodal';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Tooltip,
//   Legend
// );

// // Enhanced candlestick plugin - values attached to line ends
// const candlestickPlugin = {
//   id: 'candlestickPlugin',
//   afterDatasetsDraw(chart) {
//     const ctx = chart.ctx;
//     const meta = chart.getDatasetMeta(0);
    
//     if (!meta || !meta.data || !chart.data.datasets || !chart.data.datasets[0]) {
//       return;
//     }
    
//     const dataset = chart.data.datasets[0];
//     if (!dataset.minMax) return;
    
//     meta.data.forEach((bar, index) => {
//       const dataPoint = dataset.minMax[index];
      
//       if (!dataPoint || !bar) return;
      
//       const { min, max, avg } = dataPoint;
//       if (min === undefined || max === undefined || avg === undefined) return;
      
//       const x = bar.x;
//       const yScale = chart.scales.y;
      
//       if (!yScale) return;
      
//       const minY = yScale.getPixelForValue(min);
//       const maxY = yScale.getPixelForValue(max);
//       // const avgY = yScale.getPixelForValue(avg);
      
//       // Draw thick vertical line from min to max
//       ctx.save();
//       ctx.strokeStyle = '#D2691E';
//       ctx.lineWidth = 5;
//       ctx.beginPath();
//       ctx.moveTo(x, minY);
//       ctx.lineTo(x, maxY);
//       ctx.stroke();
      
//       ctx.restore();
//     });
//   },
  
//   // Draw value labels after everything else
//   afterDraw(chart) {
//     const ctx = chart.ctx;
//     const meta = chart.getDatasetMeta(0);
    
//     if (!meta || !meta.data || !chart.data.datasets || !chart.data.datasets[0]) {
//       return;
//     }
    
//     const dataset = chart.data.datasets[0];
//     if (!dataset.minMax) return;
    
//     meta.data.forEach((bar, index) => {
//       const dataPoint = dataset.minMax[index];
      
//       if (!dataPoint || !bar) return;
      
//       const { min, max, avg } = dataPoint;
//       if (min === undefined || max === undefined || avg === undefined) return;
      
//       const x = bar.x;
//       const yScale = chart.scales.y;
      
//       if (!yScale) return;
      
//       const minY = yScale.getPixelForValue(min);
//       const maxY = yScale.getPixelForValue(max);
//       const avgY = yScale.getPixelForValue(avg);
      
//       // Format numbers with commas
//       const formatValue = (val) => {
//         return Math.round(val).toLocaleString('en-US');
//       };
      
//       ctx.save();
//       ctx.textAlign = 'center';
//       ctx.font = 'bold 10px Arial';
      
//       // MAX value label - ATTACHED TO TOP OF LINE
//       const maxText = formatValue(max);
//       const maxPadding = 8;
//       const maxMetrics = ctx.measureText(maxText);
//       const maxBoxWidth = maxMetrics.width + maxPadding * 2;
//       const maxBoxHeight = 20;
//       const maxBoxX = x - maxBoxWidth / 2;
//       const maxBoxY = maxY - maxBoxHeight; // Attached directly to line top
      
//       // White background
//       ctx.fillStyle = '#fff';
//       ctx.fillRect(maxBoxX, maxBoxY, maxBoxWidth, maxBoxHeight);
      
//       // Black border
//       ctx.strokeStyle = '#000';
//       ctx.lineWidth = 1.5;
//       ctx.strokeRect(maxBoxX, maxBoxY, maxBoxWidth, maxBoxHeight);
      
//       // Black text
//       ctx.fillStyle = '#000';
//       ctx.fillText(maxText, x, maxBoxY + 13);
      
//       // AVERAGE value label (white text on orange background)
//       const avgText = formatValue(avg);
//       const avgPadding = 8;
//       const avgMetrics = ctx.measureText(avgText);
//       const avgBoxWidth = avgMetrics.width + avgPadding * 2;
//       const avgBoxHeight = 20;
//       const avgBoxX = x - avgBoxWidth / 2;
//       const avgBoxY = avgY - avgBoxHeight / 2;
      
//       // Orange background
//       ctx.fillStyle = '#FF6B35';
//       ctx.fillRect(avgBoxX, avgBoxY, avgBoxWidth, avgBoxHeight);
      
//       // White text
//       ctx.fillStyle = '#fff';
//       ctx.fillText(avgText, x, avgBoxY + 13);
      
//       // MIN value label - ATTACHED TO BOTTOM OF LINE
//       const minText = formatValue(min);
//       const minPadding = 8;
//       const minMetrics = ctx.measureText(minText);
//       const minBoxWidth = minMetrics.width + minPadding * 2;
//       const minBoxHeight = 20;
//       const minBoxX = x - minBoxWidth / 2;
//       const minBoxY = minY; // Attached directly to line bottom
      
//       // White background
//       ctx.fillStyle = '#fff';
//       ctx.fillRect(minBoxX, minBoxY, minBoxWidth, minBoxHeight);
      
//       // Black border
//       ctx.strokeStyle = '#000';
//       ctx.lineWidth = 1.5;
//       ctx.strokeRect(minBoxX, minBoxY, minBoxWidth, minBoxHeight);
      
//       // Black text
//       ctx.fillStyle = '#000';
//       ctx.fillText(minText, x, minBoxY + 13);
      
//       ctx.restore();
//     });
//   }
// };

// ChartJS.register(candlestickPlugin);

// const UnitMetricsCharts = ({ units }) => {
//   // Chart modal states
//   const [chartModalOpen, setChartModalOpen] = useState(false);
//   const [chartModalTitle, setChartModalTitle] = useState('');
//   const [chartModalData, setChartModalData] = useState(null);

//   // Open chart in modal
//   const openChartModal = (title, data) => {
//     setChartModalTitle(title);
//     setChartModalData(data);
//     setChartModalOpen(true);
//   };

//   // Helper function to aggregate data by unit type
//   const aggregateByUnitType = (valueField) => {
//     const grouped = {};
    
//     units.forEach(unit => {
//       const unitType = unit.unit_type || 'Unknown';
//       const value = parseFloat(unit[valueField]);
      
//       if (!isNaN(value) && unitType !== 'Unknown' && value > 0) {
//         if (!grouped[unitType]) {
//           grouped[unitType] = [];
//         }
//         grouped[unitType].push(value);
//       }
//     });
    
//     const result = {
//       labels: [],
//       dataPoints: []
//     };
    
//     // Sort by unit type name
//     Object.keys(grouped).sort().forEach(label => {
//       const values = grouped[label].sort((a, b) => a - b);
//       if (values.length > 0) {
//         const min = values[0];
//         const max = values[values.length - 1];
//         const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
        
//         result.labels.push(label);
//         result.dataPoints.push({ min, max, avg, count: values.length });
//       }
//     });
    
//     console.log(`Aggregated ${valueField}:`, result);
    
//     return result;
//   };

//   // Memoized chart data
//   const priceChartData = useMemo(() => {
//     const data = aggregateByUnitType('sales_value');
    
//     // Calculate global max for proper Y-axis scaling
//     // const globalMax = Math.max(...data.dataPoints.map(d => d.max));
    
//     return {
//       labels: data.labels,
//       datasets: [{
//         label: 'Price Range',
//         data: data.dataPoints.map(d => d.max), // Use max for Y-axis scaling
//         backgroundColor: 'transparent',
//         borderColor: 'transparent',
//         borderWidth: 0,
//         barThickness: 50,
//         minMax: data.dataPoints
//       }]
//     };
//   }, [units]);

//   const psmChartData = useMemo(() => {
//     const data = aggregateByUnitType('psm');
    
//     // Calculate global max for proper Y-axis scaling
//     // const globalMax = Math.max(...data.dataPoints.map(d => d.max));
    
//     return {
//       labels: data.labels,
//       datasets: [{
//         label: 'PSM Range',
//         data: data.dataPoints.map(d => d.max), // Use max for Y-axis scaling
//         backgroundColor: 'transparent',
//         borderColor: 'transparent',
//         borderWidth: 0,
//         barThickness: 50,
//         minMax: data.dataPoints
//       }]
//     };
//   }, [units]);

//   const areaChartData = useMemo(() => {
//     const data = aggregateByUnitType('sellable_area');
    
//     // Calculate global max for proper Y-axis scaling
//     // const globalMax = Math.max(...data.dataPoints.map(d => d.max));
    
//     return {
//       labels: data.labels,
//       datasets: [{
//         label: 'Area Range (sqm)',
//         data: data.dataPoints.map(d => d.max), // Use max for Y-axis scaling
//         backgroundColor: 'transparent',
//         borderColor: 'transparent',
//         borderWidth: 0,
//         barThickness: 50,
//         minMax: data.dataPoints
//       }]
//     };
//   }, [units]);

//   // Chart options
//   const getChartOptions = (yAxisLabel) => ({
//     responsive: true,
//     maintainAspectRatio: false,
//     layout: {
//       padding: {
//         top: 40,
//         bottom: 40,
//         left: 15,
//         right: 15
//       }
//     },
//     plugins: {
//       legend: { 
//         display: false
//       },
//       datalabels: {
//         display: false  // Hide the gray max value on bars
//       },
//       tooltip: {
//         enabled: true,
//         backgroundColor: 'rgba(0, 0, 0, 0.9)',
//         padding: 6,
//         titleColor: '#fff',
//         bodyColor: '#fff',
//         borderColor: '#FF6B35',
//         borderWidth: 1,
//         cornerRadius: 4,
//         displayColors: false,
//         titleFont: {
//           size: 9,
//           weight: 'bold'
//         },
//         bodyFont: {
//           size: 8
//         },
//         bodySpacing: 2,
//         xAlign: 'left',     // Position to the left of cursor
//         yAlign: 'bottom',      // Position above cursor
//         caretSize: 4,
//         caretPadding: 15,
//         callbacks: {
//           title: (items) => items[0].label,
//           label: (context) => {
//             const dataset = context.dataset;
//             const index = context.dataIndex;
//             const dataPoint = dataset.minMax[index];
            
//             return [
//               `Max: ${(dataPoint.max / 1000000).toFixed(1)}M`,
//               `Avg: ${(dataPoint.avg / 1000000).toFixed(1)}M`,
//               `Min: ${(dataPoint.min / 1000000).toFixed(1)}M`,
//               `Units: ${dataPoint.count}`
//             ];
//           }
//         }
//       }
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: yAxisLabel,
//           font: {
//             size: 12,
//             weight: 'bold'
//           }
//         },
//         grid: {
//           color: 'rgba(0, 0, 0, 0.05)',
//           drawBorder: true,
//           borderColor: '#ccc'
//         },
//         ticks: {
//           callback: (value) => {
//             // Format Y-axis with commas
//             return Math.round(value).toLocaleString('en-US');
//           },
//           font: {
//             size: 10
//           }
//         }
//       },
//       x: {
//         grid: {
//           display: false,
//           drawBorder: true,
//           borderColor: '#ccc'
//         },
//         ticks: {
//           font: {
//             size: 10
//           },
//           maxRotation: 0,
//           minRotation: 0
//         }
//       }
//     }
//   });

//   if (!units || units.length === 0) {
//     return (
//       <div className="unit-metrics-charts-container">
//         <h2>Unit Metrics Overview</h2>
//         <div className="chart-card">
//           <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
//             No data available. Please select filters to view unit metrics.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="unit-metrics-charts-container">
//       <div className="chart-card" style={{ marginBottom: '30px' }}>
//         <div className="chart-header">
//           <h3>Unit Price Range</h3>
//           <button 
//             className="chart-btn chart-expand-btn" 
//             onClick={() => openChartModal('Unit Price Range (Sales Value)', priceChartData)}
//             title="Expand chart"
//           >
//             ⛶
//           </button>
//         </div>
//         <div className={priceChartData.labels.length > 2? 'chart-scroll-wrapper candlestick-wrapper-scroll' : 'candlestick-wrapper-no-scroll'}>
//           <div 
//             className="candlestick-chart-container" 
//             style={{ 
//               height: '350px', 
//               padding: '10px',
//               minWidth: priceChartData.labels.length > 2 ? '800px' : 'auto'
//             }}
//           >
//             <Bar 
//               key="price-chart"
//               data={priceChartData} 
//               options={getChartOptions('Unit Price Range (Sales Value)')}
//             />
//           </div>
//         </div>
//       </div>

//       <div className="chart-card" style={{ marginBottom: '30px' }}>
//         <div className="chart-header">
//           <h3>Price per Square Meter Range</h3>
//           <button 
//             className="chart-btn chart-expand-btn" 
//             onClick={() => openChartModal('PSM (EGP/sqm)', psmChartData)}
//             title="Expand chart"
//           >
//             ⛶
//           </button>
//         </div>
//         <div className={psmChartData.labels.length > 2 ? 'chart-scroll-wrapper candlestick-wrapper-scroll' : 'candlestick-wrapper-no-scroll'}>
//           <div 
//             className="candlestick-chart-container" 
//             style={{ 
//               height: '350px', 
//               padding: '10px',
//               minWidth: psmChartData.labels.length > 2 ? '800px' : 'auto'
//             }}
//           >
//             <Bar 
//               key="psm-chart"
//               data={psmChartData} 
//               options={getChartOptions('PSM (EGP/sqm)')}
//             />
//           </div>
//         </div>
//       </div>

//       <div className="chart-card" style={{ marginBottom: '30px' }}>
//         <div className="chart-header">
//           <h3>Sellable Area Range</h3>
//           <button 
//             className="chart-btn chart-expand-btn" 
//             onClick={() => openChartModal('Area (sqm)', areaChartData)}
//             title="Expand chart"
//           >
//             ⛶
//           </button>
//         </div>
//         <div className={areaChartData.labels.length > 2 ? 'chart-scroll-wrapper candlestick-wrapper-scroll' : 'candlestick-wrapper-no-scroll'}>
//           <div 
//             className="candlestick-chart-container" 
//             style={{ 
//               height: '350px', 
//               padding: '10px',
//               minWidth: areaChartData.labels.length > 2 ? '800px' : 'auto'
//             }}
//           >
//             <Bar 
//               key="area-chart"
//               data={areaChartData} 
//               options={getChartOptions('Area (sqm)')}
//             />
//           </div>
//         </div>
//       </div>

//       {/* Chart Modal for Fullscreen View */}
//       <ChartModal
//         isOpen={chartModalOpen}
//         onClose={() => setChartModalOpen(false)}
//         title={chartModalTitle}
//       >
//         {chartModalData && (
//           <div style={{ height: '75vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//             <Bar data={chartModalData} options={getChartOptions(chartModalTitle)} />
//           </div>
//         )}
//       </ChartModal>
//     </div>
//   );
// };

// export default UnitMetricsCharts;





// // import React, { useMemo, useState, useCallback } from 'react';
// // import {
// //   Chart as ChartJS,
// //   CategoryScale,
// //   LinearScale,
// //   BarElement,
// //   Tooltip,
// //   Legend
// // } from 'chart.js';
// // import { Bar } from 'react-chartjs-2';
// // import ChartModal from './Chartmodal';

// // ChartJS.register(
// //   CategoryScale,
// //   LinearScale,
// //   BarElement,
// //   Tooltip,
// //   Legend
// // );

// // // Candlestick plugin
// // const candlestickPlugin = {
// //   id: 'candlestickPlugin',
// //   afterDatasetsDraw(chart) {
// //     const ctx = chart.ctx;
// //     const meta = chart.getDatasetMeta(0);
// //     const dataset = chart.data.datasets?.[0];

// //     if (!meta?.data || !dataset?.minMax) return;

// //     meta.data.forEach((bar, index) => {
// //       const dataPoint = dataset.minMax[index];
// //       if (!dataPoint || !bar) return;

// //       const { min, max } = dataPoint;
// //       const yScale = chart.scales.y;
// //       if (!yScale) return;

// //       const minY = yScale.getPixelForValue(min);
// //       const maxY = yScale.getPixelForValue(max);

// //       ctx.save();
// //       ctx.strokeStyle = '#D2691E';
// //       ctx.lineWidth = 5;
// //       ctx.beginPath();
// //       ctx.moveTo(bar.x, minY);
// //       ctx.lineTo(bar.x, maxY);
// //       ctx.stroke();
// //       ctx.restore();
// //     });
// //   },

// //   afterDraw(chart) {
// //     const ctx = chart.ctx;
// //     const meta = chart.getDatasetMeta(0);
// //     const dataset = chart.data.datasets?.[0];

// //     if (!meta?.data || !dataset?.minMax) return;

// //     meta.data.forEach((bar, index) => {
// //       const dataPoint = dataset.minMax[index];
// //       if (!dataPoint || !bar) return;

// //       const { min, max, avg } = dataPoint;
// //       const yScale = chart.scales.y;
// //       if (!yScale) return;

// //       const minY = yScale.getPixelForValue(min);
// //       const maxY = yScale.getPixelForValue(max);
// //       const avgY = yScale.getPixelForValue(avg);

// //       const formatValue = (v) => Math.round(v).toLocaleString('en-US');

// //       ctx.save();
// //       ctx.textAlign = 'center';
// //       ctx.font = 'bold 10px Arial';

// //       // MAX
// //       ctx.fillStyle = '#fff';
// //       ctx.fillRect(bar.x - 30, maxY - 20, 60, 20);
// //       ctx.strokeStyle = '#000';
// //       ctx.strokeRect(bar.x - 30, maxY - 20, 60, 20);
// //       ctx.fillStyle = '#000';
// //       ctx.fillText(formatValue(max), bar.x, maxY - 6);

// //       // AVG
// //       ctx.fillStyle = '#FF6B35';
// //       ctx.fillRect(bar.x - 30, avgY - 10, 60, 20);
// //       ctx.fillStyle = '#fff';
// //       ctx.fillText(formatValue(avg), bar.x, avgY + 5);

// //       // MIN
// //       ctx.fillStyle = '#fff';
// //       ctx.fillRect(bar.x - 30, minY, 60, 20);
// //       ctx.strokeStyle = '#000';
// //       ctx.strokeRect(bar.x - 30, minY, 60, 20);
// //       ctx.fillStyle = '#000';
// //       ctx.fillText(formatValue(min), bar.x, minY + 14);

// //       ctx.restore();
// //     });
// //   }
// // };

// // ChartJS.register(candlestickPlugin);

// // const UnitMetricsCharts = ({ units }) => {
// //   const [chartModalOpen, setChartModalOpen] = useState(false);
// //   const [chartModalTitle, setChartModalTitle] = useState('');
// //   const [chartModalData, setChartModalData] = useState(null);

// //   const openChartModal = (title, data) => {
// //     setChartModalTitle(title);
// //     setChartModalData(data);
// //     setChartModalOpen(true);
// //   };

// //   // ✅ FIXED: memoized helper
// //   const aggregateByUnitType = useCallback((field) => {
// //     const grouped = {};

// //     units.forEach(unit => {
// //       const type = unit.unit_type;
// //       const value = parseFloat(unit[field]);
// //       if (!type || isNaN(value) || value <= 0) return;

// //       if (!grouped[type]) grouped[type] = [];
// //       grouped[type].push(value);
// //     });

// //     const labels = [];
// //     const dataPoints = [];

// //     Object.keys(grouped).sort().forEach(type => {
// //       const values = grouped[type].sort((a, b) => a - b);
// //       const min = values[0];
// //       const max = values[values.length - 1];
// //       const avg = values.reduce((s, v) => s + v, 0) / values.length;

// //       labels.push(type);
// //       dataPoints.push({ min, max, avg, count: values.length });
// //     });

// //     return { labels, dataPoints };
// //   }, [units]);

// //   const buildChartData = useCallback((field, label) => {
// //     const data = aggregateByUnitType(field);
// //     return {
// //       labels: data.labels,
// //       datasets: [{
// //         label,
// //         data: data.dataPoints.map(d => d.max),
// //         backgroundColor: 'transparent',
// //         borderColor: 'transparent',
// //         barThickness: 50,
// //         minMax: data.dataPoints
// //       }]
// //     };
// //   }, [aggregateByUnitType]);

// //   const priceChartData = useMemo(
// //     () => buildChartData('sales_value', 'Price Range'),
// //     [buildChartData]
// //   );

// //   const psmChartData = useMemo(
// //     () => buildChartData('psm', 'PSM Range'),
// //     [buildChartData]
// //   );

// //   const areaChartData = useMemo(
// //     () => buildChartData('sellable_area', 'Area Range'),
// //     [buildChartData]
// //   );

// //   const getChartOptions = (title) => ({
// //     responsive: true,
// //     maintainAspectRatio: false,
// //     plugins: {
// //       legend: { display: false },
// //       tooltip: {
// //         backgroundColor: 'rgba(0,0,0,0.9)',
// //         callbacks: {
// //           title: (i) => i[0].label,
// //           label: (ctx) => {
// //             const d = ctx.dataset.minMax[ctx.dataIndex];
// //             return [
// //               `Max: ${d.max.toLocaleString()}`,
// //               `Avg: ${d.avg.toLocaleString()}`,
// //               `Min: ${d.min.toLocaleString()}`,
// //               `Units: ${d.count}`
// //             ];
// //           }
// //         }
// //       }
// //     },
// //     scales: {
// //       y: { beginAtZero: true, title: { display: true, text: title } },
// //       x: { grid: { display: false } }
// //     }
// //   });

// //   if (!units?.length) {
// //     return <p style={{ textAlign: 'center' }}>No data available</p>;
// //   }

// //   return (
// //     <div className="unit-metrics-charts-container">
// //       {[{
// //         title: 'Unit Price Range',
// //         data: priceChartData
// //       }, {
// //         title: 'PSM Range',
// //         data: psmChartData
// //       }, {
// //         title: 'Sellable Area Range',
// //         data: areaChartData
// //       }].map(({ title, data }) => (
// //         <div className="chart-card" key={title}>
// //           <div className="chart-header">
// //             <h3>{title}</h3>
// //             <button onClick={() => openChartModal(title, data)}>⛶</button>
// //           </div>
// //           <div style={{ height: 350 }}>
// //             <Bar data={data} options={getChartOptions(title)} />
// //           </div>
// //         </div>
// //       ))}

// //       <ChartModal
// //         isOpen={chartModalOpen}
// //         onClose={() => setChartModalOpen(false)}
// //         title={chartModalTitle}
// //       >
// //         {chartModalData && (
// //           <div style={{ height: '75vh' }}>
// //             <Bar data={chartModalData} options={getChartOptions(chartModalTitle)} />
// //           </div>
// //         )}
// //       </ChartModal>
// //     </div>
// //   );
// // };

// // export default UnitMetricsCharts;



import React, { useMemo, useState, useCallback } from 'react';
// Version: Updated tooltip position - Jan 14, 2026
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import ChartModal from './Chartmodal';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

// Enhanced candlestick plugin - values attached to line ends
const candlestickPlugin = {
  id: 'candlestickPlugin',
  afterDatasetsDraw(chart) {
    const ctx = chart.ctx;
    const meta = chart.getDatasetMeta(0);
    
    if (!meta || !meta.data || !chart.data.datasets || !chart.data.datasets[0]) {
      return;
    }
    
    const dataset = chart.data.datasets[0];
    if (!dataset.minMax) return;
    
    meta.data.forEach((bar, index) => {
      const dataPoint = dataset.minMax[index];
      
      if (!dataPoint || !bar) return;
      
      const { min, max, avg } = dataPoint;
      if (min === undefined || max === undefined || avg === undefined) return;
      
      const x = bar.x;
      const yScale = chart.scales.y;
      
      if (!yScale) return;
      
      const minY = yScale.getPixelForValue(min);
      const maxY = yScale.getPixelForValue(max);
      // const avgY = yScale.getPixelForValue(avg);
      
      // Draw thick vertical line from min to max
      ctx.save();
      ctx.strokeStyle = '#D2691E';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(x, minY);
      ctx.lineTo(x, maxY);
      ctx.stroke();
      
      ctx.restore();
    });
  },
  
  // Draw value labels after everything else
  afterDraw(chart) {
    const ctx = chart.ctx;
    const meta = chart.getDatasetMeta(0);
    
    if (!meta || !meta.data || !chart.data.datasets || !chart.data.datasets[0]) {
      return;
    }
    
    const dataset = chart.data.datasets[0];
    if (!dataset.minMax) return;
    
    meta.data.forEach((bar, index) => {
      const dataPoint = dataset.minMax[index];
      
      if (!dataPoint || !bar) return;
      
      const { min, max, avg } = dataPoint;
      if (min === undefined || max === undefined || avg === undefined) return;
      
      const x = bar.x;
      const yScale = chart.scales.y;
      
      if (!yScale) return;
      
      const minY = yScale.getPixelForValue(min);
      const maxY = yScale.getPixelForValue(max);
      const avgY = yScale.getPixelForValue(avg);
      
      // Format numbers with commas
      const formatValue = (val) => {
        return Math.round(val).toLocaleString('en-US');
      };
      
      ctx.save();
      ctx.textAlign = 'center';
      ctx.font = 'bold 10px Arial';
      
      // MAX value label - ATTACHED TO TOP OF LINE
      const maxText = formatValue(max);
      const maxPadding = 8;
      const maxMetrics = ctx.measureText(maxText);
      const maxBoxWidth = maxMetrics.width + maxPadding * 2;
      const maxBoxHeight = 20;
      const maxBoxX = x - maxBoxWidth / 2;
      const maxBoxY = maxY - maxBoxHeight; // Attached directly to line top
      
      // White background
      ctx.fillStyle = '#fff';
      ctx.fillRect(maxBoxX, maxBoxY, maxBoxWidth, maxBoxHeight);
      
      // Black border
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(maxBoxX, maxBoxY, maxBoxWidth, maxBoxHeight);
      
      // Black text
      ctx.fillStyle = '#000';
      ctx.fillText(maxText, x, maxBoxY + 13);
      
      // AVERAGE value label (white text on orange background)
      const avgText = formatValue(avg);
      const avgPadding = 8;
      const avgMetrics = ctx.measureText(avgText);
      const avgBoxWidth = avgMetrics.width + avgPadding * 2;
      const avgBoxHeight = 20;
      const avgBoxX = x - avgBoxWidth / 2;
      const avgBoxY = avgY - avgBoxHeight / 2;
      
      // Orange background
      ctx.fillStyle = '#FF6B35';
      ctx.fillRect(avgBoxX, avgBoxY, avgBoxWidth, avgBoxHeight);
      
      // White text
      ctx.fillStyle = '#fff';
      ctx.fillText(avgText, x, avgBoxY + 13);
      
      // MIN value label - ATTACHED TO BOTTOM OF LINE
      const minText = formatValue(min);
      const minPadding = 8;
      const minMetrics = ctx.measureText(minText);
      const minBoxWidth = minMetrics.width + minPadding * 2;
      const minBoxHeight = 20;
      const minBoxX = x - minBoxWidth / 2;
      const minBoxY = minY; // Attached directly to line bottom
      
      // White background
      ctx.fillStyle = '#fff';
      ctx.fillRect(minBoxX, minBoxY, minBoxWidth, minBoxHeight);
      
      // Black border
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(minBoxX, minBoxY, minBoxWidth, minBoxHeight);
      
      // Black text
      ctx.fillStyle = '#000';
      ctx.fillText(minText, x, minBoxY + 13);
      
      ctx.restore();
    });
  }
};

ChartJS.register(candlestickPlugin);

const UnitMetricsCharts = ({ units }) => {
  // Chart modal states
  const [chartModalOpen, setChartModalOpen] = useState(false);
  const [chartModalTitle, setChartModalTitle] = useState('');
  const [chartModalData, setChartModalData] = useState(null);

  // Open chart in modal
  const openChartModal = (title, data) => {
    setChartModalTitle(title);
    setChartModalData(data);
    setChartModalOpen(true);
  };

  // Helper function to aggregate data by unit type
  const aggregateByUnitType = useCallback((valueField) => {
    const grouped = {};
    
    units.forEach(unit => {
      const unitType = unit.unit_type || 'Unknown';
      const value = parseFloat(unit[valueField]);
      
      if (!isNaN(value) && unitType !== 'Unknown' && value > 0) {
        if (!grouped[unitType]) {
          grouped[unitType] = [];
        }
        grouped[unitType].push(value);
      }
    });
    
    const result = {
      labels: [],
      dataPoints: []
    };
    
    // Sort by unit type name
    Object.keys(grouped).sort().forEach(label => {
      const values = grouped[label].sort((a, b) => a - b);
      if (values.length > 0) {
        const min = values[0];
        const max = values[values.length - 1];
        const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
        
        result.labels.push(label);
        result.dataPoints.push({ min, max, avg, count: values.length });
      }
    });
    
    console.log(`Aggregated ${valueField}:`, result);
    
    return result;
  }, [units]);

  // Memoized chart data
  const priceChartData = useMemo(() => {
    const data = aggregateByUnitType('sales_value');
    
    // Calculate global max for proper Y-axis scaling
    // const globalMax = Math.max(...data.dataPoints.map(d => d.max));
    
    return {
      labels: data.labels,
      datasets: [{
        label: 'Price Range',
        data: data.dataPoints.map(d => d.max), // Use max for Y-axis scaling
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderWidth: 0,
        barThickness: 50,
        minMax: data.dataPoints
      }]
    };
  }, [aggregateByUnitType]);

  const psmChartData = useMemo(() => {
    const data = aggregateByUnitType('psm');
    
    // Calculate global max for proper Y-axis scaling
    // const globalMax = Math.max(...data.dataPoints.map(d => d.max));
    
    return {
      labels: data.labels,
      datasets: [{
        label: 'PSM Range',
        data: data.dataPoints.map(d => d.max), // Use max for Y-axis scaling
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderWidth: 0,
        barThickness: 50,
        minMax: data.dataPoints
      }]
    };
  }, [aggregateByUnitType]);

  const areaChartData = useMemo(() => {
    const data = aggregateByUnitType('sellable_area');
    
    // Calculate global max for proper Y-axis scaling
    // const globalMax = Math.max(...data.dataPoints.map(d => d.max));
    
    return {
      labels: data.labels,
      datasets: [{
        label: 'Area Range (sqm)',
        data: data.dataPoints.map(d => d.max), // Use max for Y-axis scaling
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderWidth: 0,
        barThickness: 50,
        minMax: data.dataPoints
      }]
    };
  }, [aggregateByUnitType]);

  // Chart options
  const getChartOptions = (yAxisLabel) => ({
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 40,
        bottom: 40,
        left: 15,
        right: 15
      }
    },
    plugins: {
      legend: { 
        display: false
      },
      datalabels: {
        display: false  // Hide the gray max value on bars
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        padding: 6,
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#FF6B35',
        borderWidth: 1,
        cornerRadius: 4,
        displayColors: false,
        titleFont: {
          size: 9,
          weight: 'bold'
        },
        bodyFont: {
          size: 8
        },
        bodySpacing: 2,
        xAlign: 'left',     // Position to the left of cursor
        yAlign: 'bottom',      // Position above cursor
        caretSize: 4,
        caretPadding: 15,
        callbacks: {
          title: (items) => items[0].label,
          label: (context) => {
            const dataset = context.dataset;
            const index = context.dataIndex;
            const dataPoint = dataset.minMax[index];
            
            return [
              `Max: ${(dataPoint.max / 1000000).toFixed(1)}M`,
              `Avg: ${(dataPoint.avg / 1000000).toFixed(1)}M`,
              `Min: ${(dataPoint.min / 1000000).toFixed(1)}M`,
              `Units: ${dataPoint.count}`
            ];
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: yAxisLabel,
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: true,
          borderColor: '#ccc'
        },
        ticks: {
          callback: (value) => {
            // Format Y-axis with commas
            return Math.round(value).toLocaleString('en-US');
          },
          font: {
            size: 10
          }
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: true,
          borderColor: '#ccc'
        },
        ticks: {
          font: {
            size: 10
          },
          maxRotation: 0,
          minRotation: 0
        }
      }
    }
  });

  if (!units || units.length === 0) {
    return (
      <div className="unit-metrics-charts-container">
        <h2>Unit Metrics Overview</h2>
        <div className="chart-card">
          <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            No data available. Please select filters to view unit metrics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="unit-metrics-charts-container">
      <div className="chart-card" style={{ marginBottom: '30px' }}>
        <div className="chart-header">
          <h3>Unit Price Range</h3>
          <button 
            className="chart-btn chart-expand-btn" 
            onClick={() => openChartModal('Unit Price Range (Sales Value)', priceChartData)}
            title="Expand chart"
          >
            ⛶
          </button>
        </div>
        <div className={priceChartData.labels.length > 2? 'chart-scroll-wrapper candlestick-wrapper-scroll' : 'candlestick-wrapper-no-scroll'}>
          <div 
            className="candlestick-chart-container" 
            style={{ 
              height: '350px', 
              padding: '10px',
              minWidth: priceChartData.labels.length > 2 ? '800px' : 'auto'
            }}
          >
            <Bar 
              key="price-chart"
              data={priceChartData} 
              options={getChartOptions('Unit Price Range (Sales Value)')}
            />
          </div>
        </div>
      </div>

      <div className="chart-card" style={{ marginBottom: '30px' }}>
        <div className="chart-header">
          <h3>Price per Square Meter Range</h3>
          <button 
            className="chart-btn chart-expand-btn" 
            onClick={() => openChartModal('PSM (EGP/sqm)', psmChartData)}
            title="Expand chart"
          >
            ⛶
          </button>
        </div>
        <div className={psmChartData.labels.length > 2 ? 'chart-scroll-wrapper candlestick-wrapper-scroll' : 'candlestick-wrapper-no-scroll'}>
          <div 
            className="candlestick-chart-container" 
            style={{ 
              height: '350px', 
              padding: '10px',
              minWidth: psmChartData.labels.length > 2 ? '800px' : 'auto'
            }}
          >
            <Bar 
              key="psm-chart"
              data={psmChartData} 
              options={getChartOptions('PSM (EGP/sqm)')}
            />
          </div>
        </div>
      </div>

      <div className="chart-card" style={{ marginBottom: '30px' }}>
        <div className="chart-header">
          <h3>Sellable Area Range</h3>
          <button 
            className="chart-btn chart-expand-btn" 
            onClick={() => openChartModal('Area (sqm)', areaChartData)}
            title="Expand chart"
          >
            ⛶
          </button>
        </div>
        <div className={areaChartData.labels.length > 2 ? 'chart-scroll-wrapper candlestick-wrapper-scroll' : 'candlestick-wrapper-no-scroll'}>
          <div 
            className="candlestick-chart-container" 
            style={{ 
              height: '350px', 
              padding: '10px',
              minWidth: areaChartData.labels.length > 2 ? '800px' : 'auto'
            }}
          >
            <Bar 
              key="area-chart"
              data={areaChartData} 
              options={getChartOptions('Area (sqm)')}
            />
          </div>
        </div>
      </div>

      {/* Chart Modal for Fullscreen View */}
      <ChartModal
        isOpen={chartModalOpen}
        onClose={() => setChartModalOpen(false)}
        title={chartModalTitle}
      >
        {chartModalData && (
          <div style={{ height: '75vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bar data={chartModalData} options={getChartOptions(chartModalTitle)} />
          </div>
        )}
      </ChartModal>
    </div>
  );
};

export default UnitMetricsCharts;
