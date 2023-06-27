import React, { useEffect, useState } from "react";
import { Alert, Checkbox, Button, Input } from "antd";
import axios from "axios";
import { v4 } from "uuid";
import DropdownUsers from "./dropDown/DropUsers";
import "../../components/fragments/projects/forms/employeeAdd.css";

const CheckboxTask = ({
  task,
  projectId,
  onChange,
  daysBetweenTasks,
  startDate,
}) => {
  const [description, setDescription] = useState("");
  const [finishDate, setFinishDate] = useState("");
  const [startDateTask, setStartDateTask] = useState("");
  const [status, setStatus] = useState("נוצרה");
  const [taskIdSelected, setTaskIdSelected] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [selectedUser, setSelectedUserID] = useState("");
  const [isSchedulesCreated, setIsSchedulesCreated] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [previousFinishDate, setPreviousFinishDate] = useState("");


  // useEffect(() => {
  //   const previousFinishDate = new Date(finishDate);
  //   previousFinishDate.setDate(previousFinishDate.getDate() + daysBetweenTasks);
  //   setPreviousFinishDate(previousFinishDate.toISOString().split("T")[0]);
  // }, [finishDate, daysBetweenTasks]);

  const validateForm = () => {
    //Validate start date and finish date
    if (
      startDateTask === "" ||
      startDateTask > finishDate || startDateTask < startDate ||
      startDate < new Date()
    ) {
      setErrorMessage("תאריך התחלה צריך להיות מוקדם מתאריך סיום");
      return false;
    }

    if (
      finishDate === "" ||
      finishDate < startDateTask ||
      finishDate < new Date()
    ) {
      setErrorMessage("תאריך התחלה חייב להיות או היום או מאוחר יותר");
      return false;
    }
    return true;
  };

  const handleFinishDateChange = (event) => {
    setFinishDate(event.target.value);
  };

  const handleStartDateChange = (event) => {
    setStartDateTask(event.target.value);
  };

  const handleUserChange = (event) => {
    const selectedUserId = event.target.value;
    setSelectedUserID(selectedUserId);
  };

  const handleChange = (e) => {
    setIsChecked(e.target.checked);
    handleTaskChange(e.target.checked);
    onChange(e);
  };

  const handleTaskChange = (checked) => {
    if (checked) {
      setTaskIdSelected(task.id);
    } else {
      setTaskIdSelected("");
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const schedules = {
      id: v4(),
      task_id: taskIdSelected,
      description: description,
      project_id: projectId,
      start_date: startDateTask,
      finish_date: finishDate,
      user_id: selectedUser,
      task_status: status,
    };

    
    axios
      .post("http://localhost:4000/api/addSchedules", schedules)
      .then((response) => {
       
        setStartDateTask("");
        setFinishDate("");
        setTaskIdSelected("");
        setSelectedUserID("");
        setIsSchedulesCreated(true);
        setSuccessMessage("המשימה נוספה לפרויקט");
        setDescription("");
       // setPreviousFinishDate( finishDate.toISOString().split("T")[0] + daysBetweenTasks);
        setFinishDate("");
    

        // Call the onProjectCreate function to trigger the request for updated tasks
        onProjectCreate();
      })
      .catch((error) => {
        console.error("Error creating schedule:", error);
      });
      console.log(daysBetweenTasks);
      console.log(previousFinishDate);
      
  };

  return (
    <>
      {/* Error and success alerts */}
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

      <section dir="rtl" style={{ margin: "10px" }}>
        {!isSchedulesCreated && (
          <>
            <Checkbox onChange={handleChange} style={{ marginRight: "50px" }}>
              {task.name}
            </Checkbox>
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
                <div>
                  <label htmlFor="startDate">תאריך התחלה</label>
                  <Input
                    type="date"
                    id="startDate"
                    value={startDate}
                   // placeholder="12.04.2023"
                    // Use previous finish date as placeholder value
                    onChange={handleStartDateChange}
                  />
                </div>
                <div>
                  <label htmlFor="finishDate">תאריך סיום</label>
                  <Input
                    type="date"
                    id="finishDate"
                    value={finishDate}
                    onChange={handleFinishDateChange}
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

const CheckBoxTaskList = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

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

  // const onProjectCreate = async () => {
  //   try {
  //     const res = await fetch("http://localhost:4000/api/allTasks", {
  //       method: "POST",
  //     });
  //     const response = await res.json();
  //     setTasks(response);
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };

  return (
    <div>
      {filteredTasks.map((task) => (
        <CheckboxTask
          key={task.id}
          task={task}
          projectId={projectId}
          onChange={(e) => console.log(e)}
          // onProjectCreate={onProjectCreate}
        />
      ))}
    </div>
  );
};

export default CheckBoxTaskList;
