import UserRow from "./UserRow";

function UsersTable({ users, onDelete }) {

  return (
    <table className="users-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Date</th>
          <th>Email</th>
          <th>Job Title</th>
          <th>Mobile</th>
          <th>Department</th>
          <th>Status</th>
          <th>Business Team</th>
          <th>Company User</th>
          <th>Edit</th>
          <th>Delete</th>
          <th>Login As</th>
        </tr>
      </thead>

      <tbody>
        {users.map((user, index) => (
          <UserRow
            key={user.id}
            user={user}
            index={index + 1}
            onDelete={onDelete}
          />
        ))}
      </tbody>
    </table>
  );
}

export default UsersTable;
