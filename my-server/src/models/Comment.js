import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    content: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    todo: {
      type: Schema.Types.ObjectId,
      ref: "Todo",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Comment", commentSchema);
