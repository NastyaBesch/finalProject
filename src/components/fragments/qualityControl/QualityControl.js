import React from "react";
import Header from "../../fragments/headers/Header";
import { Footer } from "antd/es/layout/layout";
import Main from "../../pages/Main";
import Nav from "../Navigation";
import "../../../general.css";
import Qa from "../../fragments/qualityControl/QualityTable";


const QualityControl = () => {
  const nav = [
    { link: "/admin", label: "פרויקטים" },
    { link: "/quality", label: "בקרת איכות" },
    { link: "/employees", label: "עובדים" },
  ];

  const components = [Qa];

  return (
    <div>
      <Header nav={nav} />
      <Main>
        <section className="section_main">
          {/* <Nav /> */}
          <div className="mainSection">
            {components.map((Component, index) => (
              <div style={{ padding: "20px" }} key={index}>
                <Component />
              </div>
            ))}
          </div>
        </section>
      </Main>
      <Footer className="footer">
       ©2023 Created by Nastya
      </Footer>
    </div>
  );
};

export default QualityControl;
