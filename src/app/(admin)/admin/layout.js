import { getUserId } from "@/lib/clerk-server"; // FIXED: Safe helper
import { redirect } from "next/navigation";
import { supabase } from "@/lib/db";
import AdminSidebar from "@/components/admin/AdminSidebar";

// This part builds the special layout for the admin pages
export default async function AdminLayout({ children }) {
  // FIXED: Using safe helper to check who is logged in
  const userId = await getUserId();

  // If nobody is logged in, send them back to the sign in page
  if (!userId) redirect("/sign-in");

  // Look in the database to see if this person is on the special admin list
  const { data: isAdmin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .single();

  // If they are not an admin, kick them back to the home page
  if (!isAdmin) {
    redirect("/");
  }

  // If they are an admin, show the sidebar and the page content
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-gray-50 overflow-y-auto">{children}</main>
    </div>
  );
}
