import { Button } from "@/components/ui/button";
import { CheckCheck, X } from "lucide-react";
import DropdownMenuComp from "./DropdownMenuComp";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import AddTodoModal from "../AddTodoModal";
import { Input } from "../ui/input";
import TodoItemList from "./TodoItemList";
import ArchivedTasksModal from "../ArchivedTasksModal";
const GroupCard = ({ group }) => {
  //hooks
  const { _id, title } = group;
  //States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  //group states
  const [newTitle, setNewTitle] = useState(title);
  const [isEditing, setIsEditing] = useState(null);
  //Todo states
  const queryClient = useQueryClient();
  //deleting group
  const mutationDeleteGroup = useMutation({
    mutationFn: (_id) =>
      axios
        .delete(`http://localhost:5000/group/${_id}`, { withCredentials: true })
        .then((res) => res.data),
    onSuccess: () => queryClient.invalidateQueries(["groups"]),
  });
  //updating group
  const mutationUpdateGroup = useMutation({
    mutationFn: (_id) =>
      axios
        .put(
          `http://localhost:5000/group/${_id}`,
          { title: newTitle },
          { withCredentials: true },
        )
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["groups"]);
      setIsEditing(null);
    },
  });
  const handleEditing = () => setIsEditing(!isEditing);
  const handleUpdate = () => mutationUpdateGroup.mutate(_id);
  //fetching Todos For Specific Group
  const { data: todos } = useQuery({
    queryKey: ["todos", _id, searchQuery],
    queryFn: () =>
      axios
        .get(`http://localhost:5000/todos/${_id}?search=${searchQuery}`, {
          withCredentials: true,
        })
        .then((res) => res.data),
  });
  //reorder handlers
  const mutationReorderGroup = useMutation({
    mutationFn: (GroupArray) =>
      axios.put(
        "http://localhost:5000/group/reorderGroup",
        {
          newArrCopy: GroupArray.map((g) => g._id),
        },
        { withCredentials: true },
      ),
  });
  const moveLeft = async () => {
    await queryClient.cancelQueries({ queryKey: ["groups"] });

    const data = queryClient.getQueryData(["groups"]);
    if (!data) return;
    //finding the index of the card
    const index = data.findIndex((g) => g._id === _id);
    //if its on far left
    if (index <= 0) return;

    //create a copy and swap

    const newArr = [...data];
    const [removedGroup] = newArr.splice(index, 1);
    //tell ui to update
    newArr.splice(index - 1, 0, removedGroup);
    //invoke backend to save
    queryClient.setQueryData(["groups"], newArr);
    mutationReorderGroup.mutate(newArr);
  };
  const moveRight = async () => {
    await queryClient.cancelQueries({ queryKey: ["groups"] });

    const data = queryClient.getQueryData(["groups"]);
    if (!data) return;
    //finding the index of the card
    const index = data.findIndex((g) => g._id === _id);
    //if its on far right
    if (index >= data.length - 1) return;
    //create a copy and swap
    const newArr = [...data];
    const [removedGroup] = newArr.splice(index, 1);
    newArr.splice(index + 1, 0, removedGroup);
    //tell ui to update
    queryClient.setQueryData(["groups"], newArr);
    //invoke backend to save
    mutationReorderGroup.mutate(newArr);
  };
  return (
    <div className="flex w-80 flex-shrink-0 flex-col rounded-lg border border-border bg-card shadow-sm">
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3 group/header">
        {/* Title / Input Area */}
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
              <h2 className="truncate font-semibold text-card-foreground">
                {title}
              </h2>

              <p className="text-xs text-muted-foreground">
                {todos?.filter((t) => t.isDone).length} of {todos?.length}
                completed
              </p>
            </>
          )}
        </div>

        {/* Action Buttons Area */}
        <div className="flex items-center gap-1">
          {isEditing ? (
            /* --- SHOW WHEN EDITING --- */
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
              <AddTodoModal id={_id} />
              <DropdownMenuComp
                handleEditing={handleEditing}
                _id={_id}
                mutationUpdateGroup={mutationUpdateGroup}
                mutationDeleteGroup={mutationDeleteGroup}
                group={group}
                todos={todos}
                moveLeft={moveLeft}
                moveRight={moveRight}
                setIsSearchOpen={setIsSearchOpen}
                setIsArchiveOpen={setIsArchiveOpen}
              />
            </>
          )}
        </div>
      </div>
      <TodoItemList todos={todos} group={group} />
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

          {/* Let's add a little info text to tell the user what's happening */}
          <p className="text-xs text-muted-foreground">
            Showing only tasks containing "{searchQuery}"
          </p>
        </DialogContent>
      </Dialog>
      <Dialog open={isArchiveOpen} onOpenChange={setIsArchiveOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Archived Tasks: {title}</DialogTitle>
            <DialogDescription>
              These tasks are hidden from your main board. You can restore or
              permanently delete them here.
            </DialogDescription>
          </DialogHeader>

          {/* THE LIST AREA */}
          <div className="py-4 min-h-[200px] max-h-[400px] overflow-y-auto space-y-3">
            <ArchivedTasksModal groupId={_id} />
            <p className="text-sm text-muted-foreground italic text-center py-8">
              No archived tasks found in this list.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupCard;
