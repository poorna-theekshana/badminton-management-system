import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./HomePage.css"; // Import the CSS file

const localizer = momentLocalizer(moment);

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetch("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user);
          } else {
            navigate("/login");
          }
        })
        .catch((err) => {
          console.error(err);
          navigate("/login");
        });
    }
  }, [navigate]);

  useEffect(() => {
    // Fetch bookings from the backend
    fetch("http://localhost:5000/api/bookings", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const formattedEvents = data.bookings.map((booking) => ({
          title: `Court ${booking.court}`,
          start: new Date(booking.startTime),
          end: new Date(booking.endTime),
          allDay: false,
          resource: booking,
        }));
        setEvents(formattedEvents);
      })
      .catch((err) => console.error(err));
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="home-container">
      <nav className="navbar">
        <h1>Badminton Booking System</h1>
        <button onClick={() => navigate("/login")}>Logout</button>
      </nav>
      <div className="side-panel">
        <ul>
          <li>Dashboard</li>
          <li>Bookings</li>
          <li>Profile</li>
        </ul>
      </div>
      <div className="main-content">
        <h2>Welcome, {user.name}</h2>
        {/* <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          views={["week"]}
          step={30}
          timeslots={1}
        /> */}
      </div>
    </div>
  );
};

export default HomePage;
