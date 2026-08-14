import React, { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Check } from "lucide-react";
import TaskDetails from "./TaskDetails";
import DropDownMenue from "./TaskMenu";
import api from "@/lib/api";

const TaskItem = ({ task, board }) => {
  const { _id } = task;
  const queryClient = useQueryClient();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const mutationDeleteTask = useMutation({
    mutationFn: (id) => api.delete(`/tasks/${id}`).then((res) => res.data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["tasks", board._id] }),
  });

  const mutationToggleDone = useMutation({
    mutationFn: (id) =>
      api.put(`/tasks/${id}`, { isDone: !task.isDone }).then((res) => res.data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["tasks", board._id] }),
  });

  const mutationToggleArchive = useMutation({
    mutationFn: (id) =>
      api
        .put(`/tasks/${id}`, {
          isArchived: !task.isArchived,
        })
        .then((res) => res.data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["tasks", board._id] }),
  });

  const mutationReorder = useMutation({
    mutationFn: (idListArray) =>
      api.put(`/tasks/reorderTasks`, {
        newOrder: idListArray.map((task) => task._id),
      }),
  });

  const syncOrder = (newArray) => {
    queryClient.setQueryData(["tasks", board._id], newArray);
    mutationReorder.mutate(newArray);
  };

  const moveUp = () => {
    const data = queryClient.getQueryData(["tasks", board._id]);
    const index = data.findIndex((t) => t._id === _id);
    if (index <= 0) return;
    const newArray = [...data];
    const [removed] = newArray.splice(index, 1);
    newArray.splice(index - 1, 0, removed);
    syncOrder(newArray);
  };

  const moveDown = () => {
    const data = queryClient.getQueryData(["tasks", board._id]);
    const index = data.findIndex((item) => item._id === _id);
    if (index >= data.length - 1) return;
    const newArray = [...data];
    const [removed] = newArray.splice(index, 1);
    newArray.splice(index + 1, 0, removed);
    syncOrder(newArray);
  };

  const moveTop = () => {
    const data = queryClient.getQueryData(["tasks", board._id]);
    const index = data.findIndex((t) => t._id === _id);
    if (index === 0) return;
    const newArray = [...data];
    const [removed] = newArray.splice(index, 1);
    newArray.unshift(removed);
    syncOrder(newArray);
  };

  const moveBottom = () => {
    const data = queryClient.getQueryData(["tasks", board._id]);
    const index = data.findIndex((t) => t._id === _id);
    if (index >= data.length - 1) return;
    const newArray = [...data];
    const [removed] = newArray.splice(index, 1);
    newArray.push(removed);
    syncOrder(newArray);
  };

  return (
    <>
      <div
        onClick={() => setIsSheetOpen(true)}
        className="group relative flex flex-col gap-3 rounded-lg border border-border/60 bg-card p-3 shadow-sm hover:shadow-md transition-all w-full cursor-pointer"
      >
        {/* 3-Dot Menu */}
        <div
          className="absolute top-3 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <DropDownMenue
            task={task}
            board={board}
            setIsSheetOpen={setIsSheetOpen}
            moveTop={moveTop}
            moveUp={moveUp}
            moveDown={moveDown}
            moveBottom={moveBottom}
            mutationDeleteTask={mutationDeleteTask}
            mutationToggleArchive={mutationToggleArchive}
          />
        </div>

        {/* --- CONTENT STACK --- */}
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              mutationToggleDone.mutate(_id);
            }}
            disabled={mutationToggleDone.isPending}
            className={`mt-1 shrink-0 w-5 h-5 rounded border transition-all flex items-center justify-center ${
              task.isDone
                ? "bg-primary border-primary"
                : "border-input hover:border-primary"
            }`}
          >
            {task.isDone && (
              <Check className="w-3.5 h-3.5 text-primary-foreground" />
            )}
          </button>

          <div className="flex flex-col gap-1.5 flex-1 min-w-0 pr-4">
            <h3
              className={`text-sm font-bold text-foreground leading-tight truncate transition-all ${
                task.isDone ? "line-through text-muted-foreground" : ""
              }`}
            >
              {task.title}
            </h3>

            {task.description && (
              <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}

            <div className="mt-0.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
                {board.title}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-border/40 mt-1 mb-0.5" />

        {/* --- FOOTER SECTION (Assignee Only) --- */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {task.assignedTo ? (
              <div className="flex items-center gap-2 bg-muted/50 px-2 py-1 rounded-md border border-border/50">
                <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-[9px] font-bold text-primary-foreground shrink-0">
                  {task.assignedTo.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="text-xs font-semibold text-foreground truncate max-w-[120px]">
                  {task.assignedTo.name}
                </span>
              </div>
            ) : (
              <span className="text-[10px] text-muted-foreground/60 italic font-medium px-1">
                Unassigned
              </span>
            )}
          </div>
        </div>
      </div>
      <TaskDetails
        task={task}
        board={board}
        isSheetOpen={isSheetOpen}
        setIsSheetOpen={setIsSheetOpen}
      />
    </>
  );
};

export default TaskItem;
