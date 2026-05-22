import express from "express";
import {
  createTodo,
  getTodos,
  getGroupTodo,
  deleteTodo,
  updateTodo,
  reorderTodo,
  getArchivedTodos,
} from "../controllers/todoController.js";
import protect from "../middleware/auth.js";

const router = express.Router();
router.get("/:groupId", protect, getGroupTodo);
router.get("/", protect, getTodos);
router.get("/archived/:groupId", protect, getArchivedTodos);
router.post("/", protect, createTodo);
router.put("/reorderTodo", protect, reorderTodo);
router.put("/:id", protect, updateTodo);
router.delete("/:id", protect, deleteTodo);

export default router;
