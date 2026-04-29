import { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/app/components/Navbar";
import RelatedTools from "@/app/components/RelatedTools";
import ToolFaq from "@/app/components/tools/faq/TextWritingFaq/ToolFaq";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import TextWritingTools from "@/app/components/tools/text-writing-tools/TextWritingTools";
import TEXT_TOOLS_FAQS from "@/lib/faqs/textToolsFaqs";
import { textSorterFaqSchema } from "./faqSchema";

export const metadata: Metadata = {
  title: "Text Sorter A-Z - Sort Lines Alphabetically Online Free | ForgeCodeHub",
  description:
    "Sort text lines alphabetically online for free. Arrange text A→Z or Z→A instantly. Perfect for organizing lists, names, data, and more.",
  keywords: [
    "text sorter",
    "alphabetical sorter",
    "sort lines a-z",
    "sort text online",
    "alphabetize list",
    "organize text",
    "sort names",
    "line sorter",
    "text organizer",
  ],
  authors: [{ name: "ForgeCodeHub" }],
  creator: "ForgeCodeHub",
  openGraph: {
    title: "Text Sorter A-Z Tool | ForgeCodeHub",
    description: "Sort text lines alphabetically. Ascending or descending order. Free and instant.",
    url: "https://www.forgecodehub.com/tools/online-text-sorter",
    siteName: "ForgeCodeHub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Text Sorter A-Z Tool",
    description: "Sort lines alphabetically with one click. A→Z or Z→A.",
  },
  alternates: {
    canonical: "https://www.forgecodehub.com/tools/online-text-sorter",
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

export default function TextSorterPage() {
      const filteredFaqs = TEXT_TOOLS_FAQS.filter(faq => 
    faq.categories.includes('text-sorter') || faq.categories.includes('general')
  );
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(textSorterFaqSchema) }}
      />

      <Navbar />

      <Suspense fallback={<LoadingSpinner text="Loading Text Sorter..." />}>
        <TextWritingTools defaultTool="text-sorter" />
      </Suspense>

      <div className="container" style={{ margin: "0 auto", maxWidth: "1600px", padding: "4rem 1rem" }}>
        <RelatedTools currentPath="/tools/online-text-sorter" category="productivity" />
      </div>

      <div style={{ background: "#252537", padding: "0 24px 80px", display: "flex" }}>
        <ToolFaq
         faqs={filteredFaqs}
          title="Text Sorter FAQ"
          subtitle="Everything about sorting text alphabetically"
        />
      </div>
    </>
  );
}