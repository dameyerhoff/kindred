"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { supabase } from "./db";

// This part checks if the person currently logged in is an administrator
async function checkAdminStatus() {
  const { userId } = await auth();
  if (!userId) return false;

  // It looks in the admin_users table to see if your ID is listed there
  const { data: isAdmin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .single();

  return !!isAdmin;
}

// This function lets an admin ban or unban a specific user
export async function banUserAction(targetUserId, currentStatus) {
  const { userId: adminId } = await auth();
  const isAdmin = await checkAdminStatus();

  // If you aren't an admin, the computer will stop you right here
  if (!isAdmin) throw new Error("Unauthorised: Admin role required");

  // This updates the user's account to flip the "banned" switch
  const { error: updateError } = await supabase
    .from("accounts")
    .update({ is_banned: !currentStatus })
    .eq("user_id", targetUserId);

  if (updateError) throw new Error(updateError.message);

  // This records a log so there is a history of which admin performed the action
  await supabase.from("admin_logs").insert({
    admin_id: adminId,
    target_user_id: targetUserId,
    action_type: currentStatus ? "UNBAN" : "BAN",
  });

  // This refreshes the admin page so you see the change immediately
  revalidatePath("/(admin)/admin");
}

// This function lets an admin permanently delete a contest from the site
export async function deleteContestAction(contestId) {
  const isAdmin = await checkAdminStatus();

  // Only administrators are allowed to delete contests
  if (!isAdmin) throw new Error("Unauthorised: Admin role required");

  // This tells the database to remove the contest with the matching ID
  const { error } = await supabase
    .from("contests")
    .delete()
    .eq("id", contestId);

  if (error) throw new Error(error.message);

  // This refreshes the admin dashboard to show the contest is gone
  revalidatePath("/(admin)/admin");
}
