import { getProfiles, getMyRequests, getMySentRequests } from "./actions";
import { UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
// Diagnostic tracer intact
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// This part helps decide what name and picture to show based on how many points someone has
const getSaintlyRank = (halos = 0) => {
  if (halos >= 50) return { title: "Kindred Legend", icon: "👑" };
  if (halos >= 25) return { title: "Arch-Guardian", icon: "🕊️" };
  if (halos >= 10) return { title: "S-Rank Guardian", icon: "✨" };
  if (halos >= 5) return { title: "Kindred Guardian", icon: "🛡️" };
  return { title: "Level 1 Saint", icon: "🌱" };
};

// This is the main front page where you see your profile and stats
export default async function Home() {
  // Check who is logged in right now
  const { userId } = await auth();

  // Connect to the database to check the connection
  const tempClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

  // Get all the info about profiles and help requests from the database
  const profiles = (await getProfiles()) || [];
  const myRequests = (await getMyRequests()) || [];
  const mySentRequests = (await getMySentRequests()) || [];

  // Get a list of the last 5 good deeds finished
  const { data: myDeeds } = await tempClient
    .from("favours")
    .select("*")
    .eq("receiver_id", userId)
    .eq("status", "completed")
    .order("id", { ascending: false })
    .limit(5);

  // Find the specific profile for this user in the list
  const myProfile = profiles.find((p) => p.clerk_id === userId);

  return (
    <main className="min-h-screen bg-[#061a06] p-4 md:p-8 text-white relative overflow-hidden isolate">
      {/* This adds a pretty green glow at the top of the screen */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-green-500/10 blur-[120px] pointer-events-none -z-10"></div>

      {/* This is the top bar with the logo and the navigation buttons */}
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-16 relative z-10 border-b border-white/10 pb-8">
        <div>
          <Link href="/">
            <img
              src="/kindred-logo.png"
              alt="Kindred Logo"
              className="h-20 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            />
          </Link>
        </div>

        {/* These links let you click between the Map, Grid, and Notice Board */}
        <div className="flex items-center gap-3">
          <Link
            href="/favour-map"
            className="hidden md:flex bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all items-center gap-2"
          >
            Favour Map 🗺️
          </Link>
          <Link
            href="/community"
            className="hidden md:flex bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all items-center gap-2"
          >
            Community Grid 🌐
          </Link>
          <Link
            href="/notice-board"
            className="hidden md:flex bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all items-center gap-2"
          >
            The Notice Board 📜
          </Link>

          {/* Inbox and Outbox added to the header, visible when logged in */}
          {userId && (
            <>
              <Link
                href="/inbox"
                className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 px-3 py-2 rounded-xl hover:bg-emerald-500/40 transition-all"
              >
                <span className="text-sm">📬</span>
                <span className="text-[10px] font-black text-emerald-400 uppercase">
                  {myRequests.length}
                </span>
              </Link>

              <Link
                href="/outbox"
                className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 px-3 py-2 rounded-xl hover:bg-blue-500/40 transition-all"
              >
                <span className="text-sm">📤</span>
                <span className="text-[10px] font-black text-blue-400 uppercase">
                  {mySentRequests.length}
                </span>
              </Link>
            </>
          )}

          {/* Profile button highlighted for the Home page */}
          <Link
            href="/"
            className="bg-lime-400 text-green-950 border border-lime-400 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all items-center gap-2 ml-2 shadow-[0_0_15px_rgba(163,230,53,0.4)]"
          >
            Profile 👤
          </Link>

          <Link
            href="/about-us"
            className="hidden md:flex bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all items-center gap-2"
          >
            About Us 💚
          </Link>

          {/* If nobody is logged in, show the join button. Otherwise, show the user icon. */}
          {!userId ? (
            <SignUpButton mode="modal">
              <button className="bg-lime-400 hover:bg-white text-green-950 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(163,230,53,0.4)] ml-2">
                Join Community 😇
              </button>
            </SignUpButton>
          ) : (
            <div className="scale-125 ml-2">
              <UserButton afterSignOutUrl="/" />
            </div>
          )}
        </div>
      </header>

      {/* This section holds the main content where profile details are displayed */}
      <section className="max-w-6xl mx-auto space-y-12 relative z-10">
        {myProfile ? (
          <div className="space-y-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-lime-400 via-emerald-400 to-green-500 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] flex flex-col md:flex-row gap-8 items-center">
                <div className="relative">
                  {/* Shows the first letter of the name in a circle */}
                  <div className="w-24 h-24 rounded-full border-4 border-lime-400 flex items-center justify-center bg-green-900 text-4xl font-black text-white shadow-[0_0_30px_rgba(163,230,53,0.3)]">
                    {myProfile.full_name.charAt(0)}
                  </div>
                  {/* Shows the rank icon */}
                  <div className="absolute -top-2 -right-2 bg-white text-green-950 text-[11px] font-black px-3 py-1 rounded-full animate-bounce shadow-xl uppercase border-2 border-lime-400">
                    {getSaintlyRank(myProfile.halos).icon} Rank
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  {/* Shows the full name */}
                  <h2 className="text-4xl font-black text-white tracking-tighter mb-1">
                    {myProfile.full_name}
                  </h2>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
                    {/* Shows the city and rank title */}
                    <p className="text-lime-400/80 text-sm font-bold uppercase tracking-widest">
                      {myProfile.city} • {getSaintlyRank(myProfile.halos).title}
                    </p>
                    {myProfile.postcode && (
                      <span className="bg-white/5 border border-white/10 text-[9px] text-white/40 px-2 py-0.5 rounded-md font-black uppercase tracking-tighter">
                        {myProfile.postcode.split(" ")[0]}
                      </span>
                    )}
                  </div>

                  {/* Shows the list of skills picked */}
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
                    {/* Shows how many halo points have been earned */}
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

                    {/* Shows the inbox and outbox buttons with message counts */}
                    <div className="flex gap-2">
                      <Link
                        href="/inbox"
                        className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 px-3 py-2 rounded-xl hover:bg-emerald-500/40 transition-all group relative"
                      >
                        <span className="text-base">📬</span>
                        <span className="text-sm font-black text-emerald-400">
                          {myRequests.length}
                        </span>
                        <span
                          className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-green-950 text-[8px] px-2 py-1 rounded font-black opacity-0 group-hover:opacity-100 uppercase transition-opacity whitespace-nowrap"
                          style={{ zIndex: 50 }}
                        >
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
                        <span
                          className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-green-950 text-[8px] px-2 py-1 rounded font-black opacity-0 group-hover:opacity-100 uppercase transition-opacity whitespace-nowrap"
                          style={{ zIndex: 50 }}
                        >
                          View Sent
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* If there are good deeds finished recently, they show up here in a list */}
            {myDeeds && myDeeds.length > 0 && (
              <div className="bg-white/5 rounded-[2rem] p-6 border border-white/5 backdrop-blur-sm">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-lime-400/50 mb-4">
                  Recent Kindred Deeds
                </h3>
                <div className="space-y-3">
                  {myDeeds.map((deed) => (
                    <div
                      key={deed.id}
                      className="flex items-center gap-3 text-sm text-white/40 border-b border-white/5 last:border-0 last:pb-0 pb-2"
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
          /* If someone is logged in but has no profile yet, this shows the start button */
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
      </section>
    </main>
  );
}
