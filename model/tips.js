import mongoose from "mongoose";

const tipsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    amount: {
      type: Number,
      required: true,
      min: 1
    },
    message: {
      type: String,
      lowercase: true,
      trim: true,
      default: ""
    },
    channelName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const Tips = mongoose.model("Tips", tipsSchema);

export default Tips;
