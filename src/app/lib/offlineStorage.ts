import { Board } from "./types";

const STORAGE_KEY = "kanban_board_data";

export function saveToLocalStorage(board: Board) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
}

export function loadFromLocalStorage() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

export function clearLocalStorage() {
  localStorage.removeItem(STORAGE_KEY);
}
