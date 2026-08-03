import React from "react";
import TodoItem from "../TodoItem";

const TodoItemList = ({ todos, group }) => {
  return (
    <div className="flex-1 space-y-2 overflow-y-auto p-4">
      {todos?.map((todo) => (
        <TodoItem key={todo._id} todo={todo} group={group} />
      ))}
    </div>
  );
};

export default TodoItemList;
