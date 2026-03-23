"use client";

import { useTransition } from "react";
import { warnUserAction } from "@/lib/actions";

export default function WarnButton({ userId }) {
  const [isPending, startTransition] = useTransition();

  const handleWarn = () => {
    const reason = prompt(
      "Enter the reason for this warning (e.g, Potty mouth):",
    );
    if (!reason) return;

    startTransition(async () => {
      try {
        await warnUserAction(userId, reason);
        alert(
          "Warning issued. If this is their second warning, they have been automatically banned",
        );
      } catch (err) {
        alert("Warning failed: " + err.message);
      }
    });
  };

  return (
    <button
      onClick={handleWarn}
      disabled={isPending}
      className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-[10px] font-black uppercase hover:bg-yellow-200 transition-colors disabled:opacity-50"
    >
      {isPending ? "..." : "Warn"}
    </button>
  );
}
