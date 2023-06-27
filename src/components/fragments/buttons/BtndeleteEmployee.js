import { Button, Space } from "antd";
import React from "react";
import { DeleteOutlined } from "@ant-design/icons";


const BtnDeleteEmployee = (props) => {
  const { employeeId, handleDelete } = props;

  const handleClick = async () => {
    handleDelete(employeeId);
  };

  return (
    <Space wrap>
      <Button onClick={handleClick}>
        <DeleteOutlined />
      </Button>
    </Space>
  );
};

export default BtnDeleteEmployee;
