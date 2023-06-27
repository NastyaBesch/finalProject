import React from "react";
import { Alert, Button, Space } from "antd";

const PopUp = ({ myMessage }) => {
  return (
    <div style={{ position: "relative" }}>
      <Space
        direction="vertical"
        style={{
          width: "100%",
        }}
      >
        <Alert
          style={{
            textAlign: "center",
            padding: "20px",
            marginTop: "20px",
            fontSize: "1.7rem",
            backgroundColor: "rgb(248, 95, 95)",
            // maxWidth: "500px",
          }}
          message={<span dangerouslySetInnerHTML={{ __html: myMessage }} />}
          banner
          closable
        />
        {/* <Alert
          style={{
            textAlign: "center",
            padding: "20px",
            marginTop: "20px",
            fontSize: "1.7rem",
          }}
          type="error"
          message={<span dangerouslySetInnerHTML={{ __html: myMessage }} />}
          banner
          closable
        /> */}
      </Space>
    </div>
  );
};

export default PopUp;

// import React from "react";
// import { Alert, Button, Space } from "antd";

// const PopUp = ({ myMessage }) => {
//   return (
//     <div
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         width: "100%",
//         height: "100%",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "rgba(0, 0, 0, 0.5)",
//         zIndex: 9999,
//       }}
//     >
//       <div style={{ position: "relative" }}>
//         <Space direction="vertical">
//           <Alert
//             style={{
//               textAlign: "center",
//               padding: "20px",
//               margin: "20px",
//             }}
//             message={<span dangerouslySetInnerHTML={{ __html: myMessage }} />}
//             banner
//             closable
//           />
//           <Alert
//             type="error"
//             message={
//               <span dangerouslySetInnerHTML={{ __html: myMessage }} />
//             }
//             banner
//             closable
//           />
//         </Space>
//       </div>
//     </div>
//   );
// };

// export default PopUp;

