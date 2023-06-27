import React, { useEffect, useState } from "react";
import moment from "moment";
import { Button, Table } from "antd";
import TaskDetails from "./TaskDetails";
import MyModal from "../schedules/Modal";
import { EditOutlined } from "@ant-design/icons";
import { DeleteOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import "../../../general.css";

const ProjectDetails = () => {
  const { projectId } = useParams();

  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    fetchData();
  }, [projectId]); // Fetch data whenever projectId changes

  const fetchData = async () => {
    try {
      const res = await fetch(
        `http://localhost:4000/api/schedulesByProject/${projectId}`
      );
      const response = await res.json();
      setSchedules(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const rowClassName = (record) => {
    if (record.task_status === "באיחור") {
      return "red-row"; // CSS class for rows with status "באחור"
    }
    if (record.task_status === "הושלם") {
      return "greed-row"; // CSS class for rows with status "באחור"
    }
    if (record.task_status === "ממתין לאישור") {
      return "blue-row"; // CSS class for rows with status "באחור"
    }

    return ""; // Empty string for other rows
  };

  const columns = [
    {
      title: "",
      dataIndex: "del",
      key: "del",
      render: (text, record) => (
        <MyModal content=<DeleteOutlined />>
          <ProjectDetails projectId="projectId" />
        </MyModal>
      ),
    },
    {
      title: "",
      dataIndex: "link",
      key: "link",
      render: (text, record) => (
        <MyModal content=<EditOutlined />>
          <ProjectDetails projectId="projectId" />
        </MyModal>
      ),
    },
    {
      title: "",
      dataIndex: "btn",
      key: "buttonKey",
      render: () => <Button>שליחה לבקרת איכות</Button>,
    },
    {
      title: "עובד אחראי",
      dataIndex: "user_name",
      key: "user_name",
      render: (text, record) => `${text} ${record.last_name}`,
    },
    {
      title: "סטטוס",
      dataIndex: "task_status",
      key: "task_status",
      sorter: (a, b) => a.task_status.length - b.task_status.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "תאריך סיום",
      dataIndex: "finish_date",
      key: "finish_date",
      render: (value) => {
        const date = moment(value);
        return date.isValid() ? date.format("DD/MM/YYYY") : "";
      },
    },
    {
      title: "תאריך התחלה",
      dataIndex: "start_date",
      key: "start_date",
      render: (value) => {
        const date = moment(value);
        return date.isValid() ? date.format("DD/MM/YYYY") : "";
      },
    },
    {
      title: "תיאור",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "שם משימה",
      dataIndex: "task_name",
      key: "task_name",
      sorter: (a, b) => a.task_name.length - b.task_name.length,
      sortDirections: ["descend", "ascend"],
    },
  ];

  return (
    <Table
      dir="rtl"
      columns={columns}
      dataSource={schedules}
      rowClassName={rowClassName}
      //  link: (
      // <Modal content="dffff"/>
      // key={`modal-${item.project_id}`}
      // project={{
      //   key: item.project_id,
      //   name: item.name,
      //   team_id: item.team_id,
      //   start_date: item.start_date,
      //   finish_date: item.finish_date,
      //   status: item.status,
      // }}
      // />
      //     ),
    />
  );
};

export default ProjectDetails;
