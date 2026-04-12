"use client";

import { useState, useRef } from "react";
import styles from "./MenuBar.module.css";

interface MenuBarProps {
  onNew: () => void;
  onImport: (file: File) => void;
  onExport: (format: "docx" | "pdf" | "txt" | "html" | "md") => void;
  onPrint: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onToggleStylePanel: () => void;
}

export default function MenuBar({
  onNew,
  onImport,
  onExport,
  onPrint,
  darkMode,
  onToggleDarkMode,
  onToggleStylePanel,
}: MenuBarProps) {
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImport(file);
      e.target.value = "";
    }
  };

  return (
    <div className={styles.menuBar}>
      {/* File Menu */}
      <div className={styles.menuItem}>
        <button onClick={() => setShowFileMenu(!showFileMenu)} className={styles.menuBtn}>
          File ▼
        </button>
        {showFileMenu && (
          <div className={styles.dropdown}>
            <button onClick={() => { onNew(); setShowFileMenu(false); }}>
              📄 New Document
            </button>
            <button onClick={() => fileInputRef.current?.click()}>
  📁 Open File 
  
</button>
            <button onClick={() => { onExport("docx"); setShowFileMenu(false); }}>
              💾 Save as DOCX
            </button>
            <button onClick={() => { setShowExportMenu(true); setShowFileMenu(false); }}>
              📥 Export As...
            </button>
            <div className={styles.divider} />
            <button onClick={() => { onPrint(); setShowFileMenu(false); }}>
              🖨️ Print (Ctrl+P)
            </button>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept=".docx,.pdf,.txt,.html,.htm,.md,.markdown,.rtf,.odt,.csv,.tsv"
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
      </div>

      {/* Export Menu */}
      {showExportMenu && (
        <div className={styles.exportModal}>
          <div className={styles.modalContent}>
            <h3>Export Document</h3>
            <button onClick={() => { onExport("docx"); setShowExportMenu(false); }} className={styles.exportBtn}>
              📄 Microsoft Word (.docx)
            </button>
            <button onClick={() => { onExport("pdf"); setShowExportMenu(false); }} className={styles.exportBtn}>
              📕 PDF Document (.pdf)
            </button>
            <button onClick={() => { onExport("txt"); setShowExportMenu(false); }} className={styles.exportBtn}>
              📝 Plain Text (.txt)
            </button>
            <button onClick={() => { onExport("html"); setShowExportMenu(false); }} className={styles.exportBtn}>
              🌐 HTML (.html)
            </button>
            <button onClick={() => { onExport("md"); setShowExportMenu(false); }} className={styles.exportBtn}>
              📑 Markdown (.md)
            </button>
            <button onClick={() => setShowExportMenu(false)} className={styles.cancelBtn}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* View Menu */}
      <button onClick={onToggleStylePanel} className={styles.menuBtn}>
        📐 Page Setup
      </button>

      {/* Theme Toggle */}
      <button onClick={onToggleDarkMode} className={styles.menuBtn} title="Toggle Dark Mode">
        {darkMode ? "☀️" : "🌙"}
      </button>
    </div>
  );
}