import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BookingCard from "../components/BookingCard";
import RecurringBookingCard from "../components/RecurringBookingCard";

const RecurringBookingsPage = () => {
  const [recurringBookings, setRecurringBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // Store user role

  useEffect(() => {
    fetchRecurringBookings();
    getUserRole();
  }, []);

  const fetchRecurringBookings = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/bookings/recurring",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recurring bookings");
      }

      const data = await response.json();
      console.log("🔄 Recurring Bookings Data:", data);
      setRecurringBookings(data);
    } catch (error) {
      console.error("Error fetching recurring bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get the user role (Admin or not)
  const getUserRole = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) throw new Error("Failed to fetch user data");

      const data = await response.json();
      setUser(data.user); // Store user data (role)
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const handleRemoveRecurring = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/bookings/recurring/remove/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchRecurringBookings(); // Refresh list
    } catch (error) {
      console.error("Error removing recurring booking:", error);
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
          <h2 className="mb-4">🔄 Recurring Bookings</h2>

          {loading ? (
            <p className="text-center">Loading...</p>
          ) : recurringBookings.length === 0 ? (
            <p className="text-center text-muted">
              No recurring bookings found.
            </p>
          ) : (
            recurringBookings.map((booking) => (
              <RecurringBookingCard
                key={booking._id}
                booking={booking}
                onRemoveRecurring={
                  user?.role === "admin" ? handleRemoveRecurring : null
                }
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default RecurringBookingsPage;

