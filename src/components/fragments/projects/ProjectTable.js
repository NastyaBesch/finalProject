import { Table, Button, List } from "antd";
import React, { useEffect, useState } from "react";
import moment from "moment";
import ProjectDetails from "./ProjectDetails";
import MyModal from "../schedules/Modal";
import ModalProjectUpdate from "../modals/ModalProjectUpdate";
import FormTaskAdd from "./forms/FormTasksAdd";
import CheckBoxTaskList from "../CheckBoxTasks";
import { Link } from "react-router-dom";

const ProjectTable = () => {
  const [data, setData] = useState([]);
  const [isDataUpdated, setDataUpdated] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/allProject", {
        method: "POST",
      });
      const response = await res.json();
      setData(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const rowClassName = (record) => {
    if (record.task_status === "באיחור") {
      return "red-row"; // CSS class for rows with status "באחור"
    }
    if (record.task_statusstatus === "באימות") {
      return "yellow-row"; // CSS class for rows with status "באימות"
    }
    if (record.task_status === "הושלם") {
      return "green-row"; // CSS class for rows with status "הושלם"
    }
    return ""; // Empty string for other rows
  };

  const handleReload = () => {
    window.location.reload(false); // Reload the page without using cache
  };

  const columns = [
    {
      title: "",
      dataIndex: "link",
      key: "link",
      render: (text, record) => (
        <Link to={`/project-details/${record.key}`}><Button>לוח זמנים </Button></Link>
      ),
    },
    {
      title: "",
      dataIndex: "add",
      key: "add",
      render: (text, record) => (
        <MyModal content="הוספת משימות">
          <CheckBoxTaskList  projectId={record.key}/>
          <FormTaskAdd />
        </MyModal>
      ),
    },
    {
      title: "",
      dataIndex: "link",
      key: "link",
    },
    {
      title: "תאריך התחלה",
      dataIndex: "start_date",
      key: "start_date",
      render: (value) => {
        const start_date = moment(value);
        return start_date.isValid() ? start_date.format("DD/MM/YYYY") : "";
      },
    },
    {
      title: "תאריך סיום",
      dataIndex: "finish_date",
      key: "finish_date",
      render: (value) => {
        const apdate_finish_date = moment(value);
        return apdate_finish_date.isValid()
          ? apdate_finish_date.format("DD/MM/YYYY")
          : "";
      },
    },
    {
      title: "סטטוס",
      dataIndex: "task_status",
      key: "task_status",
      sorter: (a, b) => a.task_status.length - b.task_status.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "עובד אחראי",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "שם פרויקט",
      dataIndex: "name",
      key: "name",
    },
  ];

  return (
    <Table
      columns={columns}
      rowClassName={rowClassName}
      dataSource={data.map((item) => ({
        key: item.project_id,
        name: item.name,
        team_id: item.team_id,
        start_date: item.start_date,
        finish_date: item.finish_date,
        task_status: item.task_status,
        user: item.user,
        link: (
          <ModalProjectUpdate
            key={`modal-${item.project_id}`}
            project={{
              key: item.project_id,
              name: item.name,
              team_id: item.team_id,
              start_date: item.start_date,
              finish_date: item.finish_date,
              task_status: item.task_status,
            }}
          />
        ),
      }))}
    />
  );
};

export default ProjectTable;
