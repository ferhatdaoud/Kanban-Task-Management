import express from "express";
import { validateRequest } from "../../validators/validate.js";
import {
  createBoardSchema,
  updateBoardSchema,
  reorderBoardsSchema,
} from "../../validators/index.js";
import {
  createBoard,
  getUserBoards,
  deleteBoardById,
  updateBoard,
  reorderBoards,
} from "../controllers/boardController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getUserBoards);
router.post("/", protect, validateRequest(createBoardSchema), createBoard);
router.put(
  "/reorderBoard",
  protect,
  validateRequest(reorderBoardsSchema),
  reorderBoards,
);
router.delete("/:id", protect, deleteBoardById);
router.put("/:id", protect, validateRequest(updateBoardSchema), updateBoard);

export default router;
