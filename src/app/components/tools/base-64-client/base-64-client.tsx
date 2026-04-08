"use client";

import { useState, useRef } from "react";
import s from "./base-64-client.module.css";
// import Faq from "./Faq";
import ToolFaq from "../faq/ToolFaq";
import { onlineNotepadFaqs } from "@/lib/faqs";


type Mode = "encode" | "decode";

function toBase64Safe(str: string): string {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch {
    throw new Error("Failed to encode. Input may contain invalid characters.");
  }
}

function fromBase64Safe(str: string): string {
  try {
    return decodeURIComponent(escape(atob(str.trim())));
  } catch {
    throw new Error("Invalid Base64 string. Please check your input.");
  }
}

function toUrlSafeBase64(str: string): string {
  return toBase64Safe(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

export default function Base64Client() {
  const [mode, setMode] = useState<Mode>("encode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [urlSafe, setUrlSafe] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const process = (value: string, m: Mode = mode, safe: boolean = urlSafe) => {
    setInput(value);
    setImagePreview(null);
    if (!value.trim()) { setOutput(""); setError(null); return; }
    try {
      if (m === "encode") {
        const result = safe ? toUrlSafeBase64(value) : toBase64Safe(value);
        setOutput(result);
      } else {
        const result = fromBase64Safe(value);
        setOutput(result);
        // Try to detect image
        const cleaned = value.replace(/\s/g, "");
        if (/^(data:image)/.test(result) || /^iVBOR|\/9j\/|R0lGO/.test(cleaned)) {
          setImagePreview(`data:image/png;base64,${cleaned}`);
        }
      }
      setError(null);
    } catch (e: unknown) {
      setOutput("");
      setError(e instanceof Error ? e.message : "An error occurred");
    }
  };

  const handleModeSwitch = (m: Mode) => {
    setMode(m);
    setInput("");
    setOutput("");
    setError(null);
    setImagePreview(null);
    setFileName(null);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const base64 = dataUrl.split(",")[1];
      setInput(base64 || "");
      // If encoding mode, just show the base64
      if (mode === "encode") {
        setOutput(urlSafe ? base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "") : base64);
      }
      // Preview if image
      if (file.type.startsWith("image/")) {
        setImagePreview(dataUrl);
      }
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const handleSwap = () => {
    const newMode: Mode = mode === "encode" ? "decode" : "encode";
    handleModeSwitch(newMode);
    setInput(output);
    process(output, newMode, urlSafe);
  };

  const stats = output
    ? { inputSize: new Blob([input]).size, outputSize: new Blob([output]).size }
    : null;

  return (
    <div className={s.page}>
      <div className={s.header}>
        <div className={s.badge}>Developer Tool</div>
        <h1 className={s.h1}>Base64 Encoder & Decoder</h1>
        <p className={s.desc}>
          Encode text or files to Base64, decode Base64 strings back to text. Supports UTF-8 and URL-safe mode.
        </p>
      </div>

      {/* Mode switcher */}
      <div className={s.modeSwitch}>
        <button
          className={`${s.modeBtn} ${mode === "encode" ? s.modeBtnActive : ""}`}
          onClick={() => handleModeSwitch("encode")}
        >
          Encode → Base64
        </button>
        <button
          className={`${s.modeBtn} ${mode === "decode" ? s.modeBtnActive : ""}`}
          onClick={() => handleModeSwitch("decode")}
        >
          Decode → Text
        </button>
      </div>

      {/* Options */}
      <div className={s.optionsRow}>
        <label className={s.checkLabel}>
          <input
            type="checkbox"
            checked={urlSafe}
            onChange={(e) => {
              setUrlSafe(e.target.checked);
              if (input) process(input, mode, e.target.checked);
            }}
          />
          URL-safe Base64 (RFC 4648)
        </label>
        {mode === "encode" && (
          <div>
            <input
              ref={fileRef}
              type="file"
              className={s.fileInput}
              onChange={handleFile}
              accept="*/*"
            />
            <button className={s.fileBtn} onClick={() => fileRef.current?.click()}>
              Upload File
            </button>
            {fileName && <span className={s.fileName}>{fileName}</span>}
          </div>
        )}
      </div>

      {/* Stats */}
      {stats && (
        <div className={s.statsRow}>
          <div className={s.stat}><span className={s.statVal}>{stats.inputSize}B</span><span className={s.statLabel}>input size</span></div>
          <div className={s.stat}><span className={s.statVal}>{stats.outputSize}B</span><span className={s.statLabel}>output size</span></div>
          <div className={s.stat}>
            <span className={s.statVal}>
              {Math.round((stats.outputSize / stats.inputSize) * 100)}%
            </span>
            <span className={s.statLabel}>ratio</span>
          </div>
        </div>
      )}

      <div className={s.panels}>
        <div className={s.panel}>
          <div className={s.panelHeader}>
            <span className={s.panelTitle}>{mode === "encode" ? "Plain Text" : "Base64 String"}</span>
            <div className={s.panelActions}>
              <button className={s.actionBtn} onClick={() => { setInput(""); setOutput(""); setError(null); setImagePreview(null); }}>Clear</button>
            </div>
          </div>
          <textarea
            className={s.textarea}
            value={input}
            onChange={(e) => process(e.target.value)}
            placeholder={mode === "encode" ? "Enter text to encode..." : "Paste Base64 string to decode..."}
            spellCheck={false}
          />
          {error && <div className={s.errorBox}>⚠ {error}</div>}
        </div>

        {/* Swap button */}
        <div className={s.swapCol}>
          <button className={s.swapBtn} onClick={handleSwap} title="Swap input and output">⇄</button>
        </div>

        <div className={s.panel}>
          <div className={s.panelHeader}>
            <span className={s.panelTitle}>{mode === "encode" ? "Base64 Output" : "Decoded Text"}</span>
            <div className={s.panelActions}>
              <button className={s.actionBtn} onClick={handleCopy} disabled={!output}>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          <div className={s.outputBox}>
            {output || <span className={s.placeholder}>Output will appear here...</span>}
          </div>
          {imagePreview && (
            <div className={s.imagePreview}>
              <p className={s.previewLabel}>Image Preview</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagePreview} alt="Base64 decoded preview" className={s.previewImg} />
            </div>
          )}
        </div>
      </div>

      <section className={s.seoSection}>
        <h2>What is Base64 Encoding?</h2>
        <p>
          Base64 is a binary-to-text encoding scheme that converts binary data into an ASCII string format.
          It is commonly used to encode binary data — such as images, files, or credentials — for safe
          transmission over text-based protocols like HTTP, email (MIME), or JSON.
        </p>
        <h2>When to use URL-safe Base64?</h2>
        <p>
          Standard Base64 uses <code>+</code> and <code>/</code> characters that have special meaning in URLs.
          URL-safe Base64 (RFC 4648) replaces these with <code>-</code> and <code>_</code>, making the
          encoded string safe to use directly in URLs and filenames without percent-encoding.
        </p>
      </section>

    </div>
  );
}