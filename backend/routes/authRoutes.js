const express = require("express");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const { generateToken } = require("../utils/jwt");
const authMiddleware = require("../middleware/authMiddleware");

require("dotenv").config();
const router = express.Router();

// User registration
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password, mobile } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ message: "User already exists" });

      user = new User({ name, email, password, mobile: mobile || "N/A" });
      await user.save();

      const token = generateToken(user);
      res.status(201).json({ message: "User registered successfully", token });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// User login
router.post(
  "/login",
  [
    check("email", "Enter a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user)
        return res.status(400).json({ message: "Invalid credentials" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Invalid credentials" });

      const token = generateToken(user);
      res.json({ message: "Login successful", token });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

//  Get current user info
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
