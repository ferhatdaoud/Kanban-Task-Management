import mongoose, { Schema } from "mongoose";
const roleSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    enum: ["owner", "editor", "viewer"],
  },
  description: {
    type: String,
    required: false,
    default: "",
  },
});

export default mongoose.model("Role", roleSchema);
