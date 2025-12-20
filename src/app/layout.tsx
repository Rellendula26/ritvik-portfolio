import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CursorDot from "@/components/CursorDot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Ritvik Ellendula | Bioengineering @ Penn",
  description:
    "Ritvik Ellendula is a Bioengineering student at the University of Pennsylvania. Projects in engineering, software, research, and creative technology.",
  metadataBase: new URL("https://ritvik-portfolio-eta.vercel.app"),
  openGraph: {
    title: "Ritvik Ellendula",
    description:
      "Bioengineering @ Penn. Engineering, software, research, and creative projects.",
    url: "https://ritvik-portfolio-eta.vercel.app",
    siteName: "Ritvik Ellendula",
    images: [
      {
        url: "/ritvik.jpg",
        width: 1200,
        height: 630,
        alt: "Ritvik Ellendula",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-smileys text-zinc-800`}
      >
        {/* Cursor */}
        <CursorDot />

        {/* Global Nav */}
        <Navbar />

        {/* Page Content */}
        <main className="min-h-[calc(100vh-200px)]">
          {children}
        </main>

        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  );
}
