import { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/app/components/Navbar";
import JSONToolsHub from "@/app/components/tools/json-tools/JSONToolsHub";
import RelatedTools from "@/app/components/RelatedTools";
import { JSON_FAQS } from "@/lib/faqs";
import ToolFaq from "@/app/components/tools/faq/ToolFaq";
import { faqSchema } from "../online-json-formatterhub/JsonfaqhubSchema";

export const metadata: Metadata = {
  title: "JSON Validator — ForgeCodeHub",
  description:
    "Validate JSON syntax and check against JSON Schema online. Free JSON validation tool.",
  keywords: [
    "json validator",
    "validate json",
    "json schema validator",
    "json validation tool",
    "online json validator",
    "json syntax checker",
    "json schema checker",
  ],
  alternates: {
    canonical: "https://www.forgecodehub.com/tools/online-json-validator",
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
    title: "JSON Validator — ForgeCodeHub",
    description:
      "Validate JSON syntax and check against JSON Schema online. Free JSON validation tool.",
    url: "https://www.forgecodehub.com/tools/online-json-validator",
  },
};

export default function JsonValidatorPage() {
  return (
    <>
      {/* JSON-LD FAQ schema for Google rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* Top-bar */}
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <JSONToolsHub />
      </Suspense>
      <div
        className="container"
        style={{ margin: "0 auto", maxWidth: "1600px", padding: "4rem 1rem" }}
      >
        <RelatedTools currentPath="/tools/online-json-validator" category="dev" />
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
          faqs={JSON_FAQS}
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about using the JSON Validator Tool."
        />
      </div>
    </>
  );
}
