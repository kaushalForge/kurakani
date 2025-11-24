// /controllers/requestManagingController.js
import User from "../models/User.js";
import dbConnect from "../lib/dbConnection.js";

// Send a friend request
export const manageFriendRequest = async (req, res) => {
  try {
    await dbConnect();
    const { requestFrom, requestTo } = req.body;
    if (!requestFrom || !requestTo) {
      return res.status(400).json({ message: "Unable to send request!" });
    }

    // 1️⃣ Add sender id to receiver's friendSuggestions
    await User.findByIdAndUpdate(
      requestTo,
      { $addToSet: { friendSuggestions: requestFrom } },
      { new: true }
    );

    // 2️⃣ Add receiver id to sender's myRequests
    await User.findByIdAndUpdate(
      requestFrom,
      { $addToSet: { myRequests: requestTo } },
      { new: true }
    );
    console.log("Request sent");
    return res.status(201).json({ message: "Request sent successfully" });
  } catch (error) {
    console.error("Error sending request:", error);
    return res.status(500).json({ message: "Error sending request" });
  }
};

// Accept a friend request
export const acceptFriendRequest = async (req, res) => {
  try {
    await dbConnect();
    const { requestFrom, requestTo } = req.body;
    console.log(requestFrom, requestTo);

    if (!requestFrom || !requestTo) {
      return res
        .status(400)
        .json({ message: "Missing requestFrom or requestTo" });
    }

    // 1️⃣ Remove sender ID from receiver's friendSuggestions and add to myFriends
    await User.findByIdAndUpdate(requestTo, {
      $pull: { friendSuggestions: requestFrom },
      $addToSet: { myFriends: requestFrom },
    });

    // 2️⃣ Remove receiver ID from sender's myRequests and add to myFriends
    await User.findByIdAndUpdate(requestFrom, {
      $pull: { myRequests: requestTo },
      $addToSet: { myFriends: requestTo },
    });
    return res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    console.error("Error accepting request:", error);
    return res.status(500).json({ message: "Error accepting request" });
  }
};

// Cancel a friend request
export const cancelRequest = async (req, res) => {
  try {
    await dbConnect();
    const { requestFrom, requestTo } = req.body;

    if (!requestFrom || !requestTo) {
      return res
        .status(400)
        .json({ message: "Missing requestFrom or requestTo" });
    }

    // Remove requestFrom from receiver's friendSuggestions
    await User.findByIdAndUpdate(requestTo, {
      $pull: { friendSuggestions: requestFrom },
    });

    // Remove requestTo from sender's myRequests
    await User.findByIdAndUpdate(requestFrom, {
      $pull: { myRequests: requestTo },
    });

    console.log("Cancelled request successfully");
    return res.status(200).json({ message: "Friend request canceled" });
  } catch (error) {
    console.error("Error canceling request:", error);
    return res.status(500).json({ message: "Error canceling request" });
  }
};
