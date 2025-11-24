"use client";

import React, { useState, useMemo } from "react";

const PeopleList = ({ searchTerm, chatFiltering }) => {
  const [activeChat, setActiveChat] = useState(null);

  const chats = [
    {
      name: "Aayush",
      msg: "Code push gareko xu bro.",
      time: "21:18",
      online: true,
      type: "friend",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      name: "+977 981-5521034",
      msg: "📷 Image received",
      time: "21:05",
      type: "friend",
      img: "https://randomuser.me/api/portraits/men/11.jpg",
    },
    {
      name: "Mina",
      msg: "Thik cha, worry nagarna.",
      time: "20:51",
      online: true,
      type: "friend",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      name: "Study Group",
      msg: "Kal ko assignment chai send garna.",
      time: "19:41",
      type: "group",
      img: "https://randomuser.me/api/portraits/men/56.jpg",
    },
    {
      name: "Work Group",
      msg: "Meeting 10am ma cha.",
      time: "18:30",
      type: "group",
      img: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
      name: "Rohan",
      msg: "🎤 Voice message",
      time: "20:40",
      type: "friend",
      img: "https://randomuser.me/api/portraits/men/24.jpg",
    },
  ];

  // Filter chats based on search term and chat type
  const filteredChats = useMemo(() => {
    return chats.filter((chat) => {
      const matchesFilter =
        chatFiltering === "all" ? true : chat.type === chatFiltering;
      const matchesSearch = chat.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [searchTerm, chatFiltering]);

  return (
    <div>
      {filteredChats.length === 0 && (
        <div className="text-gray-400 p-3">Not Found.</div>
      )}

      {filteredChats.map((chat, index) => (
        <div
          key={index}
          onClick={() => setActiveChat(index)}
          className={`flex items-center justify-between p-3 cursor-pointer transition-all duration-200 ${
            activeChat === index
              ? "bg-[#2a3942] shadow-inner"
              : "hover:bg-[#1f2b32]"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full">
              <img
                src={chat.img}
                alt={chat.name}
                className="w-full h-full object-cover rounded-full"
              />
              {chat.online && chat.type === "friend" && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0c1418] z-10"></span>
              )}
            </div>

            <div>
              <div className="text-[15px] font-semibold">{chat.name}</div>
              <div className="text-gray-400 text-[13px] truncate w-[160px]">
                {chat.msg}
              </div>
            </div>
          </div>

          <div className="text-[11px] text-gray-500">{chat.time}</div>
        </div>
      ))}
    </div>
  );
};

export default PeopleList;
