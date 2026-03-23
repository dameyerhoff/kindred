"use client";

import ErrorState from "@/components/ErrorState";

export default function GlobalError({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <ErrorState
        error={error}
        reset={reset}
        message="We've hit a snag. Please try again"
      />
    </div>
  );
}
