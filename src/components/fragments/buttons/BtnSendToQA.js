import React, { useState, useEffect } from "react";
import { Button, Space } from "antd";
import { v4 } from "uuid";
import axios from "axios";
// Import your data array or component here

const BtnAddQA = (props) => {
  const { scheduleId } = props;
  const [disable, setDisable] = useState(false);

  // Function to check if a QA exists
  const checkQaExists = async () => {
    try {
      const response = await axios.post("http://localhost:4000/api/qaCount", {
        scheduleId: scheduleId, // Make sure to use the correct key here
      });
      return response.data.success;
    } catch (error) {
      console.error("Error checking QA:", error);
      return false;
    }
  };

  useEffect(() => {
    const checkIfExists = async () => {
      const qaExists = await checkQaExists();
      setDisable(qaExists);
    };

    checkIfExists();
  }, []); // Empty dependency array to run the effect once

  const handleAddQA = async () => {
    try {
      const qa = {
        qa_id: v4(),
        schedule_id: scheduleId,
        description: "", // Set description and status as needed
        status: "",
      };

      if (!(await checkQaExists())) {
        const res = await fetch(`http://localhost:4000/api/addQA`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(qa),
        });

        if (res.ok) {
          setDisable(true);
        } 
      }
    } catch (error) {
      console.error("Error adding QA:", error);
      setMessage("Error adding QA");
    }
  };

  return (
    <Space wrap>
      <Button
        onClick={handleAddQA}
        disabled={disable}
        type={disable ? "default" : "primary"}
      >
        {disable ? "המשימה בבקרת איכות" : "לשלוח לבקרת איכות"}
      </Button>
    </Space>
  );
};

export default BtnAddQA;

