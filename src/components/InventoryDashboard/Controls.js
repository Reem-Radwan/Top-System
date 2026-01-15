import React from 'react';

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
        style={{
          marginLeft: '10px',
          padding: '0.5rem 1rem',
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        <i className="fas fa-download"></i> Report
      </button>
    </div>
  );
};

export default Controls;
