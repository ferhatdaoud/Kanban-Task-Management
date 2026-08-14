import mongoose, { Schema } from "mongoose";

const boardSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
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
    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        role: { type: Schema.Types.ObjectId, ref: "Role", required: true },
      },
    ],
    position: {
      type: Number,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Board", boardSchema);
