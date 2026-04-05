import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SIPAmountCalculator from "./SIPAmountCalculator";

const VALID_AMOUNTS = [500, 1000, 2000, 3000, 5000, 7500, 10000, 15000, 20000, 25000, 30000, 50000];

export async function generateStaticParams() {
    return VALID_AMOUNTS.map((amount) => ({ amount: amount.toString() }));
}

export async function generateMetadata(
    { params }: { params: Promise<{ amount: string }> }
): Promise<Metadata> {
    const { amount } = await params;
    const amt = parseInt(amount);
    if (!VALID_AMOUNTS.includes(amt)) return { title: "Not Found" };
    const formatted = amt >= 1000 ? `₹${amt / 1000}K` : `₹${amt}`;
    return {
        title: `${formatted} SIP Calculator — Returns in 10, 20, 30 Years`,
        description: `What will ${formatted} monthly SIP grow to in 10, 20 or 30 years? Calculate returns at 10%, 12%, 15% CAGR. Free SIP calculator with inflation-adjusted projections.`,
        keywords: [
            `${formatted} sip calculator`,
            `sip calculator ${amt} per month`,
            `${amt} monthly sip returns`,
            `sip investment ${amt} rupees`,
        ],
        openGraph: {
            title: `${formatted}/month SIP Calculator — ForgeCodeHub`,
            description: `See how ${formatted}/month SIP grows over 10, 20 and 30 years.`,
            url: `https://www.forgecodehub.com/calculators/sip/${amount}`,
        },
    };
}

export default async function SIPAmountPage({
    params,
}: {
    params: Promise<{ amount: string }>;
}) {
    const { amount } = await params;
    const amt = parseInt(amount);
    if (!VALID_AMOUNTS.includes(amt)) notFound();
    return <SIPAmountCalculator amount={amt} />;
}