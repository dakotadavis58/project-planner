"use client";

import { useState } from "react";
import { useBoardContext } from "@/app/providers/BoardProvider";

export function FilterBar() {
  const [dueDateFilter, setDueDateFilter] = useState("");
  const { handleFilter } = useBoardContext();

  const applyFilter = () => {
    handleFilter(dueDateFilter);
  };

  const clearFilter = () => {
    setDueDateFilter("");
    handleFilter("");
  };

  return (
    <div className="mb-4">
      <h3 className="font-semibold mb-2">Filter Cards by Due Date:</h3>
      <select
        value={dueDateFilter}
        onChange={(e) => setDueDateFilter(e.target.value)}
        className="p-2 border rounded mr-2"
      >
        <option value="">All Due Dates</option>
        <option value="overdue">Overdue</option>
        <option value="today">Due Today</option>
        <option value="week">Due This Week</option>
        <option value="month">Due This Month</option>
      </select>
      <button
        onClick={applyFilter}
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
      >
        Apply Filter
      </button>
      <button
        onClick={clearFilter}
        className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
      >
        Clear Filter
      </button>
    </div>
  );
}
