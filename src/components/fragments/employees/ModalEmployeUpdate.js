import React, { useState } from "react";
import { Button, Form, Input, Alert, Modal } from "antd";
import { EditOutlined } from "@ant-design/icons";
import DropdownComponent from "../dropDown/DropNew";
// import MyModal from "../schedules/Modal";

const ModalEmployeesUpdate = ({ employee }) => {
  const [selectedRole, setSelectedRole] = useState("");
  const [isUserUpdated, setUserUpdated] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailExists, setEmailExists] = useState(false);
  
  const roles = ["מנהל פרויקט", "מהנדס ביצוע", "מנהל עבודה"];

  const [form] = Form.useForm(); // Add this line to retrieve the form instance

  const handleUpdateEmployee = async (employeeId, values) => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/updateEmployee/${employeeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_name: values.user_name,
            last_name: values.last_name,
            email: values.email,
            password_hash: values.password_hash,
            role: values.role,
            
            
          }),
        }
      );
      const response = await res.json();
      setSuccessMessage("הנתוני העובד השתנו");
      setUserUpdated(true);
      setOpen(false);
      Windows.location.reload(false)

      // Handle any further actions or updates after the employee update
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  const handleRoleChange = (value) => {
    setSelectedRole(value);
  };
 

  const handleClick = async () => {
    try {
      const values = await form.validateFields(); // Use the form variable to validate the fields
      handleUpdateEmployee(employee.key, values);
      window.location.reload(false); // Reload the page without using cache
    } catch (error) {
      console.error("Error validating form fields:", error);
    }
  };

  const [open, setOpen] = useState(false);

  return (
    <>
      {successMessage && (
        <Alert
          className="alert"
          message={successMessage}
          type="success"
          closable
          onClose={() => setSuccessMessage("")}
        />
      )}
      <Button onClick={() => setOpen(true)} style={{ width: "max-content" }}>
        <EditOutlined />
      </Button>
      {!isUserUpdated && (
        <Modal
          visible={open}
          onOk={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        >
          <Form
            form={form} // Assign the form instance to the form variable
            name="basic"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 16 }}
            initialValues={employee}
            dir="rtl"
          >
            <Form.Item label="שם פרטי" name="user_name">
              <Input id="user_name" />
            </Form.Item>
            <Form.Item label="שם משפחה" name="last_name">
              <Input id="last_name" />
            </Form.Item>
            <Form.Item label="כתובת אימייל" name="email">
              <Input id="email" />
            </Form.Item>
            <Form.Item label="סיסמה" name="password_hash">
              <Input id="password_hash" />
            </Form.Item>
            <Form.Item label="תפקיד" name="role">
              <select value={selectedRole} onChange={handleRoleChange}>
                <option value=""></option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </Form.Item>
            <Button
              onClick={handleClick}
              type="primary"
              style={{ marginTop: "20px" }}
            >
              החלפה
            </Button>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default ModalEmployeesUpdate;
