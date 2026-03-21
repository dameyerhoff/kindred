import { getMySentRequests } from "../actions";
import Link from "next/link";

// Dave: export default is mandatory to avoid the "Not a React Component" error
export default async function OutboxPage() {
  const mySentRequests = (await getMySentRequests()) || [];

  return (
    <main className="min-h-screen bg-[#061a06] p-8 text-white relative">
      {/* Dave: Using a blue-tinted radial glow for the Outbox "Sent" theme */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-blue-500/10 blur-[120px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Dave: Blue-themed Back Button */}
        <Link
          href="/"
          className="inline-block text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 hover:text-white transition-all mb-12 border border-blue-400/20 px-4 py-2 rounded-full hover:bg-blue-400/10"
        >
          &larr; Back to Dashboard
        </Link>

        <h1 className="text-5xl font-black tracking-tighter mb-12 italic">
          Sent Requests 📤
        </h1>

        {mySentRequests.length > 0 ? (
          <div className="grid gap-4">
            {mySentRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white/5 backdrop-blur-xl p-6 rounded-[2rem] border border-blue-500/10 flex justify-between items-center shadow-2xl group hover:border-blue-400/30 transition-all"
              >
                <div>
                  {/* Dave: Applied those Smart Quotes &ldquo; and &rdquo; here too */}
                  <p className="text-xl font-bold italic text-white/80 group-hover:text-blue-300 transition-colors">
                    &ldquo;{req.favour_text}&rdquo;
                  </p>
                  <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest mt-2">
                    Awaiting Kindred Spirit
                  </p>
                </div>
                <div className="bg-blue-500/10 px-4 py-2 rounded-full border border-blue-500/20">
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                    Pending
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/5 border border-dashed border-white/10 rounded-[2rem] p-20 text-center">
            <p className="text-white/20 text-xl font-black uppercase tracking-[0.4em]">
              Outbox Empty
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
