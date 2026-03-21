import {
  getProfiles,
  awardHalo,
  sendFavourRequest,
  getMyRequests,
  completeFavour,
} from "./actions";
import { UserButton } from "@clerk/nextjs";
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
  const { count, error: countError } = await tempClient
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const profiles = (await getProfiles()) || [];
  const myRequests = (await getMyRequests()) || [];

  console.log("DEBUG: --- CONNECTION DIAGNOSTIC ---");
  console.log("DEBUG: Raw Row Count in 'profiles':", count);
  console.log("DEBUG: Profiles array length:", profiles.length);
  console.log("DEBUG: ---------------------------");

  const myProfile = profiles.find((p) => p.clerk_id === userId);
  const communityProfiles = profiles.filter((p) => p.clerk_id !== userId);

  return (
    <main className="min-h-screen bg-[#061a06] p-4 md:p-8 text-white relative overflow-hidden">
      {/* Dave: Brightness layer - subtle radial glow at the top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-green-500/10 blur-[120px] pointer-events-none"></div>

      {/* --- HEADER --- */}
      <header className="max-w-6xl mx-auto flex justify-between items-end mb-16 relative z-10 border-b border-white/10 pb-8">
        <div>
          {/* Dave: Massive Logo (h-32) - clean and high impact */}
          <img
            src="/kindred-logo.png"
            alt="Kindred Logo"
            className="h-32 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          />
        </div>

        <div className="flex items-center gap-6 pb-4">
          {userId && (
            <div className="relative group cursor-help">
              {/* Dave: Vibrancy check - using a bright Lime spinner */}
              <div className="w-12 h-12 border-2 border-dashed border-lime-400 rounded-full animate-[spin_8s_linear_infinite] absolute inset-0"></div>
              <div className="w-12 h-12 flex items-center justify-center font-black text-lime-400 bg-green-950 rounded-full relative z-10 border border-lime-400/50 shadow-[0_0_20px_rgba(163,230,53,0.4)]">
                {myRequests.length}
              </div>
              <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-black bg-lime-500 text-green-950 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-20 uppercase tracking-tighter">
                😇 Favour Inbox
              </span>
            </div>
          )}
          <div className="scale-125">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto space-y-12 relative z-10">
        {/* --- 1. TOP-LEVEL INBOX --- */}
        {userId && myRequests.length > 0 ? (
          <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-6 rounded-[2rem] shadow-[0_20px_50px_rgba(16,185,129,0.3)] border border-white/20">
            <h2 className="text-xl font-black mb-6 flex items-center gap-3 text-white uppercase tracking-tight">
              <span className="bg-white/20 p-2 rounded-lg animate-bounce">
                📬
              </span>{" "}
              Incoming Kindred Requests
            </h2>
            <div className="grid gap-4">
              {myRequests.map((req, index) => (
                <div
                  key={req.id || index}
                  className="bg-white/10 backdrop-blur-xl p-5 rounded-2xl flex justify-between items-center border border-white/20 hover:bg-white/15 transition-all"
                >
                  <div className="pr-4">
                    <p className="text-white text-lg font-bold leading-tight">
                      "{req.favour_text}"
                    </p>
                    <p className="text-[10px] text-emerald-100 mt-2 uppercase font-black tracking-[0.2em]">
                      Community Favour
                    </p>
                  </div>
                  <form
                    action={completeFavour.bind(null, req.id, req.receiver_id)}
                  >
                    <button
                      type="submit"
                      className="bg-white text-emerald-700 px-6 py-3 rounded-xl font-black text-xs hover:bg-lime-400 hover:text-green-900 transition-all shadow-2xl active:scale-95 whitespace-nowrap uppercase"
                    >
                      HELP & EARN 😇
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        ) : (
          userId && (
            <div className="border-2 border-dashed border-white/5 rounded-[2rem] p-6 text-center">
              <p className="text-white/20 text-xs font-black uppercase tracking-[0.4em]">
                Inbox Clear • Spirit Strong
              </p>
            </div>
          )
        )}

        {/* --- 2. THE HERO PROFILE BOX --- */}
        {myProfile ? (
          <div className="relative group">
            {/* Dave: Bright multi-color glow for S-Rank */}
            <div className="absolute -inset-1 bg-gradient-to-r from-lime-400 via-emerald-400 to-green-500 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] flex flex-col md:flex-row gap-8 items-center">
              <div className="relative">
                <div className="w-24 h-24 rounded-full border-4 border-lime-400 flex items-center justify-center bg-green-900 text-4xl font-black text-white shadow-[0_0_30px_rgba(163,230,53,0.3)]">
                  {myProfile.full_name.charAt(0)}
                </div>
                <div className="absolute -top-2 -right-2 bg-white text-green-900 text-[11px] font-black px-3 py-1 rounded-full animate-bounce shadow-xl uppercase tracking-tighter border-2 border-lime-400">
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
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <div className="bg-white/10 border border-white/20 px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-md">
                    <span className="text-lg">😇</span>
                    <span className="text-xs font-black text-white uppercase tracking-widest">
                      {myProfile.halos || 0} HALOS EARNED
                    </span>
                  </div>
                  <Link
                    href="/setup"
                    className="bg-white/5 hover:bg-white/10 text-white px-5 py-2 rounded-full text-xs font-black transition border border-white/20 uppercase tracking-widest"
                  >
                    Manage Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          userId && (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-10 rounded-[2.5rem] text-center">
              <p className="text-white/60 text-lg mb-6 italic">
                Preparing your kindred spirit... 😇
              </p>
              <Link
                href="/setup"
                className="bg-emerald-500 hover:bg-lime-400 text-white hover:text-green-950 px-8 py-3 rounded-2xl font-black transition-all shadow-2xl"
              >
                START YOUR JOURNEY
              </Link>
            </div>
          )
        )}

        {/* --- 3. THE COMMUNITY GRID --- */}
        <div>
          <div className="flex items-center gap-6 mb-8">
            <h2 className="text-xs font-black uppercase tracking-[0.5em] text-white/40">
              The Kindred Grid
            </h2>
            <div className="h-[2px] bg-gradient-to-r from-white/10 to-transparent flex-1"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communityProfiles.length > 0 ? (
              communityProfiles.map((profile) => (
                <div
                  key={profile.clerk_id}
                  className="bg-white/5 p-6 rounded-3xl border border-white/10 hover:border-lime-400/50 hover:bg-white/10 transition-all group shadow-2xl relative overflow-hidden"
                >
                  {/* Subtle inner glow for hover */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-lime-400/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div className="flex justify-between items-start mb-6 relative z-10">
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

                  <div className="mt-auto border-t border-white/10 pt-5 relative z-10">
                    <p className="text-xs text-lime-400/60 font-black uppercase tracking-widest text-center">
                      Ready to help 😇
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white/30 text-sm italic">
                Waiting for kindred spirits to appear... 😇
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
