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

// Fetch all friends
export const fetchAllFriends = async (req, res) => {
  try {
    await dbConnect();

    const currentUserId = req.user.id;
    // Fetch current user document to get myFriends array
    const currentUser = await User.findById(currentUserId).select("myFriends");

    if (!currentUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Fetch friend details using the IDs in myFriends
    const friends = await User.find({
      _id: { $in: currentUser.myFriends },
    }).select("username profilePicture bio"); // exclude password

    res.status(200).json({
      success: true,
      friends,
    });
  } catch (error) {
    console.error("Error fetching friends:", error);
    res.status(500).json({ error: "Failed to fetch friends" });
  }
};

// Fetch all friend requests SENT TO ME
export const fetchAllRequest = async (req, res) => {
  try {
    await dbConnect();

    const currentUser = req.user.id.toString();

    // Find all users whose myRequests array includes myId
    const users = await User.findById(currentUser)
      .select("myRequests")
      .select("- password");

    return res.status(200).json({
      success: true,
      users: users.myRequests,
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
