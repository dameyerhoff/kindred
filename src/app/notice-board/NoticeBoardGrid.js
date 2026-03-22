"use client";

import { useState, useEffect } from "react";
import { claimFavour } from "../actions";

export default function NoticeBoardGrid({ openMissions = [], userId }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);

  // Dave: Handle hydration by waiting for mount before rendering locale-sensitive dates
  useEffect(() => {
    setMounted(true);
  }, []);

  // Dave: Filter logic covering Mission Text, Category, and City
  const filteredMissions = openMissions.filter((mission) => {
    const search = searchTerm.toLowerCase();
    const inText = mission.favour_text?.toLowerCase().includes(search) || false;
    const inCategory =
      mission.category?.toLowerCase().includes(search) || false;
    const inCity =
      mission.profiles?.city?.toLowerCase().includes(search) || false;

    return inText || inCategory || inCity;
  });

  return (
    <>
      {/* Dave: Search Bar styled for the Kindred aesthetic */}
      <div className="mb-12 relative max-w-2xl">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-white/20">
          🔍
        </div>
        <input
          type="text"
          placeholder="Filter missions by skill, city, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-lime-400/50 transition-all placeholder:text-white/20"
        />
      </div>

      {filteredMissions.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-20 text-center backdrop-blur-3xl">
          <p className="text-white/40 italic text-lg font-medium">
            No missions match your search criteria. 🕊️
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMissions.map((mission) => (
            <div
              key={mission.id}
              className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:border-lime-400/50 hover:bg-white/10 transition-all group flex flex-col h-full shadow-2xl overflow-hidden relative"
            >
              {/* Status Tag */}
              <div className="flex justify-between items-start mb-6">
                <span className="bg-lime-400/10 border border-lime-400/30 text-lime-400 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  {mission.category || "General Favour"}
                </span>
                <span className="text-[9px] font-black text-white/30 uppercase tracking-tighter">
                  {/* Dave: Prevent hydration mismatch by only showing date on client mount */}
                  {mounted
                    ? new Date(mission.created_at).toLocaleDateString()
                    : ""}
                </span>
              </div>

              {/* Mission Text */}
              <div className="flex-1 mb-8">
                <p className="text-lg font-medium text-white/90 leading-tight italic">
                  &ldquo;{mission.favour_text}&rdquo;
                </p>
              </div>

              {/* Requester Info */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-white uppercase tracking-widest">
                    {mission.profiles?.full_name || "A Kindred Soul"}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] text-white/40 font-bold uppercase tracking-tighter">
                      {mission.profiles?.city}
                    </span>
                    {mission.location_tag && (
                      <span className="bg-white/5 border border-white/10 text-[8px] text-white/30 px-1.5 py-0.5 rounded font-black uppercase">
                        {mission.location_tag.split(" ")[0]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Claim Button Logic */}
                {userId && userId !== mission.sender_id ? (
                  <form action={claimFavour}>
                    <input type="hidden" name="favourId" value={mission.id} />
                    <button
                      type="submit"
                      className="bg-white text-green-950 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-lime-400 transition-all shadow-xl"
                    >
                      Claim 🤝
                    </button>
                  </form>
                ) : (
                  <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                      Your Post
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
