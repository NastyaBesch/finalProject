/******************************************************** */
//The purpose of this class is to handle qa-related operations such as adding, deleting, and updating qa It also includes a functionality to fetch all qa from the database. This class utilizes the Express framework for creating and configuring routes. It establishes a connection to the database using ConnectDB. Additionally, it incorporates the path module for working with file paths and the fs module for file manipulation purposes.
/******************************************************** */

const express = require("express");
const router = express.Router();
const con = require("../ConnectDB");

/************************************************** */
// Route to fetch all QA from the database
/************************************************** */

router.post("/api/QA", (req, res) => {
  con.query("SELECT * FROM qa", (err, tasks) => {
    if (err) {
      console.log("Error retrieving tasks sent to qa");
      res.status(500).json({ error: "Internal server error" });
    }

    const scheduleIds = tasks.map((row) => row.schedule_id);
    const placeholders = scheduleIds.map(() => "?").join(",");
    console.log("placeholders", placeholders);
    const query = `
      SELECT qa.*, s.id, t.name AS task_name, p.name AS project_name
      FROM qa
      JOIN schedules AS s ON qa.schedule_id = s.id
      JOIN tasks AS t ON s.task_id = t.id
      JOIN projects AS p ON s.project_id = p.project_id
      WHERE s.id IN (${placeholders})
    `;
    con.query(query, scheduleIds, (err, schedules) => {
      if (err) {
        console.log("Failed to retreive data from the database", err);
        res.status(500).json({ error: "Internal server Error" });
      }
      const projectTaskNames = schedules.map((row) => ({
        ...row,

        image_1: `images/${row.image_1}`,
        image_2: `images/${row.image_2}`,
        image_3: `images/${row.image_3}`,
      }));
      res.status(200).json(projectTaskNames);
    });
  });
});

/************************************************** */
// Route to add a QA
/************************************************** */

router.post("/api/addQA", (req, res) => {
  const { qa_id, schedule_id, description, status } = req.body;
  // Construct the SQL query to update the schedule with QA details
  const sqlQuery = `
    INSERT INTO qa (qa_id, schedule_id, description, status)
    VALUES (?, ?, ?, ?)
  `;

  // Execute the SQL query with the provided QA data
  con.query(
    sqlQuery,
    [qa_id, schedule_id, description, status],
    (err, result) => {
      if (err) {
        console.error("Error adding QA:", err);
        res.status(500).json({ error: "Failed to add QA" });
      } else {
        // If the query is successful, return a response indicating success
        res.status(200).json({ message: "QA added successfully" });
      }
    }
  );
});

/************************************************** */
// Function to check if a qa exists
/************************************************** */

router.post("/api/qaCount", async (req, res) => {
  const { scheduleId } = req.body;

  con.query(
    "SELECT COUNT(*) AS count FROM qa WHERE schedule_id = ?",
    [scheduleId],
    (err, results) => {
      // console.log("results content", results);
      // Error handling
      if (err) {
        console.log("Error executing SQL query:", err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }

      const count = results[0].count;

      // Verification logic
      if (count > 0) {
        res.json({ success: true }); // QA exists
      } else {
        res.json({ success: false }); // QA doesn't exist
      }
    }
  );
});

/************************************************** */
// Route to delete a QA
/************************************************** */
router.delete("/api/deleteQa/:qaId", (req, res) => {
  const qaId = req.params.qaId;
  //console.log(qaId);

  const deleteQaQuery = "DELETE FROM qa WHERE qa_id = ?";
  con.query(deleteQaQuery, [qaId], (error, result) => {
    if (error) {
      console.error("Error deleting qa:", error);
      res.status(500).json({ error: "Failed to delete qa" });
    } else {
      res.status(200).json({ message: "QA deleted successfully" });
    }
  });
});

/************************************************** */
// Route to update a QA
/************************************************** */
router.put("/api/updateQA/:qaId", (req, res) => {
  const qaId = req.params.qaId;
  console.log(qaId);
  const { description, status, newDescription } = req.body;
  console.log(req.body);

  let currentDescription = description || ""; // Initialize with an empty string if description is null
  if (newDescription !== undefined && newDescription !== null) {
    currentDescription += "\n" + newDescription;
  }

  const updateQAQuery =
    "UPDATE qa SET description = ?, status = ? WHERE qa_id = ?";
  const qaValues = [currentDescription, status, qaId];

  con.query(updateQAQuery, qaValues, (err, result) => {
    if (err) {
      console.error("Error updating QA item:", err);
      res.status(500).json({ error: "Error updating QA item" });
    } else {
      res.json({ message: "QA item updated successfully" });
    }
  });
});

module.exports = router;
