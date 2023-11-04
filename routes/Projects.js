/******************************************************** */
//The purpose of this class is to handle project-related operations such as adding, deleting, and updating projects. It also includes a functionality to fetch all projects from the database. This class utilizes the Express framework for creating and configuring routes. It establishes a connection to the database using ConnectDB. Additionally, it incorporates the path module for working with file paths and the fs module for file manipulation purposes.
/******************************************************** */ 

const express = require("express");
const router = express.Router();
const con = require("../ConnectDB");
const path = require("path");
const fs = require("fs");

/************************************************** */
// Route to update a project
/************************************************** */
router.put("/api/updateProject/:projectId", (req, res) => {
  const projectId = req.params.projectId;
  const { name, user_id } = req.body;

  const projectUpdate =
    "UPDATE projects SET name = ?, user_id = ? WHERE project_id = ?";

  const projectValues = [name, user_id, projectId];
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

/************************************************** */
// Function to update the status of a single project based on its 
//schedules and QA status
/************************************************** */

const updateSingleProject = async (project) => {
  // Fetch schedules associated with the current project
  const schedules = await fetchSchedulesByProject(project.project_id);
  
  const allAlert = [false, false, false, false, false];
  
  // Check if any schedule is in "הושלם" status
  allAlert[0] = schedules.some((schedule) => schedule.task_status === "הושלם");
  // Check if any schedule is in "בתהליך" status
  allAlert[1] = schedules.some((schedule) => schedule.task_status === "בתהליך");
  // Check if any schedule is in "באיחור" status
  allAlert[2] = schedules.some((schedule) => schedule.task_status === "באיחור");

  // Check QA status for each schedule and track alerts
  const allQaCompleted = await Promise.all(
    schedules.map(async (schedule) => {
      // Fetch QA statuses associated with the current schedule
      const qaStatuses = await fetchQAStatusesBySchedule(schedule.id);
      
      // Check if any QA status is "בבדיקה" and set alert
      if (qaStatuses[0] === "בבדיקה") {
        allAlert[3] = true;
      } else if (qaStatuses[0] === "בתיקון") {
        // Check if any QA status is "בתיקון" and set alert
        allAlert[4] = true;
      }

      // Check if all QA statuses are "הושלם"
      return qaStatuses.every((qaStatus) => qaStatus === "הושלם");
    })
  );

  // Check if any alert is triggered
  const anyAlert = allAlert.some((alert) => alert);

  // Update project status based on alerts and QA completion
  if (allAlert[0] && allQaCompleted.every((qaCompleted) => qaCompleted)) {
    // If all tasks are completed and all QA statuses are "הושלם"
    await updateProjectStatus(project.project_id, "הושלם");
    project.status = "הושלם";
    allAlert[0] = true;
  } else if (anyAlert) {
    // If any alert is triggered
    await updateProjectStatus(project.project_id, "בתהליך");
    project.status = "בתהליך";
  } else {
    // If no specific condition is met, keep the project's existing status
    await updateProjectStatus(project.project_id, project.status);
    project.status = project.status;
  }
  
  // Attach alert statuses to the project and return the updated project
  project.alert = allAlert;
  return project;
};


/************************************************** */
// Route handler to fetch all projects and update their status
/************************************************** */

router.post("/api/allProject", async (req, res) => {
  try {
    // Fetch all projects from the database
    const projects = await fetchAllProjects();
    
    // Update the status of each project using the updateSingleProject function
    const updatedProjects = await Promise.all(
      projects.map(async (project) => updateSingleProject(project))
    );

    // Respond with the updated project data
    res.json(updatedProjects);
  } catch (error) {
    // If an error occurs during fetching or updating, handle and respond with an error
    console.error("Error fetching and updating projects:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Function to fetch all projects from the database
const fetchAllProjects = () => {
  // Creating and returning a promise to encapsulate the asynchronous database query
  return new Promise((resolve, reject) => {
    // Execute a SQL query to fetch all projects along with user information
    con.query(
      "SELECT p.*, u.user_name, u.last_name FROM projects p JOIN users u ON p.user_id = u.id",
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
};


/************************************************** */
// Function to fetch schedules for a specific project 
//from the database
/************************************************** */

const fetchSchedulesByProject = (projectId) => {
  // Creating and returning a promise to encapsulate the asynchronous database query
  return new Promise((resolve, reject) => {
    // Execute a SQL query to select schedules based on the provided project ID
    con.query(
      "SELECT * FROM schedules WHERE project_id = ?",
      [projectId],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
};

/************************************************** */
// Function to fetch QA statuses for a specific schedule 
// from the database
/************************************************** */
const fetchQAStatusesBySchedule = (scheduleId) => {
  // Creating and returning a promise to encapsulate the asynchronous database query
  return new Promise((resolve, reject) => {
    // Execute a SQL query to select QA statuses based on the provided schedule ID
    con.query(
      "SELECT status FROM qa WHERE schedule_id = ?",
      [scheduleId],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          console.log("results", results);
          // Extract the QA statuses from the query results using the 'map' function
          const qaStatuses = results.map((row) => row.status);
          console.log("qaStatuses", qaStatuses);
          // Resolve the promise with the array of QA statuses
          resolve(qaStatuses);
        }
      }
    );
  });
};

/************************************************** */
// Function to update the status of a project in the database
/************************************************** */

const updateProjectStatus = (projectId, status) => {
  // Creating and returning a promise to encapsulate the asynchronous database query
  return new Promise((resolve, reject) => {
    // Execute a SQL query to update the status of the project based on the provided project ID
    con.query(
      "UPDATE projects SET status = ? WHERE project_id = ?",
      [status, projectId],
      (err, results) => {
        if (err) {

          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
};


/************************************************** */
// Route to add a project
/************************************************** */

router.post("/api/addProject", (req, res) => {
  const { project_id, name, user_id, status, daysBetweenTasks } = req.body;

  console.log(req.body);
  // Insert the project data into the projects table
  const ProjectSql =
    "INSERT INTO projects (project_id, name, user_id, status, daysBetweenTasks) VALUES (?, ?, ?, ?, ?)";
  const ProjectValues = [project_id, name, user_id, status, daysBetweenTasks];

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
//    Route to fetch daysBetweenTasks according to project id
/************************************************* */

router.get("/api/daysBetweenTasksByProject/:projectId", (req, res) => {
  const projectId = req.params.projectId;
  con.query(
    "SELECT daysBetweenTasks FROM projects WHERE project_id = ? ",
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
// Function to select deleted schedule IDs
/************************************************** */

const selectDeletedScheduleIds = (projectId, callback) => {
  const query = "SELECT id FROM schedules WHERE project_id = ?";
  con.query(query, [projectId], (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      const deletedScheduleIds = result.map((row) => row.id);
      callback(null, deletedScheduleIds);
    }
  });
};

/************************************************** */
// Function to select QA entries associated with deleted schedules
/************************************************** */

const selectQAEntries = (deletedScheduleIds, callback) => {
  const query = "SELECT * FROM qa WHERE schedule_id IN (?)";
  con.query(query, [deletedScheduleIds], (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, result);
    }
  });
};

/************************************************** */
// Function to delete images and return deleted photo URLs
/************************************************** */

const deleteImagesAndGetUrls = (qaEntries, callback) => {
  const deletedPhotoUrls = [];

  for (const qaEntry of qaEntries) {
    const imageFields = ["image_1", "image_2", "image_3"];

    for (const imageField of imageFields) {
      const photoUrl = qaEntry[imageField];

      if (photoUrl) {
        const imagePath = path.join("public/images", photoUrl);
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error("Error deleting image:", err);
          } else {
            console.log("Deleted image:", imagePath);
          }
        });
        deletedPhotoUrls.push(photoUrl);
      }
    }
  }

  callback(null, deletedPhotoUrls);
};

/************************************************** */
// Function to delete QA entries by schedule IDs
/************************************************** */

const deleteQAEntries = (deletedScheduleIds, callback) => {
  const query = "DELETE FROM qa WHERE schedule_id IN (?)";
  con.query(query, [deletedScheduleIds], (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null);
    }
  });
};

/************************************************** */
// Function to delete schedules by project ID
/************************************************** */

const deleteSchedules = (projectId, callback) => {
  const query = "DELETE FROM schedules WHERE project_id = ?";
  con.query(query, [projectId], (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null);
    }
  });
};

/************************************************** */
// Function to delete project by project ID
/************************************************** */
const deleteProject = (projectId, callback) => {
  const query = "DELETE FROM projects WHERE project_id = ?";
  con.query(query, [projectId], (err, result) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null);
    }
  });
};

/************************************************** */
// Route handler to delete a project and its associated data
/************************************************** */

router.delete("/api/deleteProject/:projectId", (req, res) => {
  const projectId = req.params.projectId;

  selectDeletedScheduleIds(projectId, (selectErr, deletedScheduleIds) => {
    if (selectErr) {
      console.error("Error selecting deleted schedules:", selectErr);
      return res.status(500).json({ error: "Failed to select deleted schedules" });
    }

    selectQAEntries(deletedScheduleIds, (qaErr, qaEntries) => {
      if (qaErr) {
        console.error("Error selecting QA entries:", qaErr);
        return res.status(500).json({ error: "Failed to select QA entries" });
      }

      deleteImagesAndGetUrls(qaEntries, (deleteImageErr, deletedPhotoUrls) => {
        if (deleteImageErr) {
          return res.status(500).json({ error: "Failed to delete images" });
        }

        deleteQAEntries(deletedScheduleIds, (deleteQAErr) => {
          if (deleteQAErr) {
            return res.status(500).json({ error: "Failed to delete QA entries" });
          }

          deleteSchedules(projectId, (deleteSchedulesErr) => {
            if (deleteSchedulesErr) {
              return res.status(500).json({ error: "Failed to delete schedules" });
            }

            deleteProject(projectId, (deleteProjectErr) => {
              if (deleteProjectErr) {
                return res.status(500).json({ error: "Failed to delete project" });
              }

              res.status(200).json({
                message: "Project and associated data deleted successfully",
                deletedPhotos: deletedPhotoUrls,
              });
            });
          });
        });
      });
    });
  });
});

module.exports = router;
