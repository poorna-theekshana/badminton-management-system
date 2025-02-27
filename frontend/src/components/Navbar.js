import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const location = useLocation();
  const isStorePage = location.pathname === "/store"; // Check if on store page

  useEffect(() => {
    const token = localStorage.getItem("token");

    // ✅ Only check auth if NOT on the store page
    if (!token && !isStorePage) {
      navigate("/");
    } else if (token) {
      fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
          } else if (!isStorePage) {
            navigate("/");
          }
        })
        .catch(() => {
          if (!isStorePage) {
            navigate("/");
          }
        });
    }
  }, [navigate, isStorePage]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/home">
          🏸 Badminton Booking
        </Link>

        {isStorePage ? (
          <Link to="/home" className="btn btn-warning">
            Dashboard
          </Link>
        ) : (
          <>
            {user?.role === "admin" && (
              <span className="badge bg-warning text-dark mx-3">
                Admin Access
              </span>
            )}
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/store">
                    Store
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-light ms-2" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
