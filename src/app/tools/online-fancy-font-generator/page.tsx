import { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/app/components/Navbar";
import RelatedTools from "@/app/components/RelatedTools";
import ToolFaq from "@/app/components/tools/faq/TextWritingFaq/ToolFaq";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import TextWritingTools from "@/app/components/tools/text-writing-tools/TextWritingTools";
import TEXT_TOOLS_FAQS from "@/lib/faqs/textToolsFaqs";
import { fancyFontFaqSchema } from "./faqSchema";

export const metadata: Metadata = {
  title: "Fancy Font Generator - Stylish Text for Instagram & Social Media | ForgeCodeHub",
  description:
    "Generate fancy fonts for Instagram, Twitter, Facebook & more. Create 𝕓𝕠𝕝𝕕, 𝒾𝓉𝒶𝓁𝒾𝒸, 🅒🅘🅡🅒🅛🅔 and more stylish Unicode text instantly. Free & easy to use.",
  keywords: [
    "fancy font generator",
    "instagram fonts",
    "stylish text generator",
    "cool fonts",
    "unicode text",
    "fancy text",
    "social media fonts",
    "font converter",
    "decorative text",
    "text styles",
  ],
  alternates: {
    canonical: "https://www.forgecodehub.com/tools/online-fancy-font-generator",
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
    title: "Fancy Font Generator for Instagram & Social Media | ForgeCodeHub",
    description: "Create stylish Unicode fonts for social media. 8+ font styles available instantly.",
    url: "https://www.forgecodehub.com/tools/online-fancy-font-generator",
    type: "website",
  },
};

export default function FancyFontGeneratorPage() {
      const filteredFaqs = TEXT_TOOLS_FAQS.filter(faq => 
    faq.categories.includes('fancy-font') || faq.categories.includes('general')
  );
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(fancyFontFaqSchema) }}
      />

      <Navbar />

      <Suspense fallback={<LoadingSpinner text="Loading Fancy Font Generator..." />}>
        <TextWritingTools defaultTool="fancy-font" />
      </Suspense>

      <div className="container" style={{ margin: "0 auto", maxWidth: "1600px", padding: "4rem 1rem" }}>
        <RelatedTools currentPath="/tools/online-fancy-font-generator" category="productivity" />
      </div>

      <div style={{ background: "#252537", padding: "0 24px 80px", display: "flex" }}>
        <ToolFaq
          faqs={filteredFaqs}
          title="Fancy Font Generator FAQ"
          subtitle="Everything about generating fancy fonts"
        />
      </div>
    </>
  );
}