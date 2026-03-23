import { supabase } from "@/lib/db";
import ModerationTable from "@/components/admin/ModerationTable";
import ContestRow from "@/components/admin/ContestRow";

export default async function AdminDashboard() {
  const { data: users } = await supabase
    .from("accounts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: contests } = await supabase
    .from("contests")
    .select("*")
    .order("id", { ascending: false });

  return (
    <div className="p-8 space-y-12 bg-gray-50 min-h-screen">
      <header>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 text-sm uppercase font-bold tracking-widest mt-1">
          Kindred Community Control
        </p>
      </header>
      <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Recent Members</h2>
        </div>
        <ModerationTable users={users || []} />
      </section>
      <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            Notice Board Contests
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                  Title & Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                  Reward
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {contests?.map((contest) => (
                <ContestRow key={contest.id} contest={contest} />
              ))}
              {(!contests || contests.length === 0) && (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-10 text-center text-gray-400"
                  >
                    No active contests currently.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
