import React, { useState } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Check, Calendar, Clock } from "lucide-react";
import TaskDetails from "./TaskDetails";
import DropDownMenue from "./TaskMenu";
import api from "@/lib/api";
import { toast } from "sonner";

const TaskItem = ({ task, board, canEditTasks = true, currentUserRole }) => {
  const { _id } = task;
  const queryClient = useQueryClient();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const canViewDetails = !!currentUserRole;

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.isDone;

  const mutationDeleteTask = useMutation({
    mutationFn: (id) => api.delete(`/tasks/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", board._id] });
      toast.success("Task deleted");
    },
    onError: () => toast.error("Failed to delete task"),
  });

  const mutationToggleDone = useMutation({
    mutationFn: (id) =>
      api.put(`/tasks/${id}`, { isDone: !task.isDone }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", board._id] });
      toast.success(task.isDone ? "Task marked as incomplete" : "Task completed");
    },
  });

  const mutationToggleArchive = useMutation({
    mutationFn: (id) =>
      api
        .put(`/tasks/${id}`, {
          isArchived: !task.isArchived,
        })
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", board._id] });
      toast.success("Task archived");
    },
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

  const formatDueDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <>
      <div
        onClick={() => canViewDetails && setIsSheetOpen(true)}
        className={`group relative flex flex-col gap-3 rounded-lg border border-border/60 bg-card p-3 shadow-sm transition-all w-full ${
          canEditTasks ? "hover:shadow-md hover:border-border cursor-pointer" : "cursor-default"
        }`}
        style={{
          borderLeftWidth: "3px",
          borderLeftColor: task.isDone
            ? "rgb(34, 197, 94)"
            : isOverdue
            ? "rgb(239, 68, 68)"
            : "transparent",
        }}
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
            canEditTasks={canEditTasks}
          />
        </div>

        {/* --- CONTENT STACK --- */}
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          {canEditTasks ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                mutationToggleDone.mutate(_id);
              }}
              disabled={mutationToggleDone.isPending}
              className={`mt-1 shrink-0 w-5 h-5 rounded border transition-all flex items-center justify-center ${
                task.isDone
                  ? "bg-green-500 border-green-500"
                  : "border-input hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-950"
              }`}
            >
              {task.isDone && (
                <Check className="w-3.5 h-3.5 text-white" />
              )}
            </button>
          ) : (
            <div className="mt-1 shrink-0 w-5 h-5 rounded border border-input flex items-center justify-center opacity-50">
              <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
            </div>
          )}

          <div className="flex flex-col gap-1.5 flex-1 min-w-0 pr-4">
            <div className="flex items-start justify-between gap-2">
              <h3
                className={`text-sm font-bold leading-tight transition-all ${
                  task.isDone
                    ? "line-through text-muted-foreground"
                    : "text-foreground"
                }`}
              >
                {task.title}
              </h3>
            </div>

            {task.description && (
              <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
                {task.description}
              </p>
            )}

            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {task.dueDate && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    isOverdue
                      ? "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
                      : task.isDone
                      ? "bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Calendar className="h-3 w-3" />
                  {formatDueDate(task.dueDate)}
                  {isOverdue && (
                    <Clock className="h-3 w-3 ml-0.5" />
                  )}
                </span>
              )}
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
                {board.title}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-border/40 mt-1 mb-0.5" />

        {/* --- FOOTER SECTION (Assignee + Creator) --- */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {task.assignedTo ? (
              <div className="flex items-center gap-2 bg-muted/50 px-2 py-1 rounded-md border border-border/50">
                <div className="h-5 w-5 rounded-full bg-purple-500 flex items-center justify-center text-[9px] font-bold text-white shrink-0">
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

          {task.user && task.user._id !== task.assignedTo?._id && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <span className="text-[10px]">Created by</span>
              <div className="h-4 w-4 rounded-full bg-secondary border border-border/50 flex items-center justify-center text-[8px] font-bold">
                {task.user.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <span className="text-[10px] font-medium truncate max-w-[80px]">
                {task.user.name}
              </span>
            </div>
          )}
        </div>
      </div>
      {canViewDetails && (
        <TaskDetails
          task={task}
          board={board}
          isSheetOpen={isSheetOpen}
          setIsSheetOpen={setIsSheetOpen}
          canEditTasks={canEditTasks}
        />
      )}
    </>
  );
};

export default TaskItem;
