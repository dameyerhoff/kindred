"use client";

import { SignUpButton, UserButton, useUser } from "@clerk/clerk-react";

export default function AuthActionButton() {
  const { userId } = useUser();

  if (!userId) {
    return (
      <SignUpButton mode="modal">
        <button className="bg-lime-400 hover:bg-white text-green-950 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(163,230,53,0.4)] ml-2">
          Join Community 😇
        </button>
      </SignUpButton>
    );
  }

  return (
    <div className="scale-125 ml-2">
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
