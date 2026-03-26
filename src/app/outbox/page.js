"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import NavBar from "@/components/NavBar";

export default function OutboxPage() {
  const { userId, isLoaded } = useAuth();
  const [myRequests, setMyRequests] = useState([]);
  const [mySentRequests, setMySentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (userId) {
        // FIXED: Dynamically import to keep client and server separate during build
        const { getMyRequests, getMySentRequests } = await import("../actions");
        const reqs = await getMyRequests();
        const sent = await getMySentRequests();
        setMyRequests(reqs || []);
        setMySentRequests(sent || []);
      }
      setLoading(false);
    }
    if (isLoaded) {
      loadData();
    }
  }, [userId, isLoaded]);

  // FIXED: Wrapper functions for dynamic action calls
  const handleDelete = async (formData) => {
    const { deleteFavour } = await import("../actions");
    await deleteFavour(formData);
  };

  const handleNegotiation = async (formData) => {
    const { startNegotiation } = await import("../actions");
    await startNegotiation(formData);
  };

  return (
    <main className="min-h-screen bg-kindred-bg p-4 md:p-8 text-kindred-text relative overflow-hidden isolate transition-colors duration-300">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-kindred-blue-glow/10 blur-[120px] pointer-events-none -z-10"></div>

      <NavBar
        userId={userId}
        inboxCount={myRequests.length}
        outboxCount={mySentRequests.length}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        <Link
          href="/"
          className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-kindred-blue-glow hover:opacity-70 transition-all mb-12 border border-kindred-blue-glow/20 px-4 py-2 rounded-full hover:bg-kindred-blue-glow/10"
        >
          &larr; Back to Dashboard
        </Link>

        <h1 className="text-5xl font-black tracking-tighter mb-12 text-kindred-text">
          Sent Requests 📤
        </h1>

        {!loading && mySentRequests.length > 0 ? (
          <div className="grid gap-4">
            {mySentRequests.map((req) => {
              const isAgreed = req.status === "active" && req.scheduled_date;
              const isCompleted = req.status === "completed";

              return (
                <div
                  key={req.id}
                  className={`backdrop-blur-xl p-6 rounded-[2rem] border flex justify-between items-center shadow-2xl group transition-all ${isCompleted ? "bg-kindred-blue-glow/10 border-kindred-blue-glow/40" : "bg-black/5 dark:bg-white/5 border-black/10 dark:border-kindred-blue-glow/10"}`}
                >
                  <div>
                    <p className="text-xl font-bold italic text-kindred-text/80 group-hover:text-kindred-blue-glow transition-colors">
                      &ldquo;{req.favour_text}&rdquo;
                    </p>
                    <p className="text-[10px] text-kindred-blue-glow uppercase font-black tracking-widest mt-2 opacity-60">
                      {isCompleted
                        ? "Success ✅"
                        : req.status === "active"
                          ? "Mission Claimed 🤝"
                          : "Awaiting Kindred Spirit"}
                    </p>
                  </div>

                  <div className="flex gap-4 items-center">
                    {/* FIXED: Using dynamic wrapper handle */}
                    <form action={handleDelete}>
                      <input type="hidden" name="favourId" value={req.id} />
                      <button
                        type="submit"
                        disabled={!isCompleted}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all shadow-lg ${
                          isCompleted
                            ? "bg-red-500/20 text-red-500 border border-red-500/40 hover:bg-red-500 hover:text-white cursor-pointer"
                            : "bg-white/5 text-white/10 border border-white/5 cursor-not-allowed grayscale"
                        }`}
                      >
                        Clear History 🗑️
                      </button>
                    </form>

                    {!isCompleted && (
                      <form action={handleNegotiation}>
                        <input type="hidden" name="favourId" value={req.id} />
                        <button
                          type="submit"
                          className="bg-kindred-blue-glow/10 px-6 py-3 rounded-xl border border-kindred-blue-glow/20 text-[10px] font-black text-kindred-blue-glow uppercase tracking-widest hover:bg-kindred-blue-glow/20 transition-all"
                        >
                          {isAgreed
                            ? "Re-negotiate 🔄"
                            : req.status === "active"
                              ? "Discuss Terms 🤝"
                              : "Pending"}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          !loading && (
            <div className="bg-black/5 dark:bg-white/5 border border-dashed border-black/10 dark:border-white/10 rounded-[2rem] p-20 text-center">
              <p className="text-kindred-text/20 text-xl font-black uppercase tracking-[0.4em]">
                Outbox Empty
              </p>
            </div>
          )
        )}
      </div>
    </main>
  );
}
