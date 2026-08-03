import express from "express";
import {
  createComment,
  getComments,
  deleteComment,
  updateComment,
} from "../controllers/commentController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.get("/:todoId", protect, getComments);
router.post("/", protect, createComment);
router.delete("/:id", protect, deleteComment);
router.put("/:id", protect, updateComment);

export default router;
