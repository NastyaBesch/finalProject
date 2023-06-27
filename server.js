/************************************************ */
//                DEPENDENSIES
/************************************************ */

const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const path = require("path");
const cors = require("cors");

/*************************************************** */
//          SERVER CONFIGURATION
/*************************************************** */
app.use(express.json()); // Middleware for parsing JSON data
app.use(cors()); // Middleware for enabling CORS

/***************************************************** */
//              BASIC DATABASE CONFIGURATION
// configure based on you system/work enviroment
/***************************************************** */
const mysql = require("mysql2");// Import MySQL

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Haifa1988!",
  database: "final_project",
  port: 3309,
  waitForConnections: true,
  queueLimit: 0,
});

con.connect((err) => {
  if (err) {
    console.log("Error, Failed to connect to the database", err);
    return;
  }
  console.log("Connection Successful");
});

app.get("/", (req, res) => {
  res.status(200).json("Home Page");
});

/************************************************** */
//        POST-VERIFY LOGIN CREDENTIALS
/************************************************* */

app.post("/api/login", (req, res) => {
  // Destructuring of request into username(Email@) and password
  const { username, password } = req.body;
  console.log(username, password);
  // console.log("UserName:" + username + "Password:" + password);
  //we trim the string received in the request becaouse it arrives with leading and/or following white spaces,
  //COULD NOR DETERMIN WHY!
  con.query(
    "SELECT * FROM users WHERE email = ?",
    [username.trim()],
    (err, results) => {
      console.log("results content", results.length, results);
      //error handling:
      if (err) {
        console.log("Error executing SQL query:", err);
        res.status(500).json({ error: "Internal server error" });
      }
      //handling of failure to verify user
      else {
        if (results.length === 0) {
          res.status(401).json({ error: "Invalid Credentials" });
        }
        //handle unmaching passwords
        else {
          const user = results[0];
          if (user.password_hash !== password.trim()) {
            res.status(401).json({ error: "Invalid credentials" });
          }
          //handle successfull verification of both username(Email@) and password
          else {
            //request user type for verified user
            con.query(
              "SELECT role_id FROM user_role WHERE user_id = ?",
              [user.id],
              (err, result) => {
                //errro handle
                if (err) {
                  res.status(500).json({ error: "Internal server Error" });
                }
                //successfull retrieval of user type from database will be processed into a json file that will be returned back to the front end
                else {
                  res.status(200).json({
                    message: "Login successful",
                    user_role: result[0].role_id,
                  });
                }
              }
            );
          }
        }
      }
    }
  );
});
/************************************************** */
//        Route to fetch employees from the database
/************************************************* */

