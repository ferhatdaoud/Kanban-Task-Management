import React, { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Check } from "lucide-react";
import SideSheet from "./SideSheet";
import DropDownMenue from "./DropDownMenue";

const TodoItem = ({ todo, group }) => {
  const { _id } = todo;
  const queryClient = useQueryClient();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // --- MUTATIONS ---
  const mutationDeleteTodo = useMutation({
    mutationFn: (id) =>
      axios
        .delete(`http://localhost:5000/todos/${id}`, { withCredentials: true })
        .then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries(["todos", group._id]),
  });

  const mutationToggleDone = useMutation({
    mutationFn: (id) =>
      axios
        .put(
          `http://localhost:5000/todos/${id}`,
          { isDone: !todo.isDone },
          { withCredentials: true },
        )
        .then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries(["todos", group._id]),
  });

  const mutationReorder = useMutation({
    mutationFn: (idListArray) =>
      axios.put(
        "http://localhost:5000/todos/reorderTodo",
        { newOrder: idListArray.map((task) => task._id) },
        { withCredentials: true },
      ),
  });

  // --- REORDER HANDLERS ---
  const syncOrder = (newArray) => {
    queryClient.setQueryData(["todos", group._id], newArray);
    mutationReorder.mutate(newArray);
  };

  const moveUp = () => {
    const data = queryClient.getQueryData(["todos", group._id]);
    const index = data.findIndex((t) => t._id === _id);
    if (index <= 0) return;
    const newArray = [...data];
    const [removed] = newArray.splice(index, 1);
    newArray.splice(index - 1, 0, removed);
    syncOrder(newArray);
  };

  const moveDown = () => {
    const data = queryClient.getQueryData(["todos", group._id]);
    const index = data.findIndex((item) => item._id === _id);
    if (index >= data.length - 1) return;
    const newArray = [...data];
    const [removed] = newArray.splice(index, 1);
    newArray.splice(index + 1, 0, removed);
    syncOrder(newArray);
  };

  const moveTop = () => {
    const data = queryClient.getQueryData(["todos", group._id]);
    const index = data.findIndex((t) => t._id === _id);
    if (index === 0) return;
    const newArray = [...data];
    const [removed] = newArray.splice(index, 1);
    newArray.unshift(removed);
    syncOrder(newArray);
  };

  const moveBottom = () => {
    const data = queryClient.getQueryData(["todos", group._id]);
    const index = data.findIndex((t) => t._id === _id);
    if (index >= data.length - 1) return;
    const newArray = [...data];
    const [removed] = newArray.splice(index, 1);
    newArray.push(removed);
    syncOrder(newArray);
  };

  return (
    // 1. ADDED onClick and cursor-pointer to the main container
    <>
    <div
      onClick={() => setIsSheetOpen(true)}
      className="group relative flex flex-col gap-3 rounded-lg border border-border/60 bg-white p-3 shadow-sm hover:shadow-md transition-all w-full cursor-pointer"
    >
      {/* 3-Dot Menu */}
      <div
        className="absolute top-3 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()} // 2. Stop propagation so menu click doesn't open sheet
      >
        <DropDownMenue
          todo={todo}
          group={group}
          setIsSheetOpen={setIsSheetOpen}
          moveTop={moveTop}
          moveUp={moveUp}
          moveDown={moveDown}
          moveBottom={moveBottom}
          mutationDeleteTodo={mutationDeleteTodo}
        />
      </div>

      {/* --- CONTENT STACK --- */}
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // 3. Stop propagation so toggling 'done' doesn't open sheet
            mutationToggleDone.mutate(_id);
          }}
          disabled={mutationToggleDone.isPending}
          className={`mt-1 shrink-0 w-5 h-5 rounded border transition-all flex items-center justify-center ${
            todo.isDone
              ? "bg-primary border-primary"
              : "border-input hover:border-primary"
          }`}
        >
          {todo.isDone && (
            <Check className="w-3.5 h-3.5 text-primary-foreground" />
          )}
        </button>

        <div className="flex flex-col gap-1.5 flex-1 min-w-0 pr-4">
          <h3
            className={`text-sm font-bold text-foreground leading-tight truncate ${todo.isDone ? "line-through text-muted-foreground" : ""}`}
          >
            {todo.title}
          </h3>

          {todo.description && (
            <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
              {todo.description}
            </p>
          )}

          <div className="mt-0.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600">
              {group.title}
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-border/40 mt-1 mb-0.5" />

      {/* --- FOOTER SECTION (Assignee Only) --- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {todo.assignedTo ? (
            <div className="flex items-center gap-2 bg-[#F8F9FA] px-2 py-1 rounded-md border border-border/50">
              <div className="h-5 w-5 rounded-full bg-purple-500 flex items-center justify-center text-[9px] font-bold text-white shrink-0">
                {todo.assignedTo.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <span className="text-xs font-semibold text-foreground truncate max-w-[120px]">
                {todo.assignedTo.name}
              </span>
            </div>
          ) : (
            <span className="text-[10px] text-muted-foreground/60 italic font-medium px-1">
              Unassigned
            </span>
          )}
        </div>
      </div>

      {/* The Hidden SideSheet Component */}
    </div>
      <SideSheet
        todo={todo}
        group={group}
        isSheetOpen={isSheetOpen}
        setIsSheetOpen={setIsSheetOpen}
      />
      </>
  );
};

export default TodoItem;
