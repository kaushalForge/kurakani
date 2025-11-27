import User from "../models/User.js";
import dbConnect from "../lib/dbConnection.js";

// Fetch all users
export const fetchAllUsers = async (req, res) => {
  try {
    await dbConnect();
    const users = await User.find().select("-password");
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Fetch current user data
export const fetchCurrentUser = async (req, res) => {
  try {
    await dbConnect();
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ currentUser: user });
  } catch (err) {
    console.error("Error fetching current user:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch all friends
export const fetchAllFriends = async (req, res) => {
  try {
    await dbConnect();

    if (!req.user || !req.user._id) {
      return res
        .status(400)
        .json({ success: false, message: "User not authenticated" });
    }

    const currentUserId = req.user._id.toString();

    // Fetch current user's myFriends array
    const currentUser = await User.findById(currentUserId).select("myFriends");

    if (!currentUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!currentUser.myFriends || currentUser.myFriends.length === 0) {
      return res.status(200).json({ success: true, friends: [] });
    }

    // Fetch friend details using IDs in myFriends
    const friends = await User.find({
      _id: { $in: currentUser.myFriends },
    }).select("username profilePicture bio _id");

    return res.status(200).json({
      success: true,
      friends,
    });
  } catch (error) {
    console.error("Error fetching friends:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch friends" });
  }
};
// Fetch all friend requests SENT TO ME
export const fetchAllRequest = async (req, res) => {
  try {
    await dbConnect();
    const currentUser = req.user;

    if (!currentUser || !currentUser._id) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    // Get current user's myRequests array
    const userData = await User.findById(currentUser._id).select("myRequests");

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Fetch full info of users in myRequests
    const requests = await User.find({
      _id: { $in: userData.myRequests },
    }).select("-password");

    return res.status(200).json({
      success: true,
      status: 201,
      myRequests: requests,
    });
  } catch (err) {
    console.error("Fetch Requests Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// Fetch all suggestions (people NOT connected to me)
export const fetchAllSuggestions = async (req, res) => {
  try {
    await dbConnect();
    const currentUserId = req.user.id;
    // Fetch current user document to get myFriends array
    const currentUser = await User.findById(currentUserId).select(
      "friendSuggestions"
    );

    if (!currentUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Fetch current user
    const suggestions = await User.find({
      _id: { $in: currentUser.friendSuggestions },
    }).select("username profilePicture bio");

    return res.status(200).json({
      success: true,
      suggestions,
    });
  } catch (err) {
    console.error("Fetch Suggestions Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
