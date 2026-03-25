import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Kindred",
  description: "Favour for Favour Community",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased transition-colors duration-300`}
        >
          <Script id="theme-logic" strategy="beforeInteractive">
            {`
              (function() {
                try {
                  if (!localStorage.theme) {
                    localStorage.theme = 'dark';
                  }
                  if (localStorage.theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (_) {}
              })()
            `}
          </Script>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
