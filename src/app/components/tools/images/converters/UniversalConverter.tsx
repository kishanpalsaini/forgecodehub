// converters/UniversalConverter.tsx
"use client";
import { useState, useCallback } from "react";
import { ConvertFrom, ConvertTo, Quality } from "../types";
import { FROM_OPTIONS, qualityMap } from "../constants";
import {
  formatBytes,
  getFileNameWithoutExt,
  getSavingPercent,
  loadImageFromFile,
  canvasToBlob,
  canvasToSvgBlob,
  downloadBlob,
  getMimeType,
  supportsTransparency,
  isLossyFormat,
  getFileExtension,
} from "../utils";
import { btnStyle } from "../styles";
import UploadArea from "../components/UploadArea";
import StatCard from "../components/StatCard";
import QualitySelector from "../components/QualitySelector";
import PreviewCard from "../components/PreviewCard";

interface UniversalConverterProps {
  fromType?: ConvertFrom;
  toType?: ConvertTo;
}

export default function UniversalConverter({ fromType, toType }: UniversalConverterProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [output, setOutput] = useState("");
  const [quality, setQuality] = useState<Quality>("high");
  const [origSize, setOrigSize] = useState(0);
  const [outSize, setOutSize] = useState(0);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [converting, setConverting] = useState(false);

  const fromOption = FROM_OPTIONS.find((o) => o.value === fromType);
  const accept = fromOption?.accept || "image/*";
  // const outputFormat = toType;
  // const outputMime = getMimeType(toType);
  // const isOutputLossy = isLossyFormat(toType);

  const outputFormat = toType ?? "jpg";
  const outputMime = getMimeType((toType ?? "jpg") as ConvertTo);
  const isOutputLossy = isLossyFormat((toType ?? "jpg") as ConvertTo);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setOrigSize(f.size);
    setOutput("");
    setOutSize(0);

    const url = URL.createObjectURL(f);
    setPreview(url);

    const img = new Image();
    img.onload = () => setDims({ w: img.naturalWidth, h: img.naturalHeight });

    if (f.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(f);
    } else {
      img.src = url;
    }
  }, []);

  const convert = async () => {
    if (!file) return;
    setConverting(true);

    try {
      const img = await loadImageFromFile(file);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;

      // Fill with white background for formats that don't support transparency
      if (!supportsTransparency(toType ?? "jpg")) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      let blob: Blob;
      if (toType === "svg") {
        blob = await canvasToSvgBlob(canvas);
      } else {
        blob = await canvasToBlob(
          canvas,
          outputMime,
          isOutputLossy ? qualityMap[quality] : 1
        );
      }

      setOutSize(blob.size);
      setOutput(URL.createObjectURL(blob));
    } catch (error) {
      console.error("Conversion failed:", error);
      alert("Conversion failed. Please try another format or file.");
    } finally {
      setConverting(false);
    }
  };

  const download = async () => {
    if (!file) return;

    try {
      const img = await loadImageFromFile(file);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;

      if (!supportsTransparency(toType ?? "jpg")) {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      let blob: Blob;
      if (toType === "svg") {
        blob = await canvasToSvgBlob(canvas);
      } else {
        blob = await canvasToBlob(
          canvas,
          outputMime,
          isOutputLossy ? qualityMap[quality] : 1
        );
      }

      downloadBlob(blob, `${getFileNameWithoutExt(file.name)}.${getFileExtension(outputFormat)}`);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again.");
    }
  };

  return (
    <>
      <UploadArea
        onFile={handleFile}
        accept={accept}
        file={file}
        label={`Drop ${(fromType ?? "image").toUpperCase()} here or`}
        sub={`${(fromType ?? "image").toUpperCase()} files supported`}
      />

      {file && (
        <>
          {isOutputLossy && (
            <div style={{ marginBottom: 14 }}>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#475569",
                  marginBottom: 8,
                }}
              >
                Output Quality
              </p>
              <QualitySelector
                quality={quality}
                onChange={(q) => {
                  setQuality(q);
                  setOutput("");
                  setOutSize(0);
                }}
              />
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            <StatCard label="Dimensions" value={`${dims.w}×${dims.h}`} />
            <StatCard label="Original" value={formatBytes(origSize)} />
            {outSize > 0 && (
              <StatCard
                label={`${outputFormat.toUpperCase()} Size`}
                value={formatBytes(outSize)}
              />
            )}
            {outSize > 0 && origSize > outSize && (
              <StatCard
                label="Saved"
                value={`↓${getSavingPercent(origSize, outSize)}%`}
              />
            )}
          </div>

          {!isOutputLossy && toType !== "svg" && (
            <p
              style={{
                fontSize: 13,
                color: "#6366f1",
                marginBottom: 12,
                fontStyle: "italic",
              }}
            >
              {outputFormat.toUpperCase()} is lossless — no quality loss on conversion
            </p>
          )}

          {toType === "svg" && (
            <p
              style={{
                fontSize: 13,
                color: "#f59e0b",
                marginBottom: 12,
                fontStyle: "italic",
              }}
            >
              ⚠ Creating embedded SVG (raster image wrapped in SVG tags). For true vector conversion, use specialized tracing software.
            </p>
          )}

          {!supportsTransparency(toType ?? "jpg") && supportsTransparency(fromType ?? "jpg") && (
            <p
              style={{
                fontSize: 13,
                color: "#f59e0b",
                marginBottom: 12,
                fontStyle: "italic",
              }}
            >
              ⚠ Transparent areas will be replaced with white background
            </p>
          )}

          <button
            onClick={convert}
            disabled={converting}
            style={btnStyle("#6366f1")}
          >
            {converting ? "Converting…" : `Convert to ${outputFormat.toUpperCase()}`}
          </button>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginTop: 20,
            }}
          >
            <PreviewCard
              // label={`Original ${fromType.toUpperCase()}`}
              label={`Original ${(fromType ?? "image").toUpperCase()}`}
              src={preview}
              meta={`${formatBytes(origSize)} · ${dims.w}×${dims.h}px`}
            />
            <PreviewCard
              label={`Converted ${outputFormat.toUpperCase()}`}
              src={output}
              meta={
                output
                  ? `${formatBytes(outSize)} · ${isOutputLossy ? `${quality} quality` : toType === "svg" ? "Embedded SVG" : "Lossless"}`
                  : undefined
              }
              placeholder={
                !output ? `Click "Convert to ${outputFormat.toUpperCase()}"` : undefined
              }
            />
          </div>

          {output && (
            <button
              onClick={download}
              style={{ ...btnStyle("#10b981"), marginTop: 16 }}
            >
              ⬇ Download {outputFormat.toUpperCase()}
            </button>
          )}
        </>
      )}
    </>
  );
}