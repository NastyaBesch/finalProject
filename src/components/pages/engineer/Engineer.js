import React, { useEffect, useState } from "react";
import Header from "../../fragments/headers/Header";
import { Footer } from "antd/es/layout/layout";
import ProjectTable from "../../fragments/projects/ProjectTable";
import moment from "moment";
import PopUp from "../../fragments/PopUp";
import "../../../general.css";

const Engineer = () => {
  const [tasksAlert, setTasksAlert] = useState([]);
  const nav = [
    { link: "/admin", label: "פרויקטים" },
    { link: "/quality", label: "בקרת איכות" },
  ];

  const components = [ProjectTable];

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

      <Main>
        {combinedMessage && <PopUp myMessage={combinedMessage} />}
        {components.map((Component, index) => (
          <Component key={index} />
        ))}
      </Main>

      <Footer className="footer">
        Ant Design ©2023 Created by Nastya && Zhenya
      </Footer>
    </div>
  );
};

export default Engineer;
