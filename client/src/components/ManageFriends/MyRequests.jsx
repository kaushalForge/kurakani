import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Loader1 from "../UI/Loader/Loader1";
import { fetchMyRequests, cancelRequest } from "./fetch/fetchData";
import { toast } from "sonner";

const MyRequests = ({ token }) => {
  const [loading, setLoading] = useState(true);
  const [myRequests, setMyRequests] = useState([]);
  const [cancelingIds, setCancelingIds] = useState([]);

  // Function to fetch requests
  const loadMyRequests = async () => {
    try {
      setLoading(true);
      const res = await fetchMyRequests();
      setMyRequests(res || []);
    } catch (err) {
      console.error("Error fetching requests:", err);
      toast.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  // Fetch requests on mount
  useEffect(() => {
    if (!token) return;
    loadMyRequests();
  }, [token]);

  // Cancel a sent request
  const handleCancel = async (userId) => {
    try {
      setCancelingIds((prev) => [...prev, userId]); // mark as canceling
      const res = await cancelRequest(userId);

      if (res.status === 200 || res.status === 201) {
        toast.success(res.message || "Request cancelled!");

        // ✅ Live update: remove the cancelled request immediately
        setMyRequests(await fetchMyRequests());
      } else {
        toast.error(res.message || "Failed to cancel request");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error cancelling request");
    } finally {
      setCancelingIds((prev) => prev.filter((id) => id !== userId));
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
          {/* User Info */}
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

          {/* Cancel Button */}
          <button
            onClick={() => handleCancel(user._id)}
            disabled={cancelingIds.includes(user._id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl
              ${
                cancelingIds.includes(user._id)
                  ? "bg-orange-500/50 cursor-not-allowed"
                  : "bg-orange-600/20 hover:bg-orange-600/40"
              }
              border border-orange-500/20 hover:border-orange-500/40
              text-orange-400 transition-all duration-300
            `}
          >
            <X size={18} />
            <span className="text-sm font-medium">
              {cancelingIds.includes(user._id) ? "Cancelling..." : "Cancel"}
            </span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default MyRequests;
