/******************************************************** */
//The CheckBoxTask component uses the useState and useEffect hooks to manage form inputs and data fetching. It handles the form submission by constructing a schedules object with task details and sending it to the server using Axios. Upon successful schedule creation, the component updates the state to indicate the success and disables the form to prevent further submissions.
//The CheckBoxTaskList component, on the other hand, is responsible for displaying tasks and managing their scheduling. It uses the useEffect hook to fetch tasks and schedules from the server using the fetchTasks and fetchSchedules functions, respectively. Within fetchSchedules, it calculates the maxFinishDate from the existing schedules and updates the state with a new startDate based on the provided daysBetweenTasks.
/******************************************************** */

import React, { useEffect, useState } from "react";
import { Alert, Checkbox, Button, Input } from "antd";
import axios from "axios";
import { v4 } from "uuid";
import DropdownUsers from "./dropDown/DropUsers";
import "../../components/fragments/projects/forms/employeeAdd.css";

const CheckboxTask = ({ task, projectId, onChange, daysBetweenTasks, isStartDateEntered, setIsStartDateEntered, startDate }) => {
  const [description, setDescription] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [selectedUser, setSelectedUserID] = useState("");
  const [isSchedulesCreated, setIsSchedulesCreated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [startDateFirstTime, setStartDateFirstTime] = useState("")

  const currentDate = new Date().toISOString().split("T")[0]; // Get current date in "YYYY-MM-DD" format

  const handleUserChange = (event) => {
    const selectedUserId = event.target.value;
    setSelectedUserID(selectedUserId);
  };

  const handleChange = (e) => {
    setIsChecked(e.target.checked);
    onChange(e);
  };

  const handleSubmit = () => {
    
let schedules;
    
    
    if (isStartDateEntered) {
  schedules = {
    id: v4(),
    task_id: task.id,
    description: description,
    project_id: projectId,
    start_date: startDate, // This is used when isStartDateEntered is false
    finish_date: finishDate,
    user_id: selectedUser,
    task_status: "נוצרה",
  };
}
    else {
  schedules = {
    id: v4(),
    task_id: task.id,
    description: description,
    project_id: projectId,
    start_date: startDateFirstTime, // This is used when isStartDateEntered is true
    finish_date: finishDate,
    user_id: selectedUser,
    task_status: "נוצרה",
  };
}

    axios
      .post("http://localhost:4000/api/addSchedules", schedules)
      .then((response) => {
        setIsSchedulesCreated(true);
        setIsStartDateEntered(true); // Set isStartDateEntered to true after successful form submission
      })
      .catch((error) => {
        console.error("Error creating schedules:", error);
        setErrorMessage("Failed to create schedule. Please try again.");
      });
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

      <section dir="rtl" style={{ margin: "10px" }}>
        {!isSchedulesCreated && (
          <>
            <>
              <Checkbox onChange={handleChange} style={{ marginRight: "50px" }}>
                {task.name}
              </Checkbox>
              {/* ... (the rest of your component code) */}
            </>
            {isChecked && (
              <form className="formAdd">
                <div>
                  <label htmlFor="description">תיאור </label>
                  <Input
                    type="text"
                    id="description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                </div>
                {isStartDateEntered ? ( // If start date is entered, render the disabled input
                  <div>
                    <label htmlFor="startDate">תאריך התחלה</label>
                    <Input
                      type="date"
                      id="start_date"
                      value={startDate}
                      min={startDate}
                      disabled // Set disabled attribute to true
                    />
                  </div>
                ) : (
                  // If start date is not entered, render the enabled input
                  <div>
                    <label htmlFor="startDate">תאריך התחלה</label>
                    <Input
                      type="date"
                      id="start_date"
                      value={startDateFirstTime}
                      onChange={(e) => setStartDateFirstTime(e.target.value)}
                      min={currentDate} // Use the currentDate variable to set the minimum date
                    />
                  </div>
                )}
                <div>
                  <label htmlFor="finishDate">תאריך סיום</label>
                  <Input
                    type="date"
                    id="finishDate"
                    value={finishDate}
                    onChange={(e) => setFinishDate(e.target.value)}
                    min={
                      isStartDateEntered
                        ? startDate
                        : startDateFirstTime
                    }
                  />
                </div>
                <div>
                  <label>עובד אחראי</label>
                  <DropdownUsers
                    value={selectedUser}
                    onChange={handleUserChange}
                  />
                </div>
                <div>
                  <Button
                    onClick={handleSubmit}
                    type="primary"
                    style={{ marginTop: "20px" }}
                  >
                    הוספת משימה
                  </Button>
                </div>
              </form>
            )}
          </>
        )}
      </section>
    </>
  );
};


const CheckBoxTaskList = ({ projectId, daysBetweenTasks }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isStartDateEntered, setIsStartDateEntered] = useState(false);
  const [startDate, setStartDate] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/allTasks", {
          method: "POST",
        });
        const response = await res.json();
        setTasks(response);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    const fetchSchedules = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/allSchedules", {
          method: "POST",
          body: JSON.stringify({ project_id: projectId }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const response = await res.json();
        if (response.length > 0) {
          // Find the maximum finish_date from the schedules
          const maxFinishDate = response.reduce((maxDate, schedule) => {
            const finishDate = new Date(schedule.finish_date);
            return finishDate > maxDate ? finishDate : maxDate;
          }, new Date(0));
          // Calculate the new startDate based on maxFinishDate and daysBetweenTasks
          const newStartDate = new Date(maxFinishDate);
          newStartDate.setDate(
            newStartDate.getDate() + parseInt(daysBetweenTasks) + 1
          );
          // Convert the newStartDate to the required format "yyyy-MM-dd"
          const formattedStartDate = newStartDate.toISOString().slice(0, 10);

          // Update the state with the formattedStartDate
          setStartDate(formattedStartDate);
        }
        setIsStartDateEntered(response.length > 0);

        const scheduleTaskIds = response.map((schedule) => schedule.task_id);
        const filtered = tasks.filter(
          (task) => !scheduleTaskIds.includes(task.id)
        );
        setFilteredTasks(filtered);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      }
    };

    fetchTasks();
    fetchSchedules();
  }, [projectId, tasks]);

  return (
    <div>
      {filteredTasks.map((task) => (
        <CheckboxTask
          key={task.id}
          task={task}
          projectId={projectId}
          onChange={(e) => console.log(e)}
          daysBetweenTasks={daysBetweenTasks}
          isStartDateEntered={isStartDateEntered} // Pass the isStartDateEntered state to CheckboxTask component
          setIsStartDateEntered={setIsStartDateEntered} // Pass the setIsStartDateEntered function to CheckboxTask component
          startDate={startDate}
        />
      ))}
    </div>
  );
};

export default CheckBoxTaskList;
