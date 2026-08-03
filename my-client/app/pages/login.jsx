// app/routes/login.jsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import axios from "axios";
import { useState } from "react";
import { loginSchema } from "../lib/schemas/authSchema";

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
      await axios.post("http://localhost:5000/login", data, {
        withCredentials: true,
      });
      navigate("/");
    } catch (error) {
      console.error(error.response.data);
      setError(error.response.data.msg);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back
          </h1>
          <p className="text-muted-foreground">Sign in to your todo account</p>
        </div>

        {/* Card */}
        <form
          className="p-6 border-border bg-card space-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >
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

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            Dont have an account?
            <Link
              to="/register"
              className="text-primary hover:underline font-medium"
            >
              Create one
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
