import React, { useEffect, useState } from "react";
import moment from "moment";
import { Table } from "antd";
import "../../../general.css";

const TaskDetails = ({ taskId }) => {
  const [subTasks, setSubTasks] = useState([]);

  useEffect(() => {
    fetchData();
  }, [taskId]);

  const fetchData = async () => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/subTasksByTaskId/${taskId}`
      );
      const response = await res.json();
      setSubTasks(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  console.log("subtasks", subTasks);

  const rowClassName = (record) => {
    if (record.task_status === "באיחור") {
      return "red-row"; // CSS class for rows with status "באיחור"
    }

    return ""; // Empty string for other rows
  };

  const columns = [
    {
      title: "שם תת משימה",
      dataIndex: "name",
      key: "name",
      render: (text, record) => `${text} ${record.name}`,
    },
    {
      title: "תיאור",
      dataIndex: "description",
      key: "description",
    },
  ];

  return (
    <Table
      dir="rtl"
      columns={columns}
      // dataSource={subTasks.map((subTask) => ({
      //   key: subTask.subtask_id,
      //   name: subTask.name,
      //   description: subTask.description,
      //   status: subTask.status,
      // }))}
      rowClassName={rowClassName}
    />
  );
};

export default TaskDetails;
