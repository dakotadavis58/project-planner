"use client";

import Link from "next/link";
import { Column } from "../lib/types";

interface Board {
  id: string;
  title: string;
  columns: Column[];
}

interface BoardListProps {
  initialBoards: Board[];
}

export function BoardList({ initialBoards }: BoardListProps) {
  //   useEffect(() => {
  //     if ("serviceWorker" in navigator) {
  //       navigator.serviceWorker
  //         .register("/service-worker.js")
  //         .then((registration) => console.log("Service Worker registered"))
  //         .catch((error) =>
  //           console.log("Service Worker registration failed:", error)
  //         );
  //     }
  //   }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {initialBoards.map((board) => (
        <Link href={`/boards/${board.id}`} key={board.id}>
          <div className="border p-4 rounded hover:bg-gray-100 cursor-pointer">
            <h2 className="text-xl font-semibold">{board.title}</h2>
            <p>{board.columns.length} columns</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
