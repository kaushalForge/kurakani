import React, { useState, useEffect } from "react";
import Loader1 from "../UI/Loader/Loader1";
import SuggestionCard from "./SuggestionCard";
import { fetchFriendSuggestions } from "./fetch/fetchData";

const FriendSuggestions = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);

  // Fetch suggestions
  const loadSuggestions = async () => {
    try {
      const data = await fetchFriendSuggestions();
      setSuggestions(data || []);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    loadSuggestions();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Loader1 />
      </div>
    );
  }

  if (suggestions.length === 0) {
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
      {suggestions.map((friend) => (
        <SuggestionCard
          key={friend._id}
          user={friend}
          refreshAll={loadSuggestions} // <-- live update after action
          setMySentRequests={(fn) => {}} // optional, if used in SuggestionCard
        />
      ))}
    </div>
  );
};

export default FriendSuggestions;
