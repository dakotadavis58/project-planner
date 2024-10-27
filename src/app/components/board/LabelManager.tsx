"use client";

import { useState } from "react";
import { Label } from "@prisma/client";

type LabelManagerProps = {
  labels: Label[];
  onAddLabel: (name: string, color: string) => void;
  onRemoveLabel: (labelId: string) => void;
};

export function LabelManager({
  labels,
  onAddLabel,
  onRemoveLabel,
}: LabelManagerProps) {
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("#000000");

  const handleAddLabel = () => {
    if (newLabelName.trim()) {
      onAddLabel(newLabelName, newLabelColor);
      setNewLabelName("");
      setNewLabelColor("#000000");
    }
  };

  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-2">Labels</h4>
      <div className="flex flex-wrap mb-2">
        {labels.map((label) => (
          <span
            key={label.id}
            className="text-xs mr-1 mb-1 px-2 py-1 rounded flex items-center"
            style={{ backgroundColor: label.color }}
          >
            {label.name}
            <button
              onClick={() => onRemoveLabel(label.id)}
              className="ml-1 text-xs text-gray-600 hover:text-gray-800"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex items-center">
        <input
          type="text"
          value={newLabelName}
          onChange={(e) => setNewLabelName(e.target.value)}
          placeholder="New label name"
          className="flex-grow p-1 border rounded mr-2"
        />
        <input
          type="color"
          value={newLabelColor}
          onChange={(e) => setNewLabelColor(e.target.value)}
          className="mr-2"
        />
        <button
          onClick={handleAddLabel}
          className="bg-blue-500 text-white px-2 py-1 rounded"
        >
          Add Label
        </button>
      </div>
    </div>
  );
}
