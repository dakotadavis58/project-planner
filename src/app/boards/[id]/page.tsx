import { getBoard } from "@/app/lib/actions/board.actions";
import { BoardContent } from "@/app/components/board/BoardContent";
import { BoardSettings } from "@/app/components/board/BoardSettings";
import { BoardProvider } from "@/app/providers/BoardProvider";

// params are async
interface BoardPageProps {
  params: Promise<{ id: string }>;
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { id } = await params;
  const board = await getBoard(id);

  if (!board) {
    return <div>Board not found</div>;
  }

  return (
    <BoardProvider initialBoard={board}>
      <div className="p-4" style={{ backgroundColor: board.color }}>
        <BoardSettings />
        <div className="mt-4">
          <BoardContent />
        </div>
      </div>
    </BoardProvider>
  );
}
