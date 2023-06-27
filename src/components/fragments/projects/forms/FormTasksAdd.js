/************************************************** */
//The component FormTaskAdd provides a form for adding tasks. When the form is submitted, it sends a POST request to a specified API endpoint to create a new task.
/************************************************** */

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Alert, Button } from "antd";
import { v4 } from "uuid";
import "../forms/employeeAdd.css";

const FormTaskAdd = () => {
  const [taskName, setTaskName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [taskExists, setTaskExists] = useState(false);

  const validateForm = () => {
    if (taskName.trim() === "") {
      setErrorMessage("אנא הכנס משימה");
      return false;
    }
    return true;
  };

  const checkTaskExists = () => {
    return axios
      .post("http://localhost:4000/api/taskCount", { taskName })
      .then((response) => {
        setTaskExists(response.data);
      })
      .catch((error) => {
        console.error("Error checking task:", error);
      });
  };

  useEffect(() => {
    checkTaskExists();
  }, [taskName]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (taskExists) {
      setTaskName("");
      setErrorMessage("משימה כבר קיימת במערכת");
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
      setTaskExists(false)
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
