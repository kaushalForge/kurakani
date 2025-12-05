import React, { useState, useEffect } from "react";
import { Search, UserPlus } from "lucide-react";
import Loader1 from "../UI/Loader/Loader1";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllUsers,
  fetchCurrentUser,
  sendRequest,
} from "../../redux/slices/userSlice";
import { toast } from "sonner";

const AddFriends = () => {
  const dispatch = useDispatch();
  const { allUsers, loading, currentUser } = useSelector((state) => state.user);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch all users and current user
  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (!allUsers || !currentUser) return;

    const list = allUsers
      .filter((u) => u._id.toString() !== currentUser._id.toString())
      .filter((u) =>
        search.trim() === ""
          ? true
          : u.username.toLowerCase().includes(search.toLowerCase())
      );

    setFilteredUsers(list);
  }, [search, allUsers, currentUser]);

  const handleSendRequest = (userId) => {
    dispatch(sendRequest(userId)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success(res.payload.data?.message || "Friend request sent!");
        dispatch(fetchCurrentUser());
      } else {
        toast.error(res.payload || "Failed to send request");
      }
    });
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
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0e162b]/50 backdrop-blur-md border border-blue-500/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            const userId = user._id.toString();
            const currentUserId = currentUser._id.toString();

            // Normalize arrays
            const currentFriends = (currentUser.myFriends || []).map((id) =>
              id.toString()
            );
            const userFriends = (user.myFriends || []).map((id) =>
              id.toString()
            );
            const currentRequests = (currentUser.myRequests || []).map((id) =>
              id.toString()
            );

            // Check if BOTH users have each other in myFriends
            const isFriend =
              currentUser.myFriends
                .map((id) => id.toString())
                .includes(user._id.toString()) &&
              user.myFriends
                .map((id) => id.toString())
                .includes(currentUser._id.toString());

            // Pending if current user sent a request
const isPending = currentUser.myRequests.map(id => id.toString()).includes(user._id.toString());

            let buttonText = "Add Friend";
            let buttonStyle =
              "flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/20 text-blue-400 transition-all duration-300";

            if (isFriend) {
              buttonText = "Friends";
              buttonStyle =
                "flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/30 border border-green-400/20 text-green-100 cursor-not-allowed";
            } else if (isPending) {
              buttonText = "Pending";
              buttonStyle =
                "flex items-center gap-2 px-3 py-2 rounded-xl bg-orange-500/30 border border-orange-400/20 text-orange-100 cursor-not-allowed";
            }

            return (
              <div
                key={userId}
                className="flex justify-between items-center p-3 rounded-2xl bg-[#0e162b]/60 backdrop-blur-md border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300"
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

                {isFriend || isPending ? (
                  <button disabled className={buttonStyle}>
                    {buttonText}
                  </button>
                ) : (
                  <button
                    onClick={() => handleSendRequest(userId)}
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
