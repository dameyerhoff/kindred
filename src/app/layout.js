import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
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
export default function RootLayout({ children }) {
  return (
    // This lets the whole website use the login and security features
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {/* This is where the content for each different page is placed */}
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
