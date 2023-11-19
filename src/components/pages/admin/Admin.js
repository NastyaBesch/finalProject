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
import { useLocation } from "react-router-dom";

const Admin = () => {
  const [tasksAlert, setTasksAlert] = useState([]);
  const location = useLocation();
  const userRole = location.state?.userRole || "";

  let nav = [];

  // Set navigation links based on the user's role
  if (userRole === "מנהל פרויקט") {
    nav = [
      { link: "/admin", label: "פרויקטים" },
      { link: "/quality", label: "בקרת איכות" },
      { link: "/employees", label: "עובדים" },
    ];
  } else {
    nav = [
      { link: "/admin", label: "פרויקטים" },
      { link: "/quality", label: "בקרת איכות" },
    ];
  }

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
            {/* Check if the userRole is "admin" to show the add project modal */}
            {userRole === "מנהל פרויקט" && (
              <MyModal content="הוספת פרויקט חדש" btnStyle="primary">
                <FormProjectAdd />
              </MyModal>
            )}
            <ProjectTable userRole={userRole} />

            {/* You can uncomment the following code if you have an array of components */}
            {/* {components.map((Component, index) => (
              <div style={{ padding: "20px" }}>
                <Component key={index} />
              </div>
            ))} */}
          </div>
        </section>
      </Main>

      <Footer className="footer">©2023 Created by Nastya</Footer>
    </div>
  );
};

export default Admin;
