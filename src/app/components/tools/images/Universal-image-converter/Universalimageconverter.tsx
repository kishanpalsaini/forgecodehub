"use client";
import { Styles } from "docx";
import { useState, useRef, useCallback } from "react";
import styles from "../png-to-jpg/page.module.css";


// ─── Types ───────────────────────────────────────────────────────────────────
type ConvertFrom = "jpg" | "png" | "webp";
type ConvertTo = "jpg" | "png" | "pdf" | "rotate";
type Quality = "low" | "medium" | "high";
type PageSize = "a4" | "letter" | "a3";
type Orientation = "portrait" | "landscape";

const qualityMap: Record<Quality, number> = {
  low: 0.5,
  medium: 0.75,
  high: 0.95,
};
const PAGE_SIZES: Record<PageSize, [number, number]> = {
  a4: [595.28, 841.89],
  letter: [612, 792],
  a3: [841.89, 1190.55],
};

const FROM_OPTIONS: { value: ConvertFrom; label: string }[] = [
  { value: "jpg", label: "JPG / JPEG" },
  { value: "png", label: "PNG" },
  { value: "webp", label: "WebP" },
];

const TO_OPTIONS: { value: ConvertTo; label: string }[] = [
  { value: "png", label: "→ PNG" },
  { value: "jpg", label: "→ JPG" },
  { value: "pdf", label: "→ PDF" },
  { value: "rotate", label: "Rotate / Flip" },
];

// ─── FAQ Data ─────────────────────────────────────────────────────────────────
const ALL_FAQS: Record<string, { question: string; answer: string }[]> = {
  "jpg-png": [
    {
      question: "Does converting JPG to PNG lose quality?",
      answer:
        "No. PNG is a lossless format. Once you convert a JPG to PNG, no further quality is lost — though the original JPG compression artifacts are baked in.",
    },
    {
      question: "Why is the PNG file larger than my JPG?",
      answer:
        "PNG uses lossless compression while JPG uses lossy compression. A lossless PNG stores every pixel exactly, resulting in a larger file.",
    },
    {
      question: "Does PNG support transparency?",
      answer:
        "Yes! PNG supports an alpha channel, making it ideal for logos, icons, and overlays on different backgrounds.",
    },
    {
      question: "Is this conversion done on my device?",
      answer:
        "Yes. Everything happens in your browser using the Canvas API. No image is uploaded to any server.",
    },
  ],
  "png-jpg": [
    {
      question: "Will converting PNG to JPG lose quality?",
      answer:
        "Some quality loss occurs because JPG uses lossy compression. Using 'High' quality minimises visible differences.",
    },
    {
      question: "What happens to transparent areas?",
      answer:
        "PNG transparency is replaced with a white background, since JPG does not support alpha channels.",
    },
    {
      question: "How much smaller will the JPG be?",
      answer:
        "Photographs typically shrink 60–80%. Simple graphics with flat colours may not shrink as much.",
    },
    {
      question: "Can I convert back to PNG after?",
      answer:
        "Yes, but each conversion cycle from JPG → PNG → JPG introduces more compression artefacts. Start from the original PNG whenever possible.",
    },
  ],
  "to-pdf": [
    {
      question: "How many images can I add?",
      answer:
        "Up to 20 images per PDF. Each image becomes one page in the resulting document.",
    },
    {
      question: "What page sizes are supported?",
      answer:
        "A4 (international standard), US Letter (American standard), and A3 (large format) are all supported in portrait or landscape orientation.",
    },
    {
      question: "Are my images uploaded to a server?",
      answer:
        "No. The PDF is generated entirely in your browser using jsPDF. Nothing leaves your device.",
    },
    {
      question: "What image formats are accepted?",
      answer:
        "JPG, PNG, and WebP files are all accepted. You can mix different formats in the same PDF.",
    },
  ],
  rotate: [
    {
      question: "What image formats can I rotate?",
      answer:
        "Any common image format is supported: JPG, PNG, WebP, GIF, and more.",
    },
    {
      question: "Can I rotate by any angle, not just 90°?",
      answer:
        "Yes. The free-rotate slider lets you pick any angle from 0° to 359°.",
    },
    {
      question: "What is the difference between flip and rotate?",
      answer:
        "Rotate turns the image around its centre. Flip mirrors it — horizontal flip creates a mirror image, vertical flip turns it upside down.",
    },
    {
      question: "Which output format should I choose?",
      answer:
        "Choose PNG if the original had transparency or you need lossless output. Choose JPG for smaller file sizes with photographs.",
    },
  ],
};

