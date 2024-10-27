"use client";

import { useState } from "react";

interface AddColumnProps {
  boardId: string;
  onAddColumn: (title: string) => Promise<void>;
}

export function AddColumn({ boardId, onAddColumn }: AddColumnProps) {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      await onAddColumn(title);
      setTitle("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-100 p-4 rounded min-w-[250px]"
    >
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New Column Title"
        className="w-full p-2 mb-2 rounded"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded w-full"
      >
        Add Column
      </button>
    </form>
  );
}
