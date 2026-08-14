import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import api from "@/lib/api";

import { useNavigate } from "react-router";
import { registerSchema } from "../lib/schemas/authSchema";

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      await api.post("/register", data);
      navigate("/");
    } catch (error) {
      console.error(error.response.data);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Get started</CardTitle>
          <CardDescription>
            Create your Kanban account in seconds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Full Name */}
            <div className="space-y-2">
              <FieldLabel
                htmlFor="name"
                className="text-foreground font-medium"
              >
                Full name
              </FieldLabel>
              <Input
                {...register("name")}
                id="name"
                type="text"
                placeholder="John Doe"
                aria-invalid={!!errors.name}
                className="bg-background text-foreground border-border"
              />
              <FieldDescription style={{ color: errors.name ? "red" : "" }}>
                {errors.name ? errors.name.message : "Enter your full name"}
              </FieldDescription>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <FieldLabel
                htmlFor="email"
                className="text-foreground font-medium"
              >
                Email
              </FieldLabel>
              <Input
                {...register("email")}
                id="email"
                type="email"
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                className="bg-background text-foreground border-border"
              />
              <FieldDescription style={{ color: errors.email ? "red" : "" }}>
                {errors.email ? errors.email.message : "Enter your email"}
              </FieldDescription>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <FieldLabel
                htmlFor="password"
                className="text-foreground font-medium"
              >
                Password
              </FieldLabel>
              <Input
                {...register("password")}
                id="password"
                type="password"
                placeholder="••••••••"
                aria-invalid={!!errors.password}
                className="bg-background text-foreground border-border"
              />
              <FieldDescription style={{ color: errors.password ? "red" : "" }}>
                {errors.password
                  ? errors.password.message
                  : "At least 6 characters"}
              </FieldDescription>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <FieldLabel
                htmlFor="confirm-password"
                className="text-foreground font-medium"
              >
                Confirm password
              </FieldLabel>
              <Input
                {...register("confirmPassword")}
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                aria-invalid={!!errors.confirmPassword}
                className="bg-background text-foreground border-border"
              />
              <FieldDescription
                style={{ color: errors.confirmPassword ? "red" : "" }}
              >
                {errors.confirmPassword
                  ? errors.confirmPassword.message
                  : "Re-enter your password"}
              </FieldDescription>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              Create account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}