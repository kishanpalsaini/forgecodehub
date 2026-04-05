import { Metadata } from "next";
import USTaxCalculator from "./USTaxCalculator";

export const metadata: Metadata = {
    title: "US Federal Income Tax Calculator 2025 — All Filing Statuses",
    description: "Calculate your 2025 US federal income tax. See your effective rate, marginal rate and after-tax income for Single, Married Filing Jointly, Head of Household and more.",
    keywords: ["us tax calculator 2025", "federal income tax calculator", "tax bracket calculator 2025", "income tax calculator usa", "after tax income calculator"],
    openGraph: {
        title: "US Federal Tax Calculator 2025 — ForgeCodeHub",
        description: "Free 2025 federal income tax calculator. All filing statuses, standard deductions included.",
        url: "https://www.forgecodehub.com/calculators/us/tax",
    },
};

export default function USTaxPage() {
    return <USTaxCalculator />;
}