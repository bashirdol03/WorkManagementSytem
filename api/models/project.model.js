import mongoose from "mongoose";

const { Schema } = mongoose;

const memberSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  });

const projectSchema = new Schema({
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
        default: "active"
      },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      members: [memberSchema],
    },
    {
      timestamps: true,
    })
      
export default mongoose.model("Project", projectSchema)