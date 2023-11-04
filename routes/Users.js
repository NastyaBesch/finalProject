/********************************************************
 * This class manages user-related operations including
 * adding, deleting, updating, and checking user existence.
 * It also fetches all users from the database. Utilizing
 * Express for routing, it connects to the database via
 * ConnectDB. The path and fs modules aid in file handling.
 ********************************************************/

const express = require("express");
const router = express.Router();
const con = require("../ConnectDB");

/**************************************************
 * Route to fetch employees from the database
 **************************************************/
router.post("/api/data", (req, res) => {
  con.query(`SELECT * FROM users`, (err, results) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

/**************************************************
 * Route to check the count of emails in the database
 **************************************************/

router.post("/api/emailCount", (req, res) => {
  const { email } = req.body;

  con.query(
    "SELECT * FROM users WHERE email = ?",
    [email.trim()],
    (err, results) => {
      console.log("results content", results.length, results);
      // Error handling
      if (err) {
        console.log("Error executing SQL query:", err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }

      // Verification logic
      if (results.length === 0) {
        res.status(401).json({ error: "Invalid Credentials" });
        return;
      }

      // Successful verification
      res.json({ success: true });
    }
  );
});

/**************************************************
 * Route to add an employee
 **************************************************/

router.post("/api/addUser", (req, res) => {
  const { id, user_name, last_name, email, password_hash, role } = req.body;
  console.log(req.body);

  // Insert the employee data into the users table
  const employeeSql =
    "INSERT INTO users (id, user_name, last_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?, ?)";
  const employeeValues = [id, user_name, last_name, email, password_hash, role];

  con.query(employeeSql, employeeValues, (err, employeeResult) => {
    if (err) {
      console.error("Error creating employee:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(true);
      console.log("Employee created successfully:", employeeResult);
    }
  });
});

/**************************************************
 * Route to update an employee
 **************************************************/

router.put("/api/updateEmployee/:employeeId", (req, res) => {
  const employeeId = req.params.employeeId;
  console.log(employeeId);

  const { user_name, last_name, email, password_hash, role } = req.body;

  const employeeUpdate =
    "UPDATE users SET user_name = ?, last_name = ?, email = ?, password_hash = ?, role = ? WHERE id = ?";
  const employeeValues = [
    user_name,
    last_name,
    email,
    password_hash,
    role,
    employeeId,
  ];

  con.query(employeeUpdate, employeeValues, (err, result) => {
    if (err) {
      console.error("Error updating employee:", err);
      res.status(500).json({ error: "Failed to update employee" });
    } else {
      console.log("Employee updated successfully");
      res.status(200).json({ message: "Employee updated successfully" });
    }
  });
});

module.exports = router;
