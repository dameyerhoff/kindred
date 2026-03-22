import {
  getProfiles,
  sendFavourRequest,
  getMyRequests,
  getMySentRequests,
} from "./actions";
import { UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
// Dave: Diagnostic tracer intact
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const { userId } = await auth();

  // --- DIAGNOSTIC TRACER: RAW CONNECTION CHECK ---
  const tempClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  const profiles = (await getProfiles()) || [];
  const myRequests = (await getMyRequests()) || [];
  const mySentRequests = (await getMySentRequests()) || [];

  const { data: myDeeds } = await tempClient
    .from("favours")
    .select("*")
    .eq("receiver_id", userId)
    .eq("status", "completed")
    .order("id", { ascending: false })
    .limit(5);

  const myProfile = profiles.find((p) => p.clerk_id === userId);
  const communityProfiles = profiles.filter((p) => p.clerk_id !== userId);

  return (
    /* Dave: Added "isolate" to ensure Clerk's external portal doesn't get trapped in our stack */
    <main className="min-h-screen bg-[#061a06] p-4 md:p-8 text-white relative overflow-hidden isolate">
      {/* Dave: Set z-index to -10 to push the glow behind EVERYTHING, including the background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-green-500/10 blur-[120px] pointer-events-none -z-10"></div>

      {/* --- HEADER --- */}
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-16 relative z-10 border-b border-white/10 pb-8">
        <div>
          <img
            src="/kindred-logo.png"
            alt="Kindred Logo"
            className="h-20 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          />
        </div>

        <div className="flex items-center gap-6">
          {!userId ? (
            <SignUpButton mode="modal">
              <button className="bg-lime-400 hover:bg-white text-green-950 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(163,230,53,0.4)]">
                Join Community 😇
              </button>
            </SignUpButton>
          ) : (
            <div className="scale-125">
              <UserButton afterSignOutUrl="/" />
            </div>
          )}
        </div>
      </header>

      <section className="max-w-6xl mx-auto space-y-12 relative z-10">
        {/* --- THE HERO PROFILE BOX (Top Spot) --- */}
        {myProfile ? (
          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-lime-400 via-emerald-400 to-green-500 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] flex flex-col md:flex-row gap-8 items-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-4 border-lime-400 flex items-center justify-center bg-green-900 text-4xl font-black text-white shadow-[0_0_30px_rgba(163,230,53,0.3)]">
                    {myProfile.full_name.charAt(0)}
                  </div>
                  <div className="absolute -top-2 -right-2 bg-white text-green-950 text-[11px] font-black px-3 py-1 rounded-full animate-bounce shadow-xl uppercase border-2 border-lime-400">
                    S-Rank 😇
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-4xl font-black text-white tracking-tighter mb-1">
                    {myProfile.full_name}
                  </h2>
                  <p className="text-lime-400/80 text-sm font-bold uppercase tracking-widest mb-4">
                    {myProfile.city} • Kindred Guardian
                  </p>

                  {/* Dave: Hero Profile Tag Display */}
                  {myProfile.tags && myProfile.tags.length > 0 && (
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                      {myProfile.tags.map((tag, idx) => (
                        <span
                          key={`hero-tag-${idx}`}
                          className="bg-lime-400/10 border border-lime-400/30 text-lime-400 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter"
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap justify-center md:justify-start gap-4 items-center">
                    <div className="bg-white/10 border border-white/20 px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-md">
                      <span className="text-lg">😇</span>
                      <span className="text-xs font-black text-white uppercase tracking-widest">
                        {myProfile.halos || 0} HALOS
                      </span>
                    </div>

                    <Link
                      href="/setup"
                      className="bg-white/5 hover:bg-white/10 text-white px-5 py-2 rounded-full text-xs font-black transition border border-white/20 uppercase tracking-widest"
                    >
                      Manage Profile
                    </Link>

                    <div className="flex gap-2">
                      <Link
                        href="/inbox"
                        className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 px-3 py-2 rounded-xl hover:bg-emerald-500/40 transition-all group relative"
                      >
                        <span className="text-base">📬</span>
                        <span className="text-sm font-black text-emerald-400">
                          {myRequests.length}
                        </span>
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-green-950 text-[8px] px-2 py-1 rounded font-black opacity-0 group-hover:opacity-100 uppercase transition-opacity whitespace-nowrap">
                          Open Inbox
                        </span>
                      </Link>

                      <Link
                        href="/outbox"
                        className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 px-3 py-2 rounded-xl hover:bg-blue-500/40 transition-all group relative"
                      >
                        <span className="text-base">📤</span>
                        <span className="text-sm font-black text-blue-400">
                          {mySentRequests.length}
                        </span>
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-green-950 text-[8px] px-2 py-1 rounded font-black opacity-0 group-hover:opacity-100 uppercase transition-opacity whitespace-nowrap">
                          View Sent
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {myDeeds && myDeeds.length > 0 && (
              <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5 backdrop-blur-sm">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-lime-400/50 mb-4">
                  Recent Kindred Deeds
                </h3>
                <div className="space-y-3">
                  {myDeeds.map((deed) => (
                    <div
                      key={deed.id}
                      className="flex items-center gap-3 text-sm text-white/40 border-b border-white/5 pb-2 last:border-0 last:pb-0"
                    >
                      <span className="text-lime-400">✨</span>
                      <span className="italic flex-1">
                        &ldquo;{deed.favour_text}&rdquo;
                      </span>
                      <span className="text-[9px] bg-lime-500/10 text-lime-400 px-2 py-0.5 rounded-full uppercase font-black tracking-tighter">
                        Completed 😇
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          userId && (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2.5rem] text-center">
              <p className="text-white/60 text-lg mb-6 italic">
                Preparing your spirit... 😇
              </p>
              <Link
                href="/setup"
                className="bg-emerald-500 hover:bg-lime-400 text-white hover:text-green-950 px-8 py-3 rounded-2xl font-black transition-all shadow-2xl uppercase"
              >
                Start Journey
              </Link>
            </div>
          )
        )}

        {/* --- THE COMMUNITY GRID --- */}
        <div>
          <div className="flex items-center gap-6 mb-8">
            <h2 className="text-xs font-black uppercase tracking-[0.5em] text-white/40">
              The Community Grid
            </h2>
            <div className="h-[2px] bg-gradient-to-r from-white/10 to-transparent flex-1"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communityProfiles.map((profile) => (
              <div
                key={profile.clerk_id}
                className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:border-lime-400/50 hover:bg-white/10 transition-all group shadow-2xl relative overflow-hidden flex flex-col"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div>
                    <h3 className="text-xl font-black text-white group-hover:text-lime-400 transition-colors">
                      {profile.full_name}
                    </h3>
                    <p className="text-xs font-bold text-white/40 uppercase tracking-widest mt-1">
                      {profile.city}
                    </p>
                  </div>
                  <div className="flex items-center bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                    <span className="text-sm">😇</span>
                    <span className="text-xs font-black text-lime-400 ml-2">
                      {profile.halos || 0}
                    </span>
                  </div>
                </div>

                {/* Dave: Community Card Tag Display */}
                {profile.tags && profile.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-6 relative z-10">
                    {profile.tags.slice(0, 4).map((tag, idx) => (
                      <span
                        key={`${profile.clerk_id}-tag-${idx}`}
                        className="bg-white/5 text-white/60 text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter border border-white/5"
                      >
                        {tag.label}
                      </span>
                    ))}
                    {profile.tags.length > 4 && (
                      <span className="text-[8px] font-black text-lime-400/50 self-center">
                        +{profile.tags.length - 4} more
                      </span>
                    )}
                  </div>
                )}

                {userId ? (
                  <form
                    action={sendFavourRequest}
                    className="relative z-10 mt-auto pt-4 border-t border-white/10"
                  >
                    <input
                      type="hidden"
                      name="receiverId"
                      value={profile.clerk_id}
                    />
                    <textarea
                      name="favourText"
                      placeholder="What favour do you need?..."
                      required
                      className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-lime-400/50 transition-all resize-none h-20 mb-3"
                    />
                    <button
                      type="submit"
                      className="w-full bg-white/10 hover:bg-lime-400 text-white hover:text-green-950 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 hover:border-lime-400"
                    >
                      Send Favour Request 😇
                    </button>
                  </form>
                ) : (
                  <div className="mt-auto pt-4 border-t border-white/10">
                    <SignInButton mode="modal">
                      <button className="w-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10">
                        Log in to ask a favour 😇
                      </button>
                    </SignInButton>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
