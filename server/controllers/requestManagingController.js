// /controllers/requestManagingController.js
import User from "../models/User.js";
import dbConnect from "../lib/dbConnection.js";

// Send a friend request
export const manageFriendRequest = async (req, res) => {
  try {
    await dbConnect();
    const { requestFrom, requestTo } = req.body;

    if (!requestFrom || !requestTo) {
      return res.status(400).json({ message: "Invalid request!" });
    }

    const sender = await User.findById(requestFrom);
    const receiver = await User.findById(requestTo);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    // Convert IDs to strings
    const senderFriends = (sender.myFriends || []).map(String);
    const receiverFriends = (receiver.myFriends || []).map(String);
    const senderRequests = (sender.myRequests || []).map(String);
    const receiverRequests = (receiver.myRequests || []).map(String);
    const senderSuggestions = (sender.friendSuggestions || []).map(String);
    const receiverSuggestions = (receiver.friendSuggestions || []).map(String);

    // Already friends
    if (senderFriends.includes(requestTo)) {
      return res.status(200).json({ status: 201, message: "Already friends" });
    }

    // Check for reverse request
    const reverseRequestExists = receiverRequests.includes(requestFrom);

    if (reverseRequestExists) {
      await User.findByIdAndUpdate(requestFrom, {
        $addToSet: { myFriends: requestTo },
        $pull: { myRequests: requestTo, friendSuggestions: requestTo },
      });

      await User.findByIdAndUpdate(requestTo, {
        $addToSet: { myFriends: requestFrom },
        $pull: { myRequests: requestFrom, friendSuggestions: requestFrom },
      });

      const updatedSender = await User.findById(requestFrom);
      const updatedReceiver = await User.findById(requestTo);

      return res.status(200).json({
        status: 201,
        message: "Mutual request accepted. You are now friends!",
      });
    }

    // Normal request
    if (!receiverSuggestions.includes(requestFrom)) {
      await User.findByIdAndUpdate(requestTo, {
        $addToSet: { friendSuggestions: requestFrom },
      });
    }

    if (!senderRequests.includes(requestTo)) {
      await User.findByIdAndUpdate(requestFrom, {
        $addToSet: { myRequests: requestTo },
      });
    }

    const updatedSender = await User.findById(requestFrom);
    const updatedReceiver = await User.findById(requestTo);

    return res.status(201).json({
      message: "Friend request sent successfully",
      status: 201,
    });
  } catch (error) {
    console.error("Error managing friend request:", error);
    return res.status(500).json({ message: "Error sending request" });
  }
};

// Accept a friend request
export const acceptFriendRequest = async (req, res) => {
  try {
    await dbConnect();
    const { requestFrom, requestTo } = req.body;

    if (!requestFrom || !requestTo) {
      return res
        .status(400)
        .json({ message: "Missing requestFrom or requestTo" });
    }

    // 1️⃣ Update receiver (requestTo)
    await User.findByIdAndUpdate(requestTo, {
      $pull: {
        friendSuggestions: requestFrom, // remove sender from suggestions
        myRequests: requestFrom, // remove sender from requests (if exists)
      },
      $addToSet: { myFriends: requestFrom }, // add sender to friends
    });

    // 2️⃣ Update sender (requestFrom)
    await User.findByIdAndUpdate(requestFrom, {
      $pull: {
        friendSuggestions: requestTo, // remove receiver from suggestions (if exists)
        myRequests: requestTo, // remove receiver from requests (if exists)
      },
      $addToSet: { myFriends: requestTo },
    });

    return res
      .status(200)
      .json({ message: "Friend request accepted successfully" });
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

    // 1️⃣ Remove sender from receiver's friendSuggestions & myRequests (if exists)
    await User.findByIdAndUpdate(requestTo, {
      $pull: {
        friendSuggestions: requestFrom,
        myRequests: requestFrom, // just in case
      },
    });

    // 2️⃣ Remove receiver from sender's friendSuggestions & myRequests
    await User.findByIdAndUpdate(requestFrom, {
      $pull: {
        friendSuggestions: requestTo,
        myRequests: requestTo,
      },
    });

    return res
      .status(200)
      .json({ status: 200, message: "Friend request canceled" });
  } catch (error) {
    console.error("Error canceling request:", error);
    return res.status(500).json({ message: "Error canceling request" });
  }
};

// Delete a linked friend
export const unFriend = async (req, res) => {
  try {
    await dbConnect();

    const { requestFrom, requestTo } = req.body;

    if (!requestFrom || !requestTo) {
      return res.status(400).json({
        success: false,
        message: "Missing requestFrom or requestTo",
      });
    }

    if (requestFrom === requestTo) {
      return res.status(400).json({
        success: false,
        message: "Cannot unfriend yourself",
      });
    }

    // Update the first user
    const userFromUpdate = await User.findByIdAndUpdate(
      requestFrom,
      {
        $pull: {
          myFriends: requestTo,
          friendSuggestions: requestTo,
          myRequests: requestTo,
        },
      },
      { new: true }
    );

    // Update the second user
    const userToUpdate = await User.findByIdAndUpdate(
      requestTo,
      {
        $pull: {
          myFriends: requestFrom,
          friendSuggestions: requestFrom,
          myRequests: requestFrom,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Users have been unfriended successfully",
      userFrom: userFromUpdate,
      userTo: userToUpdate,
    });
  } catch (error) {
    console.error("Error unfriending users:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while unfriending",
    });
  }
};
