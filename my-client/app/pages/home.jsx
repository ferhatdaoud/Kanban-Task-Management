import Navbar from "@/components/Navbar";
import api from "@/lib/api";
import { Boards } from "@/components/Boards";

import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
export default function Home() {
  //states
  //hooks
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    data: boards,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["boards"],
    queryFn: () => api.get("/boards").then((res) => res.data),
  });
  const handleLogout = () => {
    api.post("/logout").then(() => {
      queryClient.invalidateQueries(["user"]);
      navigate("/login");
    });
  };
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
