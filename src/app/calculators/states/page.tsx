import { Metadata } from "next";
import Link from "next/link";
import { statesData } from "@/app/data/states";

export const metadata: Metadata = {
    title: "GST Calculator for All States in India 2025 — ForgeCodeHub",
    description: "State-wise GST calculator for all Indian states. Calculate CGST, SGST and IGST instantly for Maharashtra, Delhi, Karnataka, Gujarat and every state in India.",
    keywords: ["gst calculator state wise", "state gst calculator india", "cgst sgst calculator", "gst calculator maharashtra", "gst calculator delhi"],
    openGraph: {
        title: "GST Calculator — All Indian States",
        description: "Free state-wise GST calculator for all 28 states and 8 UTs of India.",
        url: "https://www.forgecodehub.com/calculators/states",
    },
};

const GST_SLABS = [5, 12, 18, 28];

export default function StatesDirectory() {
    return (
        <div style={s.page}>
            {/* Breadcrumb */}
            <div style={s.breadcrumb}>
                <Link href="/" style={s.crumbLink}>ForgeCodeHub</Link>
                <span style={s.sep}>/</span>
                <Link href="/calculators" style={s.crumbLink}>Calculators</Link>
                <span style={s.sep}>/</span>
                <Link href="/calculators/gst" style={s.crumbLink}>GST</Link>
                <span style={s.sep}>/</span>
                <span style={s.crumbCurrent}>All States</span>
            </div>

            <div style={s.container}>
                {/* Header */}
                <div style={s.header}>
                    <div style={s.badge}>State-wise GST Calculator</div>
                    <h1 style={s.h1}>GST Calculator for All Indian States</h1>
                    <p style={s.desc}>
                        Calculate CGST, SGST and IGST for any state in India. Select your state to get
                        a pre-filled GST calculator with state-specific information and tax breakdowns.
                    </p>
                </div>

                {/* Stats */}
                <div style={s.statsRow}>
                    {[["12+", "States covered"], ["4", "GST slabs"], ["Free", "Always"]].map(([num, label]) => (
                        <div key={label} style={s.statCard}>
                            <span style={s.statNum}>{num}</span>
                            <span style={s.statLabel}>{label}</span>
                        </div>
                    ))}
                </div>

                {/* GST Slabs reference */}
                <div style={s.slabRow}>
                    {GST_SLABS.map((slab) => (
                        <div key={slab} style={s.slabCard}>
                            <span style={s.slabNum}>{slab}%</span>
                            <span style={s.slabSplit}>CGST {slab / 2}% + SGST {slab / 2}%</span>
                        </div>
                    ))}
                </div>

                {/* States grid */}
                <div style={s.grid}>
                    {Object.entries(statesData).map(([slug, state]) => (
                        <Link key={slug} href={`/calculators/gst/${slug}`} style={s.card}>
                            <div style={s.cardHeader}>
                                <div style={s.stateCode}>{state.code}</div>
                                <div style={s.industryTags}>
                                    {state.majorIndustries.slice(0, 2).map((ind) => (
                                        <span key={ind} style={s.indTag}>{ind}</span>
                                    ))}
                                </div>
                            </div>
                            <div style={s.stateName}>{state.name}</div>
                            <div style={s.stateCapital}>Capital: {state.capital}</div>
                            <div style={s.stateDesc}>{state.desc}</div>
                            <div style={s.cardFooter}>
                                <span style={s.calcLink}>Calculate GST →</span>
                                <span style={s.gdp}>{state.gdp}</span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* SEO content */}
                <div style={s.seo}>
                    <h2 style={s.seoH2}>How does GST work in India?</h2>
                    <p style={s.seoP}>
                        GST (Goods and Services Tax) in India is a dual tax system. For intra-state
                        transactions, it is split into CGST (Central GST) and SGST (State GST) — each at half
                        the total slab rate. For inter-state transactions, the full rate is charged as IGST
                        (Integrated GST). All states in India follow the same GST slabs: 0%, 5%, 12%, 18% and 28%.
                    </p>

                    <h2 style={s.seoH2}>GST breakdown for ₹1 lakh across all slabs</h2>
                    <div style={{ overflowX: "auto", marginTop: "1rem" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    {["Slab", "Base Amount", "CGST", "SGST", "Total (Intra-state)", "IGST (Inter-state)"].map((h) => (
                                        <th key={h} style={s.th}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {GST_SLABS.map((slab) => {
                                    const base = 100000;
                                    const cgst = (base * slab) / 200;
                                    const total = base + (base * slab) / 100;
                                    return (
                                        <tr key={slab}>
                                            <td style={{ ...s.td, color: "#e8692a", fontWeight: 700 }}>{slab}%</td>
                                            <td style={s.td}>₹1,00,000</td>
                                            <td style={s.td}>₹{cgst.toLocaleString("en-IN")}</td>
                                            <td style={s.td}>₹{cgst.toLocaleString("en-IN")}</td>
                                            <td style={{ ...s.td, fontWeight: 600 }}>₹{total.toLocaleString("en-IN")}</td>
                                            <td style={{ ...s.td, color: "#818cf8" }}>₹{(base * slab / 100).toLocaleString("en-IN")}</td>
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
    sep: { color: "rgba(255,255,255,0.2)", fontSize: 12 },
    crumbCurrent: { color: "#f0ede8", fontSize: 13 },
    container: { maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" },
    header: { marginBottom: "2rem" },
    badge: { display: "inline-block", background: "rgba(232,105,42,0.1)", border: "1px solid rgba(232,105,42,0.25)", color: "#f5a623", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 100, marginBottom: 12 },
    h1: { fontFamily: "Georgia, serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 12, lineHeight: 1.2 },
    desc: { color: "#7a7875", fontSize: 15, maxWidth: 600, lineHeight: 1.6 },
    statsRow: { display: "flex", gap: 12, marginBottom: "1.5rem", flexWrap: "wrap" },
    statCard: { background: "#111113", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: 4 },
    statNum: { fontFamily: "Georgia, serif", fontSize: "1.75rem", fontWeight: 700, color: "#e8692a" },
    statLabel: { fontSize: 12, color: "#7a7875", letterSpacing: "0.06em", textTransform: "uppercase" },
    slabRow: { display: "flex", gap: 10, marginBottom: "2.5rem", flexWrap: "wrap" },
    slabCard: { flex: 1, minWidth: 140, background: "#111113", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "1rem", display: "flex", flexDirection: "column", gap: 4 },
    slabNum: { fontFamily: "Georgia, serif", fontSize: "1.5rem", fontWeight: 700, color: "#e8692a" },
    slabSplit: { fontSize: 11, color: "#7a7875" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1rem", marginBottom: "3rem" },
    card: { background: "#111113", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "1.25rem", textDecoration: "none", color: "#f0ede8", display: "block", transition: "all 0.2s" },
    cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" },
    stateCode: { width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg, #e8692a, #f5a623)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, color: "#0a0a0b" },
    industryTags: { display: "flex", gap: 4 },
    indTag: { fontSize: 10, padding: "2px 6px", background: "rgba(232,105,42,0.08)", border: "1px solid rgba(232,105,42,0.15)", borderRadius: 4, color: "#f5a623" },
    stateName: { fontSize: 15, fontWeight: 600, marginBottom: 3 },
    stateCapital: { fontSize: 11, color: "#7a7875", marginBottom: 8 },
    stateDesc: { fontSize: 12, color: "#7a7875", lineHeight: 1.5, marginBottom: "1rem" },
    cardFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "0.75rem" },
    calcLink: { fontSize: 12, color: "#e8692a", fontWeight: 500 },
    gdp: { fontSize: 11, color: "#7a7875" },
    seo: { borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "2.5rem" },
    seoH2: { fontFamily: "Georgia, serif", fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.75rem", marginTop: "1.5rem", letterSpacing: "-0.02em" },
    seoP: { color: "#7a7875", fontSize: 14, lineHeight: 1.7 },
    th: { background: "#111113", padding: "10px 16px", textAlign: "left" as const, fontSize: 13, color: "#7a7875", borderBottom: "1px solid rgba(255,255,255,0.07)" },
    td: { padding: "10px 16px", fontSize: 13, borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#f0ede8" },
};