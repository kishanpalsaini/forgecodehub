import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./legal-styles.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // ── Title ──────────────────────────────────────────────────────────────────
  // Primary: brand + value prop. Template applies " | ForgeCodeHub" to child pages.
  // Keep under 60 chars for Google. Pipe + brand in template avoids repetition.
  title: {
    default: "ForgeCodeHub — Free Tools for Finance, Dev & Productivity",
    template: "%s | ForgeCodeHub",
  },

  // ── Description ────────────────────────────────────────────────────────────
  // 150–160 chars. Covers all 5 categories. Ends with a soft CTA.
  // Avoids filler ("just", "lean") — Google re-writes those anyway.
  description:
    "44+ free tools in one place — EMI, SIP & GST calculators, JSON formatter, Base64 encoder, image converter, Markdown editor, Pomodoro timer and more. No sign-up. Works instantly.",

  // ── Keywords ───────────────────────────────────────────────────────────────
  // Google ignores the meta keywords tag for ranking but some crawlers use it.
  // Cover all 5 categories + high-intent queries.
  keywords: [
    // Finance
    "EMI calculator",
    "SIP calculator",
    "GST calculator",
    "loan calculator",
    "retirement calculator",
    "FD calculator",
    "net worth calculator",
    // Dev
    "JSON formatter",
    "Base64 encoder decoder",
    "URL encoder decoder",
    "HTML minifier",
    "CSS minifier",
    "crypto encrypt decrypt",
    "online JSON viewer",
    "JSON diff tool",
    "JSON to CSV",
    // Media
    "PNG to JPG converter",
    "image format converter",
    // Productivity
    "online notepad",
    "Pomodoro timer",
    "Markdown editor",
    "word counter",
    "online to-do list",
    // Brand + broad
    "free online tools",
    "developer utilities",
    "free financial calculators",
    "ForgeCodeHub",
    "productivity apps",
    "free tools no signup",
  ],

  // ── Site identity ──────────────────────────────────────────────────────────
  applicationName: "ForgeCodeHub",
  authors: [{ name: "ForgeCodeHub", url: "https://www.forgecodehub.com" }],
  creator: "ForgeCodeHub",
  publisher: "ForgeCodeHub",
  category: "Tools & Utilities",

  // ── Canonical base ─────────────────────────────────────────────────────────
  // All relative URLs in metadata resolve against this.
  metadataBase: new URL("https://www.forgecodehub.com"),

  // ── Canonical + alternates ─────────────────────────────────────────────────
  alternates: {
    canonical: "https://www.forgecodehub.com",
  },

  // ── Open Graph ─────────────────────────────────────────────────────────────
  // Used by Facebook, LinkedIn, WhatsApp, Slack, etc.
  // locale: "en_US" is standard. Add og:image once you have a 1200×630 image.
  openGraph: {
    title: "ForgeCodeHub — 44+ Free Tools for Finance, Dev & Productivity",
    description:
      "Free online tools for everyone — financial calculators (EMI, SIP, GST), developer utilities (JSON, Base64, URL encoder), image converters, Pomodoro timer, Markdown editor and more. No sign-up required.",
    url: "https://www.forgecodehub.com",
    siteName: "ForgeCodeHub",
    locale: "en_US",
    type: "website",
    // Uncomment and add your OG image once created (1200×630px recommended):
    // images: [
    //   {
    //     url: "/og-image.png",
    //     width: 1200,
    //     height: 630,
    //     alt: "ForgeCodeHub — Free Tools for Finance, Dev & Productivity",
    //   },
    // ],
  },

  // ── Twitter / X Card ───────────────────────────────────────────────────────
  // summary_large_image shows a big preview card.
  // site: add your Twitter @handle once you have one.
  twitter: {
    card: "summary_large_image",
    title: "ForgeCodeHub — 44+ Free Tools, No Sign-up",
    description:
      "EMI, SIP & GST calculators · JSON formatter · Base64 encoder · Image converter · Pomodoro timer · Markdown editor — all free, all instant.",
    // site: "@ForgeCodeHub",
    // images: ["/og-image.png"],
  },

  // ── Crawling & indexing ────────────────────────────────────────────────────
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,    // Let Google choose video preview length
      "max-image-preview": "large",
      "max-snippet": -1,          // Let Google choose snippet length
    },
  },

  // ── Search Console & Bing Webmaster verification ───────────────────────────
  // Paste your tokens here once you verify:
  // verification: {
  //   google: "YOUR_GOOGLE_SEARCH_CONSOLE_TOKEN",
  //   bing: "YOUR_BING_WEBMASTER_TOKEN",
  // },

  // ── Icons ──────────────────────────────────────────────────────────────────
  // Uncomment once you have favicon files in /public:
  // icons: {
  //   icon: "/favicon.ico",
  //   shortcut: "/favicon-16x16.png",
  //   apple: "/apple-touch-icon.png",
  // },
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