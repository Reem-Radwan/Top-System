import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import TopHeader from "./components/Header/TopHeader";

import ManageUsers from "./pages/ManageUsers/ManageUsers";
import CreateUser from "./pages/CreateUser/CreateUser";
import ManageCompanies from "./pages/ManageCompanies/manageCompanies";
import CreateCompany from "./pages/CreateCompany/CreateCompany";
import Cataloge from "./pages/Cataloge/cataloge";
import CreateNewProject from "./pages/CreateProject/createProject";
import ManageProjects from "./pages/ManageProjects/manageProjects";

import InventoryDashboardPage from "./pages/InventoryDashboard/InventoryDashboard";
import { ThemeProvider } from "./components/InventoryDashboard/Themecontext";
import SalesPerformanceAnalysis from "./components/SalesPerformanceAnalysis/SalesPerformanceAnalysis";
import UnitsAnalysis from "./pages/UnitsAnalysis/unitsAnalysis";

import RealEstateLogin from "./pages/LoginPage/login";
import ManageInventory from "./pages/ManageInventory/manageinventory";
import InventoryHub from "./pages/InventoryHub/inventoryhub";
import Masterplans from "./pages/MasterPlans/masterplans";
import MasterplansSettings from "./pages/MasterPlansSettings/masterplanssettings"
import UnitBrochureManager from "./pages/UnitBrochureManager/unitbrochuremanager";
import CancellationPage from "./pages/Cancellation/cancellation";
import SalesTeamPerformance from "./pages/SalesTeamPerformance/salesteamperformance";
import ApprovalsHistory from "./pages/ApprovalsHistory/approvalshistory";



// Component to conditionally render TopHeader
function Layout() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/" || location.pathname === "/login";

  return (
    <>
      {!isLoginPage && <TopHeader />}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout />

        <Routes>
          <Route path="/" element={<RealEstateLogin />} />
          <Route path="/login" element={<RealEstateLogin />} />

          <Route path="/manage-users" element={<ManageUsers />} />
          <Route path="/users/create" element={<CreateUser />} />
          <Route path="/manage-companies" element={<ManageCompanies />} />
          <Route path="/create-company" element={<CreateCompany />} />
          <Route path="/cataloge" element={<Cataloge />} />
          <Route path="/create-project" element={<CreateNewProject />} />
          <Route path="/manage-projects" element={<ManageProjects />} />

          <Route path="/inventory-report" element={<InventoryDashboardPage />} />
          <Route path="/sales-analysis" element={<SalesPerformanceAnalysis />} />
          <Route path="/units-analysis" element={<UnitsAnalysis />} />
          <Route path="/manage-inventory" element={<ManageInventory/>} />
          <Route path="/inventory-hub" element={<InventoryHub/>} />
          <Route path="/masterplans" element={<Masterplans/>} />
          <Route path="/masterplans-settings" element={<MasterplansSettings/>} />
          <Route path="/unit-brochure-manager" element={<UnitBrochureManager/>} />
          <Route path="/cancellation" element={<CancellationPage/>} />
          <Route path="/sales-team-performance" element={<SalesTeamPerformance/>} />
          <Route path="/approvals-history" element={<ApprovalsHistory/>} />
          

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}