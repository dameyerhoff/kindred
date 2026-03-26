"use client";

import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";

const getSaintlyRank = (halos = 0) => {
  if (halos >= 50) return { title: "Kindred Legend", icon: "👑" };
  if (halos >= 25) return { title: "Arch-Guardian", icon: "🕊️" };
  if (halos >= 10) return { title: "S-Rank Guardian", icon: "✨" };
  if (halos >= 5) return { title: "Kindred Guardian", icon: "🛡️" };
  return { title: "Level 1 Saint", icon: "🌱" };
};

export default function CommunityGrid({
  communityProfiles = [],
  userId,
  sendFavourRequest,
  searchTerm = "",
}) {
  const [searchTerm, setSearchTerm] = useState("");

  // Search Listener - Restored to pure logic
  if (typeof document !== "undefined") {
    const input = document.getElementById("header-search-community");
    if (input) {
      input.oninput = (e) => setSearchTerm(e.target.value);
    }
  }

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredProfiles.map((profile) => (
        <div
          key={profile.clerk_id}
          style={{ backgroundColor: "var(--kindred-bg)" }}
          className="p-6 rounded-[2rem] border-2 border-kindred-lime shadow-kindred transition-all duration-300 group relative overflow-hidden flex flex-col hover:brightness-110"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-kindred-lime/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="flex-1">
              <h3 className="text-xl font-black text-kindred-text transition-colors">
                {profile.full_name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-[10px] font-bold text-kindred-text/60 uppercase tracking-widest">
                  {profile.city} • {getSaintlyRank(profile.halos).title}
                </p>
              </div>
              <Link
                href={`/profile/${profile.clerk_id}`}
                className="text-[8px] font-black uppercase tracking-tighter bg-kindred-lime text-kindred-dark px-2 py-1 rounded-lg hover:scale-105 transition-transform shadow-sm"
              >
                View Profile 👤
              </Link>
            </div>
            <div className="flex items-center bg-kindred-text/5 px-3 py-1.5 rounded-full border border-kindred-text/10 self-start">
              <span className="text-sm">😇</span>
              <span className="text-xs font-black text-kindred-lime ml-2">
                {profile.halos || 0}
              </span>
            </div>
          </div>

          {profile.tags && profile.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-6 relative z-10">
              {profile.tags.slice(0, 4).map((tag, idx) => (
                <span
                  key={`${profile.clerk_id}-tag-${idx}`}
                  className="bg-kindred-text/5 text-kindred-text/60 text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter border border-kindred-text/5"
                >
                  {tag.label}
                </span>
              ))}
            </div>
          )}

          {userId ? (
            <form
              action={sendFavourRequest}
              className="relative z-10 mt-auto pt-4 border-t border-kindred-text/10"
            >
              <input type="hidden" name="receiverId" value={profile.clerk_id} />
              <div className="mb-3">
                <label className="block text-[8px] font-black uppercase tracking-widest mb-1.5 text-kindred-text/30 ml-1">
                  Select Category
                </label>
                <select
                  name="favourCategory"
                  required
                  defaultValue=""
                  style={{
                    backgroundColor: "var(--kindred-bg)",
                    color: "var(--kindred-text)",
                  }}
                  className="w-full border border-kindred-text/10 rounded-xl p-3 text-[10px] font-bold appearance-none cursor-pointer"
                >
                  {profile.tags && profile.tags.length > 0 ? (
                    <>
                      <option value="" disabled>
                        Select a skill...
                      </option>
                      {profile.tags.map((tag, idx) => (
                        <option key={idx} value={tag.label}>
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
              <textarea
                name="favourText"
                placeholder="What favour do you need?..."
                required
                style={{
                  backgroundColor: "var(--kindred-bg)",
                  color: "var(--kindred-text)",
                }}
                className="w-full border border-kindred-text/10 rounded-xl p-3 text-xs placeholder:text-kindred-text/40 focus:outline-none focus:border-kindred-lime/50 transition-all resize-none h-20 mb-3"
              />
              <button
                type="submit"
                className="w-full bg-kindred-lime text-kindred-dark py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 shadow-md transition-all"
              >
                Send Favour Request 😇
              </button>
            </form>
          ) : (
            <div className="mt-auto pt-4 border-t border-kindred-text/10">
              <SignInButton mode="modal">
                <button className="w-full bg-kindred-text/5 text-kindred-text/40 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-kindred-text/10 transition-all">
                  Log in to ask a favour 😇
                </button>
              </SignInButton>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
