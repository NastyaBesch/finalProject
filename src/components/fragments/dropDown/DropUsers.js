import React, { useState, useEffect } from "react";

const DropdownUsers = ({ value, onChange }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/data", {
          method: "POST",
        });
        const response = await res.json();
        setUsers(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <select mode="multiple" value={value} onChange={onChange}>
      <option value=""></option>
      {users.map((user) => (
        <option key={user.id} value={user.id}>
          {user.user_name} {user.last_name}
        </option>
      ))}
    </select>
  );
};

export default DropdownUsers;
