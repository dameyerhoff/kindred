import { ClerkProvider, UserButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { getMyRequests, getMySentRequests } from "./actions";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

// This part sets up the normal looking text for the website
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// This part sets up the computer-style text for the website
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// This is the name and description that shows up in the browser tab
export const metadata = {
  title: "Kindred",
  description: "Favour for Favour Community",
};

// This is the main shell that wraps around every single page on the site
export default async function RootLayout({ children }) {
  // Check who is logged in to show their specific header stats
  const { userId } = await auth();

  // Get the message counts so they are always visible in the top bar
  const myRequests = userId ? (await getMyRequests()) || [] : [];
  const mySentRequests = userId ? (await getMySentRequests()) || [] : [];

  return (
    // This lets the whole website use the login and security features
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {/* This is the persistent Header that now stays visible on every tab */}
          <header className="max-w-6xl mx-auto flex justify-between items-center py-8 relative z-50 border-b border-white/10 px-4 md:px-8">
            <div>
              <Link href="/">
                <img
                  src="/kindred-logo.png"
                  alt="Kindred Logo"
                  className="h-20 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                />
              </Link>
            </div>

            <div className="flex items-center gap-3">
              {/* Navigation links for the Map, Grid, and Notice Board */}
              <Link
                href="/favour-map"
                className="hidden md:flex bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all"
              >
                Favour Map 🗺️
              </Link>
              <Link
                href="/community"
                className="hidden md:flex bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all"
              >
                Community Grid 🌐
              </Link>
              <Link
                href="/notice-board"
                className="hidden md:flex bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all"
              >
                The Notice Board 📜
              </Link>

              {/* These are the Inbox and Outbox buttons you wanted at the top */}
              {userId && (
                <>
                  <Link
                    href="/inbox"
                    className="flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 px-3 py-2 rounded-xl hover:bg-emerald-500/40 transition-all"
                  >
                    <span className="text-sm">📬</span>
                    <span className="text-[10px] font-black text-emerald-400 uppercase">
                      {myRequests.length}
                    </span>
                  </Link>
                  <Link
                    href="/outbox"
                    className="flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 px-3 py-2 rounded-xl hover:bg-blue-500/40 transition-all"
                  >
                    <span className="text-sm">📤</span>
                    <span className="text-[10px] font-black text-blue-400 uppercase">
                      {mySentRequests.length}
                    </span>
                  </Link>
                </>
              )}

              {/* The main Profile button */}
              <Link
                href="/"
                className="bg-lime-400 text-green-950 border border-lime-400 px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(163,230,53,0.4)] ml-2"
              >
                Profile 👤
              </Link>

              {/* Login/Signup or User Profile icon */}
              {!userId ? (
                <SignUpButton mode="modal">
                  <button className="bg-lime-400 hover:bg-white text-green-950 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(163,230,53,0.4)] ml-2">
                    Join Community 😇
                  </button>
                </SignUpButton>
              ) : (
                <div className="scale-125 ml-2">
                  <UserButton afterSignOutUrl="/" />
                </div>
              )}
            </div>
          </header>

          {/* This is where the content for each different page is placed */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
