"use client";

import { useState } from "react";
import { Card } from "./Card";
import { AddCard } from "./AddCard";
import { Column as ColumnType } from "@/app/lib/types";
import { useBoardContext } from "@/app/providers/BoardProvider";
import { updateColumn, deleteColumn } from "@/app/lib/actions/board.actions";

type ColumnProps = ColumnType & {
  onDragStart: (e: React.DragEvent<HTMLDivElement>, columnId: string) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, columnId: string) => void;
};

export function Column({
  id,
  title,
  onDragStart,
  onDragOver,
  onDrop,
}: ColumnProps) {
  const { board, refreshBoard, setSelectedCard, moveCard } = useBoardContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);

  const column = board?.columns.find((col) => col.id === id);
  if (!column) return null;

  const handleUpdate = async () => {
    await updateColumn(id, editTitle);
    setIsEditing(false);
    refreshBoard();
  };

  const handleDelete = async () => {
    if (
      confirm(
        "Are you sure you want to delete this column? All cards in this column will be deleted."
      )
    ) {
      await deleteColumn(id);
      refreshBoard();
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("type");
    if (type === "card") {
      const cardId = e.dataTransfer.getData("cardId");
      const sourceColumnId = e.dataTransfer.getData("sourceColumnId");
      if (sourceColumnId !== id) {
        moveCard(cardId, sourceColumnId, id);
      }
    } else {
      onDrop(e, id);
    }
  };

  const handleColumnDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("type", "column");
    onDragStart(e, id);
  };

  return (
    <div
      className="bg-gray-100 p-4 rounded min-w-[250px]"
      draggable
      onDragStart={handleColumnDragStart}
      onDragOver={onDragOver}
      onDrop={handleDrop}
    >
      {isEditing ? (
        <div className="mb-4">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleUpdate}
              className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-300 px-2 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">{title}</h2>
          <div>
            <button
              onClick={() => setIsEditing(true)}
              className="text-blue-500 mr-2"
            >
              Edit
            </button>
            <button onClick={handleDelete} className="text-red-500">
              Delete
            </button>
          </div>
        </div>
      )}
      {column.cards.map((card) => (
        <Card
          key={card.id}
          {...card}
          columnId={id}
          onClick={() => setSelectedCard(card)}
        />
      ))}
      <AddCard columnId={id} />
    </div>
  );
}
