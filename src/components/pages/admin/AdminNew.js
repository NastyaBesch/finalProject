import React from "react";
import { Breadcrumb, Layout, Menu } from "antd";
import ProjectTable from "../../fragments/projects/ProjectTable";

const { Header, Content, Footer } = Layout;

const New = ({ content, navigation }) => {
  return (
    <Layout className="layout">
      <Header
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <div className="demo-logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["1"]}
          items={navigation.map((nav, index) => {
            const key = index + 1;
            return {
              key,
              label: nav,
            };
          })}
        />
      </Header>
      <Content
        style={{
          padding: "0 50px",
        }}
      >
        <div className="site-layout-content">{content}</div>
      </Content>
      <Footer
        style={{
          textAlign: "center",
        }}
      >
        Ant Design ©2023 Created by Ant UED
      </Footer>
    </Layout>
  );
};

export default New;
