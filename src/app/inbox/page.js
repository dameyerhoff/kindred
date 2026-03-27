import {
  getMyRequests,
  releaseFavour,
  getMySentRequests,
  deleteFavour,
  markJobDone, // Swapped completeFavour for markJobDone
} from "../actions";
import Link from "next/link";
import NavBar from "@/components/NavBar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function InboxPage() {
  const { auth } = await import("@clerk/nextjs/server");
  const { userId } = await auth();

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

      <div className="max-w-4xl mx-auto relative z-10 pt-10">
        <Link
          href="/"
          className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-kindred-lime hover:opacity-70 transition-all mb-12 border border-kindred-lime/20 px-4 py-2 rounded-full hover:bg-kindred-lime/10"
        >
          &larr; Back to Dashboard
        </Link>

        <h1 className="text-5xl font-black tracking-tighter mb-12 text-kindred-text leading-tight">
          Kindred Inbox 📬
        </h1>

        {myRequests.length > 0 ? (
          <div className="grid gap-4">
            {myRequests.map((req) => {
              const isCompleted = req.status === "completed";
              const iHaveSigned = req.receiver_signed_off; // Inbox is your side (receiver)
              const partnerHasSigned = req.sender_signed_off;
              const eitherSigned = iHaveSigned || partnerHasSigned;

              return (
                <div
                  key={req.id}
                  className={`backdrop-blur-xl p-6 rounded-[2.5rem] border flex flex-col md:flex-row justify-between items-start md:items-center shadow-2xl group transition-all gap-6 relative overflow-hidden ${
                    isCompleted
                      ? "bg-kindred-lime/10 border-kindred-lime/40"
                      : "bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/10"
                  }`}
                >
                  <div className="flex-1 space-y-2">
                    <p className="text-xl font-bold italic group-hover:text-kindred-lime transition-colors">
                      &ldquo;{req.favour_text}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <p className="text-[10px] text-kindred-lime uppercase font-black tracking-widest">
                        {isCompleted
                          ? "Mission Completed ✨"
                          : req.status === "active"
                            ? "Mission Active 🤝"
                            : "New Favour Request ✨"}
                      </p>
                      {req.exchange_details && (
                        <p className="text-[10px] text-white/40 italic">
                          Return: {req.exchange_details}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 w-full md:w-auto min-w-[160px]">
                    {!isCompleted ? (
                      <>
                        {/* 1. JOB DONE BUTTON */}
                        {req.status === "active" && (
                          <form action={markJobDone} className="w-full">
                            <input
                              type="hidden"
                              name="favourId"
                              value={req.id}
                            />
                            {iHaveSigned ? (
                              <div className="w-full bg-emerald-600 text-white border border-emerald-400/30 px-4 py-2.5 rounded-xl font-black uppercase tracking-tighter text-center flex items-center justify-center gap-2 text-[10px] shadow-inner">
                                Job Done ✅
                              </div>
                            ) : (
                              <button className="w-full bg-red-600 text-white px-4 py-2.5 rounded-xl font-black uppercase tracking-tighter hover:bg-red-500 shadow-[0_4px_15px_rgba(220,38,38,0.4)] transition-all flex items-center justify-center gap-2 text-[10px] border border-white/10">
                                <span className="text-sm">❌</span> Job Done?
                              </button>
                            )}
                          </form>
                        )}

                        {/* 2. RENEGOTIATE / DISCUSS (Hides if sign-off started) */}
                        {!eitherSigned && (
                          <Link
                            href={`/?missionId=${req.id}`}
                            className="w-full text-center bg-kindred-lime text-kindred-dark px-6 py-3 rounded-xl font-black text-xs hover:bg-white transition-all shadow-xl uppercase"
                          >
                            {req.status === "active"
                              ? "Renegotiate 🤝"
                              : "Discuss Terms 💬"}
                          </Link>
                        )}

                        {/* 3. RELEASE / TOOLTIP DELETE */}
                        {eitherSigned ? (
                          <div className="relative group/delete w-full">
                            <div className="w-full text-center text-[10px] bg-slate-500/10 text-slate-500 border border-slate-500/20 px-4 py-2 rounded-xl font-black uppercase tracking-tighter opacity-40 cursor-help">
                              Delete 🗑️
                            </div>
                            <div className="absolute bottom-full mb-2 right-0 px-3 py-2 bg-kindred-dark border border-kindred-lime/30 text-kindred-lime text-[9px] font-black uppercase tracking-widest rounded-lg whitespace-nowrap opacity-0 group-hover/delete:opacity-100 transition-opacity pointer-events-none shadow-2xl z-50 translate-y-1 group-hover/delete:translate-y-0 duration-200">
                              Awaiting partner to mark job done
                              <div className="absolute top-full right-4 border-8 border-transparent border-t-kindred-dark"></div>
                            </div>
                          </div>
                        ) : (
                          <form action={releaseFavour} className="w-full">
                            <input
                              type="hidden"
                              name="favourId"
                              value={req.id}
                            />
                            <button className="w-full px-6 py-3 rounded-xl font-black text-[10px] uppercase transition-all bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20">
                              Release 🚩
                            </button>
                          </form>
                        )}
                      </>
                    ) : (
                      /* 4. FULL COMPLETION: ACTIVE DELETE */
                      <div className="flex flex-col gap-2 w-full">
                        <div className="bg-kindred-lime/10 border border-kindred-lime/30 px-4 py-2 rounded-xl text-center w-full">
                          <p className="text-[9px] text-kindred-lime uppercase font-black tracking-widest">
                            Handshake Complete 😇
                          </p>
                        </div>
                        <form action={deleteFavour} className="w-full">
                          <input type="hidden" name="favourId" value={req.id} />
                          <button className="w-full text-[10px] bg-slate-700 text-white border border-slate-600 px-4 py-2 rounded-xl font-black uppercase tracking-tighter hover:bg-red-600 transition-all">
                            Delete 🗑️
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
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
