import Board from "../models/Board.js";
import Role from "../models/Role.js";

export const hasRole = async (userId, boardId, allowedRoles) => {
  const board = await Board.findById(boardId);
  if (!board) return false;
  if (board.user.toString() === userId.toString()) return true;
  const membership = board.members.find(
    (m) => m.user.toString() === userId.toString(),
  );
  if (!membership) return false;
  const role = await Role.findById(membership.role);
  return allowedRoles.includes(role?.name);
};

export const getUserRole = async (userId, boardId) => {
  const board = await Board.findById(boardId);
  if (!board) return null;
  if (board.user.toString() === userId.toString()) return "owner";
  const membership = board.members.find(
    (m) => m.user.toString() === userId.toString(),
  );
  if (!membership) return null;
  const role = await Role.findById(membership.role);
  return role?.name || null;
};
