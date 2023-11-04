import React, { useState } from "react";
import { Button, Modal, Form, Input, Alert, DatePicker } from "antd";
import { EditTwoTone} from "@ant-design/icons";
import CheckBoxTaskList from "../CheckBoxTasks";
import DropdownUsers from "../dropDown/DropUsers";

const ModalProjectUpdate = ({ project }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedUser, setSelectedUserID] = useState("");

   const handleUserChange = (event) => {
     const selectedUserId = event.target.value;
     setSelectedUserID(selectedUserId);
   };

  // Function to handle the project update
  const handleUpdateProject = async (projectId, values) => {
    try {

      const res = await fetch(
        `http://localhost:4000/api/updateProject/${projectId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: values.name,
            user_id: values.user_id,
            // status: values.status,
          }),
        }
      );

      const response = await res.json();
      setSuccessMessage("הנתוני הפרויקט השתנו");
      handleSuccessUpdate();
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  // Function to handle the success update
  const handleSuccessUpdate = () => {
    setSuccessMessage("הנתונים של הפרויקט עודכנו");
    setOpen(false);
    window.location.reload(false);
  };

  // Function to handle the button click
  const handleClick = async () => {
    try {
      const values = await form.validateFields();
      handleUpdateProject(project.key, values);
    } catch (error) {
      console.error("Error validating form fields:", error);
    }
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
        <EditTwoTone />
      </Button>

      {/* Modal for project update */}
      <Modal
        visible={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        footer={null}
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

          {/* Input field for start date */}
          {/* <Form.Item label="תאריך התחלה" name="start_date">
            <Input />
          </Form.Item>

          {/* Input field for finish date */}
          {/* <Form.Item label="תאריך סיום" name="finish_date" type="data">
            <Input />
          </Form.Item> */} 
          {/* <Form.Item label="סטטוס" name="status" type="data">
            <Input />
          </Form.Item> */}
          <Form.Item label="עובד החראי" name="user_id" type="data">
            <DropdownUsers value={selectedUser} onChange={handleUserChange} />
          </Form.Item>
          {/* Checkbox task list component */}
          {/* <CheckBoxTaskList projectId={project.key} /> */}

          {/* Button to initiate the project update */}
          <Button onClick={handleClick} type="primary">
            החלפה
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default ModalProjectUpdate;
