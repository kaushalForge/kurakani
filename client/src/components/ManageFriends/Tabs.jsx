import React from "react";

const Tabs = ({ activeTab, setActiveTab }) => {
  const tabs = ["friends", "addFriends", "requests", "suggestions"];

  return (
    <div className="flex items-center gap-3 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 rounded-lg ${
            activeTab === tab
              ? "bg-blue-600"
              : "bg-[#1f1f1f] border border-gray-700"
          }`}
        >
          {tab === "friends"
            ? "My Friends"
            : tab === "addFriends"
            ? "Add Friends"
            : tab === "requests"
            ? "My Requests"
            : "Suggestions"}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
