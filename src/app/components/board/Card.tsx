"use client";

import { Card as CardType } from "@/app/lib/types";
import { useBoardContext } from "@/app/providers/BoardProvider";

type CardProps = CardType & {
  onClick: () => void;
  columnId: string;
};

export function Card({
  id,
  title,
  description,
  dueDate,
  labels,
  lastModified,
  order,
  columnId,
  onClick,
}: CardProps) {
  const { setSelectedCard } = useBoardContext();

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Prevent column drag
    e.dataTransfer.setData("cardId", id);
    e.dataTransfer.setData("sourceColumnId", columnId);
    e.dataTransfer.setData("type", "card");
  };

  return (
    <div
      className="bg-white p-2 mb-2 rounded shadow cursor-pointer"
      onClick={() =>
        setSelectedCard({
          id,
          title,
          description,
          dueDate,
          labels,
          columnId,
          order,
          lastModified,
        })
      }
      draggable
      onDragStart={handleDragStart}
    >
      <h3 className="font-semibold">{title}</h3>
      {description && <p className="text-sm text-gray-600">{description}</p>}
      {dueDate && (
        <p className="text-sm text-gray-500 mt-1">
          Due: {new Date(dueDate).toLocaleDateString()}
        </p>
      )}
      {labels && labels.length > 0 && (
        <div className="flex mt-2">
          {labels.map((label) => (
            <span
              key={label.id}
              className="text-xs mr-1 px-2 py-1 rounded"
              style={{ backgroundColor: label.color }}
            >
              {label.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
