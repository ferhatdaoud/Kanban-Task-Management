import Task from "../models/Task.js";
import Board from "../models/Board.js";
import { hasRole } from "../utils/roleCheck.js";

export const createTask = async (req, res) => {
  try {
    const allowed = await hasRole(req.user._id, req.body.board, [
      "owner",
      "editor",
    ]);
    if (!allowed) return res.status(403).json({ msg: "Not authorized" });

    const task = await Task.create({ ...req.body, user: req.user._id });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ msg: `error creating task ${error.message}` });
  }
};

export const getBoardTasks = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { search } = req.query;
    const allowed = await hasRole(req.user._id, boardId, ["owner", "editor", "viewer"]);
    if (!allowed) return res.status(403).json({ msg: "Not authorized" });
    const queryFilter = {
      board: boardId,
      isArchived: false,
    };
    if (search) {
      queryFilter.title = { $regex: search, $options: "i" };
    }
    const tasks = await Task.find(queryFilter)
      .sort({ position: 1 })
      .populate("assignedTo", "name");
    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ msg: `error fetching tasks ${error.message}` });
  }
};

export const getArchivedTasks = async (req, res) => {
  try {
    const { boardId } = req.params;
    const allowed = await hasRole(req.user._id, boardId, ["owner", "editor", "viewer"]);
    if (!allowed) return res.status(403).json({ msg: "Not authorized" });
    const archived = await Task.find({
      board: boardId,
      isArchived: true,
    }).sort({ updatedAt: -1 });
    res.status(200).json(archived);
  } catch (error) {
    res
      .status(400)
      .json({ msg: `error getting archived tasks ${error.message}` });
  }
};

export const getTasks = async (req, res) => {
  try {
    const { boardId } = req.params;
    const tasks = await Task.find({ board: boardId }).sort({
      position: 1,
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ msg: `error ${error.message}` });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    const allowed = await hasRole(req.user._id, task.board, [
      "owner",
      "editor",
    ]);
    if (!allowed) return res.status(403).json({ msg: "Not authorized" });

    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "Task deleted" });
  } catch (error) {
    res.status(400).json({ msg: `error ${error.message}` });
  }
};

export const reorderTasks = async (req, res) => {
  try {
    const { tasks } = req.body;
    if (!tasks?.length)
      return res.status(400).json({ msg: "No tasks provided" });

    const firstTask = await Task.findById(tasks[0]);
    if (!firstTask) return res.status(404).json({ msg: "Task not found" });

    const allowed = await hasRole(req.user._id, firstTask.board, [
      "owner",
      "editor",
    ]);
    if (!allowed) return res.status(403).json({ msg: "Not authorized" });

    for (let i = 0; i < tasks.length; i++) {
      await Task.findByIdAndUpdate(tasks[i], { position: i });
    }
    res.status(200).json({ msg: "Positions updated successfully" });
  } catch (error) {
    res.status(500).json({ msg: `error ${error.message}` });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "Task not found" });

    const allowed = await hasRole(req.user._id, task.board, [
      "owner",
      "editor",
    ]);
    if (!allowed) return res.status(403).json({ msg: "Not authorized" });

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ msg: `error ${error.message}` });
  }
};
