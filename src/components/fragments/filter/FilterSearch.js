import React, { useState } from "react";
import { Input, Popover, Button, Space } from "antd";
import { FilterTwoTone } from "@ant-design/icons";

const FilterSearch = ({ items, onFilterChange, textSearch, search }) => {
  const [searchFilter, setSearchFilter] = useState(search);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchFilter(value);
    filterItems(value);
  };

  const filterItems = (searchValue) => {
    const filtered = items.filter((item) => {
      if (searchValue && !item[search].includes(searchValue)) {
        return false;
      }
      return true;
    });
    onFilterChange(filtered); // Pass the filtered array to the parent component
  };

  const content = (
    <div>
      <Input
        type="text"
        value={searchFilter}
        onChange={handleSearchChange}
        placeholder={textSearch}
      />
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

export default FilterSearch;
