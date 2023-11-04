const express = require("express");
const router = express.Router();
const con = require("../ConnectDB");
const fs = require("fs");
const path = require("path");

router.delete("/delete-photos-automatically", async (req, res) => {
  try {
    const [qaEntries] = await con.promise().query("SELECT * FROM qa");
    const deletedPhotosInfo = [];

    for (const qaEntry of qaEntries) {
      const qaId = qaEntry.qa_id;
      const imageFields = ["image_1", "image_2", "image_3"];
      const photoUrls = [];

      for (const imageField of imageFields) {
        const photoUrl = qaEntry[imageField];

        if (photoUrl) {
          await con
            .promise()
            .query(`UPDATE qa SET ${imageField} = NULL WHERE qa_id = ?`, [
              qaId,
            ]);
          const imagePath = path.join("public/images", photoUrl);
          fs.unlink(imagePath, (err) => {
            if (err) {
              console.error("Error deleting image:", err);
            } else {
              console.log("Deleted image:", imagePath);
            }
          });
          photoUrls.push(photoUrl);
        }
      }

      deletedPhotosInfo.push({ qaId, deletedPhotos: photoUrls });
    }

    return res
      .status(200)
      .json({ message: "Photos deleted automatically", deletedPhotosInfo });
  } catch (error) {
    console.error("Error deleting photos:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
