import { notFound } from "next/navigation";
// import { statesData } from "@/app/data/states";
import { statesData } from "../../../data/states";
import type { Metadata } from "next";
import GSTStateCalculator from "./GSTStateCalculator";

export async function generateStaticParams() {
    return Object.keys(statesData).map((state) => ({ state }));
}

export async function generateMetadata(
    { params }: { params: Promise<{ state: string }> }
): Promise<Metadata> {
    const { state } = await params;
    const data = statesData[state];
    if (!data) return { title: "State Not Found" };
    return {
        title: `GST Calculator ${data.name} 2025 — CGST, SGST & IGST`,
        description: `Free GST calculator for ${data.name} (${data.code}). Calculate CGST, SGST and IGST instantly for all GST slabs — 5%, 12%, 18%, 28%. Add or remove GST in seconds.`,
        keywords: [
            `gst calculator ${data.name.toLowerCase()}`,
            `${data.code.toLowerCase()} gst calculator`,
            `${data.name.toLowerCase()} cgst sgst calculator`,
            `gst calculator india ${data.name.toLowerCase()}`,
        ],
        openGraph: {
            title: `GST Calculator ${data.name} — ForgeCodeHub`,
            description: `Free CGST/SGST/IGST calculator for ${data.name}. All slabs covered.`,
            url: `https://www.forgecodehub.com/calculators/gst/${state}`,
        },
    };
}

export default async function GSTStatePage({
    params,
}: {
    params: Promise<{ state: string }>;
}) {
    const { state } = await params;
    const data = statesData[state];
    if (!data) notFound();
    return <GSTStateCalculator state={state} data={data} />;
}