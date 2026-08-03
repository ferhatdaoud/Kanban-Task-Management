import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const AddTodoModal = ({ id }) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  // 1. Added State for description
  const [todoTitle, setTodoTitle] = useState("");
  const [todoDescription, setTodoDescription] = useState("");

  const mutatioAddTodo = useMutation({
    mutationFn: () =>
      axios
        .post(
          "http://localhost:5000/todos",
          {
            title: todoTitle,
            description: todoDescription, // 
            group: id,
          },
          { withCredentials: true },
        )
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["todos", id]);
      setTodoTitle("");
      setTodoDescription(""); 
      setOpen(false);
    },
  });

  const handleSubmit = () => {
    if (todoTitle.trim()) {
      mutatioAddTodo.mutate();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a New Todo</DialogTitle>
          <DialogDescription>
            Give your task a title and an optional description.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {/* Title Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground">
              Title
            </label>
            <input
              type="text"
              value={todoTitle}
              onChange={(e) => setTodoTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-ring"
              placeholder="e.g., Buy Groceries"
            />
          </div>

          {/* 4. Description Input */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground">
              Description (Optional)
            </label>
            <textarea
              value={todoDescription}
              onChange={(e) => setTodoDescription(e.target.value)}
              className="rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-foreground outline-none focus:border-primary focus:ring-1 focus:ring-ring min-h-[80px] resize-none"
              placeholder="Add more details..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!todoTitle.trim() || mutatioAddTodo.isPending}
          >
            {mutatioAddTodo.isPending ? "Saving..." : "Save Todo"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTodoModal;
