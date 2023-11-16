import React, { useEffect, useState, Space } from "react";
import { Table, Button, Tooltip } from "antd";
import MyModal from "../schedules/Modal";
import ModalProjectUpdate from "../modals/ModalProjectUpdate";
import FormTaskAdd from "./forms/FormTasksAdd";
import CheckBoxTaskList from "../CheckBoxTasks";
import { Link } from "react-router-dom";
import BtnDelete from "../buttons/BtnDelete";
import FilterOptionsComponent from "../filter/FilterOptionsComponent";
import FilterSearch from "../filter/FilterSearch";

const ProjectTable = (userRole) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isDataUpdated, setDataUpdated] = useState(true);
  const options = ["הושלם", "נוצר", "בתהליך", "באיחור"];
  

  useEffect(() => {
    fetchData();
    setFilteredData(data); // Initialize filteredData with the data array
  }, [isDataUpdated]);

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/allProject", {
        method: "POST",
      });
      const response = await res.json();
      setData(response);
      setDataUpdated(false); // Reset the isDataUpdated state variable
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFilterChange = (filteredArray) => {
    setFilteredData(filteredArray); // Update the filtered data state
  };

  const handleReload = () => {
    window.location.reload(false); // Reload the page without using cache
  };

  const columns = [
    {
      title: "",
      dataIndex: "alert",
      key: "alert",
      render: (alert, record) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          {alert[2] && (
            <Tooltip title="באיחור">
              <div className="circle" style={{ backgroundColor: "red" }} />
            </Tooltip>
          )}
          {alert[3] && (
            <Tooltip title="בבדיקה">
              <div className="circle" style={{ backgroundColor: "orange" }} />
            </Tooltip>
          )}
          {alert[4] && (
            <Tooltip title="בתיקון">
              <div className="circle" style={{ backgroundColor: "yellow" }} />
            </Tooltip>
          )}
          {record.status === "הושלם" && (
            <Tooltip title="הושלם">
              <div
                className="circle"
                style={{ backgroundColor: "hsl(102, 53%, 61%)" }}
              />
            </Tooltip>
          )}
        </div>
      ),
    },
    userRole === "מנהל פרויקט"
      ? {
          title: "",
          dataIndex: "del",
          key: "del",
          render: (_, record) =>
            record.status === "הושלם" ? (
              <BtnDelete delByElement={record.key} link="deleteProject" />
            ) : null,
        }
      : null,
    {
      title: "",
      dataIndex: "link",
      key: "link",
      render: (text, record) => (
        <Link to={`/project-details/${record.key}`}>
          <Button>לוח זמנים </Button>
        </Link>
      ),
    },
    {
      title: "",
      dataIndex: "add",
      key: "add",
      render: (text, record) => (
        <MyModal content="הוספת משימות">
          <CheckBoxTaskList
            projectId={record.key}
            daysBetweenTasks={record.daysBetweenTasks}
          />
          <FormTaskAdd />
        </MyModal>
      ),
    },
    {
      title: "",
      dataIndex: "link",
      key: "link",
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
            items={data}
            options={options}
            onFilterChange={handleFilterChange}
            textFilter="בחר סטטוס"
            filterbyItems="status"
          />
        </>
      ),
      dataIndex: "status",
      key: "status",
    },
    {
      title: (
        <>
          <span>שם פרויקט</span>
          <FilterSearch
            items={data}
            onFilterChange={handleFilterChange}
            textSearch="שם פרויקט"
            search="name"
          />
        </>
      ),
      dataIndex: "name",
      key: "name",
    },
  ];

  return (
    <Table
      columns={columns.filter((column) => column !== null)}
      dataSource={filteredData.map((item) => ({
        key: item.project_id,
        name: item.name,
        team_id: item.team_id,
        status: item.status,
        user_name: item.user_name,
        last_name: item.last_name,
        daysBetweenTasks: item.daysBetweenTasks,
        alert: item.alert,
        link: (
          <ModalProjectUpdate
            key={`modal-${item.project_id}`}
            project={{
              key: item.project_id,
              name: item.name,
              user_id: item.user_id,
              status: item.status,
            }}
          />
        ),
        add: (
          <MyModal content="הוספת משימות">
            <CheckBoxTaskList
              projectId={item.project_id}
              daysBetweenTasks={item.daysBetweenTasks}
              startDate={item.formatted_start_date}
            />
            <FormTaskAdd />
          </MyModal>
        ),
      }))}
    />
  );
};

export default ProjectTable;
