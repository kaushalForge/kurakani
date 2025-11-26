import express from "express";
import {
  signUpUser,
  signInUser,
  updateUser,
} from "../controllers/userController.js";
import {
  fetchAllUsers,
  fetchAllFriends,
  fetchAllSuggestions,
  fetchAllRequest,
  fetchCurrentUser,
} from "../controllers/dataFlowController.js";
import {
  manageFriendRequest,
  acceptFriendRequest,
  cancelRequest,
  unFriend,
} from "../controllers/requestManagingController.js";
import { isLoggedIn } from "../utils/authorization.js";
import { upload } from "../lib/multer.js";

const router = express.Router();

// CRUD User

// signUp User
router.post("/signup", signUpUser);

// signIn User
router.post("/signin", signInUser);

// update User
router.post("/update", upload.single("profilePicture"), isLoggedIn, updateUser);

// END CRUD User

// People Management

// fetch all Users
router.get("/", isLoggedIn, fetchAllUsers);

// fetch current User data
router.get("/current-user", isLoggedIn, fetchCurrentUser);

// fetch all Friends
router.get("/linked-friends", isLoggedIn, fetchAllFriends);

// fetch all Requests
router.get("/my-requests", isLoggedIn, fetchAllRequest);

// fetch all Suggestions
router.get("/friend-suggestion", isLoggedIn, fetchAllSuggestions);

// handle Friend Request Send
router.post("/send-request", isLoggedIn, manageFriendRequest);

// handle Friend Request Acceptance
router.post("/accept-request", isLoggedIn, acceptFriendRequest);

// handle Friend Request Cancellation
router.post("/cancel-request", cancelRequest);

// handle Delete Linked Friends
router.delete("/unFriend", isLoggedIn, unFriend);

export default router;
