import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";

const AdminBookingsPage = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const fetchAllBookings = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      console.log("🔹 Admin Bookings Data:", data);
      setBookings(groupBookingsByDate(data)); // ✅ Group bookings by date
    } catch (error) {
      console.error("Error fetching admin bookings:", error);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?"))
      return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/bookings/${bookingId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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

  return (
    <div className="container-fluid" style={{ marginTop: "70px" }}>
      <Navbar />
      <div className="row">
        <div className="col-md-2">
          <Sidebar />
        </div>
        <div className="col-md-10 p-4">
          <h2 className="pb-4">📋 All Bookings</h2>

          <div className="d-flex flex-column gap-3">
            {bookings.length === 0 ? (
              <p className="text-center mt-3">No bookings found.</p>
            ) : (
              bookings.map((group) => (
                <div key={group.date} className="card shadow-sm p-4 mb-4">
                  <h4 className="fw-bold text-primary">
                    {moment(group.date).format("dddd, MMM D YYYY")}
                  </h4>
                  {group.bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="d-flex align-items-center justify-content-between p-4 my-3 rounded shadow-sm bg-light"
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
                          <strong>Date:</strong>{" "}
                          {moment(booking.date).format("dddd, MMM D YYYY")}
                        </p>
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
                        {/* Status Tag (Show Confirmed Only When Status is Confirmed) */}
                        {booking.status === "confirmed" && (
                          <span
                            className={`badge p-2 me-3 ${
                              booking.recurring ? "bg-primary" : "bg-success"
                            }`}
                          >
                            {booking.recurring ? "Recurring" : "Confirmed"}
                          </span>
                        )}

                        {/* Cancel Booking Button */}
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDeleteBooking(booking._id)}
                        >
                          Cancel Booking
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
    </div>
  );
};

export default AdminBookingsPage;
