import { auth } from "@clerk/nextjs/server";
import { getMyRequests, getMySentRequests } from "../actions";
import NavBar from "@/components/NavBar";
import Diary from "@/components/Diary";

export const dynamic = "force-dynamic";

export default async function DiaryPage() {
  const { userId } = await auth();

  const myRequests = userId ? (await getMyRequests()) || [] : [];

  const mySentRequests = userId ? (await getMySentRequests()) || [] : [];

  return (
    <main className="min-h-screen bg-kindred-dark p-4 md:p-8 text-white relative overflow-hidden isolate">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-kindred-lime/10 blur-[120px] pointer-events-none -z-10"></div>

      <NavBar
        userId={userId}
        inboxCount={myRequests.length}
        outboxCount={mySentRequests.length}
      />

      <section className="max-w-4xl mx-auto relative z-10">
        <header className="mb-12">
          <h1 className="text-5xl font-black tracking-tighter mb-2 text-white uppercase">
            My Diary
          </h1>
          <p className="text-kindred-lime/60 text-xs font-bold uppercase tracking-[0.2em]">
            A unified view of your community commitments
          </p>
        </header>

        {myRequests.length === 0 && mySentRequests.length === 0 ? (
          <div className="bg-white/5 border border-dashed border-white/10 rounded-[3rem] p-20 text-center backdrop-blur-sm">
            <p className="text-white/20 text-xl font-black uppercase tracking-[0.4em]">
              Your schedule is clear 🕊️
            </p>
          </div>
        ) : (
          <Diary myRequests={myRequests} mySentRequests={mySentRequests} />
        )}
      </section>
    </main>
  );
}
