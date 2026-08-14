import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useState } from "react";
import { loginSchema } from "../lib/schemas/authSchema";
import api from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

export default function Login() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data) => {
    try {
      await api.post("/login", data);
      toast.success("Welcome back!");
      navigate("/");
    } catch (error) {
      const msg = error.response?.data?.msg || "Login failed";
      setError(msg);
      toast.error(msg);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Sign in to your Kanban account</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="p-6 space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email
              </Label>
              <Input
                {...register("email")}
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="bg-background text-foreground border-border"
              />
              {errors.email && (
                <p style={{ color: "red" }}>{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Password
              </Label>
              <Input
                {...register("password")}
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                className="bg-background text-foreground border-border"
              />
              {error && <p style={{ color: "red" }}>{error}</p>}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              Sign in
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?
            <Link
              to="/register"
              className="text-primary hover:underline font-medium"
            >
              Create one
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
