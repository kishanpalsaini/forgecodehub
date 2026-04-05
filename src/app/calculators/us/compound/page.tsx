import { Metadata } from "next";
import CompoundCalculator from "./CompoundCalculator";

export const metadata: Metadata = {
    title: "Compound Interest Calculator 2025 — Daily, Monthly & Annual",
    description: "Free compound interest calculator. See how savings grow with daily, monthly or annual compounding. Works for savings accounts, CDs, S&P 500 index funds and any investment.",
    keywords: ["compound interest calculator", "compound interest calculator usa", "savings calculator", "cd calculator", "investment growth calculator", "compound interest daily monthly"],
    openGraph: {
        title: "Compound Interest Calculator — ForgeCodeHub",
        description: "Calculate compound interest growth with daily, monthly or annual compounding.",
        url: "https://www.forgecodehub.com/calculators/us/compound",
    },
};

export default function CompoundPage() {
    return <CompoundCalculator />;
}