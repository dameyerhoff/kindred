"use client";

import { SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { useState } from "react";

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
  // status.type can be 'sending' or 'success'
  const [status, setStatus] = useState({ id: null, type: null });

  const filteredProfiles = communityProfiles.filter((profile) => {
    const search = searchTerm.toLowerCase();
    const inName = profile.full_name?.toLowerCase().includes(search) || false;
    const inCity = profile.city?.toLowerCase().includes(search) || false;
    const inTags =
      profile.tags?.some((tag) => tag.label?.toLowerCase().includes(search)) ||
      false;
    return inName || inCity || inTags;
  });

  const handleSubmit = async (e, profileId) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    // 1. Start the spinner
    setStatus({ id: profileId, type: "sending" });

    try {
      // 2. Explicitly wait for the server action to finish
      await sendFavourRequest(formData);

      // 3. Update to success state and clear form
      setStatus({ id: profileId, type: "success" });
      form.reset();

      // 4. Reset button to original state after 3 seconds
      setTimeout(() => {
        setStatus({ id: null, type: null });
      }, 3000);
    } catch (error) {
      console.error("Dispatch Error:", error);
      setStatus({ id: null, type: null });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredProfiles.map((profile) => {
        const isCurrentSending =
          status.id === profile.clerk_id && status.type === "sending";
        const isCurrentSuccess =
          status.id === profile.clerk_id && status.type === "success";

        return (
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
                  className="text-[8px] font-black uppercase tracking-tighter bg-kindred-lime text-kindred-dark px-2 py-1 rounded-lg hover:scale-105 transition-transform shadow-sm inline-block mt-2"
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
                onSubmit={(e) => handleSubmit(e, profile.clerk_id)}
                className="relative z-10 mt-auto pt-4 border-t border-kindred-text/10"
              >
                <input
                  type="hidden"
                  name="receiverId"
                  value={profile.clerk_id}
                />

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
                    className="w-full border border-kindred-text/10 rounded-xl p-3 text-[10px] font-bold appearance-none cursor-pointer focus:border-kindred-lime transition-all"
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
                  disabled={isCurrentSending || isCurrentSuccess}
                  className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-md
                    ${
                      isCurrentSuccess
                        ? "bg-emerald-500 text-white"
                        : isCurrentSending
                          ? "bg-kindred-lime/50 text-kindred-dark cursor-wait"
                          : "bg-kindred-lime text-kindred-dark hover:brightness-110 active:scale-[0.98]"
                    }`}
                >
                  {isCurrentSuccess ? (
                    "Request Sent! ✨"
                  ) : isCurrentSending ? (
                    <>
                      <span className="w-3 h-3 border-2 border-kindred-dark/30 border-t-kindred-dark rounded-full animate-spin"></span>
                      Dispatching Kindred Spirit...
                    </>
                  ) : (
                    "Send Favour Request 😇"
                  )}
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
        );
      })}
    </div>
  );
}
