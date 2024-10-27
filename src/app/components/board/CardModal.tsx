"use client";

import { useState } from "react";
import { useBoardContext } from "@/app/providers/BoardProvider";

export function CardModal() {
  const {
    selectedCard,
    setSelectedCard,
    updateCard,
    refreshBoard,
    deleteCard,
  } = useBoardContext();

  if (!selectedCard) return null;

  const [title, setTitle] = useState(selectedCard.title);
  const [description, setDescription] = useState(
    selectedCard.description || ""
  );
  const [dueDate, setDueDate] = useState(
    selectedCard.dueDate
      ? new Date(selectedCard.dueDate).toISOString().split("T")[0]
      : ""
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await updateCard({
        ...selectedCard,
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
      });
      setSelectedCard(null);
      refreshBoard();
    } catch (err) {
      console.error("Error updating card:", err);
      setError("Failed to update card. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this card?")) {
      setIsLoading(true);
      setError(null);
      try {
        await deleteCard(selectedCard.id);
        setSelectedCard(null);
        refreshBoard();
      } catch (err) {
        console.error("Error deleting card:", err);
        setError("Failed to delete card. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Card</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
          placeholder="Card Title"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
          placeholder="Description"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-2 mb-2 border rounded"
        />
        <div className="flex justify-between mt-4">
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update"}
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded"
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
          <button
            onClick={() => setSelectedCard(null)}
            className="bg-gray-300 px-4 py-2 rounded"
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
