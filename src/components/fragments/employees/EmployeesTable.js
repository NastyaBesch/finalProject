import React, { useEffect, useState } from "react";
import { Table } from "antd";
import ModalEmployeesUpdate from "./ModalEmployeUpdate";
import FilterOptionsComponent from "../filter/FilterOptionsComponent";
import FilterSearch from "../filter/FilterSearch";

function EmployeesTable() {
  const [data, setData] = useState([]);
  const [isDataUpdated, setDataUpdated] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const options = ["מנהל פרויקט", "מהנדס ביצוע", "מנהל עבודה"];

  useEffect(() => {
    fetchData();
    setFilteredData(data); // Initialize filteredData with the data array
  }, [isDataUpdated]);

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/data", {
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

  const columns = [
    {
      title: "",
      dataIndex: "link",
      key: "link",
    },
    {
      title: (
        <div>
          <span>תפקיד</span>
          <FilterOptionsComponent
            items={data}
            options={options}
            onFilterChange={handleFilterChange}
            textFilter="בחר תפקיד"
            filterbyItems="role"
          />
        </div>
      ),
      dataIndex: "role",
      key: "role",
    },
    {
      title: "כתובת אמייל",
      dataIndex: "mail",
      key: "mail",
    },
    {
      title: "שם משפחה",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: (
        <>
          <span>שם פרטי</span>
          <FilterSearch
            items={data}
            onFilterChange={handleFilterChange}
            textSearch="שם פרטי"
            search="user_name"
          />
        </>
      ),
      dataIndex: "user_name",
      key: "user_name",
    },
  ];

  return (
    <>
      <Table
        className="table"
        columns={columns}
        dataSource={filteredData.map((item) => ({
          key: item.id,
          mail: item.email,
          last_name: item.last_name,
          user_name: item.user_name,
          role: item.role,
          link: (
            <ModalEmployeesUpdate
              key={`modal-${item.id}`}
              employee={{
                key: item.id,
                email: item.email,
                password_hash: item.password_hash,
                last_name: item.last_name,
                user_name: item.user_name,
                role: item.role,
              }}
            />
          ),
        }))}
      />
    </>
  );
}

export default EmployeesTable;
