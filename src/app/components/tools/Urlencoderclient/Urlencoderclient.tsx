"use client";

import { useState } from "react";
import s from "./UrlEncoderClient.module.css";




type Mode = "encode" | "decode";
type EncType = "component" | "full";

interface ParsedUrl {
  protocol: string;
  host: string;
  pathname: string;
  search: string;
  hash: string;
  params: [string, string][];
}

function parseUrl(raw: string): ParsedUrl | null {
  try {
    const u = new URL(raw.trim());
    return {
      protocol: u.protocol,
      host: u.host,
      pathname: u.pathname,
      search: u.search,
      hash: u.hash,
      params: [...u.searchParams.entries()],
    };
  } catch {
    return null;
  }
}

const SAMPLE_ENCODE = "https://example.com/search?q=hello world&lang=en&tags=a,b,c";
const SAMPLE_DECODE = "https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world%26lang%3Den";

export default function UrlEncoderClient() {
  const [mode, setMode] = useState<Mode>("encode");
  const [encType, setEncType] = useState<EncType>("component");
  const [input, setInput] = useState(SAMPLE_ENCODE);
  const [output, setOutput] = useState(() => encodeURIComponent(SAMPLE_ENCODE));
  const [copied, setCopied] = useState(false);
  const [copiedParam, setCopiedParam] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const parsedUrl = parseUrl(input.startsWith("http") ? input : "");

  const process = (value: string, m: Mode = mode, et: EncType = encType) => {
    setInput(value);
    setError(null);
    if (!value.trim()) { setOutput(""); return; }
    try {
      if (m === "encode") {
        const result = et === "component"
          ? encodeURIComponent(value)
          : value.replace(/ /g, "%20");
        setOutput(result);
      } else {
        setOutput(decodeURIComponent(value.trim()));
      }
    } catch {
      setError("Invalid input — could not encode/decode.");
      setOutput("");
    }
  };

  const handleModeSwitch = (m: Mode) => {
    setMode(m);
    setInput(m === "encode" ? SAMPLE_ENCODE : SAMPLE_DECODE);
    setOutput(
      m === "encode"
        ? encodeURIComponent(SAMPLE_ENCODE)
        : decodeURIComponent(SAMPLE_DECODE)
    );
    setError(null);
  };

  const handleCopy = (text: string, paramIdx?: number) => {
    navigator.clipboard.writeText(text).then(() => {
      if (paramIdx !== undefined) {
        setCopiedParam(paramIdx);
        setTimeout(() => setCopiedParam(null), 1500);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    });
  };

  return (
    <div className={s.page}>
      <div className={s.header}>
        <div className={s.badge}>Developer Tool</div>
        <h1 className={s.h1}>URL Encoder & Decoder</h1>
        <p className={s.desc}>
          Encode special characters for safe URL transmission, decode percent-encoded strings, and parse URL components.
        </p>
      </div>

      {/* Mode + options */}
      <div className={s.controls}>
        <div className={s.modeSwitch}>
          <button className={`${s.modeBtn} ${mode === "encode" ? s.modeBtnActive : ""}`} onClick={() => handleModeSwitch("encode")}>Encode</button>
          <button className={`${s.modeBtn} ${mode === "decode" ? s.modeBtnActive : ""}`} onClick={() => handleModeSwitch("decode")}>Decode</button>
        </div>
        {mode === "encode" && (
          <div className={s.optionGroup}>
            <label className={s.optLabel}>Encoding:</label>
            <select className={s.select} value={encType} onChange={(e) => { setEncType(e.target.value as EncType); process(input, mode, e.target.value as EncType); }}>
              <option value="component">encodeURIComponent (query params)</option>
              <option value="full">Encode spaces only</option>
            </select>
          </div>
        )}
      </div>

      {/* Main panels */}
      <div className={s.panels}>
        <div className={s.panel}>
          <div className={s.panelHeader}>
            <span className={s.panelTitle}>{mode === "encode" ? "Original URL / Text" : "Encoded URL"}</span>
            <div className={s.panelActions}>
              <button className={s.actionBtn} onClick={() => { setInput(""); setOutput(""); }}>Clear</button>
            </div>
          </div>
          <textarea
            className={s.textarea}
            value={input}
            onChange={(e) => process(e.target.value)}
            placeholder={mode === "encode" ? "Enter URL or text to encode..." : "Paste encoded URL to decode..."}
            spellCheck={false}
          />
          {error && <div className={s.errorBox}>⚠ {error}</div>}
        </div>

        <div className={s.panel}>
          <div className={s.panelHeader}>
            <span className={s.panelTitle}>{mode === "encode" ? "Encoded URL" : "Decoded URL"}</span>
            <div className={s.panelActions}>
              <button className={s.actionBtn} onClick={() => handleCopy(output)} disabled={!output}>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
          <div className={s.outputBox}>
            {output || <span className={s.placeholder}>Output will appear here...</span>}
          </div>
        </div>
      </div>

      {/* URL Parser */}
      {parsedUrl && (
        <div className={s.parserSection}>
          <h2 className={s.parserTitle}>URL Breakdown</h2>
          <div className={s.parserGrid}>
            {[
              { label: "Protocol", value: parsedUrl.protocol },
              { label: "Host", value: parsedUrl.host },
              { label: "Path", value: parsedUrl.pathname },
              { label: "Query String", value: parsedUrl.search },
              { label: "Hash / Fragment", value: parsedUrl.hash || "—" },
            ].map(({ label, value }) => (
              <div key={label} className={s.parserRow}>
                <span className={s.parserLabel}>{label}</span>
                <span className={s.parserValue}>{value}</span>
              </div>
            ))}
          </div>

          {parsedUrl.params.length > 0 && (
            <div className={s.paramsTable}>
              <div className={s.paramsHeader}>
                <span>Query Parameters</span>
                <span className={s.paramsCount}>{parsedUrl.params.length} params</span>
              </div>
              {parsedUrl.params.map(([k, v], i) => (
                <div key={i} className={s.paramRow}>
                  <span className={s.paramKey}>{k}</span>
                  <span className={s.paramEq}>=</span>
                  <span className={s.paramVal}>{v}</span>
                  <button
                    className={s.paramCopy}
                    onClick={() => handleCopy(`${k}=${v}`, i)}
                  >
                    {copiedParam === i ? "✓" : "copy"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <section className={s.seoSection}>
        <h2>What is URL Encoding?</h2>
        <p>
          URL encoding (also called percent-encoding) converts special characters into a format that can be
          safely transmitted over the internet. Characters like spaces, ampersands, and slashes are replaced
          with a <code>%</code> followed by their hexadecimal ASCII code — for example, a space becomes <code>%20</code>.
        </p>
        <h2>encodeURIComponent vs encodeURI</h2>
        <p>
          Use <code>encodeURIComponent</code> for encoding individual query parameter values — it encodes
          nearly all special characters including <code>&amp;</code>, <code>=</code>, and <code>+</code>.
          Use <code>encodeURI</code> for encoding a full URL while preserving its structure (slashes, colons remain intact).
        </p>
      </section>

    </div>
  );
}