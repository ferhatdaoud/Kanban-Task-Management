import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    content: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Comment", commentSchema);
