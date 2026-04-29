import { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/app/components/Navbar";
import JSONToolsHub from "@/app/components/tools/json-tools/JSONToolsHub";
import RelatedTools from "@/app/components/RelatedTools";
import { JSON_FAQS } from "@/lib/faqs";
import ToolFaq from "@/app/components/tools/faq/ToolFaq";
import { faqSchema } from "../online-json-formatterhub/JsonfaqhubSchema";

export const metadata: Metadata = {
  title: "JSONPath Query Tool — ForgeCodeHub",
  description:
    "Query JSON data using JSONPath expressions. Extract and filter JSON data online.",
  keywords: [
    "jsonpath",
    "json query",
    "json path expressions",
    "json data extraction",
    "json filtering",
    "online jsonpath tool",
    "jsonpath tester",
    "jsonpath evaluator",
    "jsonpath online",
    "jsonpath query tool",
    "jsonpath expression tester",
    "jsonpath expression evaluator",
    "jsonpath syntax checker",
    "jsonpath online tester",
    "jsonpath online evaluator",
  ],
  alternates: {
    canonical: "https://www.forgecodehub.com/tools/online-json-path",
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
    title: "JSONPath Query Tool — ForgeCodeHub",
    description:
      "Query JSON data using JSONPath expressions. Extract and filter JSON data online.",
    url: "https://www.forgecodehub.com/tools/online-json-path",
  },
};

export default function JsonPathPage() {
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
        <RelatedTools currentPath="/tools/online-json-path" category="dev" />
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
              subtitle="Everything you need to know about using the JSONPath Query Tool."
            />
            </div>
    </>
  );
}
