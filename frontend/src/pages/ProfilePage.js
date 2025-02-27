import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import moment from "moment";
import profileImage from "../assets/prof.png"; // Static profile image

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [totalBookings, setTotalBookings] = useState(0);
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
            fetchUserBookings(data.user._id);
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

  const fetchUserBookings = (userId) => {
    fetch(`http://localhost:5000/api/bookings/user/${userId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setTotalBookings(data.length);
      })
      .catch((err) => console.error("Error fetching user bookings:", err));
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/users/delete/${user._id}`, 
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete account");
      }

      // ✅ Remove token and redirect to homepage
      localStorage.removeItem("token");
      window.location.href = "/"; // Redirect to landing page
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("❌ Failed to delete account");
    }
  };

  if (!user) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container-fluid" style={{ marginTop: "70px" }}>
      <Navbar />
      <div className="row">
        <div className="col-md-2">
          <Sidebar />
        </div>
        <div
          className="col-md-10 d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <div
            className="card p-5 shadow-lg text-center"
            style={{
              width: "500px",
              borderRadius: "15px",
              maxWidth: "90%",
            }}
          >
            <h2 className="pb-3">Profile</h2>
            <img
              src={profileImage}
              alt="User Profile"
              className="rounded-circle mx-auto"
              style={{
                width: "250px",
                height: "250px",
                objectFit: "cover",
              }}
            />
            <h3 className="fw-bold mt-3">{user.name}</h3>
            <p className="text-muted">📧 {user.email}</p>
            <p className="text-muted">📱 {user.mobile || "N/A"}</p>
            <p className="fw-bold text-muted">
              📅 Member Since: {moment(user.createdAt).format("MMMM D, YYYY")}
            </p>
            <p className="fw-bold text-muted">
              🎾 Total Bookings: {totalBookings}
            </p>
            <button
              className="btn btn-danger mt-3 w-100"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
