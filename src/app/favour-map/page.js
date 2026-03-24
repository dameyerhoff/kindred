import { getPublicNoticeBoard } from "../actions";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import FavourMapClient from "./FavourMapClient";

export const dynamic = "force-dynamic";

export default async function FavourMapPage() {
  const { userId } = await auth();
  const openMissions = await getPublicNoticeBoard();

  return (
    <main className="min-h-screen bg-[#061a06] p-4 md:p-8 text-white relative overflow-hidden isolate">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-green-500/10 blur-[120px] pointer-events-none -z-10"></div>

      {/* --- UNIFIED HEADER --- */}
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
            className="hidden md:flex bg-lime-400 text-green-950 border border-lime-400 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all items-center gap-2 shadow-[0_0_15px_rgba(163,230,53,0.4)]"
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

          {/* Dave: Profile Button */}
          <Link
            href="/"
            className="bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all items-center gap-2 ml-2"
          >
            Profile 👤
          </Link>

          {/* OL:About Us */}
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

      <section className="max-w-6xl mx-auto relative z-10">
        <header className="mb-12">
          <Link
            href="/"
            className="text-lime-400 text-xs font-black uppercase tracking-[0.3em] hover:text-white transition-colors flex items-center gap-2 mb-8"
          >
            ← Back to your Profile
          </Link>
          <h1 className="text-5xl font-black tracking-tighter mb-2 text-white">
            Favour Map
          </h1>
          <p className="text-lime-400/60 text-sm font-bold uppercase tracking-widest">
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
