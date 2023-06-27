import React, { useState } from "react";
import { Button, Modal} from "antd";
import "../../../general.css";

const MyModal = ({ children, content, btnStyle }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        style={{ width: "max-content"}}
        type={btnStyle}
      >
        {content}
      </Button>
      <Modal
        style={{ width: 1000 }}
        centered
        visible={open}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
      >
        {children}
      </Modal>
    </>
  );
};

export default MyModal;
