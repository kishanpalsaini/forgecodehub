// components/UploadArea.tsx
"use client";
import { useState, useRef } from "react";

interface UploadAreaProps {
  onFile?: (f: File) => void;
  multiple?: boolean;
  accept?: string;
  file?: File | null;
  files?: File[];
  icon?: string;
  label?: string;
  sub?: string;
}

export default function UploadArea({
  onFile,
  multiple,
  accept,
  file,
  files,
  icon,
  label,
  sub,
}: UploadAreaProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = (fList: FileList | null) => {
    if (!fList) return;
    if (multiple && onFile) {
      Array.from(fList).forEach((f) => onFile(f));
    } else if (onFile && fList[0]) {
      onFile(fList[0]);
    }
  };

  const count = files?.length ?? (file ? 1 : 0);
  const firstName = file?.name ?? files?.[0]?.name ?? "";

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handle(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      style={{
        border: `2px dashed ${dragging ? "#6366f1" : "#cbd5e1"}`,
        borderRadius: 16,
        padding: "36px 24px",
        textAlign: "center",
        cursor: "pointer",
        background: dragging ? "#f0f0ff" : "#fafbff",
        transition: "all 0.2s",
        marginBottom: 24,
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept ?? "image/*"}
        multiple={multiple}
        hidden
        onChange={(e) => handle(e.target.files)}
      />
      {count === 0 ? (
        <>
          <div style={{ fontSize: 32, marginBottom: 10 }}>{icon ?? "🖼️"}</div>
          <p style={{ margin: "0 0 4px", fontWeight: 500, color: "#334155" }}>
            {label ?? "Drop image here or"}{" "}
            <span style={{ color: "#6366f1" }}>browse</span>
          </p>
          <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>{sub}</p>
        </>
      ) : (
        <p style={{ margin: 0, fontWeight: 500, color: "#334155" }}>
          ✓ {count > 1 ? `${count} files selected` : firstName} — click to change
        </p>
      )}
    </div>
  );
}