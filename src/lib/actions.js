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

export async function sendMessageAction(receiverId, content, subject = null) {
  const { userId: senderId } = await auth();

  if (!senderId) {
    throw new Error("You must be logged in to send messages.");
  }

  if (!content || content.trim() === "") {
    throw new Error("Message content cannot be empty");
  }

  const { data, error } = await supabase
    .from("messages")
    .insert([
      {
        sender_id: senderId,
        receiver_id: receiverId,
        subject: subject,
        content: content,
      },
    ])
    .select();

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/messages");

  return data;
}

export async function getInboxAction() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorised");

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}
