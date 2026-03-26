import {
  getProfiles,
  sendFavourRequest,
  getMyRequests,
  getMySentRequests,
} from "../actions";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import CommunityGrid from "./CommunityGrid";
import NavBar from "@/components/NavBar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CommunityGridPage() {
  const { userId } = await auth();

  const profiles = (await getProfiles()) || [];
  const myRequests = userId ? (await getMyRequests()) || [] : [];
  const mySentRequests = userId ? (await getMySentRequests()) || [] : [];

  const communityProfiles = profiles.filter((p) => p.clerk_id !== userId);

  return (
    <main className="min-h-screen bg-kindred-bg p-4 md:p-8 text-kindred-text relative overflow-hidden isolate transition-colors duration-300">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-kindred-lime/10 blur-[120px] pointer-events-none -z-10"></div>

      <NavBar
        userId={userId}
        inboxCount={myRequests.length}
        outboxCount={mySentRequests.length}
      />

      <section className="max-w-6xl mx-auto relative z-10">
        <header className="mb-12">
          <Link
            href="/"
            className="text-kindred-lime text-xs font-black uppercase tracking-[0.3em] hover:opacity-70 transition-all flex items-center gap-2 mb-8"
          >
            ← Back to your Profile
          </Link>

          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
            <div className="flex-shrink-0">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2 text-kindred-text leading-none">
                Community Grid
              </h1>
              <p className="text-kindred-lime/60 text-[10px] font-bold uppercase tracking-widest">
                The network of Guardians and Saints ready to help
              </p>
            </div>
          </div>
        </header>

        {/* The CommunityGrid component should handle its own 'searchTerm' state internally */}
        <CommunityGrid
          communityProfiles={communityProfiles}
          userId={userId}
          sendFavourRequest={sendFavourRequest}
        />
      </section>
    </main>
  );
}
