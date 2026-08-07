import express from "express";
import { validateRequest } from "../../validators/validate.js";
import {
  createTaskSchema,
  updateTaskSchema,
  reorderTasksSchema,
} from "../../validators/index.js";
import {
  createTask,
  getBoardTasks,
  getTasks,
  deleteTask,
  updateTask,
  reorderTasks,
  getArchivedTasks,
} from "../controllers/taskController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.get("/:boardId", protect, getBoardTasks);
router.get("/", protect, getTasks);
router.get("/archived/:boardId", protect, getArchivedTasks);
router.post("/", protect, validateRequest(createTaskSchema), createTask);
router.put(
  "/reorderTasks",
  protect,
  validateRequest(reorderTasksSchema),
  reorderTasks,
);
router.put("/:id", protect, validateRequest(updateTaskSchema), updateTask);
router.delete("/:id", protect, deleteTask);

export default router;

