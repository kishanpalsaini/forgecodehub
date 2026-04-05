"use client";

import { useState } from "react";
import Link from "next/link";

const AMOUNTS = [500, 1000, 2000, 3000, 5000, 7500, 10000, 15000, 20000, 25000, 30000, 50000];
const RATES = [8, 10, 12, 15, 18];

function calcSIP(monthly: number, ratePercent: number, years: number) {
    const r = ratePercent / 12 / 100;
    const n = years * 12;
    return monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
}

const fmt = (n: number) => {
    if (n >= 10000000) return "₹" + (n / 10000000).toFixed(2) + " Cr";
    if (n >= 100000) return "₹" + (n / 100000).toFixed(2) + " L";
    return "₹" + Math.round(n).toLocaleString("en-IN");
};

const fmtLabel = (amt: number) => amt >= 1000 ? `₹${amt / 1000}K` : `₹${amt}`;

export default function SIPAmountCalculator({ amount }: { amount: number }) {
    const [monthly, setMonthly] = useState(amount);
    const [rate, setRate] = useState(12);
    const [years, setYears] = useState(15);

    const invested = monthly * years * 12;
    const returns = calcSIP(monthly, rate, years);
    const wealth = returns - invested;

    return (
        <div style={s.page}>
            <div style={s.breadcrumb}>
                <Link href="/" style={s.crumbLink}>ForgeCodeHub</Link>
                <span style={s.sep}>/</span>
                <Link href="/calculators" style={s.crumbLink}>Calculators</Link>
                <span style={s.sep}>/</span>
                <Link href="/calculators/sip" style={s.crumbLink}>SIP</Link>
                <span style={s.sep}>/</span>
                <span style={{ color: "#f0ede8", fontSize: 13 }}>{fmtLabel(amount)}/month</span>
            </div>

            <div style={s.container}>
                <div style={s.header}>
                    <div style={s.badge}>SIP Calculator</div>
                    <h1 style={s.h1}>{fmtLabel(amount)}/month SIP Calculator</h1>
                    <p style={s.desc}>
                        See how a monthly SIP of {fmtLabel(amount)} grows over time with the power of compounding.
                        Adjust the rate and tenure to see different scenarios.
                    </p>
                </div>

                <div style={s.grid}>
                    <div style={s.card}>
                        <h2 style={s.h2}>Your SIP projection</h2>

                        {/* Monthly amount */}
                        <div style={s.field}>
                            <div style={s.row}><span style={s.label}>Monthly SIP</span><span style={s.val}>{fmtLabel(monthly)}</span></div>
                            <input type="range" min={500} max={50000} step={500} value={monthly}
                                onChange={(e) => setMonthly(+e.target.value)} style={{ width: "100%", accentColor: "#e8692a" }} />
                            <div style={s.hints}><span>₹500</span><span>₹50K</span></div>
                        </div>

                        {/* Rate */}
                        <div style={s.field}>
                            <div style={s.row}><span style={s.label}>Expected Return</span><span style={s.val}>{rate}% p.a.</span></div>
                            <input type="range" min={6} max={24} step={0.5} value={rate}
                                onChange={(e) => setRate(+e.target.value)} style={{ width: "100%", accentColor: "#e8692a" }} />
                            <div style={s.hints}><span>6%</span><span>24%</span></div>
                        </div>

                        {/* Tenure */}
                        <div style={s.field}>
                            <div style={s.row}><span style={s.label}>Investment Period</span><span style={s.val}>{years} years</span></div>
                            <input type="range" min={1} max={40} step={1} value={years}
                                onChange={(e) => setYears(+e.target.value)} style={{ width: "100%", accentColor: "#e8692a" }} />
                            <div style={s.hints}><span>1 yr</span><span>40 yrs</span></div>
                        </div>

                        {/* Result */}
                        <div style={s.result}>
                            <div style={s.resultTop}>
                                <span style={{ fontSize: 14, color: "#7a7875" }}>Corpus at {years} years</span>
                                <span style={{ fontSize: "2rem", fontWeight: 700, color: "#4ade80", fontFamily: "Georgia, serif" }}>{fmt(returns)}</span>
                            </div>
                            <div style={s.resultGrid}>
                                {[
                                    ["Invested", fmt(invested), "#f0ede8"],
                                    ["Wealth gained", fmt(wealth), "#e8692a"],
                                    ["Returns", `${((wealth / invested) * 100).toFixed(0)}%`, "#f5a623"],
                                ].map(([label, val, color]) => (
                                    <div key={label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                        <span style={{ fontSize: 11, color: "#7a7875" }}>{label}</span>
                                        <span style={{ fontSize: 14, fontWeight: 700, color }}>{val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {/* Rate comparison */}
                        <div style={s.card}>
                            <h3 style={s.h3}>Returns at different rates</h3>
                            {RATES.map((r) => (
                                <div key={r} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 13 }}>
                                    <span style={{ color: "#7a7875" }}>{r}% CAGR</span>
                                    <span style={{ fontWeight: 600, color: r === rate ? "#e8692a" : "#f0ede8" }}>
                                        {fmt(calcSIP(monthly, r, years))}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Other amounts */}
                        <div style={s.card}>
                            <h3 style={s.h3}>Try other amounts</h3>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                {AMOUNTS.filter((a) => a !== amount).map((a) => (
                                    <Link key={a} href={`/calculators/sip/${a}`}
                                        style={{ padding: "5px 10px", background: "#0a0a0b", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 6, textDecoration: "none", color: "#7a7875", fontSize: 12 }}>
                                        {fmtLabel(a)}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* SEO table */}
                <div style={s.seo}>
                    <h2 style={s.seoH2}>{fmtLabel(amount)}/month SIP returns over time</h2>
                    <p style={s.seoP}>
                        A monthly SIP of {fmtLabel(amount)} invested over {years} years at {rate}% annual returns
                        grows to <strong style={{ color: "#f0ede8" }}>{fmt(returns)}</strong> — with{" "}
                        {fmtLabel(invested)} invested and {fmt(wealth)} earned as returns.
                    </p>
                    <div style={{ overflowX: "auto", marginTop: "1rem" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>{["Years", "Invested", "@ 10%", "@ 12%", "@ 15%"].map((h) => (
                                    <th key={h} style={{ background: "#111113", padding: "10px 16px", textAlign: "left", fontSize: 13, color: "#7a7875", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>{h}</th>
                                ))}</tr>
                            </thead>
                            <tbody>
                                {[5, 10, 15, 20, 25, 30].map((yr) => (
                                    <tr key={yr}>
                                        <td style={s.td}>{yr} yrs</td>
                                        <td style={s.td}>{fmt(amount * yr * 12)}</td>
                                        {[10, 12, 15].map((r) => (
                                            <td key={r} style={{ ...s.td, color: r === 12 ? "#e8692a" : "#f0ede8" }}>
                                                {fmt(calcSIP(amount, r, yr))}
                                            </td>
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
    container: { maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" },
    header: { marginBottom: "2.5rem" },
    badge: { display: "inline-block", background: "rgba(232,105,42,0.1)", border: "1px solid rgba(232,105,42,0.25)", color: "#f5a623", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 100, marginBottom: 12 },
    h1: { fontFamily: "Georgia, serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 12, lineHeight: 1.2 },
    desc: { color: "#7a7875", fontSize: 15, maxWidth: 600, lineHeight: 1.6 },
    grid: { display: "grid", gridTemplateColumns: "1fr 280px", gap: "1.5rem", marginBottom: "3rem" },
    card: { background: "#111113", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "1.5rem" },
    h2: { fontFamily: "Georgia, serif", fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.5rem", letterSpacing: "-0.02em" },
    h3: { fontSize: "0.9rem", fontWeight: 600, marginBottom: "1rem" },
    field: { marginBottom: "1.5rem" },
    row: { display: "flex", justifyContent: "space-between", marginBottom: 8 },
    label: { fontSize: 13, color: "#7a7875" },
    val: { fontSize: 13, fontWeight: 600 },
    hints: { display: "flex", justifyContent: "space-between", fontSize: 11, color: "#555", marginTop: 4 },
    result: { background: "#0a0a0b", borderRadius: 10, padding: "1.25rem", border: "1px solid rgba(74,222,128,0.2)", marginTop: "1.5rem" },
    resultTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.06)" },
    resultGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 },
    seo: { borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "2.5rem" },
    seoH2: { fontFamily: "Georgia, serif", fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.75rem", marginTop: "1.5rem", letterSpacing: "-0.02em" },
    seoP: { color: "#7a7875", fontSize: 14, lineHeight: 1.7 },
    td: { padding: "10px 16px", fontSize: 13, borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#f0ede8" },
};