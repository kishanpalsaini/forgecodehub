"use client";

import { useState } from "react";
import Link from "next/link";

function calcMonthly(principal: number, annualRate: number, years: number) {
    const r = annualRate / 12 / 100;
    const n = years * 12;
    if (r === 0) return principal / n;
    return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
const fmtDec = (n: number) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const LOAN_TYPES = [
    { label: "30yr Fixed", years: 30, rate: 6.875 },
    { label: "15yr Fixed", years: 15, rate: 6.25 },
    { label: "10yr Fixed", years: 10, rate: 6.125 },
    { label: "5/1 ARM", years: 30, rate: 6.5 },
];

export default function MortgageCalculator() {
    const [loanType, setLoanType] = useState(0);
    const [homePrice, setHomePrice] = useState(400000);
    const [downPct, setDownPct] = useState(20);
    const [rate, setRate] = useState(LOAN_TYPES[0].rate);
    const [years, setYears] = useState(LOAN_TYPES[0].years);
    const [propTax, setPropTax] = useState(265);
    const [insurance, setInsurance] = useState(100);

    const downAmt = (homePrice * downPct) / 100;
    const principal = homePrice - downAmt;
    const pmi = downPct < 20 ? Math.round((principal * 0.005) / 12) : 0;
    const monthlyPI = calcMonthly(principal, rate, years);
    const totalMonthly = monthlyPI + propTax + insurance + pmi;
    const totalPaid = monthlyPI * years * 12;
    const totalInterest = totalPaid - principal;

    function handleLoanType(idx: number) {
        setLoanType(idx);
        setRate(LOAN_TYPES[idx].rate);
        setYears(LOAN_TYPES[idx].years);
    }

    return (
        <div style={s.page}>
            <div style={s.breadcrumb}>
                <Link href="/" style={s.cl}>ForgeCodeHub</Link>
                <span style={s.sep}>/</span>
                <Link href="/calculators/us" style={s.cl}>🇺🇸 US</Link>
                <span style={s.sep}>/</span>
                <span style={{ color: "#f0ede8", fontSize: 13 }}>Mortgage Calculator</span>
            </div>

            <div style={s.container}>
                <div style={s.header}>
                    <div style={s.badge}>🇺🇸 US Mortgage Calculator</div>
                    <h1 style={s.h1}>Mortgage Calculator</h1>
                    <p style={s.desc}>Calculate your monthly mortgage payment including principal, interest, taxes and insurance (PITI). Updated with current 2025 rates.</p>
                    <div style={s.loanTypes}>
                        {LOAN_TYPES.map((lt, i) => (
                            <button key={lt.label} style={{ ...s.ltBtn, ...(loanType === i ? s.ltActive : {}) }}
                                onClick={() => handleLoanType(i)}>
                                {lt.label}
                                <span style={{ fontSize: 11, opacity: 0.7 }}>{lt.rate}%</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div style={s.grid}>
                    <div style={s.card}>
                        <h2 style={s.h2}>Loan details</h2>

                        {[
                            { label: "Home Price", val: fmt(homePrice), min: 50000, max: 2000000, step: 5000, value: homePrice, set: setHomePrice, hints: ["$50K", "$2M"] },
                            { label: `Down Payment (${downPct}%) — ${fmt(downAmt)}`, val: `${downPct}%`, min: 3, max: 50, step: 1, value: downPct, set: setDownPct, hints: ["3%", "50%"] },
                            { label: "Interest Rate", val: `${rate}%`, min: 3, max: 12, step: 0.125, value: rate, set: setRate, hints: ["3%", "12%"] },
                            { label: "Loan Term", val: `${years} years`, min: 10, max: 30, step: 5, value: years, set: setYears, hints: ["10 yrs", "30 yrs"] },
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

                        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1rem", marginTop: "0.5rem" }}>
                            <div style={{ fontSize: 12, color: "#7a7875", marginBottom: 10, letterSpacing: "0.06em", textTransform: "uppercase" }}>Monthly extras</div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                                {[
                                    { label: "Property Tax /mo", val: propTax, set: setPropTax },
                                    { label: "Home Insurance /mo", val: insurance, set: setInsurance },
                                ].map(({ label, val, set }) => (
                                    <div key={label}>
                                        <label style={{ fontSize: 12, color: "#7a7875", display: "block", marginBottom: 4 }}>{label}</label>
                                        <div style={{ display: "flex", alignItems: "center", background: "#0a0a0b", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 6, padding: "6px 10px" }}>
                                            <span style={{ color: "#7a7875", marginRight: 4 }}>$</span>
                                            <input type="number" value={val} onChange={(e) => set(+e.target.value)}
                                                style={{ background: "none", border: "none", color: "#f0ede8", fontSize: 14, width: "100%", outline: "none" }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {/* Main result */}
                        <div style={s.resultCard}>
                            <div style={{ fontSize: 12, color: "#7a7875", marginBottom: 6 }}>Total monthly payment</div>
                            <div style={{ fontSize: "2.5rem", fontWeight: 700, color: "#e8692a", fontFamily: "Georgia, serif" }}>
                                {fmt(totalMonthly)}
                            </div>
                            <div style={{ fontSize: 11, color: "#7a7875", marginTop: 4 }}>per month</div>
                            <div style={{ marginTop: "1.25rem", display: "flex", flexDirection: "column", gap: 8 }}>
                                {[
                                    ["Principal & Interest", fmt(monthlyPI), "#f0ede8"],
                                    ["Property Tax", fmt(propTax), "#7a7875"],
                                    ["Home Insurance", fmt(insurance), "#7a7875"],
                                    ...(pmi > 0 ? [["PMI (< 20% down)", fmt(pmi), "#f5a623"]] : []),
                                ].map(([label, val, color]) => (
                                    <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color }}>
                                        <span>{label}</span><span style={{ fontWeight: 600 }}>{val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Loan summary */}
                        <div style={s.card}>
                            <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: "#7a7875", textTransform: "uppercase", letterSpacing: "0.06em" }}>Loan Summary</h3>
                            {[
                                ["Loan Amount", fmt(principal)],
                                ["Total Payments", fmt(totalPaid)],
                                ["Total Interest", fmt(totalInterest)],
                                ["Interest %", `${((totalInterest / principal) * 100).toFixed(0)}%`],
                            ].map(([label, val]) => (
                                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 13 }}>
                                    <span style={{ color: "#7a7875" }}>{label}</span>
                                    <span style={{ fontWeight: 600 }}>{val}</span>
                                </div>
                            ))}
                        </div>

                        {pmi > 0 && (
                            <div style={{ ...s.card, borderColor: "rgba(245,166,35,0.3)", background: "rgba(245,166,35,0.05)" }}>
                                <div style={{ fontSize: 12, color: "#f5a623", fontWeight: 600, marginBottom: 6 }}>⚠️ PMI Applied</div>
                                <div style={{ fontSize: 12, color: "#7a7875", lineHeight: 1.6 }}>
                                    You are paying ${pmi}/mo in PMI because your down payment is under 20%.
                                    Put down {fmt((homePrice * 0.2))} to eliminate PMI and save {fmt(pmi * 12)}/year.
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* SEO content */}
                <div style={s.seo}>
                    <h2 style={s.seoH2}>Mortgage payment for common home prices (30yr at {rate}%)</h2>
                    <div style={{ overflowX: "auto", marginTop: "1rem" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>{["Home Price", "10% Down", "20% Down", "30% Down"].map((h) => (
                                    <th key={h} style={s.th}>{h}</th>
                                ))}</tr>
                            </thead>
                            <tbody>
                                {[200000, 300000, 400000, 500000, 600000, 750000, 1000000].map((price) => (
                                    <tr key={price}>
                                        <td style={{ ...s.td, fontWeight: 600 }}>{fmt(price)}</td>
                                        {[10, 20, 30].map((dp) => {
                                            const loan = price * (1 - dp / 100);
                                            const mo = calcMonthly(loan, rate, 30);
                                            return <td key={dp} style={s.td}>{fmt(mo)}/mo</td>;
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <h2 style={s.seoH2}>30-year vs 15-year mortgage — which is better?</h2>
                    <p style={s.seoP}>
                        A 30-year mortgage has lower monthly payments but you pay significantly more interest over the life of the loan.
                        On a {fmt(principal)} loan, a 30-year at {LOAN_TYPES[0].rate}% costs {fmt(calcMonthly(principal, LOAN_TYPES[0].rate, 30))}/month
                        while a 15-year at {LOAN_TYPES[1].rate}% costs {fmt(calcMonthly(principal, LOAN_TYPES[1].rate, 15))}/month —
                        but saves {fmt((calcMonthly(principal, LOAN_TYPES[0].rate, 30) * 360) - (calcMonthly(principal, LOAN_TYPES[1].rate, 15) * 180) - principal)} in total interest.
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
    loanTypes: { display: "flex", gap: 8, flexWrap: "wrap" },
    ltBtn: { display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "#111113", color: "#7a7875", fontSize: 13, fontWeight: 600, cursor: "pointer", gap: 2 },
    ltActive: { background: "rgba(232,105,42,0.1)", border: "1px solid rgba(232,105,42,0.4)", color: "#f0ede8" },
    grid: { display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem", marginBottom: "3rem" },
    card: { background: "#111113", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "1.5rem" },
    h2: { fontFamily: "Georgia, serif", fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.5rem", letterSpacing: "-0.02em" },
    resultCard: { background: "#111113", border: "1px solid rgba(232,105,42,0.25)", borderRadius: 12, padding: "1.5rem" },
    seo: { borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "2.5rem" },
    seoH2: { fontFamily: "Georgia, serif", fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.75rem", marginTop: "1.5rem" },
    seoP: { color: "#7a7875", fontSize: 14, lineHeight: 1.7 },
    th: { background: "#111113", padding: "10px 16px", textAlign: "left" as const, fontSize: 13, color: "#7a7875", borderBottom: "1px solid rgba(255,255,255,0.07)" },
    td: { padding: "10px 16px", fontSize: 13, borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#f0ede8" },
};