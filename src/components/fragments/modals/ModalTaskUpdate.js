import React, { useState } from "react";
import { Button, Modal, Form, Input, Alert } from "antd";
import { EditOutlined } from "@ant-design/icons";
import CheckBoxTaskList from "../CheckBoxTasks";
import FormTaskAdd from "../projects/forms/FormTasksAdd";


const ModalTaskUpdate = ({ project }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const statuses = ["לתיקון", "הושלם", "בתאליך", "באיחור"];
  const [projectId, setProjectId] = useState("");

  // Function to handle the project update
  const handleUpdateProject = async (projectId, values) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/updateProject/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.name,
            description: values.description,
            status: values.status,
            team_id: values.team_id,
          }),
        }
      );

      const response = await res.json();
      setSuccessMessage("הנתוני הפרויקט השתנו");
      handleSuccessUpdate(); // Call the function or set the states for further actions
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  // Function to handle the status change
  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };

  // Function to handle the success update
  const handleSuccessUpdate = () => {
    setSuccessMessage("הנתונים של הפרויקט עודכנו");
    setOpen(false);
    window.location.reload(false); // Reload the page without using cache
    
  };

  // Function to handle the button click
  const handleClick = async () => {
    try {
      const values = await form.validateFields();
      handleUpdateProject(project.key, values);
      handleSuccessUpdate(); // Call the function or set the states for further actions
      window.location.reload(false); // Reload the page without using cache
    } catch (error) {
      console.error("Error validating form fields:", error);
    }
  };

  const handleSubmit = (values) => {
    // Handle the submission of the task form
    // Perform any actions or updates related to adding tasks to the project
  };

  return (
    <>
      {/* Display success message if exists */}
      {successMessage && (
        <Alert
          className="alert"
          message={successMessage}
          type="success"
          closable
          onClose={() => setSuccessMessage("")}
        />
      )}

      {/* Button to open the modal */}
      <Button onClick={() => setOpen(true)} style={{ width: "max-content" }}>
        <EditOutlined />
      </Button>

      {/* Modal for project update */}
      <Modal
        visible={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={project}
          dir="rtl"
        >
          {/* Input field for project name */}
          <Form.Item label="שם פרויקט" name="name">
            <Input />
          </Form.Item>

          {/* Input field for project description */}
          <Form.Item label="תיאור" name="description">
            <Input />
          </Form.Item>

          {/* Dropdown for project status */}
          <Form.Item label="סטטוס" name="status">
            <select value={selectedStatus} onChange={handleStatusChange}>
              <option value=""></option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </Form.Item>

          {/* Checkbox task list component */}
          {/* <CheckBoxTaskList projectId={projectId} onSubmit={handleSubmit} /> */}

          {/* Button to initiate the project update */}
          <Button onClick={handleClick} type="primary">
            החלפה
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default ModalTaskUpdate;
