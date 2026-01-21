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
//   const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme'));

//   // Listen for theme changes
//   React.useEffect(() => {
//     const observer = new MutationObserver((mutations) => {
//       mutations.forEach((mutation) => {
//         if (mutation.attributeName === 'data-theme') {
//           setTheme(document.documentElement.getAttribute('data-theme'));
//         }
//       });
//     });

//     observer.observe(document.documentElement, {
//       attributes: true,
//       attributeFilter: ['data-theme']
//     });

//     return () => observer.disconnect();
//   }, []);

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

//   // Get current theme color for chart text
//   const getTextColor = () => {
//     const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
//     return isDark ? '#F1F5F9' : '#1E293B';
//   };

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
//         xAlign: (context) => {
//           // Dynamic X positioning based on data value position
//           const chart = context.chart;
//           const tooltip = context.tooltip;

//           if (!tooltip || !chart) return 'center';

//           // Get chart area
//           const chartArea = chart.chartArea;
//           const mouseY = tooltip.caretY;

//           // If hovering near top 40% of chart (high values), show tooltip to the right
//           if (mouseY < chartArea.top + (chartArea.height * 0.4)) {
//             return 'left';  // Tooltip to the right of cursor
//           } else {
//             return 'center';  // Tooltip centered
//           }
//         },
//         yAlign: (context) => {
//           // Keep tooltip at same vertical level
//           const chart = context.chart;
//           const tooltip = context.tooltip;

//           if (!tooltip || !chart) return 'center';

//           const chartArea = chart.chartArea;
//           const mouseY = tooltip.caretY;

//           // If hovering near top 40%, keep it centered vertically
//           if (mouseY < chartArea.top + (chartArea.height * 0.4)) {
//             return 'center';  // Centered vertically when on right
//           } else {
//             return 'bottom';  // Above cursor for normal values
//           }
//         },
//         caretSize: 4,
//         caretPadding: 22,
//         callbacks: {
//           title: () => '',  // Remove title (unit name)
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
//           color: getTextColor(),  // Dynamic color based on theme
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
//           color: getTextColor(),  // Dynamic color based on theme
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
//           color: getTextColor(),  // Dynamic color based on theme
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
//         <div className={priceChartData.labels.length > 2 ? 'chart-scroll-wrapper candlestick-wrapper-scroll' : 'candlestick-wrapper-no-scroll'}>
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



