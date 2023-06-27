import React, { useEffect, useState } from "react";
import Header from "../../fragments/headers/Header";
import { Footer } from "antd/es/layout/layout";
// import ModalEmployeeAdd from "../../fragments/modals/ModalEmployeeAdd"
import Main from "../../pages/Main";
import EmployeesTable from "./EmployeesTable";
import Nav from "../Navigation";
import "../../../general.css"
import MyModal from "../schedules/Modal";
import FormEmployeeAdd from "../projects/forms/FormEmployeeAdd";


const Employees = () => {
  const nav = [
    { link: "/admin", label: "פרויקטים" },
    { link: "/quality", label: "בקרת איכות" },
    { link: "/employees", label: "עובדים" },
  ];


  const components = [EmployeesTable];
  return (
    <div>
      <Header nav={nav} />
      <Main>
        <section className="section_main">
          <div className="mainSection">
            <MyModal content="להוסיף עובד חדש" btnStyle="primary"> <FormEmployeeAdd/></MyModal>
            {components.map((Component, index) => (
              <div style={{ padding: "20px" }}>
                <Component key={index} />
              </div>
            ))}
          </div>
        </section>
      </Main>
      <Footer className="footer">
        ©2023 Created by Nastya && Zhenya
      </Footer>
    </div>
  );
};

export default Employees;
