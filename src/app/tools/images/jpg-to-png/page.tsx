import { Metadata } from "next";
import RelatedTools from "@/app/components/RelatedTools";
import  {  CSS_FAQS } from "@/lib/faqs";
import ToolFaq from "@/app/components/tools/faq/ToolFaq";
import { faqSchema } from "../../pomodoro-timer/faqSchema";
import Navbar from "@/app/components/Navbar";
import JpgToPngClient from "@/app/components/tools/images/jpg-to-png/JpgToPngClient";


export const metadata: Metadata = {
  title: "JPG to PNG Converter — ForgeCodeHub",
  description:
    "Free online JPG to PNG converter. Convert your JPG images to PNG format instantly. Supports batch conversion and quality adjustment.",
  keywords: [
    "jpg to png converter",
    "jpg to jpeg converter",
    "online jpg to png",
    "convert jpg to png online",
    "jpg to png converter free",
    "jpg to png converter with quality settings",
    "batch jpg to png converter",
    "jpg to png converter no upload",
  ],
  openGraph: {
    title: "JPG to PNG Converter — ForgeCodeHub",
    description:
      "Free online JPG to PNG converter. Convert your JPG images to PNG format instantly. Supports batch conversion and quality adjustment.",
    url: "https://www.forgecodehub.com/tools/images/jpg-to-png",
  },
};

export default function JpgToPngPage() {
  return (
    // <main>
    //   <JpgToPngClient />
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
      <JpgToPngClient />


      {/* Related tools — auto-pulls same category */}
      <div className="container" style={{ margin: "0 auto", maxWidth: "1600px", padding: "4rem 1rem" }}>
        <RelatedTools
          currentPath="/tools/images/jpg-to-png"
          category="productivity"
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
        subtitle="Everything you need to know about using the JPG to PNG Converter."
      />
      </div>
    </>
  );
}