app.post("/api/data", (req, res) => {
  con.query(
    `SELECT * FROM users`,
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


/************************************************** */
// Route to check the count of emails in the database
/************************************************* */

app.post("/api/emailCount", (req, res) => {
  const { email } = req.body;

  con.query("SELECT * FROM users WHERE email = ?", [email.trim()], (err, results) => {
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
  });
});


  // const query = "SELECT COUNT(*) AS count FROM users WHERE email = ?";
  // con.query(query, [email], (error, results) => {
  //   if (error) {
  //     console.log("Error fetching data from the database:", error);
  //     res.status(500).json({ error: "Internal Server Error" });
  //     return;
  //   }
  //   const count = results[0].count;
  //   console.log(" api/emailCount ",count)
  //   res.json(count)
  // });
// });

/************************************************** */
// Route to check the count of name task in the database
/************************************************* */

app.post("/api/taskCount", (req, res) => {
  const { taskName } = req.body;
  con.query(
    "SELECT * FROM tasks WHERE name = ?",
    [taskName.trim()],
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

// /************************************************** */
// //    Route to fetch all roles from the database
// /************************************************* */
// app.post("/api/allRoles", (req, res) => {
//   con.query("SELECT * FROM role", (err, results) => {
//     if (err) {
//       console.error("Error executing SQL query:", err);
//       res.status(500).json({ error: "Internal Server Error" });
//     } else {
//       res.json(results);
//     }
//   });
// });


/************************************************** */
//    Route to fetch all schedules from the database
/************************************************* */
// app.post("/api/schedulesByProject", (req, res) => {
//   const projectId = req.body.projectId; // Assuming the project ID is provided in the request body
//   console.log("server", projectId);
//   con.query(
//     "SELECT * FROM schedules WHERE project_id = ?",
//     [projectId],
//     (err, results) => {
//       console.log(results);
//       if (err) {
//         console.error("Error executing SQL query:", err);
//         res.status(500).json({ error: "Internal Server Error" });
//       } else {
//         res.json(results);
//       }
//     }
//   );
// });


/************************************************** */
//    Route to fetch schedules according to project id
/************************************************* */

app.get("/api/schedulesByProject/:projectId", (req, res) => {
  const projectId = req.params.projectId;
  con.query(
    "SELECT s.*, u.user_name, u.last_name, t.name AS task_name FROM schedules s JOIN tasks t ON s.task_id = t.id JOIN users u ON s.user_id = u.id WHERE s.project_id = ?",
    [projectId],
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

/************************************************** */
//    Route to fetch schedules according to project id
/************************************************* */ 

app.post("/api/allSchedules", (req, res) => {
  const { project_id } = req.body;
  console.log("allSchedules");

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


// /************************************************** */
// // Route to fetch subtasks according to a task ID
// /************************************************** */

// app.get("/api/subTasksByTaskId/:taskId", async (req, res) => {
//   const { taskId } = req.params;
//   console.log(taskId);

//   try {
//     const query = `
//       SELECT *
//       FROM subtasks s
//       JOIN tasks_subtasks ts ON s.subtask_id = ts.subtask_id
//       WHERE ts.task_id = ?
//     `;
//     const subTasks = await pool.query(query, [taskId]);

//     res.json(subTasks);
//   } catch (error) {
//     console.error("Error fetching subtasks:", error);
//     res.status(500).json({ error: "Failed to fetch subtasks" });
//   }
// });





// /************************************************** */
// // Route to fetch all subtasks 
// /************************************************** */

// app.post("/api/allSubTasks", (req, res) => {
//   console.log("sub");
//   con.query("SELECT subtasks.name FROM subtasks", (err, results) => {
//     if (err) {
//       console.error("Error executing SQL query:", err);
//       res.status(500).json({ error: "Internal Server Error" });
//     } else {
//       res.json(results);
//     }
//   });
// });

/************************************************** */
// Route to fetch all tasks from the database
/************************************************** */

app.post("/api/allTasks", (req, res) => {
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
// Route to fetch all projects from the database
/************************************************** */

app.post("/api/allProject", (req, res) => {
  console.log("sub");
  con.query("SELECT * FROM projects", (err, results) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});
/************************************************** */
// Route to fetch all tasks where status = "באיחור" from the database
/************************************************** */

app.post("/api/tasksAlert", (req, res) => {
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
// Route to add a new employee
/************************************************** */

app.post("/api/addUser", (req, res) => {
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
      console.log("Employee created successfully:", employeeResult);
    }
  });
});

/************************************************** */
// Route to add a new subTask to Task 
/************************************************** */

// app.post("/api/addSubTask", (req, res) => {
//   const { id, name, task_id } = req.body;
//   console.log(req.body);

//   // Insert the employee data into the users table
//   const SubtaskSql = "INSERT INTO subtasks (subtask_id, name) VALUES (?, ?)";
//   const subTaskValues = [id, name];
//  console.log(subTaskValues);
//   con.query(SubtaskSql, subTaskValues, (err, employeeResult) => {
//     if (err) {
//       console.error("Error creating employee:", err);
//       res.status(500).json({ error: "Internal Server Error" });
//     } else {
//       console.log("SubTask created successfully:", employeeResult);

//       // Insert the employee role data into the user_role table
//       const TaskSql =
//         "INSERT INTO tasks_subtasks (	subtask_id,	task_id	) VALUES (?, ?)";
//       const taskValues = [id, task_id];
// console.log(taskValues);
//       con.query(TaskSql, taskValues, (roleErr, roleResult) => {
//         if (roleErr) {
//           console.error("Error inserting role_employee data:", roleErr);
//           res.status(500).json({ error: "Internal Server Error" });
//         } else {
//           console.log("Task_subtask  data inserted successfully:", roleResult);
//           res.json({ message: "SubTask created successfully" });
//         }
//       });
//     }
//   });
// });

/************************************************** */
// Route to add a new Task
/************************************************** */

app.post("/api/addTask", (req, res) => {
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
// Route to add a new Project
/************************************************** */

app.post("/api/addProject", (req, res) => {
  const {
    project_id,
    name,
    team_id,
    start_date,
    finish_date,
  } = req.body;
  console.log(req.body);

  // Insert the project data into the projects table
  const ProjectSql =
    "INSERT INTO projects (project_id, name, team_id, start_date, finish_date) VALUES (?, ?, ?, ?, ?)";
  const ProjectValues = [
    project_id,
    name,
    team_id,
    start_date,
    finish_date,
  ];

  con.query(ProjectSql, ProjectValues, (err, projectResult) => {
    if (err) {
      console.error("Error creating project:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      console.log("Project created successfully:", projectResult);
      res.json({ message: "Project created successfully" });
    }
  });
});
app.post("/api/addSchedules", (req, res) => {
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
  console.log(req.body);

  /************************************************** */
  // Insert the project data into the projects table
  /************************************************** */

  const ProjectSql =
    "INSERT INTO schedules (id, task_id, description, project_id, task_status, user_id, start_date, finish_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  const ProjectValues = [
    id,
    task_id,
    description,
    project_id,
    task_status,
    user_id,
    start_date,
    finish_date,
  ];

  con.query(ProjectSql, ProjectValues, (err, projectResult) => {
    if (err) {
      console.error("Error creating project:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      console.log("Project created successfully:", projectResult);
      res.json({ message: "Project created successfully" });
    }
  });
});

/************************************************** */
// Route to delete an employee
/************************************************** */

// app.delete("/api/deleteEmployee/:employeeId", (req, res) => {
//   const employeeId = req.params.employeeId;
//   console.log("id", employeeId);

//   const deleteUserRoleQuery = "DELETE FROM user_role WHERE user_id = ?";
//   con.query(
//     deleteUserRoleQuery,
//     [employeeId],
//     (deleteUserRoleError, deleteUserRoleResult) => {
//       if (deleteUserRoleError) {
//         console.error("Error deleting user roles:", deleteUserRoleError);
//         res.status(500).json({ error: "Failed to delete user roles" });
//       } else {
//         const deleteUserQuery = "DELETE FROM users WHERE id = ?";
//         con.query(
//           deleteUserQuery,
//           [employeeId],
//           (deleteUserError, deleteUserResult) => {
//             if (deleteUserError) {
//               console.error("Error deleting employee:", deleteUserError);
//               res.status(500).json({ error: "Failed to delete employee" });
//             } else {
//               console.log("Employee deleted successfully");
//               res.json({ message: "Employee deleted successfully" });
//             }
//           }
//         );
//       }
//     }
//   );
// });

/************************************************** */
// Route to update an employee
/************************************************** */

app.put("/api/updateEmployee/:employeeId", (req, res) => {
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

/************************************************** */
// Route to update an employee
/************************************************** */

app.put("/api/updateProject/:projectId", (req, res) => {
  const projectId = req.params.projectId;
  console.log(projectId);

  const { name, description, team_id, status } = req.body;

 const projectUpdate =
   "UPDATE projects SET name = ?, description = ?, team_id = ?, status = ? WHERE project_id = ?";

  // const projectValues = [name, description, start_date, finish_date, status, projectId];
 const projectValues = [
   name,
   description,
   team_id,
   status,
   projectId,
 ];
  con.query(projectUpdate, projectValues, (err, result) => {
    if (err) {
      console.error("Error updating project:", err);
      res.status(500).json({ error: "Failed to update employee" });
    } else {
      console.log("Project updated successfully");
      res.status(200).json({ message: "Project updated successfully" });
    }
  });
});

/***************************************************** */
//        posts the contents of QA table
/**
 * allso posts sets of data related to the QA table
 * such as project name and task name maybe even dates
 * that is remains to be discussed
 */
app.post("/api/QA", (req, res) => {
  con.query("SELECT * FROM qa", (err, tasks) => {
    if (err) {
      console.log("Error retrieving tasks sent to qa");
      res.status(500).json({ error: "Internal server error" });
    }
    /**from the qa table we get the schedule ids
     * from schedules we get task and project ids
     * from projects and tasks we get names
     */
    const scheduleIds = tasks.map((row) => row.schedule_id);
    console.log("scheduleIds", scheduleIds);
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




app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
