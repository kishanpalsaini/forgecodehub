import { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/app/components/Navbar";
import JSONToolsHub from "@/app/components/tools/json-tools/JSONToolsHub";
import RelatedTools from "@/app/components/RelatedTools";
import { JSON_FAQS } from "@/lib/faqs";
import ToolFaq from "@/app/components/tools/faq/ToolFaq";
import { faqSchema } from "../json-formatterhub/JsonfaqhubSchema";



export const metadata: Metadata = {
  title: "JSON Diff & Compare — ForgeCodeHub",
  description:
    "Compare two JSON objects and see differences highlighted. Free online JSON comparison tool.",
  keywords: [
    "json diff",
    "json compare",
    "compare json",
    "json diff tool",
    "json comparison tool",
    "online json diff",
    "json diff online",
    "json compare online",
    "json comparison online", 
    "json diff viewer",
    "json diff highlighter",
    "json diff checker",
    "json diff analyzer",
    "json diff visualizer",
  ],
  openGraph: {
    title: "JSON Diff & Compare — ForgeCodeHub",
    description:
      "Compare two JSON objects and see differences highlighted. Free online JSON comparison tool.",
    url: "https://www.forgecodehub.com/tools/json-diff",
  },
};


export default function JsonDiffPage() {
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
              <RelatedTools currentPath="/tools/json-diff" category="dev" />
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
                    subtitle="Everything you need to know about using the JSON Diff & Compare Tool."
                  />
                  </div>
    </>
  );
}