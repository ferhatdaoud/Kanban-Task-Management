import React from "react";
import TaskItem from "../TaskItem";

const TaskList = ({ tasks, board }) => {
  if (!tasks?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-2">
        <p className="text-sm text-muted-foreground italic">
          No tasks in this board
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-2 overflow-y-auto p-4">
      {tasks?.map((task) => (
        <TaskItem key={task._id} task={task} board={board} />
      ))}
    </div>
  );
};

export default TaskList;
