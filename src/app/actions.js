"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Dave: Fresh client for every request
function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return createClient(supabaseUrl, supabaseKey);
}

export async function saveProfile(formData) {
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

// Dave: New Action for the Notice Board to see all pending missions
export async function getPublicNoticeBoard() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("favours")
    .select(
      `
      *,
      profiles:sender_id (full_name, city, halos)
    `,
    )
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Notice Board Fetch Error:", error.message);
    return [];
  }
  return data;
}

// Dave: Action to allow a Guardian to claim an open favour
export async function claimFavour(formData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const supabase = getSupabase();
  const favourId = formData.get("favourId");

  const { error } = await supabase
    .from("favours")
    .update({
      receiver_id: userId,
      status: "pending", // Dave: Keep as pending but now assigned to a specific receiver
    })
    .eq("id", favourId);

  if (error) throw error;
  revalidatePath("/notice-board");
  revalidatePath("/");
}

export async function awardHalo(targetUserId) {
  const supabase = getSupabase();
  const { error } = await supabase.rpc("increment_halos", {
    user_id: targetUserId,
  });
  if (error) throw error;
  revalidatePath("/");
}

export async function sendFavourRequest(formData) {
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
  redirect("/");
}

export async function getMyRequests() {
  const { userId } = await auth();
  if (!userId) return [];

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("favours")
    .select("*")
    .eq("receiver_id", userId)
    .eq("status", "pending");

  if (error) return [];
  return data;
}

export async function getMySentRequests() {
  const { userId } = await auth();
  if (!userId) return [];

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("favours")
    .select("*")
    .eq("sender_id", userId)
    .eq("status", "pending");

  if (error) return [];
  return data;
}

export async function completeFavour(formData) {
  const supabase = getSupabase();
  const favourId =
    formData instanceof FormData ? formData.get("favourId") : formData;
  const receiverId =
    formData instanceof FormData ? formData.get("receiverId") : null;

  const { error: favourError } = await supabase
    .from("favours")
    .update({ status: "completed" })
    .eq("id", favourId);

  if (favourError) throw favourError;

  if (receiverId) {
    const { error: haloError } = await supabase.rpc("increment_halos", {
      user_id: receiverId,
    });
    if (haloError) throw haloError;
  }
  revalidatePath("/");
  revalidatePath("/inbox");
  redirect("/");
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
