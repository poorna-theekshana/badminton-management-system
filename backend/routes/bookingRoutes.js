const express = require("express");
const Booking = require("../models/Booking");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all bookings
router.get("/", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user", "name email");
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
