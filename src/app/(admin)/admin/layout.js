import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/db";

export default async function AdminLayout({ children }) {
  const { userId } = await auth();

  if (!userId) redirect("/sign-in");

  const { data: isAdmin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .single();

  if (!isAdmin) {
    redirect("/");
  }

  return <div className="admin-layout">{children}</div>;
}
