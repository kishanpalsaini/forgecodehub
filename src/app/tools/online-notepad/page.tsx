import { onlineNotepadFaqs } from "@/lib/online-notepad-faqs";
// import OnlineNotepadFaq from "@/components/tools/faq/OnlineNotepadFaq";
import OnlineNotepadFaq from "../../components/tools/faq/OnlineNotepadFaq";
// import faqSchema from "@/lib/online-notepad-faq-schema";
import faqSchema from "./faqSchema";
import NotepadClient from "./NotepadClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Online Notepad — Free, No Login | ForgeCodeHub",
  description:
    "Free online notepad that auto-saves in your browser. No account, no signup. Supports rich text, dark mode, word count, PDF export and more.",
};

export default function OnlineNotepadPage() {
  return (
    <>
      {/* JSON-LD FAQ schema for Google rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* The full notepad tool — all "use client" logic lives here */}
      <NotepadClient />

      {/* FAQ section below the tool */}
      <div
        style={{
          background: "#252537",
          padding: "0 24px 80px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <OnlineNotepadFaq faqs={onlineNotepadFaqs} />
      </div>
    </>
  );
}