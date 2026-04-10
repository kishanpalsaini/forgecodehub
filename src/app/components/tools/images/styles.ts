// styles.ts
import React from "react";

export const btnStyle = (color: string): React.CSSProperties => ({
  background: color,
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "12px 28px",
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
  width: "100%",
  transition: "all 0.2s",
});

export const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: 6,
  marginTop: 0,
};

export const toggleStyle = (active: boolean): React.CSSProperties => ({
  padding: "6px 14px",
  borderRadius: 8,
  fontSize: 13,
  cursor: "pointer",
  fontWeight: active ? 600 : 400,
  border: active ? "2px solid #6366f1" : "1px solid #e2e8f0",
  background: active ? "#eef2ff" : "#fff",
  color: active ? "#4338ca" : "#475569",
  transition: "all 0.2s",
});

export const iconBtnStyle: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 8,
  fontSize: 13,
  cursor: "pointer",
  border: "1px solid #e2e8f0",
  background: "#fff",
  color: "#475569",
  transition: "all 0.2s",
};

export const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid #e2e8f0",
  fontSize: 15,
  color: "#1e293b",
  background: "#fafbff",
  cursor: "pointer",
};