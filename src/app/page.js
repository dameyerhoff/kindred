import {
  getProfiles,
  getMyRequests,
  getMySentRequests,
  signOffMission,
  finalizeMission,
  updateMissionTerms,
  markJobDone,
  deleteFavour,
} from "./actions";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import NavBar from "@/components/NavBar";
import { headers } from "next/headers";
import NegotiationCard from "@/components/NegotiationCard";
import LandingController from "@/components/LandingController";
import Image from "next/image";
import AboutUsAnimation from "@/components/AboutUsAnimation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const getSaintlyRank = (halos = 0) => {
  if (halos >= 50) return { title: "Kindred Legend", icon: "👑" };
  if (halos >= 25) return { title: "Arch-Guardian", icon: "🕊️" };
  if (halos >= 10) return { title: "S-Rank Guardian", icon: "✨" };
  if (halos >= 5) return { title: "Kindred Guardian", icon: "🛡️" };
  return { title: "Level 1 Saint", icon: "🌱" };
};

async function getMissionData(missionId) {
  if (!missionId) return null;
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
  const { data } = await supabase
    .from("favours")
    .select("*, profiles:sender_id(full_name)")
    .eq("id", missionId)
    .single();
  return data;
}

export default async function Home({ searchParams }) {
  await headers();
  const { auth } = await import("@clerk/nextjs/server");
  const { userId } = await auth();
  const params = await searchParams;
  const missionId = params.missionId;

  const tempClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  const allProfiles = (await getProfiles()) || [];
  const [myRequests, mySentRequests] = await Promise.all([
    userId ? getMyRequests() : [],
    userId ? getMySentRequests() : [],
  ]);

  const activeMission = await getMissionData(missionId);

  const { data: rawDeeds } = userId
    ? await tempClient
        .from("favours")
        .select("*")
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .in("status", ["active", "completed", "pending", "negotiating"])
        .order("created_at", { ascending: false })
    : { data: [] };

  const myDeeds =
    rawDeeds?.map((deed) => {
      const sender = allProfiles.find((p) => p.clerk_id === deed.sender_id);
      const receiver = allProfiles.find((p) => p.clerk_id === deed.receiver_id);
      return {
        ...deed,
        sender_name: sender?.full_name || "Kindred Soul",
        receiver_name: receiver?.full_name || "Waiting for Helper...",
      };
    }) || [];

  const myProfile = allProfiles.find((p) => p.clerk_id === userId);

  const LandingUI = (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes final-twinkle {
          0%, 100% { color: #fff; text-shadow: 0 0 2px #fff; opacity: 1; transform: scale(1); }
          20% { color: #A3E635; text-shadow: 0 0 12px #A3E635, 0 0 20px #fff; opacity: 0.7; transform: scale(1.02); }
          40% { color: #fff; text-shadow: 0 0 18px #fff, 0 0 25px #A3E635; opacity: 1; }
          60% { color: #A3E635; text-shadow: 0 0 8px #A3E635; opacity: 0.5; transform: scale(0.98); }
          80% { color: #fff; text-shadow: 0 0 15px #fff; opacity: 0.9; }
        }
        .force-sparkle { animation: final-twinkle 1.8s ease-in-out infinite !important; display: inline-block; }
        @keyframes shimmer-move { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .animate-shimmer { animation: shimmer-move 2.5s infinite; }
      `,
        }}
      />
      <div className="h-screen w-full bg-kindred-bg flex flex-col items-center justify-center p-4 text-center relative overflow-hidden isolate">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-kindred-lime/10 blur-[100px] pointer-events-none -z-10"></div>
        <div className="relative z-10 flex flex-col items-center max-w-4xl w-full space-y-0">
          <div className="relative w-64 h-44 md:w-80 md:h-52 overflow-hidden flex items-center justify-center bg-transparent mix-blend-screen">
            <div className="absolute top-[-38%] w-full flex justify-center scale-[0.82] md:scale-[0.85]">
              <AboutUsAnimation />
            </div>
          </div>
          <div className="space-y-1 mt-1">
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter text-kindred-text leading-none uppercase drop-shadow-2xl">
              KINDRED<span className="text-kindred-lime">.</span>
            </h1>
            <p className="text-lg md:text-2xl font-black text-kindred-text italic tracking-tight leading-tight">
              <span className="text-kindred-lime font-bold">&ldquo;</span>
              Because we&apos;re better together
              <span className="text-kindred-lime font-bold">&rdquo;</span>
            </p>
            <div className="space-y-1 pt-4">
              <p className="text-[10px] md:text-xs font-black tracking-[0.4em] uppercase">
                <span className="text-white">THE </span>
                <span className="text-kindred-lime font-black">
                  &ldquo;FAVOUR FOR FAVOUR&rdquo;
                </span>
                <span className="text-white"> PLATFORM</span>
              </p>
              <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] italic py-2 force-sparkle">
                MADE BY ADMANDA, DAVE & OLEKSII
              </p>
            </div>
          </div>
          {!userId && (
            <div className="mt-4">
              <Link
                href="/sign-in"
                className="group bg-kindred-lime text-kindred-dark px-10 py-3 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-kindred hover:bg-white transition-all duration-300 active:scale-95 inline-block"
              >
                Enter Site
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );

  const DashboardUI = (
    <main className="min-h-screen bg-kindred-bg p-4 md:p-8 text-kindred-text relative overflow-hidden isolate transition-colors duration-300">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-kindred-lime/10 blur-[120px] pointer-events-none -z-10"></div>
      <NavBar
        userId={userId}
        inboxCount={myRequests.length}
        outboxCount={mySentRequests.length}
      />
      <section className="max-w-6xl mx-auto space-y-12 relative z-10 pt-10">
        {activeMission && (
          <NegotiationCard
            activeMission={activeMission}
            finalizeAction={finalizeMission}
            updateAction={updateMissionTerms}
          />
        )}
        {myProfile && !activeMission ? (
          <div className="space-y-6">
            {/* PROFILE HEADER ... (existing) */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-kindred-lime via-emerald-400 to-kindred-blue-glow rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-black/5 dark:bg-white/5 backdrop-blur-3xl border border-black/10 dark:border-white/10 p-8 rounded-[2.5rem] flex flex-col md:flex-row gap-8 items-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-kindred-lime flex items-center justify-center bg-kindred-bg text-4xl font-black text-kindred-text shadow-kindred">
                    {myProfile?.full_name?.charAt(0) || "?"}
                  </div>
                  <div className="absolute -top-2 -right-2 bg-kindred-lime text-kindred-dark text-[11px] font-black px-3 py-1 rounded-full animate-bounce shadow-xl uppercase border-2 border-white dark:border-kindred-dark">
                    {getSaintlyRank(myProfile?.halos || 0).icon} Rank
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-4xl font-black text-kindred-text tracking-tighter mb-1">
                    {myProfile?.full_name || "Kindred Guardian"}
                  </h2>
                  <p className="text-kindred-lime/80 text-sm font-bold uppercase tracking-widest mb-4">
                    {myProfile?.city || "Unknown Zone"} •{" "}
                    {getSaintlyRank(myProfile?.halos || 0).title}
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 items-center mt-6">
                    <div className="bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-md">
                      <span className="text-lg">😇</span>
                      <span className="text-xs font-black text-kindred-text uppercase tracking-widest">
                        {myProfile?.halos || 0} HALOS
                      </span>
                    </div>
                    <Link
                      href="/setup"
                      className="bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-kindred-text px-5 py-2 rounded-full text-xs font-black transition border border-black/10 dark:border-white/20 uppercase tracking-widest"
                    >
                      Manage Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {myDeeds && myDeeds.length > 0 && (
              <div className="bg-black/5 dark:bg-white/5 rounded-[2rem] p-6 border border-black/5 dark:border-white/5 backdrop-blur-sm">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-kindred-lime/50 mb-4">
                  Kindred Mission Log ({myDeeds.length})
                </h3>
                <div className="space-y-4">
                  {myDeeds.map((deed) => {
                    const isSender = deed.sender_id === userId;
                    const iHaveSigned = isSender
                      ? deed.sender_signed_off
                      : deed.receiver_signed_off;
                    const partnerHasSigned = isSender
                      ? deed.receiver_signed_off
                      : deed.sender_signed_off;
                    const bothSigned = deed.status === "completed";
                    const eitherSigned =
                      deed.sender_signed_off || deed.receiver_signed_off;

                    return (
                      <div
                        key={deed.id}
                        className={`group relative p-4 rounded-2xl border transition-all overflow-hidden ${
                          isSender
                            ? "bg-white/5 border-white/5 hover:border-kindred-lime/30"
                            : "bg-kindred-blue-glow/5 border-kindred-blue-glow/10 hover:border-kindred-blue-glow/30"
                        }`}
                      >
                        {/* ROLE BADGE */}
                        <div
                          className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[8px] font-black uppercase tracking-[0.2em] z-20 ${
                            isSender
                              ? "bg-kindred-lime text-kindred-dark"
                              : "bg-kindred-blue-glow text-white"
                          }`}
                        >
                          {isSender ? "My Request 🙋‍♂️" : "Helping Partner 🤝"}
                        </div>

                        <div
                          className={`absolute inset-0 bg-gradient-to-r from-transparent via-${isSender ? "kindred-lime" : "kindred-blue-glow"}/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none`}
                        ></div>

                        <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-2">
                              <span
                                className={`${isSender ? "text-kindred-lime" : "text-kindred-blue-glow"} text-xs animate-pulse`}
                              >
                                {isSender ? "✨" : "💎"}
                              </span>
                              <p className="text-sm font-bold text-kindred-text italic leading-tight">
                                &ldquo;{deed.favour_text}&rdquo;
                              </p>
                            </div>
                            <div
                              className={`grid grid-cols-1 sm:grid-cols-2 gap-y-3 pl-5 border-l ${isSender ? "border-kindred-lime/10" : "border-kindred-blue-glow/20"}`}
                            >
                              <div className="space-y-1">
                                <p className="text-[9px] text-kindred-text/40 uppercase font-black tracking-[0.2em]">
                                  Partner
                                </p>
                                <p className="text-[11px] font-bold text-kindred-text/80">
                                  {isSender
                                    ? deed.receiver_name
                                    : deed.sender_name}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[9px] text-kindred-text/40 uppercase font-black tracking-[0.2em]">
                                  Return Favour
                                </p>
                                <p
                                  className={`text-[11px] font-bold italic ${isSender ? "text-kindred-lime" : "text-kindred-blue-glow"}`}
                                >
                                  {deed.exchange_details
                                    ? `"${deed.exchange_details}"`
                                    : "TBC 🤝"}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[9px] text-kindred-text/40 uppercase font-black tracking-[0.2em]">
                                  Agreed Date
                                </p>
                                <p className="text-[11px] font-bold text-kindred-text/80">
                                  {deed.scheduled_date || "TBC 📅"}
                                </p>
                              </div>
                              <div className="space-y-1">
                                <p className="text-[9px] text-kindred-text/40 uppercase font-black tracking-[0.2em]">
                                  Agreed Time
                                </p>
                                <p className="text-[11px] font-bold text-kindred-text/80">
                                  {deed.scheduled_time || "TBC ⏰"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end justify-center gap-2 min-w-[160px]">
                            {!bothSigned ? (
                              <>
                                {deed.status === "active" ? (
                                  <div className="flex flex-col gap-2 w-full">
                                    <form
                                      action={markJobDone}
                                      className="w-full"
                                    >
                                      <input
                                        type="hidden"
                                        name="favourId"
                                        value={deed.id}
                                      />
                                      {iHaveSigned ? (
                                        <div className="w-full bg-emerald-600 text-white border border-emerald-400/30 px-4 py-2.5 rounded-xl font-black uppercase tracking-tighter text-center flex items-center justify-center gap-2 text-[10px] shadow-inner">
                                          Job Done ✅
                                        </div>
                                      ) : (
                                        <button className="w-full bg-red-600 text-white px-4 py-2.5 rounded-xl font-black uppercase tracking-tighter hover:bg-red-500 shadow-[0_4px_15px_rgba(220,38,38,0.4)] transition-all flex items-center justify-center gap-2 text-[10px] border border-white/10">
                                          <span className="text-sm">❌</span>{" "}
                                          Job Done?
                                        </button>
                                      )}
                                    </form>
                                    {!eitherSigned && (
                                      <Link
                                        href={`/?missionId=${deed.id}`}
                                        className="w-full text-center text-[9px] text-kindred-text/40 uppercase font-black hover:text-kindred-lime transition-all"
                                      >
                                        View Details
                                      </Link>
                                    )}
                                  </div>
                                ) : (
                                  <Link
                                    href={`/?missionId=${deed.id}`}
                                    className="w-full text-center text-[10px] bg-kindred-lime text-kindred-dark px-4 py-2.5 rounded-xl font-black uppercase tracking-tighter hover:bg-white transition-all shadow-lg active:scale-95"
                                  >
                                    {deed.status === "pending"
                                      ? "Discuss Terms 💬"
                                      : "Renegotiate 🤝"}
                                  </Link>
                                )}

                                {eitherSigned ? (
                                  <div className="relative group/delete w-full">
                                    <div className="w-full text-center text-[10px] bg-slate-500/10 text-slate-500 border border-slate-500/20 px-4 py-2 rounded-xl font-black uppercase tracking-tighter opacity-40 cursor-help">
                                      Delete 🗑️
                                    </div>
                                    <div className="absolute bottom-full mb-2 right-0 px-3 py-2 bg-kindred-dark border border-kindred-lime/30 text-kindred-lime text-[9px] font-black uppercase tracking-widest rounded-lg whitespace-nowrap opacity-0 group-hover/delete:opacity-100 transition-opacity pointer-events-none shadow-2xl z-50 translate-y-1 group-hover/delete:translate-y-0 duration-200">
                                      Awaiting partner to mark job done
                                      <div className="absolute top-full right-4 border-8 border-transparent border-t-kindred-dark"></div>
                                    </div>
                                  </div>
                                ) : (
                                  <button className="w-full text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-xl font-black uppercase tracking-tighter hover:bg-red-500/30 transition-all opacity-60 hover:opacity-100">
                                    Release 🚩
                                  </button>
                                )}
                              </>
                            ) : (
                              <div className="flex flex-col gap-2 w-full">
                                <div className="bg-kindred-lime/10 border border-kindred-lime/30 px-4 py-2 rounded-xl text-center w-full">
                                  <p className="text-[9px] text-kindred-lime uppercase font-black tracking-widest">
                                    Mission Complete 😇
                                  </p>
                                </div>
                                <form action={deleteFavour} className="w-full">
                                  <input
                                    type="hidden"
                                    name="favourId"
                                    value={deed.id}
                                  />
                                  <button className="w-full text-[10px] bg-slate-700 text-white border border-slate-600 px-4 py-2 rounded-xl font-black uppercase tracking-tighter hover:bg-red-600 transition-all">
                                    Delete 🗑️
                                  </button>
                                </form>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          userId && (
            <div className="bg-black/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 p-10 rounded-[2.5rem] text-center">
              <p className="text-kindred-text/60 text-lg mb-8 font-medium italic">
                Preparing your spirit... 😇
              </p>
              <Link
                href="/setup"
                className="bg-kindred-lime text-kindred-dark px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest shadow-kindred hover:bg-white transition-all inline-block"
              >
                Start Journey
              </Link>
            </div>
          )
        )}
      </section>
    </main>
  );

  return (
    <LandingController
      userId={userId}
      landing={LandingUI}
      dashboard={DashboardUI}
    />
  );
}
