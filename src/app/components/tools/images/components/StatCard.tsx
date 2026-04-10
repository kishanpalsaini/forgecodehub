// components/StatCard.tsx
interface StatCardProps {
  label: string;
  value: string;
}

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <div
      style={{
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 10,
        padding: "12px 18px",
        textAlign: "center",
        minWidth: 90,
      }}
    >
      <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a" }}>
        {value}
      </div>
      <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
        {label}
      </div>
    </div>
  );
}