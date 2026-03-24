import { getProfiles, sendFavourRequest } from "../actions";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import CommunityGrid from "./CommunityGrid";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// This is the main page that shows the big list of everyone in the community
export default async function CommunityGridPage() {
  // Check who is logged in right now
  const { userId } = await auth();
  // Get all the member profiles from the database
  const profiles = (await getProfiles()) || [];

  // This makes sure you do not see your own name in the list of people to help
  const communityProfiles = profiles.filter((p) => p.clerk_id !== userId);

  return (
    <main className="min-h-screen bg-[#061a06] p-4 md:p-8 text-white relative overflow-hidden isolate">
      {/* This adds a pretty green glow at the top of the screen */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-green-500/10 blur-[120px] pointer-events-none -z-10"></div>

      {/* This is the top bar with the logo and all the navigation buttons */}
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

        {/* These are the buttons to move between the map, the grid, and the notice board */}
        <div className="flex items-center gap-3">
          <Link
            href="/favour-map"
            className="hidden md:flex bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all items-center gap-2"
          >
            Favour Map 🗺️
          </Link>
          <Link
            href="/community"
            className="hidden md:flex bg-lime-400 text-green-950 border border-lime-400 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all items-center gap-2 shadow-[0_0_15px_rgba(163,230,53,0.4)]"
          >
            Community Grid 🌐
          </Link>
          <Link
            href="/notice-board"
            className="hidden md:flex bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all items-center gap-2"
          >
            The Notice Board 📜
          </Link>

          <Link
            href="/"
            className="bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all items-center gap-2 ml-2"
          >
            Profile 👤
          </Link>
          <Link
            href="/about-us"
            className="hidden md:flex bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all items-center gap-2"
          >
            About Us 💚
          </Link>

          {/* This is the little circle button for your account settings */}
          <div className="scale-125 ml-2">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      {/* This is the main part of the page where the titles and the grid are kept */}
      <section className="max-w-6xl mx-auto relative z-10">
        <header className="mb-12">
          <Link
            href="/"
            className="text-lime-400 text-xs font-black uppercase tracking-[0.3em] hover:text-white transition-colors flex items-center gap-2 mb-8"
          >
            ← Back to your Profile
          </Link>
          <h1 className="text-5xl font-black tracking-tighter mb-2 text-white">
            Community Grid
          </h1>
          <p className="text-lime-400/60 text-sm font-bold uppercase tracking-widest">
            The network of Guardians and Saints ready to help
          </p>
        </header>

        {/* This puts the actual grid of people onto the page */}
        <CommunityGrid
          communityProfiles={communityProfiles}
          userId={userId}
          sendFavourRequest={sendFavourRequest}
        />
      </section>
    </main>
  );
}
