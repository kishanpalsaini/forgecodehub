import { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/app/components/Navbar";
import RelatedTools from "@/app/components/RelatedTools";
import ToolFaq from "@/app/components/tools/faq/TextWritingFaq/ToolFaq";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import TextWritingTools from "@/app/components/tools/text-writing-tools/TextWritingTools";
import TEXT_TOOLS_FAQS from "@/lib/faqs/textToolsFaqs";
import { textToEmojiFaqSchema } from "./faqSchema";

export const metadata: Metadata = {
  title: "Text to Emoji Converter - Convert Text to Emojis Online Free | ForgeCodeHub",
  description:
    "Convert text to emoji online for free. Transform letters and numbers into fun emoji representations. Perfect for social media posts, messages, and creative content.",
  keywords: [
    "text to emoji",
    "emoji converter",
    "text emoji generator",
    "letter emoji",
    "emoji text",
    "convert to emoji",
    "emoji letters",
    "emoji generator",
    "regional indicator emoji",
  ],
  authors: [{ name: "ForgeCodeHub" }],
  creator: "ForgeCodeHub",
  openGraph: {
    title: "Text to Emoji Converter | ForgeCodeHub",
    description: "Convert text into fun emoji representations. Multiple styles available.",
    url: "https://www.forgecodehub.com/tools/online-text-to-emoji",
    siteName: "ForgeCodeHub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Text to Emoji Converter",
    description: "Transform text into emoji representations instantly. Fun and free!",
  },
  alternates: {
    canonical: "https://www.forgecodehub.com/tools/online-text-to-emoji",
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

export default function TextToEmojiPage() {
     const filteredFaqs = TEXT_TOOLS_FAQS.filter(faq => 
    faq.categories.includes('text-to-emoji') || faq.categories.includes('general')
  );

      // DEBUG: Remove after testing
  console.log('Total FAQs:', TEXT_TOOLS_FAQS.length);
  console.log('Filtered FAQs for Text to Emoji:', filteredFaqs.length);
  console.log('FAQ Titles:', filteredFaqs.map(f => f.question));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(textToEmojiFaqSchema) }}
      />

      <Navbar />

      <Suspense fallback={<LoadingSpinner text="Loading Text to Emoji Converter..." />}>
        <TextWritingTools defaultTool="text-to-emoji" />
      </Suspense>

      <div className="container" style={{ margin: "0 auto", maxWidth: "1600px", padding: "4rem 1rem" }}>
        <RelatedTools currentPath="/tools/online-text-to-emoji" category="productivity" />
      </div>

      <div style={{ background: "#252537", padding: "0 24px 80px", display: "flex" }}>
        <ToolFaq
          faqs={filteredFaqs}
          title="Text to Emoji FAQ"
          subtitle="Questions about converting text to emoji"
        />
      </div>
    </>
  );
}