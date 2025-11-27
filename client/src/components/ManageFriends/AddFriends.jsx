import React, { useState, useEffect } from "react";
import { Search, UserPlus } from "lucide-react";
import Loader1 from "../UI/Loader/Loader1";
import {
  fetchAllUsers,
  sendRequest,
  fetchCurrentUser,
} from "./fetch/fetchData";
import { toast } from "sonner";

const AddFriends = ({ token }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch current user and all users
  const fetchCurrentUserData = async () => {
    try {
      const user = await fetchCurrentUser();
      setCurrentUser(user);

      const users = await fetchAllUsers();
      const filtered = users.filter((u) => u._id !== user._id);
      setAllUsers(filtered);
      setFilteredUsers(filtered);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUserData();
  }, []);

  // Filter users based on search
  useEffect(() => {
    setFilteredUsers(
      allUsers.filter((u) =>
        u.username.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, allUsers]);

  // Send friend request (optimistic update)
  const handleSendRequest = async (userId) => {
    try {
      const res = await sendRequest(userId);

      if (res && (res.status === 201 || res.status === 200)) {
        toast.success(res.message || "Friend request sent!");

        // Update currentUser locally
        setCurrentUser((prev) => {
          // If the user is already a friend, no need to add to requests
          const alreadyFriend = (prev.myFriends || []).includes(userId);
          if (alreadyFriend) return prev;

          // If the request got accepted instantly (mutual), move userId from myRequests to myFriends
          const isMutual =
            res.message?.toLowerCase().includes("mutual") || false;
          if (isMutual) {
            return {
              ...prev,
              myRequests: (prev.myRequests || []).filter((id) => id !== userId),
              myFriends: [...(prev.myFriends || []), userId],
            };
          }

          // Otherwise, just add to myRequests
          return {
            ...prev,
            myRequests: [...(prev.myRequests || []), userId],
          };
        });
      } else {
        toast.error(res.message || "Failed to send request");
      }
    } catch (err) {
      console.error("Error sending request:", err);
      toast.error("Error sending request");
    }
  };

  if (loading || !currentUser) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Loader1 />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      {/* Search Bar */}
      <div className="relative mb-4">
        <Search
          size={20}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search users..."
          className="
            w-full pl-10 pr-4 py-2 rounded-xl
            bg-[#0e162b]/50 backdrop-blur-md
            border border-blue-500/20
            text-white placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-400
          "
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-400">
          No users found.
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto max-h-[80vh]">
          {filteredUsers.map((user) => {
            const isFriend = (currentUser.myFriends || []).includes(user._id);
            const requestSent = (currentUser.myRequests || []).includes(
              user._id
            );

            // Determine button text and style
            let buttonText = "Add Friend";
            let buttonStyle =
              "flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/20 text-blue-400 transition-all duration-300";

            if (isFriend) {
              buttonText = "Friends";
              buttonStyle =
                "flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/30 border border-green-400/20 text-green-100 cursor-not-allowed";
            } else if (requestSent) {
              buttonText = "Pending";
              buttonStyle =
                "flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-500/30 border border-orange-400/20 text-orange-100 cursor-not-allowed";
            }

            return (
              <div
                key={user._id}
                className="
                  flex justify-between items-center p-3 rounded-2xl
                  bg-[#0e162b]/60 backdrop-blur-md
                  border border-blue-500/20
                  hover:border-blue-400/40
                  transition-all duration-300
                "
              >
                <div className="flex items-center gap-3 text-white">
                  <img
                    src={user?.profilePicture}
                    alt="profile"
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/30"
                  />
                  <div>
                    <span className="font-medium text-lg">{user.username}</span>
                    <span className="text-[#dfdfdf] text-sm block">
                      {user.bio || "No bio"}
                    </span>
                  </div>
                </div>

                {/* Button */}
                {isFriend || requestSent ? (
                  <button disabled className={buttonStyle}>
                    {buttonText}
                  </button>
                ) : (
                  <button
                    onClick={() => handleSendRequest(user._id)}
                    className={buttonStyle}
                  >
                    <UserPlus size={18} />
                    <span className="text-sm font-medium">{buttonText}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AddFriends;
