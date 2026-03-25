"use client";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar({ inboxCount = 0, outboxCount = 0, userId }) {
  const pathname = usePathname();

  const navLinks = [
    { href: "/favour-map", label: "Favour Map 🗺️" },
    { href: "/community", label: "Community Grid 🌐" },
    { href: "/notice-board", label: "Notice Board 📜" },
    { href: "/diary", label: "My Diary 🗓️" },
    { href: "/about-us", label: "About Us 💚" },
  ];

  const linkStyles =
    "px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all items-center gap-2 flex";
  const inactiveStyles =
    "bg-white/5 hover:bg-white/10 border border-white/10 text-white";
  const activeStyles =
    "bg-kindred-lime text-kindred-dark border border-kindred-lime shadow-kindred";

  return (
    <header className="max-w-6xl mx-auto flex justify-between items-center mb-16 relative z-50 border-b border-white/10 pb-8 px-4">
      <div>
        <Link href="/">
          <img
            src="/kindred-logo.png"
            alt="Logo"
            className="h-16 md:h-20 w-auto object-contain drop-shadow-kindred"
          />
        </Link>
      </div>
      <nav className="hidden md:flex items-center gap-3">
        {userId && (
          <div className="flex gap-2 mr-4 border-r border-white/10 pr-4">
            <Link
              href="/inbox"
              className={`flex items-center gap-2 bg-white/5 border px-3 py-2 rounded-xl transition-all hover:shadow-kindred ${inboxCount > 0 ? "border-kindred-lime shadow-kindred animate-pulse" : "border-white/10"}`}
            >
              <span className="text-sm">📬</span>
              <span className="text-[10px] font-black text-white/60 uppercase">
                {inboxCount}
              </span>
            </Link>
            <Link
              href="/outbox"
              className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-2 rounded-xl hover:border-kindred-lime/50 transition-all hover:shadow-kindred"
            >
              <span className="text-sm">📤</span>
              <span className="text-[10px] font-black text-white/60 uppercase">
                {outboxCount}
              </span>
            </Link>
          </div>
        )}
      </nav>
      <nav className="hidden md:flex items-center gap-3">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${linkStyles} ${pathname === link.href ? activeStyles : inactiveStyles}`}
          >
            {link.label}
          </Link>
        ))}
        <div className="scale-125 ml-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </nav>

      <div className="md:hidden flex items-center gap-4">
        <div className="scale-110 mr-2">
          <UserButton afterSignOutUrl="/" />
        </div>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="bg-white/10 border border-white/10 p-3 rounded-2xl text-white outline-none hover:bg-white/20 transition-all">
              <span className="text-xl">☰</span>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="min-w-[200px] bg-kindred-dark/95 backdrop-blur-xl border border-white/10 p-2 rounded-3xl shadow-2xl z-[100] animate-slide-down"
              sideOffset={10}
              align="end"
            >
              {navLinks.map((link) => (
                <DropdownMenu.Item key={link.href} asChild>
                  <Link
                    href={link.href}
                    className={`block w-full px-4 py-4 mb-1 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${pathname === link.href ? "bg-kindred-lime text-kindred-dark" : "text-white/60 hover:bg-white/10 hover:text-white"}`}
                  >
                    {link.label}
                  </Link>
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
