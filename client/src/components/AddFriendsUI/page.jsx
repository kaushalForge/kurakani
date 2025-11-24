import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Check } from "lucide-react";

import Tabs from "./Tabs";
import FriendCard from "./FriendCard";

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

  const sendRequest = async (friendId) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/send-request`,
        { requestFrom: currentUser._id, requestTo: friendId }
      );
      setMySentRequests((prev) => [...prev, friendId]);
    } catch (err) {
      console.log(err);
    }
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
    <div className="min-h-screen bg-[#121212] text-white p-5">
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Friends */}
      {activeTab === "friends" &&
        (friends.length === 0 ? (
          <p>No friends</p>
        ) : (
          friends.map((f) => (
            <FriendCard
              key={f._id}
              user={f}
              actionButton={() => <Check className="text-green-500" />}
            />
          ))
        ))}

      {/* Add Friends */}
      {activeTab === "addFriends" && (
        <>
          <h2 className="text-2xl font-bold mb-4">Add Friends</h2>
          <div className="flex items-center gap-3 bg-[#1f1f1f] rounded-full px-4 py-2 border border-gray-700 mb-4">
            <Search />
            <input
              className="bg-transparent outline-none w-full"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users..."
            />
          </div>
          {addFriendsList
            .filter((u) =>
              u.username.toLowerCase().includes(query.toLowerCase())
            )
            .map((user) => (
              <FriendCard
                key={user._id}
                user={user}
                actionButton={() => (
                  <button
                    onClick={() => sendRequest(user._id)}
                    className="bg-gray-700 px-4 py-1 rounded-full"
                  >
                    Add
                  </button>
                )}
              />
            ))}
        </>
      )}

      {/* My Requests */}
      {activeTab === "requests" &&
        (myRequestsList.length === 0 ? (
          <p>No requests sent</p>
        ) : (
          myRequestsList.map((u) => (
            <FriendCard
              key={u._id}
              user={u}
              actionButton={() => (
                <button
                  onClick={() => cancelRequest(u._id)}
                  className="bg-red-600 px-4 py-1 rounded-full"
                >
                  Cancel
                </button>
              )}
            />
          ))
        ))}

      {/* Suggestions */}
      {activeTab === "suggestions" &&
        (suggestions.length === 0 ? (
          <p>No incoming requests</p>
        ) : (
          suggestions.map((u) => (
            <FriendCard
              key={u._id}
              user={u}
              actionButton={() => (
                <div className="flex gap-2">
                  <button
                    onClick={() => acceptRequest(u._id)}
                    className="bg-blue-600 px-3 py-1 rounded"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => cancelRequest(u._id)}
                    className="bg-red-600 px-3 py-1 rounded"
                  >
                    Decline
                  </button>
                </div>
              )}
            />
          ))
        ))}
    </div>
  );
};

export default FriendManagement;
