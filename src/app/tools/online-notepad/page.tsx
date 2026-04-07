import faqSchema from "./faqSchema";
import NotepadClient from "./NotepadClient";
import type { Metadata } from "next";
import RelatedTools from "@/app/components/RelatedTools";
import  { onlineNotepadFaqs } from "@/lib/faqs";
import ToolFaq from "@/app/components/tools/faq/ToolFaq";



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


      {/* Related tools — auto-pulls same category */}
      <div className="container" style={{ margin: "0 auto", maxWidth: "1600px", padding: "4rem 1rem" }}>
        <RelatedTools
          currentPath="/tools/online-notepad"
          category="productivity"
        />
      </div>

      {/* FAQ section below the tool */}
      <div
        style={{
          background: "#252537",
          padding: "0 24px 80px",
          display: "flex",
          // justifyContent: "center",
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