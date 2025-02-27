const express = require("express");
const router = express.Router();
const Court = require("../models/Court");
const authMiddleware = require("../middleware/authMiddleware");

// Get all courts
router.get("/", authMiddleware, async (req, res) => {
  try {
    const courts = await Court.find();
    res.status(200).json(courts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Register a new court
// router.post("/register", authMiddleware, async (req, res) => {
//   const { name, location, type } = req.body;

//   try {
//     const court = new Court({ name, location, type });
//     await court.save();
//     res.status(201).json({ message: "Court registered successfully", court });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

module.exports = router;
