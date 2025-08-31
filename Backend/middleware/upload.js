// backend/middleware/upload.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "notesapp_media", // folder in Cloudinary
    resource_type: "auto",    // auto detects image, video, pdf
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
