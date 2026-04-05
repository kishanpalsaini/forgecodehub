"use client";

import { useState } from "react";
import Link from "next/link";
import { banksData } from "@/app/data/banks";

type BankData = typeof banksData[string];

function calcEMI(principal: number, rate: number, tenure: number) {
    const r = rate / 12 / 100;
    if (r === 0) return principal / tenure;
    return (principal * r * Math.pow(1 + r, tenure)) / (Math.pow(1 + r, tenure) - 1);
}

const fmt = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

export default function BankEMICalculator({ bank, data }: { bank: string; data: BankData }) {
    const [loanType, setLoanType] = useState<"home" | "car" | "personal">("home");
    const [principal, setPrincipal] = useState(2000000);
    const [rate, setRate] = useState(parseFloat(data.homeRate));
    const [tenure, setTenure] = useState(240);

    const emi = calcEMI(principal, rate, tenure);
    const totalPayment = emi * tenure;
    const totalInterest = totalPayment - principal;

    function handleLoanType(type: "home" | "car" | "personal") {
        setLoanType(type);
        setRate(parseFloat(type === "home" ? data.homeRate : type === "car" ? data.carRate : data.personalRate));
        setTenure(type === "personal" ? 60 : type === "car" ? 84 : 240);
        setPrincipal(type === "personal" ? 500000 : type === "car" ? 800000 : 2000000);
    }

    return (
        <div style={s.page}>
            <div style={s.breadcrumb}>
                <Link href="/" style={s.crumbLink}>ForgeCodeHub</Link>
                <span style={s.sep}>/</span>
                <Link href="/finance-calculators" style={s.crumbLink}>Calculators</Link>
                <span style={s.sep}>/</span>
                <Link href="/calculators/banks" style={s.crumbLink}>Banks</Link>
                <span style={s.sep}>/</span>
                <span style={{ color: "#f0ede8", fontSize: 13 }}>{data.name}</span>
            </div>

            <div style={s.container}>
                <div style={s.header}>
                    <div style={s.badge}>EMI Calculator</div>
                    <h1 style={s.h1}>{data.name} EMI Calculator</h1>
                    <p style={s.desc}>{data.desc}</p>
                    <div style={s.rateRow}>
                        {(["home", "car", "personal"] as const).map((type) => (
                            <button key={type} style={{ ...s.chip, ...(loanType === type ? s.chipActive : {}) }}
                                onClick={() => handleLoanType(type)}>
                                {type === "home" ? "🏠" : type === "car" ? "🚗" : "👤"}{" "}
                                {type.charAt(0).toUpperCase() + type.slice(1)} Loan{" "}
                                <span style={{ color: "#e8692a", fontWeight: 600 }}>
                                    {type === "home" ? data.homeRate : type === "car" ? data.carRate : data.personalRate}%
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div style={s.grid}>
                    <div style={s.card}>
                        <h2 style={s.h2}>Calculate your EMI</h2>
                        {[
                            { label: "Loan Amount", val: fmt(principal), min: 100000, max: data.maxLoan, step: 50000, value: principal, set: setPrincipal, hints: ["₹1L", fmt(data.maxLoan)] },
                            { label: "Interest Rate", val: `${rate}% p.a.`, min: 6, max: 24, step: 0.05, value: rate, set: setRate, hints: ["6%", "24%"] },
                            { label: "Tenure", val: tenure >= 12 ? `${tenure / 12} yrs` : `${tenure} mo`, min: 12, max: loanType === "home" ? 360 : 84, step: 12, value: tenure, set: setTenure, hints: ["1 yr", loanType === "home" ? "30 yrs" : "7 yrs"] },
                        ].map(({ label, val, min, max, step, value, set, hints }) => (
                            <div key={label} style={{ marginBottom: "1.5rem" }}>
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

                        <div style={s.result}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", paddingBottom: "1rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                <span style={{ fontSize: 14, color: "#7a7875" }}>Monthly EMI</span>
                                <span style={{ fontSize: "1.75rem", fontWeight: 700, color: "#e8692a", fontFamily: "Georgia, serif" }}>{fmt(emi)}</span>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                                {[["Principal", fmt(principal), "#f0ede8"], ["Total Interest", fmt(totalInterest), "#e8692a"], ["Total Payment", fmt(totalPayment), "#f0ede8"]].map(([label, val, color]) => (
                                    <div key={label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                        <span style={{ fontSize: 11, color: "#7a7875" }}>{label}</span>
                                        <span style={{ fontSize: 14, fontWeight: 600, color }}>{val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <div style={s.card}>
                            <h3 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "1rem" }}>{data.name} Rates 2025</h3>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <tbody>
                                    {[["🏠 Home Loan", data.homeRate + "% p.a.", `Up to ${data.maxTenure} yrs`], ["🚗 Car Loan", data.carRate + "% p.a.", "Up to 7 yrs"], ["👤 Personal Loan", data.personalRate + "% p.a.", "Up to 5 yrs"]].map(([type, rate, tenure]) => (
                                        <tr key={type} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                            <td style={{ padding: "8px 4px", fontSize: 13 }}>{type}</td>
                                            <td style={{ padding: "8px 4px", fontSize: 13, color: "#e8692a", fontWeight: 600 }}>{rate}</td>
                                            <td style={{ padding: "8px 4px", fontSize: 13, color: "#7a7875" }}>{tenure}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div style={s.card}>
                            <h3 style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "1rem" }}>Compare banks</h3>
                            {Object.entries(banksData).filter(([slug]) => slug !== bank).slice(0, 5).map(([slug, b]) => (
                                <Link key={slug} href={`/calculators/emi/${slug}`} style={{ display: "flex", justifyContent: "space-between", padding: "8px 10px", background: "#0a0a0b", borderRadius: 8, textDecoration: "none", color: "#7a7875", fontSize: 13, marginBottom: 6, border: "1px solid rgba(255,255,255,0.05)" }}>
                                    <span>{b.name.split("(")[0].trim()}</span>
                                    <span style={{ color: "#e8692a", fontWeight: 600 }}>{b.homeRate}%</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "2.5rem" }}>
                    <h2 style={s.seoH2}>How to calculate {data.name} EMI?</h2>
                    <p style={{ color: "#7a7875", fontSize: 14, lineHeight: 1.7 }}>
                        Use the formula: EMI = P × r × (1+r)^n / ((1+r)^n - 1) where P is the loan amount,
                        r is the monthly interest rate, and n is the number of months. For a {fmt(principal)}{" "}
                        {loanType} loan from {data.name} at {rate}% for {tenure} months, your EMI is{" "}
                        <strong style={{ color: "#f0ede8" }}>{fmt(emi)}</strong>.
                    </p>
                    <h2 style={s.seoH2}>{data.name} Home Loan EMI table (common amounts)</h2>
                    <div style={{ overflowX: "auto", marginTop: "1rem" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>{["Loan Amount", "10 Years", "20 Years", "30 Years"].map((h) => (
                                    <th key={h} style={{ background: "#111113", padding: "10px 16px", textAlign: "left", fontSize: 13, color: "#7a7875", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>{h}</th>
                                ))}</tr>
                            </thead>
                            <tbody>
                                {[1000000, 2000000, 3000000, 5000000, 10000000].map((amt) => (
                                    <tr key={amt}>
                                        <td style={{ padding: "10px 16px", fontSize: 13, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{fmt(amt)}</td>
                                        {[120, 240, 360].map((t) => (
                                            <td key={t} style={{ padding: "10px 16px", fontSize: 13, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                                {fmt(calcEMI(amt, parseFloat(data.homeRate), t))}
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
    desc: { color: "#7a7875", fontSize: 15, maxWidth: 600, lineHeight: 1.6, marginBottom: "1.5rem" },
    rateRow: { display: "flex", gap: 10, flexWrap: "wrap" },
    chip: { background: "#111113", border: "1px solid rgba(255,255,255,0.08)", color: "#7a7875", padding: "6px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer", display: "flex", gap: 6, alignItems: "center" },
    chipActive: { background: "rgba(232,105,42,0.1)", border: "1px solid rgba(232,105,42,0.4)", color: "#f0ede8" },
    grid: { display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem", marginBottom: "3rem" },
    card: { background: "#111113", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "1.5rem" },
    h2: { fontFamily: "Georgia, serif", fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.5rem", letterSpacing: "-0.02em" },
    result: { background: "#0a0a0b", borderRadius: 10, padding: "1.25rem", border: "1px solid rgba(232,105,42,0.2)", marginTop: "1.5rem" },
    seoH2: { fontFamily: "Georgia, serif", fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.75rem", marginTop: "1.5rem", letterSpacing: "-0.02em" },
};