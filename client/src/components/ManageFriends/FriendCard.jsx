import React from "react";
import { UserX } from "lucide-react";
import { toast } from "sonner";
import { unFriend } from "../../../utils/fetchData";

const FriendCard = ({ user, refreshFriends }) => {
  const handleUnfriend = () => {
    toast.custom(
      (t) => (
        <div className="flex flex-col gap-2 p-4 bg-[#0e162b] text-white rounded-xl shadow-md border border-blue-500/30">
          <span>Are you sure you want to unfriend!</span>
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                await unFriend(user._id);
                refreshFriends?.(); // <-- update friends list live
              }}
              className="px-3 py-1 rounded-xl bg-red-600 text-white hover:bg-red-500 transition-all"
            >
              OK, Proceed
            </button>

            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1 rounded-xl bg-gray-600 text-white hover:bg-gray-500 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "top-center",
        style: { border: "none", background: "transparent" },
      }
    );
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
          <span className="text-[#dfdfdf] text-sm">{user.bio || "No bio"}</span>
        </div>
      </div>

      {/* Unfriend Button */}
      <button
        onClick={handleUnfriend}
        className="
          flex items-center gap-2
          px-3 py-2 rounded-xl
          bg-red-600/20 hover:bg-red-600/40
          border border-red-500/20 hover:border-red-500/40
          text-red-400
          transition-all duration-300
        "
      >
        <UserX size={18} />
        <span className="text-sm font-medium">Unfriend</span>
      </button>
    </div>
  );
};

export default FriendCard;
