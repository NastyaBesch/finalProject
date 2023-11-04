import React, { useState } from "react";
import { Popover, Button, Space } from "antd";
import { FilterTwoTone } from "@ant-design/icons";

const FilterOptionsComponent = ({ items, options, onFilterChange, filterbyItems, textFilter}) => {
  const [selectedOption, setSelectedOption] = useState("");
  
  const handleOptionChange = (event) => {
    const option = event.target.value;
    setSelectedOption(option);
    filterItems(option);
  };

  const filterItems = (option) => {
    const filtered = items.filter((item) => {
      if (option && item[filterbyItems] !== option) {
        return false;
      }
      return true;
    });
    onFilterChange(filtered); // Pass the filtered array to the parent component
  };

   const content = (
   <div>
      <select value={selectedOption} onChange={handleOptionChange}>
        <option value="">
          <>
            <FilterTwoTone /> {textFilter}
          </>
        </option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div dir="rtl">
      <Space>
        <Popover content={content} trigger="click">
          <Button icon={<FilterTwoTone />} />
        </Popover>
      </Space>
    </div>
  );
    
};

export default FilterOptionsComponent;
