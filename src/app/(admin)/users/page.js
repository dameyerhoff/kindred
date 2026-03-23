import { supabase } from "@/lib/db";
import ModerationTable from "@/components/admin/ModerationTable";

export default async function AdminUsersPage() {
  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }

  const { data: atRiskUsers } = await supabase
    .from("reports")
    .select("target_user_id")
    .eq("status", "pending");

  const reportCounts = atRiskUsers?.reduce((acc, report) => {
    acc[report.target_user_id] = (acc[report.target_user_id] || 0) + 1;
    return acc;
  }, {});

  const flaggedIds = Object.keys(reportCounts || {}).filter(
    (id) => reportCounts[id] >= 5,
  );

  if (error) throw new Error("Could not load community members");

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-black text-gray-900 tracking-tight">
        User Moderation
      </h1>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <ModerationTable users={users || []} flaggedIds={flaggedIds} />
      </div>
    </div>
  );
}
