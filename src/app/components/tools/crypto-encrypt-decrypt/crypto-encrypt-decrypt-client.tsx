"use client";

import { useState, useCallback } from "react";
import CryptoJS from "crypto-js";
import styles from "./crypto-encrypt-decrypt.module.css";

function encryptAES(text: string, key: string): string {
  const cfg = { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 };
  return CryptoJS.AES.encrypt(text, key, cfg).toString();
}

function decryptAES(encryptedBase64: string, key: string): string {
  const cfg = { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 };
  const decrypted = CryptoJS.AES.decrypt(encryptedBase64, key, cfg);
  const result = decrypted.toString(CryptoJS.enc.Utf8);
  if (!result) throw new Error("Invalid key or corrupted ciphertext");
  return result;
}

function CopyButton({
  text,
  accent = "cyan",
}: {
  text: string;
  accent?: "cyan" | "purple";
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`${styles.copyBtn} ${copied ? styles.copyBtnSuccess : ""}`}
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.faqItem}>
      <button
        className={styles.faqQuestion}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span>{question}</span>
        <span
          className={`${styles.faqChevron} ${open ? styles.faqChevronOpen : ""}`}
        >
          ▼
        </span>
      </button>
      {open && <div className={styles.faqAnswer}>{answer}</div>}
    </div>
  );
}