import React, { useMemo, useState } from "react";
// Version: Updated tooltip position - Jan 14, 2026
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartModal from "../ChartsModal/Chartmodal";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Enhanced candlestick plugin - values attached to line ends
const candlestickPlugin = {
  id: "candlestickPlugin",
  afterDatasetsDraw(chart) {
    const ctx = chart.ctx;
    const meta = chart.getDatasetMeta(0);

    if (
      !meta ||
      !meta.data ||
      !chart.data.datasets ||
      !chart.data.datasets[0]
    ) {
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

      // Draw thick vertical line from min to max
      ctx.save();
      ctx.strokeStyle = "#D2691E";
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

    if (
      !meta ||
      !meta.data ||
      !chart.data.datasets ||
      !chart.data.datasets[0]
    ) {
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

      // Check current theme for colors
      const isDark =
        document.documentElement.getAttribute("data-theme") === "dark";
      const textColor = isDark ? "#fff" : "#000";
      const bgColor = isDark ? "rgba(30, 41, 59, 0.9)" : "#fff";
      const borderColor = isDark ? "#fff" : "#000";

      // Format numbers with commas
      const formatValue = (val) => {
        return Math.round(val).toLocaleString("en-US");
      };

      ctx.save();
      ctx.textAlign = "center";
      ctx.font = "bold 10px Arial";

      // MAX value label - ATTACHED TO TOP OF LINE
      const maxText = formatValue(max);
      const maxPadding = 8;
      const maxMetrics = ctx.measureText(maxText);
      const maxBoxWidth = maxMetrics.width + maxPadding * 2;
      const maxBoxHeight = 20;
      const maxBoxX = x - maxBoxWidth / 2;
      const maxBoxY = maxY - maxBoxHeight; // Attached directly to line top

      // Background (white in light mode, dark in dark mode)
      ctx.fillStyle = bgColor;
      ctx.fillRect(maxBoxX, maxBoxY, maxBoxWidth, maxBoxHeight);

      // Border (black in light mode, white in dark mode)
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(maxBoxX, maxBoxY, maxBoxWidth, maxBoxHeight);

      // Text (black in light mode, white in dark mode)
      ctx.fillStyle = textColor;
      ctx.fillText(maxText, x, maxBoxY + 13);

      // AVERAGE value label (white text on orange background)
      const avgText = formatValue(avg);
      const avgPadding = 8;
      const avgMetrics = ctx.measureText(avgText);
      const avgBoxWidth = avgMetrics.width + avgPadding * 2;
      const avgBoxHeight = 20;
      const avgBoxX = x - avgBoxWidth / 2;
      const avgBoxY = avgY - avgBoxHeight / 2;

      // Orange background (same in both modes)
      ctx.fillStyle = "#FF6B35";
      ctx.fillRect(avgBoxX, avgBoxY, avgBoxWidth, avgBoxHeight);

      // White text (same in both modes)
      ctx.fillStyle = "#fff";
      ctx.fillText(avgText, x, avgBoxY + 13);

      // MIN value label - ATTACHED TO BOTTOM OF LINE
      const minText = formatValue(min);
      const minPadding = 8;
      const minMetrics = ctx.measureText(minText);
      const minBoxWidth = minMetrics.width + minPadding * 2;
      const minBoxHeight = 20;
      const minBoxX = x - minBoxWidth / 2;
      const minBoxY = minY; // Attached directly to line bottom

      // Background (white in light mode, dark in dark mode)
      ctx.fillStyle = bgColor;
      ctx.fillRect(minBoxX, minBoxY, minBoxWidth, minBoxHeight);

      // Border (black in light mode, white in dark mode)
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(minBoxX, minBoxY, minBoxWidth, minBoxHeight);

      // Text (black in light mode, white in dark mode)
      ctx.fillStyle = textColor;
      ctx.fillText(minText, x, minBoxY + 13);

      ctx.restore();
    });
  },
};

ChartJS.register(candlestickPlugin);

