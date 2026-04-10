"use client";

import { useState } from "react";
import { parse } from "json2csv";
import styles from "./Tool.module.css";
import { downloadFile, copyToClipboard } from "@/lib/jsonUtils";

export default function JSONToCSV() {
  const [json, setJson] = useState("");
  const [csv, setCsv] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = () => {
    setError("");
    setCsv("");

    try {
      const data = JSON.parse(json);

      if (!Array.isArray(data)) {
        throw new Error("JSON must be an array of objects");
      }

      if (data.length === 0) {
        throw new Error("JSON array is empty");
      }

      const csvResult = parse(data);
      setCsv(csvResult);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const downloadCSV = () => {
    downloadFile(csv, "data.csv", "text/csv");
  };

  const handleCopy = async () => {
    await copyToClipboard(csv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadSample = () => {
    const sample = [
      { name: "John Doe", age: 30, email: "john@example.com", city: "New York" },
      { name: "Jane Smith", age: 25, email: "jane@example.com", city: "Los Angeles" },
      { name: "Bob Johnson", age: 35, email: "bob@example.com", city: "Chicago" },
    ];
    setJson(JSON.stringify(sample, null, 2));
  };

  return (
    <div className={styles.tool}>
      {/* Actions */}
      <div className={styles.actions}>
        <button onClick={convert} className={`${styles.btn} ${styles.btnPrimary}`}>
          📊 Convert to CSV
        </button>
        <button onClick={loadSample} className={`${styles.btn} ${styles.btnSecondary}`}>
          📄 Load Sample
        </button>
        {csv && (
          <>
            <button onClick={handleCopy} className={`${styles.btn} ${styles.btnSuccess}`}>
              {copied ? "✓ Copied" : "📋 Copy CSV"}
            </button>
            <button onClick={downloadCSV} className={`${styles.btn} ${styles.btnInfo}`}>
              ⬇ Download CSV
            </button>
          </>
        )}
        <button
          onClick={() => {
            setJson("");
            setCsv("");
            setError("");
          }}
          className={`${styles.btn} ${styles.btnDanger}`}
        >
          🗑️ Clear
        </button>
      </div>

      {/* Error */}
      {error && <div className={styles.error}>{error}</div>}

      {/* Info Message */}
      <div className={styles.infoBox}>
        <strong>📌 Note:</strong> JSON must be an array of objects with consistent keys.
        <br />
        Example: <code>[{"{"}name: "John", age: 30{"}"}, {"{"}name: "Jane", age: 25{"}"}]</code>
      </div>

      {/* Input Area */}
      <div className={styles.inputWrapper}>
        <h3 className={styles.sectionTitle}>Input JSON (Array of Objects)</h3>
        <textarea value={json} onChange={(e) => setJson(e.target.value)} className={styles.textarea} placeholder='[{"name":"John","age":30},{"name":"Jane","age":25}]' />
      </div>

      {/* Output Area */}
      {csv && (
        <div className={styles.inputWrapper}>
          <h3 className={styles.sectionTitle}>CSV Output</h3>
          <textarea value={csv} readOnly className={`${styles.textarea} ${styles.textareaReadonly}`} />
        </div>
      )}

      {/* Preview Table */}
      {csv && (
        <div className={styles.csvPreview}>
          <h3 className={styles.sectionTitle}>Preview</h3>
          <div className={styles.tableWrapper}>
            <table className={styles.csvTable}>
              <thead>
                <tr>
                  {csv.split("\n")[0].split(",").map((header, idx) => (
                    <th key={idx}>{header.replace(/"/g, "")}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csv
                  .split("\n")
                  .slice(1, 6)
                  .map((row, rowIdx) => (
                    <tr key={rowIdx}>
                      {row.split(",").map((cell, cellIdx) => (
                        <td key={cellIdx}>{cell.replace(/"/g, "")}</td>
                      ))}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          {csv.split("\n").length > 6 && (
            <div className={styles.tableFooter}>
              Showing 5 of {csv.split("\n").length - 1} rows
            </div>
          )}
        </div>
      )}
    </div>
  );
}