import React, { useEffect, useState } from "react";
import Header from "../fragments/headers/Header";
import { Footer } from "antd/es/layout/layout";
import moment from "moment";
import Schedules from "../fragments/schedules/Schedules";
import Main from "./Main";
import "../../general.css"


const TaskMaster = () => {
  const [tasksAlert, setTasksAlert] = useState([]);
  const nav = [
    { link: "/quality", label: "בקרת איכות" },
  ];

  const components = [Schedules];

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/tasksAlert", {
        method: "POST",
      });
      const response = await res.json();
      setTasksAlert(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const combinedMessage =
    tasksAlert.length > 0
      ? tasksAlert
          .map(
            (alert) =>
              `${alert.project_name}
               ${alert.task_name} באיחור
              תאריך סיום ${moment(alert.finish_date).format("DD/MM/YYYY")} `
          )
          .join("<br>")
      : "";

  return (
    <div>
      <Header nav={nav} />

      {/* {combinedMessage && <PopUp myMessage={combinedMessage} />} */}

      <Main>
        {components.map((Component, index) => (
          <Component key={index} />
        ))}
      </Main>

      <Footer className="footer">
        ©2023 Created by Nastya
      </Footer>
    </div>
  );
};

export default TaskMaster;
