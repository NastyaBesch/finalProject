/************************************************** */
// Class to login verification
/************************************************** */

const express = require("express");
const router = express.Router();
const con = require("../ConnectDB");

/************************************************** */
// Route to handle login verification
/************************************************** */

router.post("/api/login", (req, res) => {
  // Destructure username and password from the request body
  const { username, password } = req.body;

  // Query the database to retrieve user information based on the username
  con.query(
    "SELECT * FROM users WHERE email = ?",
    [username.trim()],
    (err, results) => {
      if (err) {
        // Handle database query error
        console.log("Error executing SQL query:", err);
        res.status(500).json({ error: "Internal server error" });
      } else {
        if (results.length === 0) {
          // No matching user found
          res.status(401).json({ error: "Invalid Credentials" });
        } else {
          const user = results[0];
          if (user.password_hash !== password.trim()) {
            // Incorrect password
            res.status(401).json({ error: "Invalid credentials" });
          } else {
            // Successful login
            res.status(200).json({
              message: "Login successful",
              user_role: user.role, // Return the user's role
            });
          }
        }
      }
    }
  );
});

module.exports = router;
