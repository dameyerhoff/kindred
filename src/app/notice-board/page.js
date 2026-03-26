"use client";

import { useEffect, useState } from "react";
import {
  getPublicNoticeBoard,
  getMyRequests,
  getMySentRequests,
} from "../actions";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import NavBar from "@/components/NavBar";
// Updated to match your actual filename
import NoticeBoardClient from "./NoticeBoardGrid";

export const dynamic = "force-dynamic";

export default async function NoticeBoardPage() {
  // 1. Fetch data on the Server
  const { userId } = await auth();
  const openMissions = await getPublicNoticeBoard();

  // 2. Fetch counts if user is logged in
  const myRequests = userId ? (await getMyRequests()) || [] : [];
  const mySentRequests = userId ? (await getMySentRequests()) || [] : [];

  return (
    <main className="min-h-screen bg-kindred-bg p-4 md:p-8 text-kindred-text relative overflow-hidden isolate transition-colors duration-300">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-kindred-lime/10 blur-[120px] pointer-events-none -z-10"></div>

      <NavBar
        userId={userId}
        inboxCount={counts.inbox}
        outboxCount={counts.outbox}
      />

      <section className="max-w-6xl mx-auto relative z-10">
        <header className="mb-12">
          <Link
            href="/"
            className="text-kindred-lime text-xs font-black uppercase tracking-[0.3em] hover:opacity-70 transition-all flex items-center gap-2 mb-8"
          >
            &larr; Back to your Profile
          </Link>

          {/* This component handles the search input and the grid display */}
          <NoticeBoardClient openMissions={openMissions} userId={userId} />
        </header>
      </section>
    </main>
  );
}
