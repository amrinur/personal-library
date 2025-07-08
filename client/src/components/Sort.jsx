import { useState } from "react";

const Sort = ({ onSortChange }) => {
  const [sortBy, setSortBy] = useState('title');
  const [sortOrder, setSortOrder] = useState('asc');

  // Removed unused handleSortChange function

  return (
    <select 
      className="px-4 py-2 border-2 border-black bg-[#222] text-white  shadow-[2px_2px_0_0_#fff] focus:outline-none"
      onChange={(e) => {
        const [field, order] = e.target.value.split('-');
        setSortBy(field);
        setSortOrder(order);
        onSortChange(field, order);
      }}
      value={`${sortBy}-${sortOrder}`}
    >
    </select>
  );
};

export default Sort;