import {
  Board as PrismaBoard,
  Column as PrismaColumn,
  Card as PrismaCard,
  Label,
} from "@prisma/client";

export interface Card extends Omit<PrismaCard, "createdAt" | "updatedAt"> {
  labels: Label[];
}

export interface Column extends Omit<PrismaColumn, "boardId"> {
  cards: Card[];
}

export interface Board extends Omit<PrismaBoard, "createdAt" | "updatedAt"> {
  columns: Column[];
  createdAt: Date;
  updatedAt: Date;
}
