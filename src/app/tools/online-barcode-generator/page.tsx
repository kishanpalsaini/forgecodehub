import { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/app/components/Navbar";
import RelatedTools from "@/app/components/RelatedTools";
import ToolFaq from "@/app/components/tools/faq/ToolFaq";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import QRBarcodeGenerator from "@/app/components/tools/online-qr-barcode-generator/qr-barcode-generator";
import QR_BARCODE_FAQS from "@/lib/faqs/qr-barcodeFaqs";
import barcodeFaqSchema from "./faqSchema";

export const metadata: Metadata = {
  title: "Free Online Barcode Generator | ForgeCodeHub",
  description:
    "Generate barcodes online for free. Create EAN13, UPC, CODE128, and more. Customize and download in multiple formats instantly.",
  keywords: [
    "barcode generator",
    "free barcode maker",
    "EAN13 generator",
    "UPC generator",
    "CODE128 generator",
    "barcode creator",
    "barcode design",
    "barcode download",
  ],
  alternates: {
    canonical: "https://www.forgecodehub.com/tools/online-barcode-generator",
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
    title: "Free Online Barcode Generator | ForgeCodeHub",
    description:
      "Generate barcodes online for free. Create EAN13, UPC, CODE128, and more. Customize and download instantly.",
    url: "https://www.forgecodehub.com/tools/online-barcode-generator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Barcode Generator",
    description: "Generate barcodes online for free. Create, customize, and download in multiple formats.",
  },
};

export default function BarcodeGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(barcodeFaqSchema) }}
      />

      <Navbar />

      <Suspense fallback={<LoadingSpinner text="Loading Barcode Generator..." />}>
        <QRBarcodeGenerator defaultMode="barcode" />
      </Suspense>

      <div
        className="container"
        style={{ margin: "0 auto", maxWidth: "1600px", padding: "4rem 1rem" }}
      >
        <RelatedTools currentPath="/tools/online-barcode-generator" category="productivity" />
      </div>

      <div
        style={{
          background: "#252537",
          padding: "0 24px 80px",
          display: "flex",
        }}
      >
        <ToolFaq
          faqs={QR_BARCODE_FAQS.filter(faq => faq.question.toLowerCase().includes('barcode'))}
          title="Barcode Generator FAQ"
          subtitle="Everything you need to know about generating barcodes"
        />
      </div>
    </>
  );
}