"use client";

import { useState } from "react";
import Link from "next/link";
import { statesData } from '../../../data/states'

type StateData = typeof statesData[string];
const SLABS = [5, 12, 18, 28];

export default function GSTStateCalculator({ state, data }: { state: string; data: StateData }) {
    const [amount, setAmount] = useState(10000);
    const [slab, setSlab] = useState(18);
    const [mode, setMode] = useState<"add" | "remove">("add");

    const isIntraState = true; // CGST + SGST for intra-state
    const gstAmount = mode === "add" ? (amount * slab) / 100 : amount - amount * 100 / (100 + slab);
    const cgst = gstAmount / 2;
    const sgst = gstAmount / 2;
    const total = mode === "add" ? amount + gstAmount : amount;
    const base = mode === "add" ? amount : amount * 100 / (100 + slab);

    const fmt = (n: number) => "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <div style={s.page}>
            <div style={s.breadcrumb}>
                <Link href="/" style={s.crumbLink}>ForgeCodeHub</Link>
                <span style={s.sep}>/</span>
                <Link href="/calculators" style={s.crumbLink}>Calculators</Link>
                <span style={s.sep}>/</span>
                <Link href="/calculators/gst" style={s.crumbLink}>GST</Link>
                <span style={s.sep}>/</span>
                <span style={{ color: "#f0ede8", fontSize: 13 }}>{data.name}</span>
            </div>

            <div style={s.container}>
                <div style={s.header}>
                    <div style={s.badge}>GST Calculator • {data.code}</div>
                    <h1 style={s.h1}>GST Calculator for {data.name}</h1>
                    <p style={s.desc}>{data.desc} Use this free GST calculator to compute CGST, SGST and IGST for all transactions in {data.name}.</p>
                </div>

                <div style={s.grid}>
                    <div style={s.card}>
                        <h2 style={s.h2}>Calculate GST</h2>

                        {/* Mode toggle */}
                        <div style={s.toggle}>
                            {(["add", "remove"] as const).map((m) => (
                                <button key={m} style={{ ...s.toggleBtn, ...(mode === m ? s.toggleActive : {}) }}
                                    onClick={() => setMode(m)}>
                                    {m === "add" ? "➕ Add GST" : "➖ Remove GST"}
                                </button>
                            ))}
                        </div>

                        {/* Amount */}
                        <div style={s.field}>
                            <div style={s.fieldRow}>
                                <label style={s.label}>{mode === "add" ? "Base Amount (excl. GST)" : "Total Amount (incl. GST)"}</label>
                                <span style={s.val}>{fmt(amount)}</span>
                            </div>
                            <input type="range" min={100} max={1000000} step={100}
                                value={amount} onChange={(e) => setAmount(+e.target.value)}
                                style={{ width: "100%", accentColor: "#e8692a" }} />
                            <div style={s.hints}><span>₹100</span><span>₹10L</span></div>
                        </div>

                        {/* GST Slab */}
                        <div style={{ marginBottom: "1.5rem" }}>
                            <label style={{ ...s.label, display: "block", marginBottom: 10 }}>GST Slab</label>
                            <div style={{ display: "flex", gap: 8 }}>
                                {SLABS.map((sl) => (
                                    <button key={sl} style={{ ...s.slabBtn, ...(slab === sl ? s.slabActive : {}) }}
                                        onClick={() => setSlab(sl)}>
                                        {sl}%
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Result */}
                        <div style={s.result}>
                            <div style={s.resultTitle}>GST Breakdown — {data.name} (Intra-state)</div>
                            <div style={s.resultGrid}>
                                {[
                                    ["Base Amount", fmt(base), "#f0ede8"],
                                    [`CGST (${slab / 2}%)`, fmt(cgst), "#e8692a"],
                                    [`SGST/${data.code} (${slab / 2}%)`, fmt(sgst), "#f5a623"],
                                    ["Total Amount", fmt(total), "#4ade80"],
                                ].map(([label, val, color]) => (
                                    <div key={label} style={s.resultItem}>
                                        <span style={{ fontSize: 12, color: "#7a7875" }}>{label}</span>
                                        <span style={{ fontSize: 15, fontWeight: 700, color }}>{val}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={s.igstRow}>
                                <span style={{ fontSize: 12, color: "#7a7875" }}>IGST (Inter-state, {slab}%)</span>
                                <span style={{ fontSize: 14, fontWeight: 600, color: "#818cf8" }}>{fmt(gstAmount)}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {/* State info */}
                        <div style={s.card}>
                            <h3 style={s.h3}>{data.name} at a Glance</h3>
                            {[["Capital", data.capital], ["State Code", data.code], ["GDP", data.gdp]].map(([k, v]) => (
                                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 13 }}>
                                    <span style={{ color: "#7a7875" }}>{k}</span>
                                    <span style={{ fontWeight: 600 }}>{v}</span>
                                </div>
                            ))}
                            <div style={{ marginTop: 12 }}>
                                <span style={{ fontSize: 11, color: "#7a7875", letterSpacing: "0.08em", textTransform: "uppercase" }}>Major Industries</span>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                                    {data.majorIndustries.map((ind) => (
                                        <span key={ind} style={{ fontSize: 11, padding: "3px 8px", background: "rgba(232,105,42,0.08)", border: "1px solid rgba(232,105,42,0.2)", borderRadius: 4, color: "#f5a623" }}>{ind}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* GST slabs reference */}
                        <div style={s.card}>
                            <h3 style={s.h3}>GST Slab Reference</h3>
                            {[
                                ["0%", "Essential food, healthcare"],
                                ["5%", "Basic food items, transport"],
                                ["12%", "Processed food, computers"],
                                ["18%", "Most services, electronics"],
                                ["28%", "Luxury, tobacco, vehicles"],
                            ].map(([rate, desc]) => (
                                <div key={rate} style={{ display: "flex", gap: 10, padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 12 }}>
                                    <span style={{ color: "#e8692a", fontWeight: 700, minWidth: 32 }}>{rate}</span>
                                    <span style={{ color: "#7a7875" }}>{desc}</span>
                                </div>
                            ))}
                        </div>

                        {/* Other states */}
                        <div style={s.card}>
                            <h3 style={s.h3}>Other states</h3>
                            {Object.entries(statesData).filter(([slug]) => slug !== state).slice(0, 5).map(([slug, st]) => (
                                <Link key={slug} href={`/calculators/gst/${slug}`}
                                    style={{ display: "flex", justifyContent: "space-between", padding: "7px 10px", background: "#0a0a0b", borderRadius: 7, textDecoration: "none", color: "#7a7875", fontSize: 13, marginBottom: 5, border: "1px solid rgba(255,255,255,0.05)" }}>
                                    <span>{st.name}</span>
                                    <span style={{ color: "#e8692a" }}>{st.code}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                {/* SEO content */}
                <div style={s.seo}>
                    <h2 style={s.seoH2}>How is GST calculated in {data.name}?</h2>
                    <p style={s.seoP}>
                        For intra-state transactions in {data.name}, GST is split equally into CGST (Central GST) and SGST (State GST).
                        At the {slab}% slab, CGST is {slab / 2}% and SGST/{data.code} is {slab / 2}%.
                        For inter-state transactions, the full {slab}% is charged as IGST.
                    </p>
                    <h2 style={s.seoH2}>GST calculation table for {data.name} — common amounts</h2>
                    <div style={{ overflowX: "auto", marginTop: "1rem" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr>{["Amount", "5% GST", "12% GST", "18% GST", "28% GST"].map((h) => (
                                    <th key={h} style={{ background: "#111113", padding: "10px 16px", textAlign: "left", fontSize: 13, color: "#7a7875", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>{h}</th>
                                ))}</tr>
                            </thead>
                            <tbody>
                                {[1000, 5000, 10000, 25000, 50000, 100000].map((amt) => (
                                    <tr key={amt}>
                                        <td style={s.td}>{fmt(amt)}</td>
                                        {[5, 12, 18, 28].map((sl) => (
                                            <td key={sl} style={s.td}>{fmt(amt + (amt * sl) / 100)}</td>
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
    grid: { display: "grid", gridTemplateColumns: "1fr 300px", gap: "1.5rem", marginBottom: "3rem" },
    card: { background: "#111113", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "1.5rem" },
    h2: { fontFamily: "Georgia, serif", fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.5rem", letterSpacing: "-0.02em" },
    h3: { fontSize: "0.9rem", fontWeight: 600, marginBottom: "1rem", color: "#f0ede8" },
    toggle: { display: "flex", gap: 8, marginBottom: "1.5rem" },
    toggleBtn: { flex: 1, padding: "8px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "#0a0a0b", color: "#7a7875", fontSize: 13, cursor: "pointer" },
    toggleActive: { background: "rgba(232,105,42,0.1)", border: "1px solid rgba(232,105,42,0.4)", color: "#f0ede8" },
    field: { marginBottom: "1.5rem" },
    fieldRow: { display: "flex", justifyContent: "space-between", marginBottom: 8 },
    label: { fontSize: 13, color: "#7a7875" },
    val: { fontSize: 13, fontWeight: 600 },
    hints: { display: "flex", justifyContent: "space-between", fontSize: 11, color: "#555", marginTop: 4 },
    slabBtn: { flex: 1, padding: "8px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "#0a0a0b", color: "#7a7875", fontSize: 14, fontWeight: 600, cursor: "pointer" },
    slabActive: { background: "rgba(232,105,42,0.1)", border: "1px solid rgba(232,105,42,0.4)", color: "#e8692a" },
    result: { background: "#0a0a0b", borderRadius: 10, padding: "1.25rem", border: "1px solid rgba(232,105,42,0.2)", marginTop: "1.5rem" },
    resultTitle: { fontSize: 12, color: "#7a7875", marginBottom: 12, letterSpacing: "0.04em" },
    resultGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 },
    resultItem: { display: "flex", flexDirection: "column", gap: 4 },
    igstRow: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.06)" },
    seo: { borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "2.5rem" },
    seoH2: { fontFamily: "Georgia, serif", fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.75rem", marginTop: "1.5rem", letterSpacing: "-0.02em" },
    seoP: { color: "#7a7875", fontSize: 14, lineHeight: 1.7 },
    td: { padding: "10px 16px", fontSize: 13, borderBottom: "1px solid rgba(255,255,255,0.05)", color: "#f0ede8" },
};