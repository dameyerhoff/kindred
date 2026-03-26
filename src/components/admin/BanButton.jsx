"use client";

import { useTransition } from "react";
// FIXED: Removed the static import of banUserAction

// This is the button admins use to stop or allow someone from using the site
export default function BanButton({ userId, isBanned }) {
  const [isPending, startTransition] = useTransition();

  // This part runs when the admin clicks the button
  const handleToggle = () => {
    // This asks the admin if they are really sure before they click
    const message = isBanned
      ? "Unban this user?"
      : "Are you sure you want to ban this user?";
    if (!confirm(message)) return;

    // This tells the database to change whether the person is banned or not
    startTransition(async () => {
      try {
        // FIXED: Dynamically import the admin action right when needed
        const { banUserAction } = await import("@/lib/actions");
        await banUserAction(userId, isBanned);
      } catch (err) {
        // If the computer has a problem, this shows a message saying it failed
        alert("Action failed:" + err.message);
      }
    });
  };

  return (
    // This draws the actual button and changes its color to red for ban or green for unban
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
        isBanned
          ? "bg-green-100 text-green-700 hover:bg-green-200"
          : "bg-red-100 text-red-700 hover:bg-red-200"
      } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {/* This shows the text on the button and changes it to say processing while it works */}
      {isPending ? "Processing..." : isBanned ? "Unban" : "Ban User"}
    </button>
  );
}
