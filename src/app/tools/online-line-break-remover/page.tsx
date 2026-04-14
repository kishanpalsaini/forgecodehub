import { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/app/components/Navbar";
import RelatedTools from "@/app/components/RelatedTools";
import ToolFaq from "@/app/components/tools/faq/TextWritingFaq/ToolFaq";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import TextWritingTools from "@/app/components/tools/text-writing-tools/TextWritingTools";
import TEXT_TOOLS_FAQS from "@/lib/faqs/textToolsFaqs";
import { lineBreakRemoverFaqSchema } from "./faqSchema";

export const metadata: Metadata = {
  title: "Line Break Remover - Remove Line Breaks Online Free | ForgeCodeHub",
  description:
    "Remove line breaks from text online for free. Convert multi-line text to single line instantly. Perfect for cleaning up copied text, emails, and documents.",
  keywords: [
    "remove line breaks",
    "line break remover",
    "remove newlines",
    "convert to single line",
    "remove paragraph breaks",
    "text line remover",
    "flatten text",
    "remove carriage returns",
  ],
  authors: [{ name: "ForgeCodeHub" }],
  creator: "ForgeCodeHub",
  openGraph: {
    title: "Line Break Remover Tool | ForgeCodeHub",
    description: "Remove all line breaks and convert multi-line text to single line instantly.",
    url: "https://www.forgecodehub.com/tools/line-break-remover",
    siteName: "ForgeCodeHub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Line Break Remover Tool",
    description: "Convert multi-line text to single line. Free and instant.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.forgecodehub.com/tools/line-break-remover",
  },
};

export default function LineBreakRemoverPage() {
     const filteredFaqs = TEXT_TOOLS_FAQS.filter(faq => 
    faq.categories.includes('line-break-remover') || faq.categories.includes('general')
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(lineBreakRemoverFaqSchema) }}
      />

      <Navbar />

      <Suspense fallback={<LoadingSpinner text="Loading Line Break Remover..." />}>
        <TextWritingTools defaultTool="line-break-remover" />
      </Suspense>

      <div className="container" style={{ margin: "0 auto", maxWidth: "1600px", padding: "4rem 1rem" }}>
        <RelatedTools currentPath="/tools/line-break-remover" category="productivity" />
      </div>

      <div style={{ background: "#252537", padding: "0 24px 80px", display: "flex" }}>
        <ToolFaq
          faqs={filteredFaqs}
          title="Line Break Remover FAQ"
          subtitle="Questions about removing line breaks"
        />
      </div>
    </>
  );
}