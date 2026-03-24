import {
  getPublicNoticeBoard,
  getMyRequests,
  getMySentRequests,
} from "../actions";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import FavourMapClient from "./FavourMapClient";
import NavBar from "@/components/NavBar";

export const dynamic = "force-dynamic";

// This builds the page that shows the map of all the favours
export default async function FavourMapPage() {
  // Check who is logged in right now
  const { userId } = await auth();
  // Get all the help requests from the notice board to show them on the map
  const openMissions = await getPublicNoticeBoard();
  const myRequests = userId ? (await getMyRequests()) || [] : [];
  const mySentRequests = userId ? (await getMySentRequests()) || [] : [];

  return (
    <main className="min-h-screen bg-kindred-dark p-4 md:p-8 text-white relative overflow-hidden isolate">
      {/* This adds a soft green light to the background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-kindred-lime/10 blur-[120px] pointer-events-none -z-10"></div>

      {/* This is the top section with the logo and all the navigation links */}
      <NavBar
        userId={userId}
        inboxCount={myRequests.length}
        outboxCount={mySentRequests.length}
      />
      <section className="max-w-6xl mx-auto relative z-10">
        <header className="mb-12">
          <Link
            href="/"
            className="text-kindred-lime text-xs font-black uppercase tracking-[0.3em] hover:text-white transition-colors flex items-center gap-2 mb-8"
          >
            ← Back to your Profile
          </Link>
          <h1 className="text-5xl font-black tracking-tighter mb-2 text-white">
            Favour Map
          </h1>
          <p className="text-kindred-lime/60 text-sm font-bold uppercase tracking-widest">
            Visualise Kindred Deeds across the UK
          </p>
        </header>

        {/* This is the part that draws the interactive Google Map on the screen */}
        <FavourMapClient
          openMissions={openMissions}
          userId={userId}
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        />
      </section>
    </main>
  );
}
