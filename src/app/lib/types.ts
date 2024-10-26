export interface Card {
  id: string;
  title: string;
  description?: string;
  order: number;
  labels: Label[];
}

export interface Column {
  id: string;
  title: string;
  order: number;
  cards: Card[];
}

export interface Board {
  id: string;
  title: string;
  columns: Column[];
  createdAt: string;
  updatedAt: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}
