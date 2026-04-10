import { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/app/components/Navbar";
import JSONToolsHub from "@/app/components/tools/json-tools/JSONToolsHub";
import RelatedTools from "@/app/components/RelatedTools";
import { JSON_FAQS } from "@/lib/faqs";
import ToolFaq from "@/app/components/tools/faq/ToolFaq";
import { faqSchema } from "../json-formatterhub/jsonhubfaqSchema";

export const metadata: Metadata = {
  title: "JSON to CSV Converter — ForgeCodeHub",
  description:
    "Convert JSON array to CSV format. Free online JSON to CSV converter for Excel and spreadsheets.",
  keywords: [
    "json to csv",
    "convert json to csv",
    "json csv converter",
    "json to csv online",
    "json to csv free",
    "json to csv tool",
    "json to csv converter online",
    "json to csv converter free",
    "json to csv converter tool",
  ],
  openGraph: {
    title: "JSON to CSV Converter — ForgeCodeHub",
    description:
      "Convert JSON array to CSV format. Free online JSON to CSV converter for Excel and spreadsheets.",
    url: "https://www.forgecodehub.com/tools/json-to-csv",
  },
};

export default function JsonToCsvPage() {
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
        <RelatedTools currentPath="/tools/json-to-csv" category="dev" />
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
