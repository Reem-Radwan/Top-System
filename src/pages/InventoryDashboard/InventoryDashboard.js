import React, { useEffect, useState } from "react";
import "./inventoryDashboard.css";

import Dashboard from "../../components/InventoryDashboard/DashBoard/Dashboard"
import ThemeToggle from "../../components/InventoryDashboard/Themetoggle";

import { getCompanies } from "../../data/inventorymockData";


export default function InventoryDashboardPage() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('home');


  useEffect(() => {
    loadCompanies();
  }, []);


  const loadCompanies = async () => {
    try {
      const companiesData = await getCompanies();
      setCompanies(companiesData);


      if (companiesData.length > 0) {
        setSelectedCompanyId(companiesData[0].id);
      }


      setLoading(false);
    } catch (error) {
      console.error("Error loading companies:", error);
      setLoading(false);
    }
  };


  const handleCompanyChange = (companyId) => {
    setLoading(true);
    setSelectedCompanyId(companyId);
    setCurrentView('home');
    setTimeout(() => setLoading(false), 300);
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'home':
        return '📊 Inventory Dashboard';
      case 'project-data':
        return '📊 Un/Sold Analysis'
      case 'inv-status':
        return '📦 Inventory Status Analysis'
      case 'sales-progress':
        return '📈 Sales Progress';
      case 'delivery-plan':
        return '🚚 Delivery Plan';
      default:
        return '📊 Inventory Dashboard';
    }
  };


  const selectedCompany = companies.find((c) => c.id === selectedCompanyId);


  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner spinner-large"></div>
        <p className="loading-text">
          {selectedCompany
            ? `Loading ${selectedCompany.name}...`
            : "Loading inventory data..."}
        </p>
      </div>
    );
  }


  return (
    <div >
      <div className="dashboard-container">
        <header className="dashboard-header">
          <h1>{getPageTitle()}</h1>


          <div className="dashboard-controls">
            <div className="company-selector-wrapper">
              <label className="company-selector-label">Select Company</label>
              <div className="company-selector">
                <select
                  value={selectedCompanyId || ""}
                  onChange={(e) => handleCompanyChange(parseInt(e.target.value))}
                >
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>


            <ThemeToggle />
          </div>
        </header>


        {selectedCompanyId && selectedCompany ? (
          <Dashboard
            companyId={selectedCompanyId}
            companyName={selectedCompany.name}
            onViewChange={setCurrentView}
          />
        ) : (
          <div className="welcome-message">
            <h2>Welcome to Inventory Dashboard</h2>
            <p>Select a company from the dropdown above to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
