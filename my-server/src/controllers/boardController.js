import Board from "../models/Board.js";
import Task from "../models/Task.js";
import Role from "../models/Role.js";
import { hasRole } from "../utils/roleCheck.js";

export const createBoard = async (req, res) => {
  try {
    const board = await Board.create({
      ...req.body,
      user: req.user._id,
      members: [],
    });
    res.status(201).json(board);
  } catch (error) {
    res.status(400).json({ msg: `error creating board ${error.message}` });
  }
};

export const getUserBoards = async (req, res) => {
  try {
    const boards = await Board.find({
      $or: [
        { user: req.user._id },
        { "members.user": req.user._id },
      ],
    })
      .sort({ position: 1 })
      .populate("user", "name email")
      .populate("members.user", "name email")
      .populate("members.role", "name");
    res.status(200).json(boards);
  } catch (error) {
    res.status(400).json({ msg: `error fetching boards ${error.message}` });
  }
};

export const reorderBoards = async (req, res) => {
  try {
    const { boards } = req.body;
    for (let i = 0; i < boards.length; i++) {
      const allowed = await hasRole(req.user._id, boards[i], ["owner"]);
      if (!allowed) return res.status(403).json({ msg: "Not authorized" });
      await Board.findByIdAndUpdate(boards[i], { position: i });
    }
    res.status(200).json({ msg: "Boards reordered successfully" });
  } catch (error) {
    res.status(400).json({ msg: `error reordering boards ${error.message}` });
  }
};

export const deleteBoardById = async (req, res) => {
  try {
    const allowed = await hasRole(req.user._id, req.params.id, ["owner"]);
    if (!allowed) return res.status(403).json({ msg: "Not authorized" });
    const board = await Board.findByIdAndDelete(req.params.id);
    if (!board) return res.status(404).json({ msg: "Board not found" });
    await Task.deleteMany({ board: req.params.id });
    res.status(200).json({ msg: "Board and its tasks deleted" });
  } catch (error) {
    res.status(400).json({ msg: `error deleting board ${error.message}` });
  }
};

export const updateBoard = async (req, res) => {
  try {
    const allowed = await hasRole(req.user._id, req.params.id, ["owner"]);
    if (!allowed) return res.status(403).json({ msg: "Not authorized" });
    const board = await Board.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!board) return res.status(404).json({ msg: "Board not found" });
    res.status(200).json(board);
  } catch (error) {
    res.status(400).json({ msg: `error updating board ${error.message}` });
  }
};

export const addMember = async (req, res) => {
  try {
    const allowed = await hasRole(req.user._id, req.params.id, ["owner"]);
    if (!allowed) return res.status(403).json({ msg: "Not authorized" });

    const { userId, roleId } = req.body;
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ msg: "Board not found" });

    // Remove existing membership if user is already a member
    board.members = board.members.filter((m) => m.user.toString() !== userId);
    board.members.push({ user: userId, role: roleId });
    await board.save();
    res.status(200).json(board);
  } catch (error) {
    res.status(400).json({ msg: `error adding member ${error.message}` });
  }
};

export const removeMember = async (req, res) => {
  try {
    const allowed = await hasRole(req.user._id, req.params.id, ["owner"]);
    if (!allowed) return res.status(403).json({ msg: "Not authorized" });

    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ msg: "Board not found" });

    board.members = board.members.filter(
      (m) => m.user.toString() !== req.params.userId,
    );
    await board.save();
    res.status(200).json(board);
  } catch (error) {
    res.status(400).json({ msg: `error removing member ${error.message}` });
  }
};

export const updateMemberRole = async (req, res) => {
  try {
    const allowed = await hasRole(req.user._id, req.params.id, ["owner"]);
    if (!allowed) return res.status(403).json({ msg: "Not authorized" });

    const { roleId } = req.body;
    const board = await Board.findById(req.params.id);
    if (!board) return res.status(404).json({ msg: "Board not found" });

    const member = board.members.find(
      (m) => m.user.toString() === req.params.userId,
    );
    if (!member) return res.status(404).json({ msg: "Member not found" });

    member.role = roleId;
    await board.save();
    res.status(200).json(board);
  } catch (error) {
    res
      .status(400)
      .json({ msg: `error updating member role ${error.message}` });
  }
};

export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find({});
    res.status(200).json(roles);
  } catch (error) {
    res.status(400).json({ msg: `error fetching roles ${error.message}` });
  }
};
