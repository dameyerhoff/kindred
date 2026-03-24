import { supabase } from "@/lib/db";
import ModerationTable from "@/components/admin/ModerationTable";

// This page lets the admin see every person who has signed up
export default async function AdminUsersPage() {
  // Get all the users from the database and put them in alphabetical order
  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .order("name", { ascending: true });

  // If the database has a problem getting the names, show an error message
  if (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }

  // Look for any reports that an admin has not looked at yet
  const { data: atRiskUsers } = await supabase
    .from("reports")
    .select("target_user_id")
    .eq("status", "pending");

  // Count how many times each person has been reported by others
  const reportCounts = atRiskUsers?.reduce((acc, report) => {
    acc[report.target_user_id] = (acc[report.target_user_id] || 0) + 1;
    return acc;
  }, {});

  // Pick out the people who have 5 or more reports so we can keep an eye on them
  const flaggedIds = Object.keys(reportCounts || {}).filter(
    (id) => reportCounts[id] >= 5,
  );

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-black text-gray-900 tracking-tight">
        User Moderation
      </h1>
      {/* This box holds the big table where all the users are listed */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <ModerationTable users={users || []} flaggedIds={flaggedIds} />
      </div>
    </div>
  );
}