const UnitMetricsCharts = ({ units }) => {
  // Chart modal states
  const [chartModalOpen, setChartModalOpen] = useState(false);
  const [chartModalTitle, setChartModalTitle] = useState("");
  const [chartModalData, setChartModalData] = useState(null);
  const [theme, setTheme] = useState(
    document.documentElement.getAttribute("data-theme"),
  );

  // Listen for theme changes
  React.useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "data-theme") {
          setTheme(document.documentElement.getAttribute("data-theme"));
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  // Open chart in modal
  const openChartModal = (title, data) => {
    setChartModalTitle(title);
    setChartModalData(data);
    setChartModalOpen(true);
  };

  // Helper function to aggregate data by unit type
  const aggregateByUnitType = (valueField) => {
    const grouped = {};

    units.forEach((unit) => {
      const unitType = unit.unit_type || "Unknown";
      const value = parseFloat(unit[valueField]);

      if (!isNaN(value) && unitType !== "Unknown" && value > 0) {
        if (!grouped[unitType]) {
          grouped[unitType] = [];
        }
        grouped[unitType].push(value);
      }
    });

    const result = {
      labels: [],
      dataPoints: [],
    };

    // Sort by unit type name
    Object.keys(grouped)
      .sort()
      .forEach((label) => {
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
  };

  // Memoized chart data
  const priceChartData = useMemo(() => {
    const data = aggregateByUnitType("sales_value");

    // Calculate global max for proper Y-axis scaling
    const globalMax = Math.max(...data.dataPoints.map((d) => d.max));

    return {
      labels: data.labels,
      datasets: [
        {
          label: "Price Range",
          data: data.dataPoints.map((d) => d.max), // Use max for Y-axis scaling
          backgroundColor: "transparent",
          borderColor: "transparent",
          borderWidth: 0,
          barThickness: 50,
          minMax: data.dataPoints,
        },
      ],
    };
  }, [units]);

  const psmChartData = useMemo(() => {
    const data = aggregateByUnitType("psm");

    // Calculate global max for proper Y-axis scaling
    const globalMax = Math.max(...data.dataPoints.map((d) => d.max));

    return {
      labels: data.labels,
      datasets: [
        {
          label: "PSM Range",
          data: data.dataPoints.map((d) => d.max), // Use max for Y-axis scaling
          backgroundColor: "transparent",
          borderColor: "transparent",
          borderWidth: 0,
          barThickness: 50,
          minMax: data.dataPoints,
        },
      ],
    };
  }, [units]);

  const areaChartData = useMemo(() => {
    const data = aggregateByUnitType("sellable_area");

    // Calculate global max for proper Y-axis scaling
    const globalMax = Math.max(...data.dataPoints.map((d) => d.max));

    return {
      labels: data.labels,
      datasets: [
        {
          label: "Area Range (sqm)",
          data: data.dataPoints.map((d) => d.max), // Use max for Y-axis scaling
          backgroundColor: "transparent",
          borderColor: "transparent",
          borderWidth: 0,
          barThickness: 50,
          minMax: data.dataPoints,
        },
      ],
    };
  }, [units]);

  // Get current theme color for chart text
  const getTextColor = () => {
    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    return isDark ? "#F1F5F9" : "#1E293B";
  };

  // Chart options
  const getChartOptions = (yAxisLabel) => ({
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 40,
        bottom: 40,
        left: 15,
        right: 15,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: false, // Hide the gray max value on bars
      },
      tooltip: {
        enabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        padding: 10,
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#FF6B35",
        borderWidth: 1,
        cornerRadius: 4,
        displayColors: false,
        titleFont: {
          size: 9,
          weight: "bold",
        },
        bodyFont: {
          size: 10,
        },
        bodySpacing: 2,
        xAlign: (context) => {
          // Dynamic X positioning based on data value position
          const chart = context.chart;
          const tooltip = context.tooltip;

          if (!tooltip || !chart) return "center";

          // Get chart area
          const chartArea = chart.chartArea;
          const mouseY = tooltip.caretY;

          // If hovering near top 40% of chart (high values), show tooltip to the right
          if (mouseY < chartArea.top + chartArea.height * 0.4) {
            return "left"; // Tooltip to the right of cursor
          } else {
            return "center"; // Tooltip centered
          }
        },
        yAlign: (context) => {
          // Keep tooltip at same vertical level
          const chart = context.chart;
          const tooltip = context.tooltip;

          if (!tooltip || !chart) return "center";

          const chartArea = chart.chartArea;
          const mouseY = tooltip.caretY;

          // If hovering near top 40%, keep it centered vertically
          if (mouseY < chartArea.top + chartArea.height * 0.4) {
            return "center"; // Centered vertically when on right
          } else {
            return "bottom"; // Above cursor for normal values
          }
        },
        caretSize: 4,
        caretPadding: 22,
        callbacks: {
          title: () => "", // Remove title (unit name)
          label: (context) => {
            const dataset = context.dataset;
            const index = context.dataIndex;
            const dataPoint = dataset.minMax[index];

            // Smart number formatting based on value size
            const formatValue = (val) => {
              if (val >= 1000000) {
                return `${(val / 1000000).toFixed(1)}M`;
              } else if (val >= 1000) {
                return `${(val / 1000).toFixed(1)}K`;
              } else {
                return val.toFixed(0);
              }
            };

            return [
              `Max: ${formatValue(dataPoint.max)}`,
              `Avg: ${formatValue(dataPoint.avg)}`,
              `Min: ${formatValue(dataPoint.min)}`,
              `Units: ${dataPoint.count}`,
            ];
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: yAxisLabel,
          color: getTextColor(), // Dynamic color based on theme
          font: {
            size: 12,
            weight: "bold",
          },
        },
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          drawBorder: true,
          borderColor: "#ccc",
        },
        ticks: {
          color: getTextColor(), // Dynamic color based on theme
          callback: (value) => {
            // Format Y-axis with commas
            return Math.round(value).toLocaleString("en-US");
          },
          font: {
            size: 10,
          },
        },
      },
      x: {
        grid: {
          display: false,
          drawBorder: true,
          borderColor: "#ccc",
        },
        ticks: {
          color: getTextColor(), // Dynamic color based on theme
          font: {
            size: 10,
          },
          maxRotation: 0,
          minRotation: 0,
        },
      },
    },
  });

  if (!units || units.length === 0) {
    return (
      <div className="unit-metrics-charts-container">
        <h2>Unit Metrics Overview</h2>
        <div className="chart-card">
          <p style={{ textAlign: "center", padding: "40px", color: "#666" }}>
            No data available. Please select filters to view unit metrics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="unit-metrics-charts-container">
      <div className="chart-card" style={{ marginBottom: "30px" }}>
        <div className="chart-header">
          <h3>Unit Price Range</h3>
          <button
            className="chart-btn chart-expand-btn"
            onClick={() =>
              openChartModal("Unit Price Range (Sales Value)", priceChartData)
            }
            title="Expand chart"
          >
            ⛶
          </button>
        </div>
        <div
          className={
            priceChartData.labels.length > 2
              ? "chart-scroll-wrapper candlestick-wrapper-scroll"
              : "candlestick-wrapper-no-scroll"
          }
        >
          <div
            className="candlestick-chart-container"
            style={{
              height: "350px",
              padding: "10px",
              minWidth: priceChartData.labels.length > 2 ? "800px" : "auto",
            }}
          >
            <Bar
              key="price-chart"
              data={priceChartData}
              options={getChartOptions("Unit Price Range (Sales Value)")}
            />
          </div>
        </div>
      </div>

      <div className="chart-card" style={{ marginBottom: "30px" }}>
        <div className="chart-header">
          <h3>Price per Square Meter Range</h3>
          <button
            className="chart-btn chart-expand-btn"
            onClick={() => openChartModal("PSM (EGP/sqm)", psmChartData)}
            title="Expand chart"
          >
            ⛶
          </button>
        </div>
        <div
          className={
            psmChartData.labels.length > 2
              ? "chart-scroll-wrapper candlestick-wrapper-scroll"
              : "candlestick-wrapper-no-scroll"
          }
        >
          <div
            className="candlestick-chart-container"
            style={{
              height: "350px",
              padding: "10px",
              minWidth: psmChartData.labels.length > 2 ? "800px" : "auto",
            }}
          >
            <Bar
              key="psm-chart"
              data={psmChartData}
              options={getChartOptions("PSM (EGP/sqm)")}
            />
          </div>
        </div>
      </div>

      <div className="chart-card" style={{ marginBottom: "30px" }}>
        <div className="chart-header">
          <h3>Sellable Area Range</h3>
          <button
            className="chart-btn chart-expand-btn"
            onClick={() => openChartModal("Area (sqm)", areaChartData)}
            title="Expand chart"
          >
            ⛶
          </button>
        </div>
        <div
          className={
            areaChartData.labels.length > 2
              ? "chart-scroll-wrapper candlestick-wrapper-scroll"
              : "candlestick-wrapper-no-scroll"
          }
        >
          <div
            className="candlestick-chart-container"
            style={{
              height: "350px",
              padding: "10px",
              minWidth: areaChartData.labels.length > 2 ? "800px" : "auto",
            }}
          >
            <Bar
              key="area-chart"
              data={areaChartData}
              options={getChartOptions("Area (sqm)")}
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
          <div
            style={{
              height: "75vh",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Bar
              data={chartModalData}
              options={getChartOptions(chartModalTitle)}
            />
          </div>
        )}
      </ChartModal>
    </div>
  );
};

export default UnitMetricsCharts;
