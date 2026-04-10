"use client";

import { useState } from "react";
import { JSONPath } from "jsonpath-plus";
import styles from "./Tool.module.css";

export default function JSONPathTool() {
  const [json, setJson] = useState("");
  const [query, setQuery] = useState("$");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const executeQuery = () => {
    setError("");
    setResult(null);

    try {
      const data = JSON.parse(json);
      const queryResult = JSONPath({ path: query, json: data });
      setResult(queryResult);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const loadSample = () => {
    const sample = {
      store: {
        book: [
          {
            category: "reference",
            author: "Nigel Rees",
            title: "Sayings of the Century",
            price: 8.95,
          },
          {
            category: "fiction",
            author: "Evelyn Waugh",
            title: "Sword of Honour",
            price: 12.99,
          },
          {
            category: "fiction",
            author: "Herman Melville",
            title: "Moby Dick",
            price: 8.99,
          },
        ],
        bicycle: {
          color: "red",
          price: 19.95,
        },
      },
    };
    setJson(JSON.stringify(sample, null, 2));
    setQuery("$.store.book[*].author");
  };

  const examples = [
    { label: "Root", query: "$", desc: "The root object" },
    { label: "All Books", query: "$.store.book[*]", desc: "All books in store" },
    { label: "All Authors", query: "$.store.book[*].author", desc: "All book authors" },
    { label: "First Book", query: "$.store.book[0]", desc: "First book" },
    { label: "Last Book", query: "$.store.book[-1:]", desc: "Last book" },
    { label: "Books < $10", query: "$.store.book[?(@.price < 10)]", desc: "Books under $10" },
    { label: "Fiction Books", query: "$.store.book[?(@.category=='fiction')]", desc: "Fiction category" },
    { label: "All Prices", query: "$.store..price", desc: "All prices (recursive)" },
  ];

  return (
    <div className={styles.tool}>
      {/* Actions */}
      <div className={styles.actions}>
        <button onClick={executeQuery} className={`${styles.btn} ${styles.btnPrimary}`}>
          🔍 Execute Query
        </button>
        <button onClick={loadSample} className={`${styles.btn} ${styles.btnSecondary}`}>
          📄 Load Sample
        </button>
        <button
          onClick={() => {
            setJson("");
            setQuery("$");
            setResult(null);
            setError("");
          }}
          className={`${styles.btn} ${styles.btnDanger}`}
        >
          🗑️ Clear
        </button>
      </div>

      {/* Error */}
      {error && <div className={styles.error}>{error}</div>}

      {/* Info Box */}
      <div className={styles.infoBox}>
        <strong>📌 JSONPath Syntax:</strong>
        <br />
        <code>$</code> - Root object |{" "}
        <code>$.store.book[*]</code> - All books |{" "}
        <code>$..author</code> - All authors (recursive) |{" "}
        <code>$.store.book[?(@.price &lt; 10)]</code> - Filter by condition
      </div>

      {/* Input Area */}
      <div className={styles.inputWrapper}>
        <h3 className={styles.sectionTitle}>JSON Data</h3>
        <textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          className={styles.textarea}
          placeholder="Paste your JSON here..."
        />
      </div>

      {/* Query Input */}
      <div className={styles.queryWrapper}>
        <h3 className={styles.sectionTitle}>JSONPath Query</h3>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={styles.queryInput}
          placeholder="$.store.book[*].author"
        />
      </div>

      {/* Example Queries */}
      <div className={styles.examplesWrapper}>
        <h4 className={styles.examplesTitle}>Example Queries:</h4>
        <div className={styles.examplesGrid}>
          {examples.map((ex) => (
            <button
              key={ex.query}
              onClick={() => setQuery(ex.query)}
              className={styles.exampleBtn}
              title={ex.desc}
            >
              <span className={styles.exampleLabel}>{ex.label}</span>
              <code className={styles.exampleQuery}>{ex.query}</code>
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {result !== null && (
        <div className={styles.resultWrapper}>
          <h3 className={styles.sectionTitle}>
            Result ({Array.isArray(result) ? result.length : 1} item
            {Array.isArray(result) && result.length !== 1 ? "s" : ""})
          </h3>
          <pre className={styles.resultPre}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}