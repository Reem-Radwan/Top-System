import { BrowserRouter, Routes, Route } from "react-router-dom";
import ManageUsers from "./pages/ManageUsers/ManageUsers";
import CreateUser from "./pages/CreateUser/CreateUser";
import TopHeader from "./components/Header/TopHeader";
import ManageCompanies from "./pages/ManageCompanies/manageCompanies";
import CreateCompany from "./pages/CreateCompany/CreateCompany";
import Cataloge from "./pages/cataloge";
import CreateNewProject from "./pages/createProject";

export default function App() {
  return (
    <BrowserRouter>
      <TopHeader
        userName="Reem Slama"
        onLogout={() => alert("Logout (mock)")}
      />

      <Routes>
        <Route path="/" element={<ManageUsers />} />
        <Route path="/users/create" element={<CreateUser />} />
        <Route path="/manage-companies" element={<ManageCompanies />} />
        <Route path="/create-company" element={<CreateCompany />} />
        <Route path="/cataloge" element={<Cataloge/>} />
        <Route path="/create-project" element={<CreateNewProject/>} />
      </Routes>

    </BrowserRouter>
  );
}


