import Board from "../models/Board.js";
import Task from "../models/Task.js";

export const createBoard = async (req, res) => {
  try {
    const board = await Board.create({ ...req.body, user: req.user._id });
    res.status(201).json(board);
  } catch (error) {
    res.status(400).json({ msg: `error creating board ${error.message}` });
  }
};

export const getUserBoards = async (req, res) => {
  try {
    const boards = await Board.find({
      $or: [{ user: req.user._id }, { members: req.user._id }],
    }).sort({ position: 1 });
    res.status(200).json(boards);
  } catch (error) {
    res.status(400).json({ msg: `error fetching boards ${error.message}` });
  }
};

export const reorderBoards = async (req, res) => {
  try {
    const { boards } = req.body;
    for (let i = 0; i < boards.length; i++) {
      await Board.findByIdAndUpdate(boards[i], { position: i });
    }
    res.status(200).json({ msg: "Boards reordered successfully" });
  } catch (error) {
    res.status(400).json({ msg: `error reordering boards ${error.message}` });
  }
};

export const deleteBoardById = async (req, res) => {
  try {
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
    const board = await Board.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!board) return res.status(404).json({ msg: "Board not found" });
    res.status(200).json(board);
  } catch (error) {
    res.status(400).json({ msg: `error updating board ${error.message}` });
  }
};
