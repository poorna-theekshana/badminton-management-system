import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "./HomePage.css";

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  const timeSlots = Array.from({ length: 32 }, (_, i) =>
    moment()
      .startOf("day")
      .add(6 * 60 + i * 30, "minutes")
      .format("hh:mm A")
  );

  useEffect(() => {
    fetchBookings();
  }, []);

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

  const fetchBookings = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = await response.json();
      console.log("Bookings Data Fetched:", data);

      setBookings(data); // ✅ Ensure ALL bookings are stored
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const handleBookSlot = async (court, date, startTime) => {
    const token = localStorage.getItem("token");

    if (!user || !user._id) {
      alert("User authentication failed. Please login again.");
      return;
    }

    const currentDateTime = moment();
    const selectedDateTime = moment(
      `${date} ${startTime}`,
      "YYYY-MM-DD hh:mm A"
    );

    // Prevent past bookings
    if (selectedDateTime.isBefore(currentDateTime)) {
      alert("You cannot book past time slots.");
      return;
    }

    // Convert court to a valid number
    const courtNumber = parseInt(court.replace("C", ""), 10);
    if (isNaN(courtNumber)) {
      alert("Invalid court selection!");
      return;
    }

    // Calculate `endTime`
    const formattedStartTime = moment(startTime, "hh:mm A");
    const endTime = formattedStartTime
      .clone()
      .add(30, "minutes")
      .format("hh:mm A");

    // Check if the slot is already booked
    const isAlreadyBooked = bookings.some(
      (booking) =>
        booking.startTime === startTime &&
        booking.endTime === endTime &&
        booking.court === courtNumber &&
        booking.date === date
    );

    if (isAlreadyBooked) {
      alert("This slot is already booked. Please choose another.");
      return;
    }

    const bookingData = {
      user: user._id,
      court: courtNumber,
      date,
      startTime: formattedStartTime.format("hh:mm A"),
      endTime,
    };

    console.log("Booking Data:", bookingData);

    try {
      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      const responseData = await response.json();
      console.log("API Response:", responseData);

      if (!response.ok) {
        throw new Error(responseData.message || "Booking failed");
      }

      // Update UI in real-time
      setBookings([...bookings, bookingData]);
      await fetchBookings();
      console.log("Booking table updated successfully!");
    } catch (error) {
      console.error("Booking error:", error);
      alert("Booking failed: " + error.message);
    }
  };

  const getSlotColor = (time, court, date) => {
    const booking = bookings.find(
      (b) =>
        b.startTime === time &&
        b.court === parseInt(court.replace("C", ""), 10) &&
        moment(b.date).isSame(moment(date), "day")
    );

    const isPastSlot = moment(`${date} ${time}`, "YYYY-MM-DD hh:mm A").isBefore(
      moment()
    );

    if (isPastSlot) return "bg-secondary";
    if (!booking) return "bg-success"; 
    if (booking.recurring) return "bg-primary"; 
    return "bg-danger"; 
  };

  const isSlotBooked = (time, court, date) => {
    const booking = bookings.find(
      (b) =>
        b.startTime === time &&
        b.court === parseInt(court.replace("C", ""), 10) &&
        moment(b.date).isSame(moment(date), "day")
    );

    if (!booking) return ""; // Empty for available slots
    return booking.isRecurring ? "bg-primary" : "bg-danger"; // Blue for recurring, red for normal
  };

  if (!user) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container-fluid" style={{ marginTop: "88px" }}>
      <Navbar />
      <div className="row">
        <div className="col-md-2">
          <Sidebar />
        </div>
        <div className="col-md-10 p-4">
          <h2>Welcome, {user.name}</h2>
          <div className="mb-3">
            <h3 className="text-muted pt-3">
              Court Status{" "}
              <h4 className="text-muted pt-1">
                Available
                <span className="badge bg-success p-2 mx-2">     </span>/ Booked
                <span className="badge bg-danger p-2 mx-2">     </span>/
                Recurring
                <span className="badge bg-primary p-2 mx-2">     </span> / Past
                <span className="badge bg-secondary p-2 mx-2">     </span>
              </h4>
            </h3>
          </div>
          <div className="card p-3 shadow">
            <table className="table table-bordered text-center">
              <thead>
                <tr>
                  <th>Time</th>
                  {[...Array(7)].map((_, dayIdx) => (
                    <th key={dayIdx} colSpan="3">
                      {moment().add(dayIdx, "days").format("dddd")}
                    </th>
                  ))}
                </tr>
                <tr>
                  <th></th>
                  {[...Array(7)].map((_, dayIdx) =>
                    ["C1", "C2", "C3"].map((court) => (
                      <th key={`${dayIdx}-${court}`}>{court}</th>
                    ))
                  )}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time) => (
                  <tr key={time}>
                    <td>{time}</td>
                    {[...Array(7)].map((_, dayIdx) =>
                      ["C1", "C2", "C3"].map((court) => {
                        const date = moment()
                          .add(dayIdx, "days")
                          .format("YYYY-MM-DD");
                        const slotColor = getSlotColor(time, court, date);
                        const isPastSlot = moment(
                          `${date} ${time}`,
                          "YYYY-MM-DD hh:mm A"
                        ).isBefore(moment());

                        return (
                          <td
                            key={`${date}-${time}-${court}`}
                            className={slotColor}
                            onClick={() =>
                              slotColor === "bg-success" &&
                              !isPastSlot &&
                              handleBookSlot(court, date, time)
                            }
                            style={{
                              cursor:
                                slotColor === "bg-success" && !isPastSlot
                                  ? "pointer"
                                  : "not-allowed",
                            }}
                          ></td>
                        );
                      })
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
