import React, { createContext, useState, useContext } from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import classes from "./login.module.css"

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const connectionString = "http://localhost:4000/api/login";
      const response = await Axios.post(connectionString, values);
      console.log("Backend response:", response.data);
      const updatedUserRole = response.data.user_role;

      if (updatedUserRole === "מנהל עבודה") {
        navigate("/engineer", { state: { userRole: updatedUserRole } });
      } else if (
        updatedUserRole === "מהנדס ביצוע" ||
        updatedUserRole === "מנהל פרויקט"
      ) {
        navigate("/admin", { state: { userRole: updatedUserRole } });
      }

      console.log("Updated User Role:", updatedUserRole);
    } catch (error) {
      console.error("Error:", error);
    }

    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className={classes.loginForm}>
      <Form dir="rtl"
        name="basic"
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="שם משתמש"
          name="username"
          rules={[
            {
              required: true,
              message: "אנא הזן את שם המשתמש שלך",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="סיסמה"
          name="password"
          rules={[
            {
              required: true,
              message: "אנא הזן את הסיסמה שלך",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="remember"
          valuePropName="checked"
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Checkbox>זכור אותי</Checkbox>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            כניסה
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
