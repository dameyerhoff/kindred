import { supabase } from "@/lib/db";
import ModerationTable from "@/components/admin/ModerationTable";

export default async function AdminUsersPage() {
  const { data: users, error } = await supabase
    .from("users")
    .select("id, users_id, email, username, is_banned")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">User Moderation</h1>
      <ModerationTable users={users || []} />
    </div>
  );
}
