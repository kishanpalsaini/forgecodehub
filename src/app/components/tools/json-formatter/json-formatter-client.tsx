"use client";

import { useState, useCallback } from "react";
import s from "./json-formatter-client.module.css";

type ViewMode = "formatted" | "minified" | "tree";

interface TreeNode {
  key: string;
  value: unknown;
  depth: number;
  isLast: boolean;
}

function JsonTreeNode({ data, depth = 0 }: { data: unknown; depth?: number }) {
  const [collapsed, setCollapsed] = useState(depth > 2);

  if (data === null) return <span className={s.tNull}>null</span>;
  if (typeof data === "boolean")
    return <span className={s.tBool}>{String(data)}</span>;
  if (typeof data === "number") return <span className={s.tNum}>{data}</span>;
  if (typeof data === "string")
    return <span className={s.tStr}>"{data}"</span>;

  if (Array.isArray(data)) {
    if (data.length === 0) return <span className={s.tPunct}>[]</span>;
    return (
      <span>
        <button className={s.collapseBtn} onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? "▶" : "▼"}
        </button>
        <span className={s.tPunct}>[</span>
        {collapsed ? (
          <button className={s.ellipsis} onClick={() => setCollapsed(false)}>
            {data.length} items
          </button>
        ) : (
          <div className={s.treeIndent}>
            {data.map((item, i) => (
              <div key={i}>
                <JsonTreeNode data={item} depth={depth + 1} />
                {i < data.length - 1 && <span className={s.tPunct}>,</span>}
              </div>
            ))}
          </div>
        )}
        <span className={s.tPunct}>]</span>
      </span>
    );
  }

  if (typeof data === "object") {
    const entries = Object.entries(data as Record<string, unknown>);
    if (entries.length === 0) return <span className={s.tPunct}>{"{}"}</span>;
    return (
      <span>
        <button className={s.collapseBtn} onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? "▶" : "▼"}
        </button>
        <span className={s.tPunct}>{"{"}</span>
        {collapsed ? (
          <button className={s.ellipsis} onClick={() => setCollapsed(false)}>
            {entries.length} keys
          </button>
        ) : (
          <div className={s.treeIndent}>
            {entries.map(([k, v], i) => (
              <div key={k}>
                <span className={s.tKey}>"{k}"</span>
                <span className={s.tPunct}>: </span>
                <JsonTreeNode data={v} depth={depth + 1} />
                {i < entries.length - 1 && <span className={s.tPunct}>,</span>}
              </div>
            ))}
          </div>
        )}
        <span className={s.tPunct}>{"}"}</span>
      </span>
    );
  }

  return <span>{String(data)}</span>;
}

const SAMPLE_JSON = `{
  "name": "ForgeCodeHub",
  "version": "1.0.0",
  "tools": ["JSON Formatter", "Base64", "URL Encoder"],
  "meta": {
    "author": "ForgeCodeHub",
    "free": true,
    "rating": 4.9
  }
}`;

