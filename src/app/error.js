"use client";

import ErrorState from "@/components/ErrorState";

// This is the emergency page that shows up if something goes wrong with the website
export default function GlobalError({ error, reset }) {
  return (
    // This part puts the error message right in the middle of the screen
    <div className="min-h-screen flex items-center justify-center">
      {/* This shows a friendly message telling the user to try clicking again */}
      <ErrorState
        error={error}
        reset={reset}
        message="We've hit a snag. Please try again"
      />
    </div>
  );
}
