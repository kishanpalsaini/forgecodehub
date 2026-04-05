"use client";

import { useState } from "react";
import Link from "next/link";

const FREQ = { daily: 365, monthly: 12, quarterly: 4, annually: 1 };
type FreqKey = keyof typeof FREQ;

function calcCompound(principal: number, rate: number, years: number, freq: FreqKey, monthly: number) {
    const n = FREQ[freq];
    const r = rate / 100;
    // Compound on principal
    const principalGrowth = principal * Math.pow(1 + r / n, n * years);
    // Future value of monthly contributions
    const monthlyGrowth = monthly > 0
        ? monthly * ((Math.pow(1 + r / n, n * years) - 1) / (r / n)) * (1 + r / n)
        : 0;
    return principalGrowth + monthlyGrowth;
}

const fmt = (n: number) => {
    if (n >= 1000000) return "$" + (n / 1000000).toFixed(2) + "M";
    if (n >= 1000) return "$" + Math.round(n).toLocaleString("en-US");
    return "$" + n.toFixed(2);
};

const PRESETS = [
    { label: "HYSA", rate: 4.5, desc: "High-yield savings" },
    { label: "CD", rate: 5.1, desc: "12-month CD" },
    { label: "S&P 500", rate: 10.7, desc: "Historical avg" },
    { label: "Bonds", rate: 4.0, desc: "10yr Treasury" },
];

