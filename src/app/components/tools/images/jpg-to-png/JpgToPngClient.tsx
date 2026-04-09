"use client";
import { useState, useRef, useCallback } from "react";
import styles from "../png-to-jpg/page.module.css";
// import { jpgToPngFaqs } from "./faqs";
import { formatBytes, getSavingPercent, loadImageFromFile, canvasToBlob, downloadBlob, getFileNameWithoutExt } from "@/lib/imageUtils";

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

export default function JpgToPngClient() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [output, setOutput] = useState("");
  const [origSize, setOrigSize] = useState(0);
  const [outSize, setOutSize] = useState(0);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [converting, setConverting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    if (!f.type.includes("jpeg") && !f.type.includes("jpg") && !f.type.includes("webp")) return;
    setFile(f); setOrigSize(f.size); setOutput(""); setOutSize(0);
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
      canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const blob = await canvasToBlob(canvas, "image/png", 1);
      setOutSize(blob.size);
      setOutput(URL.createObjectURL(blob));
    } finally { setConverting(false); }
  };

  const download = async () => {
    if (!file) return;
    const img = await loadImageFromFile(file);
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
    canvas.getContext("2d")!.drawImage(img, 0, 0);
    const blob = await canvasToBlob(canvas, "image/png", 1);
    downloadBlob(blob, `${getFileNameWithoutExt(file.name)}.png`);
  };

  return (
    <div className={styles.page}>
       <div className={styles.header}>
        <div className={styles.badge}>Developer Tool</div>
        <h1 className={styles.h1}>JPG to PNG Converter</h1>
        <p className={styles.desc}>
          Convert JPG images to PNG format online. Adjust output quality, preserve transparency with white background, and download instantly.
        </p>
      </div>
      <div className={styles.uploadArea}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        onClick={() => inputRef.current?.click()}
        style={{ borderColor: dragging ? "#22d3ee" : undefined }}
      >
        <input ref={inputRef} type="file" accept="image/jpeg,image/jpg,image/webp" hidden onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
        {!file ? (<>
          <div className={styles.uploadIcon}>🖼️</div>
          <p className={styles.uploadText}>Drop JPG/JPEG/WebP here or <span className={styles.uploadLink}>browse</span></p>
          <p className={styles.uploadSub}>JPG, JPEG, WebP files supported</p>
        </>) : <p className={styles.uploadText}>✓ {file.name} — click to change</p>}
      </div>

      {file && (
        <>
          <div className={styles.controls}>
            <div className={styles.controlGroup}>
              <span className={styles.label}>PNG is lossless — no quality loss on conversion</span>
              <div className={styles.statRow} style={{ marginBottom: 0, marginTop: 6 }}>
                <div className={styles.statCard}><span className={styles.statVal}>{dims.w}×{dims.h}</span><span className={styles.statLabel}>Dimensions</span></div>
                <div className={styles.statCard}><span className={styles.statVal}>{formatBytes(origSize)}</span><span className={styles.statLabel}>Original</span></div>
                {outSize > 0 && <div className={styles.statCard}><span className={styles.statVal}>{formatBytes(outSize)}</span><span className={styles.statLabel}>PNG Size</span></div>}
              </div>
            </div>
            <button className={styles.convertBtn} onClick={convert} disabled={converting}>{converting ? "Converting..." : "Convert to PNG"}</button>
          </div>

          <div className={styles.previewGrid}>
            <div className={styles.previewCard}>
              <div className={styles.previewLabel}>Original JPG</div>
              <img src={preview} alt="original" className={styles.previewImg} />
              <div className={styles.previewMeta}>{formatBytes(origSize)} · {dims.w}×{dims.h}px</div>
            </div>
            <div className={styles.previewCard}>
              <div className={styles.previewLabel}>Converted PNG</div>
              {output ? (<>
                <img src={output} alt="converted" className={styles.previewImg} />
                <div className={styles.previewMeta}>{formatBytes(outSize)} · Lossless · Transparency supported</div>
              </>) : <div className={styles.previewPlaceholder}>Click "Convert to PNG"</div>}
            </div>
          </div>
          {output && <button className={styles.downloadBtn} onClick={download}>⬇ Download PNG</button>}
        </>
      )}

      <hr className={styles.divider} />
      <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
      {/* <div className={styles.faqList}>{jpgToPngFaqs.map((f, i) => <FaqItem key={i} {...f} />)}</div> */}
      <div className={styles.seo}>
        <h2>Why convert JPG to PNG?</h2>
        <p>PNG supports transparency and lossless compression, making it ideal for graphics, logos, and images that need a transparent background. Converting JPG to PNG allows you to layer images and edit without further quality loss.</p>
      </div>
    </div>
  );
}