import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import protect from "./src/middleware/auth.js";
import { connectDB } from "./config/db.js";
import commentRouter from "./src/routes/commentsRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import taskRouter from "./src/routes/taskRoutes.js";
import boardRouter from "./src/routes/boardRoutes.js";

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

//REgistration Route
app.get("/me", protect, (req, res) => {
  res.status(200).json(req.user);
});
app.get("/", protect, (req, res) => {
  res.status(200).json({ msg: "Welcome", user: req.user });
});
app.use("/", authRoutes);

//Task Crud Section
app.use("/tasks", taskRouter);
app.use("/boards", boardRouter);
//comment crud section
app.use("/comments", commentRouter);
//user section
app.use("/user", userRoutes);
// starting the server and connectinmg to the database
connectDB().catch((error) => console.log(error));
app.listen(port, () => console.log(`server is running on port:${port}`));
