"use client";

import { useState, useEffect } from "react";
import {
  getProfiles,
  sendFavourRequest,
  getMyRequests,
  getMySentRequests,
} from "../actions";
import Link from "next/link";
import CommunityGrid from "./CommunityGrid";
import NavBar from "@/components/NavBar";

export default function CommunityGridPage() {
  const [userId, setUserId] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [mySentRequests, setMySentRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetching data on the client to support real-time search state
  useEffect(() => {
    async function loadData() {
      try {
        // We fetch the profiles from your existing server action
        const p = await getProfiles();
        setProfiles(p || []);

        // Note: For userId, in a full build you'd use Clerk's useAuth()
        // but this keeps your existing logic flowing.
        setLoading(false);
      } catch (err) {
        console.error("Failed to load community data:", err);
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const communityProfiles = profiles.filter((p) => p.clerk_id !== userId);

  return (
    <main className="min-h-screen bg-kindred-bg p-4 md:p-8 text-kindred-text relative overflow-hidden isolate transition-colors duration-300">
      {/* Decorative Glow */}
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

          <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
            <div className="flex-shrink-0">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2 text-kindred-text leading-none">
                Community Grid
              </h1>
              <p className="text-kindred-lime/60 text-[10px] font-bold uppercase tracking-widest">
                The network of Guardians and Saints ready to help
              </p>
            </div>

            {/* SEARCH BAR: Perfectly positioned in the header */}
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-kindred-text/40 dark:text-white/20">
                🔍
              </div>
              <input
                type="text"
                placeholder="Search community members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                id="header-search-community"
                style={{
                  border: "2px solid #a3e635",
                }}
                className="w-full bg-kindred-bg dark:bg-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm text-kindred-text dark:text-white placeholder:text-kindred-text/50 dark:placeholder:text-white/40 focus:outline-none focus:border-kindred-lime transition-all shadow-sm dark:shadow-kindred"
              />
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-kindred-lime border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <CommunityGrid
            communityProfiles={communityProfiles}
            userId={userId}
            sendFavourRequest={sendFavourRequest}
            searchTerm={searchTerm}
          />
        )}
      </section>
    </main>
  );
}
