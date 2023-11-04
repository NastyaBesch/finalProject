/************************************************** */
//The component FormTaskAdd provides a form for adding tasks. When the form is submitted, it sends a POST request to a specified API endpoint to create a new task.
/************************************************** */

import React, { useState } from "react";
import axios from "axios";
import { Alert, Button } from "antd";
import { v4 } from "uuid";
import "../forms/employeeAdd.css";

const FormTaskAdd = () => {
  const [taskName, setTaskName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    if (taskName.trim() === "") {
      setErrorMessage("אנא הכנס משימה");
      setTimeout(() => {
        setErrorMessage("");
      }, 1200);
      return false;
    }
    return true;
  };

  const checkTaskExists = async () => {
    try {
      const response = await axios.post("http://localhost:4000/api/taskCount", {
        taskName,
      });
      return response.data > 0;
    } catch (error) {
      console.error("Error checking task:", error);
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    let taskExists = await checkTaskExists();
    if (taskExists) {
      setTaskName("");
      setErrorMessage("משימה כבר קיימת במערכת");
      setTimeout(() => {
        setErrorMessage("");
      }, 1200);
      return;
    }

    const task = {
      name: taskName,
      id: v4(),
    };

    try {
      const response = await axios.post(
        "http://localhost:4000/api/addTask",
        task
      );
      setTaskName("");
      setErrorMessage("");
      setSuccessMessage("המשימה נוצרה");
      setTimeout(() => {
        setSuccessMessage("");
       // setTaskExists(false); // Reset taskExists after successful addition
      }, 1200);
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} dir="rtl" className="formAdd">
        <p>יצירת משימה</p>

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
        <div>
          <label htmlFor="taskName">שם המשימה</label>
          <input
            className="input"
            type="text"
            id="taskName"
            value={taskName}
            onChange={(event) => setTaskName(event.target.value)}
          />
        </div>
        <div>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginTop: "20px" }}
          >
            ליצור משימה
          </Button>
        </div>
      </form>
    </>
  );
};

export default FormTaskAdd;

