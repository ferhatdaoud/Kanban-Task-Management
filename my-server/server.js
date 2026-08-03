import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import protect from "./src/middleware/auth.js";
import { connectDB } from "./config/db.js";
import { register, login, logout } from "./src/controllers/authController.js";
import todoRouter from "./src/routes/todoRoutes.js";
import groupRouter from "./src/routes/groupRoutes.js";
import commentRouter from "./src/routes/commentsRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
);
const port = 5000;
app.use(cookieParser());
app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).send("hello world");
});

//REgistration Route
app.post("/register", register);
//Login
app.post("/login", login);
//protected route
app.get("/me", protect, (req, res) => {
  res.status(200).json(req.user);
});
//protected route
app.get("/", protect, (req, res) => {
  res.status(200).json({ msg: "Welcome", user: req.user });
});
//removing cookie
app.post("/logout", logout);

//Todo Crud Section
app.use("/todos", todoRouter);
//group crud section
app.use("/group", groupRouter);
//comment crud section
app.use("/comments", commentRouter);
//user section
app.use("/user", userRoutes);
// starting the server and connectinmg to the database
connectDB().catch((error) => console.log(error));
app.listen(port, () => console.log(`server is running on port:${port}`));
