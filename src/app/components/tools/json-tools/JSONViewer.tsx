"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import styles from "./Tool.module.css";
import { getMaxDepth, formatBytes } from "@/lib/jsonUtils";
import "react18-json-view/src/style.css";

// Dynamic import to avoid SSR issues
const JsonView = dynamic(() => import("react18-json-view"), { ssr: false });

export default function JSONViewer() {
  const [input, setInput] = useState("");
  const [jsonData, setJsonData] = useState<any>(null);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState<"default" | "dark">("default");
  const [collapsed, setCollapsed] = useState<boolean>(false);

  const parseJSON = () => {
    setError("");
    try {
      const parsed = JSON.parse(input);
      setJsonData(parsed);
    } catch (err: any) {
      setError(`Parse Error: ${err.message}`);
      setJsonData(null);
    }
  };

  const loadSample = () => {
    const sample = {
      users: [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          roles: ["admin", "user"],
          metadata: {
            createdAt: "2024-01-15",
            lastLogin: "2024-01-20",
          },
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          roles: ["user"],
          metadata: {
            createdAt: "2024-01-16",
            lastLogin: "2024-01-19",
          },
        },
      ],
      settings: {
        theme: "dark",
        notifications: true,
        language: "en",
      },
    };
    setInput(JSON.stringify(sample, null, 2));
    setJsonData(sample);
  };

  return (
    <div className={styles.tool}>
      {/* Controls */}
      <div className={styles.actions}>
        <button onClick={parseJSON} className={`${styles.btn} ${styles.btnPrimary}`}>
          🔍 Parse & View
        </button>
        <button onClick={loadSample} className={`${styles.btn} ${styles.btnSecondary}`}>
          📄 Load Sample
        </button>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as "default" | "dark")}
          className={styles.select}
        >
          <option value="default">Light Theme</option>
          <option value="dark">Dark Theme</option>
        </select>
        <select
          value={String(collapsed)}
          onChange={(e) => setCollapsed(e.target.value === "true")}
          className={styles.select}
        >
          <option value="false">Expand All</option>
          <option value="true">Collapse All</option>
        </select>
      </div>

      {/* Error */}
      {error && <div className={styles.error}>{error}</div>}

      {/* Input */}
      <div className={styles.inputWrapper}>
        <h3 className={styles.sectionTitle}>Input JSON</h3>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={styles.textarea}
          placeholder="Paste your JSON here..."
        />
      </div>

      {/* Tree View */}
      {jsonData && (
        <div className={styles.treeWrapper}>
          <h3 className={styles.sectionTitle}>Tree View</h3>
          <div className={styles.treeContainer}>
            <JsonView
              src={jsonData}
              theme={theme === "dark" ? "a11y" : "default"}
              collapsed={collapsed ? 1 : false}
              collapseStringsAfterLength={50}
              enableClipboard
            />
          </div>
        </div>
      )}

      {/* Stats */}
      {jsonData && (
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Type</div>
            <div className={styles.statValue}>
              {Array.isArray(jsonData) ? "Array" : "Object"}
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Size</div>
            <div className={styles.statValue}>
              {formatBytes(new Blob([JSON.stringify(jsonData)]).size)}
            </div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Keys</div>
            <div className={styles.statValue}>{Object.keys(jsonData).length}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Depth</div>
            <div className={styles.statValue}>{getMaxDepth(jsonData)}</div>
          </div>
        </div>
      )}
    </div>
  );
}