const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Booking = require("../models/Booking");
const authMiddleware = require("../middleware/authMiddleware");

// Get all users (Admin Only)
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized access!" });
    }

    const users = await User.find().select("-password"); // Exclude password field
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a user (Admin Only)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized access!" });
    }

    // Remove all bookings linked to the user
    await Booking.deleteMany({ user: req.params.id });

    // Delete user
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Toggle User Role 
router.put("/toggle-role/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Unauthorized access!" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = user.role === "admin" ? "user" : "admin";
    await user.save();

    res.json({
      success: true,
      message: "User role updated",
      updatedUser: user,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
