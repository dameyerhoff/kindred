"use client";

import { useTransition } from "react";

export default function ContestRow({ contest }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm("Are you sure you want to remove this contest?")) return;

    startTransition(async () => {
      console.log("Deleting contest", contest.id);
    });
  };

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        <p className="font-bold text-gray-800">{contest.title}</p>
        <p className="text-xs text-gray-500">
          {contest.description?.substring(0, 50)}...
        </p>
      </td>
      <td className="px-6 py-4 text-sm text-gray-600">
        {contest.reward_halos}Halos 😇
      </td>
      <td className="px-6 py-4 text-right text-sm font-medium">
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="text-red-600 hover:text-red-900 disabled:opacity-50"
        >
          {isPending ? "Removing..." : "Remove"}
        </button>
      </td>
    </tr>
  );
}
