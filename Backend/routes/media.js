const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Media = require("../models/Media");
const fetchuser = require("../middleware/fetchuser");

// Multer config (store file temporarily before uploading to Cloudinary)
const storage = multer.diskStorage({});
const upload = multer({ storage });

// ✅ Upload Route
router.post("/upload", fetchuser, upload.single("file"), async (req, res) => {
  try {
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);

    // Save in MongoDB
    const newMedia = new Media({
      filename: req.file.originalname,
      url: result.secure_url,
      public_id: result.public_id,  // ✅ store Cloudinary public_id
      user: req.user.id             // ✅ link to logged-in user
    });

    await newMedia.save();

    res.json(newMedia);
  } catch (err) {
    console.error("❌ Upload error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get All Media for Logged-in User
router.get("/all", fetchuser, async (req, res) => {
  try {
    const media = await Media.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(media);
  } catch (err) {
    console.error("❌ Fetch error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete Media
router.delete("/delete/:id", fetchuser, async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ error: "Media not found" });

    // Ensure media belongs to logged-in user
    if (media.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not authorized" });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(media.public_id);

    // Delete from MongoDB
    await media.deleteOne();

    res.json({ success: true, message: "Media deleted" });
  } catch (err) {
    console.error("❌ Delete error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
