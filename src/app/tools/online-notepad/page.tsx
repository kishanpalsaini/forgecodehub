import faqSchema from "./faqSchema";
import NotepadClient from "./NotepadClient";
import type { Metadata } from "next";
import RelatedTools from "@/app/components/RelatedTools";
import { onlineNotepadFaqs } from "@/lib/faqs";
import ToolFaq from "@/app/components/tools/faq/ToolFaq";

export const metadata: Metadata = {
  title: "Online Notepad - Free, No Login, Auto-Save | ForgeCodeHub",
  description:
    "Free online notepad that auto-saves in your browser. No account, no signup required. Supports rich text, dark mode, word count, PDF export and more.",
  keywords: [
    "online notepad",
    "free notepad online",
    "notepad no login",
    "browser notepad",
    "auto save notepad",
    "online text editor",
    "notepad with word count",
    "notepad pdf export",
    "dark mode notepad",
    "distraction free notepad",
  ],
  authors: [{ name: "ForgeCodeHub" }],
  creator: "ForgeCodeHub",
  openGraph: {
    title: "Online Notepad — Free, No Login | ForgeCodeHub",
    description:
      "Write and save notes instantly in your browser. No account needed. Supports dark mode, word count, and PDF export.",
    url: "https://www.forgecodehub.com/tools/online-notepad",
    siteName: "ForgeCodeHub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Online Notepad — Free, No Login | ForgeCodeHub",
    description:
      "Free browser-based notepad with auto-save, dark mode, word count and PDF export. No signup required.",
  },
  alternates: {
    canonical: "https://www.forgecodehub.com/tools/online-notepad",
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

export default function OnlineNotepadPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <NotepadClient />

      <div className="container" style={{ margin: "0 auto", maxWidth: "1600px", padding: "4rem 1rem" }}>
        <RelatedTools
          currentPath="/tools/online-notepad"
          category="productivity"
        />
      </div>

      <div
        style={{
          background: "rgb(37, 37, 55)",
          padding: "0 24px 80px",
          display: "flex",
        }}
      >
        <ToolFaq
          faqs={onlineNotepadFaqs}
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about using the Online Notepad."
        />
      </div>
    </>
  );
}