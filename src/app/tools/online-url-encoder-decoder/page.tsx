import { Metadata } from "next";
// import JsonFormatterClient from "@/components/tools/Json-Formatter/JsonFormatterClient";
import JsonFormatterClient from "@/app/components/tools/json-formatter/json-formatter-client";

import RelatedTools from "@/app/components/RelatedTools";
import ToolFaq from "@/app/components/tools/faq/ToolFaq";
import { faqSchema } from "../online-pomodoro-timer/faqSchema";
import Navbar from "@/app/components/Navbar";
import UrlEncoderClient from "@/app/components/tools/url-encoder-client/url-encoder-client";
import  { URL_FAQS } from "@/lib/faqs";



export const metadata: Metadata = {
  title: "URL Encoder/Decoder — ForgeCodeHub",
  description:
    "Free online URL encoder and decoder. Encode and decode URLs instantly. Perfect for web developers and content creators.",
  keywords: [
    "url encoder",
    "url decoder",
    "encode url",
    "decode url",
    "online url encoder",
    "online url decoder",
  ],
  alternates: {
    canonical: "https://www.forgecodehub.com/tools/online-url-encoder-decoder",
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
    title: "URL Encoder/Decoder — ForgeCodeHub",
    description:
      "Free online URL encoder and decoder. Encode and decode URLs instantly. Perfect for web developers and content creators.",
    url: "https://www.forgecodehub.com/tools/online-url-encoder-decoder",
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
          currentPath="/tools/online-url-encoder-decoder"
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


