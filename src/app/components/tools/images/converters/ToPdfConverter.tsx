// converters/ToPdfConverter.tsx
"use client";
import { useState, useCallback } from "react";
import { PageSize, Orientation, Quality } from "../types";
import { PAGE_SIZES, qualityMap } from "../constants";
import { formatBytes } from "../utils";
import { btnStyle, labelStyle, toggleStyle, iconBtnStyle } from "../styles";
import UploadArea from "../components/UploadArea";
import StatCard from "../components/StatCard";
import QualitySelector from "../components/QualitySelector";

export default function ToPdfConverter() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [quality, setQuality] = useState<Quality>("high");
  const [converting, setConverting] = useState(false);

  const addFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) return;
    setFiles((prev) => [...prev, f].slice(0, 20));
  }, []);

  const removeFile = (i: number) =>
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
    
  const moveUp = (i: number) => {
    if (i === 0) return;
    setFiles((prev) => {
      const a = [...prev];
      [a[i - 1], a[i]] = [a[i], a[i - 1]];
      return a;
    });
  };
  
  const moveDown = (i: number) => {
    setFiles((prev) => {
      if (i >= prev.length - 1) return prev;
      const a = [...prev];
      [a[i], a[i + 1]] = [a[i + 1], a[i]];
      return a;
    });
  };

  const convert = async () => {
    if (files.length === 0) return;
    setConverting(true);
    
    try {
      const { jsPDF } = await import("jspdf");
      const [pw, ph] = PAGE_SIZES[pageSize];
      const [W, H] = orientation === "landscape" ? [ph, pw] : [pw, ph];
      const pdf = new jsPDF({ orientation, unit: "pt", format: pageSize });
      
      for (let i = 0; i < files.length; i++) {
        if (i > 0) pdf.addPage(pageSize, orientation);
        
        const url = URL.createObjectURL(files[i]);
        await new Promise<void>((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            try {
              const scale = Math.min(W / img.naturalWidth, H / img.naturalHeight);
              const dw = img.naturalWidth * scale;
              const dh = img.naturalHeight * scale;
              const x = (W - dw) / 2;
              const y = (H - dh) / 2;
              
              pdf.addImage(
                img,
                files[i].type === "image/png" ? "PNG" : "JPEG",
                x,
                y,
                dw,
                dh,
                undefined,
                "FAST"
              );
              
              URL.revokeObjectURL(url);
              resolve();
            } catch (error) {
              reject(error);
            }
          };
          img.onerror = reject;
          
          if (files[i].type === "image/svg+xml") {
            const reader = new FileReader();
            reader.onload = (e) => {
              img.src = e.target?.result as string;
            };
            reader.onerror = reject;
            reader.readAsDataURL(files[i]);
          } else {
            img.src = url;
          }
        });
      }
      
      pdf.save(`images-to-pdf-${Date.now()}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("PDF generation failed. Please try again.");
    } finally {
      setConverting(false);
    }
  };

  return (
    <>
      <UploadArea
        onFile={addFile}
        multiple
        accept="image/*"
        files={files}
        icon="📄"
        label="Drop images here or"
        sub="All formats supported — up to 20 images · Each becomes one PDF page"
      />

      {files.length > 0 && (
        <>
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            <StatCard label="Pages" value={String(files.length)} />
            <StatCard
              label="Total size"
              value={formatBytes(files.reduce((s, f) => s + f.size, 0))}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: 20,
              flexWrap: "wrap",
              marginBottom: 20,
            }}
          >
            <div>
              <p style={labelStyle}>Page Size</p>
              <div style={{ display: "flex", gap: 6 }}>
                {(["a4", "letter", "a3"] as PageSize[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setPageSize(s)}
                    style={toggleStyle(pageSize === s)}
                  >
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <p style={labelStyle}>Orientation</p>
              <div style={{ display: "flex", gap: 6 }}>
                {(["portrait", "landscape"] as Orientation[]).map((o) => (
                  <button
                    key={o}
                    onClick={() => setOrientation(o)}
                    style={toggleStyle(orientation === o)}
                  >
                    {o === "portrait" ? "↕ Portrait" : "↔ Landscape"}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <p style={labelStyle}>Image Quality</p>
              <QualitySelector quality={quality} onChange={setQuality} />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginBottom: 20,
            }}
          >
            {files.map((f, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  background: "#f8fafc",
                  borderRadius: 10,
                  padding: "8px 12px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <img
                  src={URL.createObjectURL(f)}
                  alt=""
                  style={{
                    width: 36,
                    height: 36,
                    objectFit: "cover",
                    borderRadius: 6,
                  }}
                />
                <span style={{ fontSize: 12, color: "#94a3b8", minWidth: 20 }}>
                  #{i + 1}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: "#334155",
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {f.name}
                </span>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>
                  {formatBytes(f.size)}
                </span>
                <button
                  onClick={() => moveUp(i)}
                  disabled={i === 0}
                  style={iconBtnStyle}
                >
                  ↑
                </button>
                <button
                  onClick={() => moveDown(i)}
                  disabled={i === files.length - 1}
                  style={iconBtnStyle}
                >
                  ↓
                </button>
                <button
                  onClick={() => removeFile(i)}
                  style={{ ...iconBtnStyle, color: "#ef4444" }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={convert}
            disabled={converting}
            style={btnStyle("#6366f1")}
          >
            {converting
              ? "⏳ Generating PDF…"
              : `⬇ Download PDF (${files.length} page${files.length > 1 ? "s" : ""})`}
          </button>
        </>
      )}
    </>
  );
}