import mongoose, { Schema } from "mongoose";
const todoSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
    group: {
      type: Schema.Types.ObjectId,
      ref: "Group",
    },
    description: {
      type: String,
      required: false,
      default: "",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    subtasks: [
      {
        title: { type: String },
        isDone: { type: Boolean, default: false },
      },
    ],
    position: { type: Number, default: Date.now() },
    dueDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Todo", todoSchema);
