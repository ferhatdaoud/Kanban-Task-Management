import { index, route } from "@react-router/dev/routes";

export default [
  index("./pages/home.jsx"),
  route("login", "./pages/login.jsx"),
  route("register", "./pages/register.jsx"),
];
