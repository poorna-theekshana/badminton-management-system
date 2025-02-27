const express = require("express");
const Booking = require("../models/Booking");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all bookings 
router.get("/", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user", "name email");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get bookings for a specific user
router.get("/user/:userId", authMiddleware, async (req, res) => {
  try {
    // Prevent accessing other users' bookings
    if (req.user.role !== "admin" && req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({ message: "Unauthorized access!" });
    }

    const userBookings = await Booking.find({ user: req.params.userId }).populate(
      "user",
      "name email"
    );

    res.json(userBookings || []);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
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
      recurring: false,
    });

    await newBooking.save();
    res.status(201).json({ success: true, message: "Booking saved!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Delete a booking (Only the user who booked it or admin)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Allow only the booking owner or admin to delete it
    if (req.user.role !== "admin" && booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this booking" });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, message: "Booking deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all recurring bookings (Admin only)
router.get("/recurring", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized access!" });
    }

    const recurringBookings = await Booking.find({ recurring: true }).populate(
      "user",
      "name email"
    );

    res.json(recurringBookings || []);
  } catch (err) {
    console.error("Error fetching recurring bookings:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Mark a booking as recurring (Admin Only)
router.put("/recurring/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized access!" });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { recurring: true },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({
      success: true,
      message: "Booking marked as recurring",
      updatedBooking,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Remove a recurring booking (Admin Only)
router.put("/recurring/remove/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized access!" });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { recurring: false },
      { new: true }
    );

    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({
      success: true,
      message: "Recurring status removed",
      updatedBooking,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
