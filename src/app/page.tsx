import Link from "next/link";
import { createBoard, getBoards } from "./lib/actions/board.actions";
import { CreateBoardForm } from "./components/board/CreateBoardForm";

export default async function Home() {
  const boards = await getBoards();

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Kanban Boards</h1>

      <CreateBoardForm />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boards.map((board) => (
          <Link href={`/boards/${board.id}`} key={board.id}>
            <div className="border p-4 rounded hover:bg-gray-100 cursor-pointer">
              <h2 className="text-xl font-semibold">{board.title}</h2>
              <p>{board.columns.length} columns</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
