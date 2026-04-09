import { Metadata } from "next";
// import JsonFormatterClient from "@/components/tools/Json-Formatter/JsonFormatterClient";
import JsonFormatterClient from "@/app/components/tools/json-formatter/json-formatter-client";

import RelatedTools from "@/app/components/RelatedTools";
import ToolFaq from "@/app/components/tools/faq/ToolFaq";
import { faqSchema } from "../pomodoro-timer/faqSchema";
import Navbar from "@/app/components/Navbar";
import UrlEncoderClient from "@/app/components/tools/url-encoder-client/url-encoder-client";
import  { URL_FAQS } from "@/lib/faqs";



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
    url: "https://www.forgecodehub.com/tools/json-formatter",
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
      <UrlEncoderClient />


      {/* Related tools — auto-pulls same category */}
      <div className="container" style={{ margin: "0 auto", maxWidth: "1600px", padding: "4rem 1rem" }}>
        <RelatedTools
          currentPath="/tools/url-encoder-decoder"
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
        faqs={URL_FAQS}
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about using the URL Encoder/Decoder."
      />
      </div>
    </>
  );
}


