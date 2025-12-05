import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllUsers, fetchCurrentUser } from "../../redux/slices/userSlice";

const PeopleList = ({ searchTerm, chatFiltering }) => {
  const dispatch = useDispatch();
  const { allUsers, currentUser, loading } = useSelector((state) => state.user);

  const [activeChat, setActiveChat] = useState(null);

  // Fetch users & current user
  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  // Convert users into chat objects
  const chats = useMemo(() => {
    if (!allUsers) return [];

    return allUsers
      .filter((u) => u._id !== currentUser?._id) // don't show yourself
      .map((user) => ({
        id: user._id,
        name: user.username,
        msg: user.bio || "No bio",
        time: "Recently",
        online: true,
        type: "friend",
        img: user.profilePicture,
      }));
  }, [allUsers, currentUser]);

 
const filteredChats = useMemo(() => {
  return chats.filter((chat) => {
    // Check if current user is a friend
    const isFriend = currentUser?.myFriends?.map(id => id.toString()).includes(chat.id);

    // Match filter
    const matchesFilter =
      chatFiltering === "all" ? true : (chatFiltering === "friends" ? isFriend : chat.type === chatFiltering);

    // Match search
    const matchesSearch = chat.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });
}, [searchTerm, chatFiltering, chats, currentUser]);


  if (loading || !currentUser) {
    return <div className="text-gray-400 p-4">Loading users...</div>;
  }

  return (
    <div>
      {filteredChats.length === 0 && (
        <div className="text-gray-400 p-3">Not Found.</div>
      )}

      {filteredChats.map((chat, index) => (
        <div
          key={chat.id}
          onClick={() => setActiveChat(index)}
          className={`flex items-center justify-between p-3 cursor-pointer transition-all duration-200 ${
            activeChat === index
              ? "bg-[#2a3942] shadow-inner"
              : "hover:bg-[#1f2b32]"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full">
              <img
                src={chat.img}
                alt={chat.name}
                className="w-full h-full object-cover rounded-full"
              />

              {chat.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0c1418]"></span>
              )}
            </div>

            <div>
              <div className="text-[15px] font-semibold">{chat.name}</div>
              <div className="text-gray-400 text-[13px] truncate w-[160px]">
                {chat.msg}
              </div>
            </div>
          </div>

          <div className="text-[11px] text-gray-500">{chat.time}</div>
        </div>
      ))}
    </div>
  );
};

export default PeopleList;
