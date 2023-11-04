/************************************************** */
// Class to upload a photo
/************************************************** */

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const con = require("../ConnectDB");
const fs = require("fs");

/************************************************** */
// Define the fetchQAData function
// This function retrieves QA data based on the provided qaId
/************************************************** */
const fetchQAData = async (qaId) => {
  return new Promise((resolve, reject) => {
    con.query("SELECT * FROM qa WHERE qa_id = ?", [qaId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0]); // Assuming that you're expecting a single result
      }
    });
  });
};

/************************************************** */
// Set up multer storage for photo uploads
// This configuration specifies where and how to store uploaded images
/************************************************** */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images"); // Specify the directory where images will be stored
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    console.log(extension);
    cb(null, uniqueSuffix + extension);
  },
});

const upload = multer({ storage });

/************************************************** */
// Route to upload a photo and update QA data
// This route handles the photo upload and updates the relevant QA data
/************************************************** */
router.post("/upload-photo/:qaId", upload.single("photo"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No photo uploaded" });
  }

  const qaId = req.params.qaId; // Retrieve qaId from the URL parameter
  const photoUrl = req.file.filename;

  try {
    // Check if image_1 is null before updating
    const qaData = await fetchQAData(qaId); // Implement fetchQAData to retrieve QA data
    if (!qaData || qaData.image_1 === null) {
      con.query("UPDATE qa SET image_1 = ? WHERE qa_id = ?", [photoUrl, qaId]);
      return res.status(200).json({ photoUrl });
    } else if (qaData.image_2 === null) {
      con.query("UPDATE qa SET image_2 = ? WHERE qa_id = ?", [photoUrl, qaId]);
      return res.status(200).json({ photoUrl });
    } else if (qaData.image_3 === null) {
      con.query("UPDATE qa SET image_3 = ? WHERE qa_id = ?", [photoUrl, qaId]);
      return res.status(200).json({ photoUrl });
    } else {
      return res.status(400).json({ error: "All image slots are filled" });
    }
  } catch (error) {
    console.error("Error updating database:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

