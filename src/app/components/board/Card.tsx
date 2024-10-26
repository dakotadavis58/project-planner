"use client";

import { Card as CardType } from "@prisma/client";

type CardProps = CardType & {
  labels: any[]; // Replace 'any' with your Label type when available
};

export function Card({ id, title, description, labels }: CardProps) {
  return (
    <div className="bg-white p-2 mb-2 rounded shadow">
      <h3 className="font-semibold">{title}</h3>
      {description && <p className="text-sm text-gray-600">{description}</p>}
      {labels.length > 0 && (
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
