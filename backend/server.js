const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const cron = require("node-cron");

const authRoutes = require("./routes/authRoutes");
const courtRoutes = require("./routes/courtRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const Booking = require("./models/Booking");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/courts", courtRoutes);
app.use("/api/bookings", bookingRoutes);

// **✅ Cleanup job to remove past bookings every midnight**
cron.schedule("59 23 * * *", async () => {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Ensure the full day is covered

    const result = await Booking.deleteMany({ date: { $lt: today } });

    console.log(`🗑️ ${result.deletedCount} expired bookings deleted at midnight`);
  } catch (error) {
    console.error("❌ Error while deleting expired bookings:", error);
  }
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
