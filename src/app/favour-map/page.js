import {
  getPublicNoticeBoard,
  getMyRequests,
  getMySentRequests,
} from "../actions";
import Link from "next/link";
import FavourMapClient from "./FavourMapClient";
import NavBar from "@/components/NavBar";

export const dynamic = "force-dynamic";

export default async function FavourMapPage() {
  // DYNAMIC IMPORT FIX
  const { auth } = await import("@clerk/nextjs/server");
  const { userId } = await auth();

  const openMissions = await getPublicNoticeBoard();
  const myRequests = userId ? (await getMyRequests()) || [] : [];
  const mySentRequests = userId ? (await getMySentRequests()) || [] : [];

  return (
    <main className="min-h-screen bg-kindred-bg p-4 md:p-8 text-kindred-text relative overflow-hidden isolate transition-colors duration-300">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-kindred-lime/10 blur-[120px] pointer-events-none -z-10"></div>

      <NavBar
        userId={userId}
        inboxCount={myRequests.length}
        outboxCount={mySentRequests.length}
      />

      <section className="max-w-6xl mx-auto relative z-10 pt-10">
        <header className="mb-12">
          <Link
            href="/"
            className="text-kindred-lime text-xs font-black uppercase tracking-[0.3em] hover:opacity-70 transition-all flex items-center gap-2 mb-8"
          >
            &larr; Back to your Profile
          </Link>
          <h1 className="text-5xl font-black tracking-tighter mb-2 text-kindred-text">
            Favour Map
          </h1>
          <p className="text-kindred-lime/60 text-sm font-bold uppercase tracking-widest">
            Visualise Kindred Deeds across the UK
          </p>
        </header>

        <FavourMapClient
          openMissions={openMissions}
          userId={userId}
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        />
      </section>
    </main>
  );
}
