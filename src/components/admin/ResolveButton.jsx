"use client";

import { useTransition } from "react";
import { resolveReportsAction } from "@/lib/actions";

export default function ResolveButton({ userId }) {
  const [isPending, startTransition] = useTransition();

  const handleResolve = () => {
    if (!confirm("Clear all pending reports for this user?")) return;

    startTransition(async () => {
      try {
        await resolveReportsAction(userId);
      } catch (err) {
        alert("Resolution failed: " + err.message);
      }
    });
  };

  return (
    <button
      onClick={handleResolve}
      disabled={isPending}
      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase hover:bg-blue-200 transition-colors disabled:opacity-50"
    >
      {isPending ? "..." : "Resolve"}
    </button>
  );
}
