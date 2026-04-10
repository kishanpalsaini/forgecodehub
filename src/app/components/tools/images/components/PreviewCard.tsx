// components/PreviewCard.tsx
interface PreviewCardProps {
  label: string;
  src?: string;
  meta?: string;
  placeholder?: string;
}

export default function PreviewCard({ label, src, meta, placeholder }: PreviewCardProps) {
  return (
    <div
      style={{
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 12,
          fontWeight: 600,
          color: "#64748b",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}
      >
        {label}
      </p>
      {src ? (
        <>
          <img
            src={src}
            alt={label}
            style={{
              maxWidth: "100%",
              maxHeight: 200,
              objectFit: "contain",
              borderRadius: 8,
            }}
          />
          {meta && (
            <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>{meta}</p>
          )}
        </>
      ) : (
        <div
          style={{
            height: 140,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#94a3b8",
            fontSize: 13,
            fontStyle: "italic",
          }}
        >
          {placeholder}
        </div>
      )}
    </div>
  );
}