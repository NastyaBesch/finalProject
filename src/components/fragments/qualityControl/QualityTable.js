import { Space, Table, Tag } from "antd";
import Axios from "axios";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import BtnDelete from "../buttons/BtnDelete";
import ModalQAUpdate from "../modals/ModalQAUpdate";
import BtnAddPhoto from "../buttons/BtnAddPhoto";
import MyModal from "../schedules/Modal";
import {FileImageTwoTone, FilterTwoTone} from "@ant-design/icons"
import "../projects/forms/employeeAdd.css"
import FilterOptionsComponent from "../filter/FilterOptionsComponent";
import FilterSearch from "../filter/FilterSearch";

const renderImageColumn = (imageKey) => (text, record) => {

  return (
    <>
      {text !== "images/null" ? (
        <MyModal
          content={
            <img
              src={`http://localhost:4000/${text}`}
              alt="תמונה"
              style={{ width: "100px", height: "auto" }} // Adjust the width as needed
            />
          }
          children={
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <img
                src={`http://localhost:4000/${text}`}
                alt="תמונה"
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          }
        />
      ) : (
        <BtnAddPhoto
          qaId={record.qa_id}
          onPhotoAdded={(photoUrl) => handlePhotoAdded(record.qa_id, photoUrl)}
        />
      )}
    </>
  );
};

const Qa = () => {
  const [data, setData] = useState([]);
  const [isDataUpdated, setDataUpdated] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const options = ["הושלם", "נוצר", "בבדיקה", "בתיקון"];

  const handlePhotoAdded = (record, photoUrl) => {
    // Update the record with the new photo URL in your data
    const updatedData = data.map((item) =>
      item.key === record.key ? { ...item, image_1: photoUrl } : item
    );
    console.log("Photo added:", photoUrl);
    setData(updatedData);
  };

  useEffect(() => {
    fetchData().then(() => {
      setFilteredData(data); // Initialize filteredData with the fetched data array
    });
  }, [isDataUpdated]);

  const fetchData = async () => {
    try {
      const connectionString = "http://localhost:4000/api/QA";
      const response = await Axios.post(connectionString);
      if (response != null) {
        const formattedData = response.data.map((row) => ({
          ...row,
          key: uuidv4(),
        }));
        setData(formattedData);
        setDataUpdated(false);
      }
    } catch (error) {
      console.log("Error fetching data", error);
    }
  };

  const handleFilterChange = (filteredArray) => {
    setFilteredData(filteredArray); // Update the filtered data state
  };

  const columns = [
    {
      title: "מחיקה",
      dataIndex: "del",
      key: "del",
      render: (_, record) => (
        <BtnDelete
          link="deleteQa"
          delByElement={record.qa_id} // Pass the unique key (qaId) to the BtnDeleteQA component
        />
      ),
    },
    {
      title: "עדכון",
      dataIndex: "update",
      key: "update",
      render: (_, item) => (
        <ModalQAUpdate
          key={`modal-${item.qa_id}`}
          qa={{
            key: item.qa_id,
            description: item.description,
            status: item.status,
          }}
        />
      ),
    },
    {
      title: "תמונה 3",
      dataIndex: "image_3",
      key: "image_3",
      render: renderImageColumn("image_3"),
    },
    {
      title: "תמונה 2",
      dataIndex: "image_2",
      key: "image_2",
      render: renderImageColumn("image_2"),
    },
    {
      title: "תמונה 1",
      dataIndex: "image_1",
      key: "image_1",
      render: renderImageColumn("image_1"),
    },
    {
      title: (
        <div>
          <span>סטטוס</span>
          <FilterOptionsComponent
            items={data}
            options={options}
            onFilterChange={handleFilterChange}
            textFilter="בחר סטטוס"
            filterbyItems="status"
          />
        </div>
      ),
      key: "status",
      dataIndex: "status",
    },

    {
      title: "הערות",
      dataIndex: "description",
      key: "description",
      className: "scrollable-column",
    },
    {
      title: "שם משימה",
      dataIndex: "task_name",
      key: "task_name",
    },
    {
      title: (
        <>
          <span>שם פרויקט</span>
          <FilterSearch
            items={data}
            onFilterChange={handleFilterChange}
            textSearch="שם פרויקט"
            search="project_name"
          />
        </>
      ),
      dataIndex: "project_name",
      key: "project_name",
    },
  ];

  return (
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{
          pageSize: 50,
        }}
      />
  );
};

export default Qa;
