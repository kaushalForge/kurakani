import React, { useEffect } from "react";
import Loader1 from "../UI/Loader/Loader1";
import FriendCard from "./FriendCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyFriends, unFriend } from "../../redux/slices/userSlice";

const LinkedFriends = () => {
  const dispatch = useDispatch();
  const { myFriends, loading } = useSelector((state) => state.user);

  // Fetch friends from slice
  useEffect(() => {
    dispatch(fetchMyFriends());
  }, [dispatch]);

  // Unfriend action using Redux
  const handleUnFriend = (userId) => {
    dispatch(unFriend(userId)).then(() => {
      dispatch(fetchMyFriends()); // refresh live list after unfriend
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Loader1 />
      </div>
    );
  }

  if (!myFriends || myFriends.length === 0) {
    return (
      <div className="min-h-screen p-4">
        <p className="text-gray-400 text-center mt-10">No connected friends.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 overflow-y-auto space-y-3">
      {myFriends.map((friend) => (
        <FriendCard
          key={friend._id}
          user={friend}
          refreshFriends={() => dispatch(fetchMyFriends())}
          unFriend={() => handleUnFriend(friend._id)}
        />
      ))}
    </div>
  );
};

export default LinkedFriends;
