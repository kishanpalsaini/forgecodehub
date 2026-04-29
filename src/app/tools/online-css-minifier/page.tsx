import { Metadata } from "next";
import RelatedTools from "@/app/components/RelatedTools";
import  {  CSS_FAQS } from "@/lib/faqs";
import ToolFaq from "@/app/components/tools/faq/ToolFaq";
import { faqSchema } from "./faqSchema";
import Navbar from "@/app/components/Navbar";
import CssMinifierClient from "@/app/components/tools/css-minifier/css-minifier-client";


export const metadata: Metadata = {
  title: "CSS Minifier — ForgeCodeHub",
  description:
    "Free online CSS minifier. Reduce file size and improve loading times of your CSS files instantly.",
  keywords: [
    "css minifier",
    "online css minifier",
    "minify css",
    "css compression",
    "optimize css",
  ],
  alternates: {
    canonical: "https://www.forgecodehub.com/tools/online-css-minifier",
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
    title: "CSS Minifier — ForgeCodeHub",
    description:
      "Minify your CSS files online. Reduce file size and improve loading times instantly.",
    url: "https://www.forgecodehub.com/tools/online-css-minifier",
  },
};

export default function CssMinifierPage() {
  return (
    <>
      {/* JSON-LD FAQ schema for Google rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

        {/* Top-bar */}
          <Navbar />
          
      {/* The full JsonFormatterClient tool — all "use client" logic lives here */}
      <CssMinifierClient />


      {/* Related tools — auto-pulls same category */}
      <div className="container" style={{ margin: "0 auto", maxWidth: "1600px", padding: "4rem 1rem" }}>
        <RelatedTools
          currentPath="/tools/online-css-minifier"
          category="dev"
        />
      </div>

      {/* FAQ section below the tool */}
      <div
        style={{
          background: "#252537",
          padding: "0 24px 80px",
          display: "flex",
          // justifyContent: "center",
        }}
      >
        <ToolFaq
        faqs={CSS_FAQS}
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about using the CSS Minifier."
      />
      </div>
    </>
  );
}


