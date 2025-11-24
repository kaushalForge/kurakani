// components/ChatUI/page.jsx
import React from "react";
import ChatHeader from "./ChatHeader";
import ChatFooter from "./ChatFooter";
import Chat from "./Chat";

const Page = () => {
  return (
    <div className="w-full flex flex-col h-screen bg-[#2C2C2C]">
      {/* Header */}
      <div className="h-16 border-b border-gray-700">
        <ChatHeader />
      </div>

      {/* Chat messages area */}
      <div className="w-full flex-1 overflow-y-auto p-4">
        <Chat />
      </div>

      {/* Footer */}
      <ChatFooter />
    </div>
  );
};

export default Page;
