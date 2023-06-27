import { Select, Space } from "antd";
import React, { useState, useEffect } from "react";

const SelectMy = () => {
  const [subTasks, setSubTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/allSubTasks", {
          method: "POST",
        });
        const response = await res.json();
        setSubTasks(response); // Update the function name to setSubTasks
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const options = subTasks.map((subTask) => ({
    label: subTask.name,
    value: subTask.name,
  }));

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  return (
    <Space
      style={{
        width: "100%",
      }}
      direction="vertical"
    >
      <Select
        mode="multiple"
        allowClear
        style={{
          width: "100%",
        }}
        placeholder=" בחר מסיצות"
        defaultValue={""}
        onChange={handleChange}
        options={options}
      />
    
    </Space>
  );
};

export default SelectMy;
