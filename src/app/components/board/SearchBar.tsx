"use client";

import { useState } from "react";
import { useBoardContext } from "@/app/providers/BoardProvider";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const { handleSearch } = useBoardContext();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("search query", query);

    handleSearch(query);
  };

  const onClear = () => {
    setQuery("");
    handleSearch("");
  };

  return (
    <form onSubmit={onSubmit} className="mb-4 flex">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search cards..."
        className="p-2 border rounded-l flex-grow"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-r-l"
      >
        Search
      </button>
      <button
        type="button"
        onClick={onClear}
        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-r"
      >
        Clear
      </button>
    </form>
  );
}
