import { Metadata } from "next";
import Link from "next/link";
import { banksData } from "@/app/data/banks";

export const metadata: Metadata = {
    title: "EMI Calculator for All Banks in India 2025 — ForgeCodeHub",
    description: "Compare EMI calculators for SBI, HDFC, ICICI, Axis, Kotak and more. Get exact monthly instalments for home, car and personal loans from every major Indian bank.",
    keywords: ["bank emi calculator", "sbi emi calculator", "hdfc emi calculator", "icici emi calculator", "home loan emi india"],
    openGraph: {
        title: "EMI Calculator for All Banks — ForgeCodeHub",
        description: "Compare home, car and personal loan EMIs across all major Indian banks.",
        url: "https://www.forgecodehub.com/calculators/banks",
    },
};

export default function BanksDirectory() {
    return (
        <div style={s.page}>
            {/* Breadcrumb */}
            <div style={s.breadcrumb}>
                <Link href="/" style={s.crumbLink}>ForgeCodeHub</Link>
                <span style={s.crumbSep}>/</span>
                <Link href="/finance-calculators" style={s.crumbLink}>Calculators</Link>
                <span style={s.crumbSep}>/</span>
                <span style={s.crumbCurrent}>Banks</span>
            </div>

            <div style={s.container}>
                <div style={s.header}>
                    <div style={s.badge}>Bank EMI Calculators</div>
                    <h1 style={s.h1}>EMI Calculator for All Banks in India</h1>
                    <p style={s.desc}>
                        Compare home loan, car loan and personal loan EMIs across all major Indian banks.
                        Get accurate monthly instalments instantly — no sign-up required.
                    </p>
                </div>

                {/* Stats */}
                <div style={s.statsRow}>
                    {[
                        ["10+", "Banks covered"],
                        ["3", "Loan types"],
                        ["Free", "Always"],
                    ].map(([num, label]) => (
                        <div key={label} style={s.statCard}>
                            <span style={s.statNum}>{num}</span>
                            <span style={s.statLabel}>{label}</span>
                        </div>
                    ))}
                </div>

                {/* Bank grid */}
                <div style={s.grid}>
                    {Object.entries(banksData).map(([slug, bank]) => (
                        <Link key={slug} href={`/calculators/emi/${slug}`} style={s.card}>
                            <div style={s.cardHeader}>
                                <div style={s.bankInitial}>
                                    {bank.name.charAt(0)}
                                </div>
                                <div style={s.cardRates}>
                                    <span style={s.rateTag}>🏠 {bank.homeRate}%</span>
                                    <span style={s.rateTag}>🚗 {bank.carRate}%</span>
                                </div>
                            </div>
                            <div style={s.bankName}>{bank.name}</div>
                            <div style={s.bankDesc}>{bank.desc}</div>
                            <div style={s.cardFooter}>
                                <span style={s.calcLink}>Calculate EMI →</span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* SEO content */}
                <div style={s.seoSection}>
                    <h2 style={s.seoH2}>Which bank offers the lowest home loan EMI in India?</h2>
                    <p style={s.seoP}>
                        Among major banks, Union Bank of India offers one of the lowest home loan rates at {banksData.union.homeRate}%,
                        followed by Canara Bank at {banksData.canara.homeRate}% and Bank of Baroda at {banksData.bob.homeRate}%.
                        However, your actual rate depends on your CIBIL score, income, and loan amount.
                    </p>
                    <h2 style={s.seoH2}>Home loan EMI comparison — all banks (₹50 lakh, 20 years)</h2>
                    <div style={s.tableWrap}>
                        <table style={s.table}>
                            <thead>
                                <tr>
                                    {["Bank", "Rate", "Monthly EMI", "Total Interest"].map((h) => (
                                        <th key={h} style={s.th}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(banksData)
                                    .sort((a, b) => parseFloat(a[1].homeRate) - parseFloat(b[1].homeRate))
                                    .map(([slug, bank]) => {
                                        const r = parseFloat(bank.homeRate) / 12 / 100;
                                        const n = 240;
                                        const p = 5000000;
                                        const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
                                        const interest = emi * n - p;
                                        return (
                                            <tr key={slug} style={s.tr}>
                                                <td style={s.td}>
                                                    <Link href={`/calculators/emi/${slug}`} style={{ color: "#e8692a", textDecoration: "none" }}>
                                                        {bank.name.split("(")[0].trim()}
                                                    </Link>
                                                </td>
                                                <td style={s.td}>{bank.homeRate}%</td>
                                                <td style={{ ...s.td, fontWeight: 600 }}>
                                                    ₹{Math.round(emi).toLocaleString("en-IN")}
                                                </td>
                                                <td style={{ ...s.td, color: "#e8692a" }}>
                                                    ₹{Math.round(interest / 100000).toFixed(1)}L
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    page: { background: "#0a0a0b", minHeight: "100vh", color: "#f0ede8" },
    breadcrumb: { display: "flex", alignItems: "center", gap: 8, padding: "1rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.06)", flexWrap: "wrap" },
    crumbLink: { color: "#7a7875", textDecoration: "none", fontSize: 13 },
    crumbSep: { color: "rgba(255,255,255,0.2)", fontSize: 12 },
    crumbCurrent: { color: "#f0ede8", fontSize: 13 },
    container: { maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" },
    header: { marginBottom: "2rem" },
    badge: { display: "inline-block", background: "rgba(232,105,42,0.1)", border: "1px solid rgba(232,105,42,0.25)", color: "#f5a623", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 100, marginBottom: 12 },
    h1: { fontFamily: "Georgia, serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 12, lineHeight: 1.2 },
    desc: { color: "#7a7875", fontSize: 15, maxWidth: 600, lineHeight: 1.6 },
    statsRow: { display: "flex", gap: 12, marginBottom: "2.5rem", flexWrap: "wrap" },
    statCard: { background: "#111113", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: 4 },
    statNum: { fontFamily: "Georgia, serif", fontSize: "1.75rem", fontWeight: 700, color: "#e8692a" },
    statLabel: { fontSize: 12, color: "#7a7875", letterSpacing: "0.06em", textTransform: "uppercase" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem", marginBottom: "3rem" },
    card: { background: "#111113", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "1.25rem", textDecoration: "none", color: "#f0ede8", display: "block", transition: "all 0.2s" },
    cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" },
    bankInitial: { width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #e8692a, #f5a623)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16, color: "#0a0a0b" },
    cardRates: { display: "flex", gap: 6 },
    rateTag: { fontSize: 11, color: "#7a7875", background: "#0a0a0b", border: "1px solid rgba(255,255,255,0.06)", padding: "2px 8px", borderRadius: 4 },
    bankName: { fontSize: 14, fontWeight: 600, marginBottom: 6 },
    bankDesc: { fontSize: 12, color: "#7a7875", lineHeight: 1.5, marginBottom: "1rem" },
    cardFooter: { borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "0.75rem" },
    calcLink: { fontSize: 12, color: "#e8692a", fontWeight: 500 },
    seoSection: { borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "2.5rem" },
    seoH2: { fontFamily: "Georgia, serif", fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.75rem", marginTop: "1.5rem", letterSpacing: "-0.02em" },
    seoP: { color: "#7a7875", fontSize: 14, lineHeight: 1.7, marginBottom: "1rem" },
    tableWrap: { overflowX: "auto", marginTop: "1rem" },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { background: "#111113", padding: "10px 16px", textAlign: "left" as const, fontSize: 13, color: "#7a7875", borderBottom: "1px solid rgba(255,255,255,0.07)" },
    tr: { borderBottom: "1px solid rgba(255,255,255,0.05)" },
    td: { padding: "10px 16px", fontSize: 13, color: "#f0ede8" },
};