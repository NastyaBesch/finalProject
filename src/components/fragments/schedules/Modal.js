import React, { useState } from "react";
import { Button, Modal} from "antd";
import "../../../general.css";

const MyModal = ({ children, content, btnStyle }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        style={{ width: "max-content" }}
        type={btnStyle}
      >
        {content}
      </Button>
      <Modal
        style={{ maxWidth: "content", width: "800px", textAlign: "start" }}
        centered
        // visible={open}
        open={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        {children}
      </Modal>
    </>
  );
};

export default MyModal;
