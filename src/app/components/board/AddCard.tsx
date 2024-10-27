"use client";

import { useState } from "react";
import { useBoardContext } from "@/app/providers/BoardProvider";

interface AddCardProps {
  columnId: string;
}

export function AddCard({ columnId }: AddCardProps) {
  const [title, setTitle] = useState("");
  const { addCard } = useBoardContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      await addCard(columnId, title);
      setTitle("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a card..."
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        className="mt-2 bg-blue-500 text-white p-2 rounded w-full"
      >
        Add Card
      </button>
    </form>
  );
}
