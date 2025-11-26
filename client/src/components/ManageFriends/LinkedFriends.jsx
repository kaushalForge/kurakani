import React, { useState, useEffect } from "react";
import Loader1 from "../UI/Loader/Loader1";
import FriendCard from "./FriendCard";
import { fetchFriends } from "./fetch/fetchData";

const LinkedFriends = ({ token, currentUser }) => {
  const [loading, setLoading] = useState(true);
  const [myFriends, setMyFriends] = useState([]);

  // Fetch friends
  const loadFriends = async () => {
    try {
      const friends = await fetchFriends();
      setMyFriends(friends || []);
    } catch (err) {
      console.error("Error fetching friends:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    loadFriends();
  }, [token]);

  return (
    <div className="min-h-screen p-4">
      {loading ? (
        <div className="flex items-center justify-center w-full h-screen">
          <Loader1 />
        </div>
      ) : myFriends.length === 0 ? (
        <p className="text-gray-400 text-center mt-10">No connected friends.</p>
      ) : (
        <div className="overflow-y-auto space-y-3">
          {myFriends.map((friend) => (
            <FriendCard
              key={friend._id}
              user={friend}
              refreshFriends={loadFriends}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LinkedFriends;
