"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return createClient(supabaseUrl, supabaseKey);
}

export async function completeFavour(formData) {
  const { auth } = await import("@clerk/nextjs/server");
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const supabase = getSupabase();
  const favourId = formData.get("favourId");
  const receiverId = formData.get("receiverId");

  const { error: favourError } = await supabase
    .from("favours")
    .update({ status: "completed" })
    .eq("id", favourId);

  if (favourError) throw favourError;

  if (receiverId) {
    await awardHalo(receiverId);
  }

  revalidatePath("/");
  revalidatePath("/inbox");
  revalidatePath("/outbox");

  return { success: true };
}

export async function saveProfile(formData) {
  const { auth } = await import("@clerk/nextjs/server");
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const supabase = getSupabase();
  const full_name = formData.get("full_name");
  const city = formData.get("city");
  const postcode = formData.get("postcode");
  const tagsRaw = formData.get("tags");
  const tags = tagsRaw ? JSON.parse(tagsRaw) : [];

  const { error } = await supabase.from("profiles").upsert({
    clerk_id: userId,
    full_name,
    city,
    postcode,
    tags,
    updated_at: new Date(),
  });

  if (error) throw error;
  revalidatePath("/");
  redirect("/");
}

export async function getProfiles() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) return [];
  return data;
}

export async function getPublicNoticeBoard() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("favours")
    .select(`*, profiles:sender_id (full_name, city, halos)`)
    .eq("status", "pending")
    .order("created_at", { ascending: false });
  if (error) return [];
  return data;
}

export async function claimFavour(formData) {
  const { auth } = await import("@clerk/nextjs/server");
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const supabase = getSupabase();
  const favourId = formData.get("favourId");

  const { error } = await supabase
    .from("favours")
    .update({ receiver_id: userId, status: "active" })
    .eq("id", favourId);

  if (error) throw error;

  revalidatePath("/");
  revalidatePath("/notice-board");
  redirect(`/?missionId=${favourId}`);
}

export async function startNegotiation(formData) {
  const favourId = formData.get("favourId");
  redirect(`/?missionId=${favourId}`);
}

export async function releaseFavour(formData) {
  const { auth } = await import("@clerk/nextjs/server");
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const supabase = getSupabase();
  const favourId = formData.get("favourId");
  const { error } = await supabase
    .from("favours")
    .update({ receiver_id: null, status: "pending" })
    .eq("id", favourId);
  if (error) throw error;
  revalidatePath("/notice-board");
  revalidatePath("/inbox");
  revalidatePath("/");
  redirect("/notice-board");
}

export async function finalizeMission(formData) {
  const { auth } = await import("@clerk/nextjs/server");
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const supabase = getSupabase();
  const favourId = formData.get("favourId");
  const scheduledDate = formData.get("date");
  const scheduledTime = formData.get("time");
  const exchangeDetails = formData.get("exchange");

  const { error } = await supabase
    .from("favours")
    .update({
      status: "active",
      scheduled_date: scheduledDate,
      scheduled_time: scheduledTime,
      exchange_details: exchangeDetails,
    })
    .eq("id", favourId);

  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/inbox");
  redirect("/");
}

export async function updateMissionTerms(formData) {
  const { auth } = await import("@clerk/nextjs/server");
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const supabase = getSupabase();

  const favourId = formData.get("favourId");
  const scheduledDate = formData.get("date");
  const scheduledTime = formData.get("time");
  const exchangeDetails = formData.get("exchange");

  const { error } = await supabase
    .from("favours")
    .update({
      scheduled_date: scheduledDate,
      scheduled_time: scheduledTime,
      exchange_details: exchangeDetails,
    })
    .eq("id", favourId);

  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/inbox");
  redirect("/");
}

export async function signOffMission(formData) {
  const { auth } = await import("@clerk/nextjs/server");
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const supabase = getSupabase();
  const favourId = formData.get("favourId");

  const { data: favour } = await supabase
    .from("favours")
    .select("*")
    .eq("id", favourId)
    .single();

  if (!favour) return;

  const isSender = favour.sender_id === userId;
  const updateData = {};
  let targetToAward = null;

  if (isSender && !favour.sender_signed_off) {
    updateData.sender_signed_off = true;
    targetToAward = favour.receiver_id;
  } else if (!isSender && !favour.receiver_signed_off) {
    updateData.receiver_signed_off = true;
    targetToAward = favour.sender_id;
  }

  if (Object.keys(updateData).length === 0) return;

  const bothSigned =
    (isSender ? true : favour.sender_signed_off) &&
    (!isSender ? true : favour.receiver_signed_off);
  if (bothSigned) {
    updateData.status = "completed";
  }

  const { error } = await supabase
    .from("favours")
    .update(updateData)
    .eq("id", favourId);

  if (error) throw error;

  if (targetToAward) {
    await awardHalo(targetToAward);
  }

  revalidatePath("/");
}

export async function awardHalo(targetUserId) {
  const supabase = getSupabase();
  const { data: profile } = await supabase
    .from("profiles")
    .select("halos")
    .eq("clerk_id", targetUserId)
    .single();
  const currentHalos = profile?.halos || 0;
  const { error } = await supabase
    .from("profiles")
    .update({ halos: currentHalos + 1 })
    .eq("clerk_id", targetUserId);
  if (error) throw error;
}

export async function sendFavourRequest(formData) {
  const { auth } = await import("@clerk/nextjs/server");
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const supabase = getSupabase();
  const receiver_id = formData.get("receiverId");
  const favour_text = formData.get("favourText");
  const category = formData.get("favourCategory");
  const { data: senderProfile } = await supabase
    .from("profiles")
    .select("postcode")
    .eq("clerk_id", userId)
    .single();
  const { error } = await supabase.from("favours").insert({
    sender_id: userId,
    receiver_id,
    favour_text,
    category,
    location_tag: senderProfile?.postcode || "Unknown",
    status: "pending",
  });
  if (error) throw error;
  revalidatePath("/");
  revalidatePath("/community");
}

export async function getMyRequests() {
  const { auth } = await import("@clerk/nextjs/server");
  const { userId } = await auth();
  if (!userId) return [];
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("favours")
    .select(`*, profiles:sender_id (full_name, city, halos)`)
    .eq("receiver_id", userId)
    .in("status", ["pending", "active", "completed"]);
  if (error) return [];
  return data;
}

export async function getMySentRequests() {
  const { auth } = await import("@clerk/nextjs/server");
  const { userId } = await auth();
  if (!userId) return [];
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("favours")
    .select("*")
    .eq("sender_id", userId)
    .in("status", ["pending", "active", "completed"]);
  if (error) return [];
  return data;
}

export async function declineFavour(formData) {
  const supabase = getSupabase();
  const favourId =
    formData instanceof FormData ? formData.get("favourId") : formData;
  const { error } = await supabase
    .from("favours")
    .update({ status: "declined" })
    .eq("id", favourId);
  if (error) throw error;
  revalidatePath("/");
}

export async function deleteFavour(formData) {
  const { auth } = await import("@clerk/nextjs/server");
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  const supabase = getSupabase();
  const favourId = formData.get("favourId");

  const { data: favour } = await supabase
    .from("favours")
    .select("status")
    .eq("id", favourId)
    .single();

  if (favour?.status !== "completed") {
    throw new Error("Only completed missions can be deleted.");
  }

  const { error } = await supabase.from("favours").delete().eq("id", favourId);

  if (error) throw error;

  revalidatePath("/inbox");
  revalidatePath("/outbox");
  revalidatePath("/");
}
