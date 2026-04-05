import { Metadata } from "next";
import MortgageCalculator from "./MortgageCalculator";

export const metadata: Metadata = {
    title: "Mortgage Calculator 2025 — Monthly Payment, 30yr & 15yr Fixed",
    description: "Free US mortgage calculator. Calculate monthly payments for 30-year fixed, 15-year fixed and ARM loans. Includes principal, interest, PMI, taxes and insurance breakdown.",
    keywords: ["mortgage calculator", "mortgage payment calculator", "30 year mortgage calculator", "15 year mortgage calculator", "monthly mortgage payment", "home loan calculator usa"],
    openGraph: {
        title: "US Mortgage Calculator 2025 — ForgeCodeHub",
        description: "Calculate monthly mortgage payments for 30yr, 15yr fixed and ARM loans. Free and instant.",
        url: "https://www.forgecodehub.com/calculators/us/mortgage",
    },
};

export default function MortgagePage() {
    return <MortgageCalculator />;
}