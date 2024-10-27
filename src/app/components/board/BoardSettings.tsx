"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBoardContext } from "@/app/providers/BoardProvider";

export function BoardSettings() {
  const { board, updateBoard, deleteBoard } = useBoardContext();
  const [title, setTitle] = useState(board?.title || "");
  const [color, setColor] = useState(board?.color || "");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleUpdate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await updateBoard(board?.id || "", {
        ...board,
        title,
        color,
        columns: board?.columns || [],
        createdAt: board?.createdAt || new Date(),
        updatedAt: new Date(),
        id: board?.id || "",
        lastModified: board?.lastModified || BigInt(0),
      });
      setIsEditing(false);
    } catch (err: unknown) {
      console.error("Error updating board:", err);
      setError("Failed to update board. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to delete this board? This action cannot be undone."
      )
    ) {
      setIsLoading(true);
      setError(null);
      try {
        await deleteBoard(board?.id || "");
        router.push("/");
      } catch (err: unknown) {
        console.error("Error deleting board:", err);
        setError("Failed to delete board. Please try again.");
        setIsLoading(false);
      }
    }
  };

  if (!isEditing) {
    return (
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold">{board?.title || ""}</h1>
        <div
          className="w-6 h-6 rounded"
          style={{ backgroundColor: board?.color || "" }}
        ></div>
        <button
          onClick={() => setIsEditing(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={isLoading}
        >
          Edit Board
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          disabled={isLoading}
        >
          {isLoading ? "Deleting..." : "Delete Board"}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 rounded"
        disabled={isLoading}
      />
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        className="border p-1 rounded"
        disabled={isLoading}
      />
      <button
        onClick={handleUpdate}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        disabled={isLoading}
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </button>
      <button
        onClick={() => setIsEditing(false)}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2"
        disabled={isLoading}
      >
        Cancel
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
