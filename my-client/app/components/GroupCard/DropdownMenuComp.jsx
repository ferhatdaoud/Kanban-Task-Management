import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Search,
  Archive,
} from "lucide-react";
import { Input } from "../ui/input";
const DropdownMenuComp = ({
  handleEditing,
  _id,
  mutationDeleteGroup,
  moveLeft,
  moveRight,
  setIsSearchOpen,
  setIsArchiveOpen,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 opacity-60 group-hover/header:opacity-100 transition-opacity"
        >
          <MoreVertical className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Group Actions</DropdownMenuLabel>

        <DropdownMenuItem onClick={handleEditing}>
          <Pencil className="mr-2 h-4 w-4" /> Rename Group
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setIsArchiveOpen(true)}>
          <Archive className="mr-2 h-4 w-4" />
          <span> View Archived Tasks</span>
        </DropdownMenuItem>
        {/* --- NEW REORDER SECTION --- */}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setIsSearchOpen(true)}>
          <Search></Search>
          <span>search task</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Reorder Column</DropdownMenuLabel>

        <DropdownMenuItem onClick={moveLeft}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Move Left
        </DropdownMenuItem>
        <DropdownMenuItem onClick={moveRight}>
          <ChevronRight className="mr-2 h-4 w-4" /> Move Right
        </DropdownMenuItem>
        {/* --------------------------- */}

        <DropdownMenuItem
          onClick={() => mutationDeleteGroup.mutate(_id)}
          className="text-destructive focus:text-destructive focus:bg-destructive/10"
        >
          <Trash2 className="mr-2 h-4 w-4" /> Delete Group
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropdownMenuComp;
