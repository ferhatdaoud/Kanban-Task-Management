import React, { useState } from "react";
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
  Users,
  Plus,
  X,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

const BoardMenue = ({
  handleEditing,
  _id,
  mutationDeleteBoard,
  moveLeft,
  moveRight,
  setIsSearchOpen,
  setIsArchiveOpen,
  board,
  canEditBoard,
  currentUserRole,
}) => {
  const [isMembersOpen, setIsMembersOpen] = React.useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");

  const queryClient = useQueryClient();

  const { data: allUsers, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => api.get(`/user`).then((res) => res.data),
    enabled: isMembersOpen,
  });

  const { data: roles, isLoading: rolesLoading } = useQuery({
    queryKey: ["roles"],
    queryFn: () => api.get(`/boards/roles`).then((res) => res.data),
    enabled: isMembersOpen,
  });

  const mutationAddMember = useMutation({
    mutationFn: ({ userId, roleId }) =>
      api
        .post(`/boards/${_id}/members`, { userId, roleId })
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["boards"]);
      setSelectedUserId("");
      setSelectedRoleId("");
      toast.success("Member added to board");
    },
    onError: () => toast.error("Failed to add member"),
  });

  const mutationRemoveMember = useMutation({
    mutationFn: (userId) =>
      api.delete(`/boards/${_id}/members/${userId}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["boards"]);
      toast.success("Member removed");
    },
    onError: () => toast.error("Failed to remove member"),
  });

  const mutationUpdateRole = useMutation({
    mutationFn: ({ userId, roleId }) =>
      api
        .put(`/boards/${_id}/members/${userId}`, { roleId })
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries(["boards"]);
      toast.success("Role updated");
    },
    onError: () => toast.error("Failed to update role"),
  });

  const handleAddMember = () => {
    if (selectedUserId && selectedRoleId) {
      mutationAddMember.mutate({
        userId: selectedUserId,
        roleId: selectedRoleId,
      });
    }
  };

  const availableUsers = allUsers?.filter(
    (u) =>
      u._id !== board?.user?._id &&
      !board?.members?.some((m) => m.user?._id === u._id),
  );

  return (
    <>
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
          <DropdownMenuLabel>Board Actions</DropdownMenuLabel>

          {canEditBoard && (
            <DropdownMenuItem onClick={handleEditing}>
              <Pencil className="mr-2 h-4 w-4" /> Rename Board
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => setIsArchiveOpen(true)}>
            <Archive className="mr-2 h-4 w-4" />
            <span> View Archived Tasks</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsSearchOpen(true)}>
            <Search></Search>
            <span>search task</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Reorder Column</DropdownMenuLabel>

          {canEditBoard && (
            <>
              <DropdownMenuItem onClick={moveLeft}>
                <ChevronLeft className="mr-2 h-4 w-4" /> Move Left
              </DropdownMenuItem>
              <DropdownMenuItem onClick={moveRight}>
                <ChevronRight className="mr-2 h-4 w-4" /> Move Right
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}
          <DropdownMenuItem onClick={() => setIsMembersOpen(true)}>
            <Users className="mr-2 h-4 w-4" /> Members
          </DropdownMenuItem>
          <DropdownMenuSeparator />

          {canEditBoard && (
            <DropdownMenuItem
              onClick={() => mutationDeleteBoard.mutate(_id)}
              className="text-destructive focus:text-destructive focus:bg-destructive/10"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete Board
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Members Dialog */}
      <Dialog open={isMembersOpen} onOpenChange={setIsMembersOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Board Members</DialogTitle>
            <DialogDescription>
              People with access to this board
            </DialogDescription>
          </DialogHeader>

          {/* Add Member Section (Owner Only) */}
          {canEditBoard && (
            <div className="flex flex-col gap-3 p-4 rounded-md border border-border bg-muted/20">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Add Member
              </p>
              <div className="flex gap-2">
                <Select
                  value={selectedUserId}
                  onValueChange={setSelectedUserId}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder={usersLoading ? "Loading users..." : "Select user"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUsers?.map((user) => (
                      <SelectItem key={user._id} value={user._id}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                    {!usersLoading && availableUsers?.length === 0 && (
                      <div className="px-2 py-1.5 text-xs text-muted-foreground">
                        No users available
                      </div>
                    )}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedRoleId}
                  onValueChange={setSelectedRoleId}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder={rolesLoading ? "Loading..." : "Role"} />
                  </SelectTrigger>
                  <SelectContent>
                    {roles?.map((role) => (
                      <SelectItem key={role._id} value={role._id}>
                        {role.name}
                      </SelectItem>
                    ))}
                    {!rolesLoading && roles?.length === 0 && (
                      <div className="px-2 py-1.5 text-xs text-muted-foreground">
                        No roles available
                      </div>
                    )}
                  </SelectContent>
                </Select>

                <Button
                  size="sm"
                  onClick={handleAddMember}
                  disabled={
                    !selectedUserId ||
                    !selectedRoleId ||
                    mutationAddMember.isPending
                  }
                >
                  {mutationAddMember.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Members List */}
          <div className="py-4 space-y-3 max-h-[300px] overflow-y-auto">
            {/* Owner */}
            {board?.user && (
              <div className="flex items-center justify-between p-3 rounded-md border border-border bg-muted/30">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {board.user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {board.user.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {board.user.email}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-1 rounded-full">
                  Owner
                </span>
              </div>
            )}

            {/* Members */}
            {board?.members?.filter((m) => m.user?._id !== board?.user?._id).length > 0 && (
              <>
                {board.members
                  .filter((m) => m.user?._id !== board?.user?._id)
                  .map((member) => (
                  <div
                    key={member.user?._id}
                    className="flex items-center justify-between p-3 rounded-md border border-border/60"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-secondary border border-border/50 flex items-center justify-center text-xs font-bold">
                        {member.user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {member.user?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {member.user?.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {canEditBoard ? (
                        <Select
                          value={member.role?._id}
                          onValueChange={(roleId) =>
                            mutationUpdateRole.mutate({
                              userId: member.user._id,
                              roleId,
                            })
                          }
                        >
                          <SelectTrigger className="h-7 w-24 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {roles?.map((role) => (
                              <SelectItem key={role._id} value={role._id}>
                                {role.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground bg-muted px-2 py-1 rounded-full">
                          {member.role?.name || "Member"}
                        </span>
                      )}

                      {canEditBoard && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                          onClick={() =>
                            mutationRemoveMember.mutate(member.user._id)
                          }
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}

            {board?.members?.filter((m) => m.user?._id !== board?.user?._id).length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4 italic">
                No additional members
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BoardMenue;
