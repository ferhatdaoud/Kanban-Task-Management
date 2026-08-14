import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "../ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Trash2, Plus, X } from "lucide-react";
import api from "@/lib/api";

const TaskDetails = ({ task, board, setIsSheetOpen, isSheetOpen, canEditTasks = true }) => {
  const queryClient = useQueryClient();

  const [taskTitle, setTaskTitle] = useState(task.title);
  const [taskDescription, setTaskDescription] = useState(
    task.description || "",
  );
  const [assignedUserId, setAssignedUserId] = useState(
    task.assignedTo?._id || "unassigned",
  );
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [targetBoardId, setTargetBoardId] = useState(board._id);
  const [commentText, setCommentText] = useState("");

  const { data: allUsers } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.get(`/user`).then((res) => res.data),
  });

  const { data: comments } = useQuery({
    queryKey: ["comments", task._id],
    queryFn: () => api.get(`/comments/${task._id}`).then((res) => res.data),
  });

  const { data: allBoards } = useQuery({
    queryKey: ["boards"],
    queryFn: () => api.get(`/boards`).then((res) => res.data),
  });

  const mutationUpdateTaskAndDescription = useMutation({
    mutationFn: (id) =>
      api
        .put(`/tasks/${id}`, {
          title: taskTitle,
          description: taskDescription,
          board: targetBoardId,
          assignedTo: assignedUserId === "unassigned" ? null : assignedUserId,
        })
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsSheetOpen(false);
    },
  });

  const mutationAddComment = useMutation({
    mutationFn: () =>
      api
        .post(`/comments`, { content: commentText, taskId: task._id })
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", task._id]);
      setCommentText("");
    },
  });

  const mutationDeleteComment = useMutation({
    mutationFn: (id) => api.delete(`/comments/${id}`),
    onSuccess: () => queryClient.invalidateQueries(["comments", task._id]),
  });

  const selectedUser = allUsers?.find((u) => u._id === assignedUserId);

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        {/* Hidden trigger — sheet is opened from TaskItem click */}
        <div className="hidden" />
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-[450px] flex flex-col h-full p-0 bg-background"
      >
        <SheetHeader className="px-6 py-5 border-b border-border/40 shrink-0">
          <SheetTitle className="text-xl font-bold tracking-tight">
            Task Details
          </SheetTitle>
          <SheetDescription className="text-xs mt-1">
            View and edit task information.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-7">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Task Title
            </Label>
            <Input
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              readOnly={!canEditTasks}
              className={`h-10 bg-muted/40 border-transparent shadow-none text-sm font-medium ${!canEditTasks ? "opacity-70 cursor-not-allowed" : ""}`}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Description
            </Label>
            <Textarea
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              readOnly={!canEditTasks}
              className={`min-h-[100px] resize-none bg-muted/40 border-transparent shadow-none text-sm ${!canEditTasks ? "opacity-70 cursor-not-allowed" : ""}`}
            />
          </div>

          {/* --- ASSIGNED USERS --- */}
          <div className="space-y-3">
            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
              Assigned Users
            </Label>

            <div className="flex flex-col gap-2">
              {selectedUser && (
                <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md w-max">
                  <span className="text-xs font-medium">
                    {selectedUser.name}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-4 w-4 p-0"
                    onClick={() => setAssignedUserId("unassigned")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              <Popover open={isAssignOpen} onOpenChange={setIsAssignOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={!canEditTasks}
                    className="w-max h-7 px-3 bg-muted/40 text-xs text-muted-foreground shadow-none"
                  >
                    <Plus className="mr-1 h-3 w-3" /> Assign
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[300px]" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Search users..."
                      className="text-sm"
                    />
                    <CommandList className="max-h-[220px]">
                      <CommandEmpty>No users found.</CommandEmpty>
                      <CommandGroup>
                        {allUsers?.map((user) => {
                          return (
                            <CommandItem
                              key={user._id}
                              value={user.name}
                              onSelect={() => {
                                setAssignedUserId(user._id);
                                setIsAssignOpen(false);
                              }}
                              className="flex items-center py-2.5 cursor-pointer"
                            >
                              <div className="h-7 w-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold mr-3 shrink-0">
                                {user.name?.charAt(0).toUpperCase() || "U"}
                              </div>
                              <span className="text-sm">{user.name}</span>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block">
              Current List
            </Label>
            <Select
              value={targetBoardId}
              onValueChange={setTargetBoardId}
              disabled={!canEditTasks}
            >
              <SelectTrigger className={`w-full bg-background border-border/60 shadow-sm h-10 ${!canEditTasks ? "opacity-70" : ""}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allBoards?.map((g) => (
                  <SelectItem key={g._id} value={g._id}>
                    {g.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border-t border-border/40 my-6" />

          {/* ACTIVITY SECTION */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Activity
              </Label>
              <span className="text-xs bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-md">
                {comments?.length || 0}
              </span>
            </div>

            <div className="space-y-5">
              {comments?.map((comment) => (
                <div
                  key={comment._id}
                  className="relative flex items-start gap-3 group/comment"
                >
                  <div className="h-6 w-6 rounded-full bg-secondary border border-border/50 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {comment.user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-foreground">
                          {comment.user?.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {canEditTasks && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 opacity-0 group-hover/comment:opacity-100 text-muted-foreground hover:text-destructive"
                          onClick={() =>
                            mutationDeleteComment.mutate(comment._id)
                          }
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                    <div className="text-sm text-foreground mt-1 bg-muted/30 p-2.5 rounded-md border border-border/30">
                      {comment.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-3 pt-6">
              <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0 mt-1">
                ME
              </div>
              <div className="flex-1 space-y-2">
                <Textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment..."
                  readOnly={!canEditTasks}
                  className={`min-h-[80px] text-sm resize-none bg-background border-border/60 ${!canEditTasks ? "opacity-70 cursor-not-allowed" : ""}`}
                />
                {canEditTasks && (
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => mutationAddComment.mutate()}
                      disabled={
                        !commentText.trim() || mutationAddComment.isPending
                      }
                      variant="secondary"
                    >
                      Add Comment
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="p-4 border-t border-border/40 bg-background shrink-0">
          {canEditTasks && (
            <Button
              size="lg"
              className="w-full bg-black text-white h-11 text-sm font-bold"
              onClick={() => mutationUpdateTaskAndDescription.mutate(task._id)}
              disabled={
                mutationUpdateTaskAndDescription.isPending || !taskTitle.trim()
              }
            >
              Save All Changes
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default TaskDetails;
