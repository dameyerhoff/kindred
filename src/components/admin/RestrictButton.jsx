"use client";

import { useTransition } from "react";
import { restrictTalentAction } from "@/lib/actions";

export default function RestrictButton({ userId }) {
  const [isPending, startTransition] = useTransition();

  const handleRestrict = () => {
    const talent = prompt("Enter the talent to restrict (e.g, IKEA Building):");
    if (!talent) return;

    if (
      !confirm(
        `Are you sure you want to block this user from offering "${talent}"?`,
      )
    )
      return;

    startTransition(async () => {
      try {
        await restrictTalentAction(userId, talent);
        alert(`Successfully restricted talent: ${talent}`);
      } catch (err) {
        alert("Restriction failed: " + err.message);
      }
    });
  };

  return (
    <button
      onClick={handleRestrict}
      disabled={isPending}
      className="px-3 bg-orange-100 text-orange-700 rounded-full text-[10px] font-black uppercase hover:bg-orange-200 transition-colors disabled:opacity-50"
    >
      {isPending ? "..." : "Restrict"}
    </button>
  );
}
