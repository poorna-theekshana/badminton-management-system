import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import ProfileCard from "../components/ProfileCard";
import moment from "moment";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [totalBookings, setTotalBookings] = useState(0);
  const [lastBookingDate, setLastBookingDate] = useState(null);
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
        if (data.length > 0) {
          const lastDate = moment(
            Math.max(...data.map((b) => new Date(b.date)))
          ).format("MMMM D, YYYY");
          setLastBookingDate(lastDate);
        }
      })
      .catch((err) => console.error("Error fetching user bookings:", err));
  };

  if (!user) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container-fluid" style={{ marginTop: "70px" }}>
      <Navbar />
      <div className="row">
        <div className="col-md-2">
          <Sidebar />
        </div>
        <div className="col-md-10 p-4">
          <h2 className="pb-5 pt-5">My Profile</h2>
          <ProfileCard
            user={user}
            totalBookings={totalBookings}
            lastBookingDate={lastBookingDate}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
