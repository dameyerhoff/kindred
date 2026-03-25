import { getMyRequests, getMySentRequests } from "../actions";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import NavBar from "@/components/NavBar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// This builds the main page for the Outbox
export default async function OutboxPage() {
  const { userId } = await auth();
  // Go to the database and find all the requests I have sent out
  const myRequests = userId ? (await getMyRequests()) || [] : [];
  const mySentRequests = (await getMySentRequests()) || [];

  return (
    <main className="min-h-screen bg-kindred-bg p-4 md:p-8 text-kindred-text relative overflow-hidden isolate transition-colors duration-300">
      {/* This adds a soft blue light in the background to match the sent theme */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-kindred-blue-glow/10 blur-[120px] pointer-events-none -z-10"></div>

      <NavBar
        userId={userId}
        inboxCount={myRequests.length}
        outboxCount={mySentRequests.length}
      />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* This button takes you back to your main profile page */}
        <Link
          href="/"
          className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-kindred-blue-glow hover:opacity-70 transition-all mb-12 border border-kindred-blue-glow/20 px-4 py-2 rounded-full hover:bg-kindred-blue-glow/10"
        >
          &larr; Back to Dashboard
        </Link>

        <h1 className="text-5xl font-black tracking-tighter mb-12 text-kindred-text">
          Sent Requests 📤
        </h1>

        {/* If there are requests you sent, show them in a list */}
        {mySentRequests.length > 0 ? (
          <div className="grid gap-4">
            {mySentRequests.map((req) => (
              <div
                key={req.id}
                className="bg-black/5 dark:bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-black/10 dark:border-kindred-blue-glow/10 flex justify-between items-center shadow-2xl group hover:border-kindred-blue-glow/30 hover:shadow-kindred-blue transition-all"
              >
                <div>
                  {/* This shows the message you sent out to the community */}
                  <p className="text-xl font-bold italic text-kindred-text/80 group-hover:text-kindred-blue-glow transition-colors">
                    &ldquo;{req.favour_text}&rdquo;
                  </p>
                  <p className="text-[10px] text-kindred-blue-glow uppercase font-black tracking-widest mt-2 opacity-60">
                    Awaiting Kindred Spirit
                  </p>
                </div>
                {/* This little tag shows that the request is still waiting for an answer */}
                <div className="bg-kindred-blue-glow/10 px-4 py-2 rounded-full border border-kindred-blue-glow/20">
                  <span className="text-[10px] font-black text-kindred-blue-glow uppercase tracking-widest">
                    Pending
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* If you haven't sent any requests, show this empty box instead */
          <div className="bg-black/5 dark:bg-white/5 border border-dashed border-black/10 dark:border-white/10 rounded-[2rem] p-20 text-center">
            <p className="text-kindred-text/20 text-xl font-black uppercase tracking-[0.4em]">
              Outbox Empty
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
