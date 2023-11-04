import React from "react";
import { useParams, Link } from "react-router-dom";
import Header from "../headers/Header";
import { Footer } from "antd/es/layout/layout";
import ProjectDetails from "../projects/ProjectDetails";
import Main from "../../pages/Main";
import { Button } from "antd";

const Schedules = () => {
  const nav = [
    { link: "/admin", label: "פרויקטים" },
    { link: "/quality", label: "בקרת איכות" },
    { link: "/employees", label: "עובדים" },
  ];

  // Get the projectId from the URL parameter using useParams
  const { projectId } = useParams();
  const { projectName } = useParams();

  return (
    <div>
      <Header nav={nav} />

      <Main>
        <section className="section_main">
          <div className="mainSection">
            <Link to="/admin">
              <Button type="primary">חזרה לפרויקטים</Button>
            </Link>
            {/* Pass the projectId as a prop to ProjectDetails component */}
            <ProjectDetails projectId={projectId} />
          </div>
        </section>
      </Main>

      <Footer className="footer">
     ©2023 Created by Nastya
      </Footer>
    </div>
  );
};

export default Schedules;

