"use client";

import { useState } from "react";
import { claimFavour } from "../actions";
import ReportButton from "@/components/ReportButton";
import { useTheme } from "@/components/ThemeProvider";

export default function NoticeBoardGrid({ openMissions = [], userId }) {
  const [searchTerm, setSearchTerm] = useState("");
  const { isDark } = useTheme();

  if (typeof document !== "undefined") {
    const input = document.getElementById("header-search-notice");
    if (input) {
      input.oninput = (e) => setSearchTerm(e.target.value);
    }
  }

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredMissions.map((mission) => (
        <div
          key={mission.id}
          style={{ backgroundColor: "var(--kindred-bg)" }}
          className={`p-6 rounded-[2rem] border-2 transition-all duration-300 group flex flex-col h-full overflow-hidden relative ${isDark ? "border-kindred-lime shadow-kindred" : "border-kindred-dark/20 shadow-md hover:border-kindred-dark/40"}`}
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              <span className="bg-kindred-lime/10 border border-kindred-lime/30 text-kindred-lime text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                {mission.category || "General Favour"}
              </span>
              {userId && userId !== mission.sender_id && (
                <ReportButton
                  reportUserId={mission.sender_id}
                  evidence={`Notice Board Mission: ${mission.favour_text}`}
                />
              )}
            </div>
            <span
              suppressHydrationWarning
              className={`text-[9px] font-black uppercase tracking-tighter ${isDark ? "text-white/30" : "text-kindred-dark/60"}`}
            >
              {new Date(mission.created_at).toLocaleDateString()}
            </span>
          </div>

          <div className="flex-1 mb-8">
            <p
              className={`text-lg font-bold leading-tight italic transition-colors ${isDark ? "text-white/90 group-hover:text-kindred-lime" : "text-kindred-dark"}`}
            >
              &ldquo;{mission.favour_text}&rdquo;
            </p>
          </div>

          <div
            className={`pt-6 border-t flex items-center justify-between ${isDark ? "border-white/10" : "border-kindred-dark/10"}`}
          >
            <div>
              <p
                className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-white" : "text-kindred-dark"}`}
              >
                {mission.profiles?.full_name || "A Kindred Soul"}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-[9px] font-bold uppercase tracking-tighter ${isDark ? "text-white/40" : "text-kindred-dark/60"}`}
                >
                  {mission.profiles?.city}
                </span>
              </div>
            </div>

            {userId && userId !== mission.sender_id ? (
              <form action={claimFavour}>
                <input type="hidden" name="favourId" value={mission.id} />
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md active:scale-95 ${isDark ? "bg-kindred-lime text-kindred-dark hover:brightness-110" : "bg-kindred-dark text-white hover:bg-kindred-dark/90 shadow-lg"}`}
                >
                  Claim 🤝
                </button>
              </form>
            ) : (
              <div
                className={`px-4 py-2 rounded-xl border ${isDark ? "bg-white/5 border-white/5" : "bg-kindred-dark/5 border-kindred-dark/5"}`}
              >
                <span
                  className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-white/20" : "text-kindred-dark/30"}`}
                >
                  Your Post
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
