// app/routes.js
import { index, route } from "@react-router/dev/routes";
import { json, redirect } from "react-router";
import Home from "./pages/home.jsx";

import jwt from "jsonwebtoken";

const = async ({ request }) => {
  const cookieHeader = request.header.get("cookie") || "";
  const token = cookieHeader
    .split("; ")
    .find((c) => c.startsWith("token="))
    ?.split("=")[1];
  if (!token) return json({ authenticated: false });
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return redirect("/home");
  } catch {
    return json({ authenticated: false });
  }
};

export default [
  {index:true,loader:requireAuth,Component:()=> null},
  route("login", "./pages/login.jsx"),
  route("register", "./pages/register.jsx"),
  route("/", "./pages/home.jsx"),
];