// ─── Utilities ────────────────────────────────────────────────────────────────
function formatBytes(b: number) {
  if (b < 1024) return b + " B";
  if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
  return (b / 1048576).toFixed(1) + " MB";
}
function getFileNameWithoutExt(name: string) {
  return name.replace(/\.[^/.]+$/, "");
}
function getSavingPercent(orig: number, out: number) {
  return Math.max(0, Math.round((1 - out / orig) * 100));
}
function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
function canvasToBlob(
  canvas: HTMLCanvasElement,
  mime: string,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
      mime,
      quality,
    ),
  );
}
function downloadBlob(blob: Blob, name: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function FaqItem({ question, answer }: { question: string; answer: string }) {
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

function StatCard({ label, value }: { label: string; value: string }) {
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

function QualitySelector({
  quality,
  onChange,
}: {
  quality: Quality;
  onChange: (q: Quality) => void;
}) {
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
          }}
        >
          {q.charAt(0).toUpperCase() + q.slice(1)}
        </button>
      ))}
    </div>
  );
}

// ─── Upload Area ──────────────────────────────────────────────────────────────
function UploadArea({
  onFile,
  multiple,
  accept,
  file,
  files,
  icon,
  label,
  sub,
}: {
  onFile?: (f: File) => void;
  multiple?: boolean;
  accept?: string;
  file?: File | null;
  files?: File[];
  icon?: string;
  label?: string;
  sub?: string;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = (fList: FileList | null) => {
    if (!fList) return;
    if (multiple && onFile) Array.from(fList).forEach((f) => onFile(f));
    else if (onFile && fList[0]) onFile(fList[0]);
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
          ✓ {count > 1 ? `${count} files selected` : firstName} — click to
          change
        </p>
      )}
    </div>
  );
}

// ─── Converter: JPG / WebP → PNG ──────────────────────────────────────────────
function ToPngConverter({ fromType }: { fromType: ConvertFrom }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [output, setOutput] = useState("");
  const [origSize, setOrigSize] = useState(0);
  const [outSize, setOutSize] = useState(0);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [converting, setConverting] = useState(false);

  const accept =
    fromType === "jpg"
      ? "image/jpeg,image/jpg"
      : fromType === "webp"
        ? "image/webp"
        : "image/*";

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setOrigSize(f.size);
    setOutput("");
    setOutSize(0);
    const url = URL.createObjectURL(f);
    setPreview(url);
    const img = new Image();
    img.onload = () => setDims({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = url;
  }, []);

  const convert = async () => {
    if (!file) return;
    setConverting(true);
    try {
      const img = await loadImageFromFile(file);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d")!.drawImage(img, 0, 0);
      const blob = await canvasToBlob(canvas, "image/png", 1);
      setOutSize(blob.size);
      setOutput(URL.createObjectURL(blob));
    } finally {
      setConverting(false);
    }
  };

  const download = async () => {
    if (!file) return;
    const img = await loadImageFromFile(file);
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext("2d")!.drawImage(img, 0, 0);
    const blob = await canvasToBlob(canvas, "image/png", 1);
    downloadBlob(blob, `${getFileNameWithoutExt(file.name)}.png`);
  };

  return (
    <>
      <UploadArea
        onFile={handleFile}
        accept={accept}
        file={file}
        label={`Drop ${fromType.toUpperCase()} here or`}
        sub={`${fromType.toUpperCase()} files supported`}
      />

      {file && (
        <>
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
              <StatCard label="PNG Size" value={formatBytes(outSize)} />
            )}
          </div>
          <p
            style={{
              fontSize: 13,
              color: "#6366f1",
              marginBottom: 12,
              fontStyle: "italic",
            }}
          >
            PNG is lossless — no quality loss on conversion
          </p>
          <button
            onClick={convert}
            disabled={converting}
            style={btnStyle("#6366f1")}
          >
            {converting ? "Converting…" : "Convert to PNG"}
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
              label={`Original ${fromType.toUpperCase()}`}
              src={preview}
              meta={`${formatBytes(origSize)} · ${dims.w}×${dims.h}px`}
            />
            <PreviewCard
              label="Converted PNG"
              src={output}
              meta={
                output
                  ? `${formatBytes(outSize)} · Lossless · Transparency supported`
                  : undefined
              }
              placeholder={!output ? 'Click "Convert to PNG"' : undefined}
            />
          </div>
          {output && (
            <button
              onClick={download}
              style={{ ...btnStyle("#10b981"), marginTop: 16 }}
            >
              ⬇ Download PNG
            </button>
          )}
        </>
      )}
    </>
  );
}

