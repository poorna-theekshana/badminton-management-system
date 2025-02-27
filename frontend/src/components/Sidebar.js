import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Sidebar.css";

const Sidebar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
          } else {
            navigate("/");
          }
        })
        .catch((err) => {
          console.error("Auth Fetch Error:", err);
          navigate("/");
        });
    }
  }, [navigate]);

  return (
    <div className="d-flex flex-column flex-shrink-0 text-white vh-100 p-3 sidebar">
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link to="/home" className="nav-link text-white">
            📊 Dashboard
          </Link>
        </li>

        {/* Show different options for admin and regular users */}
        {user?.role === "admin" ? (
          <>
            <li className="nav-item">
              <Link to="/admin/bookings" className="nav-link text-white">
                📋 Manage Bookings
              </Link>
            </li>
            {user?.role === "admin" && (
              <li className="nav-item">
                <Link to="/recurring-bookings" className="nav-link text-white">
                  🔄 Recurring Bookings
                </Link>
              </li>
            )}
          </>
        ) : (
          <li className="nav-item">
            <Link to="/bookings" className="nav-link text-white">
              📅 My Bookings
            </Link>
          </li>
        )}
        {user && user.role === "admin" && (
          <li>
            <a href="/admin/users" className="nav-link text-white">
              👥 Manage Users
            </a>
          </li>
        )}
        <hr />
        <li className="nav-item">
          <Link to="/store" className="nav-link text-white">
            🛒 Store
          </Link>
        </li>
        {user?.role === "admin" && (
          <>
            <li className="nav-item">
              <Link to="/admin/store" className="nav-link text-white">
                📦 Manage Store
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/admin/add-item" className="nav-link text-white">
                ➕ Add Item
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
