/******************************************************** */
//The ModalEmployeesUpdate component receives an
//'employee' object as a prop. This prop is used to
//populate the initial values of the form fields when
//the modal is opened for editing the employee details.
/******************************************************** */

import React, { useState } from "react";
import { Button, Form, Input, Alert, Modal } from "antd";
import { EditTwoTone } from "@ant-design/icons";
import DropdownComponent from "../dropDown/DropNew";
import {
  validateFormUpdateFields,
  checkEmailExists,
} from "../projects/forms/validateForm.js";
import "../projects/forms/employeeAdd.css";

const ModalEmployeesUpdate = ({ employee }) => {
  // State variables
  const [selectedRole, setSelectedRole] = useState("");
  const [isUserUpdated, setUserUpdated] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailExists, setEmailExists] = useState(false);
  const [isValidUserName, setIsValidUserName] = useState(true);
  const [isValidLastName, setIsValidLastName] = useState(true);
  const [isValidPassword, setIsValidPassword] = useState(true);
  const [isValidEmail, setIsValidEmail] = useState(true);

  const roles = ["מנהל פרויקט", "מהנדס ביצוע", "מנהל עבודה"];

  const [form] = Form.useForm();

  // Function to handle updating the employee
  const handleUpdateEmployee = async (employeeId, values) => {
    // Make an API request to update the employee data
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
      // Update the success message and user update status
      setSuccessMessage("הנתוני העובד השתנו");
      setUserUpdated(true);
      setOpen(false);
      window.location.reload(false);
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  // Function to handle role change
  const handleRoleChange = (value) => {
    setSelectedRole(value);
  };

  // Function to handle the click event on the button
  const handleClick = async () => {
    try {
      // Validate form fields
      const values = await form.validateFields();
      const isValid = validateFormUpdateFields(
        values.user_name,
        values.last_name,
        values.password_hash,
        values.email,
        selectedRole
      );

      // setIsProjectNameValid(
      //   (values.user_name = /^[א-ת]+$/i.test(user_name.trim()))
      // );
      // setIsValidLastName(
      //   (values.last_name = /^[א-ת]+$/i.test(user_name.trim()))
      // );
      // setIsUserSelected(selectedUser.trim() !== "");

      console.log(isValid);
      if (!isValid) {
        // Set error message if the form fields are not valid
        setErrorMessage("אנא מלא את כל השדות כראוי");
        setTimeout(() => {
          setErrorMessage("");
        }, 2000);
        return;
      } else {
        // Update the employee data
        handleUpdateEmployee(employee.key, values);
        window.location.reload(false);
        setSuccessMessage("gggg");
      }
    } catch (error) {
      console.error("Error validating form fields:", error);
    }
  };

  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Display success message if set */}
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
      {!isUserUpdated && (
        <Modal open={open} onCancel={() => setOpen(false)} footer={null}>
          {/* Form to update the employee data */}
          <Form
            form={form}
            name="basic"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 16 }}
            initialValues={employee}
            dir="rtl"
          >
            {/* Display error message if set */}
            {errorMessage && (
              <Alert
                className="alert"
                message={errorMessage}
                type="error"
                closable
                onClose={() => setSuccessMessage("")}
              />
            )}
            <Form.Item
              label="שם פרטי"
              name="user_name"
              className={isValidUserName ? "" : "invalid"}
            >
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
              {/* DropdownComponent is not used here */}
              <select value={selectedRole} onChange={handleRoleChange}>
                {/* <option value=""></option> */}
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
