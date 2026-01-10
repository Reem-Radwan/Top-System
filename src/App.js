import { BrowserRouter, Routes, Route } from "react-router-dom";
import ManageUsers from "./pages/ManageUsers/ManageUsers";
import CreateUser from "./pages/CreateUser/CreateUser";
import TopHeader from "./components/Header/TopHeader";
import ManageCompanies from "./pages/ManageCompanies/manageCompanies";

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
      </Routes>
    </BrowserRouter>
  );
}


