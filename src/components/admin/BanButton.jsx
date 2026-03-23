"use client";

import { useTransition } from "react";
import { banUserAction } from "@/lib/actions";

export default function BanButton({ userId, isBanned }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const message = isBanned
      ? "Unban this user?"
      : "Are you sure you want to ban this user?";
    if (!confirm(message)) return;

    startTransition(async () => {
      try {
        await banUserAction(userId, isBanned);
      } catch (err) {
        alert("Action failed:" + err.message);
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
        isBanned
          ? "bg-green-100 text-green-700 hover:bg-green-200"
          : "bg-red-100 text-red-700 hover:bg-red-200"
      } ${isPending ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {isPending ? "Processing..." : isBanned ? "Unban" : "Ban User"}
    </button>
  );
}
