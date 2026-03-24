"use client";

import { SignUpButton, UserButton, useUser } from "@clerk/clerk-react";

// This builds a button that changes depending on if a person is logged in or not
export default function AuthActionButton() {
  const { userId } = useUser();

  // If the person is not logged in, show the shiny green "Join Community" button
  if (!userId) {
    return (
      /* This makes the join box pop up right on the screen */
      <SignUpButton mode="modal">
        <button className="bg-lime-400 hover:bg-white text-green-950 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(163,230,53,0.4)] ml-2">
          Join Community 😇
        </button>
      </SignUpButton>
    );
  }

  // If the person is already logged in, show their user profile picture instead
  return (
    <div className="scale-125 ml-2">
      {/* This button lets the person manage their account or sign out */}
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
