import { supabase } from "@/lib/db";
import ModerationTable from "@/components/admin/ModerationTable";
import ContestRow from "@/components/admin/ContestRow";

// This is the main page for the admin to see everything going on
export default async function AdminDashboard() {
  // Get the 5 newest people who joined the site
  const { data: users } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  // Get all the contests from the database
  const { data: contests } = await supabase
    .from("contests")
    .select("*")
    .order("id", { ascending: false });

  // Count how many people have joined in total
  const { count: totalUsers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  // Count how many people are currently banned
  const { count: bannedUsers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("is_banned", true);

  // Get the last 5 things an admin did
  const { data: logs } = await supabase
    .from("admin_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  // Find all the reports that have not been finished yet
  const { data: atRiskUsers } = await supabase
    .from("reports")
    .select("target_user_id")
    .eq("status", "pending");

  // Count how many reports each person has against them
  const reportCounts = atRiskUsers?.reduce((acc, report) => {
    acc[report.target_user_id] = (acc[report.target_user_id] || 0) + 1;
    return acc;
  }, {});

  // Make a list of people who have 5 or more reports
  const flaggedIds = Object.keys(reportCounts || {}).filter(
    (id) => reportCounts[id] >= 5,
  );

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
      {/* These boxes show the big numbers at the top */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
            Total Members
          </p>
          <h3 className="text-3xl font-black text-gray-900">
            {totalUsers || 0}
          </h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 border-l-4 border-l-gray-100">
          <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
            Active Contests
          </p>
          <h3 className="text-3xl font-black text-gray-900">
            {contests?.length || 0}
          </h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 border-l-4 border-l-red-500">
          <p className="text-[10px] font-black uppercase text-red-400 tracking-widest">
            Banned Members
          </p>
          <h3 className="text-3xl font-black text-red-600">
            {bannedUsers || 0}
          </h3>
        </div>
      </div>
      {/* Show a red warning box if people are getting reported a lot */}
      {flaggedIds.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-2xl shadow-sm animate-pulse">
          <div className="flex items-center gap-4">
            <span className="text-3xl"></span>
            <div>
              <h3 className="text-red-800 font-black uppercase tracking-tight">
                Urgent
              </h3>
              <p className="text-red-700 text-sm">
                {flaggedIds.length} users that have 5 or more reports and need
                reviewing
              </p>
            </div>
          </div>
        </div>
      )}
      {/* This section shows the newest members table */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Recent Members</h2>
        </div>
        <ModerationTable users={users || []} flaggedIds={flaggedIds} />
      </section>
      {/* This section shows a list of things admins did lately */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            Recent Admin Actions
          </h2>
        </div>
        <div className="p-6">
          {logs?.length > 0 ? (
            <ul className="space-y-4">
              {logs.map((log) => (
                <li
                  key={log.id}
                  className="text-sm text-gray-600 border-b border-gray-50 pb-2 flex justify-between"
                >
                  <span>
                    <strong className="text-gray-900">{log.action_type}</strong>{" "}
                    on user{" "}
                    <code className="bg-gray-100 px-1 rounded">
                      {log.target_user_id.substring(0, 8)}...
                    </code>
                  </span>
                  <span className="text-gray-400 text-xs">
                    {new Date(log.created_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 text-sm italic">
              No recent actions recorded.
            </p>
          )}
        </div>
      </section>
      {/* This section shows a table of all the contests on the board */}
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
