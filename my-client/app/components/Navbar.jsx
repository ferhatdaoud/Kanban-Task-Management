import React from "react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CreateGroup from "./CreateGroup";
const Navbar = ({ handleLogout }) => {
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      axios
        .get("http://localhost:5000/me", { withCredentials: true })
        .then((res) => res.data),
  });
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            My Tasks
          </h1>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            Welcome home {user?.name || "User"}!
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <CreateGroup />

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
    </header>
  );
};

export default Navbar;
