import { z } from "zod";

// Auth
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Boards
export const createBoardSchema = z.object({
  title: z.string().min(1, "Title is required"),
});
export const updateBoardSchema = z.object({
  title: z.string().min(1, "Title cannot be empty").optional(),
});
export const reorderBoardsSchema = z.object({
  boards: z.array(z.string()).min(1, "Array cannot be empty"),
});

// Tasks
export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional().default(""),
  board: z.string().min(1, "Board ID is required"),
});
export const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  isDone: z.boolean().optional(),
  isArchived: z.boolean().optional(),
  assignedTo: z.string().nullable().optional(),
  board: z.string().optional(),
});
export const reorderTasksSchema = z.object({
  tasks: z.array(z.string()).min(1, "Array cannot be empty"),
});

// Comments
export const createCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
  taskId: z.string().min(1, "Task ID is required"),
});
export const updateCommentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
});
