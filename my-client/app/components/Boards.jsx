"use client";
import BoardCard from "./BoardCard";

const Boards = ({ boards }) => {
  if (boards?.length === 0) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <p className="text-lg text-muted-foreground">
          Create a board to get started!
        </p>
      </div>
    );
  }
  return (
    <div className="flex h-full gap-4 overflow-x-auto">
      {boards?.map((board) => (
        <BoardCard key={board._id} board={board} />
      ))}
    </div>
  );
};
export { Boards };
