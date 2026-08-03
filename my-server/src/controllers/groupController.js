import Group from "../models/Group.js";
import Todo from "../models/Todo.js";
//Group crud
//creating a group
export const createGroup = async (req, res) => {
  try {
    const group = await Group.create({ ...req.body, user: req.user._id });
    res.status(201).json(group);
  } catch (error) {
    res.status(400).json({ msg: `error creating group ${error.message}` });
  }
};
//requesting all group
export const getUserGroups = async (req, res) => {
  try {
    const group = await Group.find({
      /* user: req.user._id */
    }).sort({ position: 1 });
    res.status(200).json(group);
  } catch (error) {
    res.status(400).json({ msg: `error creating group ${error.message}` });
  }
};
//reordering a group
export const reorderGroup = async (req, res) => {
  try {
    const { newArrCopy } = req.body;
    for (let i = 0; i < newArrCopy.length; i++) {
      const groupId = newArrCopy[i];
      await Group.findByIdAndUpdate(groupId, {
        position: i,
      });
    }
    res.status(200).json({ msg: `Groups reordered Successfully` });
  } catch (error) {
    res.status(400).json({ msg: `error creating group ${error.message}` });
  }
};
//deleting a group
export const deleteGroupById = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedGroup = await Group.findByIdAndDelete(id);
    if (!deletedGroup) return res.status(404).json({ msg: "Group not found" });
    const deleteTodos = await Todo.deleteMany({ group: id });
    res
      .status(200)
      .json(
        `deletedGroup ${deletedGroup} and its todos are deleted ${deleteTodos}`,
      );
  } catch (error) {
    res.status(400).json({ msg: `error creating group ${error.message}` });
  }
};
//update a group
export const updateGroup = async (req, res) => {
  try {
    const updateGroup = await Group.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updateGroup) return res.status(404).json({ msg: "Group not found" });
    res.status(200).json(updateGroup);
  } catch (error) {
    res.status(400).json({ msg: `error creating group ${error.message}` });
  }
};
