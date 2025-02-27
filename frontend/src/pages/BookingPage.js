import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import moment from "moment";

const BookingsPage = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

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
  }, [navigate]);

  const fetchUserBookings = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch bookings");

      const data = await response.json();
      console.log("🔹 User Bookings Data:", data);

      setBookings(groupBookingsByDate(data || []));
    } catch (err) {
      console.error("Error fetching user bookings:", err);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?"))
      return;

    try {
      await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      setBookings((prevBookings) => {
        const updatedBookings = prevBookings
          .map((group) => ({
            date: group.date,
            bookings: group.bookings.filter((b) => b._id !== bookingId),
          }))
          .filter((group) => group.bookings.length > 0);
        return updatedBookings;
      });

      console.log("✅ Booking deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);
      alert("❌ Failed to delete booking!");
    }
  };

  const groupBookingsByDate = (bookings) => {
    const grouped = bookings.reduce((acc, booking) => {
      const date = moment(booking.date).format("YYYY-MM-DD");
      if (!acc[date]) acc[date] = [];
      acc[date].push(booking);
      return acc;
    }, {});

    return Object.keys(grouped)
      .sort((a, b) => moment(a).diff(moment(b)))
      .map((date) => ({
        date,
        bookings: grouped[date].sort(
          (a, b) =>
            moment(a.startTime, "hh:mm A") - moment(b.startTime, "hh:mm A")
        ),
      }));
  };

  return (
    <div className="container-fluid" style={{ marginTop: "70px" }}>
      <Navbar />
      <div className="row">
        <div className="col-md-2">
          <Sidebar />
        </div>
        <div className="col-md-10 p-4">
          <h2 className="pb-4 pt-4">📅 My Bookings</h2>

          {bookings.length === 0 ? (
            <p className="text-center text-muted">No bookings found.</p>
          ) : (
            bookings.map((group) => (
              <div key={group.date} className="card shadow-sm p-4 mb-4">
                <h4 className="fw-bold text-primary">
                  {moment(group.date).format("dddd, MMM D YYYY")}
                </h4>
                {group.bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="d-flex align-items-center justify-content-between p-3 my-2 rounded shadow-sm bg-light"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                      padding: "15px",
                      borderRadius: "8px",
                      backgroundColor: "#f8f9fa",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {/* Court Info */}
                    <div
                      className="text-white bg-dark p-3 rounded text-center"
                      style={{ minWidth: "110px" }}
                    >
                      <h5 className="m-0">Court</h5>
                      <h4 className="fw-bold m-0">C{booking.court}</h4>
                    </div>

                    {/* Booking Details */}
                    <div className="flex-grow-1 px-4 d-flex flex-column">
                      <p className="mb-2">
                        <strong>Time Slot:</strong> {booking.startTime} -{" "}
                        {booking.endTime}
                      </p>
                      <p className="mb-2">
                        <strong>Booked By:</strong>{" "}
                        {booking.user?.name || "Unknown User"}
                      </p>
                    </div>

                    {/* Status & Cancel Button */}
                    <div className="d-flex align-items-center">
                      {/* Status Tag */}
                      {booking.status === "confirmed" && (
                        <span
                          className={`badge p-2 me-3 ${
                            booking.recurring ? "bg-primary" : "bg-success"
                          }`}
                        >
                          {booking.recurring ? "Recurring" : "Confirmed"}
                        </span>
                      )}

                      {/* Cancel Button */}
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteBooking(booking._id)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;
