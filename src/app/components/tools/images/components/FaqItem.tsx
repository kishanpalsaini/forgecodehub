// components/FaqItem.tsx
"use client";
import { useState } from "react";

interface FaqItemProps {
  question: string;
  answer: string;
}

export default function FaqItem({ question, answer }: FaqItemProps) {
  const [open, setOpen] = useState(false);
  
  return (
    <div
      style={{
        borderBottom: "1px solid #e2e8f0",
        paddingBottom: 12,
        marginBottom: 12,
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 0",
          fontSize: 14,
          fontWeight: 500,
          color: "#1e293b",
          textAlign: "left",
          gap: 8,
        }}
      >
        <span>{question}</span>
        <span
          style={{
            fontSize: 12,
            color: "#64748b",
            flexShrink: 0,
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
        >
          ▼
        </span>
      </button>
      {open && (
        <p
          style={{
            margin: "6px 0 0",
            fontSize: 13,
            color: "#475569",
            lineHeight: 1.6,
          }}
        >
          {answer}
        </p>
      )}
    </div>
  );
}