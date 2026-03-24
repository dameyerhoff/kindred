import {
  getProfiles,
  sendFavourRequest,
  getMyRequests,
  getMySentRequests,
} from "../actions";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import CommunityGrid from "./CommunityGrid";
import NavBar from "@/components/NavBar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// This is the main page that shows the big list of everyone in the community
export default async function CommunityGridPage() {
  // Check who is logged in right now
  const { userId } = await auth();
  // Get all the member profiles from the database
  const profiles = (await getProfiles()) || [];

  const myRequests = userId ? (await getMyRequests()) || [] : [];
  const mySentRequests = userId ? (await getMySentRequests()) || [] : [];

  // This makes sure you do not see your own name in the list of people to help
  const communityProfiles = profiles.filter((p) => p.clerk_id !== userId);

  return (
    <main className="min-h-screen bg-kindred-dark p-4 md:p-8 text-white relative overflow-hidden isolate">
      {/* This adds a pretty green glow at the top of the screen */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-kindred-lime/10 blur-[120px] pointer-events-none -z-10"></div>

      {/* This is the top bar with the logo and all the navigation buttons */}
      <NavBar
        userId={userId}
        inboxCount={myRequests.length}
        outboxCount={mySentRequests.length}
      />
      {/* This is the main part of the page where the titles and the grid are kept */}
      <section className="max-w-6xl mx-auto relative z-10">
        <header className="mb-12">
          <Link
            href="/"
            className="text-kindred-lime text-xs font-black uppercase tracking-[0.3em] hover:text-white transition-colors flex items-center gap-2 mb-8"
          >
            ← Back to your Profile
          </Link>
          <h1 className="text-5xl font-black tracking-tighter mb-2 text-white">
            Community Grid
          </h1>
          <p className="text-kindred-lime/60 text-sm font-bold uppercase tracking-widest">
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
