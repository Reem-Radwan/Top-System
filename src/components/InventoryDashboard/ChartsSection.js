
import React, { useState, useMemo } from 'react';
// Version: Updated with gradient fills - Jan 14, 2026
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

import { Pie, Bar, Line } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import UnitsModal from './UnitsModal';
import ChartModal from './Chartmodal';

// Register Chart.js components ONCE at module level
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const ChartsSection = ({ units, allUnits, filters, onDateRangeChange, onFilterChange }) => {
  const [salesPeriod, setSalesPeriod] = useState('annually');
  const [deliveryPeriod, setDeliveryPeriod] = useState('quarterly');
  const [salesDateRange, setSalesDateRange] = useState({ start: '', end: '' });
  const [deliveryDateRange, setDeliveryDateRange] = useState({ start: '', end: '' });

  // Modal state for Delivery Compliance
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUnits, setModalUnits] = useState([]);
  const [modalTitle, setModalTitle] = useState('');

  // Chart modal states
  const [chartModalOpen, setChartModalOpen] = useState(false);
  const [chartModalTitle, setChartModalTitle] = useState('');
  const [chartModalData, setChartModalData] = useState(null);
  const [chartModalType, setChartModalType] = useState('pie');

  // Open chart in modal
  const openChartModal = (title, data, type) => {
    setChartModalTitle(title);
    setChartModalData(data);
    setChartModalType(type);
    setChartModalOpen(true);
  };

  // Pie options for modal - uses dataset.salesByLabel
  const modalPieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { boxWidth: 12, padding: 15 }
      },
      datalabels: {
        color: '#fff',
        font: { weight: 'bold', size: 11 },
        formatter: (val, ctx) => {
          const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
          const pct = total ? ((val / total) * 100).toFixed(1) : '0.0';
          return Number(pct) > 5 ? `${pct}%` : '';
        }
      },
      tooltip: {
        callbacks: {
          title: (context) => context[0].label,
          label: (context) => {
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total ? ((value / total) * 100).toFixed(2) : '0.00';

            const label = context.label;

            // ✅ read from dataset (reliable in modal)
            const salesMap = context.dataset.salesByLabel || {};
            const totalSalesValue = salesMap[label] || 0;

            return [
              `Number of Units: ${value}`,
              `Total Sales Value: EGP ${Number(totalSalesValue).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
              `% of Total Inventory: ${percentage}%`
            ];
          },
          footer: (context) => `${context[0].label}: ${context[0].parsed} units`
        }
      }
    }
  };

  // Click-to-filter handler
  const handleChartClick = (filterType, value) => {
    if (!onFilterChange) return;

    const currentValues = filters[filterType] || [];

    // If this value is the only one selected, select all (clear filter)
    if (currentValues.length === 1 && currentValues[0] === value) {
      const allValues = [...new Set(allUnits.map(u => {
        switch (filterType) {
          case 'statuses': return u.status;
          case 'unitTypes': return u.unit_type;
          case 'contractPaymentPlans': return u.adj_contract_payment_plan;
          default: return null;
        }
      }).filter(Boolean))];

      onFilterChange(filterType, allValues);
    } else {
      onFilterChange(filterType, [value]);
    }
  };

  // Handle Delivery Compliance chart click - show modal
  const handleDeliveryComplianceClick = (event, elements, chart) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const label = chart.data.labels[index];

      const categorizedUnits = [];

      units.forEach(unit => {
        if (!unit.contract_delivery_date || !unit.development_delivery_date) return;

        try {
          const contractDate = new Date(unit.contract_delivery_date);
          const developmentDate = new Date(unit.development_delivery_date);

          if (isNaN(contractDate.getTime()) || isNaN(developmentDate.getTime())) return;

          const adjustedContractDate = new Date(contractDate);
          adjustedContractDate.setMonth(adjustedContractDate.getMonth() + (parseInt(unit.grace_period_months) || 0));

          const isOnTime = adjustedContractDate >= developmentDate;

          if ((label.includes('On Time') && isOnTime) || (label.includes('Delayed') && !isOnTime)) {
            categorizedUnits.push(unit);
          }
        } catch (error) {
          console.warn('Error categorizing unit:', unit);
        }
      });

      const countMatch = label.match(/\((\d+)\)/);
      const count = countMatch ? countMatch[1] : categorizedUnits.length;

      setModalUnits(categorizedUnits);
      setModalTitle(label.replace(/\s*\(\d+\)/, '') + ` (${count})`);
      setModalOpen(true);
    }
  };

  // Chart colors
  const statusColors = {
    'Available': '#5B9BD5',
    'Unreleased': '#ED7D31',
    'Blocked Development': '#A5A5A5',
    'Reserved': '#FFC000',
    'Contracted': '#70AD47',
    'Partner': '#000000',
    'Hold': '#fff000'
  };

  // Helper functions
  const groupByStatus = (unitsData) => {
    const grouped = {};
    unitsData.forEach(unit => {
      const status = unit.status || 'Unknown';
      if (status !== 'Unknown') grouped[status] = (grouped[status] || 0) + 1;
    });
    return grouped;
  };

  const groupByUnitType = (unitsData) => {
    const grouped = {};
    unitsData.forEach(unit => {
      const type = unit.unit_type || 'Unknown';
      if (type !== 'Unknown') grouped[type] = (grouped[type] || 0) + 1;
    });
    return grouped;
  };

  const groupByPaymentPlan = (unitsData) => {
    const grouped = {};
    unitsData.forEach(unit => {
      const plan = unit.adj_contract_payment_plan || 'Unknown';
      if (plan !== 'Unknown') grouped[plan] = (grouped[plan] || 0) + 1;
    });
    return grouped;
  };

  // ✅ Inventory chart data (salesByLabel moved into dataset)
  const inventoryChartData = useMemo(() => {
    const statusCounts = groupByStatus(units);
    const labels = Object.keys(statusCounts);
    const data = Object.values(statusCounts);
    const backgroundColors = labels.map(label => statusColors[label] || '#CCCCCC');

    const salesByLabel = {};
    allUnits.forEach(unit => {
      const status = unit.status || 'Unknown';
      if (status !== 'Unknown') {
        salesByLabel[status] = (salesByLabel[status] || 0) + (parseFloat(unit.sales_value) || 0);
      }
    });

    return {
      labels,
      datasets: [{
        data,
        backgroundColor: backgroundColors,
        borderWidth: 2,
        borderColor: '#fff',
        salesByLabel // ✅ here
      }]
    };
  }, [units, allUnits]);

  // ✅ Unit type chart data (salesByLabel moved into dataset)
  const unitModelChartData = useMemo(() => {
    const typeCounts = groupByUnitType(units);
    const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

    const salesByLabel = {};
    allUnits.forEach(unit => {
      const type = unit.unit_type || 'Unknown';
      if (type !== 'Unknown') {
        salesByLabel[type] = (salesByLabel[type] || 0) + (parseFloat(unit.sales_value) || 0);
      }
    });

    return {
      labels: Object.keys(typeCounts),
      datasets: [{
        data: Object.values(typeCounts),
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#fff',
        salesByLabel // ✅ here
      }]
    };
  }, [units, allUnits]);

  const paymentPlanChartData = useMemo(() => {
    const planCounts = groupByPaymentPlan(units);
    const sortedEntries = Object.entries(planCounts).sort((a, b) => {
      if (a[0].toLowerCase().includes('cash')) return -1;
      if (b[0].toLowerCase().includes('cash')) return 1;
      return a[0].localeCompare(b[0], undefined, { numeric: true });
    });

    return {
      labels: sortedEntries.map(e => e[0]),
      datasets: [{
        label: 'Number of Units',
        data: sortedEntries.map(e => e[1]),
        backgroundColor: 'rgba(210, 105, 30, 0.6)',
        borderColor: 'rgba(210, 105, 30, 1)',
        borderWidth: 1
      }]
    };
  }, [units]);

  const salesTrendChartData = useMemo(() => {
    const contractedUnits = units.filter(u => u.status === 'Contracted');
    const grouped = {};

    contractedUnits.forEach(unit => {
      if (!unit.reservation_date) return;
      const date = new Date(unit.reservation_date);
      if (isNaN(date.getTime())) return;

      let key, label;
      switch (salesPeriod) {
        case 'monthly':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          label = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
          break;
        case 'quarterly': {
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          key = `${date.getFullYear()}-Q${quarter}`;
          label = `Q${quarter} ${date.getFullYear()}`;
          break;
        }
        default:
          key = `${date.getFullYear()}`;
          label = `${date.getFullYear()}`;
      }

      if (!grouped[key]) grouped[key] = { sales: 0, label };
      grouped[key].sales += parseFloat(unit.sales_value) || 0;
    });

    const sorted = Object.keys(grouped).sort().map(key => ({
      label: grouped[key].label,
      sales: grouped[key].sales
    }));

    return {
      labels: sorted.map(s => s.label),
      datasets: [{
        label: 'Sales Value',
        data: sorted.map(s => s.sales),
        borderColor: '#FF6B35',
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return 'rgba(255, 107, 53, 0.3)';

          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, 'rgba(255, 107, 53, 0.1)');
          gradient.addColorStop(0.5, 'rgba(255, 107, 53, 0.25)');
          gradient.addColorStop(1, 'rgba(255, 107, 53, 0.4)');
          return gradient;
        },
        tension: 0.4,
        fill: true,
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#FF6B35',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    };
  }, [units, salesPeriod]);

  const deliveryProgressChartData = useMemo(() => {
    const grouped = {};

    units.forEach(unit => {
      if (!unit.development_delivery_date) return;
      const date = new Date(unit.development_delivery_date);
      if (isNaN(date.getTime())) return;

      let key, label;
      switch (deliveryPeriod) {
        case 'monthly':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          label = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
          break;
        case 'quarterly': {
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          key = `${date.getFullYear()}-Q${quarter}`;
          label = `Q${quarter} ${date.getFullYear()}`;
          break;
        }
        default:
          key = `${date.getFullYear()}`;
          label = `${date.getFullYear()}`;
      }

      if (!grouped[key]) grouped[key] = { count: 0, label };
      grouped[key].count += 1;
    });

    const sorted = Object.keys(grouped).sort().map(key => ({
      label: grouped[key].label,
      count: grouped[key].count
    }));

    return {
      labels: sorted.map(s => s.label),
      datasets: [{
        label: 'Number of Deliveries',
        data: sorted.map(s => s.count),
        borderColor: '#FF6B35',
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return 'rgba(255, 107, 53, 0.3)';

          const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
          gradient.addColorStop(0, 'rgba(255, 107, 53, 0.1)');
          gradient.addColorStop(0.5, 'rgba(255, 107, 53, 0.25)');
          gradient.addColorStop(1, 'rgba(255, 107, 53, 0.4)');
          return gradient;
        },
        tension: 0.4,
        fill: true,
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#FF6B35',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    };
  }, [units, deliveryPeriod]);

  const deliveryComplianceChartData = useMemo(() => {
    let onTime = 0, delayed = 0;

    units.forEach(unit => {
      if (!unit.contract_delivery_date || !unit.development_delivery_date) return;
      try {
        const contractDate = new Date(unit.contract_delivery_date);
        const developmentDate = new Date(unit.development_delivery_date);
        if (isNaN(contractDate.getTime()) || isNaN(developmentDate.getTime())) return;

        const adjusted = new Date(contractDate);
        adjusted.setMonth(adjusted.getMonth() + (parseInt(unit.grace_period_months) || 0));

        if (adjusted >= developmentDate) onTime++;
        else delayed++;
      } catch (e) {}
    });

    return {
      labels: [`On Time (${onTime})`, `Delayed (${delayed})`],
      datasets: [{
        data: [onTime, delayed],
        backgroundColor: ['#28a745', '#dc3545'],
        borderWidth: 2,
        borderColor: '#fff'
      }]
    };
  }, [units]);

  // Chart options
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: (event, elements, chart) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const label = chart.data.labels[index];

        if (chart.canvas.id === 'inventory-chart') {
          handleChartClick('statuses', label);
        } else if (chart.canvas.id === 'unit-type-chart') {
          handleChartClick('unitTypes', label);
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: { boxWidth: 12, padding: 15 },
        onClick: (e, legendItem, legend) => {
          const label = legendItem.text;
          if (legend.chart.canvas.id === 'inventory-chart') {
            handleChartClick('statuses', label);
          } else if (legend.chart.canvas.id === 'unit-type-chart') {
            handleChartClick('unitTypes', label);
          }
        }
      },
      datalabels: {
        color: '#fff',
        font: { weight: 'bold', size: 11 },
        formatter: (val, ctx) => {
          const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
          const pct = total ? ((val / total) * 100).toFixed(1) : '0.0';
          return Number(pct) > 5 ? `${pct}%` : '';
        }
      },
      tooltip: {
        callbacks: {
          title: (context) => context[0].label,
          label: (context) => {
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total ? ((value / total) * 100).toFixed(2) : '0.00';

            const label = context.label;
            let totalSalesValue = 0;

            // your original (non-modal) tooltip logic:
            if (context.chart.canvas.id === 'inventory-chart') {
              totalSalesValue = allUnits
                .filter(u => u.status === label)
                .reduce((sum, u) => sum + (parseFloat(u.sales_value) || 0), 0);
            } else if (context.chart.canvas.id === 'unit-type-chart') {
              totalSalesValue = allUnits
                .filter(u => u.unit_type === label)
                .reduce((sum, u) => sum + (parseFloat(u.sales_value) || 0), 0);
            }

            return [
              `Number of Units: ${value}`,
              `Total Sales Value: EGP ${Number(totalSalesValue).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
              `% of Total Inventory: ${percentage}%`
            ];
          },
          footer: (context) => `${context[0].label}: ${context[0].parsed} units`
        }
      }
    }
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: (event, elements, chart) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const label = chart.data.labels[index];
        handleChartClick('contractPaymentPlans', label);
      }
    },
    plugins: {
      legend: { display: false },
      datalabels: {
        anchor: 'end',
        align: 'top',
        color: '#444',
        font: { weight: 'bold', size: 11 }
      },
      tooltip: {
        callbacks: {
          title: (context) => context[0].label,
          label: (context) => {
            const value = context.parsed.y;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = total ? ((value / total) * 100).toFixed(1) : '0.0';

            return [
              `Number of Units: ${value}`,
              `Percentage: ${percentage}%`
            ];
          },
          footer: () => '💡 Click to filter'
        }
      }
    },
    scales: { y: { beginAtZero: true } }
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      datalabels: { display: false }
    },
    scales: { y: { beginAtZero: true } }
  };

  // Separate options for Delivery Compliance (with modal instead of filter)
  const deliveryCompliancePieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    onClick: handleDeliveryComplianceClick,
    plugins: {
      legend: {
        position: 'bottom',
        labels: { boxWidth: 12, padding: 15 },
        onClick: (e, legendItem, legend) => {
          const chart = legend.chart;
          const index = legendItem.index;
          handleDeliveryComplianceClick(null, [{ index }], chart);
        }
      },
      datalabels: {
        color: '#fff',
        font: { weight: 'bold', size: 11 },
        formatter: (val, ctx) => {
          const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
          const pct = total ? ((val / total) * 100).toFixed(1) : '0.0';
          return Number(pct) > 5 ? `${pct}%` : '';
        }
      },
      tooltip: {
        callbacks: {
          footer: () => '💡 Click to see details'
        }
      }
    }
  };

  return (
    <>
      <div className="chart-container" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        <div className="chart-card">
          <div className="chart-header">
            <h3>Inventory Status</h3>
            <button
              className="chart-btn chart-expand-btn"
              onClick={() => openChartModal('Inventory Status', inventoryChartData, 'pie')}
              title="Expand chart"
            >
              ⛶
            </button>
          </div>
          <div style={{ height: '250px' }}>
            <Pie id="inventory-chart" data={inventoryChartData} options={pieOptions} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Unit Type Distribution</h3>
            <button
              className="chart-btn chart-expand-btn"
              onClick={() => openChartModal('Unit Type Distribution', unitModelChartData, 'pie')}
              title="Expand chart"
            >
              ⛶
            </button>
          </div>
          <div style={{ height: '250px' }}>
            <Pie id="unit-type-chart" data={unitModelChartData} options={pieOptions} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Contract Payment Plan</h3>
            <button
              className="chart-btn chart-expand-btn"
              onClick={() => openChartModal('Contract Payment Plan', paymentPlanChartData, 'bar')}
              title="Expand chart"
            >
              ⛶
            </button>
          </div>
          <div style={{ height: '250px' }}>
            <Bar id="payment-plan-chart" data={paymentPlanChartData} options={barOptions} />
          </div>
        </div>
      </div>

      <div className="chart-container" style={{ gridTemplateColumns: '1fr' }}>
        <div className="chart-card">
          <div className="chart-header">
            <h3>Sales Trend</h3>
            <button
              className="chart-btn chart-expand-btn"
              onClick={() => openChartModal('Sales Trend', salesTrendChartData, 'line')}
              title="Expand chart"
            >
              ⛶
            </button>
          </div>

          <div className="chart-scroll-wrapper">
            <div style={{ height: '220px', minWidth: '600px' }}>
              <Line data={salesTrendChartData} options={lineOptions} />
            </div>
          </div>

          <div className="chart-controls-wrapper">
            <div className="date-range-controls compact">
              <label>From:</label>
              <input
                type="date"
                value={salesDateRange.start}
                onChange={(e) => setSalesDateRange({ ...salesDateRange, start: e.target.value })}
              />
              <label>To:</label>
              <input
                type="date"
                value={salesDateRange.end}
                onChange={(e) => setSalesDateRange({ ...salesDateRange, end: e.target.value })}
              />
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  const start = salesDateRange.start ? new Date(salesDateRange.start) : null;
                  const end = salesDateRange.end ? new Date(salesDateRange.end) : null;
                  onDateRangeChange('salesDateRange', start, end);
                }}
              >
                Apply
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setSalesDateRange({ start: '', end: '' });
                  onDateRangeChange('salesDateRange', null, null);
                }}
              >
                Clear
              </button>
            </div>

            <div className="period-selector compact">
              <button
                className={`period-btn ${salesPeriod === 'monthly' ? 'active' : ''}`}
                onClick={() => setSalesPeriod('monthly')}
              >
                Monthly
              </button>
              <button
                className={`period-btn ${salesPeriod === 'quarterly' ? 'active' : ''}`}
                onClick={() => setSalesPeriod('quarterly')}
              >
                Quarterly
              </button>
              <button
                className={`period-btn ${salesPeriod === 'annually' ? 'active' : ''}`}
                onClick={() => setSalesPeriod('annually')}
              >
                Annually
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Analysis and Compliance */}
      <div className="chart-container" style={{ gridTemplateColumns: '1fr' }}>
        <div className="chart-card">
          <div className="wide-section-scroll">
            <div className="delivery-section">
              {/* Delivery Analysis - Left side (70%) */}
              <div className="delivery-analysis" style={{ minWidth: 0 }}>
                <div className="chart-header">
                  <h3>Delivery Analysis</h3>
                  <button
                    className="chart-btn chart-expand-btn"
                    onClick={() => openChartModal('Delivery Analysis', deliveryProgressChartData, 'line')}
                    title="Expand chart"
                  >
                    ⛶
                  </button>
                </div>

                <div className="chart-scroll-wrapper">
                  <div style={{ height: '220px', minWidth: '600px' }}>
                    <Line data={deliveryProgressChartData} options={lineOptions} />
                  </div>
                </div>

                <div className="chart-controls-wrapper">
                  <div className="date-range-controls compact">
                    <label>From:</label>
                    <input
                      type="date"
                      value={deliveryDateRange.start}
                      onChange={(e) => setDeliveryDateRange({ ...deliveryDateRange, start: e.target.value })}
                    />
                    <label>To:</label>
                    <input
                      type="date"
                      value={deliveryDateRange.end}
                      onChange={(e) => setDeliveryDateRange({ ...deliveryDateRange, end: e.target.value })}
                    />
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        const start = deliveryDateRange.start ? new Date(deliveryDateRange.start) : null;
                        const end = deliveryDateRange.end ? new Date(deliveryDateRange.end) : null;
                        onDateRangeChange('deliveryDateRange', start, end);
                      }}
                    >
                      Apply
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => {
                        setDeliveryDateRange({ start: '', end: '' });
                        onDateRangeChange('deliveryDateRange', null, null);
                      }}
                    >
                      Clear
                    </button>
                  </div>

                  <div className="period-selector compact">
                    <button
                      className={`period-btn ${deliveryPeriod === 'monthly' ? 'active' : ''}`}
                      onClick={() => setDeliveryPeriod('monthly')}
                    >
                      Monthly
                    </button>
                    <button
                      className={`period-btn ${deliveryPeriod === 'quarterly' ? 'active' : ''}`}
                      onClick={() => setDeliveryPeriod('quarterly')}
                    >
                      Quarterly
                    </button>
                    <button
                      className={`period-btn ${deliveryPeriod === 'annually' ? 'active' : ''}`}
                      onClick={() => setDeliveryPeriod('annually')}
                    >
                      Annually
                    </button>
                  </div>
                </div>
              </div>

              {/* Delivery Compliance - Right side (30%) */}
              <div className="delivery-compliance" style={{ minWidth: 0 }}>
                <div className="chart-header">
                  <h3>Delivery Compliance</h3>
                  <button
                    className="chart-btn chart-expand-btn"
                    onClick={() => openChartModal('Delivery Compliance', deliveryComplianceChartData, 'pie')}
                    title="Expand chart"
                  >
                    ⛶
                  </button>
                </div>
                <div style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Pie data={deliveryComplianceChartData} options={deliveryCompliancePieOptions} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Units Modal */}
      <UnitsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        units={modalUnits}
        title={modalTitle}
      />

      {/* Chart Modal for Fullscreen View */}
      <ChartModal
        isOpen={chartModalOpen}
        onClose={() => setChartModalOpen(false)}
        title={chartModalTitle}
      >
        {chartModalData && (
          <div style={{ height: '75vh', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {chartModalType === 'pie' && <Pie data={chartModalData} options={modalPieOptions} />}
            {chartModalType === 'bar' && <Bar data={chartModalData} options={barOptions} />}
            {chartModalType === 'line' && <Line data={chartModalData} options={lineOptions} />}
          </div>
        )}
      </ChartModal>
    </>
  );
};

export default ChartsSection;
