"use client";

import { useState, useEffect } from "react";
import { claimFavour } from "../actions";

// This builds the big list of help requests that everyone can see
export default function NoticeBoardGrid({ openMissions = [], userId }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);

  // This makes sure the clock and dates match up correctly when the page loads
  useEffect(() => {
    setMounted(true);
  }, []);

  // This part looks through the help requests to find what you typed in the search box
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
      {/* This is the search bar at the top of the notice board */}
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

      {/* If no help requests match your search, show this message */}
      {filteredMissions.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-20 text-center backdrop-blur-3xl">
          <p className="text-white/40 italic text-lg font-medium">
            No missions match your search criteria. 🕊️
          </p>
        </div>
      ) : (
        /* This is the grid that holds all the different help request cards */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMissions.map((mission) => (
            <div
              key={mission.id}
              className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:border-lime-400/50 hover:bg-white/10 transition-all group flex flex-col h-full shadow-2xl overflow-hidden relative"
            >
              {/* This shows what kind of help is needed and when it was posted */}
              <div className="flex justify-between items-start mb-6">
                <span className="bg-lime-400/10 border border-lime-400/30 text-lime-400 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  {mission.category || "General Favour"}
                </span>
                <span className="text-[9px] font-black text-white/30 uppercase tracking-tighter">
                  {mounted
                    ? new Date(mission.created_at).toLocaleDateString()
                    : ""}
                </span>
              </div>

              {/* This is the main message describing the help needed */}
              <div className="flex-1 mb-8">
                <p className="text-lg font-medium text-white/90 leading-tight italic">
                  &ldquo;{mission.favour_text}&rdquo;
                </p>
              </div>

              {/* This shows who asked for help and where they are located */}
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

                {/* This button lets you volunteer to help if it is not your own post */}
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
                  /* If it is your own post, you just see a label saying so */
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
