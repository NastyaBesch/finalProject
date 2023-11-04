import React, { useState } from "react";
import { Button, Modal, Form, Input, Alert, message } from "antd";
import { EditTwoTone } from "@ant-design/icons";
import DropdownUsers from "../dropDown/DropUsers";

const ModalScheduleUpdate = ({
  schedule,
  projectId,
  schedules,
  finishDateBeforeChange,
}) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const statuses = ["הושלם", "בתהליך"];
  const [selectedUser, setSelectedUserID] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUserChange = (event) => {
    const selectedUserId = event.target.value;
    setSelectedUserID(selectedUserId);
  };

  const validUpdate = (status, startDate) => {
    const parsedStartDate = new Date(startDate.split("/").reverse().join("-"));
    const currentDate = new Date();

    if (status === "הושלם" && parsedStartDate > currentDate) {
       setErrorMessage(
        "לא ניתן לקבוע סטטוס 'הושלם' למשימות שיש להן תאריך התחלה בעתיד"
      );
      setTimeout(() => {
        setErrorMessage("")
      }, 1000);
     
      return false; // Invalid update
    }

    
    setErrorMessage(""); // Clear error message if valid
    return true; // Valid update
  };


  // Function to handle the schedule update
  const handleUpdateSchedule = async (scheduleId, values) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/updateSchedule/${scheduleId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: values.description,
            task_status: values.task_status,
            user_id: values.user_id,
            start_date: values.start_date,
            finish_date: values.finish_date,
            project_id: projectId,
            schedules: schedules,
            finishDateBeforeChange: finishDateBeforeChange,
          }),
        }
      );

      const response = await res.json();

      console.log(response);
      handleSuccessUpdate();
    } catch (error) {
      console.error("Error updating schedules:", error);
    }
  };

  // Function to handle the status change
  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };

  // Function to handle the success update
  const handleSuccessUpdate = () => {
    setOpen(false);
    window.location.reload(false); // Reload the page without using cache
  };
  // Function to handle the button click
  const handleClick = async () => { 
    console.log(selectedStatus, start_date);
    try {
      const values = form.getFieldsValue();

      if (validUpdate(values.task_status, values.start_date)) {
        handleUpdateSchedule(schedule.key, values); // Pass the scheduleId as the first argument
      }
    } catch (error) {
      console.error("Error getting form values:", error);
    }
  };
 

  return (
    <>
      {/* Button to open the modal */}
      <Button onClick={() => setOpen(true)} style={{ width: "max-content" }}>
        <EditTwoTone />
      </Button>

      {/* Modal for project update */}
      <Modal
        visible={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        {errorMessage && (
          <Alert
            className="alert"
            message={errorMessage}
            type="error"
            closable
            onClose={() => setSuccessMessage("")}
          />
        )}
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          dir="rtl"
          initialValues={schedule}
        >
          {/* Input field for project description */}
          <Form.Item label="תיאור" name="description">
            <Input id="description" />
          </Form.Item>
          <Form.Item label="תאריך התחלה" name="start_date">
            <input
              id="start_date"
              placeholder={schedule.start_date}
              disabled // Disable the input since start_date should not be changed
              className="ant-input css-dev-only-do-not-override-ed5zg0"
            />
          </Form.Item>
          <Form.Item label="תאריך סיום" name="finish_date">
            <input
              id="finish_date"
              type="date"
              min={(function () {
                const [day, month, year] = schedule.start_date.split("/");
                const formattedDate = `${year}-${month}-${day}`;
                return formattedDate;
              })()} // Parse the start date string to Date object
              className="ant-input css-dev-only-do-not-override-ed5zg0"
            />
          </Form.Item>
          <Form.Item label="סטטוס" name="task_status">
            <select value={selectedStatus} onChange={handleStatusChange}>
              <option value=""></option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </Form.Item>
          <Form.Item label="עובד החראי" name="user_id" type="data">
            <DropdownUsers value={selectedUser} onChange={handleUserChange} />
          </Form.Item>
          {/* Button to initiate the project update */}
          <Button onClick={handleClick} type="primary">
            החלפה
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default ModalScheduleUpdate;
