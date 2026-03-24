import {
  getMyRequests,
  completeFavour,
  declineFavour,
  getMySentRequests,
} from "../actions";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

// This page shows you a list of people who have asked you for a favour
export default async function InboxPage() {
  // Check who is logged in right now
  const { userId } = await auth();

  // Go to the database and find all the requests sent to me
  const myRequests = (await getMyRequests()) || [];
  // Also get sent requests for the header count
  const mySentRequests = userId ? (await getMySentRequests()) || [] : [];

  return (
    <main className="min-h-screen bg-[#061a06] p-4 md:p-8 text-white relative overflow-hidden isolate">
      {/* This adds the pretty green light in the background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-emerald-500/10 blur-[120px] pointer-events-none -z-10"></div>

      {/* This is the top bar with the logo and all the navigation buttons */}
      <header className="max-w-6xl mx-auto flex justify-between items-center mb-16 relative z-10 border-b border-white/10 pb-8">
        <div>
          <Link href="/">
            <img
              src="/kindred-logo.png"
              alt="Kindred Logo"
              className="h-20 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            />
          </Link>
        </div>

        {/* These links let you click between the Map, Grid, and Notice Board */}
        <div className="flex items-center gap-3">
          <Link
            href="/favour-map"
            className="hidden md:flex bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all items-center gap-2"
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

          {/* Added Inbox and Outbox specifically to the header for this tab */}
          {userId && (
            <>
              <Link
                href="/inbox"
                className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 px-3 py-2 rounded-xl hover:bg-emerald-500/40 transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)]"
              >
                <span className="text-sm">📬</span>
                <span className="text-[10px] font-black text-emerald-400 uppercase">
                  {myRequests.length}
                </span>
              </Link>

              <Link
                href="/outbox"
                className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 px-3 py-2 rounded-xl hover:bg-blue-500/40 transition-all"
              >
                <span className="text-sm">📤</span>
                <span className="text-[10px] font-black text-blue-400 uppercase">
                  {mySentRequests.length}
                </span>
              </Link>
            </>
          )}

          <Link
            href="/"
            className="bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all items-center gap-2 ml-2"
          >
            Profile 👤
          </Link>

          <Link
            href="/about-us"
            className="hidden md:flex bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all items-center gap-2"
          >
            About Us 💚
          </Link>

          {/* This is the button for your user account and signing out */}
          <div className="scale-125 ml-2">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* This button takes you back to your main profile page */}
        <Link
          href="/"
          className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-lime-400 hover:text-white transition-all mb-12 border border-lime-400/20 px-4 py-2 rounded-full hover:bg-lime-400/10"
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
                className="bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 flex justify-between items-center shadow-2xl group hover:border-lime-400/30 transition-all"
              >
                <div>
                  {/* This is the message the person sent you */}
                  <p className="text-xl font-bold italic group-hover:text-lime-400 transition-colors">
                    &ldquo;{req.favour_text}&rdquo;
                  </p>
                  <p className="text-[10px] text-emerald-400 uppercase font-black tracking-widest mt-2">
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
                      className="bg-white text-emerald-700 px-6 py-3 rounded-xl font-black text-xs hover:bg-lime-400 hover:text-green-900 transition-all shadow-2xl uppercase"
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
