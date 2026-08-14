import express from "express";
import { validateRequest } from "../../validators/validate.js";
import {
  createBoardSchema,
  updateBoardSchema,
  reorderBoardsSchema,
  addMemberSchema,
  updateMemberRoleSchema,
} from "../../validators/index.js";
import {
  createBoard,
  getUserBoards,
  deleteBoardById,
  updateBoard,
  reorderBoards,
  addMember,
  removeMember,
  updateMemberRole,
  getRoles,
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

// Member management
router.post(
  "/:id/members",
  protect,
  validateRequest(addMemberSchema),
  addMember,
);
router.delete("/:id/members/:userId", protect, removeMember);
router.put(
  "/:id/members/:userId",
  protect,
  validateRequest(updateMemberRoleSchema),
  updateMemberRole,
);
router.get("/roles", protect, getRoles);

export default router;
