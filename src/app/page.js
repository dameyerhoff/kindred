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

  const profiles = (await getProfiles()) || [];
  const myRequests = userId ? (await getMyRequests()) || [] : [];
  const mySentRequests = userId ? (await getMySentRequests()) || [] : [];
  const activeMission = await getMissionData(missionId);

  const { data: myDeeds } = userId
    ? await tempClient
        .from("favours")
        .select(
          "*, sender:sender_id(full_name), receiver:receiver_id(full_name), scheduled_date, scheduled_time, exchange_details, sender_signed_off, receiver_signed_off",
        )
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .in("status", ["active", "completed"])
        .order("created_at", { ascending: false })
    : { data: [] };

  const myProfile = profiles.find((p) => p.clerk_id === userId);

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
                  {/* SAFE CHARAT CHECK: Added fallback and optional chaining */}
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
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
                    <p className="text-kindred-lime/80 text-sm font-bold uppercase tracking-widest">
                      {myProfile?.city || "Unknown Zone"} •{" "}
                      {getSaintlyRank(myProfile?.halos || 0).title}
                    </p>
                    {myProfile?.postcode && (
                      <span className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[9px] text-kindred-text/40 px-2 py-0.5 rounded-md font-black uppercase tracking-tighter">
                        {myProfile.postcode.split(" ")[0]}
                      </span>
                    )}
                  </div>

                  {myProfile?.tags && myProfile.tags.length > 0 && (
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                      {myProfile.tags.map((tag, idx) => (
                        <span
                          key={`hero-tag-${idx}`}
                          className="bg-kindred-lime/10 border border-kindred-lime/30 text-kindred-lime text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter"
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap justify-center md:justify-start gap-4 items-center">
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

                    <div className="flex gap-2">
                      <Link
                        href="/inbox"
                        className="flex items-center gap-2 bg-kindred-lime/20 border border-kindred-lime/30 px-3 py-2 rounded-xl hover:bg-kindred-lime/40 transition-all group relative"
                      >
                        <span className="text-base">📬</span>
                        <span className="text-sm font-black text-kindred-lime">
                          {myRequests.length}
                        </span>
                      </Link>

                      <Link
                        href="/outbox"
                        className="flex items-center gap-2 bg-kindred-blue-glow/20 border border-kindred-blue-glow/30 px-3 py-2 rounded-xl hover:bg-kindred-blue-glow/40 transition-all group relative"
                      >
                        <span className="text-base">📤</span>
                        <span className="text-sm font-black text-kindred-blue-glow">
                          {mySentRequests.length}
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {myDeeds && myDeeds.length > 0 && (
              <div className="bg-black/5 dark:bg-white/5 rounded-[2rem] p-6 border border-black/5 dark:border-white/5 backdrop-blur-sm">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-kindred-lime/50 mb-4">
                  Kindred Mission Log
                </h3>
                <div className="space-y-3">
                  {myDeeds.map((deed) => (
                    <div
                      key={deed.id}
                      className="flex items-center gap-3 text-sm text-kindred-text/40 border-b border-black/5 dark:border-white/5 last:border-0 last:pb-0 pb-2"
                    >
                      <span className="text-kindred-lime">✨</span>
                      <span className="italic flex-1">
                        &ldquo;{deed.favour_text}&rdquo;
                      </span>
                      <span className="text-[9px] bg-kindred-lime/10 text-kindred-lime px-2 py-0.5 rounded-full uppercase font-black tracking-tighter">
                        {deed.status === "completed"
                          ? "Completed 😇"
                          : "Active 🤝"}
                      </span>
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
