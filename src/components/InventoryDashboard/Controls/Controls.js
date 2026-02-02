import React from 'react';
import './controls.css'
// import '../../App.css'

const Controls = ({ companies, selectedCompanyId, onCompanyChange }) => {
  const handleDownloadReport = () => {
    alert('Report download functionality would be implemented here');
  };

  return (
    <div className="controls">
      <select
        id="companySelect"
        value={selectedCompanyId || ''}
        onChange={(e) => onCompanyChange(parseInt(e.target.value))}
      >
        <option value="">-- Select Company --</option>
        {companies.map(company => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </select>

      <button
        id="downloadReportBtn"
        onClick={handleDownloadReport}
        className="pdf-btn"
      >
        <i className="fas fa-download"></i> Report
      </button>
    </div>
  );
};

export default Controls;
