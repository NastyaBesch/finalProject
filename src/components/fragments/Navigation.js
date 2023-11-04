// import { Button, Menu } from "antd";
// import { useState } from "react";
// function getItem(label, key, children, type) {
//   return {
//     key,
//     children,
//     label,
//     type,
//   };
// }
// const items = [
//   getItem(" פרויקטים", "sub1", [
//     getItem(
//       "פרויקטים בעבודה",
//       null,
//       null,
//       [getItem("Option 3", "3"), getItem("Option 4", "4")],
//       "group"
//     ),
//     getItem(
//       "אחסון משימות",
//       null,
//       null,
//       [getItem("Option 1", "1"), getItem("Option 2", "2")],
//       "group"
//     ),
//     getItem(
//       "ליצור משימה חדשה",
//       null,
//       null,
//       [getItem("Option 3", "3"), getItem("Option 4", "4")],
//       "group"
//     ),
//     getItem(
//       "אחסון תת משימות",
//       null,
//       null,
//       [getItem("Option 1", "1"), getItem("Option 2", "2")],
//       "group"
//     ),
//   ]),
//   getItem("עובדים", "sub2", [
//     getItem("Option 5", "5"),
//     getItem("Option 6", "6"),
//     getItem("Submenu", "sub3", null, [
//       getItem("Option 7", "7"),
//       getItem("Option 8", "8"),
//     ]),
//   ]),
//   getItem(" בקרת איכות", "sub4", [
//     getItem("Option 9", "9"),
//     getItem("Option 10", "10"),
//     getItem("Option 11", "11"),
//     getItem("Option 12", "12"),
//   ]),
// ];
// const onClick = (e) => {
//   console.log("click", e);
// };
// const Nav = () => {
//   const [collapsed, setCollapsed] = useState(false);
//   const toggleCollapsed = () => {
//     setCollapsed(!collapsed);
//   };
//   return (
//     <div
//       style={{
//         width: 256,
//       }}
//     >
//       <Menu
//         defaultSelectedKeys={["1"]}
//         defaultOpenKeys={["sub1"]}
//         mode="inline"
//         items={items}
//       />
//     </div>
//   );
// };
// export default Nav;
