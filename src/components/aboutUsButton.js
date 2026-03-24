"use client";

import Link from "next/link";

// This builds a reusable button specifically for the About Us page
export default function aboutUsButton({
  href = "/about-us",
  label = "About Us 💚",
  className = "",
}) {
  return (
    /* This makes a small rounded button that only shows up on tablets and computers */
    <Link
      href={href}
      className={`hidden md:flex bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all items-center gap-2 ${className}`}
    >
      {/* This shows the text and emoji inside the button */}
      {label}
    </Link>
  );
}
