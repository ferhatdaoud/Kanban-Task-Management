import React from "react";
import TaskItem from "../TaskItem";

const  TaskList = ({ tasks, board }) => {
  return (
    <div className="flex-1 space-y-2 overflow-y-auto p-4">
      {tasks?.map((task) => (
        <TaskItem key={task._id} task={task} board={board} />
      ))}
    </div>
  );
};

export default  TaskList;
