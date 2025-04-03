import mongoose from "mongoose";

const { Schema } = mongoose;

const taskSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
        default: "pending",
      },
      project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
      assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      attachments: {
        type: Array,
        default : []
      },
    },
    { timestamps: true }
  );

  export default mongoose.model("Task", taskSchema) 