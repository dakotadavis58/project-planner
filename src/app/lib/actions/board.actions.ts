"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../db";

export async function getBoards() {
  try {
    const boards = await prisma.board.findMany({
      include: {
        columns: {
          include: {
            cards: {
              include: {
                labels: true,
              },
            },
          },
        },
      },
    });
    return boards;
  } catch (error) {
    console.error("Error fetching boards:", error);
    throw new Error("Failed to fetch boards");
  }
}

export async function createBoard(formData: FormData) {
  const title = formData.get("title") as string;
  try {
    const newBoard = await prisma.board.create({
      data: { title },
    });
    revalidatePath("/");
    return newBoard;
  } catch (error) {
    console.error("Error creating board:", error);
    throw new Error("Failed to create board");
  }
}

export async function getBoard(id: string) {
  try {
    const board = await prisma.board.findUnique({
      where: { id },
      include: {
        columns: {
          include: {
            cards: {
              include: {
                labels: true,
              },
            },
          },
        },
      },
    });
    if (!board) {
      throw new Error("Board not found");
    }
    return board;
  } catch (error) {
    console.error("Error fetching board:", error);
    throw new Error("Failed to fetch board");
  }
}

export async function createColumn(boardId: string, title: string) {
  try {
    const newColumn = await prisma.column.create({
      data: {
        title,
        boardId,
        order: await prisma.column.count({ where: { boardId } }),
      },
    });
    revalidatePath(`/boards/${boardId}`);
    return newColumn;
  } catch (error) {
    console.error("Error creating column:", error);
    throw new Error("Failed to create column");
  }
}
