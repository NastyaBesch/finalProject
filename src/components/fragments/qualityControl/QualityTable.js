import { Space, Table, Tag } from "antd";
import Axios from "axios";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const columns = [
  {
    title: "פרויקט",
    dataIndex: "project_name",
    key: "project_name",
  },
  {
    title: "תהליך",
    dataIndex: "task_name",
    key: "task_name",
  },
  {
    title: "תיאור",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "תמונה 1",
    dataIndex: "image_1",
    key: "image_1",
    render: (text) => (
      <a
        href={`http://localhost:4000/${text}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        הצג תמונה
      </a>
    ),
  },
  {
    title: "תמונה 2",
    dataIndex: "image_2",
    key: "image_2",
    render: (text) => (
      <a
        href={`http://localhost:4000/${text}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        הצג תמונה
      </a>
    ),
  },
  {
    title: "תמונה 3",
    dataIndex: "image_3",
    key: "image_3",
    render: (text) => (
      <a
        href={`http://localhost:4000/${text}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        הצג תמונה
      </a>
    ),
  },
  {
    title: "סטטוס",
    key: "status",
    dataIndex: "status",
    // render: (_, { tags }) => (
    //   <>
    //     {tags.map((tag) => {
    //       let color = tag.length > 5 ? "geekblue" : "green";
    //       if (tag === "loser") {
    //         color = "volcano";
    //       }
    //       return (
    //         <Tag color={color} key={tag}>
    //           {tag.toUpperCase()}
    //         </Tag>
    //       );
    //     })}
    //   </>
    // ),
  },
  {
    title: "פעולות",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const Qa = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const connectionString = "http://localhost:4000/api/QA";
        const response = await Axios.post(connectionString);
        const formatedData = response.data.map((row) => ({
          ...row,
          key: uuidv4(),
        }));
        setData(formatedData);
      } catch (error) {
        console.log("Error fechign data", error);
      }
    };
    fetchData();
  }, []);
  return data ? <Table columns={columns} dataSource={data} /> : null;
};

export default Qa;
