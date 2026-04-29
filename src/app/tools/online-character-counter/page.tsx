import { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/app/components/Navbar";
import RelatedTools from "@/app/components/RelatedTools";
import ToolFaq from "@/app/components/tools/faq/TextWritingFaq/ToolFaq";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import TextWritingTools from "@/app/components/tools/text-writing-tools/TextWritingTools";
import TEXT_TOOLS_FAQS from "@/lib/faqs/textToolsFaqs";
import { characterCounterFaqSchema } from "./faqSchema";

export const metadata: Metadata = {
  title: "Free Character Counter - Count Letters, Numbers & Special Characters | ForgeCodeHub",
  description:
    "Free online character counter tool. Analyze text in detail: count total characters, letters, numbers, spaces, special characters, uppercase, and lowercase instantly.",
  keywords: [
    "character counter",
    "letter counter",
    "count characters online",
    "text character count",
    "character calculator",
    "special character counter",
    "uppercase counter",
    "lowercase counter",
    "text analysis tool",
  ],
  alternates: {
    canonical: "https://www.forgecodehub.com/tools/online-character-counter",
  },
  authors: [{ name: "ForgeCodeHub" }],
  creator: "ForgeCodeHub",
  openGraph: {
    title: "Free Character Counter Tool | ForgeCodeHub",
    description: "Analyze characters in detail: letters, numbers, spaces, and special characters. Instant and accurate.",
    url: "https://www.forgecodehub.com/tools/online-character-counter",
    siteName: "ForgeCodeHub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Character Counter Tool",
    description: "Count and analyze all character types instantly. Free and accurate.",
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

export default function CharacterCounterPage() {
     const filteredFaqs = TEXT_TOOLS_FAQS.filter(faq => 
    faq.categories.includes('character-counter') || faq.categories.includes('general')
  );
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(characterCounterFaqSchema) }}
      />

      <Navbar />

      <Suspense fallback={<LoadingSpinner text="Loading Character Counter..." />}>
        <TextWritingTools defaultTool="character-counter" />
      </Suspense>

      <div className="container" style={{ margin: "0 auto", maxWidth: "1600px", padding: "4rem 1rem" }}>
        <RelatedTools currentPath="/tools/online-character-counter" category="productivity" />
      </div>

      <div style={{ background: "#252537", padding: "0 24px 80px", display: "flex" }}>
        <ToolFaq
          faqs={filteredFaqs}
          title="Character Counter FAQ"
          subtitle="Everything about counting characters"
        />
      </div>
    </>
  );
}