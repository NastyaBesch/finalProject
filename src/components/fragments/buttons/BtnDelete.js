import { Button, Space } from "antd";
import React from "react";
import { DeleteTwoTone } from "@ant-design/icons";

const BtnDelete = ({ delByElement, link, daysBetweenTasks }) => {
  const handleDelete = async () => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/${link}/${delByElement}`,
        {
          method: "DELETE",
        }
      );

      console.log(delByElement);
      if (res.ok) {
        window.location.reload(false);
      } else {
        console.error("Error deleting project:", res);
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <Space wrap>
      <Button onClick={handleDelete}>
        <DeleteTwoTone twoToneColor="#eb2f96" />
      </Button>
    </Space>
  );
};

export default BtnDelete;
