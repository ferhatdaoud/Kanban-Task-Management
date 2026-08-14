import Comment from "../models/Comment.js";
import { hasRole } from "../utils/roleCheck.js";

export const createComment = async (req, res) => {
  try {
    const { content, taskId } = req.body;
    const task = await Comment.findById(taskId).populate("board");
    // We need the boardId - comments don't have a direct board ref, but tasks do
    // Actually, let's get the task to find the board
    const Task = (await import("../models/Task.js")).default;
    const taskDoc = await Task.findById(taskId);
    if (!taskDoc) return res.status(404).json({ msg: "Task not found" });
    
    const allowed = await hasRole(req.user._id, taskDoc.board, ["owner", "editor"]);
    if (!allowed) return res.status(403).json({ msg: "Not authorized" });

    const comment = await Comment.create({
      content,
      user: req.user._id,
      task: taskId,
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ msg: `error creating a comment ${error.message}` });
  }
};

export const getComments = async (req, res) => {
  try {
    const { taskId } = req.params;
    const Task = (await import("../models/Task.js")).default;
    const taskDoc = await Task.findById(taskId);
    if (!taskDoc) return res.status(404).json({ msg: "Task not found" });
    
    const allowed = await hasRole(req.user._id, taskDoc.board, ["owner", "editor", "viewer"]);
    if (!allowed) return res.status(403).json({ msg: "Not authorized" });

    const comments = await Comment.find({ task: taskId }).populate(
      "user",
      "name",
    );
    res.status(200).json(comments);
  } catch (error) {
    res.status(400).json({ msg: `error getting comments ${error.message}` });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const deletedComment = await Comment.findById(req.params.id).populate("task");
    if (!deletedComment)
      return res.status(404).json({ msg: "Comment not found" });
    
    const Task = (await import("../models/Task.js")).default;
    const taskDoc = await Task.findById(deletedComment.task);
    if (!taskDoc) return res.status(404).json({ msg: "Task not found" });
    
    const allowed = await hasRole(req.user._id, taskDoc.board, ["owner", "editor"]);
    if (!allowed) return res.status(403).json({ msg: "Not authorized" });

    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedComment);
  } catch (error) {
    res.status(400).json({ msg: `error deleting a comment ${error.message}` });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id).populate("task");
    if (!comment) return res.status(404).json({ msg: "Comment not found" });
    
    const Task = (await import("../models/Task.js")).default;
    const taskDoc = await Task.findById(comment.task);
    if (!taskDoc) return res.status(404).json({ msg: "Task not found" });
    
    const allowed = await hasRole(req.user._id, taskDoc.board, ["owner", "editor"]);
    if (!allowed) return res.status(403).json({ msg: "Not authorized" });

    const updatedComment = await Comment.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(400).json({ msg: `error updating a comment ${error.message}` });
  }
};
