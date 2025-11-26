import React from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { acceptRequest, cancelRequest } from "./fetch/fetchData";

const SuggestionCard = ({ user, refreshAll, setSuggestions, suggestions }) => {
  // Accept friend request
  const handleAcceptRequest = async () => {
    try {
      await acceptRequest(user._id);
      toast.success("Friend request accepted!");
      // Remove the accepted user from suggestions immediately
      setSuggestions?.(suggestions.filter((u) => u._id !== user._id));
      refreshAll?.(); // optional: refresh other data if needed
    } catch (err) {
      console.error(err);
      toast.error("Failed to accept request.");
    }
  };

  // Cancel friend request
  const handleCancelRequest = async () => {
    try {
      await cancelRequest(user._id);
      toast.success("Friend request canceled!");
      // Remove the canceled user from suggestions immediately
      setSuggestions?.(suggestions.filter((u) => u._id !== user._id));
      refreshAll?.(); // optional: refresh other data if needed
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel request.");
    }
  };

  return (
    <div
      className="
        flex justify-between items-center p-3 rounded-2xl mb-3
        bg-[#0e162b]/60 backdrop-blur-md
        border border-blue-500/20
        hover:border-blue-400/40
        transition-all duration-300
      "
    >
      {/* User Info */}
      <div className="flex items-center gap-3 text-white overflow-hidden">
        <img
          src={user?.profilePicture}
          alt="profile"
          className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/30"
        />
        <div className="flex flex-col gap-1">
          <span className="font-medium text-lg">{user.username}</span>
          <span className="text-[#dfdfdf] text-sm">{user.bio || "bio"}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleAcceptRequest}
          className="
            flex items-center gap-2
            px-3 py-2 rounded-xl
            bg-green-600/20 hover:bg-green-600/40
            border border-green-500/20 hover:border-green-500/40
            text-green-400
            transition-all duration-300
          "
        >
          <Check size={18} />
          <span className="text-sm font-medium">Accept</span>
        </button>

        <button
          onClick={handleCancelRequest}
          className="
            flex items-center gap-2
            px-3 py-2 rounded-xl
            bg-red-600/20 hover:bg-red-600/40
            border border-red-500/20 hover:border-red-500/40
            text-red-400
            transition-all duration-300
          "
        >
          <X size={18} />
          <span className="text-sm font-medium">Cancel</span>
        </button>
      </div>
    </div>
  );
};

export default SuggestionCard;
