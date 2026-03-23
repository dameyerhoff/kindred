"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { supabase } from "./db";

async function checkAdminStatus() {
  const { userId } = await auth();
  if (!userId) return false;

  const { data: isAdmin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .single();

  return !!isAdmin;
}

export async function restrictTalentAction(targetUserId, talentName) {
  const isAdmin = await checkAdminStatus();
  if (!isAdmin) throw new Error("Unauthorised");

  const { data: account } = await supabase
    .from("accounts")
    .select("restricted_talents")
    .eq("user_id", targetUserId)
    .single();

  const currentTalents = account?.restricted_talents || [];
  if (!currentTalents.includes(talentName)) {
    const { error } = await supabase
      .from("accounts")
      .update({ restricted_talents: [...currentTalents, talentName] })
      .eq("user_id", targetUserId);

    if (error) throw new Error(error.message);
  }

  revalidatePath("/(admin)/admin");
}

export async function warnUserAction(targetUserId, reason) {
  const { userId: adminId } = await auth();
  const isAdmin = await checkAdminStatus();
  if (!isAdmin) throw new Error("Unauthorised");

  const { data: previousWarnings } = await supabase
    .from("admin_logs")
    .select("id")
    .eq("target_user_id", targetUserId)
    .eq("action_type", "WARNING");

  if (previousWarnings && previousWarnings.length > 0) {
    return await banUserAction(targetUserId, false);
  }

  await supabase.from("admin_logs").insert({
    admin_id: adminId,
    target_user_id: targetUserId,
    action_type: "WARNING",
    reason: reason,
  });

  revalidatePath("/(admin)/admin");
}

export async function resolveReportsAction(targetUserId) {
  const isAdmin = await checkAdminStatus();
  if (!isAdmin) throw new Error("Unauthorised");

  const { error } = await supabase
    .from("reports")
    .update({ status: "resolved" })
    .eq("target_user_id", targetUserId)
    .eq("status", "pending");

  if (error) throw new Error(error.message);

  revalidatePath("/(admin)/admin");
}

export async function banUserAction(targetUserId, currentStatus) {
  const { userId: adminId } = await auth();
  const isAdmin = await checkAdminStatus();

  if (!isAdmin) throw new Error("Unauthorised: Admin role required");

  const { error: updateError } = await supabase
    .from("accounts")
    .update({ is_banned: !currentStatus })
    .eq("user_id", targetUserId);

  if (updateError) throw new Error(updateError.message);

  await supabase.from("admin_logs").insert({
    admin_id: adminId,
    target_user_id: targetUserId,
    action_type: currentStatus ? "UNBAN" : "BAN",
  });

  revalidatePath("/(admin)/admin");
}

export async function deleteContestAction(contestId) {
  const isAdmin = await checkAdminStatus();

  if (!isAdmin) throw new Error("Unauthorised: Admin role required");

  const { error } = await supabase
    .from("contests")
    .delete()
    .eq("id", contestId);

  if (error) throw new Error(error.message);

  revalidatePath("/(admin)/admin");
}
