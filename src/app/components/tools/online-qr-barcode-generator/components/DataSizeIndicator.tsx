import { getOptimalErrorCorrection } from "../utils/helpers";
import styles from "../qr-barcode-generator.module.css";

interface DataSizeIndicatorProps {
  data: string;
}

export default function DataSizeIndicator({ data }: DataSizeIndicatorProps) {
  if (!data) return null;

  const size = new Blob([data]).size;
  const sizeKB = Math.round(size / 1024);
  const percentage = (size / 2953) * 100;

  let color = "#48bb78";
  let bgColor = "#f0fff4";
  let message = "✓ Excellent - Easy to scan";
  let icon = "✅";

  if (percentage > 95) {
    color = "#e53e3e";
    bgColor = "#fff5f5";
    message = "⚠️ Maximum capacity - May fail";
    icon = "🔴";
  } else if (percentage > 80) {
    color = "#dd6b20";
    bgColor = "#fffaf0";
    message = "⚠️ Very large - Difficult to scan";
    icon = "🟠";
  } else if (percentage > 60) {
    color = "#d69e2e";
    bgColor = "#fffff0";
    message = "⚠️ Large - May be challenging";
    icon = "🟡";
  } else if (percentage > 40) {
    color = "#38a169";
    bgColor = "#f0fff4";
    message = "✓ Good - Should scan well";
    icon = "🟢";
  }

  const recommendedLevel = getOptimalErrorCorrection(size);

  return (
    <div
      style={{
        padding: "15px",
        background: bgColor,
        borderRadius: "10px",
        marginTop: "15px",
        border: `2px solid ${color}`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <span style={{ fontSize: "14px", fontWeight: 700, color: "#2d3748" }}>
          {icon} Data Size: {sizeKB}KB / 3KB
        </span>
        <span style={{ fontSize: "13px", fontWeight: 600, color }}>
          {message}
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: "10px",
          background: "#e2e8f0",
          borderRadius: "5px",
          overflow: "hidden",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            width: `${Math.min(percentage, 100)}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${color}, ${color}dd)`,
            transition: "width 0.3s ease",
          }}
        />
      </div>
      {percentage > 40 && (
        <div style={{ fontSize: "12px", color: "#4a5568" }}>
          💡 Recommended error correction: <strong>{recommendedLevel}</strong>
          {percentage > 60 && " • Consider using cloud storage"}
        </div>
      )}
    </div>
  );
}