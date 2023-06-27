

  // const handleDeleteEmployee = async (employeeId) => {
  //   try {
  //     const res = await fetch(
  //       `http://localhost:4000/api/deleteEmployee/${employeeId}`,
  //       {
  //         method: "DELETE",
  //       }
  //     );
  //     const response = await res.json();
  //     console.log(response);
  //     // Handle any further actions or updates after deletion
  //   } catch (error) {
  //     console.error("Error deleting employee:", error);
  //   }


  import React, { useState } from "react";
  import { Button, Alert, Switch, Input } from "antd";
  import axios from "axios";
  import { v4 } from "uuid";
  import CheckBoxTaskList from "../../CheckBoxTasks";
  import DropdownUsers from "../../dropDown/DropUsers";
  import FormTaskAdd from "./FormTasksAdd";

  const FormProjectAdd = () => {
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

    const validateForm = () => {
      if (project_name.trim() === "") {
        setErrorMessage("אנא הכנס שם פרויקט");
        return false;
      }

      if (selectedUser.trim() === "") {
        setErrorMessage("בבקשה תבחר עובד אחראי");
        return false;
      }

      if (
        startDate === "" ||
        startDate > finishDate ||
        startDate < new Date()
      ) {
        setErrorMessage("תאריך התחלה צריך להיות מוקדם מתאריך סיום");
        return false;
      }

      if (finishDate === "" || finishDate < new Date()) {
        setErrorMessage("תאריך התחלה חייב להיות או היום או מאוחר יותר");
        return false;
      }
      return true;
    };

    const handleFinishDateChange = (event) => {
      setFinishDate(event.target.value);
    };

    const handleStartDateChange = (event) => {
      setStartDate(event.target.value);
    };

    const handleUserChange = (event) => {
      const selectedUserId = event.target.value;
      setSelectedUserID(selectedUserId);
    };
    const handleDaysBetweenTasks = (event) => {
      setDaysBetweenTasks(event.target.value);
    };

    const handleSubmit = (event) => {
      event.preventDefault();

      if (!validateForm()) {
        return;
      }

      const project = {
        name: project_name,
        project_id: v4(),
        user_id: selectedUser,
        start_date: startDate,
        finish_date: finishDate,
      };

      axios
        .post("http://localhost:4000/api/addProject", project)
        .then((response) => {
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
    };

    const handleSwitchChange = (checked) => {
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
            <div>
              <label htmlFor="project_name" className="label">
                שם פרויקט
              </label>
              <input
                type="text"
                id="project_name"
                value={project_name}
                onChange={(event) => setProjectName(event.target.value)}
              />
            </div>
            <div>
              <label htmlFor="startDate">תאריך התחלה</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={handleStartDateChange}
              />
            </div>
            <div>
              <label htmlFor="daysBetweenTasks">Days Between Tasks</label>
              <Input
                type="number"
                id="daysBetweenTasks"
                value={daysBetweenTasks}
                onChange={handleDaysBetweenTasks}
              />
            </div>
            <div>
              <label htmlFor="finishDate">תאריך סיום</label>
              <input
                type="date"
                id="finishDate"
                value={finishDate}
                onChange={handleFinishDateChange}
              />
            </div>
            <div>
              <label>עובד אחראי</label>
              <DropdownUsers value={selectedUser} onChange={handleUserChange} />
            </div>

            <div>
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
            <CheckBoxTaskList
              onSubmit={handleSubmit}
              projectId={projectId}
              daysBetweenTasks={daysBetweenTasks}
              startDate={startDate}
            />
            <p>ליצור משימה חדשה</p>
            <Switch defaultChecked onChange={handleSwitchChange} />
            {onChange && (
              <>
                <FormTaskAdd />
              </>
            )}
          </section>
        )}
      </>
    );
  };

  export default FormProjectAdd;
