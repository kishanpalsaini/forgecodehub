"use client";

import { useState } from "react";
import s from "./CssMinifierClient.module.css";




interface CssOptions {
  removeComments: boolean;
  collapseWhitespace: boolean;
  shortenHexColors: boolean;
  removeLastSemicolon: boolean;
  removeZeroUnits: boolean;
}

// Shorten 6-digit hex to 3-digit where possible: #ffffff → #fff
function shortenHex(css: string): string {
  return css.replace(/#([0-9a-fA-F]{6})\b/g, (_, hex) => {
    const r = hex[0], g = hex[2], b = hex[4];
    if (hex[0] === hex[1] && hex[2] === hex[3] && hex[4] === hex[5]) {
      return `#${r}${g}${b}`;
    }
    return `#${hex}`;
  });
}

function minifyCss(css: string, opts: CssOptions): string {
  let result = css;

  // Remove comments
  if (opts.removeComments) {
    result = result.replace(/\/\*[\s\S]*?\*\//g, "");
  }

  // Collapse whitespace
  if (opts.collapseWhitespace) {
    result = result
      .replace(/\s+/g, " ")             // collapse all whitespace
      .replace(/\s*{\s*/g, "{")          // remove spaces around {
      .replace(/\s*}\s*/g, "}")          // remove spaces around }
      .replace(/\s*:\s*/g, ":")          // remove spaces around :
      .replace(/\s*;\s*/g, ";")          // remove spaces around ;
      .replace(/\s*,\s*/g, ",")          // remove spaces after comma
      .trim();
  }

  // Remove zero units: 0px → 0, 0em → 0, 0rem → 0 (but NOT inside keyframe percentages)
  if (opts.removeZeroUnits) {
    result = result.replace(/\b0(px|em|rem|vh|vw|%|pt|cm|mm|in|pc|ex|ch|vmin|vmax)\b/g, "0");
  }

  // Shorten hex colors
  if (opts.shortenHexColors) {
    result = shortenHex(result);
  }

  // Remove last semicolon before }
  if (opts.removeLastSemicolon) {
    result = result.replace(/;}/g, "}");
  }

  return result;
}

const SAMPLE_CSS = `/* Main styles for the homepage */
.container {
  max-width: 1200px;
  margin: 0px auto;
  padding: 0px 20px;
  background-color: #ffffff;
}

/* Header styles */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0px;
  border-bottom: 1px solid #eeeeee;
  color: #333333;
}

.header h1 {
  font-size: 24px;
  font-weight: 700;
  color: #111111;
  margin: 0px;
}

/* Navigation */
.nav a {
  font-size: 14px;
  color: #666666;
  text-decoration: none;
  margin-left: 24px;
  transition: color 0.2s ease;
}

.nav a:hover {
  color: #000000;
}`;

export default function CssMinifierClient() {
  const [input, setInput] = useState(SAMPLE_CSS);
  const [options, setOptions] = useState<CssOptions>({
    removeComments: true,
    collapseWhitespace: true,
    shortenHexColors: true,
    removeLastSemicolon: true,
    removeZeroUnits: true,
  });
  const [copied, setCopied] = useState(false);

  const output = input.trim() ? minifyCss(input, options) : "";

  const updateOption = (key: keyof CssOptions, val: boolean) => {
    setOptions((prev) => ({ ...prev, [key]: val }));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/css" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "minified.css";
    a.click();
  };

  const originalSize = new Blob([input]).size;
  const minifiedSize = new Blob([output]).size;
  const savings = originalSize > 0 ? Math.round(((originalSize - minifiedSize) / originalSize) * 100) : 0;
  const removed = originalSize - minifiedSize;

  const optionLabels: Record<keyof CssOptions, string> = {
    removeComments: "Remove comments",
    collapseWhitespace: "Collapse whitespace",
    shortenHexColors: "Shorten hex colors (#ffffff → #fff)",
    removeLastSemicolon: "Remove last semicolon",
    removeZeroUnits: "Remove zero units (0px → 0)",
  };

  return (
    <div className={s.page}>
      <div className={s.header}>
        <div className={s.badge}>Developer Tool</div>
        <h1 className={s.h1}>CSS Minifier & Compressor</h1>
        <p className={s.desc}>
          Compress and optimize your CSS by removing whitespace, comments, and shortening values. Reduce file size for faster websites.
        </p>
      </div>

      {/* Stats */}
      {input && (
        <div className={s.statsRow}>
          <div className={s.stat}><span className={s.statVal}>{originalSize.toLocaleString()}B</span><span className={s.statLabel}>original</span></div>
          <div className={s.stat}><span className={s.statVal}>{minifiedSize.toLocaleString()}B</span><span className={s.statLabel}>minified</span></div>
          <div className={s.stat}>
            <span className={s.statVal} style={{ color: savings > 0 ? "#15803d" : "#6b7280" }}>-{savings}%</span>
            <span className={s.statLabel}>saved</span>
          </div>
          <div className={s.stat}><span className={s.statVal}>{removed >= 0 ? removed.toLocaleString() : 0}B</span><span className={s.statLabel}>removed</span></div>
        </div>
      )}

      {/* Savings bar */}
      {input && savings > 0 && (
        <div className={s.savingsBar}>
          <div className={s.savingsBarFill} style={{ width: `${savings}%` }} />
          <span className={s.savingsBarLabel}>{savings}% reduction</span>
        </div>
      )}

      {/* Options */}
      <div className={s.optionsCard}>
        <span className={s.optionsTitle}>Options</span>
        <div className={s.optionsGrid}>
          {(Object.keys(options) as (keyof CssOptions)[]).map((key) => (
            <label key={key} className={s.checkLabel}>
              <input
                type="checkbox"
                checked={options[key]}
                onChange={(e) => updateOption(key, e.target.checked)}
              />
              <span>{optionLabels[key]}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={s.panels}>
        <div className={s.panel}>
          <div className={s.panelHeader}>
            <span className={s.panelTitle}>Original CSS</span>
            <div className={s.panelActions}>
              <button className={s.actionBtn} onClick={() => setInput(SAMPLE_CSS)}>Sample</button>
              <button className={s.actionBtn} onClick={() => setInput("")}>Clear</button>
            </div>
          </div>
          <textarea
            className={s.textarea}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your CSS here..."
            spellCheck={false}
          />
        </div>

        <div className={s.panel}>
          <div className={s.panelHeader}>
            <span className={s.panelTitle}>Minified CSS</span>
            <div className={s.panelActions}>
              <button className={s.actionBtn} onClick={handleCopy} disabled={!output}>{copied ? "Copied!" : "Copy"}</button>
              <button className={s.actionBtn} onClick={handleDownload} disabled={!output}>Download</button>
            </div>
          </div>
          <div className={s.outputBox}>
            {output || <span className={s.placeholder}>Minified output will appear here...</span>}
          </div>
        </div>
      </div>

      <section className={s.seoSection}>
        <h2>What is CSS Minification?</h2>
        <p>
          CSS minification removes all unnecessary characters from your stylesheet without affecting how it works
          in the browser — comments, whitespace, redundant semicolons, and long hex color values are optimized.
          This reduces the CSS file size, which means browsers download and parse it faster.
        </p>
        <h2>CSS Minification vs CSS Compression</h2>
        <p>
          Minification modifies the raw CSS source to make it smaller. Compression (like Gzip or Brotli) is
          an additional step applied by your web server. You should do both: minify first, then let your server
          compress the already-minified file for maximum performance.
        </p>
      </section>

    </div>
  );
}