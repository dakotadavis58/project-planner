"use client";

import { useState } from "react";
import { createBoard } from "../../lib/actions/board.actions";

export function CreateBoardForm() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <form
          action={async (formData) => {
            setIsLoading(true);
            await createBoard(formData);
            setIsLoading(false);
          }}
          className="mb-4"
        >
          <input
            type="text"
            name="title"
            placeholder="New Board Title"
            className="border p-2 mr-2"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Create Board
          </button>
        </form>
      )}
    </>
  );
}
