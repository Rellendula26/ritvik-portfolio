import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CursorDot from "@/components/CursorDot";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ritvik Ellendula | Electrical Engineering @ Penn",
  description:
    "Electrical Engineering student at Penn focused on robotics, embedded systems, electronics, and software that controls physical hardware.",
  metadataBase: new URL("https://ritvik-portfolio-eta.vercel.app"),
  openGraph: {
    title: "Ritvik Ellendula",
    description:
      "Robotics-focused Electrical Engineering portfolio: embedded systems, electronics, and software-hardware integration.",
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
        className={`${plusJakarta.variable} ${fraunces.variable} antialiased bg-engineering text-stone-800`}
      >
        <CursorDot />
        <Navbar />
        <main className="min-h-[calc(100vh-200px)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
