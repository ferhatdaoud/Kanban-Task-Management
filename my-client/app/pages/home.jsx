import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import { Boards } from "@/components/Boards";

import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate, Navigate } from "react-router";
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
    });
  };

  if (authError) return <Navigate to="/register" replace />;
  if (authLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <Navbar handleLogout={handleLogout} />
      <main className="flex-1 overflow-hidden p-6">
        <Boards boards={boards} />
      </main>
    </div>
  );
}
