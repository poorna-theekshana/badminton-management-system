import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BookingCard from "../components/BookingCard";
import moment from "moment";

const BookingsPage = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
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
            navigate("/login");
          }
        })
        .catch((err) => {
          console.error("Auth Fetch Error:", err);
          navigate("/login");
        });
    }
  }, [navigate]);

  const fetchUserBookings = (userId) => {
    fetch(`http://localhost:5000/api/bookings/user/${userId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("🔹 User Bookings Fetched:", data);
        setBookings(groupBookingsByDate(data));
      })
      .catch((err) => console.error("Error fetching user bookings:", err));
  };

  const handleDeleteBooking = async (bookingId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete booking");

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
      .sort((a, b) => moment(a).diff(moment(b))) // Sort by date
      .map((date) => ({
        date,
        bookings: grouped[date].sort(
          (a, b) =>
            moment(a.startTime, "hh:mm A") - moment(b.startTime, "hh:mm A")
        ),
      }));
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
          <h2 className="pb-5 pt-5">My Bookings</h2>
          <div className="d-flex flex-column gap-3">
            {bookings.length === 0 ? (
              <p className="text-center mt-3">No bookings found.</p>
            ) : (
              bookings.map((group) => (
                <div key={group.date} className="card shadow-sm p-3">
                  <h4 className="fw-bold text-primary">
                    {moment(group.date).format("dddd, MMM D YYYY")}
                  </h4>
                  {group.bookings.map((booking) => (
                    <BookingCard
                      key={booking._id}
                      booking={booking}
                      onDelete={handleDeleteBooking}
                    />
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;
