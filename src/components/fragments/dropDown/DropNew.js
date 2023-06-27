// import React, { useState, useEffect } from "react";

// const DropdownComponent = ({ options, value, onChange }) => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch(options.apiEndpoint, {
//           method: "POST",
//         });
//         const response = await res.json();
//         setData(response);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [options.apiEndpoint]);

//   return (
//     <select value={value} onChange={onChange}>
//       <option value=""></option>

//       {data.map((item) => (
//         <option key={item.id} value={item.id}>
//           {item.name}
//         </option>
//       ))}
//     </select>
//   );
// };

// export default DropdownComponent;
