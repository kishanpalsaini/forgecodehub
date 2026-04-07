"use client";

import { useState, useCallback } from "react";
import s from "./HtmlMinifierClient.module.css";



interface MinifyOptions {
  removeComments: boolean;
  collapseWhitespace: boolean;
  removeAttributeQuotes: boolean;
  removeEmptyAttributes: boolean;
  removeOptionalTags: boolean;
}

// Client-side HTML minifier (no npm needed in browser)
function minifyHtml(html: string, opts: MinifyOptions): string {
  let result = html;

  // Remove HTML comments (but not conditional comments like <!--[if IE]>)
  if (opts.removeComments) {
    result = result.replace(/<!--(?!\[if\s)[\s\S]*?-->/gi, "");
  }

  // Collapse whitespace between tags
  if (opts.collapseWhitespace) {
    result = result
      .replace(/\s+/g, " ")                         // collapse all whitespace to single space
      .replace(/>\s+</g, "><")                        // remove space between tags
      .replace(/\s+>/g, ">")                          // remove space before >
      .replace(/<\s+/g, "<")                          // remove space after <
      .trim();
  }

  // Remove quotes from attributes where safe (single word values)
  if (opts.removeAttributeQuotes) {
    result = result.replace(/="([^"'\s>\/=]+)"/g, "=$1");
  }

  // Remove empty attributes
  if (opts.removeEmptyAttributes) {
    result = result.replace(/\s+(?:class|id|style|title|alt|lang|dir)=""/g, "");
  }

  // Remove optional closing tags: </li>, </td>, </th>, </p>, </dt>, </dd>, </option>
  if (opts.removeOptionalTags) {
    result = result.replace(/<\/(li|td|th|p|dt|dd|option)>/gi, "");
  }

  return result;
}

const SAMPLE_HTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Meta tags -->
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Page</title>
  </head>
  <body>
    <!-- Header section -->
    <header class="header">
      <h1>Hello, World!</h1>
      <p>Welcome to my website.</p>
    </header>
    <main>
      <ul>
        <li>Item one</li>
        <li>Item two</li>
        <li>Item three</li>
      </ul>
    </main>
  </body>
</html>`;

export default function HtmlMinifierClient() {
  const [input, setInput] = useState(SAMPLE_HTML);
  const [output, setOutput] = useState(() => minifyHtml(SAMPLE_HTML, {
    removeComments: true,
    collapseWhitespace: true,
    removeAttributeQuotes: false,
    removeEmptyAttributes: true,
    removeOptionalTags: false,
  }));
  const [options, setOptions] = useState<MinifyOptions>({
    removeComments: true,
    collapseWhitespace: true,
    removeAttributeQuotes: false,
    removeEmptyAttributes: true,
    removeOptionalTags: false,
  });
  const [copied, setCopied] = useState(false);

  const process = useCallback((html: string, opts: MinifyOptions = options) => {
    setInput(html);
    if (!html.trim()) { setOutput(""); return; }
    setOutput(minifyHtml(html, opts));
  }, [options]);

  const updateOption = (key: keyof MinifyOptions, val: boolean) => {
    const newOpts = { ...options, [key]: val };
    setOptions(newOpts);
    if (input.trim()) setOutput(minifyHtml(input, newOpts));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/html" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "minified.html";
    a.click();
  };

  const originalSize = new Blob([input]).size;
  const minifiedSize = new Blob([output]).size;
  const savings = originalSize > 0 ? Math.round(((originalSize - minifiedSize) / originalSize) * 100) : 0;

  return (
    <div className={s.page}>
      <div className={s.header}>
        <div className={s.badge}>Developer Tool</div>
        <h1 className={s.h1}>HTML Minifier & Compressor</h1>
        <p className={s.desc}>
          Remove whitespace, comments, and unnecessary characters from your HTML. Reduce file size for faster page loads.
        </p>
      </div>

      {/* Stats */}
      {input && (
        <div className={s.statsRow}>
          <div className={s.stat}><span className={s.statVal}>{originalSize.toLocaleString()}B</span><span className={s.statLabel}>original</span></div>
          <div className={s.stat}><span className={s.statVal}>{minifiedSize.toLocaleString()}B</span><span className={s.statLabel}>minified</span></div>
          <div className={s.stat}><span className={s.statVal} style={{ color: savings > 0 ? "#15803d" : "#6b7280" }}>-{savings}%</span><span className={s.statLabel}>saved</span></div>
          <div className={s.stat}><span className={s.statVal}>{(originalSize - minifiedSize).toLocaleString()}B</span><span className={s.statLabel}>removed</span></div>
        </div>
      )}

      {/* Options */}
      <div className={s.optionsCard}>
        <span className={s.optionsTitle}>Options</span>
        <div className={s.optionsGrid}>
          {(Object.keys(options) as (keyof MinifyOptions)[]).map((key) => (
            <label key={key} className={s.checkLabel}>
              <input
                type="checkbox"
                checked={options[key]}
                onChange={(e) => updateOption(key, e.target.checked)}
              />
              <span>{key.replace(/([A-Z])/g, " $1").toLowerCase()}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={s.panels}>
        <div className={s.panel}>
          <div className={s.panelHeader}>
            <span className={s.panelTitle}>Original HTML</span>
            <div className={s.panelActions}>
              <button className={s.actionBtn} onClick={() => process(SAMPLE_HTML)}>Sample</button>
              <button className={s.actionBtn} onClick={() => { setInput(""); setOutput(""); }}>Clear</button>
            </div>
          </div>
          <textarea
            className={s.textarea}
            value={input}
            onChange={(e) => process(e.target.value)}
            placeholder="Paste your HTML here..."
            spellCheck={false}
          />
        </div>

        <div className={s.panel}>
          <div className={s.panelHeader}>
            <span className={s.panelTitle}>Minified HTML</span>
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
        <h2>What is HTML Minification?</h2>
        <p>
          HTML minification removes unnecessary characters from HTML source code without changing its functionality —
          whitespace, comments, optional closing tags, and redundant attribute quotes are stripped to reduce file size.
          Smaller HTML means faster downloads, quicker browser parsing, and better Core Web Vitals scores.
        </p>
        <h2>How much can HTML minification save?</h2>
        <p>
          Typically, HTML minification reduces file size by 10–30%. When combined with Gzip or Brotli compression
          on your server, total savings can reach 70–90% compared to the original uncompressed file.
        </p>
      </section>

      
    </div>
  );
}