"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Board, Column, Card } from "../lib/types";
import {
  getBoard,
  updateBoard,
  updateColumnOrder,
  updateCard,
} from "../lib/actions/board.actions";

type BoardContextType = {
  board: Board | null;
  filteredBoard: Board | null;
  selectedCard: Card | null;
  setBoard: (board: Board | null) => void;
  setSelectedCard: (card: Card | null) => void;
  addColumn: (title: string) => void;
  addCard: (columnId: string, title: string) => void;
  updateCardInBoard: (updatedCard: Card) => void;
  deleteCardFromBoard: (cardId: string) => void;
  updateColumnInBoard: (columnId: string, title: string) => void;
  deleteColumnFromBoard: (columnId: string) => void;
  reorderColumns: (newOrder: string[]) => void;
  reorderCards: (
    sourceColumnId: string,
    destinationColumnId: string,
    cardId: string,
    newIndex: number
  ) => void;
  handleFilter: (dueDateFilter: string) => void;
};

const BoardContext = createContext<BoardContextType | undefined>(undefined);

type BoardProviderProps = {
  children: React.ReactNode;
  initialBoard: Board | null;
};

export function BoardProvider({ children, initialBoard }: BoardProviderProps) {
  const [board, setBoard] = useState<Board | null>(initialBoard);
  const [filteredBoard, setFilteredBoard] = useState<Board | null>(
    initialBoard
  );
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  useEffect(() => {
    const fetchBoard = async () => {
      if (board?.id) {
        const updatedBoard = await getBoard(board.id);
        setBoard(updatedBoard);
        setFilteredBoard(updatedBoard);
      }
    };
    fetchBoard();
  }, [board?.id]);

  const addColumn = async (title: string) => {
    if (!board) return;
    const newColumn: Column = {
      id: Date.now().toString(),
      title,
      cards: [],
      order: board.columns.length,
      lastModified: BigInt(0),
    };
    const updatedBoard = {
      ...board,
      columns: [...board.columns, newColumn],
    };
    setBoard(updatedBoard);
    setFilteredBoard(updatedBoard);
    await updateBoard(board.id, updatedBoard);
  };

  const addCard = async (columnId: string, title: string) => {
    if (!board) return;
    const newCard: Card = {
      id: Date.now().toString(),
      title,
      description: "",
      columnId,
      order: 0,
      labels: [],
      lastModified: BigInt(0),
      dueDate: null,
    };
    const updatedColumns = board.columns.map((column) => {
      if (column.id === columnId) {
        return {
          ...column,
          cards: [...column.cards, newCard],
        };
      }
      return column;
    });
    const updatedBoard = { ...board, columns: updatedColumns };
    setBoard(updatedBoard);
    setFilteredBoard(updatedBoard);
    await updateBoard(board.id, updatedBoard);
  };

  const updateCardInBoard = async (updatedCard: Card) => {
    if (!board) return;
    const updatedColumns = board.columns.map((column) => {
      if (column.id === updatedCard.columnId) {
        return {
          ...column,
          cards: column.cards.map((card) =>
            card.id === updatedCard.id ? updatedCard : card
          ),
        };
      }
      return column;
    });
    const updatedBoard = { ...board, columns: updatedColumns };
    setBoard(updatedBoard);
    setFilteredBoard(updatedBoard);
    await updateBoard(board.id, updatedBoard);
  };

  const deleteCardFromBoard = async (cardId: string) => {
    if (!board) return;
    const updatedColumns = board.columns.map((column) => ({
      ...column,
      cards: column.cards.filter((card) => card.id !== cardId),
    }));
    const updatedBoard = { ...board, columns: updatedColumns };
    setBoard(updatedBoard);
    setFilteredBoard(updatedBoard);
    await updateBoard(board.id, updatedBoard);
  };

  const updateColumnInBoard = async (columnId: string, title: string) => {
    if (!board) return;
    const updatedColumns = board.columns.map((column) =>
      column.id === columnId ? { ...column, title } : column
    );
    const updatedBoard = { ...board, columns: updatedColumns };
    setBoard(updatedBoard);
    setFilteredBoard(updatedBoard);
    await updateBoard(board.id, updatedBoard);
  };

  const deleteColumnFromBoard = async (columnId: string) => {
    if (!board) return;
    const updatedColumns = board.columns.filter(
      (column) => column.id !== columnId
    );
    const updatedBoard = { ...board, columns: updatedColumns };
    setBoard(updatedBoard);
    setFilteredBoard(updatedBoard);
    await updateBoard(board.id, updatedBoard);
  };

  const reorderColumns = async (newOrder: string[]) => {
    if (!board) return;
    try {
      // First update the local state
      const updatedColumns = newOrder
        .map((columnId, index) => {
          const column = board.columns.find((col) => col.id === columnId);
          return column ? { ...column, order: index } : null;
        })
        .filter((column): column is Column => column !== null);

      const updatedBoard = { ...board, columns: updatedColumns };
      setBoard(updatedBoard);
      setFilteredBoard(updatedBoard);

      // Then update the database using the dedicated action
      await updateColumnOrder(board.id, newOrder);
    } catch (error) {
      // Revert local state on error
      console.error("Failed to reorder columns:", error);
      const updatedBoard = await getBoard(board.id);
      setBoard(updatedBoard);
      setFilteredBoard(updatedBoard);
    }
  };

  const reorderCards = async (
    sourceColumnId: string,
    destinationColumnId: string,
    cardId: string,
    newIndex: number
  ) => {
    if (!board) return;
    try {
      const sourceColumn = board.columns.find(
        (col) => col.id === sourceColumnId
      );
      const cardToMove = sourceColumn?.cards.find((card) => card.id === cardId);

      if (!cardToMove) return;

      // Update local state
      const updatedColumns = board.columns.map((column) => {
        if (column.id === sourceColumnId) {
          return {
            ...column,
            cards: column.cards.filter((card) => card.id !== cardId),
          };
        }
        if (column.id === destinationColumnId) {
          const updatedCards = [...column.cards];
          updatedCards.splice(newIndex, 0, {
            ...cardToMove,
            columnId: destinationColumnId,
          });
          // Update order for all cards in the destination column
          return {
            ...column,
            cards: updatedCards.map((card, index) => ({
              ...card,
              order: index,
            })),
          };
        }
        return column;
      });

      const updatedBoard = { ...board, columns: updatedColumns };
      setBoard(updatedBoard);
      setFilteredBoard(updatedBoard);

      // Update the card in the database with new column and order
      await updateCard(
        cardId,
        undefined,
        undefined,
        undefined,
        destinationColumnId
      );

      // Update the board to ensure all card orders are saved
      await updateBoard(board.id, updatedBoard);
    } catch (error) {
      console.error("Failed to reorder cards:", error);
      // Revert local state on error
      const updatedBoard = await getBoard(board.id);
      setBoard(updatedBoard);
      setFilteredBoard(updatedBoard);
    }
  };

  const handleFilter = (dueDateFilter: string) => {
    if (!board) return;

    const now = new Date();
    const filteredColumns = board.columns.map((column) => ({
      ...column,
      cards: column.cards.filter((card) => {
        if (!card.dueDate || !dueDateFilter) return true;
        const dueDate = new Date(card.dueDate);
        switch (dueDateFilter) {
          case "overdue":
            return dueDate < now;
          case "today":
            return dueDate.toDateString() === now.toDateString();
          case "week":
            const weekFromNow = new Date(
              now.getTime() + 7 * 24 * 60 * 60 * 1000
            );
            return dueDate >= now && dueDate <= weekFromNow;
          case "month":
            const monthFromNow = new Date(
              now.getFullYear(),
              now.getMonth() + 1,
              now.getDate()
            );
            return dueDate >= now && dueDate <= monthFromNow;
          default:
            return true;
        }
      }),
    }));

    setFilteredBoard({ ...board, columns: filteredColumns });
  };

  return (
    <BoardContext.Provider
      value={{
        board,
        filteredBoard,
        selectedCard,
        setBoard,
        setSelectedCard,
        addColumn,
        addCard,
        updateCardInBoard,
        deleteCardFromBoard,
        updateColumnInBoard,
        deleteColumnFromBoard,
        reorderColumns,
        reorderCards,
        handleFilter,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
}

export const useBoardContext = () => {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error("useBoardContext must be used within a BoardProvider");
  }
  return context;
};
