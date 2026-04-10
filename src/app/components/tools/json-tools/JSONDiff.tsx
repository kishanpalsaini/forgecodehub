"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import styles from "./Tool.module.css";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface DiffResult {
  added: Array<{ path: string; value: any }>;
  removed: Array<{ path: string; value: any }>;
  modified: Array<{ path: string; oldValue: any; newValue: any }>;
}

export default function JSONDiff() {
  const [json1, setJson1] = useState("");
  const [json2, setJson2] = useState("");
  const [diffResult, setDiffResult] = useState<DiffResult | null>(null);
  const [error, setError] = useState("");

  const getDetailedDiff = (obj1: any, obj2: any, path: string = ""): DiffResult => {
    const result: DiffResult = { added: [], removed: [], modified: [] };

    for (const key in obj2) {
      const currentPath = path ? `${path}.${key}` : key;
      if (!(key in obj1)) {
        result.added.push({ path: currentPath, value: obj2[key] });
      } else if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
        if (typeof obj1[key] === "object" && typeof obj2[key] === "object" && !Array.isArray(obj1[key]) && !Array.isArray(obj2[key])) {
          const nested = getDetailedDiff(obj1[key], obj2[key], currentPath);
          result.added.push(...nested.added);
          result.removed.push(...nested.removed);
          result.modified.push(...nested.modified);
        } else {
          result.modified.push({ path: currentPath, oldValue: obj1[key], newValue: obj2[key] });
        }
      }
    }

    for (const key in obj1) {
      const currentPath = path ? `${path}.${key}` : key;
      if (!(key in obj2)) {
        result.removed.push({ path: currentPath, value: obj1[key] });
      }
    }

    return result;
  };

  const compareJSON = () => {
    setError("");
    setDiffResult(null);
    try {
      const obj1 = JSON.parse(json1);
      const obj2 = JSON.parse(json2);
      const diff = getDetailedDiff(obj1, obj2);
      setDiffResult(diff);
    } catch (err: any) {
      setError(`Error: ${err.message}`);
    }
  };

  const loadSamples = () => {
    const sample1 = { name: "John", age: 30, city: "New York" };
    const sample2 = { name: "John", age: 31, city: "Los Angeles", country: "USA" };
    setJson1(JSON.stringify(sample1, null, 2));
    setJson2(JSON.stringify(sample2, null, 2));
  };

  const totalChanges = diffResult ? diffResult.added.length + diffResult.removed.length + diffResult.modified.length : 0;

  return (
    <div className={styles.tool}>
      {/* Controls */}
      <div className={styles.actions}>
        <button onClick={compareJSON} className={`${styles.btn} ${styles.btnPrimary}`}>
          ⚖️ Compare
        </button>
        <button onClick={loadSamples} className={`${styles.btn} ${styles.btnSecondary}`}>
          📄 Sample
        </button>
        <button
          onClick={() => {
            setJson1("");
            setJson2("");
            setDiffResult(null);
            setError("");
          }}
          className={`${styles.btn} ${styles.btnDanger}`}
        >
          🗑️ Clear
        </button>
      </div>

      {/* Error */}
      {error && <div className={styles.error}>{error}</div>}

      {/* Summary */}
      {diffResult && (
        <div className={styles.summary}>
          <div className={`${styles.summaryCard} ${styles.added}`}>
            <div className={styles.summaryLabel}>Added</div>
            <div className={styles.summaryValue}>{diffResult.added.length}</div>
          </div>
          <div className={`${styles.summaryCard} ${styles.removed}`}>
            <div className={styles.summaryLabel}>Removed</div>
            <div className={styles.summaryValue}>{diffResult.removed.length}</div>
          </div>
          <div className={`${styles.summaryCard} ${styles.modified}`}>
            <div className={styles.summaryLabel}>Modified</div>
            <div className={styles.summaryValue}>{diffResult.modified.length}</div>
          </div>
          <div className={`${styles.summaryCard} ${styles.total}`}>
            <div className={styles.summaryLabel}>Total</div>
            <div className={styles.summaryValue}>{totalChanges}</div>
          </div>
        </div>
      )}

      {/* Editors */}
      <div className={styles.editorGrid}>
        <div className={styles.editorWrapper}>
          <h3 className={styles.editorTitle}>JSON 1 (Original)</h3>
          <Editor height="400px" defaultLanguage="json" value={json1} onChange={(v) => setJson1(v || "")} theme="vs-dark" options={{ minimap: { enabled: false } }} />
        </div>
        <div className={styles.editorWrapper}>
          <h3 className={styles.editorTitle}>JSON 2 (Modified)</h3>
          <Editor height="400px" defaultLanguage="json" value={json2} onChange={(v) => setJson2(v || "")} theme="vs-dark" options={{ minimap: { enabled: false } }} />
        </div>
      </div>

      {/* Diff Results */}
      {diffResult && totalChanges > 0 && (
        <div className={styles.diffResults}>
          {diffResult.added.length > 0 && (
            <div className={styles.diffSection}>
              <h4 className={styles.diffHeading}>✓ Added ({diffResult.added.length})</h4>
              {diffResult.added.map((item, idx) => (
                <div key={idx} className={`${styles.diffItem} ${styles.diffAdded}`}>
                  <div className={styles.diffPath}>{item.path}</div>
                  <div className={styles.diffValue}>{JSON.stringify(item.value)}</div>
                </div>
              ))}
            </div>
          )}
          {diffResult.removed.length > 0 && (
            <div className={styles.diffSection}>
              <h4 className={styles.diffHeading}>✗ Removed ({diffResult.removed.length})</h4>
              {diffResult.removed.map((item, idx) => (
                <div key={idx} className={`${styles.diffItem} ${styles.diffRemoved}`}>
                  <div className={styles.diffPath}>{item.path}</div>
                  <div className={styles.diffValue}>{JSON.stringify(item.value)}</div>
                </div>
              ))}
            </div>
          )}
          {diffResult.modified.length > 0 && (
            <div className={styles.diffSection}>
              <h4 className={styles.diffHeading}>⚡ Modified ({diffResult.modified.length})</h4>
              {diffResult.modified.map((item, idx) => (
                <div key={idx} className={`${styles.diffItem} ${styles.diffModified}`}>
                  <div className={styles.diffPath}>{item.path}</div>
                  <div className={styles.diffComparison}>
                    <div>Old: {JSON.stringify(item.oldValue)}</div>
                    <div>New: {JSON.stringify(item.newValue)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {diffResult && totalChanges === 0 && <div className={styles.noDiff}>✓ No differences found</div>}
    </div>
  );
}