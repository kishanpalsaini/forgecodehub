import { Metadata } from "next";
import RelatedTools from "@/app/components/RelatedTools";
import { faqSchema } from "./faqSchema";
import Navbar from "@/app/components/Navbar";
import ToolsFaq from "@/app/components/tools/images/ImageToolFaq";
import UniversalImageConverter from "@/app/components/tools/images/universalPage";


export const metadata: Metadata = {
  title: "Universal Image Converter — ForgeCodeHub",
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
    "jpg to png converter",
    "jpg to jpeg converter",
    "online jpg to png",
    "convert jpg to png online",
    "jpg to png converter free",
    "jpg to png converter with quality settings",
    "batch jpg to png converter",
    "jpg to png converter no upload",
    "webp to png converter",
    "webp to jpg converter",
    "online webp converter",
    "convert webp online",
    "webp converter free",
    "webp converter with quality settings",
    "batch webp converter",
    "webp converter no upload",
  ],
  openGraph: {
    title: "Universal Image Converter — ForgeCodeHub",
    description:
      "Free online Universal Image Converter. Convert your images between various formats instantly. Supports batch conversion and quality adjustment.",
    url: "https://www.forgecodehub.com/tools/images/Universal-image-converter",
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
      <UniversalImageConverter />


      {/* Related tools — auto-pulls same category */}
      <div className="container" style={{ margin: "0 auto", maxWidth: "1600px", padding: "4rem 1rem" }}>
        <RelatedTools
          currentPath="/tools/images/Universal-image-converter"
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
        <ToolsFaq

      />
      </div>
    </>
  );
}


