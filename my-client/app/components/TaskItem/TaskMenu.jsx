import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  Archive,
  ChevronDown,
  ChevronUp,
  ChevronsDown,
  ChevronsUp,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
const TaskMenu = ({
  mutationDeleteTask,
  setIsSheetOpen,
  moveUp,
  moveDown,
  moveTop,
  moveBottom,
  task,
  mutationToggleArchive,
}) => {
  return (
    <div className="flex items-center gap-1 shrink-0 mt-0.5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setIsSheetOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" /> View Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => mutationToggleArchive.mutate(task._id)}
          >
            <Archive className="mr-2 h-4 w-4" />
            <span>Archive Task</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Reorder</DropdownMenuLabel>
          <DropdownMenuItem onClick={moveTop}>
            <ChevronsUp className="mr-2 h-4 w-4" /> Move to Top
          </DropdownMenuItem>
          <DropdownMenuItem onClick={moveUp}>
            <ChevronUp className="mr-2 h-4 w-4" /> Move Up
          </DropdownMenuItem>
          <DropdownMenuItem onClick={moveDown}>
            <ChevronDown className="mr-2 h-4 w-4" /> Move Down
          </DropdownMenuItem>
          <DropdownMenuItem onClick={moveBottom}>
            <ChevronsDown className="mr-2 h-4 w-4" /> Move to Bottom
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => mutationDeleteTask.mutate(task._id)}
            className="text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TaskMenu;
