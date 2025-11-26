// utils/fetchData.js
import axios from "axios";
import { toast } from "sonner";

const BASE_URL = import.meta.env.VITE_API_URL; // keep as-is

// --------------------------------------------
// TOKEN + CURRENT USER
// --------------------------------------------
const getToken = () => localStorage.getItem("token");
const getCurrentUser = () => JSON.parse(localStorage.getItem("user"));

//
// ============================================
//              FETCH FUNCTIONS
// ============================================
//

// 🔹 Fetch All Users
export const fetchAllUsers = async () => {
  const token = getToken();
  const res = await axios.get(`${BASE_URL}/api/user`, {
    headers: { authorization: token },
  });
  return res.data.users;
};

// Fetch Current User
export const fetchCurrentUser = async () => {
  const token = getToken();
  const currentUser = getCurrentUser();

  if (!currentUser?._id) throw new Error("No current user in localStorage");

  const res = await axios.get(`${BASE_URL}/api/user/current-user`, {
    headers: { authorization: token },
    params: { userId: currentUser._id },
  });
  return res.data.currentUser;
};

// 🔹 Fetch Linked Friends
export const fetchFriends = async () => {
  const token = getToken();
  const res = await axios.get(`${BASE_URL}/api/user/linked-friends`, {
    headers: { authorization: token },
  });
  return res.data.friends;
};

// 🔹 Fetch My Requests
export const fetchMyRequests = async () => {
  const token = getToken();
  const res = await axios.get(`${BASE_URL}/api/user/my-requests`, {
    headers: { authorization: token },
  });
  return res.data.myRequests;
};

// 🔹 Fetch Friend Suggestions
export const fetchFriendSuggestions = async () => {
  const token = getToken();
  const res = await axios.get(`${BASE_URL}/api/user/friend-suggestion`, {
    headers: { authorization: token },
  });
  return res.data.suggestions;
};

//
// ============================================
//              ACTION FUNCTIONS
// ============================================
//

// 🔹 Send Request
export const sendRequest = async (userId) => {
  const token = getToken();
  const currentUser = getCurrentUser();
  const res = await axios.post(
    `${BASE_URL}/api/user/send-request`,
    {
      requestFrom: currentUser._id,
      requestTo: userId,
    },
    {
      headers: { authorization: token },
    }
  );
  return res.data;
};

// 🔹 Accept Request
export const acceptRequest = async (userId) => {
  const token = getToken();
  const currentUser = getCurrentUser();
  const res = await axios.post(
    `${BASE_URL}/api/user/accept-request`,
    {
      requestFrom: currentUser._id,
      requestTo: userId,
    },
    {
      headers: { authorization: token },
    }
  );
  if (res.status === 200) {
    await refreshAllData();
  }
  return res.data;
};

// 🔹 Cancel Request
export const cancelRequest = async (userId) => {
  const token = getToken();
  const currentUser = getCurrentUser();
  const res = await axios.post(
    `${BASE_URL}/api/user/cancel-request`,
    {
      requestFrom: currentUser._id,
      requestTo: userId,
    },
    {
      headers: { authorization: token },
    }
  );
  refreshMyRequests();
  return res.data;
};

// 🔹 Unfriend
export const unFriend = async (userId) => {
  const token = getToken();
  const currentUser = getCurrentUser();
  try {
    const res = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/user/unFriend`,
      {
        data: {
          requestFrom: currentUser._id,
          requestTo: userId,
        },
        headers: { authorization: token },
      }
    );

    if (res.data.status === 200) {
      await fetchAllData();
    } else {
      console.error(res.data.message || "Failed to unfriend");
    }
  } catch (error) {
    console.error("Unfriend error:", error);
  }
};

//
// ============================================
//            MASTER FETCHER
// ============================================
//

export const fetchAllData = async () => {
  try {
    const [currentUser, friends, myRequests, friendSuggestions, allUsers] =
      await Promise.all([
        fetchCurrentUser(),
        fetchFriends(),
        fetchMyRequests(),
        fetchFriendSuggestions(),
        fetchAllUsers(),
      ]);

    return {
      currentUser,
      friends,
      myRequests,
      friendSuggestions,
      allUsers,
    };
  } catch (err) {
    console.error("Error fetching all data:", err);
    return null;
  }
};

//
// ============================================
//              REFRESH HELPERS
// ============================================
//

export const refreshAllData = async () => await fetchAllData();
export const refreshCurrentUser = async () => await fetchCurrentUser();
export const refreshFriends = async () => await fetchFriends();
export const refreshMyRequests = async () => await fetchMyRequests();
export const refreshFriendSuggestions = async () =>
  await fetchFriendSuggestions();
export const refreshAllUsers = async () => await fetchAllUsers();
