import { Metadata } from "next";
// import JsonFormatterClient from "@/components/tools/Json-Formatter/JsonFormatterClient";
import JsonFormatterClient from "@/app/components/tools/json-formatter/json-formatter-client";

import RelatedTools from "@/app/components/RelatedTools";
import  { HTML_FAQS } from "@/lib/faqs";
import ToolFaq from "@/app/components/tools/faq/ToolFaq";
import { faqSchema } from "./faqSchema";
import Navbar from "@/app/components/Navbar";
import HtmlMinifierClient from "@/app/components/tools/html-minifier/html-minifier-client";

// import faqSchema from "./components/tools/Json-Formatter/faqSchema";


export const metadata: Metadata = {
  title: "HTML Minifier — ForgeCodeHub",
  description:
    "Free online HTML minifier. Reduce file size and improve loading times of your HTML files instantly.",
  keywords: [
    "html minifier",
    "online html minifier",
    "minify html",
    "html compression",
    "optimize html",
  ], 
  alternates: {
    canonical: "https://www.forgecodehub.com/tools/online-html-minifier",
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
    title: "HTML Minifier — ForgeCodeHub",
    description:
      "Minify your HTML files online. Reduce file size and improve loading times instantly.",
    url: "https://www.forgecodehub.com/tools/online-html-minifier",
  },
};

export default function HtmlMinifierPage() {
  return (
    // <main>
    //   <HtmlMinifierClient />
    // </main>
    <>
      {/* JSON-LD FAQ schema for Google rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

         {/* Top-bar */}

         <Navbar />

      {/* The full JsonFormatterClient tool — all "use client" logic lives here */}
      <HtmlMinifierClient />


      {/* Related tools — auto-pulls same category */}
      <div className="container" style={{ margin: "0 auto", maxWidth: "1600px", padding: "4rem 1rem" }}>
        <RelatedTools
          currentPath="/tools/online-html-minifier"
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
        faqs={HTML_FAQS}
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about using the HTML Minifier."
      />
      </div>
    </>
  );
}


