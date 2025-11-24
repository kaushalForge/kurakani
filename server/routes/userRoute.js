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
} from "../controllers/dataFlowController.js";
import {
  manageFriendRequest,
  acceptFriendRequest,
  cancelRequest,
} from "../controllers/requestManagingController.js";
import { isLoggedIn } from "../utils/authorization.js";
import { upload } from "../lib/multer.js";

const router = express.Router();

// fetch all Users
router.get("/", isLoggedIn, fetchAllUsers);

// fetch all Suggestions
router.get("/friend-suggestion", isLoggedIn, fetchAllSuggestions);

// fetch all Requests
router.get("/my-requests", isLoggedIn, fetchAllRequest);

// fetch all Friends
router.get("/linked-friends", isLoggedIn, fetchAllFriends);

// signUp User
router.post("/signup", signUpUser);

// signIn User
router.post("/signin", signInUser);

// update User
router.post("/update", upload.single("profilePicture"), isLoggedIn, updateUser);

// handle Friend Request Send
router.post("/send-request", manageFriendRequest);

// handle Friend Request Acceptance
router.post("/accept-request", acceptFriendRequest);

// handle Friend Request Cancellation
router.post("/cancel-request", cancelRequest);

export default router;
