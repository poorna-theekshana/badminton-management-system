require("dotenv").config({ path: "./backend/.env" });

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const cron = require("node-cron");

// Import Models
const Booking = require("./models/Booking");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const courtRoutes = require("./routes/courtRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const itemRoutes = require("./routes/itemRoutes");
const userRoutes = require("./routes/userRoutes");

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("MONGO_URI is not set. Ensure .env is configured correctly.");
  process.exit(1);
}

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1);
  });

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/courts", courtRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/users", userRoutes);

// Scheduled Task for Recurring Bookings
cron.schedule("0 0 * * 1", async () => {
  console.log("Running recurring booking job...");

  try {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const recurringBookings = await Booking.find({ recurring: true });

    for (let booking of recurringBookings) {
      const newBooking = new Booking({
        user: booking.user,
        court: booking.court,
        date: nextWeek,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: "confirmed",
        recurring: true,
      });

      await newBooking.save();
      console.log(
        `Recurring booking added for user ${booking.user} on ${nextWeek}`
      );
    }

    console.log("Recurring bookings updated successfully.");
  } catch (err) {
    console.error("Error in recurring booking job:", err);
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
