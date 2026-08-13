import { route } from "@react-router/dev/routes";
import { json, redirect } from "react-router";
import jwt from "jsonwebtoken";

const requireAuth = async ({ request }) => {
  const cookieHeader = request.headers.get("cookie") || "";
  const token = cookieHeader
    .split("; ")
    .find((c) => c.startsWith("token="))
    ?.split("=")[1];

  if (!token) return redirect("/register");

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return json({ authenticated: true });
  } catch {
    return redirect("/register");
  }
};

export default [
  { index: true, loader: requireAuth, Component: "./pages/home.jsx" },
  route("login", "./pages/login.jsx"),
  route("register", "./pages/register.jsx"),
];
