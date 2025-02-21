import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (!window.confirm(`Change role to ${newRole}?`)) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${userId}/role`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update role");
      }

      fetchUsers(); // Refresh users after role change
      alert(`Role updated to ${newRole}`);
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update role.");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/users/${userId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers(users.filter((user) => user._id !== userId)); // Remove user from list
      alert("User deleted successfully.");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user.");
    }
  };

  return (
    <div className="container-fluid" style={{ marginTop: "70px" }}>
      <Navbar />
      <div className="row">
        <div className="col-md-2">
          <Sidebar />
        </div>
        <div className="col-md-10 p-4">
          <h2 className="pb-4 pt-4">👤 Manage Users</h2>

          <div className="d-flex flex-column gap-3">
            {users.length === 0 ? (
              <p className="text-center mt-3">No users found.</p>
            ) : (
              users.map((user) => (
                <div
                  key={user._id}
                  className="d-flex align-items-center justify-content-between p-3 my-2 rounded shadow-sm bg-light"
                >
                  {/* User Details */}
                  <div className="flex-grow-1 px-3">
                    <p className="mb-1">
                      <strong>Name:</strong> {user.name}
                    </p>
                    <p className="mb-1">
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p className="mb-1">
                      <strong>Mobile:</strong> {user.mobile}
                    </p>
                    <p className="mb-1">
                      <strong>Role:</strong>
                      <span
                        className={`badge ${
                          user.role === "admin" ? "bg-danger" : "bg-primary"
                        } ms-2`}
                      >
                        {user.role}
                      </span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="d-flex align-items-center">
                    <button
                      className={`btn ${
                        user.role === "admin" ? "btn-secondary" : "btn-success"
                      } me-2`}
                      onClick={() => handleRoleChange(user._id, user.role)}
                    >
                      {user.role === "admin" ? "Demote to User" : "Make Admin"}
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
