// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import ManageUsers from "./pages/ManageUsers";
// // import UsersPage from "./pages/UsersPage";


// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* <Route path="/" element={<UsersPage />} /> */}
//         <Route path="/manage" element={<ManageUsers />} />
        
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
import TopHeader from "./components/TopHeader";
import ManageUsers from "./pages/ManageUsers";

export default function App() {
  return (
    <>
      <TopHeader
        userName="Reem Slama"
        onLogout={() => alert("Logout (mock)")}
      />
      <ManageUsers />
    </>
  );
}


