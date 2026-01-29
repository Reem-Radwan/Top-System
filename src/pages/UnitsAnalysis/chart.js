
import React, { useMemo, useState, useRef, useEffect } from 'react';

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const Chart = ({ title, data, filterInfo, valueFormatter, selectedFilters }) => {
  const [tooltip, setTooltip] = useState(null);
  const containerScrollRef = useRef(null);
  const tableRef = useRef(null);
  const chartRef = useRef(null);

  // Synchronized scrolling - one scrollbar controls both
  useEffect(() => {
    const containerScroll = containerScrollRef.current;
    const table = tableRef.current;
    const chart = chartRef.current;

    if (!containerScroll || !table || !chart) return;

    const syncScroll = () => {
      const scrollLeft = containerScroll.scrollLeft;
      if (table) table.scrollLeft = scrollLeft;
      if (chart) chart.scrollLeft = scrollLeft;
    };

    containerScroll.addEventListener('scroll', syncScroll);

    return () => {
      containerScroll.removeEventListener('scroll', syncScroll);
    };
  }, []);

  const { finishingSpans, flattenedColumns, maxValue } = useMemo(() => {
    const safeData = Array.isArray(data) ? data : [];

    const hierarchicalData = {};
    safeData.forEach(item => {
      const finishing = item.finishing || 'Unknown';
      const developer = item.developer || 'Unknown';
      const project = item.project || 'Unknown';
      const payment = item.payment || 'Unknown';

      hierarchicalData[finishing] ??= {};
      hierarchicalData[finishing][developer] ??= {};
      hierarchicalData[finishing][developer][project] ??= [];

      hierarchicalData[finishing][developer][project].push({
        payment,
        max: Number(item.max) || 0,
        avg: Number(item.avg) || 0,
        min: Number(item.min) || 0,
        fullData: item
      });
    });

    const finishingSpansLocal = [];
    const flattenedColumnsLocal = [];

    Object.keys(hierarchicalData).forEach(finishing => {
      let finishingColCount = 0;
      const developerSpans = [];

      Object.keys(hierarchicalData[finishing]).forEach(developer => {
        let developerColCount = 0;
        const projectSpans = [];

        Object.keys(hierarchicalData[finishing][developer]).forEach(project => {
          const payments = hierarchicalData[finishing][developer][project];

          payments.forEach(paymentData => {
            flattenedColumnsLocal.push({
              finishing,
              developer,
              project,
              payment: paymentData.payment,
              max: paymentData.max,
              avg: paymentData.avg,
              min: paymentData.min,
              fullData: paymentData.fullData
            });
            developerColCount++;
            finishingColCount++;
          });

          projectSpans.push({ label: project, span: payments.length });
        });

        developerSpans.push({ label: developer, span: developerColCount, projects: projectSpans });
      });

      finishingSpansLocal.push({ label: finishing, span: finishingColCount, developers: developerSpans });
    });

    const allValues = flattenedColumnsLocal.flatMap(c => [c.max, c.avg, c.min]);
    const maxValueLocal = Math.max(1, ...allValues);

    return { finishingSpans: finishingSpansLocal, flattenedColumns: flattenedColumnsLocal, maxValue: maxValueLocal };
  }, [data]);

  const TOOLTIP_W = 320;
  const TOOLTIP_H = 280;
  const PAD = 12;

  const setTooltipSmart = (event, item) => {
    // Use the specific location(s) from this data point, not the filter
    const location = item.fullData?.locations || item.fullData?.Location || item.fullData?.location || '—';
    
    // For asset type and unit type, still use filters if selected, otherwise show from data
    const assetType =
      selectedFilters?.assetType?.length ? selectedFilters.assetType.join(', ')
      : item.fullData?.['Asset Type'] || item.fullData?.assetType || '—';

    const unitType =
      selectedFilters?.unitType?.length ? selectedFilters.unitType.join(', ')
      : item.fullData?.['Unit Type'] || item.fullData?.unitType || '—';

    let x = event.clientX + 14;
    let y = event.clientY + 14;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    if (x + TOOLTIP_W + PAD > vw) x = vw - TOOLTIP_W - PAD;
    if (y + TOOLTIP_H + PAD > vh) y = vh - TOOLTIP_H - PAD;
    if (x < PAD) x = PAD;
    if (y < PAD) y = PAD;

    setTooltip({
      x,
      y,
      data: {
        finishing: item.finishing,
        developer: item.developer,
        project: item.project,
        payment: item.payment,
        min: item.min,
        avg: item.avg,
        max: item.max,
        location,
        assetType,
        unitType
      }
    });
  };

  const handleHoverEnter = (e, item) => setTooltipSmart(e, item);
  const handleHoverMove = (e, item) => setTooltipSmart(e, item);
  const handleHoverLeave = () => setTooltip(null);

  if (!data || data.length === 0) {
    return (
      <div className="chart-section">
        <div className="chart-header">
          <h3 className="chart-title">{title}</h3>
          {filterInfo && <div className="chart-filters-info">{filterInfo}</div>}
        </div>
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <div className="empty-state-text">No data available for the selected filters</div>
        </div>
      </div>
    );
  }

  const STACK_HEIGHT = 320;
  const RECT_H = 36;
  const RECT_HALF = RECT_H / 2;
  const TOP_PAD = 8;
  const BOTTOM_PAD = 8;

  const yFromValue = (value) => {
    const pct = clamp(value / maxValue, 0, 1);
    const usable = STACK_HEIGHT - TOP_PAD - BOTTOM_PAD;
    return TOP_PAD + (1 - pct) * usable;
  };

  // CRITICAL: Column width calculation
  const LABEL_COLUMN_WIDTH = 120; // Fixed width for label column - NEVER CHANGES
  const MIN_TOTAL_WIDTH = 1200; // Minimum total width for the entire container
  const BASE_COLUMN_WIDTH = 140; // Reduced from 180px to 140px for tighter fit
  
  const columnCount = flattenedColumns.length;
  
  // Calculate available space for data columns
  const availableSpaceForColumns = MIN_TOTAL_WIDTH - LABEL_COLUMN_WIDTH;
  
  // If we have few columns, expand them to fill the space
  // Otherwise use the base width and allow horizontal scroll
  let COLUMN_WIDTH;
  let totalWidth;
  
  if (columnCount * BASE_COLUMN_WIDTH < availableSpaceForColumns) {
    // Few columns: distribute the available space equally
    COLUMN_WIDTH = Math.floor(availableSpaceForColumns / columnCount);
    totalWidth = MIN_TOTAL_WIDTH;
  } else {
    // Many columns: use base width and enable scrolling
    COLUMN_WIDTH = BASE_COLUMN_WIDTH;
    totalWidth = LABEL_COLUMN_WIDTH + (columnCount * COLUMN_WIDTH);
  }

  return (
    <div className="chart-section">
      <div className="chart-header">
        <h3 className="chart-title">{title}</h3>
        {filterInfo && <div className="chart-filters-info">{filterInfo}</div>}
      </div>

      <div className="chart-content">
        {/* Container with single scrollbar */}
        <div className="chart-scroll-container" ref={containerScrollRef}>
          <div className="chart-scroll-content" style={{ width: `${totalWidth}px`, minWidth: `${totalWidth}px` }}>
            
            {/* X-AXIS TABLE - no scrollbar */}
            <div className="chart-table-wrapper-inner" ref={tableRef}>
              <div style={{ width: `${totalWidth}px`, minWidth: `${totalWidth}px` }}>
                <table className="chart-x-axis-table">
                  <colgroup>
                    <col style={{ width: '120px', minWidth: '120px', maxWidth: '120px' }} />
                    {flattenedColumns.map((_, idx) => (
                      <col key={`col-${idx}`} style={{ width: `${COLUMN_WIDTH}px`, minWidth: `${COLUMN_WIDTH}px`, maxWidth: `${COLUMN_WIDTH}px` }} />
                    ))}
                  </colgroup>
                  <thead>
                    <tr className="hierarchy-level-1">
                      <th className="fixed-label-column">Finishing</th>
                      {finishingSpans.map((finishing, idx) => (
                        <th 
                          key={`finishing-${idx}`} 
                          colSpan={finishing.span}
                        >
                          {finishing.label}
                        </th>
                      ))}
                    </tr>

                    <tr className="hierarchy-level-2">
                      <th className="fixed-label-column">Developer</th>
                      {finishingSpans.map((finishing, fIdx) =>
                        finishing.developers.map((developer, dIdx) => (
                          <th 
                            key={`dev-${fIdx}-${dIdx}`} 
                            colSpan={developer.span}
                          >
                            {developer.label}
                          </th>
                        ))
                      )}
                    </tr>

                    <tr className="hierarchy-level-3">
                      <th className="fixed-label-column">Project</th>
                      {finishingSpans.map((finishing, fIdx) =>
                        finishing.developers.map((developer, dIdx) =>
                          developer.projects.map((project, pIdx) => (
                            <th 
                              key={`proj-${fIdx}-${dIdx}-${pIdx}`} 
                              colSpan={project.span}
                            >
                              {project.label}
                            </th>
                          ))
                        )
                      )}
                    </tr>

                    <tr className="hierarchy-level-4">
                      <th className="fixed-label-column">Payment</th>
                      {flattenedColumns.map((col, idx) => (
                        <th 
                          key={`payment-${idx}`}
                        >
                          {col.payment}
                        </th>
                      ))}
                    </tr>
                  </thead>
                </table>
              </div>
            </div>

            {/* CHART VISUALIZATION - no scrollbar */}
            <div className="chart-visualization-wrapper-inner" ref={chartRef}>
              <div className="chart-visualization" style={{ width: `${totalWidth}px`, minWidth: `${totalWidth}px` }}>
                
                {/* Grid lines - positioned absolutely across entire width */}
                <div className="chart-grid-lines" style={{ position: 'absolute', top: '40px', left: '120px', right: 0, bottom: '40px' }}>
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="grid-line" style={{ top: `${i * 20}%` }} />
                  ))}
                </div>

                {/* Bars Container - uses same structure as table */}
                <div style={{ display: 'flex', width: '100%', paddingTop: '40px', paddingBottom: '40px' }}>
                  {/* Empty space for label column */}
                  <div style={{ width: '120px', minWidth: '120px', maxWidth: '120px', flexShrink: 0 }}></div>
                  
                  {/* Bar columns - each matches table column width exactly */}
                  {flattenedColumns.map((item, index) => {
                    const yMax = yFromValue(item.max);
                    const yAvg = yFromValue(item.avg);
                    const yMin = yFromValue(item.min);

                    const topCenter = Math.min(yMax, yAvg, yMin) + RECT_HALF;
                    const bottomCenter = Math.max(yMax, yAvg, yMin) + RECT_HALF;

                    return (
                      <div 
                        key={index} 
                        className="chart-bar-column"
                        style={{ 
                          width: `${COLUMN_WIDTH}px`, 
                          minWidth: `${COLUMN_WIDTH}px`, 
                          maxWidth: `${COLUMN_WIDTH}px`,
                          flexShrink: 0,
                          position: 'relative'
                        }}
                      >
                        <div className="chart-stack" style={{ height: `${STACK_HEIGHT}px`, position: 'relative' }}>
                          <div
                            className="value-connector"
                            style={{ top: `${topCenter}px`, height: `${Math.max(0, bottomCenter - topCenter)}px` }}
                            onMouseEnter={(e) => handleHoverEnter(e, item)}
                            onMouseMove={(e) => handleHoverMove(e, item)}
                            onMouseLeave={handleHoverLeave}
                          />

                          <div
                            className="chart-rectangle max"
                            style={{ top: `${yMax}px` }}
                            onMouseEnter={(e) => handleHoverEnter(e, item)}
                            onMouseMove={(e) => handleHoverMove(e, item)}
                            onMouseLeave={handleHoverLeave}
                          >
                            {valueFormatter(item.max)}
                          </div>

                          <div
                            className="chart-rectangle avg"
                            style={{ top: `${yAvg}px` }}
                            onMouseEnter={(e) => handleHoverEnter(e, item)}
                            onMouseMove={(e) => handleHoverMove(e, item)}
                            onMouseLeave={handleHoverLeave}
                          >
                            {valueFormatter(item.avg)}
                          </div>

                          <div
                            className="chart-rectangle min"
                            style={{ top: `${yMin}px` }}
                            onMouseEnter={(e) => handleHoverEnter(e, item)}
                            onMouseMove={(e) => handleHoverMove(e, item)}
                            onMouseLeave={handleHoverLeave}
                          >
                            {valueFormatter(item.min)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {tooltip && (
        <div className="tooltip" style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}>
          <div className="tooltip-title">Details</div>

          <div className="tooltip-item"><span className="tooltip-label">Min:</span> {valueFormatter(tooltip.data.min)}</div>
          <div className="tooltip-item"><span className="tooltip-label">Avg:</span> {valueFormatter(tooltip.data.avg)}</div>
          <div className="tooltip-item"><span className="tooltip-label">Max:</span> {valueFormatter(tooltip.data.max)}</div>

          <div className="tooltip-item"><span className="tooltip-label">Finishing:</span> {tooltip.data.finishing}</div>
          <div className="tooltip-item"><span className="tooltip-label">Developer:</span> {tooltip.data.developer}</div>
          <div className="tooltip-item"><span className="tooltip-label">Project:</span> {tooltip.data.project}</div>
          <div className="tooltip-item"><span className="tooltip-label">Payment:</span> {tooltip.data.payment}</div>

          <div className="tooltip-item"><span className="tooltip-label">Location:</span> {tooltip.data.location}</div>
          <div className="tooltip-item"><span className="tooltip-label">Asset Type:</span> {tooltip.data.assetType}</div>
          <div className="tooltip-item"><span className="tooltip-label">Unit Type:</span> {tooltip.data.unitType}</div>
        </div>
      )}
    </div>
  );
};

export default Chart;