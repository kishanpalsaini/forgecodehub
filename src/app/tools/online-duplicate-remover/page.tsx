import { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/app/components/Navbar";
import RelatedTools from "@/app/components/RelatedTools";
import ToolFaq from "@/app/components/tools/faq/TextWritingFaq/ToolFaq";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import TextWritingTools from "@/app/components/tools/text-writing-tools/TextWritingTools";
import TEXT_TOOLS_FAQS from "@/lib/faqs/textToolsFaqs";
import { duplicateRemoverFaqSchema } from "./faqSchema";

export const metadata: Metadata = {
  title: "Duplicate Line Remover - Remove Duplicate Text Online Free | ForgeCodeHub",
  description:
    "Remove duplicate lines from text online for free. Clean up lists, emails, and data by removing repeated entries. Keep only unique lines instantly.",
  keywords: [
    "duplicate remover",
    "remove duplicates",
    "duplicate line remover",
    "remove repeated lines",
    "unique lines",
    "deduplicate text",
    "clean up list",
    "remove duplicate entries",
  ],
  authors: [{ name: "ForgeCodeHub" }],
  creator: "ForgeCodeHub",
  openGraph: {
    title: "Duplicate Line Remover Tool | ForgeCodeHub",
    description: "Remove duplicate lines and keep only unique entries. Free and instant.",
    url: "https://www.forgecodehub.com/tools/online-duplicate-remover",
    siteName: "ForgeCodeHub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Duplicate Line Remover Tool",
    description: "Clean up lists by removing duplicate lines automatically.",
  },
  robots: {
    index: true,
    follow: true,
  googleBot: {
    index: true,
    follow: true,
  },
  },
  alternates: {
    canonical: "https://www.forgecodehub.com/tools/online-duplicate-remover",
  },
};

export default function DuplicateRemoverPage() {
     const filteredFaqs = TEXT_TOOLS_FAQS.filter(faq => 
    faq.categories.includes('duplicate-remover') || faq.categories.includes('general')
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(duplicateRemoverFaqSchema) }}
      />

      <Navbar />

      <Suspense fallback={<LoadingSpinner text="Loading Duplicate Remover..." />}>
        <TextWritingTools defaultTool="duplicate-remover" />
      </Suspense>

      <div className="container" style={{ margin: "0 auto", maxWidth: "1600px", padding: "4rem 1rem" }}>
        <RelatedTools currentPath="/tools/online-duplicate-remover" category="productivity" />
      </div>

      <div style={{ background: "#252537", padding: "0 24px 80px", display: "flex" }}>
        <ToolFaq
          faqs={filteredFaqs}
          title="Duplicate Remover FAQ"
          subtitle="Common questions about removing duplicates"
        />
      </div>
    </>
  );
}