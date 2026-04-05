"use client";

import { useState } from "react";
import Link from "next/link";

const BRACKETS_2025 = {
    single: [
        { min: 0, max: 11925, rate: 10 },
        { min: 11925, max: 48475, rate: 12 },
        { min: 48475, max: 103350, rate: 22 },
        { min: 103350, max: 197300, rate: 24 },
        { min: 197300, max: 250525, rate: 32 },
        { min: 250525, max: 626350, rate: 35 },
        { min: 626350, max: Infinity, rate: 37 },
    ],
    mfj: [
        { min: 0, max: 23850, rate: 10 },
        { min: 23850, max: 96950, rate: 12 },
        { min: 96950, max: 206700, rate: 22 },
        { min: 206700, max: 394600, rate: 24 },
        { min: 394600, max: 501050, rate: 32 },
        { min: 501050, max: 751600, rate: 35 },
        { min: 751600, max: Infinity, rate: 37 },
    ],
    hoh: [
        { min: 0, max: 17000, rate: 10 },
        { min: 17000, max: 64850, rate: 12 },
        { min: 64850, max: 103350, rate: 22 },
        { min: 103350, max: 197300, rate: 24 },
        { min: 197300, max: 250500, rate: 32 },
        { min: 250500, max: 626350, rate: 35 },
        { min: 626350, max: Infinity, rate: 37 },
    ],
};

const STD_DEDUCTION = { single: 15000, mfj: 30000, hoh: 22500 };

type FilingStatus = "single" | "mfj" | "hoh";

function calcTax(income: number, status: FilingStatus) {
    const deduction = STD_DEDUCTION[status];
    const taxable = Math.max(0, income - deduction);
    const brackets = BRACKETS_2025[status];
    let tax = 0;
    let marginalRate = 10;
    for (const b of brackets) {
        if (taxable <= b.min) break;
        const taxed = Math.min(taxable, b.max) - b.min;
        tax += (taxed * b.rate) / 100;
        marginalRate = b.rate;
    }
    return { tax, marginalRate, taxable, deduction };
}

const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-US");

const STATUS_LABELS: Record<FilingStatus, string> = {
    single: "Single",
    mfj: "Married Filing Jointly",
    hoh: "Head of Household",
};

