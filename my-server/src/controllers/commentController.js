import Comment from "../models/Comment.js";
//creating a comment
export const createComment = async (req, res) => {
  try {
    const { content, todoId } = req.body;
    const comment = await Comment.create({
      content,
      user: req.user._id,
      todo: todoId,
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ msg: `error creating a comment ${error.message}` });
  }
};

//getting all comments
export const getComments = async (req, res) => {
  try {
    const { todoId } = req.params;
    const comments = await Comment.find({ todo: todoId }).populate("user","name");
    res.status(200).json(comments);
  } catch (error) {
    res.status(400).json({ msg: `error getting comments ${error.message}` });
  }
};

//deleting a comment
export const deleteComment = async (req, res) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(req.params.id);
    if (!deletedComment)
      return res.status(404).json({ msg: "Comment not found" });
    res.status(200).json(deletedComment);
  } catch (error) {
    res.status(400).json({ msg: `error deleting a comment ${error.message}` });
  }
};

//updating a comment
export const updateComment = async (req, res) => {
  try {
    const updateComment = await Comment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );
    if (!updateComment)
      return res.status(404).json({ msg: "Comment not found" });
    res.status(200).json(updateComment);
  } catch (error) {
    res.status(400).json({ msg: `error updating a comment ${error.message}` });
  }
};
