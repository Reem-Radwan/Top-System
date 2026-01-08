// import { useState, useEffect } from "react";
// import Filters from "../components/Filters";
// import UsersTable from "../components/UsersTable";
// import DeleteModal from "../components/DeleteModal";
// import BulkActions from "../components/BulkActions";
// import { usersData } from "../data/fakeManageUsersData";

// function UsersPage() {
//   const [users, setUsers] = useState(usersData);
//   const [search, setSearch] = useState("");
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);

//   // نفس فكرة filterTable القديمة
//   const filteredUsers = users.filter((user) =>
//     user.name.toLowerCase().includes(search.toLowerCase()) ||
//     user.email.toLowerCase().includes(search.toLowerCase())
//   );

//   const handleDelete = (user) => {
//     setSelectedUser(user);
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = () => {
//     setUsers(users.filter((u) => u.id !== selectedUser.id));
//     setShowDeleteModal(false);
//   };

//   return (
//     <div className="page-container">

//       {/* Filters Section */}
//       <Filters search={search} setSearch={setSearch} />

//       {/* Bulk Actions */}
//       <BulkActions />

//       {/* Table */}
//       <UsersTable users={filteredUsers} onDelete={handleDelete} />

//       {/* Delete Modal */}
//       <DeleteModal
//         show={showDeleteModal}
//         onClose={() => setShowDeleteModal(false)}
//         onConfirm={confirmDelete}
//         user={selectedUser}
//       />

//     </div>
//   );
// }

// export default UsersPage;
