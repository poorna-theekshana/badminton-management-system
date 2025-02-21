import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import moment from "moment";

const ProfileCard = ({ user, totalBookings, lastBookingDate }) => {
  const memberSince = moment(user.createdAt).format("MMMM D, YYYY");
  const membershipDuration = moment(user.createdAt).fromNow(true); // Example: "2 years, 3 months"

  return (
    <div className="card shadow-sm p-4 bg-light">
      <div className="row align-items-center">
        <div className="col-md-3 text-center">
          <div className="profile-avatar">
            <span className="avatar-icon">👤</span>
          </div>
        </div>
        <div className="col-md-9">
          <h3 className="fw-bold">{user.name}</h3>
          <p className="text-muted">{user.email}</p>

          <div className="profile-info mt-3">
            <p>
              <strong>Member Since:</strong> {memberSince}
            </p>
            <p>
              <strong>Membership Duration:</strong> {membershipDuration}
            </p>
            <p>
              <strong>Total Bookings:</strong> {totalBookings}
            </p>
            <p>
              <strong>Last Booking:</strong>{" "}
              {lastBookingDate || "No bookings yet"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
