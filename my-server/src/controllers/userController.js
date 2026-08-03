import User from "../models/User.js";

//gett all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { name: 1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ msg: `error ${error.message}` });
  }
};
