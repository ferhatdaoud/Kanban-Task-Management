import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import api from "@/lib/api";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CreateBoard = () => {
  const [board, setBoard] = useState("");
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      api.post("/boards", { title: board }).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["boards"]);
      setOpen(false);
      setBoard("");
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Board</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Board</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-2">
          <Label htmlFor="board-name">Board Name</Label>
          <Input
            id="board-name"
            placeholder="e.g., Sprint Planning"
            value={board}
            onChange={(e) => setBoard(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && mutation.mutate()}
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button onClick={() => mutation.mutate()}>
            {mutation.isPending ? "Creating..." : "Create Board"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBoard;
