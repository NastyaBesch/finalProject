
/******************************************************** */
// The purpose of this class is to handle schedules-related operations such as
// adding, deleting, and updating schedules. It also includes functionality to
// fetch all schedules from the database. This class utilizes the Express framework
// for creating and configuring routes. It establishes a connection to the database
// using ConnectDB. Additionally, it incorporates the path module for working with
// file paths and the fs module for file manipulation purposes.
/******************************************************** */

const express = require("express");
const router = express.Router();
const con = require("../ConnectDB");
const parseDate = require("../ParseDate");

/******************************************************** */
// Route: DELETE /api/deleteSchedulesByProject/:scheduleId
// Purpose: Deletes a schedule and its related data.
//          Updates dates of other schedules if required.
/******************************************************** */

router.delete("/api/deleteSchedulesByProject/:scheduleId", (req, res) => {
  const scheduleId = req.params.scheduleId;
  const { schedules, daysBetweenTasks } = req.body;

  // Delete the schedule with the specified scheduleId
  const deleteSchedulesQuery = "DELETE FROM schedules WHERE id = ?;";
  con.query(deleteSchedulesQuery, [scheduleId], (error, result) => {
    if (error) {
      console.error("Error deleting schedules:", error);
      res.status(500).json({ error: "Failed to delete schedules" });
      return; // Send response and return to avoid further execution
    }

    const deleteQaQuery = "DELETE FROM qa WHERE schedule_id = ?";
    con.query(deleteQaQuery, [scheduleId], (error, result) => {
      if (error) {
        console.error("Error deleting qa:", error);
        res.status(500).json({ error: "Failed to delete qa" });
        return; // Send response and return to avoid further execution
      }

      // Calculate days difference and find schedules to update
      const deletedSchedule = schedules.find(
        (schedule) => schedule.id === scheduleId
      );
      const countDays =
        Math.floor(
          (parseDate(deletedSchedule.formatted_start_date) -
            parseDate(deletedSchedule.formatted_finish_date)) /
            (1000 * 60 * 60 * 24)
        ) - parseInt(daysBetweenTasks[0].daysBetweenTasks);

      const schedulesToUpdate = schedules.filter(
        (schedule) =>
          parseDate(schedule.formatted_start_date) >=
          parseDate(deletedSchedule.formatted_finish_date)
      );

      if (schedulesToUpdate.length > 0) {
        // Function to update schedules with new start and finish dates
        const updateSchedules = (schedulesToUpdate, daysToAdd) => {
          const updateQuery = `
            UPDATE schedules
            SET start_date = DATE_ADD(start_date, INTERVAL ? DAY),
                finish_date = DATE_ADD(finish_date, INTERVAL ? DAY)
            WHERE id IN (?)
          `;

          const scheduleIds = schedulesToUpdate.map((schedule) => schedule.id);
          const params = [daysToAdd, daysToAdd, scheduleIds];

          con.query(updateQuery, params, (err, result) => {
            if (err) {
              console.error("Error updating schedules:", err);
            } else {
              console.log("Schedules updated successfully:", result);
            }
          });
        };

        // Update schedules with new start and finish dates
        updateSchedules(schedulesToUpdate, countDays);

        res
          .status(200)
          .json({ message: "Schedules deleted and updated successfully" });
      } else {
        // No schedules to update, simply delete the schedule
        res.status(200).json({ message: "Schedule deleted successfully" });
      }
    });
  });
});

/******************************************************** */
// Route: PUT /api/updateSchedule/:scheduleId
// Purpose: Updates schedule details.
//          Adjusts task statuses and dates of related schedules.
/******************************************************** */

