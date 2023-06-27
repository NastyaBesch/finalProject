import React, { useState, useEffect } from "react";
import axios from "axios";
import { Alert, Button } from "antd";
import "./employeeAdd.css";
import { v4 } from "uuid";

const FormEmployeeAdd = () => {
  // State variables to store form data and validation status
  const [user_name, setUserName] = useState("");
  const [last_name, setLastName] = useState("");
  const [password_hash, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [emailExists, setEmailExists] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const roles = ["מנהל פרויקט", "מהנדס ביצוע", "מנהל עבודה"];

  // Function to perform form validation
  const validateForm = () => {
    // Perform validation checks here
    if (user_name.trim() === "" || !/^[א-ת]+$/i.test(user_name)) {
      setUserName("");
      setErrorMessage("אנא הכנס שם פרטי תקין");
      console.log("validate user name section")
      return false;
    }

    if (last_name.trim() === "" || !/^[א-ת]+$/i.test(last_name)) {
      setLastName("");
      setErrorMessage("בבקשה הכנס שם משפחה תקף");
      console.log("validate user last name section");
      return false;
    }

    if (password_hash.trim() === "" || !/^\d{4}$/.test(password_hash)) {
      setPassword("");
      setErrorMessage("בבקשה הכנס סיסמה תקינה");
      console.log("validate password section");
      return false;
    }

    if (
      email.trim() === "" ||
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i.test(email)
    ) {
      setEmail("");
      setErrorMessage("בבקשה הכנס כתובת אימייל תקינה");
      console.log("validate email text section");
      return false;
    }

    if (selectedRole.trim() === "") {
      setErrorMessage("בבקשה תבחר שם תפקיד");
      console.log("validate rolw selected section");
      return false;
    }

    return true;
  };

  // Function to check if the entered email exists in the database
  const checkEmailExists = () => {
    return axios
      .post("http://localhost:4000/api/emailCount", { email })
      .then((response) => {
        setEmailExists(response.data);
      })
      .catch((error) => {
        console.error("Error checking email:", error);
      });
  };

  // useEffect hook to check if the entered email exists in the database
  useEffect(() => {
    checkEmailExists();
  }, [email]);
  console.log("return true if email exits else fallse", emailExists);



  // Event handler for role selection
  const handleRoleChange = (event) => {
    const role = event.target.value;
    setSelectedRole(role);
  };

  // Event handler for form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }
    if (emailExists) {
      setEmail("");
      setErrorMessage("דואר אלקטרוני כבר קיים במערכת");
      return;
    }

    const employeeData = {
      user_name: user_name,
      last_name: last_name,
      password_hash: password_hash,
      email: email,
      id: v4(),
      role: selectedRole,
  
    };

    axios
      .post("http://localhost:4000/api/addUser", employeeData)
      .then((response) => {
        console.log("Employee added successfully:", response.data);
        setUserName("");
        setLastName("");
        setPassword("");
        setEmail("");
        setSelectedRole("");
        setSuccessMessage("המשתמש נוסף");
      })
      .catch((error) => {
        console.error("Error adding Employee:", error);
        setErrorMessage("שגיאה בהוספת המשתמש, אנא נסה שוב");
      });
  };

  return (
    <form className="formAdd" onSubmit={handleSubmit} dir="rtl">
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
        <label htmlFor="user_name" className="label">
          שם פרטי
        </label>
        <input
          className="input"
          type="text"
          id="user_name"
          value={user_name}
          onChange={(event) => setUserName(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="last_name">שם משפחה</label>
        <input
          type="text"
          id="last_name"
          value={last_name}
          onChange={(event) => setLastName(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password_hash">סיסמה </label>
        <input
          type="text"
          id="password_hash"
          value={password_hash}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>
      <div>
        <label htmlFor="email">כתובת אימייל</label>
        <input
          type="text"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div>
        <label>תפקיד</label>
        <select value={selectedRole} onChange={handleRoleChange}>
          <option value=""></option>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Button
          className="btn"
          type="primary"
          htmlType="submit"
          style={{ marginTop: "20px" }}
        >
          ליצור עובד חדש
        </Button>
      </div>
    </form>
  );
};

export default FormEmployeeAdd;
