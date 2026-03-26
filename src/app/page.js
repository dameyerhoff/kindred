import {
  getProfiles,
  getMyRequests,
  getMySentRequests,
  signOffMission,
} from "./actions";
import { auth } from "@clerk/nextjs/server";
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
  const { userId } = await auth();
  const params = await searchParams;
  const missionId = params.missionId;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  const profiles = (await getProfiles()) || [];
  const myRequests = (await getMyRequests()) || [];
  const mySentRequests = (await getMySentRequests()) || [];
  const activeMission = await getMissionData(missionId);

  const { data: myDeeds } = await supabase
    .from("favours")
    .select(
      "*, sender:sender_id(full_name), receiver:receiver_id(full_name), scheduled_date, scheduled_time, exchange_details, sender_signed_off, receiver_signed_off",
    )
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .in("status", ["active", "completed"])
    .order("created_at", { ascending: false });

  const myProfile = profiles.find((p) => p.clerk_id === userId);

  return (
    <main className="min-h-screen bg-kindred-bg p-4 md:p-8 text-kindred-text relative overflow-hidden isolate transition-colors duration-300">
      <NavBar
        userId={userId}
        inboxCount={myRequests.length}
        outboxCount={mySentRequests.length}
      />

      <section className="max-w-6xl mx-auto space-y-12 relative z-10 pt-10">
        {activeMission && <NegotiationCard activeMission={activeMission} />}

        {myProfile && !activeMission ? (
          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-kindred-lime via-emerald-400 to-kindred-blue-glow rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-black/5 dark:bg-white/5 backdrop-blur-3xl border border-black/10 dark:border-white/10 p-8 rounded-[2.5rem] flex flex-col md:flex-row gap-8 items-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-kindred-lime flex items-center justify-center bg-kindred-bg text-4xl font-black text-kindred-text shadow-kindred">
                    {myProfile.full_name.charAt(0)}
                  </div>
                  <div className="absolute -top-2 -right-2 bg-kindred-lime text-kindred-dark text-[11px] font-black px-3 py-1 rounded-full animate-bounce shadow-xl uppercase border-2 border-white dark:border-kindred-dark">
                    {getSaintlyRank(myProfile.halos).icon} Rank
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-4xl font-black text-kindred-text tracking-tighter mb-1 uppercase">
                    {myProfile.full_name}
                  </h2>
                  <div className="bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 px-4 py-2 rounded-full inline-flex items-center gap-2 backdrop-blur-md mt-4">
                    <span className="text-lg">😇</span>
                    <span className="text-xs font-black text-kindred-text uppercase tracking-widest">
                      {myProfile.halos || 0} HALOS
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {myDeeds && myDeeds.length > 0 && (
              <div className="bg-black/5 dark:bg-white/5 rounded-[2rem] p-6 border border-black/5 backdrop-blur-sm">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-kindred-lime/50 mb-4">
                  Kindred Mission Log
                </h3>
                <div className="space-y-4">
                  {myDeeds.map((deed) => {
                    const isReceiver = deed.receiver_id === userId;
                    const partnerName = isReceiver
                      ? deed.sender?.full_name
                      : deed.receiver?.full_name;
                    const partnerId = isReceiver
                      ? deed.sender_id
                      : deed.receiver_id;
                    const isCompleted = deed.status === "completed";

                    const haveIVouched = isReceiver
                      ? deed.receiver_signed_off
                      : deed.sender_signed_off;

                    return (
                      <div
                        key={deed.id}
                        className={`group p-4 rounded-2xl border transition-all ${isCompleted ? "bg-kindred-lime/5 border-kindred-lime/20" : "bg-white/5 border-white/5"}`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={
                              isCompleted
                                ? "text-kindred-lime"
                                : "text-kindred-text/20"
                            }
                          >
                            {isCompleted ? "✨" : "⏳"}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm text-kindred-text font-bold italic mb-2">
                              &ldquo;{deed.favour_text}&rdquo;
                            </p>

                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-kindred-text/40 mb-3 uppercase font-black tracking-tight">
                              <span>
                                📅 {deed.scheduled_date || "TBD"} @{" "}
                                {deed.scheduled_time || "TBD"}
                              </span>
                              <span className="text-kindred-lime/60">
                                🔄 Exchange:{" "}
                                {deed.exchange_details || "Unspecified"}
                              </span>
                            </div>

                            <div className="flex items-center justify-between mt-2 border-t border-white/5 pt-3">
                              <div className="flex gap-3 items-center">
                                <span
                                  className={`text-[9px] px-2 py-0.5 rounded-full uppercase font-black tracking-tighter ${isCompleted ? "bg-kindred-lime text-kindred-dark" : "bg-white/10 text-white/40"}`}
                                >
                                  {isCompleted
                                    ? "Fully Signed Off ✅"
                                    : haveIVouched
                                      ? "Vouched For Partner 🕊️"
                                      : isReceiver
                                        ? "Helping 😇"
                                        : "Requested 🤝"}
                                </span>

                                {!isCompleted && (
                                  <Link
                                    href={`/?missionId=${deed.id}&mode=edit`}
                                    className="text-[9px] font-black uppercase text-kindred-blue-glow hover:text-white transition-colors"
                                  >
                                    Re-negotiate 🔄
                                  </Link>
                                )}

                                {!isCompleted && !haveIVouched && (
                                  <form action={signOffMission}>
                                    <input
                                      type="hidden"
                                      name="favourId"
                                      value={deed.id}
                                    />
                                    <button
                                      type="submit"
                                      className="text-[9px] font-black uppercase bg-kindred-lime text-kindred-dark px-3 py-1 rounded-lg hover:scale-105 transition-transform"
                                    >
                                      Vouch for Partner & Award Halo 😇
                                    </button>
                                  </form>
                                )}
                              </div>
                              <Link
                                href={`/profile/${partnerId}`}
                                className="text-[9px] font-black uppercase text-kindred-text/30 hover:text-kindred-lime transition-colors"
                              >
                                Partner: {partnerName || "Kindred Soul"} →
                              </Link>
                            </div>
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
          userId &&
          !activeMission && (
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
