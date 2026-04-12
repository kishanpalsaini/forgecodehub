"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import { useEffect, useState, useCallback, useRef } from "react";
import styles from "./WordEditor.module.css";
import { editorExtensions } from "@/lib/word-editor/editorExtensions";
import MenuBar from "./MenuBar";
import Toolbar, { MarginSettings } from "./Toolbar";
import StatusBar from "./StatusBar";
import FindReplace from "./Findreplace";
import {
  exportToDOCX, exportToPDF, exportToTXT, exportToHTML, exportToMarkdown,
} from "@/lib/word-editor/exportUtils";
import { importDOCX } from "@/lib/word-editor/importUtils";

/* ─── Page dimensions ────────────────────────────────────────────────────── */
const MM_TO_PX = 3.7795275591;
function mmToPx(mm: number) { return Math.round(mm * MM_TO_PX); }

const PAGE_DIMS_MM: Record<string, { w: number; h: number }> = {
  a4:     { w: 210,   h: 297   },
  letter: { w: 215.9, h: 279.4 },
  legal:  { w: 215.9, h: 355.6 },
};

const DEFAULT_MARGINS: MarginSettings = {
  top: 25.4, right: 25.4, bottom: 25.4, left: 25.4,
  applyTo: "all", unit: "mm",
};

type PerPageMargins = Record<number, { top: number; right: number; bottom: number; left: number }>;

