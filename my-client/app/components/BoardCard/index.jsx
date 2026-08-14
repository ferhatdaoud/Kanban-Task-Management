import { Button } from "@/components/ui/button";
import { CheckCheck, X, Users } from "lucide-react";
import BoardMenu from "./BoardMenu";
import api from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import AddTaskModal from "./AddTaskModal";
import { Input } from "../ui/input";
import TaskList from "./TaskList";
import ArchivedTasksModal from "./ArchivedTasksModal";
import { toast } from "sonner";

const BoardCard = ({ board, currentUser }) => {
  const { _id, title, members } = board;
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [newTitle, setNewTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const isOwner =
    currentUser &&
    board.user &&
    board.user._id?.toString() === currentUser._id.toString();

  const memberEntry = board.members?.find(
    (m) => m.user?._id.toString() === currentUser?._id.toString(),
  );
  const currentUserRole = isOwner
    ? "owner"
    : memberEntry?.role?.name || null;

  const canEditBoard = currentUserRole === "owner";
  const canEditTasks = currentUserRole === "owner" || currentUserRole === "editor";

  const getRoleBadge = () => {
    if (!currentUserRole) return null;
    const styles = {
      owner: "bg-primary/10 text-primary",
      editor: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
      viewer: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    };
    return (
      <span
        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${styles[currentUserRole]}`}
      >
        {currentUserRole}
      </span>
    );
  };

  const getMemberAvatars = () => {
    const allMembers = [];
    if (board.user) {
      allMembers.push({
        name: board.user.name,
        avatar: board.user.name?.charAt(0).toUpperCase(),
        isOwner: true,
      });
    }
    board.members?.forEach((m) => {
      if (m.user) {
        allMembers.push({
          name: m.user.name,
          avatar: m.user.name?.charAt(0).toUpperCase(),
          isOwner: false,
        });
      }
    });
    return allMembers.slice(0, 5);
  };

  const memberAvatars = getMemberAvatars();

  const mutationDeleteBoard = useMutation({
    mutationFn: (_id) => api.delete(`/boards/${_id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["boards"]);
      toast.success("Board deleted");
    },
    onError: () => toast.error("Failed to delete board"),
  });

  const mutationUpdateBoard = useMutation({
    mutationFn: (_id) =>
      api.put(`/boards/${_id}`, { title: newTitle }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["boards"]);
      setIsEditing(false);
      toast.success("Board renamed");
    },
  });
  const handleEditing = () => setIsEditing(true);
  const handleUpdate = () => mutationUpdateBoard.mutate(_id);

  const { data: tasks } = useQuery({
    queryKey: ["tasks", _id],
    queryFn: () =>
      api.get(`/tasks/${_id}?search=${searchQuery}`).then((res) => res.data),
  });

  useEffect(() => {
    queryClient.invalidateQueries(["tasks", _id]);
  }, [searchQuery, queryClient, _id]);

  const mutationReorderBoard = useMutation({
    mutationFn: (BoardArray) =>
      api.put("/boards/reorderBoard", {
        boards: BoardArray.map((g) => g._id),
      }),
  });

  const moveLeft = async () => {
    await queryClient.cancelQueries({ queryKey: ["boards"] });
    const data = queryClient.getQueryData(["boards"]);
    if (!data) return;
    const index = data.findIndex((g) => g._id === _id);
    if (index <= 0) return;
    const newArr = [...data];
    const [removedboard] = newArr.splice(index, 1);
    newArr.splice(index - 1, 0, removedboard);
    queryClient.setQueryData(["boards"], newArr);
    mutationReorderBoard.mutate(newArr);
  };

  const moveRight = async () => {
    await queryClient.cancelQueries({ queryKey: ["boards"] });
    const data = queryClient.getQueryData(["boards"]);
    if (!data) return;
    const index = data.findIndex((g) => g._id === _id);
    if (index >= data.length - 1) return;
    const newArr = [...data];
    const [removedboard] = newArr.splice(index, 1);
    newArr.splice(index + 1, 0, removedboard);
    queryClient.setQueryData(["boards"], newArr);
    mutationReorderBoard.mutate(newArr);
  };

  const completedCount = tasks?.filter((t) => t.isDone).length || 0;
  const totalCount = tasks?.length || 0;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="flex w-full sm:w-80 shrink-0 flex-col rounded-xl border border-border bg-card shadow-sm hover:shadow-lg transition-all duration-200">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3 group/header">
        <div className="min-w-0 flex-1">
          {isEditing ? (
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
              autoFocus
              className="h-8 text-sm font-semibold"
            />
          ) : (
            <>
              <div className="flex items-center gap-2">
                <h2 className="truncate font-semibold text-card-foreground">
                  {title}
                </h2>
                {getRoleBadge()}
              </div>
              <p className="text-xs text-muted-foreground">
                {completedCount} of {totalCount} completed
              </p>
            </>
          )}
        </div>

        <div className="flex items-center gap-1">
          {isEditing ? (
            <div className="flex items-center gap-1">
              <Button
                onClick={handleUpdate}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-green-600 hover:bg-green-50"
              >
                <CheckCheck className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              {canEditTasks && <AddTaskModal id={_id} />}
              <BoardMenu
                handleEditing={handleEditing}
                _id={_id}
                mutationUpdateboard={mutationUpdateBoard}
                mutationDeleteBoard={mutationDeleteBoard}
                board={board}
                tasks={tasks}
                moveLeft={moveLeft}
                moveRight={moveRight}
                setIsSearchOpen={setIsSearchOpen}
                setIsArchiveOpen={setIsArchiveOpen}
                canEditBoard={canEditBoard}
                currentUserRole={currentUserRole}
              />
            </>
          )}
        </div>
      </div>

      {/* Member Avatars */}
      {memberAvatars.length > 1 && (
        <div className="px-4 py-2 border-b border-border/40 flex items-center gap-1">
          <Users className="h-3 w-3 text-muted-foreground mr-1" />
          <div className="flex -space-x-2">
            {memberAvatars.map((member, idx) => (
              <div
                key={idx}
                className={`h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-bold border-2 border-card ${
                  member.isOwner
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
                title={member.name}
              >
                {member.avatar}
              </div>
            ))}
          </div>
          <span className="text-[10px] text-muted-foreground ml-1">
            {memberAvatars.length}
          </span>
        </div>
      )}

      {/* Progress Bar */}
      <div className="h-2 w-full bg-muted">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <TaskList
        tasks={tasks}
        board={board}
        canEditTasks={canEditTasks}
        currentUserRole={currentUserRole}
      />

      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Search in {title}</DialogTitle>
          </DialogHeader>
          <div className="py-4 flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setIsSearchOpen(false);
                }
              }}
            />
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Showing only tasks containing &quot;{searchQuery}&quot;
          </p>
        </DialogContent>
      </Dialog>

      <Dialog open={isArchiveOpen} onOpenChange={setIsArchiveOpen}>
        <DialogContent className="sm:max-w-125">
          <DialogHeader>
            <DialogTitle>Archived Tasks: {title}</DialogTitle>
            <DialogDescription>
              These tasks are hidden from your main board. You can restore or
              permanently delete them here.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 min-h-[200px] max-h-[400px] overflow-y-auto space-y-3">
            <ArchivedTasksModal boardId={_id} canEditTasks={canEditTasks} />
            <p className="text-sm text-muted-foreground italic text-center py-8">
              No archived tasks found in this list.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BoardCard;
