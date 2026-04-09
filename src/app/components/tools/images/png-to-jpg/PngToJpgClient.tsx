"use client";
import { useState, useRef, useCallback } from "react";
import styles from "./page.module.css";
// import { pngToJpgFaqs } from "./faqs";
import { Quality, qualityMap, formatBytes, getSavingPercent, loadImageFromFile, canvasToBlob, downloadBlob, getFileNameWithoutExt } from "@/lib/imageUtils";

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.faqItem}>
      <button className={styles.faqQ} onClick={() => setOpen(o => !o)}>
        <span>{question}</span><span className={open ? styles.chevronOpen : styles.chevron}>▼</span>
      </button>
      {open && <p className={styles.faqA}>{answer}</p>}
    </div>
  );
}

export default function PngToJpgClient() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [quality, setQuality] = useState<Quality>("high");
  const [origSize, setOrigSize] = useState(0);
  const [outSize, setOutSize] = useState(0);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [converting, setConverting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    if (!f.type.includes("png")) return;
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const convert = async () => {
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
      const blob = await canvasToBlob(canvas, "image/jpeg", qualityMap[quality]);
      setOutSize(blob.size);
      const url = URL.createObjectURL(blob);
      setOutput(url);
    } finally { setConverting(false); }
  };

  const download = async () => {
    if (!file || !output) return;
    const img = await loadImageFromFile(file);
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    const blob = await canvasToBlob(canvas, "image/jpeg", qualityMap[quality]);
    downloadBlob(blob, `${getFileNameWithoutExt(file.name)}.jpg`);
  };

  return (
    <div className={styles.page}>

          <div className={styles.header}>
        <div className={styles.badge}>Developer Tool</div>
        <h1 className={styles.h1}>PNG to JPG Converter</h1>
        <p className={styles.desc}>
          Convert PNG images to JPG format online. Adjust output quality, preserve transparency with white background, and download instantly.
        </p>
      </div>
      <div className={styles.uploadArea}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        style={{ borderColor: dragging ? "#22d3ee" : undefined }}
      >
        <input ref={inputRef} type="file" accept="image/png" hidden onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        {!file ? (
          <>
            <div className={styles.uploadIcon}>🖼️</div>
            <p className={styles.uploadText}>Drop PNG here or <span className={styles.uploadLink}>browse</span></p>
            <p className={styles.uploadSub}>PNG files only</p>
          </>
        ) : (
          <p className={styles.uploadText}>✓ {file.name} — click to change</p>
        )}
      </div>

      {file && (
        <>
          <div className={styles.controls}>
            <div className={styles.controlGroup}>
              <label className={styles.label}>Output Quality</label>
              <div className={styles.qualityBtns}>
                {(["low","medium","high"] as Quality[]).map(q => (
                  <button key={q} className={`${styles.qualityBtn} ${quality === q ? styles.qualityActive : ""}`} onClick={() => { setQuality(q); setOutput(""); setOutSize(0); }}>
                    {q.charAt(0).toUpperCase() + q.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <button className={styles.convertBtn} onClick={convert} disabled={converting}>
              {converting ? "Converting..." : "Convert to JPG"}
            </button>
          </div>

          <div className={styles.previewGrid}>
            <div className={styles.previewCard}>
              <div className={styles.previewLabel}>Original PNG</div>
              <img src={preview} alt="original" className={styles.previewImg} />
              <div className={styles.previewMeta}>{formatBytes(origSize)} · {dims.w}×{dims.h}px</div>
            </div>
            <div className={styles.previewCard}>
              <div className={styles.previewLabel}>Converted JPG</div>
              {output ? (
                <>
                  <img src={output} alt="converted" className={styles.previewImg} />
                  <div className={styles.previewMeta}>
                    {formatBytes(outSize)} · <span className={styles.saving}>↓{getSavingPercent(origSize, outSize)}% smaller</span>
                  </div>
                </>
              ) : (
                <div className={styles.previewPlaceholder}>Click "Convert to JPG"</div>
              )}
            </div>
          </div>

          {output && (
            <button className={styles.downloadBtn} onClick={download}>⬇ Download JPG</button>
          )}
        </>
      )}

      <hr className={styles.divider} />
      <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
      {/* <div className={styles.faqList}>{pngToJpgFaqs.map((f, i) => <FaqItem key={i} {...f} />)}</div> */}

      <div className={styles.seo}>
        <h2>How to convert PNG to JPG</h2>
        <p>Upload your PNG file, select a quality level, click Convert, then download your JPG. The entire process runs in your browser — no upload to any server.</p>
        <h2>Why convert PNG to JPG?</h2>
        <p>JPG files are significantly smaller than PNG for photographs. Converting reduces page load times, storage costs, and bandwidth usage while maintaining visually acceptable quality.</p>
      </div>
    </div>
  );
}