import { getBoards } from "./lib/actions/board.actions";
import { CreateBoardForm } from "./components/board/CreateBoardForm";
import { BoardList } from "./components/BoardList";

export default async function Home() {
  const boards = await getBoards();

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Kanban Boards</h1>

      <CreateBoardForm />

      <BoardList initialBoards={boards} />
    </main>
  );
}
