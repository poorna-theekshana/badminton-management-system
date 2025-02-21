const express = require("express");
const Booking = require("../models/Booking");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all bookings
router.get("/", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user", "name email");
    res.json(bookings); // Return a flat array instead of { bookings: [] }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get bookings for a specific user
router.get("/user/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const userBookings = await Booking.find({ user: userId });
    res.json(userBookings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Create a new booking
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { user, court, date, startTime, endTime } = req.body;

    if (!user || !court || !date || !startTime || !endTime) {
      return res.status(400).json({ message: "Missing booking details!" });
    }

    if (![1, 2, 3].includes(court)) {
      return res.status(400).json({ message: "Invalid court number!" });
    }

    const newBooking = new Booking({
      user,
      court,
      date,
      startTime,
      endTime,
      status: "confirmed",
    });

    await newBooking.save();
    res.status(201).json({ success: true, message: "Booking saved!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const deletedBooking = await Booking.findByIdAndDelete(bookingId);

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


module.exports = router;
