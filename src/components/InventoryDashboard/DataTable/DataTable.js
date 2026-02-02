

// // import React, { useState, useRef, useEffect } from 'react';
// // import * as XLSX from 'xlsx';

// // const DataTable = ({ units }) => {
// //   const [isExpanded, setIsExpanded] = useState(false);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [isAtBottom, setIsAtBottom] = useState(false);
// //   const tableScrollRef = useRef(null);

// //   const formatNumber = (num) => {
// //     if (isNaN(num)) return '-';
// //     return Math.round(num).toLocaleString();
// //   };

// //   const formatCurrency = (num) => {
// //     if (isNaN(num)) return '-';
// //     return new Intl.NumberFormat('en-US', {
// //       style: 'currency',
// //       currency: 'EGP',
// //       maximumFractionDigits: 0
// //     }).format(num);
// //   };

// //   const toggleTable = () => {
// //     setIsExpanded(!isExpanded);
// //   };

// //   const exportToExcel = () => {
// //     const exportData = filteredUnits.map(unit => ({
// //       'Unit Code': unit.unit_code ? unit.unit_code.split('_')[0] : '-',
// //       'Project': unit.project || '-',
// //       'Unit Type': unit.unit_type || '-',
// //       'Area': unit.sellable_area || '-',
// //       'Status': unit.status || '-',
// //       'Price': unit.interest_free_unit_price || '-',
// //       'Sales Value': unit.sales_value || '-',
// //       'PSM': unit.psm || '-',
// //       'Delivery Date': unit.development_delivery_date || '-',
// //       'Reservation Date': unit.reservation_date || '-'
// //     }));

// //     const ws = XLSX.utils.json_to_sheet(exportData);
// //     const wb = XLSX.utils.book_new();
// //     XLSX.utils.book_append_sheet(wb, ws, 'Units Data');
// //     XLSX.writeFile(wb, `Units_Export_${new Date().toISOString().slice(0, 10)}.xlsx`);
// //   };

// //   // Handle scroll to detect if at bottom
// //   const handleScroll = () => {
// //     if (tableScrollRef.current) {
// //       const { scrollTop, scrollHeight, clientHeight } = tableScrollRef.current;
// //       const isBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 10;
// //       setIsAtBottom(isBottom);
// //     }
// //   };

// //   useEffect(() => {
// //     if (tableScrollRef.current) {
// //       tableScrollRef.current.addEventListener('scroll', handleScroll);
// //       // Initial check
// //       handleScroll();
// //     }
    
// //     return () => {
// //       if (tableScrollRef.current) {
// //         tableScrollRef.current.removeEventListener('scroll', handleScroll);
// //       }
// //     };
// //   }, [isExpanded]);

// //   // Filter units based on search term
// //   const filteredUnits = units.filter(unit => {
// //     if (!searchTerm) return true;
// //     const unitCode = (unit.unit_code || '').toLowerCase();
// //     return unitCode.includes(searchTerm.toLowerCase());
// //   });

// //   // Calculate totals
// //   const totalPrice = filteredUnits.reduce((sum, u) => sum + (parseFloat(u.interest_free_unit_price) || 0), 0);
// //   const totalSales = filteredUnits.reduce((sum, u) => sum + (parseFloat(u.sales_value) || 0), 0);

// //   return (
// //     <div className="table-container">
// //       <div className="table-header">
// //         <h3>Unit Details <span className="table-count">({filteredUnits.length})</span></h3>
// //         <div className="table-controls">
// //           <div className="search-box">
// //             <input
// //               type="text"
// //               placeholder="Search..."
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //             />
// //           </div>
// //           <button className="btn btn-secondary btn-sm" onClick={exportToExcel}>
// //             Export
// //           </button>
// //           <button className="btn btn-primary btn-sm" onClick={toggleTable}>
// //             {isExpanded ? 'Hide' : 'Show'} Details
// //           </button>
// //         </div>
// //       </div>

// //       {isExpanded && (
// //         <div 
// //           className={`table-scroll ${isAtBottom ? 'at-bottom' : ''}`}
// //           ref={tableScrollRef}
// //         >
// //           <table className="units-table">
// //             <thead>
// //               <tr>
// //                 <th>Unit Code</th>
// //                 <th>Project</th>
// //                 <th>Unit Type</th>
// //                 <th>Area (sqm)</th>
// //                 <th>Status</th>
// //                 <th>Price</th>
// //                 <th>Sales Value</th>
// //                 <th>PSM</th>
// //                 <th>Delivery Date</th>
// //                 <th>Reservation Date</th>
// //               </tr>
// //             </thead>
// //             <tbody>
// //               {filteredUnits.map((unit, index) => (
// //                 <tr key={index}>
// //                   <td>{unit.unit_code ? unit.unit_code.split('_')[0] : '-'}</td>
// //                   <td>{unit.project || '-'}</td>
// //                   <td>{unit.unit_type || '-'}</td>
// //                   <td>{formatNumber(unit.sellable_area)}</td>
// //                   <td>{unit.status || '-'}</td>
// //                   <td>{formatCurrency(unit.interest_free_unit_price)}</td>
// //                   <td>{formatCurrency(unit.sales_value)}</td>
// //                   <td>{formatCurrency(unit.psm)}</td>
// //                   <td>{unit.development_delivery_date || '-'}</td>
// //                   <td>{unit.reservation_date || '-'}</td>
// //                 </tr>
// //               ))}
// //             </tbody>
// //             <tfoot>
// //               <tr>
// //                 <td colSpan="5" className="footer-label">
// //                   Grand Total: 
// //                   <span className="footer-value">
// //                     {formatCurrency(totalPrice)}
// //                   </span>
// //                   <span className="footer-value">{formatCurrency(totalSales)}</span>
// //                 </td>
// //                 <td colSpan="3"></td>
// //               </tr>
// //             </tfoot>
// //           </table>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default DataTable;



