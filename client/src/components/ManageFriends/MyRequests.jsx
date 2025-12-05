import React, { useEffect } from "react";
import { X } from "lucide-react";
import Loader1 from "../UI/Loader/Loader1";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import { fetchMyRequests } from "../../redux/slices/userSlice";
import { cancelRequest } from "../../../utils/fetchData";

const MyRequests = () => {
  const dispatch = useDispatch();

  const { myRequests, loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchMyRequests());
  }, [dispatch]);

  const handleCancel = async (userId) => {
    const result = await cancelRequest(userId);
    if (result && result.status === 200) {
      toast.success("Request cancelled!");

      dispatch(fetchMyRequests());
    } else {
      toast.error("Failed to cancel request");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Loader1 />
      </div>
    );
  }

  if (!myRequests || myRequests.length === 0) {
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
          className="flex justify-between items-center p-3 rounded-2xl
          bg-[#0e162b]/60 backdrop-blur-md
          border border-blue-500/20
          hover:border-blue-400/40 transition-all duration-300"
        >
          <div className="flex items-center gap-3 text-white">
            <img
              src={user?.profilePicture}
              alt="profile"
              className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/30"
            />
            <div className="flex flex-col">
              <span className="font-medium text-lg">{user.username}</span>
              <span className="text-[#dfdfdf] text-sm">
                {user.bio || "No bio"}
              </span>
            </div>
          </div>

          <button
            onClick={() => handleCancel(user._id)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl
            bg-orange-600/20 hover:bg-orange-600/40
            border border-orange-500/20 hover:border-orange-500/40
            text-orange-400 transition-all duration-300"
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
