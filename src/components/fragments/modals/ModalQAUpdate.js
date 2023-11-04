import React, { useState } from "react";
import { Button, Modal, Form, Input, Alert, DatePicker, Dropdown } from "antd";
import { EditTwoTone } from "@ant-design/icons";



const ModalQAUpdate = ({ qa }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("בתהליך");
  const statuses = ['הושלם', 'בתיקון', 'בבדיקה', 'בתהליך']
  // Function to handle the qa update
  const handleUpdateQA = async (qaId, values) => {
    try {
      const res = await fetch(`http://localhost:4000/api/updateQA/${qaId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: values.description,
          newDescription: values.newDescription,
          status: values.status,
        }),
      });
      console.log(res);
      const response = await res.json();
      console.log(response);

      handleSuccessUpdate();
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
    setOpen(false);
    window.location.reload(false);
  };

  // Function to handle the button click
  const handleClick = async () => {
    try {
      const values = form.getFieldsValue();
      handleUpdateQA(qa.key, values); // Pass the scheduleId as the first argument
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
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={qa}
          dir="rtl"
        >
          <Form.Item label="סטטוס" name="status" type="data">
            <select value={selectedStatus} onChange={handleStatusChange}>
              <option value=""></option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </Form.Item>
          <Form.Item label="הערות" name="description" type="data">
            <Input id="description" placeholder="description" disabled/>
          </Form.Item>
          <Form.Item label="הוספת ההערות" name="newDescription" type="data">
            <Input id="newDescription" />
          </Form.Item>
          <Button onClick={handleClick} type="primary">
            החלפה
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default ModalQAUpdate;
