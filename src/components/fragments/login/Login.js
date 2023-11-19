import React, { createContext, useState, useContext} from "react";
import { Button, Checkbox, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

// const useUserRole = () => {
//   const [userRole, setUserRole] = useState("");

//   const updateUserRole = (newRole) => {
//     setUserRole(newRole);
//   };

//   return { userRole, updateUserRole };
// };

const Login = () => {

  const navigate = useNavigate();

  // const { updateUserRole } = useUserRole();
  
  const onFinish = async (values) => {
    try {
      const connectionString = "http://localhost:4000/api/login";
      const response = await Axios.post(connectionString, values);
      console.log("Backend response:", response.data);

      
      //  const { updateUserRole } = useUserRole();
        const updatedUserRole = response.data.user_role;
      //  console.log(updatedUserRole);
      //  updateUserRole(updatedUserRole);
      // console.log(updatedUserRole);

      

      if (updatedUserRole === "מנהל עבודה") {
        // window.location.href = "Engineer.js";
        navigate("/engineer", { state: { userRole: updatedUserRole } });
      } else if (
        updatedUserRole === "מהנדס ביצוע"||
        updatedUserRole === "מנהל פרויקט"
      ) {
         navigate("/admin", { state: { userRole: updatedUserRole } });
        // window.location.href = "/admin";
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
};

// Export the context and the hook

export default Login;

