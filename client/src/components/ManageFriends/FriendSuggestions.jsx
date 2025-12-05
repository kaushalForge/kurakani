import React, { useEffect } from "react";
import Loader1 from "../UI/Loader/Loader1";
import SuggestionCard from "./SuggestionCard";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSuggestions,
  sendRequest,
  acceptRequest,
  cancelRequest,
} from "../../redux/slices/userSlice";

const FriendSuggestions = () => {
  const dispatch = useDispatch();
  const { mySuggestions, loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchSuggestions());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Loader1 />
      </div>
    );
  }

  if (!mySuggestions || mySuggestions.length === 0) {
    return (
      <div className="min-h-screen">
        <p className="text-gray-400 text-center mt-10">
          No friend suggestions.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 overflow-y-auto space-y-3">
      {mySuggestions.map((friend) => (
        <SuggestionCard
          key={friend._id}
          user={friend}
          // Redux-based live updates for actions
          sendRequest={() => dispatch(sendRequest(friend._id))}
          acceptRequest={() => dispatch(acceptRequest(friend._id))}
          cancelRequest={() => dispatch(cancelRequest(friend._id))}
          refreshAll={() => dispatch(fetchSuggestions())}
        />
      ))}
    </div>
  );
};

export default FriendSuggestions;
