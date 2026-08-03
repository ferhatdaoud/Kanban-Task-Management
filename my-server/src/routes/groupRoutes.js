import express from "express";
import {
  createGroup,
  getUserGroups,
  deleteGroupById,
  updateGroup,
  reorderGroup,
} from "../controllers/groupController.js";
import protect from "../middleware/auth.js";
const router = express.Router();

router.get("/", protect, getUserGroups);
router.post("/", protect, createGroup);
router.put("/reorderGroup", protect, reorderGroup);
router.delete("/:id", protect, deleteGroupById);
router.put("/:id", protect, updateGroup);

export default router;
