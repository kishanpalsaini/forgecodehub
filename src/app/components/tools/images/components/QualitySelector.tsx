// components/QualitySelector.tsx
import { Quality } from "../types";

interface QualitySelectorProps {
  quality: Quality;
  onChange: (q: Quality) => void;
}

export default function QualitySelector({ quality, onChange }: QualitySelectorProps) {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {(["low", "medium", "high"] as Quality[]).map((q) => (
        <button
          key={q}
          onClick={() => onChange(q)}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            border: quality === q ? "2px solid #6366f1" : "1px solid #e2e8f0",
            background: quality === q ? "#eef2ff" : "#fff",
            color: quality === q ? "#4338ca" : "#475569",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: quality === q ? 600 : 400,
            transition: "all 0.2s",
          }}
        >
          {q.charAt(0).toUpperCase() + q.slice(1)}
        </button>
      ))}
    </div>
  );
}