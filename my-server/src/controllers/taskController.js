import Task from "../models/Task.js";

export const createTask = async (req, res) => {
  try {
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
    const queryFilter = {
      board: boardId,
      isArchived: false,
      user: req.user._id,
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
    const archived = await Task.find({
      board: boardId,
      isArchived: true,
      user: req.user._id,
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
    const tasks = await Task.find({ board: boardId, user: req.user._id }).sort({
      position: 1,
    });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ msg: `error ${error.message}` });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: "Task not found" });
    res.status(200).json(deleted);
  } catch (error) {
    res.status(400).json({ msg: `error ${error.message}` });
  }
};

export const reorderTasks = async (req, res) => {
  try {
    const { tasks } = req.body;
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
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ msg: "Task not found" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ msg: `error ${error.message}` });
  }
};
