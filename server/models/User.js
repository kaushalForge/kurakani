// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: false },
    bio: { type: String, default: "" },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    myRequests: [String],
    myFriends: [String],
    friendSuggestions: [String],
    profilePicture: {
      type: String,
      default:
        "https://i.pinimg.com/736x/13/74/20/137420f5b9c39bc911e472f5d20f053e.jpg",
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
