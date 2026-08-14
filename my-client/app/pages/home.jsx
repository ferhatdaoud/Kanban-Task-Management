import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import { Boards } from "@/components/Boards";
import { Skeleton } from "@/components/ui/skeleton";

import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate, Navigate } from "react-router";
import { toast } from "sonner";
export default function Home() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: user,
    error: authError,
    isLoading: authLoading,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => api.get("/me").then((res) => res.data),
  });

  const {
    data: boards,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["boards"],
    queryFn: () => api.get("/boards").then((res) => res.data),
    enabled: Boolean(user),
  });

  const handleLogout = () => {
    api.post("/logout").then(() => {
      queryClient.invalidateQueries(["user"]);
      navigate("/login");
      toast.success("Logged out successfully");
    });
  };

  if (authError) return <Navigate to="/register" replace />;
  if (authLoading)
    return (
      <div className="flex h-screen flex-col bg-background">
        <div className="border-b border-border px-4 py-4">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <main className="flex-1 overflow-hidden p-6">
          <div className="flex h-full gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-full sm:w-80 shrink-0 space-y-3">
                <Skeleton className="h-32 w-full rounded-xl" />
                <Skeleton className="h-4 w-3/4 rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  if (error)
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-destructive">{error.message}</p>
      </div>
    );
  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading boards...</p>
        </div>
      </div>
    );
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <Navbar handleLogout={handleLogout} />
      <main className="flex-1 overflow-hidden p-6">
        <Boards boards={boards} currentUser={user} />
      </main>
    </div>
  );
}
