// models/Message.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: {
        type: String,
        enum: ["text", "image", "video", "voiceMessage", "document"],
        required: true,
      },
      text: { type: String },
      image: { type: String },
      video: { type: String },
      voiceMessage: { type: String },
      document: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Message ||
  mongoose.model("Message", messageSchema);
