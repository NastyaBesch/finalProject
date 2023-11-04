// Import the mysql2 library to work with MySQL databases
const mysql = require("mysql2");

// Create a connection configuration object to connect to the MySQL database
const con = mysql.createConnection({
  host: "localhost", 
  user: "root", 
  password: "Haifa1988!", 
  database: "final_project", 
  port: 3309, 
  waitForConnections: true,
  queueLimit: 0,
});

// Connect to the MySQL database using the connection configuration
con.connect((err) => {
  // Check if there was an error during the connection attempt
  if (err) {
    console.log("Error, Failed to connect to the database", err);
    return;
  }

  // If there was no error, the connection was successful
  console.log("Connection Successful");
});

// Export the 'con' object so it can be used in other parts of the application
module.exports = con;
