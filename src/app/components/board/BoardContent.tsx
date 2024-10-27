"use client";

import { Column } from "./Column";
import { AddColumn } from "./AddColumn";
import { SearchBar } from "./SearchBar";
import { FilterBar } from "./FilterBar";
import { CardModal } from "./CardModal";
import { useBoardContext } from "@/app/providers/BoardProvider";
import { DragEvent } from "react";

export function BoardContent() {
  const {
    filteredBoard,
    selectedCard,
    addColumn,
    setSelectedCard,
    reorderColumns,
  } = useBoardContext();

  const allLabels = filteredBoard?.columns.flatMap((column) =>
    column.cards.flatMap((card) => card.labels)
  );
  const uniqueLabels = Array.from(
    new Set(allLabels?.map((label) => JSON.stringify(label)))
  ).map((str) => JSON.parse(str));

  const handleDragStart = (e: DragEvent<HTMLDivElement>, columnId: string) => {
    e.dataTransfer.setData("columnId", columnId);
    e.dataTransfer.setData("type", "column");
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (
    e: DragEvent<HTMLDivElement>,
    targetColumnId: string
  ) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("type");
    if (type === "column") {
      const draggedColumnId = e.dataTransfer.getData("columnId");
      await reorderColumns(draggedColumnId, targetColumnId);
    }
  };

  return (
    <div>
      {/* <SearchBar /> */}
      <FilterBar labels={uniqueLabels} />
      <div className="flex space-x-4 overflow-x-auto">
        {filteredBoard?.columns.map((column) => (
          <Column
            key={column.id}
            {...column}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        ))}
        <AddColumn boardId={filteredBoard?.id || ""} onAddColumn={addColumn} />
      </div>
      {selectedCard && <CardModal />}
    </div>
  );
}
