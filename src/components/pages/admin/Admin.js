import React, { useEffect, useState } from "react";
import Header from "../../fragments/headers/Header";
import { Footer } from "antd/es/layout/layout";
import MyModal from "../../fragments/schedules/Modal";
import FormProjectAdd from "../../fragments/projects/forms/FormProjectAdd";
import ProjectTable from "../../fragments/projects/ProjectTable";
import moment from "moment";
import PopUp from "../../fragments/PopUp";
import "../../../general.css";
import Main from "../Main";


const Admin = () => {
  const [tasksAlert, setTasksAlert] = useState([]);
  const nav = [
    { link: "/admin", label: "פרויקטים" },
    { link: "/quality", label: "בקרת איכות" },
    { link: "/employees", label: "עובדים" },
  ];
  // const components = [ModalProjectAdd, ProjectTable];

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
              `
              ${alert.project_name} : 
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
        <section className="section_main">
          <div className="mainSection">
            <MyModal content="הוספת פרויקט חדש" btnStyle="primary">
              <FormProjectAdd />
            </MyModal>
            <ProjectTable />

            {/* {components.map((Component, index) => (
              <div style={{ padding: "20px" }}>
                <Component key={index} />
              </div>
            ))} */}
          </div>
        </section>
      </Main>

      <Footer className="footer">
        ©2023 Created by Nastya
      </Footer>
    </div>
  );
};

export default Admin;
