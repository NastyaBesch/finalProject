import {Form, Input, Select } from "antd";
import { useState } from "react";
const { TextArea } = Input;

const InputProject = () => {
  const [componentDisabled, setComponentDisabled] = useState(true);
  return (
    <>
      <Form
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 18,
        }}
        layout="horizontal"
        style={{
          maxWidth: 600,
          backgroundColor: "lightblue",
          padding: 77,
          borderRadius: 6,
        }}
        dir="rtl"
      >
        <Form.Item label="שם פקויקט">
          <Input />
        </Form.Item>
        <Form.Item label="בחר פרויקט">
          <Select>
            <Select.Option value="demo">שבלונות</Select.Option>
          </Select>
          
        </Form.Item>
      </Form>
    </>
  );
};
export default () => <InputProject />;
