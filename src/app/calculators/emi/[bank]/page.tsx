import { notFound } from "next/navigation";
import { banksData } from "@/app/data/banks";
import type { Metadata } from "next";
import BankEMICalculator from "./BankEMICalculator";

export async function generateStaticParams() {
    return Object.keys(banksData).map((bank) => ({ bank }));
}

export async function generateMetadata(
    { params }: { params: Promise<{ bank: string }> }
): Promise<Metadata> {
    const { bank } = await params;
    const data = banksData[bank];
    if (!data) return { title: "Bank Not Found" };
    return {
        title: `${data.name} EMI Calculator 2025 — Home, Car & Personal Loan`,
        description: `Calculate your exact monthly EMI for ${data.name}. Home @ ${data.homeRate}%, Car @ ${data.carRate}%, Personal @ ${data.personalRate}%. Free & instant.`,
        keywords: [`${bank} emi calculator`, `${bank} home loan emi`, `${bank} car loan emi`],
        openGraph: {
            title: `${data.name} EMI Calculator — ForgeCodeHub`,
            description: `Free EMI calculator for ${data.name}. Home @ ${data.homeRate}%, Car @ ${data.carRate}%.`,
            url: `https://www.forgecodehub.com/calculators/emi/${bank}`,
        },
    };
}

export default async function BankEMIPage({
    params,
}: {
    params: Promise<{ bank: string }>;
}) {
    const { bank } = await params;
    const data = banksData[bank];
    if (!data) notFound();
    return <BankEMICalculator bank={bank} data={data} />;
}