export default function CryptoEncryptDecryptClient() {
  // Encrypt state
  const [encInput, setEncInput] = useState("");
  const [encKey, setEncKey] = useState("");
  const [encOutput, setEncOutput] = useState("");
  const [encError, setEncError] = useState("");

  // Decrypt state
  const [decInput, setDecInput] = useState("");
  const [decKey, setDecKey] = useState("");
  const [decOutput, setDecOutput] = useState("");
  const [decError, setDecError] = useState("");

  const handleEncrypt = useCallback(() => {
    setEncError("");
    setEncOutput("");
    if (!encInput.trim()) { setEncError("Please enter text to encrypt."); return; }
    if (!encKey.trim()) { setEncError("Please enter a secret key."); return; }
    try {
      setEncOutput(encryptAES(encInput, encKey));
    } catch {
      setEncError("Encryption failed. Please try again.");
    }
  }, [encInput, encKey]);

  const handleDecrypt = useCallback(() => {
    setDecError("");
    setDecOutput("");
    if (!decInput.trim()) { setDecError("Please enter an encrypted string."); return; }
    if (!decKey.trim()) { setDecError("Please enter the secret key."); return; }
    try {
      setDecOutput(decryptAES(decInput, decKey));
    } catch {
      setDecError("Decryption failed. Check your key and ciphertext.");
    }
  }, [decInput, decKey]);

  const formatJSON = (data: string) => {
  try {
    return JSON.stringify(JSON.parse(data), null, 2);
  } catch {
    return data; // fallback if not valid JSON
  }
};

  return (
    <div className={styles.page}>
      {/* Security notice */}
      <div className={styles.securityNote}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <span>
          <strong>100% private</strong> — All encryption runs in your browser. Your text and keys never leave your device.
        </span>
      </div>


       <div className={styles.header}>
        <div className={styles.badge}>Developer Tool</div>
        <h1 className={styles.h1}>Crypto Encrypt/Decrypt</h1>
        <p className={styles.desc}>
          Free online AES encryption and decryption tool. Securely encrypt and decrypt your data in the browser.
        </p>
      </div>


      {/* Info cards */}
      <div className={styles.infoRow}>
        <div className={styles.infoCard}>
          <div className={styles.infoCardIcon} style={{ background: "rgba(34,211,238,0.1)", color: "#22d3ee" }}>🔐</div>
          <div>
            <div className={styles.infoCardTitle}>AES-CBC Mode</div>
            <div className={styles.infoCardDesc}>Cipher Block Chaining with PKCS7 padding via CryptoJS</div>
          </div>
        </div>
        <div className={styles.infoCard}>
          <div className={styles.infoCardIcon} style={{ background: "rgba(167,139,250,0.1)", color: "#a78bfa" }}>🔑</div>
          <div>
            <div className={styles.infoCardTitle}>Key-based Security</div>
            <div className={styles.infoCardDesc}>16/24/32 char keys for AES-128, 192, or 256-bit strength</div>
          </div>
        </div>
        <div className={styles.infoCard}>
          <div className={styles.infoCardIcon} style={{ background: "rgba(52,211,153,0.1)", color: "#34d399" }}>📦</div>
          <div>
            <div className={styles.infoCardTitle}>Base64 Output</div>
            <div className={styles.infoCardDesc}>Encrypted output is Base64 encoded — safe for storage and transfer</div>
          </div>
        </div>
      </div>

      {/* Main panels */}
      <div className={styles.panels}>
        {/* Encrypt Panel */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitleGroup}>
              <div className={`${styles.panelIcon} ${styles.panelIconEncrypt}`}>🔒</div>
              <div>
                <div className={styles.panelTitle}>Encrypt</div>
                <div className={styles.panelSubtitle}>Plain text → AES ciphertext</div>
              </div>
            </div>
          </div>

          <div className={styles.fields}>
            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Input Text</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Enter text to encrypt..."
                  value={encInput}
                  onChange={(e) => setEncInput(e.target.value)}
                  rows={3}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Secret Key</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="my-secret-key-32"
                  value={encKey}
                  onChange={(e) => setEncKey(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Encrypted Output</label>
              <div className={styles.outputWrap}>
                <div
                  className={`${styles.outputBox} ${
                    encError
                      ? styles.outputError
                      : encOutput
                      ? styles.outputBoxEncrypt
                      : ""
                  }`}
                >
                  {encError ? (
                    encError
                  ) : encOutput ? (
                    encOutput
                  ) : (
                    <span className={styles.outputPlaceholder}>
                      Encrypted result will appear here...
                    </span>
                  )}
                </div>
                {encOutput && <CopyButton text={encOutput} accent="cyan" />}
              </div>
            </div>
          </div>

          <div className={styles.actionRow}>
            <button className={`${styles.btn} ${styles.btnEncrypt}`} onClick={handleEncrypt}>
              🔒 Encrypt
            </button>
            <button
              className={styles.btnClear}
              onClick={() => { setEncInput(""); setEncKey(""); setEncOutput(""); setEncError(""); }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Decrypt Panel */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitleGroup}>
              <div className={`${styles.panelIcon} ${styles.panelIconDecrypt}`}>🔓</div>
              <div>
                <div className={styles.panelTitle}>Decrypt</div>
                <div className={styles.panelSubtitle}>AES ciphertext → plain text</div>
              </div>
            </div>
          </div>

          <div className={styles.fields}>
            <div className={styles.row}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Encrypted String</label>
                <textarea
                  className={`${styles.textarea} ${styles.textareaDecrypt}`}
                  placeholder="Paste Base64 encrypted string..."
                  value={decInput}
                  onChange={(e) => setDecInput(e.target.value)}
                  rows={3}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Secret Key</label>
                <input
                  className={`${styles.input} ${styles.inputDecrypt}`}
                  type="text"
                  placeholder="my-secret-key-32"
                  value={decKey}
                  onChange={(e) => setDecKey(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Decrypted Output</label>
              <div className={styles.outputWrap}>
                <div
                  className={`${styles.outputBox} ${
                    decError
                      ? styles.outputError
                      : decOutput
                      ? styles.outputBoxDecrypt
                      : ""
                  }`}
                >
                  {decError ? (
                    decError
                  ) : decOutput ? (
                    <pre style={{ margin: 0 }}>
      {formatJSON(decOutput)}
    </pre>
                  ) : (
                    <span className={styles.outputPlaceholder}>
                      Decrypted result will appear here...
                    </span>
                  )}
                </div>
                {decOutput && <CopyButton text={decOutput} accent="purple" />}
              </div>
            </div>
          </div>

          <div className={styles.actionRow}>
            <button className={`${styles.btn} ${styles.btnDecrypt}`} onClick={handleDecrypt}>
              🔓 Decrypt
            </button>
            <button
              className={styles.btnClear}
              onClick={() => { setDecInput(""); setDecKey(""); setDecOutput(""); setDecError(""); }}
            >
              Clear
            </button>
          </div>
        </div>
      </div>

    

      {/* SEO section */}
      <div className={styles.seoSection}>
        <h2>What is AES Encryption?</h2>
        <p>
          AES (Advanced Encryption Standard) is the most widely used symmetric encryption algorithm in the world. It operates on fixed-size blocks of data using a secret key to transform plain text into an unreadable ciphertext. Only someone with the correct key can reverse this process.
        </p>
        <h2>How does this tool work?</h2>
        <p>
          This tool uses the CryptoJS library to perform AES encryption and decryption entirely in your browser. No data is transmitted to any server. The encryption uses CBC (Cipher Block Chaining) mode with PKCS7 padding, and outputs a Base64-encoded string safe for storage or transmission.
        </p>
        <h2>When should you use AES encryption?</h2>
        <p>
          AES encryption is ideal for securing sensitive data like API tokens, configuration values, personal information, or any string you want to store or transmit securely. It is not suitable for password storage — use bcrypt or Argon2 for that.
        </p>
      </div>
    </div>
  );
}