router.put("/api/updateSchedule/:scheduleId", async (req, res) => {
  const scheduleId = req.params.scheduleId;
  const {
    description,
    task_status,
    user_id,
    start_date,
    finish_date,
    schedules,
    finishDateBeforeChange,
  } = req.body;

  let finishDateObject;
  let countDays;
  // Convert start_date and finish_date to Date objects using parseDate function
  const startDateObject = parseDate(start_date);

  if (task_status === "הושלם") {
    // Update finish_date to the current date if task_status is "הושלם"
    finishDateObject = new Date().toISOString().split("T")[0];
    console.log(finishDateObject, parseDate(finishDateBeforeChange));
    countDays = Math.floor(
      (parseDate(finishDateObject) - parseDate(finishDateBeforeChange)) /
        (1000 * 60 * 60 * 24)
    );
    console.log("countDays", countDays);
  } else {
    finishDateObject = parseDate(finish_date);
    // Calculate the difference in days between the old finish date and the new finish date
    countDays = Math.floor(
      (finishDateObject - parseDate(finishDateBeforeChange)) /
        (1000 * 60 * 60 * 24)
    );
  }

  // Filter schedules that need to be updated due to the change in finish date
  const schedulesToUpdate = schedules.filter(
    (schedule) =>
      parseDate(schedule.formatted_start_date) >=
      parseDate(finishDateBeforeChange)
  );

  // Function to update schedules with new start and finish dates
  const updateSchedules = async (schedulesToUpdate, daysToAdd) => {
    const updateQuery = `
      UPDATE schedules
      SET start_date = DATE_ADD(start_date, INTERVAL ? DAY),
          finish_date = DATE_ADD(finish_date, INTERVAL ? DAY)
      WHERE id IN (?)
    `;

    const scheduleIds = schedulesToUpdate.map((schedule) => schedule.id);
    const params = [daysToAdd, daysToAdd, scheduleIds];

    con.query(updateQuery, params, (err, result) => {
      if (err) {
        console.error("Error updating schedules:", err);
      } else {
        console.log("Schedules updated successfully:", result);
      }
    });
  };

  // Check if there is a change in days and schedules need to be updated
  if (countDays !== 0 && schedulesToUpdate.length > 0) {
    updateSchedules(schedulesToUpdate, countDays);
  }

  // Query to update the schedule in the database
  const updatedScheduleQuery =
    "UPDATE schedules SET description = ?, task_status = ?, user_id = ?, start_date = ?, finish_date = ? WHERE id = ?";
  const scheduleValues = [
    description,
    task_status,
    user_id,
    startDateObject,
    finishDateObject,
    scheduleId,
  ];

  // Execute the update query
  con.query(updatedScheduleQuery, scheduleValues, (err, result) => {
    if (err) {
      console.error("Error updating schedule:", err);
      res.status(500).json({ error: "Error updating schedule" });
    } else {
      console.log("Schedule updated successfully");
      res.json({ message: "Schedule updated successfully" });
    }
  });
});


/******************************************************** */
// Function: updateTaskStatus(schedule, currentDate)
// Purpose: Updates a schedule's task status based on conditions.
/******************************************************** */
const updateTaskStatus = (schedule, currentDate) => {
  const scheduleStartDate = schedule.start_date;
  const scheduleFinishDate = schedule.finish_date;
  
  if (
    (schedule.task_status === "נוצרה" && // Only update if not completed
      scheduleStartDate <= currentDate) ||
    (schedule.task_status === "באיחור" && 
      scheduleFinishDate > currentDate)
  ) {
    schedule.task_status = "בתהליך"; // Update the status to "בתהליך"
  }
};

/******************************************************** */
// Function: updateSingleSchedule(schedule)
// Purpose: Updates the task status of a single schedule.
//          Handles completion and delay scenarios.
/******************************************************** */

const updateSingleSchedule = (schedule) => {
  const currentDate = new Date();
  updateTaskStatus(schedule, currentDate);

  if (schedule.task_status === "בתהליך") {
    const newStatus =
      parseDate(schedule.formatted_finish_date) <= currentDate
        ? "באיחור"
        : "בתהליך";

    return new Promise((resolve, reject) => {
      const updatedScheduleQuery =
        "UPDATE schedules SET task_status = ? WHERE id = ?";
      const scheduleValues = [newStatus, schedule.id];

      con.query(updatedScheduleQuery, scheduleValues, (err, result) => {
        if (err) {
          console.error("Error updating schedule:", err);
          reject(err);
        } else {
          console.log("Schedule updated successfully");
          resolve();
        }
      });
    });
  } else {
    return Promise.resolve();
  }
};

/******************************************************** */
// Function: updateSchedules(schedules, res)
// Purpose: Updates task statuses in bulk using promises.
//          Responds with updated results.
/******************************************************** */

const updateSchedules = (schedules, res) => {
  const updatePromises = schedules.map(updateSingleSchedule);

  Promise.all(updatePromises)
    .then(() => {
      res.json(schedules); // Return the updated results
    })
    .catch((error) => {
      res.status(500).json({ error: "Error updating schedule" });
    });
};

