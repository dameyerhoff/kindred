"use client";

import { useTransition } from "react";

// This builds a single row in the table to show information about a contest
export default function ContestRow({ contest }) {
  const [isPending, startTransition] = useTransition();

  // This part runs when the admin clicks the remove button
  const handleDelete = () => {
    // This asks if you are sure before the contest is deleted
    if (!confirm("Are you sure you want to remove this contest?")) return;

    // This starts the process of taking the contest off the list
    startTransition(async () => {
      // FIXED: Prepared for dynamic action if needed later
      console.log("Deleting contest", contest.id);
      // Example of how you'd call it safely:
      // const { deleteContestAction } = await import("@/lib/actions");
      // await deleteContestAction(contest.id);
    });
  };

  return (
    // This draws the row and makes it change color slightly when you hover over it
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4">
        {/* This shows the title and a little bit of the description */}
        <p className="font-bold text-gray-800">{contest.title}</p>
        <p className="text-xs text-gray-500">
          {contest.description?.substring(0, 50)}...
        </p>
      </td>
      {/* This shows how many halo points someone wins for this contest */}
      <td className="px-6 py-4 text-sm text-gray-600">
        {contest.reward_halos}Halos 😇
      </td>
      <td className="px-6 py-4 text-right text-sm font-medium">
        {/* This is the button to delete the contest */}
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="text-red-600 hover:text-red-900 disabled:opacity-50"
        >
          {/* This changes the text to Removing while the computer is working */}
          {isPending ? "Removing..." : "Remove"}
        </button>
      </td>
    </tr>
  );
}
