import React, { useState } from "react";
import { Search } from "lucide-react";
import HeadSection from "./HeadSection";
import PeopleList from "./PeopleList";

const Page = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [chatFiltering, setChatFiltering] = useState("all");

  return (
    <div
      id="style"
      className="scrollbar w-full h-screen bg-[#2C2C2C] text-white overflow-y-scroll px-2"
    >
      {/* HEADER */}
      <HeadSection />

      {/* SEARCH BAR */}
      <div className="sticky top-[64px] z-20 bg-[#2C2C2C] py-2 ">
        <input
          type="text"
          placeholder="Search…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#1F1F1F] text-white px-4 py-2 rounded-lg outline-none pr-10"
        />
        <Search
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
      </div>

      {/* FILTERS */}
      <div className="px-3 py-2 flex items-center gap-3 sticky top-[112px] bg-[#2C2C2C] z-20">
        {["all", "friends"].map((filter) => (
          <button
            key={filter}
            onClick={() => setChatFiltering(filter)}
            className={`px-4 select-none py-2 rounded-full ${
              chatFiltering === filter
                ? "bg-sky-500/30 text-white"
                : "bg-[#1E1E1E] text-gray-300"
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* PEOPLE LIST */}
      <PeopleList searchTerm={searchTerm} chatFiltering={chatFiltering} />
    </div>
  );
};

export default Page;
