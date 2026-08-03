// app/routes/register.jsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import axios from "axios";
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
      await axios.post("http://localhost:5000/register", data, {
        withCredentials: true,
      });
      navigate("/");
    } catch (error) {
      console.error(error.response.data);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="min-h-screen flex items-center justify-center bg-background px-4"
    >
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Get started
          </h1>
          <p className="text-muted-foreground">
            Create your todo account in seconds
          </p>
        </div>

        {/* Card */}
        <Card className="p-6 border-border bg-card space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Field data-invalid={!!errors.name}>
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
            </Field>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Field data-invalid={!!errors.email}>
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
            </Field>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Field data-invalid={!!errors.password}>
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
            </Field>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Field data-invalid={!!errors.confirmPassword}>
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
            </Field>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            Create account
          </Button>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </form>
  );
}
