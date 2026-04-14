import { Metadata } from "next";
import { Suspense } from "react";
import Navbar from "@/app/components/Navbar";
import RelatedTools from "@/app/components/RelatedTools";
import ToolFaq from "@/app/components/tools/faq/ToolFaq";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import QRBarcodeGenerator from "@/app/components/tools/online-qr-barcode-generator/qr-barcode-generator";
import QR_BARCODE_FAQS from "@/lib/faqs/qr-barcodeFaqs";
import qrFaqSchema from "./faqSchema";

export const metadata: Metadata = {
  title: "Free Online QR Code Generator | ForgeCodeHub",
  description:
    "Generate QR codes online for free. Create customizable QR codes for URLs, text, WiFi, vCard, and more. Download in PNG, SVG, or JPG format.",
  keywords: [
    "online qr generator",
    "free qr code maker",
    "qr code creator",
    "custom qr code",
    "qr code design",
    "qr code download",
    "wifi qr code",
    "vcard qr code",
    "url qr code",
  ],
  openGraph: {
    title: "Free Online QR Code Generator | ForgeCodeHub",
    description:
      "Generate QR codes online for free. Create customizable QR codes for URLs, text, WiFi, vCard, and more.",
    url: "https://www.forgecodehub.com/tools/online-qr-generator",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online QR Code Generator",
    description: "Generate QR codes online for free. Create, customize, and download in multiple formats.",
  },
};

export default function QRGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(qrFaqSchema) }}
      />

      <Navbar />

      <Suspense fallback={<LoadingSpinner text="Loading QR Code Generator..." />}>
        <QRBarcodeGenerator defaultMode="qr" />
      </Suspense>

      <div
        className="container"
        style={{ margin: "0 auto", maxWidth: "1600px", padding: "4rem 1rem" }}
      >
        <RelatedTools currentPath="/tools/online-qr-generator" category="productivity" />
      </div>

      <div
        style={{
          background: "#252537",
          padding: "0 24px 80px",
          display: "flex",
        }}
      >
        <ToolFaq
          faqs={QR_BARCODE_FAQS.filter(faq => faq.question.toLowerCase().includes('qr'))}
          title="QR Code Generator FAQ"
          subtitle="Everything you need to know about generating QR codes"
        />
      </div>
    </>
  );
}