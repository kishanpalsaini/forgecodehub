"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { useEffect, useState, useCallback } from "react";
import styles from "./WordEditor.module.css";
import { editorExtensions } from "@/lib/word-editor/editorExtensions";
import MenuBar from "./MenuBar";
import Toolbar from "./Toolbar";
import StatusBar from "./StatusBar";
import FindReplace from "./Findreplace";
import {
  exportToDOCX, exportToPDF, exportToTXT, exportToHTML, exportToMarkdown,
} from "@/lib/word-editor/exportUtils";
// import { importDOCX } from "@/lib/word-editor/importUtils";
import {
  importDOCX,
  importPDF,
  importMarkdown,
  importRTF,
  importODT,
  importCSV,
  importTXT,
  importHTML,
} from "@/lib/word-editor/importUtils";

export default function WordEditor() {
  const [documentTitle, setDocumentTitle] = useState("Untitled Document");
  const [darkMode, setDarkMode] = useState(false);
  const [showStylePanel, setShowStylePanel] = useState(false);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [pageSize, setPageSize] = useState<"a4" | "letter" | "legal">("a4");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: editorExtensions,
    content: `
      <h1>Welcome to the Online Word Processor</h1>
      <p>Start typing to create your document. Use the toolbar above to format your text.</p>
      <h2>Features</h2>
      <ul>
        <li>Rich text formatting — bold, italic, underline, colours</li>
        <li>Multiple font families and sizes</li>
        <li>Text alignment and highlights</li>
        <li>Tables with drag-to-resize columns</li>
        <li>Embed images, audio, and video files</li>
        <li>Export to DOCX, PDF, TXT, HTML, Markdown</li>
        <li>Auto-save to browser storage</li>
      </ul>
      <p>Enjoy seamless document editing with automatic saving!</p>
    `,
    editorProps: {
      attributes: { class: styles.proseMirror, spellcheck: "true" },
    },
  });

  /* ── Persist ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!editor) return;
    const id = setInterval(() => {
      localStorage.setItem("wed-content", editor.getHTML());
      localStorage.setItem("wed-title", documentTitle);
    }, 3000);
    return () => clearInterval(id);
  }, [editor, documentTitle]);

  useEffect(() => {
    if (!editor) return;
    const c = localStorage.getItem("wed-content");
    const t = localStorage.getItem("wed-title");
    if (c) editor.commands.setContent(c);
    if (t) setDocumentTitle(t);
  }, [editor]);

  useEffect(() => {
    const saved = localStorage.getItem("wed-theme");
    if (saved === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("wed-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  /* ── Keyboard shortcuts ─────────────────────────────────────────────────── */
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleExport("docx");
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        handlePrint();
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === "h" || e.key === "f")) {
        e.preventDefault();
        setShowFindReplace(true);
      }
      if (e.key === "Escape") {
        setShowFindReplace(false);
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, documentTitle]);

  /* ── Export ─────────────────────────────────────────────────────────────── */
  const handleExport = async (format: "docx" | "pdf" | "txt" | "html" | "md") => {
    if (!editor) return;
    const content = editor.getHTML();
    try {
      switch (format) {
        case "docx":
          await exportToDOCX(content, documentTitle);
          break;
        case "pdf":
          await exportToPDF(content, documentTitle, pageSize, orientation);
          break;
        case "txt":
          exportToTXT(content, documentTitle);
          break;
        case "html":
          exportToHTML(content, documentTitle);
          break;
        case "md":
          exportToMarkdown(content, documentTitle);
          break;
      }
    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed. Please try again.");
    }
  };

  /* ── Import ─────────────────────────────────────────────────────────────── */
  const handleImport = async (file: File) => {
  if (!editor) return;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
 
  try {
    let html = "";
 
    switch (ext) {
      case "docx":
        html = await importDOCX(file);
        break;
      case "pdf":
        html = await importPDF(file);
        break;
      case "md":
      case "markdown":
        html = await importMarkdown(file);
        break;
      case "rtf":
        html = await importRTF(file);
        break;
      case "odt":
        html = await importODT(file);
        break;
      case "csv":
      case "tsv":
        html = await importCSV(file);
        break;
      case "txt":
        html = await importTXT(file);
        break;
      case "html":
      case "htm":
        html = await importHTML(file);
        break;
      default:
        alert(`Unsupported file type: .${ext}\n\nSupported formats: DOCX, PDF, TXT, HTML, Markdown, RTF, ODT, CSV`);
        return;
    }
 
    editor.commands.setContent(html);
    // Strip extension for title
    setDocumentTitle(file.name.replace(/\.[^.]+$/, ""));
  } catch (err) {
    console.error("Import failed:", err);
    alert(`Import failed for .${ext} file.\n${err instanceof Error ? err.message : "Please check the file and try again."}`);
  }
};

  const handlePrint = () => window.print();

  const handleNewDocument = () => {
    if (!confirm("Create a new document? Unsaved changes will be lost.")) return;
    editor?.commands.setContent("");
    setDocumentTitle("Untitled Document");
    localStorage.removeItem("wed-content");
    localStorage.removeItem("wed-title");
  };

    const handleInsertImage = useCallback(
    (src: string, alt?: string) => {
       editor?.chain().focus().insertContent({
         type: "image",
         attrs: { src, alt: alt ?? "" },
       }).run();
     },
     [editor]
   );

  const handleInsertTable = () => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  if (!editor) return <div className={styles.loading}>Loading editor…</div>;

  return (
    <div className={`${styles.container} ${darkMode ? styles.darkMode : ""}`}>
      <div className={styles.header}>
        <div className={styles.badge}>📝 Word Processor - Online</div>
        <div className={styles.titleSection}>
          <input
            type="text"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            className={styles.documentTitle}
            placeholder="Document Title"
          />
          <p className={styles.description}>
            Professional online word processor — Create, edit &amp; export documents with ease
          </p>
        </div>
      </div>

      <MenuBar
        onNew={handleNewDocument}
        onImport={handleImport}
        onExport={handleExport}
        onPrint={handlePrint}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((d) => !d)}
        onToggleStylePanel={() => setShowStylePanel((s) => !s)}
      />

      <Toolbar
        editor={editor}
        onInsertImage={handleInsertImage}
        onInsertTable={handleInsertTable}
        onFind={() => setShowFindReplace(true)}
      />

      {showFindReplace && (
        <FindReplace editor={editor} onClose={() => setShowFindReplace(false)} />
      )}

      <div className={styles.editorWrapper}>
        {showStylePanel && (
          <div className={styles.stylePanel}>
            <h3>Document Settings</h3>
            <div className={styles.setting}>
              <label>Page Size</label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value as "a4" | "letter" | "legal")}
              >
                <option value="a4">A4 (210 × 297 mm)</option>
                <option value="letter">Letter (8.5 × 11 in)</option>
                <option value="legal">Legal (8.5 × 14 in)</option>
              </select>
            </div>
            <div className={styles.setting}>
              <label>Orientation</label>
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value as "portrait" | "landscape")}
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>
          </div>
        )}

        <div className={styles.editorContainer}>
          <EditorContent editor={editor} className={styles.editor} />
        </div>
      </div>

      <StatusBar editor={editor} />

      <div className={styles.seo}>
        <h2>Free Online Word Processor</h2>
        <p>
          Create and edit professional documents with our feature-rich online word processor.
          Export to DOCX, PDF, TXT, HTML, or Markdown. No installation required — everything runs
          in your browser.
        </p>
        <h2>Key Features</h2>
        <p>
          Rich text formatting, multiple fonts, text alignment, colours, highlights, bullet lists,
          tables with column resize, embedded images, audio, and video. Simple continuous editing
          experience.
        </p>
        <h2>Privacy &amp; Security</h2>
        <p>
          All processing happens locally in your browser. Content is never uploaded. Documents
          auto-save to local storage.
        </p>
      </div>
    </div>
  );
}