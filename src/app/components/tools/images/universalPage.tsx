// page.tsx
"use client";
import { Fragment, useState } from "react";
import { ConvertFrom, ConvertTo } from "./types";
import { FROM_OPTIONS, TO_OPTIONS, ALL_FAQS } from "./constants";
import { getFaqKey } from "./utils";
import { labelStyle, selectStyle } from "./styles";
import FaqItem from "./components/FaqItem";
import UniversalConverter from "./converters/UniversalConverter";
import ToPdfConverter from "./converters/ToPdfConverter";
import RotateConverter from "./converters/RotateConverter";
import styles from "./png-to-jpg/page.module.css";


export default function UniversalImageConverter() {
  const [from, setFrom] = useState<ConvertFrom>("jpg");
  const [to, setTo] = useState<ConvertTo>("png");
  const [key, setKey] = useState(0);
  
  const handleFrom = (v: ConvertFrom) => {
    setFrom(v);
    setKey((k) => k + 1);
  };
  
  const handleTo = (v: ConvertTo) => {
    setTo(v);
    setKey((k) => k + 1);
  };

  const faqKey = getFaqKey(to);
  const faqs = ALL_FAQS[faqKey] ?? [];

  // Filter out same format conversions
  const validToOptions = TO_OPTIONS.filter((opt) => opt.value !== from);

  const renderConverter = () => {
    if (to === "pdf") return <ToPdfConverter key={key} />;
    if (to === "rotate") return <RotateConverter key={key} />;
    return <UniversalConverter key={key} fromType={from} toType={to} />;
  };

  return (
    <div
      style={{
        margin: "0 auto",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        color: "#1e293b",
        padding: "40px 20px",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            padding: "4px 12px",
            borderRadius: "99px",
            background: "rgba(34, 211, 238, 0.08)",
            color: "#22d3ee",
            marginBottom: 12,
            fontWeight: 500,
            border: "1px solid rgba(34, 211, 238, 0.18)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          🎨 Developer Tool
        </div>
        <h1
          style={{
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-0.025em",
            marginBottom: "0.4rem",
            textAlign: "center",
          }}
        >
          Universal Image Converter
        </h1>
        <p
          style={{
            fontSize: "15px",
            color: "#dfe4eb",
            lineHeight: 1.6,
            textAlign: "center",
          }}
        >
          Convert between 10+ image formats • Rotate & flip • Create PDFs • All in your browser
        </p>
      </div>

      {/* Conversion Selectors */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: 16,
          padding: 24,
          margin: "0 auto 24px",
          marginBottom: 24,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={labelStyle}>Convert From</label>
            <select
              value={from}
              onChange={(e) => handleFrom(e.target.value as ConvertFrom)}
              style={selectStyle}
            >
              {FROM_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          
          <div style={{ fontSize: 24, color: "#c7d2fe", paddingTop: 18 }}>
            →
          </div>
          
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={labelStyle}>Convert To</label>
            <select
              value={to}
              onChange={(e) => handleTo(e.target.value as ConvertTo)}
              style={selectStyle}
            >
              {validToOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Active Converter */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: 16,
          padding: 24,
          maxWidth: "80%",
          margin: "0 auto 24px",
          marginBottom: 24,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        {renderConverter()}
      </div>


      <hr className={styles.divider} />
      

      {/* FAQ */}
      {faqs.length > 0 && (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
            <h2 className={styles.faqTitle} style={{ color: "#000000" }}>
              Frequently Asked Questions
            </h2>
          <div className={styles.seo}>
            {faqs.map((f, i) => (
              <Fragment key={i}>
                <h2>{f.question}</h2>
                <p>{f.answer}</p>
              </Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}