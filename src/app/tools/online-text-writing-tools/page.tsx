import { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/app/components/Navbar";
import RelatedTools from "@/app/components/RelatedTools";
import ToolFaq from "@/app/components/tools/faq/TextWritingFaq/ToolFaq";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import TextWritingTools from "@/app/components/tools/text-writing-tools/TextWritingTools";
import TEXT_TOOLS_FAQS from "@/lib/faqs/textToolsFaqs";
import textToolsFaqSchema from "./faqSchema";

export const metadata: Metadata = {
  title: "Free Text & Writing Tools - Word Counter, Case Converter | ForgeCodeHub",
  description:
    "Free online text tools: word counter, character counter, case converter, text sorter, duplicate remover, fancy font generator, and more. Transform your text instantly.",
  keywords: [
    "word counter",
    "character counter",
    "case converter",
    "text tools",
    "writing tools",
    "remove extra spaces",
    "text sorter",
    "duplicate remover",
    "fancy font generator",
    "text to emoji",
    "reverse text",
    "online text editor",
  ],
  openGraph: {
    title: "Free Text & Writing Tools | ForgeCodeHub",
    description:
      "Transform your text with 10+ free online tools. Word counter, case converter, fancy fonts, and more.",
    url: "https://www.forgecodehub.com/tools/online-text-writing-tools",
    type: "website",
  },
  alternates: {
    canonical: "https://www.forgecodehub.com/tools/online-text-writing-tools",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Text & Writing Tools",
    description: "10+ free text manipulation tools. Count words, convert case, generate fancy fonts, and more.",
  },
};

export default function TextWritingToolsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(textToolsFaqSchema) }}
      />

      <Navbar />

      <Suspense fallback={<LoadingSpinner text="Loading Text Tools..." />}>
        <TextWritingTools />
      </Suspense>

      <div
        className="container"
        style={{ margin: "0 auto", maxWidth: "1600px", padding: "4rem 1rem" }}
      >
        <RelatedTools currentPath="/tools/online-text-writing-tools" category="productivity" />
      </div>

      <div
        style={{
          background: "#252537",
          padding: "0 24px 80px",
          display: "flex",
        }}
      >
        <ToolFaq
          faqs={TEXT_TOOLS_FAQS}
          title="Text Tools FAQ"
          subtitle="Everything you need to know about text manipulation tools"
        />
      </div>
    </>
  );
}