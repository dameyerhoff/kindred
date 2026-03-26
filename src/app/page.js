import {
  getProfiles,
  getMyRequests,
  getMySentRequests,
  signOffMission,
  finalizeMission,
  updateMissionTerms,
} from "./actions";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import NavBar from "@/components/NavBar";
import { headers } from "next/headers";
import NegotiationCard from "@/components/NegotiationCard";

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

  return (
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
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-kindred-lime via-emerald-400 to-kindred-blue-glow rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-black/5 dark:bg-white/5 backdrop-blur-3xl border border-black/10 dark:border-white/10 p-8 rounded-[2.5rem] flex flex-col md:flex-row gap-8 items-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-kindred-lime flex items-center justify-center bg-kindred-bg text-4xl font-black text-kindred-text shadow-kindred">
                    {myProfile?.full_name?.charAt(0) || "?"}
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-4xl font-black text-kindred-text tracking-tighter mb-1">
                    {myProfile?.full_name || "Kindred Guardian"}
                  </h2>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-6">
                    {/* FIXED: Explicit text colors for Inbox/Outbox buttons */}
                    <Link
                      href="/inbox"
                      className="flex items-center gap-2 bg-kindred-lime/10 border border-kindred-lime/30 px-4 py-2 rounded-xl hover:bg-kindred-lime/20 transition-all !text-kindred-lime"
                    >
                      <span className="text-xl">📬</span>
                      <span className="text-sm font-black uppercase tracking-widest">
                        Inbox ({myRequests.length})
                      </span>
                    </Link>
                    <Link
                      href="/outbox"
                      className="flex items-center gap-2 bg-kindred-blue-glow/10 border border-kindred-blue-glow/30 px-4 py-2 rounded-xl hover:bg-kindred-blue-glow/20 transition-all !text-kindred-blue-glow"
                    >
                      <span className="text-xl">📤</span>
                      <span className="text-sm font-black uppercase tracking-widest">
                        Outbox ({mySentRequests.length})
                      </span>
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
                  {myDeeds.map((deed) => (
                    <div
                      key={deed.id}
                      className="group relative bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-kindred-lime/30 transition-all"
                    >
                      <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-kindred-lime text-xs">
                              ✨
                            </span>
                            <p className="text-sm font-bold text-kindred-text italic leading-tight">
                              &ldquo;{deed.favour_text}&rdquo;
                            </p>
                          </div>
                          <p className="text-[10px] text-kindred-text/40 uppercase tracking-widest font-black pl-5">
                            Partner:{" "}
                            {deed.sender_id === userId
                              ? deed.receiver_name
                              : deed.sender_name}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {deed.status !== "completed" ? (
                            <>
                              <Link
                                href={`/?missionId=${deed.id}`}
                                className="text-[10px] bg-kindred-lime text-kindred-dark px-4 py-2 rounded-lg font-black uppercase tracking-tighter hover:bg-white transition-colors"
                              >
                                {deed.status === "pending"
                                  ? "Discuss Terms 💬"
                                  : "Renegotiate 🤝"}
                              </Link>
                              {/* FIXED: Release button is now universal and Delete is removed */}
                              <button className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-lg font-black uppercase tracking-tighter hover:bg-red-500/30 transition-all">
                                Release 🚩
                              </button>
                            </>
                          ) : (
                            <span className="text-[9px] bg-kindred-lime/10 text-kindred-lime px-2 py-0.5 rounded-full uppercase font-black tracking-tighter border border-kindred-lime/20">
                              Mission Complete 😇
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
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
}
