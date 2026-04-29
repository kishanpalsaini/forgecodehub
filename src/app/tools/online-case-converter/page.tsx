import { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/app/components/Navbar";
import RelatedTools from "@/app/components/RelatedTools";
import ToolFaq from "@/app/components/tools/faq/TextWritingFaq/ToolFaq";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import TextWritingTools from "@/app/components/tools/text-writing-tools/TextWritingTools";
import TEXT_TOOLS_FAQS from "@/lib/faqs/textToolsFaqs";
import { caseConverterFaqSchema } from "./faqSchema";

export const metadata: Metadata = {
  title: "Free Case Converter - UPPER, lower, Title Case Online | ForgeCodeHub",
  description:
    "Convert text case online for free. Transform to UPPERCASE, lowercase, Title Case, Sentence case, or aLtErNaTe CaSe instantly. No signup required.",
  keywords: [
    "case converter",
    "uppercase converter",
    "lowercase converter",
    "title case converter",
    "sentence case converter",
    "text case changer",
    "convert to uppercase",
    "convert to lowercase",
  ],
  alternates: {
    canonical: "https://www.forgecodehub.com/tools/online-case-converter",
  },
  robots: {
    index: true,
    follow: true,
  googleBot: {
    index: true,
    follow: true,
  },
  },
  openGraph: {
    title: "Free Case Converter Tool | ForgeCodeHub",
    description: "Convert text between UPPERCASE, lowercase, Title Case, and more instantly.",
    url: "https://www.forgecodehub.com/tools/online-case-converter",
    type: "website",
  },
};

export default function CaseConverterPage() {
    const filteredFaqs = TEXT_TOOLS_FAQS.filter(faq => 
    faq.categories.includes('case-converter') || faq.categories.includes('general')
  );
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseConverterFaqSchema) }}
      />

      <Navbar />

      <Suspense fallback={<LoadingSpinner text="Loading Case Converter..." />}>
        <TextWritingTools defaultTool="case-converter" />
      </Suspense>

      <div className="container" style={{ margin: "0 auto", maxWidth: "1600px", padding: "4rem 1rem" }}>
        <RelatedTools currentPath="/tools/online-case-converter" category="productivity" />
      </div>

      <div style={{ background: "#252537", padding: "0 24px 80px", display: "flex" }}>
        <ToolFaq
          faqs={filteredFaqs}
          title="Case Converter FAQ"
          subtitle="Everything about text case conversion"
        />
      </div>
    </>
  );
}
 