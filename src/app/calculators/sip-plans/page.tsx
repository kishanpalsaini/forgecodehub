import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "SIP Calculator — All Monthly Amounts 2025 — ForgeCodeHub",
    description: "SIP return calculator for every monthly investment amount — ₹500, ₹1000, ₹5000, ₹10000 and more. See how your SIP grows over 10, 20 and 30 years at different return rates.",
    keywords: ["sip calculator monthly", "500 sip calculator", "1000 sip returns", "5000 monthly sip", "sip investment calculator india"],
    openGraph: {
        title: "SIP Calculator — All Monthly Amounts — ForgeCodeHub",
        description: "See SIP returns for any monthly amount over 10, 20 and 30 years.",
        url: "https://www.forgecodehub.com/calculators/sip-plans",
    },
};

const AMOUNTS = [500, 1000, 2000, 3000, 5000, 7500, 10000, 15000, 20000, 25000, 30000, 50000];
const RATES = [10, 12, 15];

function calcSIP(monthly: number, ratePercent: number, years: number) {
    const r = ratePercent / 12 / 100;
    const n = years * 12;
    return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
}

const fmt = (n: number) => {
    if (n >= 10000000) return "₹" + (n / 10000000).toFixed(1) + " Cr";
    if (n >= 100000) return "₹" + (n / 100000).toFixed(1) + " L";
    return "₹" + Math.round(n).toLocaleString("en-IN");
};

const fmtAmt = (amt: number) => amt >= 1000 ? `₹${amt / 1000}K` : `₹${amt}`;

