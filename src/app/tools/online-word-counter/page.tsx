import { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/app/components/Navbar";
import RelatedTools from "@/app/components/RelatedTools";
import ToolFaq from "@/app/components/tools/faq/TextWritingFaq/ToolFaq";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import TextWritingTools from "@/app/components/tools/text-writing-tools/TextWritingTools";
import TEXT_TOOLS_FAQS from "@/lib/faqs/textToolsFaqs";
import { wordCounterFaqSchema } from "./faqSchema";

export const metadata: Metadata = {
  title: "Free Word Counter - Count Words, Characters & Sentences Online | ForgeCodeHub",
  description:
    "Free online word counter tool. Count words, characters, sentences, paragraphs, and estimate reading time instantly. Perfect for writers, students, and content creators.",
  keywords: [
    "word counter",
    "character counter",
    "word count tool",
    "count words online",
    "text statistics",
    "reading time calculator",
    "sentence counter",
    "paragraph counter",
  ],
  openGraph: {
    title: "Free Word Counter Tool | ForgeCodeHub",
    description: "Count words, characters, sentences and more. Instant results with reading time estimation.",
    url: "https://www.forgecodehub.com/tools/word-counter",
    type: "website",
  },
};

export default function WordCounterPage() {

     const filteredFaqs = TEXT_TOOLS_FAQS.filter(faq => 
    faq.categories.includes('word-counter') || faq.categories.includes('general')
  );


  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(wordCounterFaqSchema) }}
      />

      <Navbar />

      <Suspense fallback={<LoadingSpinner text="Loading Word Counter..." />}>
        <TextWritingTools defaultTool="word-counter" />
      </Suspense>

      <div className="container" style={{ margin: "0 auto", maxWidth: "1600px", padding: "4rem 1rem" }}>
        <RelatedTools currentPath="/tools/word-counter" category="productivity" />
      </div>

      <div style={{ background: "#252537", padding: "0 24px 80px", display: "flex" }}>
        <ToolFaq
          faqs={filteredFaqs}
          title="Word Counter FAQ"
          subtitle="Common questions about word counting"
        />
      </div>
    </>
  );
}