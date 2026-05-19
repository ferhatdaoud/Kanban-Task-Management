import Todo from "../models/Todo.js";
//Todo Crud Section
//Creating a Todo
export const createTodo = async (req, res) => {
  try {
    const todo = await Todo.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ msg: `error ${error.message}` });
  }
};
//requesting group todo
export const getGroupTodo = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { search } = req.query;
    let queryFilter = { group: groupId };
    //searching filter
    if (search) {
      queryFilter.title = { $regex: search, $options: "i" };
    }
    const todos = await Todo.find(queryFilter)
      .sort({
        position: 1,
      })
      .populate("assignedTo", "name");

    //
    res.status(200).json(todos);
  } catch (error) {
    res.status(400).json({ msg: `error ${error.message}` });
  }
};
//requesting all todos
export const getTodos = async (req, res) => {
  try {
    const { groupId } = req.params;
    const todos = (
      await Todo.find({ group: groupId /* user: req.user._id  */ })
    ).sort({ position: 1 });
    res.status(200).json({ msg: "all todos", todos });
  } catch (error) {
    res.status(400).json({ msg: `error ${error.message}` });
  }
};
//deleting a todo
export const deleteTodo = async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) return res.status(404).json({ msg: "Todo not found" });
    res.status(200).json(deletedTodo);
  } catch (error) {
    res.status(400).json({ msg: `error ${error.message}` });
  }
};
export const reorderTodo = async (req, res) => {
  try {
    const { newOrder } = req.body;
    for (let i = 0; i < newOrder.length; i++) {
      const todoId = newOrder[i];
      const updatedTodos = await Todo.findByIdAndUpdate(todoId, {
        position: i,
      });
    }
    res
      .status(200)
      .json({ msg: `updated Positions Successfully${updatedTodos}` });
  } catch (error) {
    res.status(500).json({ msg: `error ${error.message}` });
  }
};
//update a todo
export const updateTodo = async (req, res) => {
  try {
    const updateTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updateTodo) return res.status(404).json({ msg: "Todo not found" });
    res.status(200).json(updateTodo);
  } catch (error) {
    res.status(400).json({ msg: `error ${error.message}` });
  }
};
