"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Dave: We're moving the client creation into a function to keep it fresh for every request.
function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return createClient(supabaseUrl, supabaseKey);
}

export async function saveProfile(formData) {
  // Dave: Diagnostic Tracers to pinpoint the "Unauthorized" error
  const authData = await auth();
  const userId = authData.userId;

  if (!userId) {
    console.error(
      "DEBUG: FAILURE - No UserID. Clerk session did not cross to server.",
    );
    throw new Error("Unauthorized");
  }

  const supabase = getSupabase();
  const full_name = formData.get("full_name");
  const city = formData.get("city");
  const postcode = formData.get("postcode");

  // Dave: Critical fix - parsing the new unified tags JSON from the form
  const tagsRaw = formData.get("tags");
  const tags = tagsRaw ? JSON.parse(tagsRaw) : [];

  console.log("DEBUG: Attempting Supabase Upsert for:", full_name);
  console.log("DEBUG: Tags being saved:", tags);

  const { error } = await supabase.from("profiles").upsert({
    clerk_id: userId,
    full_name,
    city,
    postcode,
    tags, // Dave: Saving the unified array to the tags column
    updated_at: new Date(),
  });

  if (error) {
    console.error("DEBUG: Supabase Error:", error.message);
    throw error;
  }

  console.log("DEBUG: SUCCESS - Redirecting to Home");
  revalidatePath("/");
  redirect("/");
}

export async function getProfiles() {
  const supabase = getSupabase();
  console.log("DEBUG: Action fetching profiles...");

  // Dave: Fixed column name from created_at to updated_at to match your database schema
  const { data, error, count } = await supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("DEBUG: Fetch error in getProfiles:", error.message);
    return [];
  }

  console.log("DEBUG: Action found profiles count:", data?.length || 0);
  console.log("DEBUG: Supabase explicit count:", count);
  return data;
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

  const { error } = await supabase.from("favours").insert({
    sender_id: userId,
    receiver_id,
    favour_text,
    status: "pending",
  });

  if (error) throw error;

  revalidatePath("/");
  // Dave: Redirecting back to home. We've removed the success flag from the URL in page.js
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

// Dave: New action to fetch favours sent BY me
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
