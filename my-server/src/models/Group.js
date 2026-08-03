import mongoose, { Schema } from "mongoose";

const groupSchema = new Schema(
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
    position: {
      type: Number,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Group", groupSchema);
