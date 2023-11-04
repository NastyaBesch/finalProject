import React from "react";
import { Button, Checkbox, Form, Input } from "antd";
import Axios from "axios";

/************************************************************ */
//                  TO DO:
//  1) Add page display managment fucntion based on the user type
/************************************************************ */

const onFinish = async (values) => {
  try {
    /******************************* *********************************************/
    //    CONNECTION STRING FOR WORK WITH DIFFERENT PORTS
    //    IF YOU ARE USING A DIFFERENT PORT CHANGE THE CONNECTION STRING
    /*********************************************************************** */
    const connectionString = "http://localhost:4000/api/login";

    /************************************************************************ */
    // Response contains JSON format message and user type.
    // User type will determine what type of page will be loaded for the user on a successful login.
    const response = await Axios.post(connectionString, values);
    console.log("Backend response:", response.data);

    if (response.data.user_role === "מנהל עבודה") {
      window.location.href = "Engineer.js"; // Redirect to Engineer.js
    } else if (response.data.user_role === "מהנדס ביצוע") {
      window.location.href = "/admin"; // Redirect to admin page
    } else if (response.data.user_role === "מנהל פרויקט") {
      window.location.href = "/admin"; // Redirect to admin page
    }
  } catch (error) {
    console.error("Error:", error);
  }

  console.log("Success:", values);
};

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const Login = () => (
  <Form
    name="basic"
    labelCol={{
      span: 8,
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
      label="Username"
      name="username"
      rules={[
        {
          required: true,
          message: "Please input your username!",
        },
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Password"
      name="password"
      rules={[
        {
          required: true,
          message: "Please input your password!",
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
      <Checkbox>Remember me</Checkbox>
    </Form.Item>

    <Form.Item
      wrapperCol={{
        offset: 8,
        span: 16,
      }}
    >
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
  </Form>
);

export default Login;
