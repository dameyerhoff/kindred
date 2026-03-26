import {
  getMyRequests,
  releaseFavour,
  startNegotiation,
  getMySentRequests,
  deleteFavour,
  completeFavour,
} from "../actions";
import Link from "next/link";
import NavBar from "@/components/NavBar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// This page shows you a list of people who have asked you for a favour
export default async function InboxPage() {
  // FIXED: Inline import to prevent build errors and using server-side auth
  const { auth } = await import("@clerk/nextjs/server");
  const { userId } = await auth();

  const myRequests = userId ? (await getMyRequests()) || [] : [];
  const mySentRequests = userId ? (await getMySentRequests()) || [] : [];

  return (
    <main className="min-h-screen bg-kindred-bg p-4 md:p-8 text-kindred-text relative overflow-hidden isolate transition-colors duration-300">
      {/* This adds the pretty green light in the background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-kindred-lime/10 blur-[120px] pointer-events-none -z-10"></div>

      <NavBar
        userId={userId}
        inboxCount={myRequests.length}
        outboxCount={mySentRequests.length}
      />

      <div className="max-w-4xl mx-auto relative z-10 pt-10">
        {/* This button takes you back to your main profile page */}
        <Link
          href="/"
          className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-kindred-lime hover:opacity-70 transition-all mb-12 border border-kindred-lime/20 px-4 py-2 rounded-full hover:bg-kindred-lime/10"
        >
          &larr; Back to Dashboard
        </Link>
        <h1 className="text-5xl font-black tracking-tighter mb-12 text-kindred-text">
          Kindred Inbox 📬
        </h1>

        {myRequests.length > 0 ? (
          <div className="grid gap-4">
            {myRequests.map((req) => {
              const isAgreed = req.status === "active" && req.scheduled_date;
              const isCompleted = req.status === "completed";

              return (
                <div
                  key={req.id}
                  className={`backdrop-blur-xl p-6 rounded-[2rem] border flex flex-col md:flex-row justify-between items-start md:items-center shadow-2xl group transition-all gap-6 ${
                    isCompleted
                      ? "bg-kindred-lime/10 border-kindred-lime/40"
                      : "bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10"
                  }`}
                >
                  <div className="flex-1">
                    <p className="text-xl font-bold italic group-hover:text-kindred-lime transition-colors">
                      &ldquo;{req.favour_text}&rdquo;
                    </p>
                    <p className="text-[10px] text-kindred-lime uppercase font-black tracking-widest mt-2">
                      {isCompleted
                        ? "Mission Completed ✨"
                        : req.status === "active"
                          ? "Mission Claimed 🤝"
                          : "Direct Favour Request ✨"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    {/* DELETE FORM - Only active if completed */}
                    <form action={deleteFavour} className="flex-1 md:flex-none">
                      <input type="hidden" name="favourId" value={req.id} />
                      <button
                        type="submit"
                        disabled={!isCompleted}
                        className={`w-full px-6 py-3 rounded-xl font-black text-[10px] uppercase transition-all shadow-lg ${
                          isCompleted
                            ? "bg-red-500/20 text-red-500 border border-red-500/40 hover:bg-red-500 hover:text-white cursor-pointer"
                            : "bg-white/5 text-white/10 border border-white/5 cursor-not-allowed grayscale"
                        }`}
                      >
                        Delete 🗑️
                      </button>
                    </form>

                    <form
                      action={completeFavour}
                      className="flex-1 md:flex-none"
                    >
                      <input type="hidden" name="favourId" value={req.id} />
                      <input
                        type="hidden"
                        name="receiverId"
                        value={req.receiver_id}
                      />
                      <button
                        type="submit"
                        className="w-full bg-kindred-text dark:bg-white text-kindred-bg dark:text-kindred-dark px-6 py-3 rounded-xl font-black text-xs hover:bg-kindred-lime hover:text-kindred-dark transition-all shadow-2xl uppercase hover:shadow-kindred"
                      >
                        Help & Earn 😇
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* If nobody has sent you a request, show this empty box instead */
          <div className="bg-black/5 dark:bg-white/5 border border-dashed border-black/10 dark:border-white/10 rounded-[2rem] p-20 text-center">
            <p className="text-kindred-text/20 text-xl font-black uppercase tracking-[0.4em]">
              Inbox Clear • Spirit Strong
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
