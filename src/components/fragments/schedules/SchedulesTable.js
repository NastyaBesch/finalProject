// import { SearchOutlined, EditOutlined } from "@ant-design/icons";
// import { Button, Input, Space, Table } from "antd";
// import { useRef, useState } from "react";
// import Highlighter from "react-highlight-words";
// import MyModal from "./Modal";



// const data = [
//   {
//     key: "1",
//     num: 1,
//     name: "פרויקט עי4",
//     start_date: "11.02.2022",
//     finish_date: "12.03.2023",
//     status: "פעיל",
//     modal: <Modal />,
//   },
//   {
//     key: "1",
//     num: 1,
//     name: "פרויקט עי4",
//     start_date: "11.02.2022",
//     finish_date: "12.03.2023",
//     status: "פעיל",
//     modal: <Modal />,
//   },
//   {
//     key: "1",
//     num: 1,
//     name: "פרויקט עי4",
//     start_date: "11.02.2022",
//     finish_date: "12.03.2023",
//     status: "פעיל",
//     modal: <Modal />,
//   },
//   {
//     key: "1",
//     num: 1,
//     name: "פרויקט עי4",
//     start_date: "11.02.2022",
//     finish_date: "12.03.2023",
//     status: "פעיל",
//     modal: <Modal />,
//   },
//   {
//     key: "1",
//     num: 1,
//     name: "פרויקט עי4",
//     start_date: "11.02.2022",
//     finish_date: "12.03.2023",
//     status: "פעיל",
//     modal: <Modal />,
//   },
// ];
// const SchedulesTable = () => {
//   const [searchText, setSearchText] = useState("");
//   const [searchedColumn, setSearchedColumn] = useState("");
//   const searchInput = useRef(null);
//   const handleSearch = (selectedKeys, confirm, dataIndex) => {
//     confirm();
//     setSearchText(selectedKeys[0]);
//     setSearchedColumn(dataIndex);
//   };
//   const handleReset = (clearFilters) => {
//     clearFilters();
//     setSearchText("");
//   };
//   const getColumnSearchProps = (dataIndex) => ({
//     filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
//       <div
//         style={{
//           padding: 8,
//         }}
//         onKeyDown={(e) => e.stopPropagation()}
//       >
//         <Input
//           ref={searchInput}
//           placeholder={`Search ${dataIndex}`}
//           value={selectedKeys[0]}
//           onChange={(e) =>
//             setSelectedKeys(e.target.value ? [e.target.value] : [])
//           }
//           onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
//           style={{
//             marginBottom: 8,
//           }}
//         />
//         <Space>
//           <Button
//             type="primary"
//             onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
//             icon={<SearchOutlined />}
//             size="small"
//             style={{
//               width: 250,
//             }}
//           >
//             חיפוס
//           </Button>
//         </Space>
//       </div>
//     ),
//     filterIcon: (filtered) => (
//       <SearchOutlined
//         style={{
//           color: "green",
//         }}
//       />
//     ),
//     onFilter: (value, record) =>
//       record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
//     onFilterDropdownOpenChange: (visible) => {
//       if (visible) {
//         setTimeout(() => searchInput.current?.select(), 100);
//       }
//     },
//     render: (text) =>
//       searchedColumn === dataIndex ? (
//         <Highlighter
//           highlightStyle={{
//             backgroundColor: "red",
//             padding: 0,
//           }}
//           searchWords={[searchText]}
//           autoEscape
//           textToHighlight={text ? text.toString() : ""}
//         />
//       ) : (
//         text
//       ),
//   });
//   const columns = [
//     {
//       title: "",
//       dataIndex: "modal",
//       key: "modal",
//     },
   
//     {
//       title: "סטטוס",
//       dataIndex: "status",
//       key: "status",
//       sorter: (a, b) => a.status.length - b.status.length,
//       sortDirections: ["descend", "ascend"],
//     }, 
//     {
//       title: "תהריך סיום ",
//       dataIndex: "finish_date",
//       key: "finish_date",
//     },
//     {
//       title: "תהריך התחלה",
//       dataIndex: "start_date",
//       key: "start_date",
//     },
//     {
//       title: "שם משימה",
//       dataIndex: "name",
//       key: "name",
//     },
//     {
//       title: "שם פרויקט",
//       dataIndex: "num",
//       key: "num",
//     },
   
//   ];
//   return <Table columns={columns} dataSource={data} />;
// };
// export default SchedulesTable;
