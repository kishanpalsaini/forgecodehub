// converters/RotateConverter.tsx
"use client";
import { useState, useCallback } from "react";
import { ConvertTo, Quality } from "../types";
import { TO_OPTIONS, qualityMap } from "../constants";
import {
  formatBytes,
  getFileNameWithoutExt,
  loadImageFromFile,
  canvasToBlob,
  canvasToSvgBlob,
  downloadBlob,
  getMimeType,
  supportsTransparency,
  isLossyFormat,
  getFileExtension,
} from "../utils";
import { btnStyle, labelStyle, toggleStyle, iconBtnStyle } from "../styles";
import UploadArea from "../components/UploadArea";
import QualitySelector from "../components/QualitySelector";
import PreviewCard from "../components/PreviewCard";

export default function RotateConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [output, setOutput] = useState("");
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [quality, setQuality] = useState<Quality>("high");
  const [format, setFormat] = useState<ConvertTo>("jpg");
  const [origSize, setOrigSize] = useState(0);
  const [outSize, setOutSize] = useState(0);
  const [processing, setProcessing] = useState(false);

  const outputFormats = TO_OPTIONS.filter(
    (o) => o.value !== "pdf" && o.value !== "rotate"
  );

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) return;
    setFile(f);
    setOrigSize(f.size);
    setOutput("");
    setOutSize(0);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    
    const url = URL.createObjectURL(f);
    setPreview(url);
  }, []);

  const apply = async (
    rot: number,
    fH: boolean,
    fV: boolean,
    fmt: ConvertTo,
    q: Quality
  ) => {
    if (!file || fmt === "pdf" || fmt === "rotate") return;
    setProcessing(true);
    
    try {
      const img = await loadImageFromFile(file);
      const rad = (rot * Math.PI) / 180;
      const sin = Math.abs(Math.sin(rad));
      const cos = Math.abs(Math.cos(rad));
      const cw = Math.round(img.naturalWidth * cos + img.naturalHeight * sin);
      const ch = Math.round(img.naturalWidth * sin + img.naturalHeight * cos);
      
      const canvas = document.createElement("canvas");
      canvas.width = cw;
      canvas.height = ch;
      const ctx = canvas.getContext("2d")!;
      
      if (!supportsTransparency(fmt)) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, cw, ch);
      }
      
      ctx.translate(cw / 2, ch / 2);
      ctx.rotate(rad);
      ctx.scale(fH ? -1 : 1, fV ? -1 : 1);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
      
      let blob: Blob;
      if (fmt === "svg") {
        blob = await canvasToSvgBlob(canvas);
      } else {
        const mime = getMimeType(fmt);
        blob = await canvasToBlob(
          canvas,
          mime,
          isLossyFormat(fmt) ? qualityMap[q] : 1
        );
      }
      
      setOutSize(blob.size);
      setOutput(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Processing failed:", error);
      alert("Processing failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const rotate = (deg: number) => {
    const next = (((rotation + deg) % 360) + 360) % 360;
    setRotation(next);
    apply(next, flipH, flipV, format, quality);
  };

  const toggleFlipH = () => {
    const next = !flipH;
    setFlipH(next);
    apply(rotation, next, flipV, format, quality);
  };
  
  const toggleFlipV = () => {
    const next = !flipV;
    setFlipV(next);
    apply(rotation, flipH, next, format, quality);
  };

  const download = async () => {
    if (!file || format === "pdf" || format === "rotate") return;
    
    try {
      const img = await loadImageFromFile(file);
      const rad = (rotation * Math.PI) / 180;
      const sin = Math.abs(Math.sin(rad));
      const cos = Math.abs(Math.cos(rad));
      const cw = Math.round(img.naturalWidth * cos + img.naturalHeight * sin);
      const ch = Math.round(img.naturalWidth * sin + img.naturalHeight * cos);
      
      const canvas = document.createElement("canvas");
      canvas.width = cw;
      canvas.height = ch;
      const ctx = canvas.getContext("2d")!;
      
      if (!supportsTransparency(format)) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, cw, ch);
      }
      
      ctx.translate(cw / 2, ch / 2);
      ctx.rotate(rad);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
      
      let blob: Blob;
      if (format === "svg") {
        blob = await canvasToSvgBlob(canvas);
      } else {
        const mime = getMimeType(format);
        blob = await canvasToBlob(
          canvas,
          mime,
          isLossyFormat(format) ? qualityMap[quality] : 1
        );
      }
      
      downloadBlob(blob, `${getFileNameWithoutExt(file.name)}_rotated.${getFileExtension(format)}`);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again.");
    }
  };

  return (
    <>
      <UploadArea
        onFile={handleFile}
        accept="image/*"
        file={file}
        icon="🔄"
        label="Drop image here or"
        sub="All formats supported"
      />

      {file && (
        <>
          <div
            style={{
              display: "flex",
              gap: 20,
              flexWrap: "wrap",
              marginBottom: 20,
            }}
          >
            <div>
              <p style={labelStyle}>Rotate</p>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => rotate(-90)} style={iconBtnStyle}>
                  ↺ 90° Left
                </button>
                <button onClick={() => rotate(90)} style={iconBtnStyle}>
                  ↻ 90° Right
                </button>
                <button onClick={() => rotate(180)} style={iconBtnStyle}>
                  ↕ 180°
                </button>
              </div>
            </div>
            
            <div>
              <p style={labelStyle}>Flip</p>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={toggleFlipH} style={toggleStyle(flipH)}>
                  ⇄ Horizontal
                </button>
                <button onClick={toggleFlipV} style={toggleStyle(flipV)}>
                  ⇅ Vertical
                </button>
              </div>
            </div>
            
            <div style={{ flex: 1, minWidth: 180 }}>
              <p style={labelStyle}>Free Rotate: {rotation}°</p>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <input
                  type="range"
                  min={0}
                  max={359}
                  value={rotation}
                  style={{ flex: 1 }}
                  onChange={(e) => {
                    const v = +e.target.value;
                    setRotation(v);
                    apply(v, flipH, flipV, format, quality);
                  }}
                />
                <span style={{ fontSize: 13, color: "#475569", minWidth: 34 }}>
                  {rotation}°
                </span>
              </div>
            </div>
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
              <p style={labelStyle}>Output Format</p>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as ConvertTo)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                  fontSize: 13,
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                {outputFormats.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.value.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            
            {isLossyFormat(format) && (
              <div>
                <p style={labelStyle}>Quality</p>
                <QualitySelector quality={quality} onChange={setQuality} />
              </div>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginTop: 4,
            }}
          >
            <PreviewCard
              label="Original"
              src={preview}
              meta={formatBytes(origSize)}
            />
            <PreviewCard
              label={`Result — ${rotation}°${flipH ? " · Flip H" : ""}${flipV ? " · Flip V" : ""}`}
              src={output}
              meta={output ? formatBytes(outSize) : undefined}
              placeholder={
                !output
                  ? processing
                    ? "Processing…"
                    : "Use controls above"
                  : undefined
              }
            />
          </div>
          
          {output && (
            <button
              onClick={download}
              style={{ ...btnStyle("#10b981"), marginTop: 16 }}
            >
              ⬇ Download {format.toUpperCase()}
            </button>
          )}
        </>
      )}
    </>
  );
}