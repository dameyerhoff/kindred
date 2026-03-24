"use client";

import Link from "next/link";

export default function aboutUsButton({
  href = "/about-us",
  label = "About Us 💚",
  className = "",
}) {
  return (
    <Link
      href={href}
      className={`hidden md:flex bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all items-center gap-2 ${className}`}
    >
      {label}
    </Link>
  );
}
