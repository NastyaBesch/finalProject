import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { useParams } from "react-router-dom";
import BtnDeleteSchedule from "../buttons/BtnDeleteSchedule";
import BtnAddQA from "../buttons/BtnSendToQA";
import "../../../general.css";
import ModalScheduleUpdate from "../modals/ModalScheduleUpdate";
import MyModal from "../schedules/Modal";
import { DeleteTwoTone } from "@ant-design/icons";
import FilterOptionsComponent from "../filter/FilterOptionsComponent";
import FilterSearch from "../filter/FilterSearch";

const ProjectDetails = () => {
  const { projectId } = useParams();

  const [schedules, setSchedules] = useState([]);
  const [daysBetweenTasks, setDaysBetweenTasks] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [isDataUpdated, setDataUpdated] = useState(true);

  const options = ["באיחור", "הושלם", "בתאליך"];

  useEffect(() => {
    fetchData();
    setFilteredData(schedules);
  }, [projectId, isDataUpdated]); // Fetch data whenever projectId changes

  const fetchData = async () => {
    try {
      const schedulesResponse = await fetch(
        `http://localhost:4000/api/schedulesByProject/${projectId}`
      );
      const schedulesData = await schedulesResponse.json();
      setSchedules(schedulesData);
      setDataUpdated(false);
      // Fetch days between tasks data
      const daysBetweenTasksResponse = await fetch(
        `http://localhost:4000/api/daysBetweenTasksByProject/${projectId}`
      );
      const daysBetweenTasksData = await daysBetweenTasksResponse.json();
      setDaysBetweenTasks(daysBetweenTasksData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFilterChange = (filteredArray) => {
    setFilteredData(filteredArray); // Update the filtered data state
  };

  const rowClassName = (record) => {
    const currentDate = new Date();
    const finishDate = new Date(
      record.finish_date.split("/").reverse().join("-")
    );
    if (finishDate < currentDate && record.task_status !== "הושלם") {
      return "red-row"; // Apply the "red-row" CSS class to rows that meet the condition
    }
    if (record.task_status === "הושלם") {
      return "green-row"; // CSS class for rows with task_status "הושלם"
    }
    return ""; // Empty string for other rows
  };

  const columns = [
    {
      title: "",
      dataIndex: "btnDel",
      key: "buttonKey",
    },
    {
      title: "",
      dataIndex: "link",
      key: "link",
    },
    {
      title: "",
      dataIndex: "btnAddQA",
      key: "btnAddQA",
    },

    {
      title: "עובד אחראי",
      dataIndex: "user_name",
      key: "user_name",
      render: (text, record) => `${text} ${record.last_name}`,
    },
    {
      title: (
        <>
          <span>סטטוס</span>
          <FilterOptionsComponent
            items={schedules}
            options={options}
            onFilterChange={handleFilterChange}
            textFilter="בחר סטטוס"
            filterbyItems="task_status"
          />
        </>
      ),
      dataIndex: "task_status",
      key: "task_status",
    },
    {
      title: "תאריך סיום",
      dataIndex: "finish_date",
      key: "finish_date",
    },
    {
      title: "תאריך התחלה",
      dataIndex: "start_date",
      key: "start_date",
    },
    {
      title: "תיאור",
      dataIndex: "description",
      key: "description",
    },
    {
      title: (
        <>
          <span>שם משימה</span>
          <FilterSearch
            items={schedules}
            onFilterChange={handleFilterChange}
            textSearch="שם משימה"
            search="task_name"
          />
        </>
      ),
      dataIndex: "task_name",
      key: "task_name",
    },
  ];

  return (
    <Table
      dir="rtl"
      columns={columns}
      dataSource={filteredData.map((item) => ({
        key: item.id,
        task_name: item.task_name,
        user_name: item.user_name,
        last_name: item.last_name,
        start_date: item.formatted_start_date,
        finish_date: item.formatted_finish_date,
        task_status: item.task_status,
        description: item.description,
        finishDateBeforeChange: item.formatted_finish_date,
        btnDel: (
          <MyModal content={<DeleteTwoTone />}>
            <div
              dir="rtl"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <p>
                בעת מחיקת המשימה, לא תהיה אפשרות לשחזור אותה. תאריכי המשימות
                יועברו קדימה לפי השינוי. אנא אשר את המחיקה.
              </p>

              <BtnDeleteSchedule
                key={`modal-${item.id}`}
                scheduleId={item.id}
                schedules={schedules}
                daysBetweenTasks={daysBetweenTasks}
              />
            </div>
          </MyModal>
        ),
        btnAddQA: <BtnAddQA key={`modal-${item.id}`} scheduleId={item.id} />,
        link: (
          <ModalScheduleUpdate
            schedules={schedules}
            projectId={projectId}
            finishDateBeforeChange={item.formatted_finish_date}
            key={`modal-${item.id}`}
            schedule={{
              key: item.id,
              scheduleId: item.id,
              start_date: item.formatted_start_date,
              finish_date: item.formatted_finish_date,
              description: item.description,
              task_status: item.task_status,
              user_id: item.user_id,
            }}
          />
        ),
      }))}
      rowClassName={rowClassName}
    />
  );
};

export default ProjectDetails;
