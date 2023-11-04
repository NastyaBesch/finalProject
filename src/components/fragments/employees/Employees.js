import React from "react";
import Header from "../../fragments/headers/Header";
import { Footer } from "antd/es/layout/layout";
import Main from "../../pages/Main";
import EmployeesTable from "./EmployeesTable";
import "../../../general.css";
import MyModal from "../schedules/Modal";
import FormEmployeeAdd from "../projects/forms/FormEmployeeAdd";

const Employees = () => {
  const nav = [
    { link: "/admin", label: "פרויקטים" },
    { link: "/quality", label: "בקרת איכות" },
    { link: "/employees", label: "עובדים" },
  ];

  const employeesComponents = [EmployeesTable];

  return (
    <div>
      <Header nav={nav} />
      <Main>
        <section className="section_main">
          <div className="mainSection">
            <MyModal content="להוסיף עובד חדש" btnStyle="primary">
              <FormEmployeeAdd />
            </MyModal>
            {employeesComponents.map((Component, index) => (
              <div style={{ padding: "20px" }} key={index}>
                <Component />
              </div>
            ))}
          </div>
        </section>
      </Main>
      <Footer className="footer">©2023 Created by Nastya && Zhenya</Footer>
    </div>
  );
};

export default Employees;
