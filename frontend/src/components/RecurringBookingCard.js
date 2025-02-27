import React from "react";
import moment from "moment";

const RecurringBookingCard = ({ booking, onRemoveRecurring }) => {
  return (
    <div className="d-flex align-items-center justify-content-between p-3 my-2 rounded shadow-sm bg-light">
      {/* Court Info */}
      <div
        className="text-white bg-dark p-3 rounded text-center"
        style={{ minWidth: "100px" }}
      >
        <h5 className="m-0">Court</h5>
        <h4 className="fw-bold m-0">C{booking.court}</h4>
      </div>

      {/* Booking Details */}
      <div className="flex-grow-1 px-3">
        <p className="mb-1">
          <strong>Date:</strong>{" "}
          {moment(booking.date).format("dddd, MMM D YYYY")}
        </p>
        <p className="mb-1">
          <strong>Time Slot:</strong> {booking.startTime} - {booking.endTime}
        </p>
        <p className="mb-1">
          <strong>Booked By:</strong> {booking.user?.name || "Unknown User"}
        </p>
        <p className="mb-1">
          <strong>Type:</strong>{" "}
          <span className="badge bg-primary p-2">Recurring</span>
        </p>
      </div>

      {/* Remove Recurring Button */}
      {onRemoveRecurring && (
        <button
          className="btn btn-danger"
          onClick={() => onRemoveRecurring(booking._id)}
        >
          Remove Recurring
        </button>
      )}
    </div>
  );
};

export default RecurringBookingCard;
