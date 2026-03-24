import {
  getPublicNoticeBoard,
  getMyRequests,
  getMySentRequests,
} from "../actions";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import NoticeBoardGrid from "./NoticeBoardGrid";
import NavBar from "@/components/NavBar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// This builds the main page for the Notice Board where all help requests live
export default async function NoticeBoard() {
  // Check to see who is currently logged in
  const { userId } = await auth();
  // Go and get all the active help missions from our database
  const openMissions = await getPublicNoticeBoard();
  const myRequests = userId ? (await getMyRequests()) || [] : [];
  const mySentRequests = userId ? (await getMySentRequests()) || [] : [];

  return (
    <main className="min-h-screen bg-kindred-dark p-4 md:p-8 text-white relative overflow-hidden isolate">
      {/* This adds a pretty green glow at the top of the screen */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-kindred-lime/10 blur-[120px] pointer-events-none -z-10"></div>

      {/* This is the top bar with the logo and all our navigation buttons */}
      <NavBar
        userId={userId}
        inboxCount={myRequests.length}
        outboxCount={mySentRequests.length}
      />

      {/* This section holds the main title and the grid where missions are displayed */}
      <section className="max-w-6xl mx-auto relative z-10">
        <header className="mb-12">
          {/* This button takes you back to your own profile page */}
          <Link
            href="/"
            className="text-kindred-lime text-xs font-black uppercase tracking-[0.3em] hover:text-white transition-colors flex items-center gap-2 mb-8"
          >
            ← Back to your Profile
          </Link>
          <h1 className="text-5xl font-black tracking-tighter mb-2 text-white">
            Notice Board
          </h1>
          <p className="text-kindred-lime/60 text-sm font-bold uppercase tracking-widest">
            Active Missions in the Kindred Network
          </p>
        </header>

        {/* This puts the actual list of help missions onto the page */}
        <NoticeBoardGrid openMissions={openMissions} userId={userId} />
      </section>
    </main>
  );
}
