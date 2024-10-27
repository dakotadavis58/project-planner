"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../db";
import { Board, Card } from "../types";

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

export async function getBoard(id: string): Promise<Board> {
  try {
    const board = await prisma.board.findUnique({
      where: { id },
      include: {
        columns: {
          orderBy: { order: "asc" },
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

export async function createCard(
  columnId: string,
  title: string,
  description: string = "",
  dueDate: Date | null = null
) {
  try {
    const newCard = await prisma.card.create({
      data: {
        title,
        description,
        columnId,
        order: await prisma.card.count({ where: { columnId } }),
        dueDate,
      },
    });
    const column = await prisma.column.findUnique({
      where: { id: columnId },
      include: { board: true },
    });
    revalidatePath(`/boards/${column?.board.id}`);
    return newCard;
  } catch (error) {
    console.error("Error creating card:", error);
    throw new Error("Failed to create card");
  }
}

export async function updateCard(
  cardId: string,
  title?: string,
  description?: string,
  dueDate?: Date | null,
  columnId?: string
): Promise<Card> {
  try {
    const updateData: {
      title?: string;
      description?: string;
      dueDate?: Date | null;
      columnId?: string;
    } = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (dueDate !== undefined) updateData.dueDate = dueDate;
    if (columnId !== undefined) updateData.columnId = columnId;

    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: updateData,
      include: { labels: true, column: { include: { board: true } } },
    });

    revalidatePath(`/boards/${updatedCard.column.board.id}`);
    return updatedCard;
  } catch (error) {
    console.error("Error updating card:", error);
    throw new Error("Failed to update card");
  }
}

export async function deleteCard(cardId: string) {
  try {
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: { column: { include: { board: true } } },
    });
    await prisma.card.delete({ where: { id: cardId } });
    revalidatePath(`/boards/${card?.column.board.id}`);
  } catch (error) {
    console.error("Error deleting card:", error);
    throw new Error("Failed to delete card");
  }
}

export async function updateColumn(columnId: string, title: string) {
  try {
    const updatedColumn = await prisma.column.update({
      where: { id: columnId },
      data: { title },
    });
    const column = await prisma.column.findUnique({
      where: { id: columnId },
      include: { board: true },
    });
    revalidatePath(`/boards/${column?.board.id}`);
    return updatedColumn;
  } catch (error) {
    console.error("Error updating column:", error);
    throw new Error("Failed to update column");
  }
}

export async function deleteColumn(columnId: string) {
  try {
    const column = await prisma.column.findUnique({
      where: { id: columnId },
      include: { board: true },
    });

    if (!column) {
      throw new Error("Column not found");
    }

    await prisma.column.delete({
      where: { id: columnId },
    });

    revalidatePath(`/boards/${column.board.id}`);
  } catch (error) {
    console.error("Error deleting column:", error);
    throw new Error("Failed to delete column");
  }
}

export async function updateColumnOrder(
  boardId: string,
  columnOrder: string[]
) {
  try {
    await prisma.$transaction(
      columnOrder.map((columnId, index) =>
        prisma.column.update({
          where: { id: columnId },
          data: { order: index },
        })
      )
    );
    revalidatePath(`/boards/${boardId}`);
  } catch (error) {
    console.error("Error updating column order:", error);
    throw new Error("Failed to update column order");
  }
}

export async function addLabelToCard(
  cardId: string,
  name: string,
  color: string
) {
  try {
    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: {
        labels: {
          create: { name, color },
        },
      },
      include: { labels: true },
    });
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: { column: { include: { board: true } } },
    });
    revalidatePath(`/boards/${card?.column.board.id}`);
    return updatedCard;
  } catch (error) {
    console.error("Error adding label to card:", error);
    throw new Error("Failed to add label to card");
  }
}

export async function removeLabelFromCard(cardId: string, labelId: string) {
  try {
    const updatedCard = await prisma.card.update({
      where: { id: cardId },
      data: {
        labels: {
          disconnect: { id: labelId },
        },
      },
      include: { labels: true },
    });
    const card = await prisma.card.findUnique({
      where: { id: cardId },
      include: { column: { include: { board: true } } },
    });
    revalidatePath(`/boards/${card?.column.board.id}`);
    return updatedCard;
  } catch (error) {
    console.error("Error removing label from card:", error);
    throw new Error("Failed to remove label from card");
  }
}

export async function updateBoard(boardId: string, data: Partial<Board>) {
  try {
    const updatedBoard = await prisma.board.update({
      where: { id: boardId },
      data: {
        title: data.title,
        color: data.color,
        columns: data.columns
          ? {
              upsert: data.columns.map((column, index) => ({
                where: { id: column.id },
                update: {
                  title: column.title,
                  order: index,
                  cards: {
                    upsert: column.cards.map((card, cardIndex) => ({
                      where: { id: card.id },
                      update: {
                        title: card.title,
                        description: card.description,
                        dueDate: card.dueDate,
                        order: cardIndex,
                      },
                      create: {
                        title: card.title,
                        description: card.description || "",
                        dueDate: card.dueDate,
                        order: cardIndex,
                      },
                    })),
                  },
                },
                create: {
                  title: column.title,
                  order: index,
                  cards: {
                    create: column.cards.map((card, cardIndex) => ({
                      title: card.title,
                      description: card.description || "",
                      dueDate: card.dueDate,
                      order: cardIndex,
                    })),
                  },
                },
              })),
            }
          : undefined,
      },
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
    revalidatePath(`/boards/${boardId}`);
    return updatedBoard;
  } catch (error) {
    console.error("Error updating board:", error);
    throw new Error("Failed to update board");
  }
}

export async function deleteBoard(boardId: string) {
  try {
    await prisma.board.delete({
      where: { id: boardId },
    });
    revalidatePath("/");
  } catch (error) {
    console.error("Error deleting board:", error);
    throw new Error("Failed to delete board");
  }
}

// Add this new function to handle card reordering within a column
export async function updateCardOrder(
  columnId: string,
  cardOrder: { id: string; order: number }[]
) {
  try {
    await prisma.$transaction(
      cardOrder.map(({ id, order }) =>
        prisma.card.update({
          where: { id },
          data: { order },
        })
      )
    );

    const column = await prisma.column.findUnique({
      where: { id: columnId },
      include: { board: true },
    });

    revalidatePath(`/boards/${column?.board.id}`);
  } catch (error) {
    console.error("Error updating card order:", error);
    throw new Error("Failed to update card order");
  }
}
