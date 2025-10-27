import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminUser.css";

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const url = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${url}/admin/users`, { withCredentials: true });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // ✅ Block or Unblock user
  const toggleBlock = async (id, isBlocked) => {
    const confirmMsg = isBlocked
      ? "Are you sure you want to unblock this user?"
      : "Are you sure you want to block this user?";
    const confirmAction = window.confirm(confirmMsg);
    if (!confirmAction) return;

    try {
      await axios.put(`${url}/admin/users/${id}/block`, { block: !isBlocked }, { withCredentials: true });
      fetchUsers();
    } catch (err) {
      console.error("Error updating block status:", err);
      alert(err.response?.data?.message || "Failed to update user status");
    }
  };

  return (
    <div className="userContainer">
      <div className="header">
        <div>
          <h1>User Management</h1>
          <p>Manage, view, and block users.</p>
        </div>
      </div>  

      <div className="tableWrapper">
        <table className="userTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Verified</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.fullName}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.verified ? "Yes" : "No"}</td>
                <td>
                  <span className={`status ${u.block ? "blocked" : "active"}`}>
                    {u.block ? "Blocked" : "Active"}
                  </span>
                </td>
                <td>
                  <button
                    className={u.block ? "unblockButton" : "blockButton"}
                    onClick={() => toggleBlock(u._id, u.block)}
                  >
                    {u.block ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUser;
