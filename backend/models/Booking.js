const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    court: { type: Number, required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isRecurring: { type: Boolean, default: false }, // Recurring Booking Flag
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    recurring: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
