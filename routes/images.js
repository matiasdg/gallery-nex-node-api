var express = require("express");
var router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const verifyToken = require("./../authentication/verifyToken");

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images"); // Destination directory where uploaded images will be saved
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename uploaded file to avoid naming conflicts
  },
});
const upload = multer({ storage: storage });

/* GET images listing. */
router.get("/", verifyToken, (req, res) => {
  const imagesDir = path.join(__dirname, "/../public", "images");
  fs.readdir(imagesDir, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return res.status(500).send("Internal Server Error");
    }
    const imagePaths = files.map((file) => `/images/${file}`);
    res.json(imagePaths);
  });
});

router.post("/upload", upload.single("image"), (req, res) => {
  try {
    // File uploaded successfully
    res.json({ message: "Image uploaded successfully" });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Error uploading image" });
  }
});

module.exports = router;
