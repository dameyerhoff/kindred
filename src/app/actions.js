"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// This part connects us to the database where all the information is stored
function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return createClient(supabaseUrl, supabaseKey);
}

// This saves your name, city, and skills into your profile
export async function saveProfile(formData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const supabase = getSupabase();
  const full_name = formData.get("full_name");
  const city = formData.get("city");
  const postcode = formData.get("postcode");
  const tagsRaw = formData.get("tags");
  const tags = tagsRaw ? JSON.parse(tagsRaw) : [];

  // This updates your existing info or adds it if you are new
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

// This gets a list of everyone who has a profile
export async function getProfiles() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) return [];
  return data;
}

// This gets all the help requests that are still waiting for someone to say yes
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

// This lets a person volunteer to take on a help request from the board
export async function claimFavour(formData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const supabase = getSupabase();
  const favourId = formData.get("favourId");

  // This puts your name on the request so the owner knows you are helping
  const { error } = await supabase
    .from("favours")
    .update({
      receiver_id: userId,
      status: "pending",
    })
    .eq("id", favourId);

  if (error) throw error;
  revalidatePath("/notice-board");
  revalidatePath("/");
}

// This adds a shiny halo point to someone who did a good deed
export async function awardHalo(targetUserId) {
  const supabase = getSupabase();
  const { error } = await supabase.rpc("increment_halos", {
    user_id: targetUserId,
  });
  if (error) throw error;
  revalidatePath("/");
}

// This sends a message to someone asking them for a specific favour
export async function sendFavourRequest(formData) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const supabase = getSupabase();
  const receiver_id = formData.get("receiverId");
  const favour_text = formData.get("favourText");
  const category = formData.get("favourCategory");

  // This finds where you live so it can show up on the map
  const { data: senderProfile } = await supabase
    .from("profiles")
    .select("postcode")
    .eq("clerk_id", userId)
    .single();

  // This puts the new request into the database
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

// This finds all the favours people have asked you to do
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

// This finds all the favours you have asked other people to do
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

// This marks a job as finished once the help has been given
export async function completeFavour(formData) {
  const supabase = getSupabase();
  const favourId =
    formData instanceof FormData ? formData.get("favourId") : formData;

  if (!favourId) return;

  // This changes the status to completed
  const { error: favourError } = await supabase
    .from("favours")
    .update({ status: "completed" })
    .eq("id", favourId);

  if (favourError) {
    console.error("Favour Update Error:", favourError.message);
    throw favourError;
  }

  // This refreshes the pages so the new halo point shows up
  revalidatePath("/");
  revalidatePath("/inbox");

  // This takes you back to the main dashboard
  redirect("/");
}

// This lets you say no to a help request if you cannot do it
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
