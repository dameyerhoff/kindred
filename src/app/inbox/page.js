import {
  getMyRequests,
  completeFavour,
  declineFavour,
  getMySentRequests,
} from "../actions";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import NavBar from "@/components/NavBar";

// This page shows you a list of people who have asked you for a favour
export default async function InboxPage() {
  const { userId } = await auth();
  // Go to the database and find all the requests sent to me
  const myRequests = (await getMyRequests()) || [];
  const mySentRequests = userId ? (await getMySentRequests()) || [] : [];

  return (
    <main className="min-h-screen bg-kindred-dark p-4 md:p-8 text-white relative overflow-hidden isolate">
      {/* This adds the pretty green light in the background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-kindred-lime/10 blur-[120px] pointer-events-none -z-10"></div>
      <NavBar
        userId={userId}
        inboxCount={myRequests.length}
        outboxCount={mySentRequests.length}
      />
      {/* This button takes you back to your main profile page */}
      <div className="max-w-4xl mx-auto relative z-10">
        <Link
          href="/"
          className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-kindred-lime hover:text-white transition-all mb-12 border border-kindred-lime/20 px-4 py-2 rounded-full hover:bg-kindred-lime/10"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="text-5xl font-black tracking-tighter mb-12">
          Kindred Inbox 📬
        </h1>

        {/* If there are requests, show them in a list */}
        {myRequests.length > 0 ? (
          <div className="grid gap-4">
            {myRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 flex justify-between items-center shadow-2xl group hover:border-kindred-lime/30 hover:shadow-kindred transition-all"
              >
                <div>
                  {/* This is the message the person sent you */}
                  <p className="text-xl font-bold italic group-hover:text-lime-400 transition-colors">
                    &ldquo;{req.favour_text}&rdquo;
                  </p>
                  <p className="text-[10px] text-kindred-lime uppercase font-black tracking-widest mt-2">
                    Community Favour
                  </p>
                </div>

                {/* These buttons let you choose to help or say no */}
                <div className="flex gap-3">
                  {/* This form lets you say no to the request */}
                  <form action={declineFavour}>
                    <input type="hidden" name="favourId" value={req.id} />
                    <button
                      type="submit"
                      className="text-white/40 hover:text-white px-4 py-3 rounded-xl font-black text-[10px] uppercase border border-white/5 transition-all hover:border-white/20"
                    >
                      Decline
                    </button>
                  </form>

                  {/* This form lets you accept the request and finish the job */}
                  <form action={completeFavour}>
                    <input type="hidden" name="favourId" value={req.id} />
                    <input
                      type="hidden"
                      name="receiverId"
                      value={req.receiver_id}
                    />
                    <button
                      type="submit"
                      className="bg-white text-kindred-dark px-6 py-3 rounded-xl font-black text-xs hover:bg-kindred-lime hover:text-kindred-dark transition-all shadow-2xl uppercase hover:shadow-kindred"
                    >
                      Help & Earn 😇
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* If nobody has sent you a request, show this empty box instead */
          <div className="bg-white/5 border border-dashed border-white/10 rounded-[2rem] p-20 text-center">
            <p className="text-white/20 text-xl font-black uppercase tracking-[0.4em]">
              Inbox Clear • Spirit Strong
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
