import { getProfiles } from "../../actions";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import NavBar from "@/components/NavBar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const getSaintlyRank = (halos = 0) => {
  if (halos >= 50) return { title: "Kindred Legend", icon: "👑" };
  if (halos >= 25) return { title: "Arch-Guardian", icon: "🕊️" };
  if (halos >= 10) return { title: "S-Rank Guardian", icon: "✨" };
  if (halos >= 5) return { title: "Kindred Guardian", icon: "🛡️" };
  return { title: "Level 1 Saint", icon: "🌱" };
};

export default async function PublicProfilePage({ params }) {
  const { id } = await params;
  const { userId: myId } = await auth();

  const tempClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  const profiles = (await getProfiles()) || [];

  // Find the user being viewed based on the ID in the URL
  const profile = profiles.find((p) => p.clerk_id === id);

  // FIXED: Select now explicitly includes negotiation columns
  const { data: theirDeeds } = await tempClient
    .from("favours")
    .select(
      "*, sender:sender_id(full_name), receiver:receiver_id(full_name), scheduled_date, scheduled_time, exchange_details",
    )
    .eq("status", "completed")
    .or(`sender_id.eq.${id},receiver_id.eq.${id}`)
    .order("created_at", { ascending: false });

  if (!profile) {
    return (
      <main className="min-h-screen bg-kindred-bg p-8 text-center text-kindred-text">
        <h1 className="text-2xl font-black uppercase">Soul Not Found</h1>
        <Link
          href="/community"
          className="text-kindred-lime underline mt-4 inline-block tracking-widest"
        >
          Back to Community
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-kindred-bg p-4 md:p-8 text-kindred-text relative overflow-hidden isolate">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-kindred-lime/10 blur-[120px] pointer-events-none -z-10"></div>

      <NavBar userId={myId} />

      <section className="max-w-6xl mx-auto space-y-12 relative z-10 pt-10">
        <Link
          href="/community"
          className="text-[10px] font-black text-kindred-lime uppercase tracking-[0.3em] hover:opacity-70"
        >
          ← Back to Community
        </Link>

        {/* Profile Hero Card */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-kindred-lime via-emerald-400 to-kindred-blue-glow rounded-[2.5rem] blur-xl opacity-20 transition duration-1000"></div>
          <div className="relative bg-black/5 dark:bg-white/5 backdrop-blur-3xl border border-black/10 dark:border-white/10 p-8 rounded-[2.5rem] flex flex-col md:flex-row gap-8 items-center">
            <div className="w-24 h-24 rounded-full border-4 border-kindred-lime flex items-center justify-center bg-kindred-bg text-4xl font-black shadow-kindred">
              {profile.full_name?.charAt(0)}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-4xl font-black tracking-tighter mb-1 uppercase">
                {profile.full_name}
              </h2>
              <p className="text-kindred-lime/80 text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                {profile.city} • {getSaintlyRank(profile.halos).title}{" "}
                {getSaintlyRank(profile.halos).icon}
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                {profile.tags?.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-kindred-lime/10 border border-kindred-lime/30 text-kindred-lime text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter"
                  >
                    {tag.label}
                  </span>
                ))}
              </div>

              <div className="bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/20 px-4 py-2 rounded-full inline-flex items-center gap-2">
                <span className="text-lg">😇</span>
                <span className="text-xs font-black uppercase tracking-widest">
                  {profile.halos || 0} HALOS
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Their History Feed */}
        {theirDeeds?.length > 0 && (
          <div className="bg-black/5 dark:bg-white/5 rounded-[2rem] p-6 border border-black/5 backdrop-blur-sm shadow-inner">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-kindred-lime/50 mb-4">
              Deed History
            </h3>
            <div className="space-y-4">
              {theirDeeds.map((deed) => {
                const isProfileOwnerSender = deed.sender_id === id;
                const partnerName = isProfileOwnerSender
                  ? deed.receiver?.full_name || "Kindred Soul"
                  : deed.sender?.full_name || "Kindred Soul";
                const partnerId = isProfileOwnerSender
                  ? deed.receiver_id
                  : deed.sender_id;

                return (
                  <div
                    key={deed.id}
                    className="group bg-white/5 p-4 rounded-2xl border border-white/5 hover:border-kindred-lime/20 transition-all"
                  >
                    <div className="flex flex-col gap-1">
                      <p className="text-sm italic font-bold text-kindred-text/80">
                        &ldquo;{deed.favour_text}&rdquo;
                      </p>

                      {/* Display negotiation details */}
                      {(deed.scheduled_date || deed.exchange_details) && (
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-kindred-text/40 uppercase font-black tracking-tight mt-1">
                          {deed.scheduled_date && (
                            <span>
                              📅 {deed.scheduled_date} @ {deed.scheduled_time}
                            </span>
                          )}
                          {deed.exchange_details && (
                            <span className="text-kindred-lime/60">
                              🔄 Exchange: {deed.exchange_details}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[8px] bg-kindred-lime/10 text-kindred-lime px-2 py-0.5 rounded-full uppercase font-black tracking-tighter">
                          {isProfileOwnerSender ? "Requested 🤝" : "Helper 😇"}
                        </span>

                        <Link
                          href={`/profile/${partnerId}`}
                          className="text-[9px] text-kindred-lime/60 font-black uppercase tracking-widest hover:text-kindred-lime transition-colors"
                        >
                          Partner: {partnerName} →
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
