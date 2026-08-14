import React from "react";
import { FileText } from "lucide-react";
import TaskItem from "../TaskItem";

const TaskList = ({ tasks, board, canEditTasks, currentUserRole }) => {
  if (!tasks?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-2">
        <div className="h-10 w-10 rounded-full bg-muted/50 flex items-center justify-center">
          <FileText className="h-5 w-5 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground italic">
          No tasks in this board
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-2 overflow-y-auto p-4">
      {tasks?.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          board={board}
          canEditTasks={canEditTasks}
          currentUserRole={currentUserRole}
        />
      ))}
    </div>
  );
};

export default TaskList;
