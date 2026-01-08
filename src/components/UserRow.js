function UserRow({ user, index, onDelete }) {

  return (
    <tr>
      <td>{index}</td>
      
      <td>{user.name}</td>

      <td>{user.createDate}</td>

      <td>{user.email}</td>

      <td>{user.jobTitle}</td>

      <td>{user.mobile}</td>

      <td>{user.department}</td>

      {/* Active */}
      <td>
        <input type="checkbox" checked={user.active} readOnly />
      </td>

      {/* Business Team */}
      <td>
        <input type="checkbox" checked={user.businessTeam} readOnly />
      </td>

      {/* Company User */}
      <td>
        <input type="checkbox" checked={user.companyUser} readOnly />
      </td>

      {/* Edit */}
      <td>
        <button>Edit</button>
      </td>

      {/* Delete */}
      <td>
        <button onClick={() => onDelete(user)}>
          Delete
        </button>
      </td>

      {/* Login As */}
      <td>
        <button>Login</button>
      </td>
    </tr>
  );
}

export default UserRow;