export default function SIPPlansDirectory() {
    return (
        <div style={s.page}>
            {/* Breadcrumb */}
            <div style={s.breadcrumb}>
                <Link href="/" style={s.crumbLink}>ForgeCodeHub</Link>
                <span style={s.sep}>/</span>
                <Link href="/calculators" style={s.crumbLink}>Calculators</Link>
                <span style={s.sep}>/</span>
                <Link href="/calculators/sip" style={s.crumbLink}>SIP</Link>
                <span style={s.sep}>/</span>
                <span style={s.crumbCurrent}>All Plans</span>
            </div>

            <div style={s.container}>
                {/* Header */}
                <div style={s.header}>
                    <div style={s.badge}>SIP Return Calculator</div>
                    <h1 style={s.h1}>SIP Calculator for All Monthly Amounts</h1>
                    <p style={s.desc}>
                        Pick your monthly SIP amount and see exactly how much wealth you can build
                        over 10, 20 and 30 years with the power of compounding.
                    </p>
                </div>

                {/* Stats */}
                <div style={s.statsRow}>
                    {[["12", "SIP amounts"], ["3", "Return scenarios"], ["40 yrs", "Max projection"]].map(([num, label]) => (
                        <div key={label} style={s.statCard}>
                            <span style={s.statNum}>{num}</span>
                            <span style={s.statLabel}>{label}</span>
                        </div>
                    ))}
                </div>

                {/* SIP cards grid */}
                <div style={s.grid}>
                    {AMOUNTS.map((amt) => {
                        const returns20yr = calcSIP(amt, 12, 20);
                        const invested20yr = amt * 20 * 12;
                        const gain = returns20yr - invested20yr;
                        return (
                            <Link key={amt} href={`/calculators/sip/${amt}`} style={s.card}>
                                <div style={s.cardHeader}>
                                    <div style={s.amtBadge}>{fmtAmt(amt)}<span style={{ fontSize: 11, fontWeight: 400 }}>/mo</span></div>
                                    <span style={s.tag}>@ 12% CAGR</span>
                                </div>
                                <div style={s.projRow}>
                                    <div style={s.proj}>
                                        <span style={s.projLabel}>10 years</span>
                                        <span style={s.projVal}>{fmt(calcSIP(amt, 12, 10))}</span>
                                    </div>
                                    <div style={s.proj}>
                                        <span style={s.projLabel}>20 years</span>
                                        <span style={{ ...s.projVal, color: "#e8692a" }}>{fmt(returns20yr)}</span>
                                    </div>
                                    <div style={s.proj}>
                                        <span style={s.projLabel}>30 years</span>
                                        <span style={{ ...s.projVal, color: "#4ade80" }}>{fmt(calcSIP(amt, 12, 30))}</span>
                                    </div>
                                </div>
                                <div style={s.cardFooter}>
                                    <span style={{ fontSize: 11, color: "#7a7875" }}>
                                        Invested: {fmt(invested20yr)} · Gain: {fmt(gain)}
                                    </span>
                                    <span style={s.calcLink}>Calculate →</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Big comparison table */}
                <div style={s.seo}>
                    <h2 style={s.seoH2}>SIP returns comparison — all amounts at 12% CAGR</h2>
                    <div style={{ overflowX: "auto", marginTop: "1rem" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    {["Monthly SIP", "Invested (20yr)", "10 Years", "20 Years", "30 Years"].map((h) => (
                                        <th key={h} style={s.th}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {AMOUNTS.map((amt) => (
                                    <tr key={amt} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                        <td style={s.td}>
                                            <Link href={`/calculators/sip/${amt}`} style={{ color: "#e8692a", textDecoration: "none", fontWeight: 600 }}>
                                                {fmtAmt(amt)}/month
                                            </Link>
                                        </td>
                                        <td style={s.td}>{fmt(amt * 240)}</td>
                                        <td style={s.td}>{fmt(calcSIP(amt, 12, 10))}</td>
                                        <td style={{ ...s.td, fontWeight: 600 }}>{fmt(calcSIP(amt, 12, 20))}</td>
                                        <td style={{ ...s.td, color: "#4ade80", fontWeight: 600 }}>{fmt(calcSIP(amt, 12, 30))}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <h2 style={s.seoH2}>What is SIP and how does it work?</h2>
                    <p style={s.seoP}>
                        SIP (Systematic Investment Plan) is a method of investing a fixed amount regularly
                        in mutual funds. The power of SIP comes from rupee cost averaging and compounding —
                        you buy more units when markets are low and fewer when high, averaging your cost over time.
                        Even a small SIP of ₹500/month can grow to {fmt(calcSIP(500, 12, 30))} in 30 years at 12% CAGR.
                    </p>

                    <h2 style={s.seoH2}>SIP returns at different rates — ₹5,000/month over 20 years</h2>
                    <div style={{ overflowX: "auto", marginTop: "1rem" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>
                                    {["Return Rate", "10 Years", "15 Years", "20 Years", "25 Years"].map((h) => (
                                        <th key={h} style={s.th}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {[8, 10, 12, 15, 18].map((rate) => (
                                    <tr key={rate} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                        <td style={{ ...s.td, color: "#e8692a", fontWeight: 700 }}>{rate}% p.a.</td>
                                        {[10, 15, 20, 25].map((yr) => (
                                            <td key={yr} style={s.td}>{fmt(calcSIP(5000, rate, yr))}</td>
                                        ))}
                                    </tr>
                                ))}
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
    statsRow: { display: "flex", gap: 12, marginBottom: "2rem", flexWrap: "wrap" },
    statCard: { background: "#111113", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: "1rem 1.5rem", display: "flex", flexDirection: "column", gap: 4 },
    statNum: { fontFamily: "Georgia, serif", fontSize: "1.75rem", fontWeight: 700, color: "#e8692a" },
    statLabel: { fontSize: 12, color: "#7a7875", letterSpacing: "0.06em", textTransform: "uppercase" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem", marginBottom: "3rem" },
    card: { background: "#111113", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "1.25rem", textDecoration: "none", color: "#f0ede8", display: "block" },
    cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" },
    amtBadge: { fontFamily: "Georgia, serif", fontSize: "1.4rem", fontWeight: 700, color: "#f0ede8", display: "flex", alignItems: "baseline", gap: 4 },
    tag: { fontSize: 11, padding: "3px 8px", background: "rgba(232,105,42,0.08)", border: "1px solid rgba(232,105,42,0.2)", borderRadius: 4, color: "#f5a623" },
    projRow: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: "1rem" },
    proj: { display: "flex", flexDirection: "column", gap: 4 },
    projLabel: { fontSize: 10, color: "#7a7875", letterSpacing: "0.06em", textTransform: "uppercase" },
    projVal: { fontSize: 14, fontWeight: 700, color: "#f0ede8" },
    cardFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "0.75rem" },
    calcLink: { fontSize: 12, color: "#e8692a", fontWeight: 500 },
    seo: { borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "2.5rem" },
    seoH2: { fontFamily: "Georgia, serif", fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.75rem", marginTop: "1.5rem", letterSpacing: "-0.02em" },
    seoP: { color: "#7a7875", fontSize: 14, lineHeight: 1.7 },
    th: { background: "#111113", padding: "10px 16px", textAlign: "left" as const, fontSize: 13, color: "#7a7875", borderBottom: "1px solid rgba(255,255,255,0.07)" },
    td: { padding: "10px 16px", fontSize: 13, color: "#f0ede8" },
};