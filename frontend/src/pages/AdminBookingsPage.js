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
      setBookings(groupBookingsByDate(data));
    } catch (error) {
      console.error("Error fetching admin bookings:", error);
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

      fetchAllBookings();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleMakeRecurring = async (bookingId) => {
    try {
      await fetch(`http://localhost:5000/api/bookings/recurring/${bookingId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      fetchAllBookings();
    } catch (error) {
      console.error("Error making booking recurring:", error);
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
          <h2 className="pb-4 pt-4">📋 All Bookings</h2>

          {bookings.map((group) => (
            <div key={group.date} className="card shadow-sm p-4 mb-4">
              <h4 className="fw-bold text-primary">
                {moment(group.date).format("dddd, MMM D YYYY")}
              </h4>
              {group.bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="d-flex align-items-center justify-content-between p-3 my-2 rounded shadow-sm bg-light"
                >
                  <div className="flex-grow-1 px-3">
                    <p>
                      <strong>Time Slot:</strong> {booking.startTime} -{" "}
                      {booking.endTime}
                    </p>
                    <p>
                      <strong>Name:</strong>{" "}
                      {booking.user?.name || "Unknown User"}
                    </p>
                  </div>
                  <div className="d-flex align-items-center">
                    {booking.recurring && (
                      <span className="badge bg-primary me-2">Recurring</span>
                    )}
                    <button
                      className="btn btn-info me-2"
                      onClick={() => handleMakeRecurring(booking._id)}
                    >
                      Make Recurring
                    </button>
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminBookingsPage;
