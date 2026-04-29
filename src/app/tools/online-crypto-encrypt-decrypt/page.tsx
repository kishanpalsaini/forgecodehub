import { Metadata } from "next";
import RelatedTools from "@/app/components/RelatedTools";
import  { cryptoEncryptDecryptFaqs } from "@/lib/faqs";
import ToolFaq from "@/app/components/tools/faq/ToolFaq";
import { faqSchema } from "./faqSchema";
import Navbar from "@/app/components/Navbar";
import CryptoEncryptDecryptClient from "@/app/components/tools/crypto-encrypt-decrypt/crypto-encrypt-decrypt-client";



export const metadata: Metadata = {
  title: "AES Encryption — ForgeCodeHub",
  description:
    "Free online AES encryption and decryption tool. Securely encrypt and decrypt your data in the browser.",
  keywords: [
    "AES encryption",
    "AES decryption",
    "online AES tool",  
    "encrypt text online",
    "decrypt text online",
   
  ],
  alternates: {
    canonical: "https://www.forgecodehub.com/tools/online-crypto-encrypt-decrypt",
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
    title: "AES Encryption — ForgeCodeHub",
    description:
      "Free online AES encryption and decryption tool. Securely encrypt and decrypt your data in the browser.",
    url: "https://www.forgecodehub.com/tools/online-crypto-encrypt-decrypt",
  },
};

export default function CryptoEncryptDecryptPage() {
  return (
    // <main>
    //   <CryptoEncryptDecryptClient />
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
      <CryptoEncryptDecryptClient />


      {/* Related tools — auto-pulls same category */}
      <div className="container" style={{ margin: "0 auto", maxWidth: "1600px", padding: "4rem 1rem" }}>
        <RelatedTools
          currentPath="/tools/online-crypto-encrypt-decrypt"
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
        faqs={cryptoEncryptDecryptFaqs}
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about using the Crypto Encrypt/Decrypt tool."
      />
      </div>
    </>
  );
}


