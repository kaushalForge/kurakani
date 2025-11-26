import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Check } from "lucide-react";

import Tabs from "./Tabs";
import FriendCard from "./FriendCard";

import LinkedFriends from "./LinkedFriends";
import FriendSuggestions from "./FriendSuggestions";
import MyRequests from "./MyRequests";
import AddFriends from "./AddFriends";

const FriendManagement = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [friends, setFriends] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [mySentRequests, setMySentRequests] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [token, setToken] = useState("");
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("friends");

  // Load user & token
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) setCurrentUser(user);
    if (token) setToken(token);
  }, []);

  // Fetch all data
  useEffect(() => {
    if (!currentUser) return;
    refreshAll();
  }, [currentUser]);

  const fetchFriends = async () => {
    try {
      ``;
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/linked-friends`,
        { headers: { authorization: token } }
      );
      setFriends(res.data.friends || []);
    } catch (err) {
      console.log("Friends Error:", err);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/friend-suggestion`,
        { headers: { authorization: token } }
      );
      const filtered = res.data.suggestions.filter(
        (u) => !friends.some((f) => f._id === u._id)
      );
      setSuggestions(filtered || []);
    } catch (err) {
      console.log("Suggestions Error:", err);
    }
  };

  const fetchMyRequests = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/my-requests`,
        { headers: { authorization: token } }
      );
      setMySentRequests(res.data.requests || []);
    } catch (err) {
      console.log("My Requests Error:", err);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user`, {
        headers: { authorization: token },
      });
      setAllUsers(res.data.users || []);
    } catch (err) {
      console.log("Users Error:", err);
    }
  };

  const refreshAll = () => {
    fetchFriends();
    fetchSuggestions();
    fetchMyRequests();
    fetchAllUsers();
  };

  const cancelRequest = async (friendId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/cancel-request`,
        { requestFrom: currentUser._id, requestTo: friendId }
      );
      setMySentRequests((prev) => prev.filter((id) => id !== friendId));
      refreshAll();
    } catch (err) {
      console.log(err);
    }
  };

  const acceptRequest = async (friendId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/accept-request`,
        { requestFrom: currentUser._id, requestTo: friendId }
      );
      refreshAll();
    } catch (err) {
      console.log(err);
    }
  };

  // Filtered lists
  const addFriendsList = allUsers.filter(
    (u) =>
      u._id !== currentUser?._id &&
      !friends.some((f) => f._id === u._id) &&
      !mySentRequests.includes(u._id)
  );

  const myRequestsList = allUsers.filter((u) => mySentRequests.includes(u._id));

  return (
    <div className="min-h-screen w-full bg-[#070b16] text-white p-4 space-y-6">
      {/* Tab Selector */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => setActiveTab("friends")}
          className={`px-4 py-2 rounded-xl transition-all duration-300 ${
            activeTab === "friends"
              ? "bg-blue-600/30 border border-blue-400/40"
              : "bg-[#0e162b]/40 border border-blue-500/20 hover:bg-blue-600/20"
          }`}
        >
          My Friends
        </button>

        <button
          onClick={() => setActiveTab("suggestions")}
          className={`px-4 py-2 rounded-xl transition-all duration-300 ${
            activeTab === "suggestions"
              ? "bg-blue-600/30 border border-blue-400/40"
              : "bg-[#0e162b]/40 border border-blue-500/20 hover:bg-blue-600/20"
          }`}
        >
          Suggestions
        </button>

        <button
          onClick={() => setActiveTab("addFriends")}
          className={`px-4 py-2 rounded-xl transition-all duration-300 ${
            activeTab === "addFriends"
              ? "bg-blue-600/30 border border-blue-400/40"
              : "bg-[#0e162b]/40 border border-blue-500/20 hover:bg-blue-600/20"
          }`}
        >
          Add Friends
        </button>

        <button
          onClick={() => setActiveTab("requests")}
          className={`px-4 py-2 rounded-xl transition-all duration-300 ${
            activeTab === "requests"
              ? "bg-blue-600/30 border border-blue-400/40"
              : "bg-[#0e162b]/40 border border-blue-500/20 hover:bg-blue-600/20"
          }`}
        >
          My Requests
        </button>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {activeTab === "friends" && (
          <section className="bg-[#0e162b]/50 backdrop-blur-md border border-blue-500/20 rounded-2xl p-4">
            <h2 className="text-xl font-semibold text-blue-400 mb-3">
              My Friends
            </h2>
            <LinkedFriends token={token} currentUser={currentUser} />
          </section>
        )}

        {activeTab === "suggestions" && (
          <section className="bg-[#0e162b]/50 backdrop-blur-md border border-blue-500/20 rounded-2xl p-4">
            <h2 className="text-xl font-semibold text-blue-400 mb-3">
              Suggestions for you
            </h2>
            <FriendSuggestions token={token} currentUser={currentUser} />
          </section>
        )}

        {activeTab === "addFriends" && (
          <section className="bg-[#0e162b]/50 backdrop-blur-md border border-blue-500/20 rounded-2xl p-4">
            <h2 className="text-xl font-semibold text-blue-400 mb-3">
              Add Friends
            </h2>
            <AddFriends token={token} currentUser={currentUser} />
          </section>
        )}

        {activeTab === "requests" && (
          <section className="bg-[#0e162b]/50 backdrop-blur-md border border-blue-500/20 rounded-2xl p-4">
            <h2 className="text-xl font-semibold text-blue-400 mb-3">
              My Requests
            </h2>
            <MyRequests token={token} currentUser={currentUser} />
          </section>
        )}
      </div>
    </div>
  );
};

export default FriendManagement;
