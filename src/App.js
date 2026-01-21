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


import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import TopHeader from "./components/Header/TopHeader";

import ManageUsers from "./pages/ManageUsers/ManageUsers";
import CreateUser from "./pages/CreateUser/CreateUser";
import ManageCompanies from "./pages/ManageCompanies/manageCompanies";
import CreateCompany from "./pages/CreateCompany/CreateCompany";
import Cataloge from "./pages/Cataloge/cataloge";
import CreateNewProject from "./pages/CreateProject/createProject";
import ManageProjects from "./pages/ManageProjects/manageProjects";

// NEW: make the dashboard a page/route
import InventoryDashboardPage from "./pages/InventoryDashboard/InventoryDashboard";

import { ThemeProvider } from "./components/InventoryDashboard/Themecontext";
import SalesPerformanceAnalysis from "./components/SalesPerformanceAnalysis/SalesPerformanceAnalysis";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <TopHeader />

        <Routes>
          {/* Choose which route should show the dashboard */}
          <Route path="/" /> {/* [web:14] */}

          <Route path="/manage-users" element={<ManageUsers />} />
          <Route path="/users/create" element={<CreateUser />} />
          <Route path="/manage-companies" element={<ManageCompanies />} />
          <Route path="/create-company" element={<CreateCompany />} />
          <Route path="/cataloge" element={<Cataloge />} />
          <Route path="/create-project" element={<CreateNewProject />} />
          <Route path="/manage-projects" element={<ManageProjects />} />

          {/* Optional: also allow a dedicated URL for it */}
          <Route path="/inventory-report" element={<InventoryDashboardPage />} />
          <Route path="/sales-analysis" element={<SalesPerformanceAnalysis />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

