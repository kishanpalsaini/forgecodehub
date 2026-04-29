import { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/app/components/Navbar";
import WordEditor from "@/app/components/tools/online-word-editor/WordEditor";
import RelatedTools from "@/app/components/RelatedTools";
import ToolFaq from "@/app/components/tools/faq/ToolFaq";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import { WORD_EDITOR_FAQS } from "@/lib/faqs/wordEditorFaqs";
import faqSchema from "./faqSchema";

export const metadata: Metadata = {
  title: "Free Online Word Processor - MS Word Alternative | ForgeCodeHub",
  description:
    "Professional online word processor with all MS Word features. Create, edit, and format documents. Export to DOCX, PDF, TXT. Free, no signup required. Works offline.",
  keywords: [
    "online word processor",
    "free word editor",
    "microsoft word alternative",
    "docx editor",
    "online document editor",
    "word processor online",
    "free word document editor",
    "web based word processor",
    "online doc editor",
    "create word document online",
  ],
  openGraph: {
    title: "Free Online Word Processor - Create & Edit Documents",
    description:
      "Professional word processor with formatting, tables, images, and export to DOCX/PDF. Free, private, works offline.",
    url: "https://www.forgecodehub.com/tools/online-word-editor",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Word Processor",
    description: "Create, edit, and format documents online. Export to DOCX, PDF, TXT.",
  },
  alternates: {
    canonical: "https://www.forgecodehub.com/tools/online-word-editor",
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

export default function WordEditorPage() {
  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Navbar />

      <Suspense fallback={<LoadingSpinner text="Loading Word Editor..." />}>
        <WordEditor />
      </Suspense>

      {/* Related Tools */}
      <div
        className="container"
        style={{ margin: "0 auto", maxWidth: "1600px", padding: "4rem 1rem" }}
      >
        <RelatedTools currentPath="/tools/online-word-editor" category="productivity" />
      </div>

      {/* FAQ Section */}
      <div
        style={{
          background: "#252537",
          padding: "0 24px 80px",
          display: "flex",
        }}
      >
        <ToolFaq
          faqs={WORD_EDITOR_FAQS}
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about the Online Word Processor"
        />
      </div>
    </>
  );
}