// import React, { useState, useRef, useEffect } from 'react';
// import './datatable.css'
// import * as XLSX from 'xlsx';

// const DataTable = ({ units }) => {
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isAtBottom, setIsAtBottom] = useState(false);

//   const tableScrollRef = useRef(null);

//   const formatNumber = (num) => {
//     if (isNaN(num)) return '-';
//     return Math.round(num).toLocaleString();
//   };

//   const formatCurrency = (num) => {
//     if (isNaN(num)) return '-';
//     return new Intl.NumberFormat('en-US', {
//       style: 'currency',
//       currency: 'EGP',
//       maximumFractionDigits: 0
//     }).format(num);
//   };

//   const toggleTable = () => {
//     setIsExpanded(prev => !prev);
//   };

//   const filteredUnits = units.filter(unit => {
//     if (!searchTerm) return true;
//     const unitCode = (unit.unit_code || '').toLowerCase();
//     return unitCode.includes(searchTerm.toLowerCase());
//   });

//   const exportToExcel = () => {
//     const exportData = filteredUnits.map(unit => ({
//       'Unit Code': unit.unit_code ? unit.unit_code.split('_')[0] : '-',
//       'Project': unit.project || '-',
//       'Unit Type': unit.unit_type || '-',
//       'Area': unit.sellable_area || '-',
//       'Status': unit.status || '-',
//       'Price': unit.interest_free_unit_price || '-',
//       'Sales Value': unit.sales_value || '-',
//       'PSM': unit.psm || '-',
//       'Delivery Date': unit.development_delivery_date || '-',
//       'Reservation Date': unit.reservation_date || '-'
//     }));

//     const ws = XLSX.utils.json_to_sheet(exportData);
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, 'Units Data');
//     XLSX.writeFile(
//       wb,
//       `Units_Export_${new Date().toISOString().slice(0, 10)}.xlsx`
//     );
//   };

//   const handleScroll = (el) => {
//     if (!el) return;
//     const { scrollTop, scrollHeight, clientHeight } = el;
//     const atBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 10;
//     setIsAtBottom(atBottom);
//   };

//   useEffect(() => {
//     if (!isExpanded) return;

//     const tableEl = tableScrollRef.current;
//     if (!tableEl) return;

//     const onScroll = () => handleScroll(tableEl);

//     tableEl.addEventListener('scroll', onScroll);
//     handleScroll(tableEl); // initial check

//     return () => {
//       tableEl.removeEventListener('scroll', onScroll);
//     };
//   }, [isExpanded]);

//   const totalPrice = filteredUnits.reduce(
//     (sum, u) => sum + (parseFloat(u.interest_free_unit_price) || 0),
//     0
//   );

//   const totalSales = filteredUnits.reduce(
//     (sum, u) => sum + (parseFloat(u.sales_value) || 0),
//     0
//   );

//   return (
//     <div className="table-container">
//       <div className="table-header">
//         <h3>
//           Unit Details <span className="table-count">({filteredUnits.length})</span>
//         </h3>

//         <div className="table-controls">
//           <div className="search-box">
//             <input
//               type="text"
//               placeholder="Search BY Unit Code..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>

//           <button className="btn btn-secondary btn-sm" onClick={exportToExcel}>
//             Export
//           </button>

//           <button className="btn btn-primary btn-sm" onClick={toggleTable}>
//             {isExpanded ? 'Hide' : 'Show'} Details
//           </button>
//         </div>
//       </div>

//       {isExpanded && (
//         <div
//           className={`table-scroll ${isAtBottom ? 'at-bottom' : ''}`}
//           ref={tableScrollRef}
//         >
//           <table className="units-table">
//             <thead>
//               <tr>
//                 <th>Unit Code</th>
//                 <th>Project</th>
//                 <th>Unit Type</th>
//                 <th>Area (sqm)</th>
//                 <th>Status</th>
//                 <th>Price</th>
//                 <th>Sales Value</th>
//                 <th>PSM</th>
//                 <th>Delivery Date</th>
//                 <th>Reservation Date</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filteredUnits.map((unit, index) => (
//                 <tr key={index}>
//                   <td>{unit.unit_code ? unit.unit_code.split('_')[0] : '-'}</td>
//                   <td>{unit.project || '-'}</td>
//                   <td>{unit.unit_type || '-'}</td>
//                   <td>{formatNumber(unit.sellable_area)}</td>
//                   <td>{unit.status || '-'}</td>
//                   <td>{formatCurrency(unit.interest_free_unit_price)}</td>
//                   <td>{formatCurrency(unit.sales_value)}</td>
//                   <td>{formatCurrency(unit.psm)}</td>
//                   <td>{unit.development_delivery_date || '-'}</td>
//                   <td>{unit.reservation_date || '-'}</td>
//                 </tr>
//               ))}
//             </tbody>

            
//           </table>
//           <div className='footing'>
//             <span className='spanfoot'>
//                Grand Total:
//                   <span className="footers-value">
//                     {formatCurrency(totalPrice)}
//                   </span>
//                   <span className="footers-value">
//                     {formatCurrency(totalSales)}
//                   </span>
//             </span>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DataTable;









