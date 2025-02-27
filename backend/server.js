const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const cron = require("node-cron");
const Booking = require("./models/Booking");

const authRoutes = require("./routes/authRoutes");
const courtRoutes = require("./routes/courtRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const itemRoutes = require("./routes/itemRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Ensure `uploads` folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Configure Multer for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save images in 'uploads' folder
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using UUID + timestamp
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(
      file.originalname
    )}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// ✅ MongoDB Connection
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("❌ MONGO_URI is not set!");
  process.exit(1);
}

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/courts", courtRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/users", userRoutes);

// ⏳ Schedule a task to run every Monday at midnight (12:00 AM)
cron.schedule("0 0 * * 1", async () => {
  console.log("🔄 Running recurring booking job...");

  try {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7); // Move date 7 days ahead

    // Fetch all bookings that have `recurring: true`
    const recurringBookings = await Booking.find({ recurring: true });

    for (let booking of recurringBookings) {
      // Create a new booking for the same slot in the next week
      const newBooking = new Booking({
        user: booking.user,
        court: booking.court,
        date: nextWeek, // Set for next week
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: "confirmed",
        recurring: true, // Keep it recurring
      });

      await newBooking.save();
      console.log(`✅ Recurring booking added for ${booking.user} on ${nextWeek}`);
    }
    
    console.log("🎯 Recurring bookings updated successfully!");
  } catch (err) {
    console.error("❌ Error in recurring booking job:", err);
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
