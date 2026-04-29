import { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/app/components/Navbar";
import RelatedTools from "@/app/components/RelatedTools";
import ToolFaq from "@/app/components/tools/faq/TextWritingFaq/ToolFaq";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import TextWritingTools from "@/app/components/tools/text-writing-tools/TextWritingTools";
import TEXT_TOOLS_FAQS from "@/lib/faqs/textToolsFaqs";
import { removeSpacesFaqSchema } from "./faqSchema";

export const metadata: Metadata = {
  title: "Remove Extra Spaces Online - Clean Text Formatting Tool | ForgeCodeHub",
  description:
    "Remove extra spaces from text online for free. Clean up multiple spaces, remove all spaces, or format text perfectly. Instant results, no signup required.",
  keywords: [
    "remove extra spaces",
    "remove spaces online",
    "clean text spacing",
    "delete extra spaces",
    "text formatter",
    "space remover",
    "clean up text",
    "format text online",
    "remove multiple spaces",
  ],
  authors: [{ name: "ForgeCodeHub" }],
  creator: "ForgeCodeHub",
  openGraph: {
    title: "Remove Extra Spaces Tool | ForgeCodeHub",
    description: "Clean up text by removing extra spaces instantly. Free online tool.",
    url: "https://www.forgecodehub.com/tools/remove-extra-spaces",
    siteName: "ForgeCodeHub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Remove Extra Spaces Tool",
    description: "Clean text formatting by removing unwanted spaces. Instant and free.",
  },
  alternates: {
    canonical: "https://www.forgecodehub.com/tools/online-remove-extra-spaces",
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

export default function RemoveExtraSpacesPage() {
     const filteredFaqs = TEXT_TOOLS_FAQS.filter(faq => 
    faq.categories.includes('remove-spaces') || faq.categories.includes('general')
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(removeSpacesFaqSchema) }}
      />

      <Navbar />

      <Suspense fallback={<LoadingSpinner text="Loading Space Remover..." />}>
        <TextWritingTools defaultTool="remove-spaces" />
      </Suspense>

      <div className="container" style={{ margin: "0 auto", maxWidth: "1600px", padding: "4rem 1rem" }}>
        <RelatedTools currentPath="/tools/online-remove-extra-spaces" category="productivity" />
      </div>

      <div style={{ background: "#252537", padding: "0 24px 80px", display: "flex" }}>
         <ToolFaq
          faqs={filteredFaqs}
          title="Remove Extra Spaces FAQ"
          subtitle="Common questions about removing spaces"
        />
      </div>
    </>
  );
}