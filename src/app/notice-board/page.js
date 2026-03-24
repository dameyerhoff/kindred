import {
  getPublicNoticeBoard,
  getMyRequests,
  getMySentRequests,
} from "../actions";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import NoticeBoardGrid from "./NoticeBoardGrid";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// This builds the main page for the Notice Board where all help requests live
export default async function NoticeBoard() {
  // Check to see who is currently logged in
  const { userId } = await auth();

  // Go and get all the active help missions and message counts
  const openMissions = await getPublicNoticeBoard();
  const myRequests = userId ? (await getMyRequests()) || [] : [];
  const mySentRequests = userId ? (await getMySentRequests()) || [] : [];

  return (
    <main className="min-h-screen bg-[#061a06] p-4 md:p-8 text-white relative overflow-hidden isolate">
      {/* This adds a pretty green glow at the top of the screen */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-green-500/10 blur-[120px] pointer-events-none -z-10"></div>

      {/* This is the top bar with the logo and all our navigation buttons */}
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-16 relative z-10 border-b border-white/10 pb-8">
        <div>
          <Link href="/">
            <img
              src="/kindred-logo.png"
              alt="Kindred Logo"
              className="h-20 w-auto object-contain"
            />
          </Link>
        </div>
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
            className="hidden md:flex bg-lime-400 text-green-950 border border-lime-400 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all items-center gap-2 shadow-[0_0_15px_rgba(163,230,53,0.4)]"
          >
            The Notice Board 📜
          </Link>

          {/* Inbox and Outbox added specifically to the header for this tab */}
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

          <div className="scale-125 ml-2">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      {/* Main Content Sections Below... */}
      <section className="max-w-6xl mx-auto relative z-10">
        <header className="mb-12">
          <Link
            href="/"
            className="text-lime-400 text-xs font-black uppercase tracking-[0.3em] hover:text-white transition-colors flex items-center gap-2 mb-8"
          >
            ← Back to your Profile
          </Link>
          <h1 className="text-5xl font-black tracking-tighter mb-2 text-white">
            Notice Board
          </h1>
          <p className="text-lime-400/60 text-sm font-bold uppercase tracking-widest">
            Active Missions in the Kindred Network
          </p>
        </header>

        <NoticeBoardGrid openMissions={openMissions} userId={userId} />
      </section>
    </main>
  );
}
