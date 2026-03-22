import { getPublicNoticeBoard, claimFavour } from "../actions";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function NoticeBoard() {
  const { userId } = await auth();
  const openMissions = await getPublicNoticeBoard();

  return (
    <main className="min-h-screen bg-[#061a06] p-4 md:p-8 text-white relative overflow-hidden isolate">
      {/* Dave: Background Glow Intact */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-green-500/10 blur-[120px] pointer-events-none -z-10"></div>

      <header className="max-w-6xl mx-auto mb-12 relative z-10">
        <Link
          href="/"
          className="text-lime-400 text-xs font-black uppercase tracking-[0.3em] hover:text-white transition-colors flex items-center gap-2 mb-8"
        >
          ← Back to the Grid
        </Link>
        <h1 className="text-5xl font-black tracking-tighter mb-2">
          Notice Board
        </h1>
        <p className="text-white/40 text-sm font-bold uppercase tracking-widest">
          Active Missions in the Kindred Network
        </p>
      </header>

      <section className="max-w-6xl mx-auto relative z-10">
        {openMissions.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-20 text-center backdrop-blur-3xl">
            <p className="text-white/40 italic text-lg font-medium">
              The board is currently clear. Peace reigns... for now. 😇
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {openMissions.map((mission) => (
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
                    {new Date(mission.created_at).toLocaleDateString()}
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

                  {/* Claim Button */}
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
      </section>
    </main>
  );
}
