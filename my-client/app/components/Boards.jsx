"use client";
import BoardCard from "./BoardCard";
import { FolderOpen } from "lucide-react";
import CreateBoard from "./CreateBoard";

const Boards = ({ boards, currentUser }) => {
  if (boards?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50">
          <FolderOpen className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            No boards yet
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Create your first board to start organizing tasks and boost your
            productivity.
          </p>
        </div>
        <CreateBoard />
      </div>
    );
  }

  return (
    <div className="flex h-full gap-4 overflow-x-auto">
      {boards?.map((board) => (
        <BoardCard key={board._id} board={board} currentUser={currentUser} />
      ))}
    </div>
  );
};

export { Boards };
