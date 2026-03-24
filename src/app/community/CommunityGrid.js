"use client";

import { useState } from "react";
import { SignInButton } from "@clerk/nextjs";

// This helps decide what name and picture to show based on how many points someone has
const getSaintlyRank = (halos = 0) => {
  if (halos >= 50) return { title: "Kindred Legend", icon: "👑" };
  if (halos >= 25) return { title: "Arch-Guardian", icon: "🕊️" };
  if (halos >= 10) return { title: "S-Rank Guardian", icon: "✨" };
  if (halos >= 5) return { title: "Kindred Guardian", icon: "🛡️" };
  return { title: "Level 1 Saint", icon: "🌱" };
};

// This builds the grid where we see everyone in the community
export default function CommunityGrid({
  communityProfiles = [],
  userId,
  sendFavourRequest,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  // This part looks through the names and cities to find what you typed in the search box
  const filteredProfiles = communityProfiles.filter((profile) => {
    const search = searchTerm.toLowerCase();
    const inName = profile.full_name?.toLowerCase().includes(search) || false;
    const inCity = profile.city?.toLowerCase().includes(search) || false;
    const inTags =
      profile.tags?.some((tag) => tag.label?.toLowerCase().includes(search)) ||
      false;

    return inName || inCity || inTags;
  });

  return (
    <>
      {/* This is the search box at the top of the page */}
      <div className="mb-12 relative max-w-2xl">
        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-white/20">
          🔍
        </div>
        <input
          type="text"
          placeholder="Search by name, city, or skill..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-lime-400/50 transition-all placeholder:text-white/20"
        />
      </div>

      {/* This is where all the member cards are drawn on the screen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProfiles.map((profile) => (
          <div
            key={profile.clerk_id}
            className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:border-lime-400/50 hover:bg-white/10 transition-all group shadow-2xl relative overflow-hidden flex flex-col"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div className="flex-1">
                {/* Shows the person name */}
                <h3 className="text-xl font-black text-white group-hover:text-lime-400 transition-colors">
                  {profile.full_name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  {/* Shows their city and their rank title */}
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                    {profile.city} • {getSaintlyRank(profile.halos).title}
                  </p>
                  {/* Shows the first part of their postcode */}
                  {profile.postcode && (
                    <span className="bg-white/5 border border-white/10 text-[8px] text-white/30 px-1.5 py-0.5 rounded font-black uppercase">
                      {profile.postcode.split(" ")[0]}
                    </span>
                  )}
                </div>
              </div>
              {/* Shows how many halo points they have earned */}
              <div className="flex items-center bg-white/10 px-3 py-1.5 rounded-full border border-white/10 self-start">
                <span className="text-sm">😇</span>
                <span className="text-xs font-black text-lime-400 ml-2">
                  {profile.halos || 0}
                </span>
              </div>
            </div>

            {/* This part shows the little tags for the skills they have */}
            {profile.tags && profile.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-6 relative z-10">
                {profile.tags.slice(0, 4).map((tag, idx) => (
                  <span
                    key={`${profile.clerk_id}-tag-${idx}`}
                    className="bg-white/5 text-white/60 text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter border border-white/5"
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            )}

            {/* If you are logged in, you see the form to ask for a favour */}
            {userId ? (
              <form
                action={sendFavourRequest}
                className="relative z-10 mt-auto pt-4 border-t border-white/10"
              >
                <input
                  type="hidden"
                  name="receiverId"
                  value={profile.clerk_id}
                />
                <div className="mb-3">
                  <label className="block text-[8px] font-black uppercase tracking-widest mb-1.5 text-white/30 ml-1">
                    Select Category
                  </label>
                  {/* This lets you pick which skill you want to ask about */}
                  <select
                    name="favourCategory"
                    required
                    defaultValue=""
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-[10px] font-bold text-white focus:outline-none focus:border-lime-400/50 transition-all cursor-pointer appearance-none"
                  >
                    {profile.tags && profile.tags.length > 0 ? (
                      <>
                        <option value="" disabled>
                          Select a skill...
                        </option>
                        {profile.tags.map((tag, idx) => (
                          <option
                            key={idx}
                            value={tag.label}
                            className="bg-[#061a06]"
                          >
                            {tag.label}
                          </option>
                        ))}
                      </>
                    ) : (
                      <option value="General Favour">
                        General Kindred Favour
                      </option>
                    )}
                  </select>
                </div>
                {/* This is the box where you type your message */}
                <textarea
                  name="favourText"
                  placeholder="What favour do you need?..."
                  required
                  className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-lime-400/50 transition-all resize-none h-20 mb-3"
                />
                {/* The button to send the favour request */}
                <button
                  type="submit"
                  className="w-full bg-white/10 hover:bg-lime-400 text-white hover:text-green-950 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 hover:border-lime-400"
                >
                  Send Favour Request 😇
                </button>
              </form>
            ) : (
              /* If you are not logged in, you see a button that tells you to log in first */
              <div className="mt-auto pt-4 border-t border-white/10">
                <SignInButton mode="modal">
                  <button className="w-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10">
                    Log in to ask a favour 😇
                  </button>
                </SignInButton>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
