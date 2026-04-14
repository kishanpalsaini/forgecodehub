import { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/app/components/Navbar";
import RelatedTools from "@/app/components/RelatedTools";
import ToolFaq from "@/app/components/tools/faq/TextWritingFaq/ToolFaq";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import TextWritingTools from "@/app/components/tools/text-writing-tools/TextWritingTools";
import TEXT_TOOLS_FAQS from "@/lib/faqs/textToolsFaqs";
import { reverseTextFaqSchema } from "./faqSchema";

export const metadata: Metadata = {
  title: "Reverse Text Generator - Flip Text Backwards Online Free | ForgeCodeHub",
  description:
    "Reverse text online for free. Flip text backwards, reverse words, or reverse lines. Create mirror text instantly for social media and creative projects.",
  keywords: [
    "reverse text",
    "flip text backwards",
    "mirror text generator",
    "backwards text",
    "reverse words",
    "text flipper",
    "reverse string",
    "backwards generator",
  ],
  openGraph: {
    title: "Reverse Text Generator | ForgeCodeHub",
    description: "Reverse text characters, words, or lines instantly. Free online tool.",
    url: "https://www.forgecodehub.com/tools/reverse-text-generator",
    type: "website",
  },
};

export default function ReverseTextPage() {
    const filteredFaqs = TEXT_TOOLS_FAQS.filter(faq => 
    faq.categories.includes('reverse-text') || faq.categories.includes('general')
  );
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reverseTextFaqSchema) }}
      />

      <Navbar />

      <Suspense fallback={<LoadingSpinner text="Loading Reverse Text Generator..." />}>
        <TextWritingTools defaultTool="reverse-text" />
      </Suspense>

      <div className="container" style={{ margin: "0 auto", maxWidth: "1600px", padding: "4rem 1rem" }}>
        <RelatedTools currentPath="/tools/reverse-text-generator" category="productivity" />
      </div>

      <div style={{ background: "#252537", padding: "0 24px 80px", display: "flex" }}>
        <ToolFaq 
          faqs={filteredFaqs}
          title="Reverse Text FAQ"
          subtitle="Common questions about reversing text"
        />
      </div>
    </>
  );
}