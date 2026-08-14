import React from "react";
import { Button } from "../ui/button";
import { RotateCcw, Trash2 } from "lucide-react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";

const ArchivedTasksModal = ({ boardId, canEditTasks = true }) => {
  const queryClient = useQueryClient();
  //fetching archived tasks
  const { data: archive, isLoading } = useQuery({
    queryKey: ["archived-tasks", boardId],
    queryFn: () =>
      api.get(`/tasks/archived/${boardId}`).then((res) => res.data),
  });
  //resoting archived tasks
  const mutationRestore = useMutation({
    mutationFn: (id) =>
      api.put(`/tasks/${id}`, { isArchived: false }).then((res) => res.data),
    onSuccess: () =>
      queryClient.invalidateQueries(["archived-tasks", boardId]),
  });
  if (isLoading)
    return (
      <p className="text-center py-4 text-xs text-muted-foreground">
        Loading archives...
      </p>
    );

  if (archive?.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed rounded-lg bg-muted/20">
        <p className="text-sm text-muted-foreground italic">
          No archived tasks in this list.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {archive?.map((task) => (
        <div
          key={task._id}
          className="flex items-center justify-between p-3 rounded-md border border-border bg-muted/30 board"
        >
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-medium truncate text-foreground/70">
              {task.title}
            </span>
            <span className="text-[10px] text-muted-foreground">
              Archived on {new Date(task.updatedAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {canEditTasks && (
              <>
                {/* RESTORE BUTTON */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-primary hover:bg-primary/10"
                  title="Restore to board"
                  onClick={() => mutationRestore.mutate(task._id)}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>

                {/* PERMANENT DELETE BUTTON */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  title="Delete permanently"
                  onClick={() => console.log("Delete clicked for:", task._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ArchivedTasksModal;
