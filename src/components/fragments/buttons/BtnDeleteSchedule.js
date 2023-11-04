import { Button, Space } from "antd";
import React from "react";
import { DeleteTwoTone } from "@ant-design/icons";

const BtnDeleteSchedule = (props) => {
  const { scheduleId, schedules, daysBetweenTasks } =
    props;

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/deleteSchedulesByProject/${scheduleId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            schedules: schedules, 
            daysBetweenTasks: daysBetweenTasks,
          }),
        }
      );

      if (res.ok) {
        window.location.reload(false);
      } else {
        console.error("Error deleting schedules:", res);
      }
    } catch (error) {
      console.error("Error deleting schedules:", error);
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

export default BtnDeleteSchedule;
