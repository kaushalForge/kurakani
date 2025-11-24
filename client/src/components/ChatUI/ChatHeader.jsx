import React, { useEffect, useState, useRef } from "react";
import { Phone, Video, MoreVertical } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const ChatHeader = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [token, setToken] = useState(null);
  const menuRef = useRef();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    setToken(storedToken || null);

    if (!storedUser) {
      navigate("/sign-in");
      return;
    }

    setUser(JSON.parse(storedUser));
  }, [navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    navigate("/sign-in");
  };

  if (!user) return null;

  return (
    <div className="w-full h-full bg-[#2C2C2C] flex items-center px-4 justify-between sticky top-0 z-10">
      {/* Left Section */}
      <div className="flex items-center gap-2">
        <img
          src={
            user.profilePicture ||
            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=687&auto=format&fit=crop"
          }
          alt={user.username}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <span className="text-white font-semibold">{user.username}</span>
          <span className="text-gray-400 text-xs">Online</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex relative items-center gap-4 text-gray-300">
        {/* Dummy Other User */}
        <div className="flex items-center gap-2">
          <img
            src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=764&auto=format&fit=crop"
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex flex-col">
            <span className="text-white font-semibold">Avatar</span>
            <span className="text-gray-400 text-xs">Offline</span>
          </div>
        </div>

        {/* Menu */}
        <div ref={menuRef} className="relative">
          <MoreVertical
            className="w-5 h-5 cursor-pointer hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          />

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded shadow-lg z-20">
              {token ? (
                <>
                  <button
                    className="w-full px-4 py-2 text-left hover:bg-gray-700"
                    onClick={() => alert("Settings clicked")}
                  >
                    Settings
                  </button>

                  {/* Update Profile */}
                  <button
                    className="w-full px-4 py-2 text-left hover:bg-gray-700"
                    onClick={() => {
                      navigate("/update-profile");
                      setMenuOpen(false);
                    }}
                  >
                    Update
                  </button>

                  {/* Sign Out */}
                  <button
                    className="w-full px-4 py-2 text-left hover:bg-gray-700"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="w-full px-4 py-2 text-left hover:bg-gray-700"
                    onClick={() => navigate("/sign-in")}
                  >
                    Sign In
                  </button>

                  <button
                    className="w-full px-4 py-2 text-left hover:bg-gray-700"
                    onClick={() => navigate("/sign-up")}
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