export default function JsonFormatterClient() {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [error, setError] = useState<string | null>(null);
  const [parsed, setParsed] = useState<unknown>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("formatted");
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(true);

  const processJson = useCallback(
    (raw: string) => {
      setInput(raw);
      if (!raw.trim()) {
        setError(null);
        setParsed(null);
        setIsValid(null);
        return;
      }
      try {
        const obj = JSON.parse(raw);
        setParsed(obj);
        setError(null);
        setIsValid(true);
      } catch (e: unknown) {
        setParsed(null);
        setIsValid(false);
        if (e instanceof SyntaxError) {
          setError(e.message);
        }
      }
    },
    []
  );

  const formatted =
    parsed !== null ? JSON.stringify(parsed, null, indent) : "";
  const minified = parsed !== null ? JSON.stringify(parsed) : "";

  const outputText =
    viewMode === "formatted"
      ? formatted
      : viewMode === "minified"
      ? minified
      : formatted;

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([outputText], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "formatted.json";
    a.click();
  };

  const stats = {
    chars: input.length,
    lines: input.split("\n").length,
    size: new Blob([input]).size,
    minSize: new Blob([minified]).size,
  };

  return (
    <div className={s.page}>
      {/* Header */}
      <div className={s.header}>
        <div className={s.badge}>Developer Tool</div>
        <h1 className={s.h1}>JSON Formatter & Validator</h1>
        <p className={s.desc}>
          Beautify, validate, minify and explore JSON — free, instant, client-side.
        </p>
      </div>

      {/* Stats */}
      {input && (
        <div className={s.statsRow}>
          <div className={s.stat}><span className={s.statVal}>{stats.chars.toLocaleString()}</span><span className={s.statLabel}>chars</span></div>
          <div className={s.stat}><span className={s.statVal}>{stats.lines}</span><span className={s.statLabel}>lines</span></div>
          <div className={s.stat}><span className={s.statVal}>{stats.size}B</span><span className={s.statLabel}>original</span></div>
          {minified && <div className={s.stat}><span className={s.statVal}>{stats.minSize}B</span><span className={s.statLabel}>minified</span></div>}
          <div className={s.stat}>
            <span className={s.statVal} style={{ color: isValid === true ? "var(--success)" : isValid === false ? "var(--danger)" : "inherit" }}>
              {isValid === true ? "✓ Valid" : isValid === false ? "✗ Invalid" : "—"}
            </span>
            <span className={s.statLabel}>status</span>
          </div>
        </div>
      )}

      {/* Main panels */}
      <div className={s.panels}>
        {/* Input */}
        <div className={s.panel}>
          <div className={s.panelHeader}>
            <span className={s.panelTitle}>Input JSON</span>
            <div className={s.panelActions}>
              <button className={s.actionBtn} onClick={() => processJson(SAMPLE_JSON)}>Sample</button>
              <button className={s.actionBtn} onClick={() => { setInput(""); setParsed(null); setError(null); setIsValid(null); }}>Clear</button>
            </div>
          </div>
          <textarea
            className={s.textarea}
            value={input}
            onChange={(e) => processJson(e.target.value)}
            placeholder='Paste your JSON here...'
            spellCheck={false}
          />
          {error && <div className={s.errorBox}>⚠ {error}</div>}
        </div>

        {/* Output */}
        <div className={s.panel}>
          <div className={s.panelHeader}>
            <span className={s.panelTitle}>Output</span>
            <div className={s.panelActions}>
              <select className={s.select} value={indent} onChange={(e) => setIndent(Number(e.target.value))}>
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={1}>1 space</option>
              </select>
              <button className={s.actionBtn} onClick={handleCopy} disabled={!outputText}>
                {copied ? "Copied!" : "Copy"}
              </button>
              <button className={s.actionBtn} onClick={handleDownload} disabled={!outputText}>Download</button>
            </div>
          </div>

          {/* View mode tabs */}
          <div className={s.modeTabs}>
            {(["formatted", "minified", "tree"] as ViewMode[]).map((m) => (
              <button
                key={m}
                className={`${s.modeTab} ${viewMode === m ? s.modeTabActive : ""}`}
                onClick={() => setViewMode(m)}
                disabled={!parsed}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>

          {viewMode === "tree" && parsed !== null ? (
            <div className={s.treeView}>
              <JsonTreeNode data={parsed} depth={0} />
            </div>
          ) : (
            <div className={s.outputBox}>
              {outputText || <span className={s.placeholder}>Output will appear here...</span>}
            </div>
          )}
        </div>
      </div>

      {/* SEO Content */}
      <section className={s.seoSection}>
        <h2>What is a JSON Formatter?</h2>
        <p>
          A JSON formatter (also called a JSON beautifier or JSON pretty printer) takes raw or minified JSON
          and adds proper indentation and line breaks to make it human-readable. Our free online JSON formatter
          also validates your JSON for syntax errors and shows you exactly where the problem is.
        </p>
        <h2>How to use this JSON Formatter</h2>
        <p>
          Paste your JSON into the input panel on the left. The tool automatically validates and formats it.
          Switch between Formatted, Minified, and Tree views. Download the result or copy it to clipboard.
        </p>
      </section>
    </div>
  );
}