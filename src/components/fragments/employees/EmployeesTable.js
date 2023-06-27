import React, { useEffect, useState } from "react";
import { Button, Table } from "antd";
import BtnDeleteEmployee from "../buttons/BtndeleteEmployee";
import ModalEmployeesUpdate from "./ModalEmployeUpdate";

function EmployeesTable() {
  const [data, setData] = useState([]);
  const [isDataUpdated, setDataUpdated] = useState(false);

  useEffect(() => {
    fetchData();
  }, [isDataUpdated]); // Update the data when isDataUpdated changes 

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/data", {
        method: "POST",
      });
      const response = await res.json();
      console.log(response);
      setData(response);
      setDataUpdated(false); // Reset the isDataUpdated state variable
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const columns = [
   {
      title: "",
      dataIndex: "link",
      key: "link",
    },
    {
      title: "תפקיד",
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
      title: "שם פרטי",
      dataIndex: "user_name",
      key: "user_name",
    },
  ];

  return (
    <Table
      className="table"
      columns={columns}
      dataSource={data.map((item) => ({
        key: item.id,
        mail: item.email,
        last_name: item.last_name,
        user_name: item.user_name,
        role: item.role,
        // psw: item.password_hash,
        // btn: (
        //   <BtnDeleteEmployee
        //     key={`btn-${item.id}`}
        //     employeeId={item.id}
        //     handleDelete={handleDeleteEmployee}
        //   />
        // ),
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
  );
    }

export default EmployeesTable;
