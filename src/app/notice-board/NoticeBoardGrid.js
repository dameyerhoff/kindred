"use client";

import { claimFavour } from "../actions";

export default function NoticeBoardGrid({
  openMissions = [],
  userId,
  searchTerm = "",
}) {
  // Filter logic happens here based on the prop passed from the page
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
          className="p-6 rounded-[2rem] border-2 border-kindred-lime shadow-kindred transition-all duration-300 group flex flex-col h-full overflow-hidden relative hover:brightness-110"
        >
          <div className="flex justify-between items-start mb-6">
            <span className="bg-kindred-lime/10 border border-kindred-lime/30 text-kindred-lime text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
              {mission.category || "General Favour"}
            </span>
            <span
              suppressHydrationWarning
              className="text-[9px] font-black text-kindred-text/30 uppercase tracking-tighter"
            >
              {new Date(mission.created_at).toLocaleDateString()}
            </span>
          </div>

          <div className="flex-1 mb-8">
            <p className="text-lg font-medium text-kindred-text/90 leading-tight italic group-hover:text-kindred-lime">
              &ldquo;{mission.favour_text}&rdquo;
            </p>
          </div>

          <div className="pt-6 border-t border-kindred-text/10 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-kindred-text uppercase tracking-widest">
                {mission.profiles?.full_name || "A Kindred Soul"}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[9px] text-kindred-text/40 font-bold uppercase tracking-tighter">
                  {mission.profiles?.city}
                </span>
              </div>
            </div>

            {userId && userId !== mission.sender_id ? (
              <form action={claimFavour}>
                <input type="hidden" name="favourId" value={mission.id} />
                <button
                  type="submit"
                  className="bg-kindred-lime text-kindred-dark px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-md"
                >
                  Claim 🤝
                </button>
              </form>
            ) : (
              <div className="bg-kindred-text/5 px-4 py-2 rounded-xl border border-kindred-text/5">
                <span className="text-[10px] font-black text-kindred-text/20 uppercase tracking-widest">
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
