// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import ManageUsers from "./pages/ManageUsers/ManageUsers";
// import CreateUser from "./pages/CreateUser/CreateUser";
// import TopHeader from "./components/Header/TopHeader";
// import ManageCompanies from "./pages/ManageCompanies/manageCompanies";
// import CreateCompany from "./pages/CreateCompany/CreateCompany";
// import Cataloge from "./pages/Cataloge/cataloge";
// import CreateNewProject from "./pages/CreateProject/createProject";
// import ManageProjects from "./pages/ManageProjects/manageProjects";
// import Dashboard from "./components/InventoryDashboard/Dashboard";


// export default function App() {
//   return (
//     <BrowserRouter>
//       <TopHeader />

//       <Routes>
//         <Route path="/manage-users" element={<ManageUsers />} />
//         <Route path="/users/create" element={<CreateUser />} />
//         <Route path="/manage-companies" element={<ManageCompanies />} />
//         <Route path="/create-company" element={<CreateCompany/>} />
//         <Route path="/cataloge" element={<Cataloge/>} />
//         <Route path="/create-project" element={<CreateNewProject/>} />
//         <Route path="/manage-projects" element={<ManageProjects/>} />
//         <Route path="/dahboard" element={<Dashboard/>} />
//       </Routes>

//     </BrowserRouter>
//   );
// }




// import React from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import TopHeader from "./components/Header/TopHeader";

// import ManageUsers from "./pages/ManageUsers/ManageUsers";
// import CreateUser from "./pages/CreateUser/CreateUser";
// import ManageCompanies from "./pages/ManageCompanies/manageCompanies";
// import CreateCompany from "./pages/CreateCompany/CreateCompany";
// import Cataloge from "./pages/Cataloge/cataloge";
// import CreateNewProject from "./pages/CreateProject/createProject";
// import ManageProjects from "./pages/ManageProjects/manageProjects";

// import InventoryDashboardPage from "./pages/InventoryDashboard/InventoryDashboard";
// import { ThemeProvider } from "./components/InventoryDashboard/Themecontext";
// import SalesPerformanceAnalysis from "./components/SalesPerformanceAnalysis/SalesPerformanceAnalysis";
// import UnitsAnalysis from "./pages/UnitsAnalysis/unitsAnalysis";

// import RealEstateLogin from "./pages/LoginPage/login";

// export default function App() {
//   return (
//     <ThemeProvider>
//       <BrowserRouter>
//         <TopHeader />

//         <Routes>
//           {/* ✅ خلي الرئيسية تفتح صفحة اللوجين */}
//           <Route path="/" element={<RealEstateLogin />} />

//           {/* لو عايز كمان url صريح */}
//           <Route path="/login" element={<RealEstateLogin />} />

//           <Route path="/manage-users" element={<ManageUsers />} />
//           <Route path="/users/create" element={<CreateUser />} />
//           <Route path="/manage-companies" element={<ManageCompanies />} />
//           <Route path="/create-company" element={<CreateCompany />} />
//           <Route path="/cataloge" element={<Cataloge />} />
//           <Route path="/create-project" element={<CreateNewProject />} />
//           <Route path="/manage-projects" element={<ManageProjects />} />

//           <Route path="/inventory-report" element={<InventoryDashboardPage />} />
//           <Route path="/sales-analysis" element={<SalesPerformanceAnalysis />} />
//           <Route path="/units-analysis" element={<UnitsAnalysis />} />

//           {/* أي مسار غلط */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </BrowserRouter>
//     </ThemeProvider>
//   );
// }




import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

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

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}