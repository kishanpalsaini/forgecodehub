"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import styles from "./page.module.css";
import { formatJSON, minifyJSON, sortObjectKeys, downloadFile, copyToClipboard, formatBytes } from "@/lib/jsonUtils";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export default function JSONFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    setError("");
    setOutput("");
    try {
      let parsed = JSON.parse(input);
      if (sortKeys) {
        parsed = sortObjectKeys(parsed);
      }
      const formatted = formatJSON(JSON.stringify(parsed), indent);
      setOutput(formatted);
    } catch (err: any) {
      setError(`Invalid JSON: ${err.message}`);
    }
  };

  const handleMinify = () => {
    setError("");
    setOutput("");
    try {
      const minified = minifyJSON(input);
      setOutput(minified);
    } catch (err: any) {
      setError(`Invalid JSON: ${err.message}`);
    }
  };

  const handleCopy = async () => {
    await copyToClipboard(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    downloadFile(output, "formatted.json");
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const loadSample = () => {
    const sample = {
      name: "John Doe",
      age: 30,
      email: "john@example.com",
      address: {
        street: "123 Main St",
        city: "New York",
        country: "USA",
      },
      hobbies: ["reading", "coding", "traveling"],
      isActive: true,
    };
    setInput(JSON.stringify(sample));
  };

  return (
    <div className={styles.container} >
      <div className={styles.header}>
        <div className={styles.badge}>Developer Tool</div>
        <h1 className={styles.title}>JSON Formatter & Beautifier</h1>
        <p className={styles.description}>
          Format, validate, and beautify JSON data instantly. Sort keys, adjust indentation, and minify JSON online.
        </p>
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <label>Indentation:</label>
          <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} className={styles.select}>
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={8}>8 spaces</option>
          </select>
        </div>

        <label className={styles.checkbox}>
          <input type="checkbox" checked={sortKeys} onChange={(e) => setSortKeys(e.target.checked)} />
          <span>Sort Keys Alphabetically</span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className={styles.actions}>
        <button onClick={handleFormat} className={`${styles.btn} ${styles.btnPrimary}`}>
          🎨 Format JSON
        </button>
        <button onClick={handleMinify} className={`${styles.btn} ${styles.btnSecondary}`}>
          🗜️ Minify JSON
        </button>
        <button onClick={loadSample} className={`${styles.btn} ${styles.btnOutline}`}>
          📄 Load Sample
        </button>
        <button onClick={handleCopy} disabled={!output} className={`${styles.btn} ${styles.btnSuccess}`}>
          {copied ? "✓ Copied" : "📋 Copy"}
        </button>
        <button onClick={handleDownload} disabled={!output} className={`${styles.btn} ${styles.btnInfo}`}>
          ⬇ Download
        </button>
        <button onClick={handleClear} className={`${styles.btn} ${styles.btnDanger}`}>
          🗑️ Clear
        </button>
      </div>

      {/* Error Display */}
      {error && <div className={styles.error}>{error}</div>}

      {/* Editors */}
      <div className={styles.editorGrid}>
        <div className={styles.editorWrapper}>
          <h3 className={styles.editorTitle}>Input JSON</h3>
          <Editor
            className={styles.outputEditor}
            height="500px"
            defaultLanguage="json"
            value={input}
            onChange={(value) => setInput(value || "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              automaticLayout: true,
              wordWrap: "on",
            }}
          />
        </div>

        <div className={styles.editorWrapper}>
          <h3 className={styles.editorTitle}>Formatted Output</h3>
          <Editor
            className="outputEditor"
            height="500px"
            defaultLanguage="json"
            value={output}
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              automaticLayout: true,
              wordWrap: "on",
            }}
          />
        </div>
      </div>

      {/* Stats */}
      {output && (
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Input Size</div>
            <div className={styles.statValue}>{formatBytes(new Blob([input]).size)}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Output Size</div>
            <div className={styles.statValue}>{formatBytes(new Blob([output]).size)}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Difference</div>
            <div className={styles.statValue}>
              {((1 - new Blob([output]).size / new Blob([input]).size) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      )}

      {/* SEO Content */}
      <div className={styles.seo}>
        <h2>What is JSON Formatting?</h2>
        <p>
          JSON (JavaScript Object Notation) formatting transforms minified or poorly formatted JSON into human-readable
          text with proper indentation, line breaks, and spacing. This makes it easier to understand complex data
          structures and debug issues.
        </p>

        <h2>Why Format JSON?</h2>
        <p>
          Formatted JSON improves readability, helps identify syntax errors quickly, makes code reviews easier, and
          assists in debugging API responses. It's essential for developers working with REST APIs, configuration files,
          and data interchange formats.
        </p>

        <h2>How to Use This JSON Formatter</h2>
        <p>
          Simply paste your JSON data into the input editor, choose your preferred indentation (2, 4, or 8 spaces), and
          click "Format JSON". You can also minify JSON to remove all whitespace, sort keys alphabetically, copy the
          result, or download it as a .json file.
        </p>
      </div>
    </div>
  );
}