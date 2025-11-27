import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Loader1 from "../UI/Loader/Loader1";
import {
  fetchMyRequests,
  cancelRequest,
  fetchCurrentUser,
} from "./fetch/fetchData";
import { toast } from "sonner";

const MyRequests = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [myRequests, setMyRequests] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchCurrentUserData = async () => {
    try {
      setLoading(true);

      const user = await fetchCurrentUser();
      setCurrentUser(user);

      const users = await fetchMyRequests();
      setMyRequests(users);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUserData();
  }, []);

  const handleCancel = async (userId) => {
    setMyRequests((prev) => prev.filter((u) => u._id !== userId));

    try {
      const res = await cancelRequest(userId);
      if (res && res.status === 200) {
        toast.success(res.message || "Request cancelled!");
      } else {
        toast.error(res.message || "Failed to cancel request");
        fetchCurrentUserData();
      }
    } catch (err) {
      console.error(err);
      toast.error("Error cancelling request");

      // ❗ Also restore if error
      fetchCurrentUserData();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Loader1 />
      </div>
    );
  }

  if (myRequests.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <p className="text-gray-400 text-center">No sent requests.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 space-y-3 overflow-y-auto max-h-[80vh]">
      {myRequests.map((user) => (
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
          <div className="flex items-center gap-3 text-white overflow-hidden">
            <img
              src={user?.profilePicture}
              alt="profile"
              className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/30"
            />
            <div className="flex flex-col gap-1">
              <span className="font-medium text-lg">{user.username}</span>
              <span className="text-[#dfdfdf] text-sm">
                {user.bio || "No bio"}
              </span>
            </div>
          </div>

          {/* CANCEL BUTTON — NO DISABLE, NO CANCELLING TEXT */}
          <button
            onClick={() => handleCancel(user._id)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl
              bg-orange-600/20 hover:bg-orange-600/40
              border border-orange-500/20 hover:border-orange-500/40
              text-orange-400 transition-all duration-300
            "
          >
            <X size={18} />
            <span className="text-sm font-medium">Cancel</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default MyRequests;
