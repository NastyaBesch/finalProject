/******************************************************** */
//The purpose of this class is to handle task-related operations such as adding, deleting, and updating task It also includes a functionality to fetch all task from the database. This class utilizes the Express framework for creating and configuring routes. It establishes a connection to the database using ConnectDB. Additionally, it incorporates the path module for working with file paths and the fs module for file manipulation purposes.
/******************************************************** */

const express = require("express");
const router = express.Router();
const con = require("../ConnectDB");

  /************************************************** */
  // Route to add a new Task
  /************************************************** */

  router.post("/api/addTask", (req, res) => {
    const { id, name } = req.body;

    // Insert the task data into the tasks table
    const taskSql = "INSERT INTO tasks (id, name) VALUES (?, ?)";
    const taskValues = [id, name];

    con.query(taskSql, taskValues, (err, taskResult) => {
      if (err) {
        console.error("Error creating task:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      console.log("Task created successfully:", taskResult);
      return res.status(200).json({ success: true });
    });
  });
  /************************************************** */
  // Route to fetch all tasks where status = "באיחור" from the database
  /************************************************** */

  router.post("/api/tasksAlert", (req, res) => {
    // Executing the SQL query to retrieve tasks in delay and their names
    con.query(
      "SELECT s.start_date, s.finish_date, t.name AS task_name, p.name AS project_name FROM schedules s JOIN tasks t ON s.task_id = t.id JOIN projects p ON s.project_id = p.project_id WHERE s.task_status = 'באיחור'",
      (err, results) => {
        if (err) {
          console.error("Error executing SQL query:", err);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          console.log(results);
          res.json(results);
        }
      }
    );
  });
  /************************************************** */
  // Route to fetch all tasks from the database
  /************************************************** */

  router.post("/api/allTasks", (req, res) => {
    con.query("SELECT * FROM tasks", (err, results) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.json(results);
      }
    });
  });
  /************************************************** */
  // Route to check the count of name task in the database
  /************************************************* */

  router.post("/api/taskCount", (req, res) => {
    const { taskName } = req.body;
    console.log(taskName);
    con.query(
      "SELECT COUNT(*) AS count FROM tasks WHERE name = ?",
      [taskName.trim()],
      (err, results) => {
        console.log("results content", results[0].count);
        // Error handling
        if (err) {
          console.log("Error executing SQL query:", err);
          res.status(500).json({ error: "Internal server error" });
          return;
        }

        // const taskCount = results[0].count;

        // // Verification logic
        // if (taskCount !== 0) {
        //   return res.json({ success: false });
        // }

        // // Successful verification
        console.log(results[0].count);
        res.json(results[0].count);
      }
    );
  });
  
  module.exports = router;