import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const AuthPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    const url = isRegistering
      ? "http://localhost:5000/api/auth/register"
      : "http://localhost:5000/api/auth/login";

    const body = isRegistering
      ? { name, mobile, email, password }
      : { email, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (res.ok) {
        if (!isRegistering) {
          localStorage.setItem("token", data.token);
          alert("Login successful");
          navigate("/home");
        } else {
          alert("Registration successful. You can now log in.");
          setIsRegistering(false);
        }
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred.");
    }
  };

  return (
    <div className="d-flex vh-100 align-items-center justify-content-center bg-light">
      <div
        className="row shadow-lg rounded overflow-hidden bg-white"
        style={{ width: "850px", minHeight: "620px" }} // ⬅ Increased min-height
      >
        {/* Left Side - Form */}
        <div
          className="col-md-6 d-flex flex-column justify-content-center p-4"
          style={{ minHeight: "100%", overflowY: "auto" }} // ⬅ Prevent content cut-off
        >
          <h4 className="text-center fw-bold">
            {isRegistering ? "Create an Account" : "Welcome Back"}
          </h4>
          <p className="text-center text-muted">
            {isRegistering
              ? "Register with your details"
              : "Please enter your details"}
          </p>

          <form onSubmit={handleAuth} className="d-flex flex-column">
            {isRegistering && (
              <>
                <div className="mb-2">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label">Mobile Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="Enter your mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <div className="mb-2">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-danger w-100 mt-2">
              {isRegistering ? "Sign Up" : "Sign In"}
            </button>

            <p className="text-center mt-3">
              {isRegistering ? (
                <>
                  Already have an account?{" "}
                  <span
                    className="text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => setIsRegistering(false)}
                  >
                    Login here
                  </span>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <span
                    className="text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => setIsRegistering(true)}
                  >
                    Sign up
                  </span>
                </>
              )}
            </p>

            {/* ✅ Store Access Link */}
            <p className="text-center mt-2">
              <Link to="/store" className="text-success fw-bold">
                Visit the Store
              </Link>
            </p>
          </form>
        </div>

        {/* Right Side - Image */}
        <div className="col-md-6 d-flex align-items-center justify-content-center p-0 bg-light">
          <img
            src="/images/loginimg.jpg"
            alt="Login"
            className="img-fluid"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }} // ⬅ Fixed image size to fit
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