// ─── Converter: PNG / WebP → JPG ──────────────────────────────────────────────
function ToJpgConverter({ fromType }: { fromType: ConvertFrom }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [output, setOutput] = useState("");
  const [quality, setQuality] = useState<Quality>("high");
  const [origSize, setOrigSize] = useState(0);
  const [outSize, setOutSize] = useState(0);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [converting, setConverting] = useState(false);

  const accept =
    fromType === "png"
      ? "image/png"
      : fromType === "webp"
        ? "image/webp"
        : "image/jpeg,image/jpg";

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setOrigSize(f.size);
    setOutput("");
    setOutSize(0);
    const url = URL.createObjectURL(f);
    setPreview(url);
    const img = new Image();
    img.onload = () => setDims({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = url;
  }, []);

  const doConvert = async (q: Quality) => {
    if (!file) return;
    setConverting(true);
    try {
      const img = await loadImageFromFile(file);
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const blob = await canvasToBlob(canvas, "image/jpeg", qualityMap[q]);
      setOutSize(blob.size);
      setOutput(URL.createObjectURL(blob));
    } finally {
      setConverting(false);
    }
  };

  const convert = () => doConvert(quality);

  const download = async () => {
    if (!file) return;
    const img = await loadImageFromFile(file);
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    const blob = await canvasToBlob(canvas, "image/jpeg", qualityMap[quality]);
    downloadBlob(blob, `${getFileNameWithoutExt(file.name)}.jpg`);
  };

  return (
    <>
      <UploadArea
        onFile={handleFile}
        accept={accept}
        file={file}
        label={`Drop ${fromType.toUpperCase()} here or`}
        sub={`${fromType.toUpperCase()} files supported`}
      />

      {file && (
        <>
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
              <StatCard label="JPG Size" value={formatBytes(outSize)} />
            )}
            {outSize > 0 && (
              <StatCard
                label="Saved"
                value={`↓${getSavingPercent(origSize, outSize)}%`}
              />
            )}
          </div>
          <button
            onClick={convert}
            disabled={converting}
            style={btnStyle("#6366f1")}
          >
            {converting ? "Converting…" : "Convert to JPG"}
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
              label={`Original ${fromType.toUpperCase()}`}
              src={preview}
              meta={`${formatBytes(origSize)} · ${dims.w}×${dims.h}px`}
            />
            <PreviewCard
              label="Converted JPG"
              src={output}
              meta={
                output
                  ? `${formatBytes(outSize)} · ↓${getSavingPercent(origSize, outSize)}% smaller`
                  : undefined
              }
              placeholder={!output ? 'Click "Convert to JPG"' : undefined}
            />
          </div>
          {output && (
            <button
              onClick={download}
              style={{ ...btnStyle("#10b981"), marginTop: 16 }}
            >
              ⬇ Download JPG
            </button>
          )}
        </>
      )}
    </>
  );
}

