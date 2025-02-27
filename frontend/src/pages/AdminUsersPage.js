import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";

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

      if (!response.ok) throw new Error("Failed to delete user");

      setUsers(users.filter((user) => user._id !== userId));
      console.log("✅ User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("❌ Failed to delete user");
    }
  };

  const handleToggleRole = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/users/toggle-role/${userId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (!response.ok) throw new Error("Failed to update role");

      const updatedUsers = users.map((user) =>
        user._id === userId
          ? { ...user, role: user.role === "admin" ? "user" : "admin" }
          : user
      );

      setUsers(updatedUsers);
      console.log("✅ User role updated successfully!");
    } catch (error) {
      console.error("Error updating role:", error);
      alert("❌ Failed to update role");
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
          <h2 className="pb-4 pt-4">👥 User Management</h2>

          <div className="d-flex flex-column gap-3">
            {users.length === 0 ? (
              <p className="text-center mt-3">No users found.</p>
            ) : (
              users.map((user) => (
                <div
                  key={user._id}
                  className="d-flex align-items-center justify-content-between p-3 my-2 rounded shadow-sm bg-light"
                >
                  <div className="flex-grow-1 px-3">
                    <p>
                      <strong>Name:</strong> {user.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                      <strong>Mobile Number:</strong> {user.mobile}
                    </p>
                    <p>
                      <strong>Role:</strong>{" "}
                      {user.role === "admin" ? "🛠️ Admin" : "👤 User"}
                    </p>
                  </div>
                  <div className="d-flex align-items-center">
                    <button
                      className={`btn ${
                        user.role === "admin" ? "btn-warning" : "btn-success"
                      } me-2`}
                      onClick={() => handleToggleRole(user._id)}
                    >
                      {user.role === "admin"
                        ? "Demote to User"
                        : "Promote to Admin"}
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