export default function CompoundCalculator() {
    const [principal, setPrincipal] = useState(10000);
    const [rate, setRate] = useState(10.7);
    const [years, setYears] = useState(20);
    const [freq, setFreq] = useState<FreqKey>("monthly");
    const [monthly, setMonthly] = useState(500);

    const total = calcCompound(principal, rate, years, freq, monthly);
    const totalContributions = principal + monthly * 12 * years;
    const interest = total - totalContributions;

    return (
        <div style={s.page}>
            <div style={s.breadcrumb}>
                <Link href="/" style={s.cl}>ForgeCodeHub</Link>
                <span style={s.sep}>/</span>
                <Link href="/calculators/us" style={s.cl}>🇺🇸 US</Link>
                <span style={s.sep}>/</span>
                <span style={{ color: "#f0ede8", fontSize: 13 }}>Compound Interest</span>
            </div>

            <div style={s.container}>
                <div style={s.header}>
                    <div style={s.badge}>Compound Interest Calculator</div>
                    <h1 style={s.h1}>Compound Interest Calculator</h1>
                    <p style={s.desc}>See how your money grows over time with the power of compounding. Works for savings accounts, CDs, index funds and any investment.</p>

                    {/* Rate presets */}
                    <div style={s.presets}>
                        {PRESETS.map((p) => (
                            <button key={p.label} style={{ ...s.preset, ...(rate === p.rate ? s.presetActive : {}) }}
                                onClick={() => setRate(p.rate)}>
                                <span style={{ fontWeight: 700 }}>{p.label}</span>
                                <span style={{ fontSize: 11, color: rate === p.rate ? "#f5a623" : "#555" }}>{p.rate}% — {p.desc}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div style={s.grid}>
                    <div style={s.card}>
                        <h2 style={s.h2}>Investment details</h2>

                        {[
                            { label: "Initial Investment", val: fmt(principal), min: 0, max: 1000000, step: 1000, value: principal, set: setPrincipal, hints: ["$0", "$1M"] },
                            { label: `Monthly Contribution — ${fmt(monthly)}/mo`, val: fmt(monthly * 12) + "/yr", min: 0, max: 10000, step: 100, value: monthly, set: setMonthly, hints: ["$0", "$10K/mo"] },
                            { label: "Annual Interest Rate", val: `${rate}%`, min: 0.5, max: 30, step: 0.1, value: rate, set: setRate, hints: ["0.5%", "30%"] },
                            { label: "Time Period", val: `${years} years`, min: 1, max: 50, step: 1, value: years, set: setYears, hints: ["1 yr", "50 yrs"] },
                        ].map(({ label, val, min, max, step, value, set, hints }) => (
                            <div key={label} style={{ marginBottom: "1.25rem" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                    <span style={{ fontSize: 13, color: "#7a7875" }}>{label}</span>
                                    <span style={{ fontSize: 13, fontWeight: 600 }}>{val}</span>
                                </div>
                                <input type="range" min={min} max={max} step={step} value={value}
                                    onChange={(e) => set(+e.target.value)} style={{ width: "100%", accentColor: "#e8692a" }} />
                                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#555", marginTop: 4 }}>
                                    <span>{hints[0]}</span><span>{hints[1]}</span>
                                </div>
                            </div>
                        ))}

                        {/* Compounding frequency */}
                        <div>
                            <label style={{ fontSize: 13, color: "#7a7875", display: "block", marginBottom: 10 }}>Compounding Frequency</label>
                            <div style={{ display: "flex", gap: 8 }}>
                                {(Object.keys(FREQ) as FreqKey[]).map((f) => (
                                    <button key={f} style={{ ...s.freqBtn, ...(freq === f ? s.freqActive : {}) }}
                                        onClick={() => setFreq(f)}>
                                        {f.charAt(0).toUpperCase() + f.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <div style={s.resultCard}>
                            <div style={{ fontSize: 12, color: "#7a7875", marginBottom: 6 }}>Total after {years} years</div>
                            <div style={{ fontSize: "2.25rem", fontWeight: 700, color: "#4ade80", fontFamily: "Georgia, serif" }}>{fmt(total)}</div>
                            <div style={{ marginTop: "1.25rem", display: "flex", flexDirection: "column", gap: 8 }}>
                                {[
                                    ["Initial Investment", fmt(principal), "#f0ede8"],
                                    ["Total Contributions", fmt(monthly * 12 * years), "#7a7875"],
                                    ["Total Invested", fmt(totalContributions), "#f0ede8"],
                                    ["Interest Earned", fmt(interest), "#e8692a"],
                                    ["Growth", `${((interest / totalContributions) * 100).toFixed(0)}%`, "#4ade80"],
                                ].map(([label, val, color]) => (
                                    <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color, borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: 6 }}>
                                        <span style={{ color: "#7a7875" }}>{label}</span>
                                        <span style={{ fontWeight: 600, color }}>{val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Milestone table */}
                        <div style={s.card}>
                            <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: "#7a7875", textTransform: "uppercase", letterSpacing: "0.06em" }}>Growth milestones</h3>
                            {[5, 10, 15, 20, 25, 30].filter(y => y <= years + 5).map((yr) => (
                                <div key={yr} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 13 }}>
                                    <span style={{ color: "#7a7875" }}>Year {yr}</span>
                                    <span style={{ fontWeight: 600, color: yr === years ? "#4ade80" : "#f0ede8" }}>
                                        {fmt(calcCompound(principal, rate, yr, freq, monthly))}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SEO table */}
                <div style={s.seo}>
                    <h2 style={s.seoH2}>$10,000 compound interest growth — all rates, 20 years</h2>
                    <div style={{ overflowX: "auto", marginTop: "1rem" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>{["Rate", "5 Years", "10 Years", "20 Years", "30 Years"].map((h) => (
                                    <th key={h} style={s.th}>{h}</th>
                                ))}</tr>
                            </thead>
                            <tbody>
                                {[2, 4, 5, 7, 10, 12, 15].map((r) => (
                                    <tr key={r}>
                                        <td style={{ ...s.td, color: "#e8692a", fontWeight: 700 }}>{r}%</td>
                                        {[5, 10, 20, 30].map((yr) => (
                                            <td key={yr} style={s.td}>{fmt(calcCompound(10000, r, yr, "monthly", 0))}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <h2 style={s.seoH2}>Does compounding frequency matter?</h2>
                    <p style={s.seoP}>
                        Yes — daily compounding earns slightly more than monthly, which earns more than annual.
                        On $10,000 at {rate}% for {years} years: daily compounding yields{" "}
                        {fmt(calcCompound(10000, rate, years, "daily", 0))} vs{" "}
                        {fmt(calcCompound(10000, rate, years, "annually", 0))} with annual compounding —
                        a difference of {fmt(calcCompound(10000, rate, years, "daily", 0) - calcCompound(10000, rate, years, "annually", 0))}.
                    </p>
                </div>
            </div>
        </div>
    );
}

const s: Record<string, React.CSSProperties> = {
    page: { background: "#0a0a0b", minHeight: "100vh", color: "#f0ede8" },
    breadcrumb: { display: "flex", alignItems: "center", gap: 8, padding: "1rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.06)", flexWrap: "wrap" },
    cl: { color: "#7a7875", textDecoration: "none", fontSize: 13 },
    sep: { color: "rgba(255,255,255,0.2)", fontSize: 12 },
    container: { maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" },
    header: { marginBottom: "2rem" },
    badge: { display: "inline-block", background: "rgba(232,105,42,0.1)", border: "1px solid rgba(232,105,42,0.25)", color: "#f5a623", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 100, marginBottom: 12 },
    h1: { fontFamily: "Georgia, serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 12, lineHeight: 1.2 },
    desc: { color: "#7a7875", fontSize: 15, maxWidth: 600, lineHeight: 1.6, marginBottom: "1.5rem" },
    presets: { display: "flex", gap: 8, flexWrap: "wrap" },
    preset: { display: "flex", flexDirection: "column", padding: "8px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "#111113", color: "#f0ede8", fontSize: 13, cursor: "pointer", gap: 2, textAlign: "left" as const },
    presetActive: { background: "rgba(232,105,42,0.1)", border: "1px solid rgba(232,105,42,0.4)" },
    grid: { display: "grid", gridTemplateColumns: "1fr 300px", gap: "1.5rem", marginBottom: "3rem" },
    card: { background: "#111113", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "1.5rem" },
    h2: { fontFamily: "Georgia, serif", fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.5rem", letterSpacing: "-0.02em" },
    freqBtn: { flex: 1, padding: "7px", borderRadius: 7, border: "1px solid rgba(255,255,255,0.08)", background: "#0a0a0b", color: "#7a7875", fontSize: 12, cursor: "pointer" },
    freqActive: { background: "rgba(232,105,42,0.1)", border: "1px solid rgba(232,105,42,0.4)", color: "#f0ede8" },
    resultCard: { background: "#111113", border: "1px solid rgba(74,222,128,0.25)", borderRadius: 12, padding: "1.5rem" },
    seo: { borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "2.5rem" },
    seoH2: { fontFamily: "Georgia, serif", fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.75rem", marginTop: "1.5rem" },
    seoP: { color: "#7a7875", fontSize: 14, lineHeight: 1.7 },
    th: { background: "#111113", padding: "10px 16px", textAlign: "left" as const, fontSize: 13, color: "#7a7875", borderBottom: "1px solid rgba(255,255,255,0.07)" },
    td: { padding: "10px 16px", fontSize: 13, borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#f0ede8" },
};