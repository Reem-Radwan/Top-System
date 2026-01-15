

import React, { useState } from 'react';
import * as XLSX from 'xlsx';

const DataTable = ({ units }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
    setIsExpanded(!isExpanded);
  };

  const exportToExcel = () => {
    const exportData = filteredUnits.map(unit => ({
      'Project': unit.project || '-',
      'Unit Code': unit.unit_code ? unit.unit_code.split('_')[0] : '-',
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
    XLSX.writeFile(wb, `Units_Export_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Filter units based on search term
  const filteredUnits = units.filter(unit => {
    if (!searchTerm) return true;
    const unitCode = (unit.unit_code || '').toLowerCase();
    return unitCode.includes(searchTerm.toLowerCase());
  });

  // Calculate totals
  const totalPrice = filteredUnits.reduce((sum, u) => sum + (parseFloat(u.interest_free_unit_price) || 0), 0);
  const totalSales = filteredUnits.reduce((sum, u) => sum + (parseFloat(u.sales_value) || 0), 0);

  return (
    <div className="table-container">
      <div className="table-header">
        <h3>Unit Details <span className="table-count">({filteredUnits.length})</span></h3>
        <div className="table-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search..."
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
      <div className="table-scroll">

        <table className="units-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Unit Code</th>
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
                <td>{unit.project || '-'}</td>
                <td>{unit.unit_code ? unit.unit_code.split('_')[0] : '-'}</td>
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
              <td colSpan="5" className="footer-label">
                Grand Total:
              </td>
              <td className="footer-value">{formatCurrency(totalPrice)}</td>
              <td className="footer-value">{formatCurrency(totalSales)}</td>
              <td colSpan="3"></td>
            </tr>
          </tfoot>
        </table>
      </div>
      )}
    </div>
  );
};

export default DataTable;