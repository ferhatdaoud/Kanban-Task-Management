import express from "express";
import { validateRequest } from "../../validators/validate.js";
import {
  createCommentSchema,
  updateCommentSchema,
} from "../../validators/index.js";

import {
  createComment,
  getComments,
  deleteComment,
  updateComment,
} from "../controllers/commentController.js";
import protect from "../middleware/auth.js";
const router = express.Router();

router.get("/:taskId", protect, getComments);
router.post("/", protect, validateRequest(createCommentSchema), createComment);
router.delete("/:id", protect, deleteComment);
router.put(
  "/:id",
  protect,
  validateRequest(updateCommentSchema),
  updateComment,
);

export default router;
