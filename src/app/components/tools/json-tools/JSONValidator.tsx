"use client";

import { useState } from "react";
import Ajv from "ajv";
import styles from "./Tool.module.css";

export default function JSONValidator() {
  const [json, setJson] = useState("");
  const [schema, setSchema] = useState("");
  const [result, setResult] = useState<any>(null);
  const [useSchema, setUseSchema] = useState(false);

  const validate = () => {
    try {
      const parsed = JSON.parse(json);

      if (useSchema && schema) {
        const ajv = new Ajv();
        const schemaObj = JSON.parse(schema);
        const validate = ajv.compile(schemaObj);
        const valid = validate(parsed);

        setResult({
          valid,
          errors: validate.errors || [],
          message: valid ? "✓ Valid JSON and matches schema" : "✗ JSON is valid but doesn't match schema",
        });
      } else {
        setResult({
          valid: true,
          errors: [],
          message: "✓ Valid JSON syntax",
        });
      }
    } catch (err: any) {
      setResult({
        valid: false,
        errors: [{ message: err.message }],
        message: "✗ Invalid JSON",
      });
    }
  };

  const loadSample = () => {
    const sampleJson = {
      name: "John Doe",
      age: 30,
      email: "john@example.com",
    };

    const sampleSchema = {
      type: "object",
      properties: {
        name: { type: "string" },
        age: { type: "number", minimum: 0 },
        email: { type: "string", format: "email" },
      },
      required: ["name", "age", "email"],
    };

    setJson(JSON.stringify(sampleJson, null, 2));
    setSchema(JSON.stringify(sampleSchema, null, 2));
    setUseSchema(true);
  };

  return (
    <div className={styles.tool}>
      {/* Controls */}
      <div className={styles.controls}>
        <label className={styles.checkbox}>
          <input type="checkbox" checked={useSchema} onChange={(e) => setUseSchema(e.target.checked)} />
          <span>Validate against JSON Schema</span>
        </label>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button onClick={validate} className={`${styles.btn} ${styles.btnPrimary}`}>
          ✓ Validate
        </button>
        <button onClick={loadSample} className={`${styles.btn} ${styles.btnSecondary}`}>
          📄 Load Sample
        </button>
        <button
          onClick={() => {
            setJson("");
            setSchema("");
            setResult(null);
          }}
          className={`${styles.btn} ${styles.btnDanger}`}
        >
          🗑️ Clear
        </button>
      </div>

      {/* Input Areas */}
      <div className={styles.editorGrid}>
        <div className={styles.inputWrapper}>
          <h3 className={styles.sectionTitle}>JSON Data</h3>
          <textarea value={json} onChange={(e) => setJson(e.target.value)} className={styles.textarea} placeholder="Paste your JSON here..." />
        </div>

        {useSchema && (
          <div className={styles.inputWrapper}>
            <h3 className={styles.sectionTitle}>JSON Schema</h3>
            <textarea value={schema} onChange={(e) => setSchema(e.target.value)} className={styles.textarea} placeholder="Paste your JSON Schema here..." />
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className={`${styles.validationResult} ${result.valid ? styles.validationSuccess : styles.validationError}`}>
          <div className={styles.validationMessage}>{result.message}</div>

          {result.errors.length > 0 && (
            <div className={styles.errorList}>
              <h4 className={styles.errorListTitle}>Errors:</h4>
              {result.errors.map((err: any, idx: number) => (
                <div key={idx} className={styles.errorItem}>
                  <span className={styles.errorPath}>{err.instancePath || "root"}</span>
                  <span className={styles.errorMessage}>{err.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}