import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Free US Financial Calculators 2025 — Mortgage, Tax & More",
    description: "Free financial calculators for the United States. Mortgage calculator, federal income tax calculator, compound interest calculator and more. Accurate 2025 data.",
    keywords: ["us financial calculator", "american mortgage calculator", "us tax calculator 2025", "compound interest calculator usa", "free financial tools usa"],
    openGraph: {
        title: "US Financial Calculators — ForgeCodeHub",
        description: "Free mortgage, tax and compound interest calculators for the United States.",
        url: "https://www.forgecodehub.com/calculators/us",
    },
};

const tools = [
    {
        href: "/calculators/us/mortgage",
        icon: "🏠",
        name: "Mortgage Calculator",
        desc: "Calculate monthly payments for 30-year fixed, 15-year fixed and ARM loans. Includes PMI, taxes and insurance.",
        tags: ["30yr Fixed", "ARM", "PMI"],
        searches: "2.2M/mo",
    },
    {
        href: "/calculators/us/tax",
        icon: "🧾",
        name: "Federal Income Tax Calculator",
        desc: "2025 federal tax brackets. Calculate your effective rate, marginal rate and after-tax income for all filing statuses.",
        tags: ["2025 Brackets", "W-2", "All States"],
        searches: "1.8M/mo",
    },
    {
        href: "/calculators/us/compound",
        icon: "📈",
        name: "Compound Interest Calculator",
        desc: "See how your savings grow with daily, monthly or annual compounding. Works for savings accounts, CDs and investments.",
        tags: ["Daily/Monthly", "CD rates", "S&P 500"],
        searches: "550K/mo",
    },
];

export default function USHub() {
    return (
        <div style={s.page}>
            <div style={s.breadcrumb}>
                <Link href="/" style={s.crumbLink}>ForgeCodeHub</Link>
                <span style={s.sep}>/</span>
                <Link href="/calculators" style={s.crumbLink}>Calculators</Link>
                <span style={s.sep}>/</span>
                <span style={s.crumbCurrent}>🇺🇸 United States</span>
            </div>

            <div style={s.container}>
                <div style={s.header}>
                    <div style={s.badge}>🇺🇸 US Financial Tools</div>
                    <h1 style={s.h1}>Free Financial Calculators<br />for the United States</h1>
                    <p style={s.desc}>
                        Accurate, up-to-date financial calculators built for American users.
                        2025 tax brackets, current mortgage rates and more — no sign-up required.
                    </p>
                </div>

                <div style={s.statsRow}>
                    {[["2025", "Tax year"], ["$", "USD currency"], ["Free", "Always"]].map(([num, label]) => (
                        <div key={label} style={s.statCard}>
                            <span style={s.statNum}>{num}</span>
                            <span style={s.statLabel}>{label}</span>
                        </div>
                    ))}
                </div>

                <div style={s.grid}>
                    {tools.map((tool) => (
                        <Link key={tool.href} href={tool.href} style={s.card}>
                            <div style={s.cardTop}>
                                <div style={s.icon}>{tool.icon}</div>
                                <span style={s.searches}>{tool.searches} searches</span>
                            </div>
                            <div style={s.toolName}>{tool.name}</div>
                            <div style={s.toolDesc}>{tool.desc}</div>
                            <div style={s.tagRow}>
                                {tool.tags.map((tag) => (
                                    <span key={tag} style={s.tag}>{tag}</span>
                                ))}
                            </div>
                            <div style={s.cardFooter}>
                                <span style={s.calcLink}>Open Calculator →</span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div style={s.comingSoon}>
                    <div style={s.csLabel}>Coming soon for US</div>
                    <div style={s.csList}>
                        {["401(k) Calculator", "Roth IRA Calculator", "Auto Loan Calculator",
                            "Student Loan Calculator", "Social Security Estimator", "Home Affordability"].map((tool) => (
                                <div key={tool} style={s.csItem}>
                                    <span style={{ color: "#e8692a" }}>→</span> {tool}
                                </div>
                            ))}
                    </div>
                </div>

                <div style={s.seo}>
                    <h2 style={s.seoH2}>Why use ForgeCodeHub for US financial calculators?</h2>
                    <p style={s.seoP}>
                        Our US calculators are updated with 2025 federal tax brackets, current 30-year
                        fixed mortgage rates, and accurate compounding formulas. No ads, no sign-up,
                        no data collection — just fast, accurate results.
                    </p>
                </div>
            </div>
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    page: { background: "#0a0a0b", minHeight: "100vh", color: "#f0ede8" },
    breadcrumb: { display: "flex", alignItems: "center", gap: 8, padding: "1rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.06)", flexWrap: "wrap" },
    crumbLink: { color: "#7a7875", textDecoration: "none", fontSize: 13 },
    sep: { color: "rgba(255,255,255,0.2)", fontSize: 12 },
    crumbCurrent: { color: "#f0ede8", fontSize: 13 },
    container: { maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" },
    header: { marginBottom: "2rem" },
    badge: { display: "inline-block", background: "rgba(232,105,42,0.1)", border: "1px solid rgba(232,105,42,0.25)", color: "#f5a623", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 100, marginBottom: 12 },
    h1: { fontFamily: "Georgia, serif", fontSize: "clamp(1.75rem, 4vw, 2.75rem)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 12, lineHeight: 1.15 },
    desc: { color: "#7a7875", fontSize: 15, maxWidth: 560, lineHeight: 1.6 },
    statsRow: { display: "flex", gap: 12, marginBottom: "2.5rem", flexWrap: "wrap" },
    statCard: { background: "#111113", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: 4 },
    statNum: { fontFamily: "Georgia, serif", fontSize: "1.75rem", fontWeight: 700, color: "#e8692a" },
    statLabel: { fontSize: 12, color: "#7a7875", letterSpacing: "0.06em", textTransform: "uppercase" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem", marginBottom: "2.5rem" },
    card: { background: "#111113", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "1.5rem", textDecoration: "none", color: "#f0ede8", display: "block" },
    cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" },
    icon: { fontSize: 28 },
    searches: { fontSize: 11, color: "#4ade80", background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.2)", padding: "2px 8px", borderRadius: 4 },
    toolName: { fontSize: 16, fontWeight: 700, marginBottom: 8, fontFamily: "Georgia, serif" },
    toolDesc: { fontSize: 13, color: "#7a7875", lineHeight: 1.55, marginBottom: "1rem" },
    tagRow: { display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "1rem" },
    tag: { fontSize: 11, padding: "3px 8px", background: "rgba(232,105,42,0.08)", border: "1px solid rgba(232,105,42,0.15)", borderRadius: 4, color: "#f5a623" },
    cardFooter: { borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "0.75rem" },
    calcLink: { fontSize: 13, color: "#e8692a", fontWeight: 500 },
    comingSoon: { background: "#111113", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "1.5rem", marginBottom: "2.5rem" },
    csLabel: { fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#7a7875", marginBottom: 12 },
    csList: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 8 },
    csItem: { fontSize: 13, color: "#7a7875", display: "flex", gap: 8 },
    seo: { borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "2rem" },
    seoH2: { fontFamily: "Georgia, serif", fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.75rem" },
    seoP: { color: "#7a7875", fontSize: 14, lineHeight: 1.7 },
};