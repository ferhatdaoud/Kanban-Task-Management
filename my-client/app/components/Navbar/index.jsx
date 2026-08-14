import React from "react";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import CreateBoard from "../CreateBoard";

const Navbar = ({ handleLogout }) => {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: () => api.get("/me").then((res) => res.data),
  });

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">KT</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Kanban Task Manager
            </h1>
            <p className="truncate text-xs text-muted-foreground">
              {isLoading ? "Loading..." : error ? "Error loading user" : user?.name ? `Welcome, ${user.name}` : "Welcome"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <CreateBoard />

          <div className="flex items-center gap-2">
            {user && !isLoading && !error && (
              <div className="hidden sm:flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
                <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <span className="text-xs font-medium text-foreground truncate max-w-[100px]">
                  {user.name}
                </span>
              </div>
            )}

            <Button
              type="button"
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;