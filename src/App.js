import { BrowserRouter, Routes, Route } from "react-router-dom";
import ManageUsers from "./pages/ManageUsers";
import CreateUser from "./pages/CreateUser";
import TopHeader from "./components/TopHeader";

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
      </Routes>
    </BrowserRouter>
  );
}