import React, { useState, useRef, useEffect } from 'react';
import './datatable.css'
import * as XLSX from 'xlsx';

const DataTable = ({ units }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAtBottom, setIsAtBottom] = useState(false);

  const tableScrollRef = useRef(null);

  const formatNumber = (num) => {
    if (isNaN(num)) return '-';
    return Math.round(num).toLocaleString();
  };

  const formatCurrency = (num) => {
    if (isNaN(num)) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EGP',
      maximumFractionDigits: 0
    }).format(num);
  };

  const toggleTable = () => {
    setIsExpanded(prev => !prev);
  };

  const filteredUnits = units.filter(unit => {
    if (!searchTerm) return true;
    const unitCode = (unit.unit_code || '').toLowerCase();
    return unitCode.includes(searchTerm.toLowerCase());
  });

  const exportToExcel = () => {
    const exportData = filteredUnits.map(unit => ({
      'Unit Code': unit.unit_code ? unit.unit_code.split('_')[0] : '-',
      'Project': unit.project || '-',
      'Unit Type': unit.unit_type || '-',
      'Area': unit.sellable_area || '-',
      'Status': unit.status || '-',
      'Price': unit.interest_free_unit_price || '-',
      'Sales Value': unit.sales_value || '-',
      'PSM': unit.psm || '-',
      'Delivery Date': unit.development_delivery_date || '-',
      'Reservation Date': unit.reservation_date || '-'
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Units Data');
    XLSX.writeFile(
      wb,
      `Units_Export_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  const handleScroll = (el) => {
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const atBottom = Math.abs(scrollHeight - scrollTop - clientHeight) < 10;
    setIsAtBottom(atBottom);
  };

  useEffect(() => {
    if (!isExpanded) return;

    const tableEl = tableScrollRef.current;
    if (!tableEl) return;

    const onScroll = () => handleScroll(tableEl);

    tableEl.addEventListener('scroll', onScroll);
    handleScroll(tableEl); // initial check

    return () => {
      tableEl.removeEventListener('scroll', onScroll);
    };
  }, [isExpanded]);

  const totalPrice = filteredUnits.reduce(
    (sum, u) => sum + (parseFloat(u.interest_free_unit_price) || 0),
    0
  );

  const totalSales = filteredUnits.reduce(
    (sum, u) => sum + (parseFloat(u.sales_value) || 0),
    0
  );

  return (
    <div className="table-container">
      <div className="table-header">
        <h3>
          Unit Details <span className="table-count">({filteredUnits.length})</span>
        </h3>

        <div className="table-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search BY Unit Code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button className="btn btn-secondary btn-sm" onClick={exportToExcel}>
            Export
          </button>

          <button className="btn btn-primary btn-sm" onClick={toggleTable}>
            {isExpanded ? 'Hide' : 'Show'} Details
          </button>
        </div>
      </div>

      {isExpanded && (
        <div
          className={`table-scroll ${isAtBottom ? 'at-bottom' : ''}`}
          ref={tableScrollRef}
        >
          <table className="units-table">
            <thead>
              <tr>
                <th>Unit Code</th>
                <th>Project</th>
                <th>Unit Type</th>
                <th>Area (sqm)</th>
                <th>Status</th>
                <th>Price</th>
                <th>Sales Value</th>
                <th>PSM</th>
                <th>Delivery Date</th>
                <th>Reservation Date</th>
              </tr>
            </thead>

            <tbody>
              {filteredUnits.map((unit, index) => (
                <tr key={index}>
                  <td>{unit.unit_code ? unit.unit_code.split('_')[0] : '-'}</td>
                  <td>{unit.project || '-'}</td>
                  <td>{unit.unit_type || '-'}</td>
                  <td>{formatNumber(unit.sellable_area)}</td>
                  <td>{unit.status || '-'}</td>
                  <td>{formatCurrency(unit.interest_free_unit_price)}</td>
                  <td>{formatCurrency(unit.sales_value)}</td>
                  <td>{formatCurrency(unit.psm)}</td>
                  <td>{unit.development_delivery_date || '-'}</td>
                  <td>{unit.reservation_date || '-'}</td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr>
                <td className="footer-label">Grand Total:</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td className="footer-value">{formatCurrency(totalPrice)}</td>
                <td className="footer-value">{formatCurrency(totalSales)}</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default DataTable;