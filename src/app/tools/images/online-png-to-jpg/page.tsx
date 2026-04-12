import { Metadata } from "next";
import RelatedTools from "@/app/components/RelatedTools";
import  { pngToJpgFaqs } from "@/lib/faqs";
import ToolFaq from "@/app/components/tools/faq/ToolFaq";
import { faqSchema } from "./faqSchema";
import Navbar from "@/app/components/Navbar";
import PngToJpgClient from "@/app/components/tools/images/png-to-jpg/PngToJpgClient";


export const metadata: Metadata = {
  title: "PNG to JPG Converter — ForgeCodeHub",
  description:
    "Free online PNG to JPG converter. Convert your PNG images to JPG format instantly. Supports batch conversion and quality adjustment.",
  keywords: [
    "png to jpg converter",
    "png to jpeg converter",
    "online png to jpg",
    "convert png to jpg online",
    "png to jpg converter free",
    "png to jpg converter with quality settings",
    "batch png to jpg converter",
    "png to jpg converter no upload",
  ],
  openGraph: {
    title: "PNG to JPG Converter — ForgeCodeHub",
    description:
      "Free online PNG to JPG converter. Convert your PNG images to JPG format instantly. Supports batch conversion and quality adjustment.",
    url: "https://www.forgecodehub.com/tools/images/online-png-to-jpg",
  },
};

export default function PngToJpgPage() {
  return (
    // <main>
    //   <PngToJpgClient />
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
      <PngToJpgClient />


      {/* Related tools — auto-pulls same category */}
      <div className="container" style={{ margin: "0 auto", maxWidth: "1600px", padding: "4rem 1rem" }}>
        <RelatedTools
          currentPath="/tools/images/online-png-to-jpg"
          category="media"
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
        faqs={pngToJpgFaqs}
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about using the PNG to JPG Converter."
      />
      </div>
    </>
  );
}