export default function WordEditor() {
  const [documentTitle, setDocumentTitle]     = useState("Untitled Document");
  const [darkMode, setDarkMode]               = useState(false);
  const [showStylePanel, setShowStylePanel]   = useState(false);
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [pageSize, setPageSize]               = useState<"a4" | "letter" | "legal">("a4");
  const [orientation, setOrientation]         = useState<"portrait" | "landscape">("portrait");
  const [margins, setMargins]                 = useState<MarginSettings>(DEFAULT_MARGINS);
  const [perPageMargins, setPerPageMargins]   = useState<PerPageMargins>({});
  const [selectedPage, setSelectedPage]       = useState<number | null>(null);
  const [pageCount, setPageCount]             = useState(1);
  const editorWrapRef                         = useRef<HTMLDivElement>(null);

  const dimsMm  = PAGE_DIMS_MM[pageSize] ?? PAGE_DIMS_MM.a4;
  const pageWmm = orientation === "landscape" ? dimsMm.h : dimsMm.w;
  const pageHmm = orientation === "landscape" ? dimsMm.w : dimsMm.h;
  const pageWpx = mmToPx(pageWmm);
  const pageHpx = mmToPx(pageHmm);

  /* Content area height for page-count calculation */
  const contentHpx = pageHpx - mmToPx(margins.top) - mmToPx(margins.bottom);

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
    `,
    editorProps: {
      attributes: { class: styles.proseMirror, spellcheck: "true" },
    },
    onUpdate: () => { setTimeout(recalcPages, 60); },
  });

  /* ── Recalculate page count ────────────────────────────────────────────── */
  const recalcPages = useCallback(() => {
    if (!editorWrapRef.current) return;
    const h = editorWrapRef.current.scrollHeight;
    setPageCount(Math.max(1, Math.ceil(h / contentHpx)));
  }, [contentHpx]);

  useEffect(() => { setTimeout(recalcPages, 150); }, [recalcPages, pageSize, orientation, margins]);

  /* ── Persist ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (!editor) return;
    const id = setInterval(() => {
      localStorage.setItem("wed-content", editor.getHTML());
      localStorage.setItem("wed-title",   documentTitle);
      localStorage.setItem("wed-margins", JSON.stringify(margins));
      localStorage.setItem("wed-ppm",     JSON.stringify(perPageMargins));
    }, 3000);
    return () => clearInterval(id);
  }, [editor, documentTitle, margins, perPageMargins]);

  useEffect(() => {
    if (!editor) return;
    const c = localStorage.getItem("wed-content");
    const t = localStorage.getItem("wed-title");
    const m = localStorage.getItem("wed-margins");
    const p = localStorage.getItem("wed-ppm");
    if (c) editor.commands.setContent(c);
    if (t) setDocumentTitle(t);
    if (m) { try { setMargins(JSON.parse(m)); } catch {} }
    if (p) { try { setPerPageMargins(JSON.parse(p)); } catch {} }
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
      if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); handleExport("docx"); }
      if ((e.ctrlKey || e.metaKey) && e.key === "p") { e.preventDefault(); handlePrint(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === "h" || e.key === "f")) { e.preventDefault(); setShowFindReplace(true); }
      if (e.key === "Escape") { setShowFindReplace(false); setSelectedPage(null); }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, documentTitle]);

  /* ── Margin helpers ─────────────────────────────────────────────────────── */
  const getPageMargins = useCallback((idx: number) => {
    const ov = perPageMargins[idx];
    return ov ? { ...margins, ...ov } : margins;
  }, [margins, perPageMargins]);

  const handleMarginsChange = useCallback((m: MarginSettings) => {
    if (m.applyTo === "current" && selectedPage !== null) {
      setPerPageMargins(prev => ({
        ...prev,
        [selectedPage]: { top: m.top, right: m.right, bottom: m.bottom, left: m.left },
      }));
    } else {
      setMargins(m);
      if (m.applyTo === "all") setPerPageMargins({});
    }
  }, [selectedPage]);

  /* ── Export ─────────────────────────────────────────────────────────────── */
  const handleExport = async (format: "docx" | "pdf" | "txt" | "html" | "md") => {
    if (!editor) return;
    const content = editor.getHTML();
    try {
      switch (format) {
        case "docx": await exportToDOCX(content, documentTitle, margins); break;
        case "pdf":  await exportToPDF(content, documentTitle, margins, pageSize, orientation); break;
        case "txt":  exportToTXT(content, documentTitle); break;
        case "html": exportToHTML(content, documentTitle, margins); break;
        case "md":   exportToMarkdown(content, documentTitle); break;
      }
    } catch (err) {
      console.error("Export failed:", err);
      alert("Export failed. Please try again.");
    }
  };

  /* ── Import ─────────────────────────────────────────────────────────────── */
  const handleImport = async (file: File) => {
    if (!editor) return;
    try {
      if (file.name.endsWith(".docx")) {
        editor.commands.setContent(await importDOCX(file));
        setDocumentTitle(file.name.replace(".docx", ""));
      } else if (file.name.endsWith(".txt")) {
        const text = await file.text();
        editor.commands.setContent(`<p>${text.replace(/\n/g, "</p><p>")}</p>`);
        setDocumentTitle(file.name.replace(".txt", ""));
      } else if (file.name.endsWith(".html")) {
        editor.commands.setContent(await file.text());
        setDocumentTitle(file.name.replace(".html", ""));
      }
    } catch (err) {
      console.error("Import failed:", err);
      alert("Import failed. Please ensure the file is valid.");
    }
  };

  const handlePrint = () => window.print();

  const handleNewDocument = () => {
    if (!confirm("Create a new document? Unsaved changes will be lost.")) return;
    editor?.commands.setContent("");
    setDocumentTitle("Untitled Document");
    setMargins(DEFAULT_MARGINS);
    setPerPageMargins({});
    localStorage.removeItem("wed-content");
    localStorage.removeItem("wed-title");
  };

  const handleInsertImage = useCallback((src: string, alt?: string) => {
    editor?.chain().focus().setImage({ src, alt: alt ?? "" }).run();
  }, [editor]);

  const handleInsertTable = () => {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  if (!editor) return <div className={styles.loading}>Loading editor…</div>;

  /* Margins for the active context (selected page or global) */
  const activeMargins = selectedPage !== null
    ? { ...getPageMargins(selectedPage), applyTo: "current" as const, unit: margins.unit }
    : margins;

  /* Padding for page 0 (where the editor lives) */
  const pm0 = getPageMargins(0);

  return (
    <div className={`${styles.container} ${darkMode ? styles.darkMode : ""}`}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.badge}>📝 Word Processor</div>
        <div className={styles.titleSection}>
          <input type="text" value={documentTitle} onChange={e => setDocumentTitle(e.target.value)}
            className={styles.documentTitle} placeholder="Document Title" />
          <p className={styles.description}>
            Professional online word processor — Create, edit &amp; export documents with ease
          </p>
        </div>
      </div>

      {/* ── Menu Bar ───────────────────────────────────────────────────── */}
      <MenuBar
        onNew={handleNewDocument} onImport={handleImport} onExport={handleExport}
        onPrint={handlePrint} darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(d => !d)}
        onToggleStylePanel={() => setShowStylePanel(s => !s)}
      />

      {/* ── Toolbar ────────────────────────────────────────────────────── */}
      <Toolbar
        editor={editor}
        onInsertImage={handleInsertImage}
        onInsertTable={handleInsertTable}
        onFind={() => setShowFindReplace(true)}
        margins={activeMargins}
        onMarginsChange={handleMarginsChange}
        selectedPage={selectedPage}
      />

      {showFindReplace && (
        <FindReplace editor={editor} onClose={() => setShowFindReplace(false)} />
      )}

      {/* ── Editor Wrapper ─────────────────────────────────────────────── */}
      <div className={styles.editorWrapper}>

        {/* Settings panel */}
        {showStylePanel && (
          <div className={styles.stylePanel}>
            <h3>Document Settings</h3>
            <div className={styles.setting}>
              <label>Page Size</label>
              <select value={pageSize} onChange={e => setPageSize(e.target.value as any)}>
                <option value="a4">A4 (210 × 297 mm)</option>
                <option value="letter">Letter (8.5 × 11 in)</option>
                <option value="legal">Legal (8.5 × 14 in)</option>
              </select>
            </div>
            <div className={styles.setting}>
              <label>Orientation</label>
              <select value={orientation} onChange={e => setOrientation(e.target.value as any)}>
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>
            <div className={styles.marginSummary}>
              <div className={styles.marginSummaryTitle}>
                {selectedPage !== null ? `Page ${selectedPage + 1} Margins` : "Default Margins"}
              </div>
              {(["top", "right", "bottom", "left"] as const).map(k => {
                const m = selectedPage !== null ? getPageMargins(selectedPage) : margins;
                const hasOv = selectedPage !== null && !!perPageMargins[selectedPage];
                return (
                  <div key={k} className={styles.marginSummaryRow}>
                    <span>{k.charAt(0).toUpperCase() + k.slice(1)}</span>
                    <span style={{ color: hasOv ? "#7eb3ff" : undefined }}>
                      {m[k]}{margins.unit}{hasOv ? " *" : ""}
                    </span>
                  </div>
                );
              })}
              {Object.keys(perPageMargins).length > 0 && (
                <button style={{ marginTop: 8, fontSize: 11, color: "#f87171", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  onClick={() => setPerPageMargins({})}>
                  Clear all page overrides
                </button>
              )}
            </div>
            {selectedPage !== null && (
              <p style={{ marginTop: 10, fontSize: 11, color: "#7eb3ff", fontStyle: "italic" }}>
                Page {selectedPage + 1} selected. Open Margins panel to set custom margins for this page.
              </p>
            )}
          </div>
        )}

        {/* ── Page Scroller ───────────────────────────────────────────── */}
        <div className={styles.pageScroller}>
          <div className={styles.pagesStack}>

            {/*
             * SINGLE EDITOR approach:
             * One continuous editor content area is placed inside the FIRST page,
             * without a height limit — it grows with content.
             * Additional pages are rendered below as SEPARATE visual sheets,
             * with a clipping window that shows the correct slice of the content.
             * A CSS transform is used to scroll the content upward in each page.
             */}

            {/* PAGE 0 — hosts the actual live editor */}
            <div
              className={`${styles.page} ${selectedPage === 0 ? styles.pageSelected : ""}`}
              style={{ width: pageWpx, height: pageHpx }}
              onClick={() => setSelectedPage(p => p === 0 ? null : 0)}
              data-page="1"
            >
              {/* Margin guide overlay */}
              <div className={styles.marginGuide} style={{
                top:    mmToPx(pm0.top),
                left:   mmToPx(pm0.left),
                right:  mmToPx(pm0.right),
                bottom: mmToPx(pm0.bottom),
              }} />

              {/* Editor content — clipped to content area */}
              <div style={{
                position: "absolute",
                top:    mmToPx(pm0.top),
                left:   mmToPx(pm0.left),
                right:  mmToPx(pm0.right),
                /* No bottom clip — content spills below, handled by pageCount */
                bottom: 0,
                overflow: "hidden",
              }}>
                <div ref={editorWrapRef} style={{ position: "relative" }}>
                  <EditorContent editor={editor} className={styles.editor} />
                </div>
              </div>

              {/* Page number */}
              <div className={styles.pageNum}>1</div>
              {perPageMargins[0] && <div className={styles.overrideTag}>custom margins</div>}
            </div>

            {/* PAGES 1+ — visual continuation sheets */}
            {Array.from({ length: pageCount - 1 }).map((_, i) => {
              const pageIdx = i + 1;
              const pm = getPageMargins(pageIdx);
              const isSelected = selectedPage === pageIdx;
              /* How far (in px) the content has scrolled for this page */
              const scrollOffset = pageIdx * contentHpx;

              return (
                <div
                  key={pageIdx}
                  className={`${styles.page} ${isSelected ? styles.pageSelected : ""}`}
                  style={{ width: pageWpx, height: pageHpx }}
                  onClick={() => setSelectedPage(p => p === pageIdx ? null : pageIdx)}
                  data-page={pageIdx + 1}
                >
                  {/* Margin guide overlay */}
                  <div className={styles.marginGuide} style={{
                    top:    mmToPx(pm.top),
                    left:   mmToPx(pm.left),
                    right:  mmToPx(pm.right),
                    bottom: mmToPx(pm.bottom),
                  }} />

                  {/*
                   * Mirror the editor content by cloning the editor DOM visually.
                   * We use a pointer-events:none div that positions the same editor element
                   * using a negative top offset — creating the illusion of page continuation.
                   * Editing still happens in page 0; this is purely visual.
                   */}
                  <div style={{
                    position: "absolute",
                    top:    mmToPx(pm.top),
                    left:   mmToPx(pm.left),
                    right:  mmToPx(pm.right),
                    bottom: mmToPx(pm.bottom),
                    overflow: "hidden",
                    pointerEvents: "none",
                  }}>
                    {editorWrapRef.current && (
                      <PageMirror
                        sourceRef={editorWrapRef}
                        scrollOffset={scrollOffset}
                        width={pageWpx - mmToPx(pm.left) - mmToPx(pm.right)}
                      />
                    )}
                  </div>

                  <div className={styles.pageNum}>{pageIdx + 1}</div>
                  {perPageMargins[pageIdx] && <div className={styles.overrideTag}>custom margins</div>}
                </div>
              );
            })}

          </div>

          {/* Info bar */}
          <div className={styles.pageInfo}>
            {pageCount} {pageCount === 1 ? "page" : "pages"} · {pageSize.toUpperCase()} · {orientation}
            {selectedPage !== null && (
              <span style={{ color: "#7eb3ff" }}> · Page {selectedPage + 1} selected (click again to deselect)</span>
            )}
          </div>
        </div>
      </div>

      <StatusBar editor={editor} />

      <div className={styles.seo}>
        <h2>Free Online Word Processor</h2>
        <p>Create and edit professional documents with our feature-rich online word processor. Export to DOCX, PDF, TXT, HTML, or Markdown. No installation required — everything runs in your browser.</p>
        <h2>Key Features</h2>
        <p>Rich text formatting, multiple fonts, text alignment, colours, highlights, bullet lists, tables with column resize, embedded images, audio, and video. Click any page to select it and apply per-page custom margins.</p>
        <h2>Privacy &amp; Security</h2>
        <p>All processing happens locally in your browser. Content is never uploaded. Documents auto-save to local storage.</p>
      </div>
    </div>
  );
}

/* ── PageMirror: renders a clone of the editor content offset by scrollOffset ── */
function PageMirror({
  sourceRef,
  scrollOffset,
  width,
}: {
  sourceRef: React.RefObject<HTMLDivElement | null>;
  scrollOffset: number;
  width: number;
}) {
  const mirrorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const src = sourceRef.current;
    const dest = mirrorRef.current;
    if (!src || !dest) return;

    /* Clone the editor DOM into the mirror div and apply negative translateY */
    const clone = src.cloneNode(true) as HTMLElement;
    clone.style.cssText = `
      transform: translateY(-${scrollOffset}px);
      width: ${width}px;
      pointer-events: none;
      user-select: none;
    `;
    /* Remove contenteditable from clone */
    clone.querySelectorAll("[contenteditable]").forEach(el => el.removeAttribute("contenteditable"));

    dest.innerHTML = "";
    dest.appendChild(clone);

    /* Re-clone whenever the source changes */
    const observer = new MutationObserver(() => {
      if (!src || !dest) return;
      const c = src.cloneNode(true) as HTMLElement;
      c.style.cssText = clone.style.cssText;
      c.querySelectorAll("[contenteditable]").forEach(el => el.removeAttribute("contenteditable"));
      dest.innerHTML = "";
      dest.appendChild(c);
    });
    observer.observe(src, { subtree: true, childList: true, characterData: true, attributes: true });
    return () => observer.disconnect();
  }, [sourceRef, scrollOffset, width]);

  return <div ref={mirrorRef} style={{ overflow: "hidden", width: "100%", height: "100%" }} />;
}