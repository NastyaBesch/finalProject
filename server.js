const express = require("express");
const app = express();
const port = process.env.PORT || 4000;
const cors = require("cors");
const cron = require("node-cron"); // Import node-cron

app.use(express.json());
app.use(cors());

//Import route handlers
const loginRoute = require("./routes/Log");
const dataRoute = require("./routes/Users");
const tasksRoute = require("./routes/Tasks");
const projectsRoute = require("./routes/Projects");
const qaRoute = require("./routes/QA");
const schedulesRoute = require("./routes/Schedules");
const imagesRoute = require("./routes/Images");

// Import the router for deleting photos automatically
const deletePhotosRouter = require("./routes/deletePhotosRouter");

// Schedule the task on the 15th day of every month at midnight (00:00)
cron.schedule("0 0 22 * *", async () => {
  console.log("Running the task to delete photos on the 15th of every month...");
  try {
    await deletePhotosRouter.deletePhotosAutomatically();
  } catch (error) {
    console.error("Error deleting photos:", error);
  }
});

app.use(loginRoute);
app.use(dataRoute);
app.use(tasksRoute);
app.use(projectsRoute);
app.use(qaRoute);
app.use(schedulesRoute);
app.use(imagesRoute);
app.use(deletePhotosRouter);
// Serve static files from the 'public' directory
app.use(express.static('public'));



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