export default function USTaxCalculator() {
    const [income, setIncome] = useState(75000);
    const [status, setStatus] = useState<FilingStatus>("single");

    const { tax, marginalRate, taxable, deduction } = calcTax(income, status);
    const effectiveRate = income > 0 ? (tax / income) * 100 : 0;
    const afterTax = income - tax;
    const fica = Math.min(income, 176100) * 0.0765;
    const totalTax = tax + fica;

    return (
        <div style={s.page}>
            <div style={s.breadcrumb}>
                <Link href="/" style={s.cl}>ForgeCodeHub</Link>
                <span style={s.sep}>/</span>
                <Link href="/calculators/us" style={s.cl}>🇺🇸 US</Link>
                <span style={s.sep}>/</span>
                <span style={{ color: "#f0ede8", fontSize: 13 }}>Federal Tax Calculator</span>
            </div>

            <div style={s.container}>
                <div style={s.header}>
                    <div style={s.badge}>🇺🇸 2025 Tax Year</div>
                    <h1 style={s.h1}>Federal Income Tax Calculator 2025</h1>
                    <p style={s.desc}>Calculate your 2025 federal income tax based on the latest IRS brackets. Includes standard deduction and FICA estimates.</p>
                </div>

                <div style={s.grid}>
                    <div style={s.card}>
                        <h2 style={s.h2}>Your tax details</h2>

                        {/* Filing status */}
                        <div style={{ marginBottom: "1.5rem" }}>
                            <label style={{ fontSize: 13, color: "#7a7875", display: "block", marginBottom: 10 }}>Filing Status</label>
                            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                {(Object.keys(STATUS_LABELS) as FilingStatus[]).map((s_) => (
                                    <button key={s_} style={{ ...s.statusBtn, ...(status === s_ ? s.statusActive : {}) }}
                                        onClick={() => setStatus(s_)}>
                                        <span>{STATUS_LABELS[s_]}</span>
                                        <span style={{ fontSize: 11, opacity: 0.6 }}>Std deduction: {fmt(STD_DEDUCTION[s_])}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Income */}
                        <div style={{ marginBottom: "1.5rem" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                                <span style={{ fontSize: 13, color: "#7a7875" }}>Annual Gross Income (W-2)</span>
                                <span style={{ fontSize: 13, fontWeight: 600 }}>{fmt(income)}</span>
                            </div>
                            <input type="range" min={10000} max={1000000} step={1000} value={income}
                                onChange={(e) => setIncome(+e.target.value)} style={{ width: "100%", accentColor: "#e8692a" }} />
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#555", marginTop: 4 }}>
                                <span>$10K</span><span>$1M</span>
                            </div>
                        </div>

                        {/* Breakdown */}
                        <div style={s.breakdown}>
                            {[
                                ["Gross Income", fmt(income), "#f0ede8"],
                                [`Standard Deduction (${STATUS_LABELS[status]})`, `- ${fmt(deduction)}`, "#7a7875"],
                                ["Taxable Income", fmt(taxable), "#f0ede8"],
                                ["Federal Income Tax", fmt(tax), "#e8692a"],
                                [`FICA (SS + Medicare)`, fmt(fica), "#f5a623"],
                                ["Total Tax", fmt(totalTax), "#e8692a"],
                                ["After-Tax Income", fmt(income - totalTax), "#4ade80"],
                            ].map(([label, val, color]) => (
                                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 13 }}>
                                    <span style={{ color: "#7a7875" }}>{label}</span>
                                    <span style={{ fontWeight: 600, color }}>{val}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {/* Rate summary */}
                        <div style={s.resultCard}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                                {[
                                    ["Effective Rate", `${effectiveRate.toFixed(1)}%`, "#e8692a"],
                                    ["Marginal Rate", `${marginalRate}%`, "#f5a623"],
                                    ["After-Tax", fmt(afterTax), "#4ade80"],
                                    ["Monthly Take-Home", fmt((income - totalTax) / 12), "#f0ede8"],
                                ].map(([label, val, color]) => (
                                    <div key={label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                        <span style={{ fontSize: 11, color: "#7a7875" }}>{label}</span>
                                        <span style={{ fontSize: 20, fontWeight: 700, color, fontFamily: "Georgia, serif" }}>{val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bracket breakdown */}
                        <div style={s.card}>
                            <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: "#7a7875", textTransform: "uppercase", letterSpacing: "0.06em" }}>2025 Brackets ({STATUS_LABELS[status]})</h3>
                            {BRACKETS_2025[status].map((b, i) => {
                                const isActive = taxable > b.min && (i === BRACKETS_2025[status].length - 1 || taxable <= BRACKETS_2025[status][i + 1].min);
                                return (
                                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 8px", borderRadius: 6, marginBottom: 3, background: isActive ? "rgba(232,105,42,0.1)" : "transparent", fontSize: 12 }}>
                                        <span style={{ color: isActive ? "#e8692a" : "#7a7875", fontWeight: isActive ? 700 : 400 }}>{b.rate}%</span>
                                        <span style={{ color: "#555" }}>
                                            {fmt(b.min)} – {b.max === Infinity ? "∞" : fmt(b.max)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* SEO table */}
                <div style={s.seo}>
                    <h2 style={s.seoH2}>2025 Federal Tax — Single filer at common income levels</h2>
                    <div style={{ overflowX: "auto", marginTop: "1rem" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>{["Income", "Federal Tax", "Effective Rate", "Marginal Rate", "After-Tax"].map((h) => (
                                    <th key={h} style={s.th}>{h}</th>
                                ))}</tr>
                            </thead>
                            <tbody>
                                {[30000, 50000, 75000, 100000, 150000, 200000, 300000, 500000].map((inc) => {
                                    const { tax, marginalRate, effectiveRate: er } = (() => {
                                        const r = calcTax(inc, "single");
                                        return { ...r, effectiveRate: (r.tax / inc) * 100 };
                                    })();
                                    return (
                                        <tr key={inc}>
                                            <td style={{ ...s.td, fontWeight: 600 }}>{fmt(inc)}</td>
                                            <td style={{ ...s.td, color: "#e8692a" }}>{fmt(tax)}</td>
                                            <td style={s.td}>{er.toFixed(1)}%</td>
                                            <td style={{ ...s.td, color: "#f5a623" }}>{marginalRate}%</td>
                                            <td style={{ ...s.td, color: "#4ade80", fontWeight: 600 }}>{fmt(inc - tax)}</td>
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
    cl: { color: "#7a7875", textDecoration: "none", fontSize: 13 },
    sep: { color: "rgba(255,255,255,0.2)", fontSize: 12 },
    container: { maxWidth: 1100, margin: "0 auto", padding: "2rem 1.5rem" },
    header: { marginBottom: "2rem" },
    badge: { display: "inline-block", background: "rgba(232,105,42,0.1)", border: "1px solid rgba(232,105,42,0.25)", color: "#f5a623", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 100, marginBottom: 12 },
    h1: { fontFamily: "Georgia, serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: 12, lineHeight: 1.2 },
    desc: { color: "#7a7875", fontSize: 15, maxWidth: 600, lineHeight: 1.6 },
    grid: { display: "grid", gridTemplateColumns: "1fr 300px", gap: "1.5rem", marginBottom: "3rem" },
    card: { background: "#111113", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "1.5rem" },
    h2: { fontFamily: "Georgia, serif", fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.5rem", letterSpacing: "-0.02em" },
    statusBtn: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "#0a0a0b", color: "#7a7875", fontSize: 13, cursor: "pointer" },
    statusActive: { background: "rgba(232,105,42,0.1)", border: "1px solid rgba(232,105,42,0.4)", color: "#f0ede8" },
    breakdown: { marginTop: "1rem" },
    resultCard: { background: "#111113", border: "1px solid rgba(232,105,42,0.25)", borderRadius: 12, padding: "1.5rem" },
    seo: { borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "2.5rem" },
    seoH2: { fontFamily: "Georgia, serif", fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.75rem", marginTop: "1.5rem" },
    th: { background: "#111113", padding: "10px 16px", textAlign: "left" as const, fontSize: 13, color: "#7a7875", borderBottom: "1px solid rgba(255,255,255,0.07)" },
    td: { padding: "10px 16px", fontSize: 13, borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#f0ede8" },
};