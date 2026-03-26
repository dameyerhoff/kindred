"use client";

import { useEffect, useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

// --- FIXED: Divider is now declared OUTSIDE of the render function ---
const Divider = () => (
  <div className="h-6 w-[1.5px] bg-black/10 dark:bg-white/10 mx-1 hidden md:block" />
);

export default function Navbar({ inboxCount = 0, outboxCount = 0, userId }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    const root = document.documentElement;

    if (theme === "light") {
      setIsDark(false);
      root.classList.remove("dark");
    } else {
      setIsDark(true);
      root.classList.add("dark");
      if (!theme) localStorage.setItem("theme", "dark");
    }

    // We set mounted at the very end to avoid cascading renders
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  const linkStyles =
    "px-3 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all items-center gap-1.5 flex whitespace-nowrap flex-nowrap shrink-0";
  const inactiveStyles =
    "bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-kindred-text dark:text-white/80";
  const activeStyles =
    "bg-kindred-lime text-kindred-dark border border-kindred-lime shadow-kindred";

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex justify-start mb-4">
        <Link href="/">
          <img
            src="/kindred-logo.png"
            alt="Logo"
            className="h-10 md:h-16 w-auto object-contain drop-shadow-kindred transition-all"
            style={{
              filter:
                mounted && !isDark ? "brightness(0.8) contrast(1.2)" : "none",
            }}
          />
        </Link>
      </div>

      <header className="flex flex-row justify-between items-center mb-16 relative z-50 border-2 border-black/10 dark:border-kindred-lime bg-black/[0.02] dark:bg-kindred-dark/40 backdrop-blur-md py-3 px-4 md:px-6 rounded-[2rem] flex-nowrap shadow-xl transition-all duration-300">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            type="button"
            className="p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:border-kindred-lime transition-all text-lg cursor-pointer min-w-[40px] min-h-[40px]"
            title="Toggle Theme"
          >
            {mounted ? (isDark ? "☀️" : "🌙") : "..."}
          </button>

          <Link
            href="/about-us"
            className={`${linkStyles} hidden md:flex ${pathname === "/about-us" ? activeStyles : inactiveStyles}`}
          >
            About 💚
          </Link>
        </div>

        <Divider />

        <nav className="hidden md:flex flex-row items-center gap-3 flex-nowrap px-4">
          <Link
            href="/favour-map"
            className={`${linkStyles} ${pathname === "/favour-map" ? activeStyles : inactiveStyles}`}
          >
            Favour Map 🗺️
          </Link>
          <Link
            href="/community"
            className={`${linkStyles} ${pathname === "/community" ? activeStyles : inactiveStyles}`}
          >
            Community 🌐
          </Link>
          <Link
            href="/notice-board"
            className={`${linkStyles} ${pathname === "/notice-board" ? activeStyles : inactiveStyles}`}
          >
            Notice Board 📜
          </Link>
        </nav>

        <Divider />

        <div className="flex flex-row items-center gap-2 flex-nowrap">
          {userId && (
            <div className="flex flex-row gap-2 flex-nowrap items-center">
              <div className="hidden md:flex flex-row gap-2 items-center">
                <Link
                  href="/inbox"
                  className={`flex items-center gap-1.5 bg-black/5 dark:bg-white/5 border px-2.5 py-2 rounded-xl transition-all hover:shadow-kindred ${inboxCount > 0 ? "border-kindred-lime shadow-kindred animate-pulse" : "border-black/10 dark:border-white/10"}`}
                >
                  <span className="text-sm">📬</span>
                  <span className="text-[10px] font-black opacity-60 dark:text-white">
                    {inboxCount}
                  </span>
                </Link>

                <Link
                  href="/outbox"
                  className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 px-2.5 py-2 rounded-xl hover:border-kindred-lime/50 transition-all hover:shadow-kindred"
                >
                  <span className="text-sm">📤</span>
                  <span className="text-[10px] font-black opacity-60 dark:text-white">
                    {outboxCount}
                  </span>
                </Link>
              </div>

              <Link
                href="/"
                className={`${linkStyles} hidden lg:flex ${pathname === "/" ? activeStyles : inactiveStyles}`}
              >
                Profile 👤
              </Link>

              <div className="scale-110 lg:scale-125 ml-1 md:ml-2">
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          )}

          <div className="md:hidden">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="bg-kindred-lime text-kindred-dark p-3 rounded-2xl border border-kindred-lime shadow-kindred outline-none active:scale-95 transition-transform">
                  <span className="text-xl leading-none">☰</span>
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  sideOffset={15}
                  align="end"
                  style={{ backgroundColor: "var(--kindred-bg)" }}
                  className="min-w-[220px] border-2 border-kindred-lime p-2 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-[100] animate-in fade-in zoom-in duration-200"
                >
                  <div className="px-4 py-3 text-[9px] font-black text-kindred-lime uppercase tracking-[0.2em] border-b border-kindred-text/10 mb-2">
                    Navigation
                  </div>
                  <DropdownMenu.Item asChild>
                    <Link
                      href="/community"
                      className="flex items-center gap-3 px-4 py-4 text-[11px] font-black uppercase text-kindred-text dark:text-white/80 hover:bg-kindred-lime hover:text-kindred-dark rounded-2xl outline-none transition-colors"
                    >
                      Community 🌐
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link
                      href="/notice-board"
                      className="flex items-center gap-3 px-4 py-4 text-[11px] font-black uppercase text-kindred-text dark:text-white/80 hover:bg-kindred-lime hover:text-kindred-dark rounded-2xl outline-none transition-colors"
                    >
                      Notice Board 📜
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link
                      href="/favour-map"
                      className="flex items-center gap-3 px-4 py-4 text-[11px] font-black uppercase text-kindred-text dark:text-white/80 hover:bg-kindred-lime hover:text-kindred-dark rounded-2xl outline-none transition-colors"
                    >
                      Favour Map 🗺️
                    </Link>
                  </DropdownMenu.Item>
                  <div className="h-[1px] bg-kindred-text/10 my-2" />
                  <DropdownMenu.Item asChild>
                    <Link
                      href="/inbox"
                      className="flex items-center justify-between px-4 py-4 text-[11px] font-black uppercase text-kindred-text dark:text-white/80 hover:bg-kindred-lime hover:text-kindred-dark rounded-2xl outline-none transition-colors"
                    >
                      <span>Inbox 📬</span>
                      <span
                        className={
                          inboxCount > 0
                            ? "text-kindred-lime font-black"
                            : "opacity-50"
                        }
                      >
                        {inboxCount}
                      </span>
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link
                      href="/outbox"
                      className="flex items-center justify-between px-4 py-4 text-[11px] font-black uppercase text-kindred-text dark:text-white/80 hover:bg-kindred-lime hover:text-kindred-dark rounded-2xl outline-none transition-colors"
                    >
                      <span>Outbox 📤</span>
                      <span className="opacity-50">{outboxCount}</span>
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link
                      href="/"
                      className="flex items-center gap-3 px-4 py-4 text-[11px] font-black uppercase text-kindred-text dark:text-white/80 hover:bg-kindred-lime hover:text-kindred-dark rounded-2xl outline-none transition-colors"
                    >
                      Profile 👤
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link
                      href="/about-us"
                      className="flex items-center gap-3 px-4 py-4 text-[11px] font-black uppercase text-kindred-text dark:text-white/80 hover:bg-kindred-lime hover:text-kindred-dark rounded-2xl outline-none transition-colors"
                    >
                      About 💚
                    </Link>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>
      </header>
    </div>
  );
}
