import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css"; // Import the CSS file

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      console.log("Response:", res);
      console.log("Data:", data);
      if (res.ok) {
        localStorage.setItem("token", data.token);
        alert("Login successful");
        navigate("/home");
      } else {
        alert(`Login failed: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Login failed: An error occurred");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Registration successful");
        setIsRegistering(false);
      } else {
        alert(`Registration failed: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Registration failed: An error occurred");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Welcome to the Badminton Booking System</h1>
      {isRegistering ? (
        <form onSubmit={handleRegister} className="form">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
          <button type="submit" className="button">
            Register
          </button>
          <button
            type="button"
            onClick={() => setIsRegistering(false)}
            className="button button-secondary"
          >
            Cancel
          </button>
        </form>
      ) : (
        <form onSubmit={handleLogin} className="form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
          <button type="submit" className="button">
            Login
          </button>
          <button
            type="button"
            onClick={() => setIsRegistering(true)}
            className="button button-secondary"
          >
            Register
          </button>
        </form>
      )}
      <Link to="/booking" className="link">
        Go to Booking
      </Link>
    </div>
  );
};

export default LoginPage;
