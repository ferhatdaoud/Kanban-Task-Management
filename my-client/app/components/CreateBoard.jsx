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
const CreateBoard = () => {
  //stats
  const [board, setBoard] = useState("");
  //dialog opener for adding board
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  //creating board
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
        <DialogTitle>Create New Board</DialogTitle>
        <div className="py-4">
          <input
            placeholder="Enter Board Name"
            value={board}
            className="w-full"
            onChange={(e) => setBoard(e.target.value)}
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