/******************************************************** */
// Route: GET /api/schedulesByProject/:projectId
// Purpose: Retrieves schedules for a project.
//          Updates schedule statuses based on current date.
/******************************************************** */

router.get("/api/schedulesByProject/:projectId", (req, res) => {
  const projectId = req.params.projectId;

  con.query(
    "SELECT s.*, u.user_name, u.last_name, t.name AS task_name, DATE_FORMAT(s.start_date, '%d/%m/%Y') as formatted_start_date, DATE_FORMAT(s.finish_date, '%d/%m/%Y') as formatted_finish_date FROM schedules s JOIN tasks t ON s.task_id = t.id JOIN users u ON s.user_id = u.id WHERE s.project_id = ? ORDER BY s.start_date ASC",
    [projectId],
    (err, results) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        const currentDate = new Date();
        const updatedResults = results.map((schedule) => {
          updateTaskStatus(schedule, currentDate);
          return schedule;
        });

        updateSchedules(updatedResults, res);
      }
    }
  );
});
/******************************************************** */
// Function: fetchUpdatedSchedules(projectId, res)
// Purpose: Fetches schedules for a project.
//          Updates statuses based on current date.
/******************************************************** */

const fetchUpdatedSchedules = (projectId, res) => {
  con.query(
    "SELECT s.*, u.user_name, u.last_name, t.name AS task_name, DATE_FORMAT(s.start_date, '%d/%m/%Y') as formatted_start_date, DATE_FORMAT(s.finish_date, '%d/%m/%Y') as formatted_finish_date FROM schedules s JOIN tasks t ON s.task_id = t.id JOIN users u ON s.user_id = u.id WHERE s.project_id = ? ORDER BY s.start_date ASC",
    [projectId],
    (err, results) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        const currentDate = new Date();
        const updatedResults = results.map((schedule) => {
          updateTaskStatus(schedule, currentDate);
          return schedule;
        });

        updateSchedules(updatedResults, res);
      }
    }
  );
};

router.get("/api/schedulesByProject/:projectId", (req, res) => {
  const projectId = req.params.projectId;
  fetchUpdatedSchedules(projectId, res);
});


/******************************************************** */
// Route: POST /api/allSchedules
// Purpose: Fetches all schedules for a project.
/******************************************************** */

router.post("/api/allSchedules", (req, res) => {
  const { project_id } = req.body;

  con.query(
    "SELECT * FROM schedules WHERE project_id = ?",
    [project_id],
    (err, results) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(results);
      }
    }
  );
});

/******************************************************** */
// Route: POST /api/addSchedules
// Purpose: Adds a new schedule.
//          Converts dates and retrieves sorted schedules.
/******************************************************** */

const convertToIsoDate = (date) => new Date(date).toISOString().slice(0, 10);

const insertNewSchedule = (scheduleValues, res) => {
  const insertScheduleQuery =
    "INSERT INTO schedules (id, task_id, description, project_id, task_status, user_id, start_date, finish_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

  con.query(insertScheduleQuery, scheduleValues, (err, insertResult) => {
    if (err) {
      console.error("Error creating schedule:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    console.log("Schedule created successfully:", insertResult);
    retrieveSortedSchedules(res);
  });
};

const retrieveSortedSchedules = (res) => {
  const selectSortedSchedulesQuery =
    "SELECT * FROM schedules ORDER BY start_date";
  
  con.query(selectSortedSchedulesQuery, (err, schedules) => {
    if (err) {
      console.error("Error retrieving sorted schedules:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    return res.json({
      message: "Schedule created and retrieved successfully",
      schedules: schedules,
    });
  });
};

router.post("/api/addSchedules", (req, res) => {
  const {
    id,
    task_id,
    description,
    project_id,
    task_status,
    user_id,
    start_date,
    finish_date,
  } = req.body;

  const formattedStartDate = convertToIsoDate(start_date);
  const formattedFinishDate = convertToIsoDate(finish_date);

  const scheduleValues = [
    id,
    task_id,
    description,
    project_id,
    task_status,
    user_id,
    formattedStartDate,
    formattedFinishDate,
  ];

  insertNewSchedule(scheduleValues, res);
});


module.exports = router;
