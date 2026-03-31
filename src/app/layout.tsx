import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ForgeCodeHub — Free Developer Tools & Calculators",
  description: "A growing collection of free developer utilities, financial calculators, productivity apps and more. No sign-up. No bloat. Just tools that work.",
  keywords: ["developer tools", "EMI calculator", "GST calculator", "SIP calculator", "financial tools", "free tools", "productivity apps"],
  authors: [{ name: "ForgeCodeHub" }],
  creator: "ForgeCodeHub",
  metadataBase: new URL("https://www.forgecodehub.com"),
  openGraph: {
    title: "ForgeCodeHub — Free Developer Tools & Calculators",
    description: "Free developer utilities, financial calculators and productivity apps — built lean, fast, and purpose-driven.",
    url: "https://www.forgecodehub.com",
    siteName: "ForgeCodeHub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ForgeCodeHub — Free Developer Tools & Calculators",
    description: "Free developer utilities, financial calculators and productivity apps.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
