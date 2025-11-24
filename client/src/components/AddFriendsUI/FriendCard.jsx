import React from "react";

const FriendCard = ({ user, actionButton }) => {
  return (
    <div className="flex justify-between bg-[#1a1a1a] p-3 rounded-xl mb-2">
      <div className="flex items-center gap-3">
        <img src={user?.profilePicture} className="w-12 h-12 rounded-full" />
        {user.username}
      </div>
      {actionButton && actionButton()}
    </div>
  );
};

export default FriendCard;
