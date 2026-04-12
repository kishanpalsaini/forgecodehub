import { Metadata } from "next";
import RelatedTools from "@/app/components/RelatedTools";
import  { BASE64_FAQS } from "@/lib/faqs";
import ToolFaq from "@/app/components/tools/faq/ToolFaq";
import { faqSchema } from "./faqSchema";
import Base64Client from "@/app/components/tools/base-64-client/base-64-client";
import Navbar from "@/app/components/Navbar";


export const metadata: Metadata = {
  title: "JSON Formatter & Validator Online — ForgeCodeHub",
  description:
    "Free online JSON formatter, validator, and minifier. Beautify, validate, and minify JSON instantly. Supports syntax highlighting, tree view, and error detection.",
  keywords: [
    "json formatter",
    "json validator",
    "json beautifier",
    "json minifier",
    "online json formatter",
    "json pretty print",
    "json viewer",
    "json tree view",
    "format json online",
    "validate json",
  ],
  openGraph: {
    title: "JSON Formatter & Validator — ForgeCodeHub",
    description:
      "Beautify, validate, and minify JSON online. Free, instant, no signup required.",
    url: "https://www.forgecodehub.com/tools/online-base-64-client",
  },
};

export default function JsonFormatterPage() {
  return (
    // <main>
    //   <JsonFormatterClient />
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
      <Base64Client />


      {/* Related tools — auto-pulls same category */}
      <div className="container" style={{ margin: "0 auto", maxWidth: "1600px", padding: "4rem 1rem" }}>
        <RelatedTools
          currentPath="/tools/online-base-64-client"
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
        faqs={BASE64_FAQS}
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about using the Base64 Encoder/Decoder."
      />
      </div>
    </>
  );
}