// ─── Converter: Images → PDF ──────────────────────────────────────────────────
function ToPdfConverter() {
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
        await new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
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
              "FAST",
            );
            URL.revokeObjectURL(url);
            resolve();
          };
          img.src = url;
        });
      }
      pdf.save(`images-to-pdf-${Date.now()}.pdf`);
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
        sub="JPG, PNG, WebP — up to 20 images · Each becomes one PDF page"
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

// ─── Rotate / Flip ────────────────────────────────────────────────────────────
function RotateConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [output, setOutput] = useState("");
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [quality, setQuality] = useState<Quality>("high");
  const [format, setFormat] = useState<"jpg" | "png">("jpg");
  const [origSize, setOrigSize] = useState(0);
  const [outSize, setOutSize] = useState(0);
  const [processing, setProcessing] = useState(false);

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) return;
    setFile(f);
    setOrigSize(f.size);
    setOutput("");
    setOutSize(0);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setPreview(URL.createObjectURL(f));
  }, []);

  const apply = async (
    rot: number,
    fH: boolean,
    fV: boolean,
    fmt: "jpg" | "png",
    q: Quality,
  ) => {
    if (!file) return;
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
      if (fmt === "jpg") {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, cw, ch);
      }
      ctx.translate(cw / 2, ch / 2);
      ctx.rotate(rad);
      ctx.scale(fH ? -1 : 1, fV ? -1 : 1);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
      const blob = await canvasToBlob(
        canvas,
        fmt === "png" ? "image/png" : "image/jpeg",
        qualityMap[q],
      );
      setOutSize(blob.size);
      setOutput(URL.createObjectURL(blob));
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
    if (!file) return;
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
    if (format === "jpg") {
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, cw, ch);
    }
    ctx.translate(cw / 2, ch / 2);
    ctx.rotate(rad);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
    const blob = await canvasToBlob(
      canvas,
      format === "png" ? "image/png" : "image/jpeg",
      qualityMap[quality],
    );
    downloadBlob(blob, `${getFileNameWithoutExt(file.name)}_rotated.${format}`);
  };

  return (
    <>
      <UploadArea
        onFile={handleFile}
        accept="image/*"
        file={file}
        icon="🔄"
        label="Drop image here or"
        sub="JPG, PNG, WebP supported"
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
              <div style={{ display: "flex", gap: 6 }}>
                <button
                  onClick={() => setFormat("jpg")}
                  style={toggleStyle(format === "jpg")}
                >
                  JPG
                </button>
                <button
                  onClick={() => setFormat("png")}
                  style={toggleStyle(format === "png")}
                >
                  PNG
                </button>
              </div>
            </div>
            <div>
              <p style={labelStyle}>Quality</p>
              <QualitySelector quality={quality} onChange={setQuality} />
            </div>
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

// ─── Preview Card ─────────────────────────────────────────────────────────────
function PreviewCard({
  label,
  src,
  meta,
  placeholder,
}: {
  label: string;
  src?: string;
  meta?: string;
  placeholder?: string;
}) {
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

// ─── Style helpers ────────────────────────────────────────────────────────────
const btnStyle = (color: string): React.CSSProperties => ({
  background: color,
  color: "#fff",
  border: "none",
  borderRadius: 10,
  padding: "12px 28px",
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
  width: "100%",
});
const labelStyle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  marginBottom: 6,
  marginTop: 0,
};
const toggleStyle = (active: boolean): React.CSSProperties => ({
  padding: "6px 14px",
  borderRadius: 8,
  fontSize: 13,
  cursor: "pointer",
  fontWeight: active ? 600 : 400,
  border: active ? "2px solid #6366f1" : "1px solid #e2e8f0",
  background: active ? "#eef2ff" : "#fff",
  color: active ? "#4338ca" : "#475569",
});
const iconBtnStyle: React.CSSProperties = {
  padding: "6px 12px",
  borderRadius: 8,
  fontSize: 13,
  cursor: "pointer",
  border: "1px solid #e2e8f0",
  background: "#fff",
  color: "#475569",
};

// ─── FAQ key helper ───────────────────────────────────────────────────────────
function getFaqKey(from: ConvertFrom, to: ConvertTo): string {
  if (to === "png") return "jpg-png";
  if (to === "jpg") return "png-jpg";
  if (to === "pdf") return "to-pdf";
  return "rotate";
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function UniversalImageConverter() {
  const [from, setFrom] = useState<ConvertFrom>("jpg");
  const [to, setTo] = useState<ConvertTo>("png");

  // Reset converter when dropdowns change
  const [key, setKey] = useState(0);
  const handleFrom = (v: ConvertFrom) => {
    setFrom(v);
    setKey((k) => k + 1);
  };
  const handleTo = (v: ConvertTo) => {
    setTo(v);
    setKey((k) => k + 1);
  };

  const faqKey = getFaqKey(from, to);
  const faqs = ALL_FAQS[faqKey] ?? [];

  // Determine valid "to" options based on "from"
  // All from types can go to all to types; no restrictions needed

  const renderConverter = () => {
    if (to === "png") return <ToPngConverter key={key} fromType={from} />;
    if (to === "jpg") return <ToJpgConverter key={key} fromType={from} />;
    if (to === "pdf") return <ToPdfConverter key={key} />;
    if (to === "rotate") return <RotateConverter key={key} />;
    return null;
  };

  return (
    <div
      style={{
        margin: "0 auto",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        color: "#1e293b",
        padding: "40px 20px",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "12px",
            padding: "4px 12px",
            borderRadius: "99px",
            background: "rgba(34, 211, 238, 0.08)",
            color: "#22d3ee",
            marginBottom: 12,
            fontWeight: 500,
            border: "1px solid rgba(34, 211, 238, 0.18)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Developer Tool
        </div>
        <h1
          style={{
            fontSize: "clamp(1.4rem, 3vw, 2rem)",
            fontWeight: 700,
            color: "#f1f5f9",
            letterSpacing: "-0.025em",
            marginBottom: "0.4rem",
          }}
        >
          Universal Image Converter
        </h1>
        <p
          style={{
            fontSize: "15px",
            color: "#64748b",
            lineHeight: 1.6,
          }}
        >
          Convert, rotate, and transform images — all in your browser
        </p>
      </div>
    

      {/* Conversion Selectors */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: 16,
          padding: 24,
          marginBottom: 24,
          maxWidth:"50%",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 160 }}>
            <label style={labelStyle}>Convert From</label>
            <select
              value={from}
              onChange={(e) => handleFrom(e.target.value as ConvertFrom)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                fontSize: 15,
                color: "#1e293b",
                background: "#fafbff",
                cursor: "pointer",
                appearance: "none",
              }}
            >
              {FROM_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div style={{ fontSize: 24, color: "#c7d2fe", paddingTop: 18 }}>
            →
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <label style={labelStyle}>Convert To</label>
            <select
              value={to}
              onChange={(e) => handleTo(e.target.value as ConvertTo)}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                fontSize: 15,
                color: "#1e293b",
                background: "#fafbff",
                cursor: "pointer",
                appearance: "none",
              }}
            >
              {TO_OPTIONS.filter((o) => !(o.value === from)).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Active Converter */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #e2e8f0",
          borderRadius: 16,
          padding: 24,
          marginBottom: 24,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        {renderConverter()}
      </div>

      {/* FAQ */}
      <div className={styles.seo}>
  {faqs.map((f, i) => (
    <div key={i}>
      <h2>{f.question}</h2>
      <p>{f.answer}</p>
    </div>
  ))}
</div>
    </div>
  );
}
