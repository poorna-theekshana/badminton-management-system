import React, { useState, useEffect } from "react";

const BookingPage = () => {
  const [courts, setCourts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/courts", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCourts(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Book a Court</h1>
      <ul>
        {courts.map((court) => (
          <li key={court._id}>
            {court.name} - ${court.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookingPage;
