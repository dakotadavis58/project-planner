import { getBoard } from "@/app/lib/actions/board.actions";
import { Column } from "@/app/components/board/Column";
import { AddColumn } from "@/app/components/board/AddColumn";

interface BoardPageProps {
  params: {
    id: string;
  };
}

async function getBoardData(id: string) {
  const board = await getBoard(id);
  if (!board) {
    throw new Error("Board not found");
  }
  return board;
}

export default async function BoardPage({ params }: BoardPageProps) {
  const board = await getBoardData(params.id);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{board.title}</h1>
      <div className="flex space-x-4 overflow-x-auto">
        {board.columns.map((column) => (
          <Column key={column.id} {...column} />
        ))}
        <AddColumn boardId={board.id} />
      </div>
    </div>
  );
}
