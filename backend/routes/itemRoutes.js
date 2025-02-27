const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Multer Storage for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueFilename = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage });

// GET all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
});

// Add New Item
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, quantity } = req.body;

    // Validate required fields
    if (!name || !description || !price || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Ensure the image path is stored in the database
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newItem = new Item({
      name,
      description,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
      image: imagePath,
    });

    await newItem.save();
    res.status(201).json({ message: "Item added successfully", item: newItem });
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ message: "Failed to add item", error });
  }
});

// UPDATE item quantity only
router.put("/:id", async (req, res) => {
  try {
    const { quantity } = req.body;
    if (isNaN(quantity) || quantity < 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { quantity: parseInt(quantity, 10) },
      { new: true }
    );

    if (!updatedItem)
      return res.status(404).json({ message: "Item not found" });

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Error updating item", error });
  }
});

// DELETE item
router.delete("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Remove Image File if Exists
    if (item.image) {
      const imagePath = path.resolve(__dirname, "..", item.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Delete file from uploads
      }
    }

    // Remove item from the database
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item and image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item", error });
  }
});

module.exports = router;
