/******************************************************** */
//The FormProjectAdd component is a form used to add new projects. It manages input values, error and success messages, and handles form submission. It includes input fields for project details, a dropdown for selecting a responsible employee, and options for adding tasks. The component validates form fields and sends data to an API endpoint.
/******************************************************** */

import React, { useState } from "react";
import { Button, Alert, Switch, Input } from "antd";
import axios from "axios";
import { v4 } from "uuid";
import CheckBoxTaskList from "../../CheckBoxTasks";
import DropdownUsers from "../../dropDown/DropUsers";
import FormTaskAdd from "./FormTasksAdd";
import { validateFormProjectFields } from "./validateFormProject";
import "./employeeAdd.css";

const FormProjectAdd = () => {
  // State Variables
  const [project_name, setProjectName] = useState("");
  const [status, setStatus] = useState("נוצר");
  const [errorMessage, setErrorMessage] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [selectedUser, setSelectedUserID] = useState("");
  const [projectId, setProjectId] = useState("");
  const [isProjectCreated, setIsProjectCreated] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [onChange, setOnChange] = useState(false);
  const [daysBetweenTasks, setDaysBetweenTasks] = useState(0);
  const [isProjectNameValid, setIsProjectNameValid] = useState(true);
  const [isStartDateValid, setIsStartDateValid] = useState(true);
  const [isFinishDateValid, setIsFinishDateValid] = useState(true);
  const [isUserSelected, setIsUserSelected] = useState(true);

  const currentDate = new Date().toISOString().split("T")[0]; // Get current date in "YYYY-MM-DD" format

  const handleUserChange = (event) => {
    // Update selected user ID
    const selectedUserId = event.target.value;
    setSelectedUserID(selectedUserId);
  };

  const handleDaysBetweenTasks = (event) => {
    // Update days between tasks
    setDaysBetweenTasks(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate form fields
    const isValid = validateFormProjectFields(
      project_name,
      selectedUser,
      startDate,
      finishDate
    );

    setIsProjectNameValid(project_name !== "");
    setIsUserSelected(selectedUser.trim() !== "");
    setIsStartDateValid(startDate !== "" && new Date(startDate) > new Date());
    setIsFinishDateValid(
      finishDate !== "" && new Date(finishDate) > new Date(startDate)
    );

    if (!isValid) {
      setErrorMessage("אנא מלא את כל השדות כראוי");
      return;
    } else {
      // Create a new project object
      const project = {
        name: project_name,
        project_id: v4(),
        user_id: selectedUser,
        start_date: startDate,
        finish_date: finishDate,
      };

      // Make a POST request to add the project
      axios
        .post("http://localhost:4000/api/addProject", project)
        .then((response) => {
          // Reset form fields and set success message
          setProjectName("");
          setFinishDate("");
          setStartDate("");
          setSelectedUserID("");
          setIsProjectCreated(true);
          setProjectId(project.project_id);
          setSuccessMessage("הפרויקט נוצר. אנא תוסיף את המשימות");
        })
        .catch((error) => {
          console.error("Error creating project:", error);
        });
    }
  };

  const handleSwitchChange = (checked) => {
    // Update the switch state
    setOnChange(checked);
  };

  return (
    <>
      {errorMessage && (
        <Alert
          className="alert"
          message={errorMessage}
          type="error"
          closable
          onClose={() => setErrorMessage("")}
        />
      )}
      {successMessage && (
        <Alert
          className="alert"
          message={successMessage}
          type="success"
          closable
          onClose={() => setSuccessMessage("")}
        />
      )}
      {!isProjectCreated && (
        <form className="formAdd" onSubmit={handleSubmit} dir="rtl">
          <div className={isProjectNameValid ? "" : "invalid"}>
            {/* Project Name */}
            <label htmlFor="project_name">שם פרויקט</label>
            <input
              type="text"
              id="project_name"
              value={project_name}
              onChange={(event) => setProjectName(event.target.value)}
            />
          </div>
          <div className={isStartDateValid ? "" : "invalid"}>
            {/* Start Date */}
            <label htmlFor="startDate">תאריך התחלה</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={currentDate} // Set the minimum allowed date to the current date
            />
          </div>
          <div className={isFinishDateValid ? "" : "invalid"}>
            {/* Finish Date */}
            <label htmlFor="finishDate">תאריך סיום</label>
            <input
              type="date"
              id="finishDate"
              value={finishDate}
              onChange={(e) => setFinishDate(e.target.value)}
              min={startDate} // Set the minimum allowed date to the selected start date
            />
          </div>
          <div>
            {/* Days Between Tasks */}
            <label htmlFor="daysBetweenTasks"> מספר ימים בין משימות </label>
            <input
              type="number"
              id="daysBetweenTasks"
              value={daysBetweenTasks}
              min={0} // Set the minimum allowed value to 0
              onChange={handleDaysBetweenTasks}
            />
          </div>
          <div className={isUserSelected ? "" : "invalid"}>
            {/* Responsible Employee */}
            <label>עובד אחראי</label>
            <DropdownUsers value={selectedUser} onChange={handleUserChange} />
          </div>

          <div>
            {/* Submit Button */}
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginTop: "20px" }}
            >
              ליצור פרויקט חדש
            </Button>
          </div>
        </form>
      )}
      {isProjectCreated && (
        <section dir="rtl">
          {/* Checkbox Task List */}
          <CheckBoxTaskList
            onSubmit={handleSubmit}
            projectId={projectId}
            daysBetweenTasks={daysBetweenTasks}
            startDate={startDate}
          />
          <p>ליצור משימה חדשה</p>
          {/* Switch Button */}
          <Switch defaultChecked onChange={handleSwitchChange} />
          {onChange && (
            <>
              {/* Form for Adding New Task */}
              <FormTaskAdd />
            </>
          )}
        </section>
      )}
    </>
  );
};

export default FormProjectAdd;
