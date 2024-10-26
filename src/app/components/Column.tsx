"use client";

import { Card } from "./board/Card";
import { Column as ColumnType } from "@prisma/client";

type ColumnProps = ColumnType & {
  cards: any[]; // Replace 'any' with your Card type when available
};

export function Column({ id, title, cards }: ColumnProps) {
  return (
    <div className="bg-gray-100 p-4 rounded min-w-[250px]">
      <h2 className="font-semibold mb-2">{title}</h2>
      {cards.map((card) => (
        <Card key={card.id} {...card} />
      ))}
    </div>
  );
}
