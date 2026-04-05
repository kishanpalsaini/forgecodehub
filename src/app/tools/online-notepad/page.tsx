"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useHotkeys } from "react-hotkeys-hook";

// Tiptap
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextAlign } from "@tiptap/extension-text-align";
import { Highlight } from "@tiptap/extension-highlight";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";

// react-markdown
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/* ── types ─────────────────────────────────────────────── */
type TabData = { id: string; title: string; content: string; pinned: boolean };

/* ── helpers ───────────────────────────────────────────── */
function uid() { return Math.random().toString(36).slice(2, 9); }
function newTab(o: Partial<TabData> = {}): TabData {
  return { id: uid(), title: "Untitled", content: "", pinned: false, ...o };
}
function readingTime(text: string) {
  const w = text.trim().split(/\s+/).filter(Boolean).length;
  return w < 200 ? "< 1 min" : `${Math.ceil(w / 200)} min`;
}

const FONTS  = ["Default","Arial","Courier New","Georgia","Helvetica","Monospace","Tahoma","Times New Roman","Trebuchet MS","Verdana"];
const SIZES  = [8,9,10,11,12,13,14,15,16,18,20,22,24,26,28,32,36,48,72];
const TCOLORS = ["#000000","#e53935","#43a047","#1e88e5","#fb8c00","#8e24aa","#00acc1","#795548","#607d8b","#ffffff"];
const HCOLORS = ["#fff9c4","#c8e6c9","#bbdefb","#ffe0b2","#e1bee7","#b2ebf2","#ffcdd2","#f8bbd0","#dcedc8","none"];
const SPECIAL = ["©","®","™","€","£","¥","°","±","×","÷","≤","≥","≠","≈","∞","√","∑","α","β","π","Ω","→","←","↑","↓","—","–","…","§","¶"];

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
export default function NotepadPage() {
  /* tabs */
  const [tabs, setTabs]         = useState<TabData[]>([newTab({ title: "Note 1" })]);
  const [activeId, setActiveId] = useState(tabs[0].id);
  const [renaming, setRenaming] = useState<string|null>(null);
  const [renameVal, setRenameVal] = useState("");

  /* UI state */
  const [darkMode, setDarkMode]     = useState(false);
  const [font, setFont]             = useState("Default");
  const [fontSize, setFontSize]     = useState(14);
  const [showPreview, setShowPreview] = useState(false);
  const [lineNums, setLineNums]     = useState(false);
  const [openMenu, setOpenMenu]     = useState<string|null>(null);
  const [openSub, setOpenSub]       = useState<string|null>(null);
  const [statusMsg, setStatusMsg]   = useState("");

  /* color pickers */
  const [showTC, setShowTC]   = useState(false);
  const [showHC, setShowHC]   = useState(false);
  const [curTC, setCurTC]     = useState("#000000");
  const [curHC, setCurHC]     = useState("#fff9c4");

  /* find/replace */
  const [showFind, setShowFind]       = useState(false);
  const [findText, setFindText]       = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [matchCase, setMatchCase]     = useState(false);

  /* special / shortcuts modals */
  const [showSpecial, setShowSpecial]     = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  /* diff */
  const [showDiff, setShowDiff]         = useState(false);
  const [diffSnapshot, setDiffSnapshot] = useState<string>("");

  const flash = useCallback((m: string) => {
    setStatusMsg(m);
    setTimeout(() => setStatusMsg(""), 2500);
  }, []);

  const editorWrapperRef = useRef<HTMLDivElement>(null);
  const fileInputRef     = useRef<HTMLInputElement>(null);

  /* ── active tab ──────────────────────────────────────── */
  const activeTab = tabs.find(t => t.id === activeId) ?? tabs[0];

  function updateTab(id: string, patch: Partial<TabData>) {
    setTabs(ts => ts.map(t => t.id === id ? { ...t, ...patch } : t));
  }

  /* ── Tiptap editor ───────────────────────────────────── */
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: activeTab.content || "<p></p>",
    editorProps: {
      attributes: {
        style: [
          "min-height:calc(100vh - 320px)",
          "padding:20px 24px",
          "outline:none",
          `font-size:${fontSize}px`,
          `font-family:${font === "Default" ? "system-ui,sans-serif" : font === "Monospace" ? "'Courier New',monospace" : font}`,
          "line-height:1.8",
          "color:#1a1a1a",
        ].join(";"),
      },
    },
    onUpdate({ editor }) {
      updateTab(activeId, { content: editor.getHTML() });
    },
    immediatelyRender: false,
  });

  /* update editor style when font/size changes */
  useEffect(() => {
    if (!editor) return;
    editor.setOptions({
      editorProps: {
        attributes: {
          style: [
            "min-height:calc(100vh - 320px)",
            "padding:20px 24px",
            "outline:none",
            `font-size:${fontSize}px`,
            `font-family:${font === "Default" ? "system-ui,sans-serif" : font === "Monospace" ? "'Courier New',monospace" : font}`,
            "line-height:1.8",
            "color:#1a1a1a",
          ].join(";"),
        },
      },
    });
  }, [font, fontSize, editor]);

  /* switch tab → load content into editor */
  useEffect(() => {
    if (!editor) return;
    const tab = tabs.find(t => t.id === activeId);
    if (!tab) return;
    if (editor.getHTML() !== tab.content) {
      editor.commands.setContent(tab.content || "<p></p>");
    }
  }, [activeId, editor]);

  /* persist */
  useEffect(() => {
    const saved = localStorage.getItem("fch-np-tabs");
    if (saved) { try { const p = JSON.parse(saved); if (p.length) { setTabs(p); setActiveId(p[0].id); } } catch {} }
  }, []);
  useEffect(() => {
    const t = setTimeout(() => localStorage.setItem("fch-np-tabs", JSON.stringify(tabs)), 700);
    return () => clearTimeout(t);
  }, [tabs]);

  /* close menus on outside click */
  useEffect(() => {
    const h = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest(".menu-root")) { setOpenMenu(null); setOpenSub(null); }
      if (!t.closest(".color-root")) { setShowTC(false); setShowHC(false); }
    };
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, []);

  /* ── stats (from plain text) ─────────────────────────── */
  const plainText = editor ? editor.getText() : "";
  const wordCount = plainText.trim() === "" ? 0 : plainText.trim().split(/\s+/).length;
  const charCount = plainText.length;
  const lineCount = plainText === "" ? 1 : plainText.split("\n").length;

  /* ── file ops ────────────────────────────────────────── */
  function newTabAction() {
    const t = newTab({ title: `Note ${tabs.length + 1}` });
    setTabs(ts => [...ts, t]); setActiveId(t.id);
  }
  function openFile() { fileInputRef.current?.click(); }
  async function handleFileRead(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    const name = file.name;
    const ext  = name.split(".").pop()?.toLowerCase() ?? "";

    // ── PDF: extract text via pdf.js ──────────────────────────────────────
    if (ext === "pdf") {
      flash("Reading PDF…");
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
        const arrayBuf = await file.arrayBuffer();
        const pdf  = await pdfjsLib.getDocument({ data: arrayBuf }).promise;
        let full = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page  = await pdf.getPage(i);
          const tc    = await page.getTextContent();
          const pageText = tc.items.map((it: any) => it.str).join(" ");
          full += `--- Page ${i} ---\n${pageText}\n\n`;
        }
        const content = full.split("\n").map(l => `<p>${l || "<br/>"}</p>`).join("");
        const t = newTab({ title: name, content });
        setTabs(ts => [...ts, t]); setActiveId(t.id);
        flash(`Opened PDF: ${name} (${pdf.numPages} pages)`);
      } catch {
        flash("PDF read failed — run: npm install pdfjs-dist");
      }
      return;
    }

    // ── Images: embed as <img> ────────────────────────────────────────────
    if (["png","jpg","jpeg","gif","webp","svg","bmp","ico"].includes(ext)) {
      const dataUrl = await new Promise<string>((res) => {
        const r = new FileReader();
        r.onload = ev => res(ev.target?.result as string);
        r.readAsDataURL(file);
      });
      const content = `<p><img src="${dataUrl}" alt="${name}" style="max-width:100%;border-radius:4px;" /></p><p>${name}</p>`;
      const t = newTab({ title: name, content });
      setTabs(ts => [...ts, t]); setActiveId(t.id);
      flash(`Opened image: ${name}`);
      return;
    }

    // ── HTML: load as rich content ────────────────────────────────────────
    if (["html","htm"].includes(ext)) {
      const raw = await file.text();
      const t = newTab({ title: name, content: raw });
      setTabs(ts => [...ts, t]); setActiveId(t.id);
      flash(`Opened: ${name}`);
      return;
    }

    // ── All other text-based files (jsx, tsx, ts, js, css, json, md,
    //    py, java, cpp, c, cs, go, rs, php, rb, sh, yaml, xml, csv…)
    //    Show in a <pre> block preserving whitespace & indentation ──────────
    try {
      const raw = await file.text();
      // Escape HTML entities so code renders safely inside Tiptap
      const escaped = raw
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
      const content = `<pre><code>${escaped}</code></pre>`;
      const t = newTab({ title: name, content });
      setTabs(ts => [...ts, t]); setActiveId(t.id);
      flash(`Opened: ${name}`);
    } catch {
      flash(`Cannot read file: ${name}`);
    }
  }
  function closeTab(id: string) {
    if (tabs.length === 1) { editor?.commands.clearContent(); updateTab(id, { content: "" }); return; }
    const idx = tabs.findIndex(t => t.id === id);
    const next = tabs[idx === 0 ? 1 : idx - 1];
    setTabs(ts => ts.filter(t => t.id !== id));
    setActiveId(next.id);
  }
  function saveFile() {
    const blob = new Blob([editor?.getHTML() ?? ""], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${activeTab.title}.html`; a.click();
    URL.revokeObjectURL(url);
    flash("Saved as .html");
  }
  function saveTxt() {
    const blob = new Blob([editor?.getText() ?? ""], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `${activeTab.title}.txt`; a.click();
    URL.revokeObjectURL(url);
    flash("Saved as .txt");
  }
  async function savePDF() {
    const el = editorWrapperRef.current?.querySelector(".ProseMirror") as HTMLElement | null;
    if (!el) { flash("Editor not ready"); return; }
    flash("Generating PDF…");
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      // Snapshot the live editor DOM — all colours, bold, highlights preserved
      const canvas = await html2canvas(el, {
        scale: 2,                  // retina quality
        useCORS: true,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: 0,
        windowWidth: el.scrollWidth,
        windowHeight: el.scrollHeight,
        width: el.scrollWidth,
        height: el.scrollHeight,
      });

      const imgData  = canvas.toDataURL("image/png");
      const pdfW     = 210;                              // A4 width mm
      const pdfH     = 297;                              // A4 height mm
      const margin   = 12;                               // mm
      const usableW  = pdfW - margin * 2;
      const imgW     = canvas.width;
      const imgH     = canvas.height;
      const ratio    = usableW / (imgW / 3.7795);        // px → mm at 96dpi
      const scaledH  = (imgH / 3.7795) * ratio;

      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      let yPos = margin;
      let remaining = scaledH;

      // Slice the image across multiple A4 pages if content is tall
      while (remaining > 0) {
        const pageH    = pdfH - margin * 2;
        const sliceH   = Math.min(remaining, pageH);
        const srcY     = (scaledH - remaining) / ratio * 3.7795;
        const srcSliceH = sliceH / ratio * 3.7795;

        // Create a slice canvas
        const slice = document.createElement("canvas");
        slice.width  = imgW;
        slice.height = Math.round(srcSliceH);
        const ctx = slice.getContext("2d")!;
        ctx.drawImage(canvas, 0, srcY, imgW, srcSliceH, 0, 0, imgW, srcSliceH);

        doc.addImage(slice.toDataURL("image/png"), "PNG", margin, yPos, usableW, sliceH);
        remaining -= pageH;
        if (remaining > 0) { doc.addPage(); yPos = margin; }
      }

      doc.save(`${activeTab.title}.pdf`);
      flash("PDF exported!");
    } catch (err) {
      console.error(err);
      flash("Error — run: npm install html2canvas jspdf");
    }
  }
  async function saveDocx() {
    try {
      const { Document, Packer, Paragraph: P, TextRun } = await import("docx");
      const { saveAs } = await import("file-saver");
      const doc = new Document({ sections: [{ children: (editor?.getText()??"").split("\n").map(l => new P({ children: [new TextRun(l)] })) }] });
      saveAs(await Packer.toBlob(doc), `${activeTab.title}.docx`);
      flash("Exported .docx");
    } catch { flash("npm install docx file-saver"); }
  }
  function printFile() { window.print(); }

  /* ── find / replace (operate on plain text, re-set HTML) */
  function doFind() {
    if (!editor || !findText) return;
    const txt = editor.getText();
    const idx = matchCase ? txt.indexOf(findText) : txt.toLowerCase().indexOf(findText.toLowerCase());
    flash(idx === -1 ? "Not found" : `Found at position ${idx}`);
  }
  function doReplaceAll() {
    if (!editor || !findText) return;
    const html = editor.getHTML();
    const flags = matchCase ? "g" : "gi";
    const re = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags);
    const count = (html.match(re) || []).length;
    editor.commands.setContent(html.replace(re, replaceText));
    flash(`Replaced ${count} occurrence(s)`);
  }
  function doReplaceOne() {
    if (!editor || !findText) return;
    const html = editor.getHTML();
    const flags = matchCase ? "" : "i";
    const re = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags);
    const newHtml = html.replace(re, replaceText);
    if (newHtml === html) { flash("Not found"); return; }
    editor.commands.setContent(newHtml);
    flash("Replaced 1 occurrence");
  }

  /* ── hotkeys ─────────────────────────────────────────── */
  useHotkeys("ctrl+s", () => saveFile(), { preventDefault: true });
  useHotkeys("ctrl+o", () => openFile(), { preventDefault: true });
  useHotkeys("ctrl+shift+s", () => saveTxt(), { preventDefault: true });
  useHotkeys("ctrl+n", () => newTabAction(), { preventDefault: true });
  useHotkeys("ctrl+p", () => printFile(), { preventDefault: true });
  useHotkeys("ctrl+f", () => setShowFind(f => !f), { preventDefault: true });
  useHotkeys("ctrl+m", () => setShowPreview(p => !p), { preventDefault: true });
  useHotkeys("ctrl+d", () => toggleDiff(), { preventDefault: true });

  function toggleDiff() {
    if (!showDiff) {
      // Take a snapshot of current plain text when opening diff
      setDiffSnapshot(editor?.getText() ?? "");
    }
    setShowDiff(d => !d);
    setShowPreview(false);
  }
  useHotkeys("ctrl+b", () => editor?.chain().focus().toggleBold().run(), { preventDefault: true });
  useHotkeys("ctrl+i", () => editor?.chain().focus().toggleItalic().run(), { preventDefault: true });
  useHotkeys("ctrl+u", () => editor?.chain().focus().toggleUnderline?.()?.run(), { preventDefault: true });

  /* ── theme vars ──────────────────────────────────────── */
  const bg      = darkMode ? "#0f1117" : "#f0f0f0";
  const surface = darkMode ? "#1a1d2e" : "#ffffff";
  const border  = darkMode ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.11)";
  const text_c  = darkMode ? "#e2e8f0" : "#1a1a1a";
  const muted   = darkMode ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.38)";
  const hover   = darkMode ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.055)";
  const menuBg  = darkMode ? "#1e2235" : "#ffffff";

  function BStyle(active = false) {
    return {
      background: active ? (darkMode ? "rgba(255,255,255,0.13)" : "rgba(0,0,0,0.09)") : "transparent",
      border: `1px solid ${active ? border : "transparent"}`,
      borderRadius: 5, padding: "3px 9px", fontSize: 12,
      fontWeight: (active ? 700 : 400) as any, cursor: "pointer",
      color: text_c, transition: "background 0.12s",
    };
  }

  /* ── menu data ───────────────────────────────────────── */
  const datetimeSub = [
    { label: "Date",        action: () => editor?.commands.insertContent(new Date().toLocaleDateString()) },
    { label: "Time",        action: () => editor?.commands.insertContent(new Date().toLocaleTimeString()) },
    { label: "Date & Time", action: () => editor?.commands.insertContent(new Date().toLocaleString()) },
  ];
  const menus = [
    { id:"file", label:"File", items:[
      { label:"New Tab",        action:newTabAction,                      icon:"🗋", sc:"Ctrl+N" },
      { label:"Open File…",     action:openFile,                          icon:"📂", sc:"Ctrl+O" },
      { sep:true },
      { label:"Save .html",     action:saveFile,                          icon:"💾", sc:"Ctrl+S" },
      { label:"Save .txt",      action:saveTxt,                           icon:"📄", sc:"Ctrl+Shift+S" },
      { label:"Export PDF",     action:savePDF,                           icon:"📕", sc:"" },
      { label:"Export .docx",   action:saveDocx,                          icon:"📝", sc:"" },
      { sep:true },
      { label:"Print",          action:printFile,                         icon:"🖨", sc:"Ctrl+P" },
    ]},
    { id:"edit", label:"Edit", items:[
      { label:"Undo",           action:()=>editor?.commands.undo(),       icon:"↩", sc:"Ctrl+Z" },
      { label:"Redo",           action:()=>editor?.commands.redo(),       icon:"↪", sc:"Ctrl+Y" },
      { sep:true },
      { label:"Bold",           action:()=>editor?.chain().focus().toggleBold().run(),       icon:"B",  sc:"Ctrl+B" },
      { label:"Italic",         action:()=>editor?.chain().focus().toggleItalic().run(),     icon:"I",  sc:"Ctrl+I" },
      { label:"Strike",         action:()=>editor?.chain().focus().toggleStrike().run(),     icon:"S",  sc:"" },
      { label:"Code",           action:()=>editor?.chain().focus().toggleCode().run(),       icon:"<>", sc:"" },
      { sep:true },
      { label:"Find & Replace", action:()=>setShowFind(f=>!f),            icon:"🔍", sc:"Ctrl+F" },
    ]},
    { id:"insert", label:"Insert", items:[
      { label:"Date/time",      sub:"dt",                                  icon:"📅" },
      { label:"Special char",   action:()=>setShowSpecial(true),           icon:"Ω"  },
      { label:"Horizontal rule",action:()=>editor?.chain().focus().setHorizontalRule().run(), icon:"—" },
      { label:"Code block",     action:()=>editor?.chain().focus().toggleCodeBlock().run(),   icon:"{ }" },
    ]},
    { id:"format", label:"Format", items:[
      { label:"Heading 1",  action:()=>editor?.chain().focus().toggleHeading({level:1}).run(), icon:"H1" },
      { label:"Heading 2",  action:()=>editor?.chain().focus().toggleHeading({level:2}).run(), icon:"H2" },
      { label:"Heading 3",  action:()=>editor?.chain().focus().toggleHeading({level:3}).run(), icon:"H3" },
      { sep:true },
      { label:"Bullet list",action:()=>editor?.chain().focus().toggleBulletList().run(),       icon:"•" },
      { label:"Ordered list",action:()=>editor?.chain().focus().toggleOrderedList().run(),      icon:"1." },
      { label:"Blockquote", action:()=>editor?.chain().focus().toggleBlockquote().run(),        icon:"❝" },
      { sep:true },
      { label:"Align left",   action:()=>editor?.chain().focus().setTextAlign("left").run(),   icon:"≡L" },
      { label:"Align center", action:()=>editor?.chain().focus().setTextAlign("center").run(), icon:"≡C" },
      { label:"Align right",  action:()=>editor?.chain().focus().setTextAlign("right").run(),  icon:"≡R" },
    ]},
    { id:"view", label:"View", items:[
      { label:(showPreview?"✓ ":"  ")+"Rich Preview",  action:()=>{ setShowPreview(p=>!p); setShowDiff(false); }, icon:"📖", sc:"Ctrl+M" },
      { label:(showDiff?"✓ ":"  ")+"Diff View",        action:toggleDiff,                                        icon:"⇄",  sc:"Ctrl+D" },
      { label:(lineNums?"✓ ":"  ")+"Line Numbers",     action:()=>setLineNums(l=>!l),                            icon:"#"  },
      { label:darkMode?"☀ Light":"🌙 Dark",            action:()=>setDarkMode(d=>!d),                            icon:""   },
    ]},
    { id:"help", label:"Help", items:[
      { label:"Shortcuts",   action:()=>setShowShortcuts(true),            icon:"⌨" },
      { label:"Homepage",    action:()=>window.open("/","_self"),           icon:"🏠" },
    ]},
  ];

  /* ── icon toolbar buttons ────────────────────────────── */
  const [tooltip, setTooltip] = useState<{label:string;x:number;y:number}|null>(null);
  const iconBtns = [
    { icon:"🗋", label:"New Tab",         action:newTabAction },
    { icon:"📂", label:"Open File",       action:openFile },
    { icon:"💾", label:"Save .html",      action:saveFile },
    { icon:"🖨", label:"Print",           action:printFile },
    null,
    { icon:"↩", label:"Undo",            action:()=>editor?.commands.undo() },
    { icon:"↪", label:"Redo",            action:()=>editor?.commands.redo() },
    null,
    { icon:"🔍", label:"Find & Replace",  action:()=>setShowFind(f=>!f) },
    { icon:"📖", label:"Rich Preview",    action:()=>{ setShowPreview(p=>!p); setShowDiff(false); } },
    { icon:"⇄",  label:"Diff View",       action:toggleDiff },
    null,
    { icon:"📕", label:"Export PDF",      action:savePDF },
    { icon:"📝", label:"Export .docx",    action:saveDocx },
  ];

  return (
    <div style={{background:"#252537"}}>
       <div style={{ minHeight:"100vh", background:bg, color:text_c, fontFamily:"system-ui,sans-serif", display:"flex", flexDirection:"column", maxWidth:"1400px", margin:"0 auto", boxShadow:"0 0 12px rgba(0,0,0,0.08)" }}>

      {/* Hidden file input for Open */}
      <input
        ref={fileInputRef}
        type="file"
        accept="*/*"
        style={{ display:"none" }}
        onChange={handleFileRead}
      />

      {/* ── GLOBAL EDITOR STYLES ── */}
      <style>{`
        .tiptap-editor { flex:1; overflow-y:auto; }
        .tiptap-editor:focus { outline:none; }
        .tiptap-editor p { margin:0 0 4px 0; min-height:1.4em; }
        .tiptap-editor h1 { font-size:2em; font-weight:700; margin:12px 0 6px; }
        .tiptap-editor h2 { font-size:1.5em; font-weight:700; margin:10px 0 5px; }
        .tiptap-editor h3 { font-size:1.25em; font-weight:600; margin:8px 0 4px; }
        .tiptap-editor ul { list-style:disc; padding-left:24px; margin:4px 0; }
        .tiptap-editor ol { list-style:decimal; padding-left:24px; margin:4px 0; }
        .tiptap-editor li { margin:2px 0; }
        .tiptap-editor li p { margin:0; }
        .tiptap-editor blockquote { border-left:3px solid #ccc; margin:6px 0; padding-left:16px; color:#666; }
        .tiptap-editor code { background:#f0f0f0; border-radius:3px; padding:1px 5px; font-family:'Courier New',monospace; font-size:0.9em; }
        .tiptap-editor pre { background:#1a1a1a; color:#e2e8f0; border-radius:6px; padding:12px 16px; overflow-x:auto; margin:6px 0; }
        .tiptap-editor pre code { background:transparent; color:inherit; }
        .tiptap-editor hr { border:none; border-top:2px solid #e0e0e0; margin:12px 0; }
        .tiptap-editor mark { border-radius:2px; }
        .tiptap-editor strong { font-weight:700; }
        .tiptap-editor em { font-style:italic; }
        .tiptap-editor s { text-decoration:line-through; }
        .tiptap-editor u { text-decoration:underline; }
        .ProseMirror-selectednode { outline:2px solid #1a1a1a; }
        .line-num-gutter { counter-reset:line; }
        .line-num-gutter p::before { counter-increment:line; content:counter(line); display:inline-block; width:36px; text-align:right; margin-right:16px; color:#aaa; font-family:'Courier New',monospace; font-size:12px; user-select:none; }

        /* ── Rich preview — identical rendering, read-only ── */
        .rich-preview { }
        .rich-preview p { margin:0 0 4px 0; min-height:1.4em; white-space:pre-wrap; }
        .rich-preview h1 { font-size:2em; font-weight:700; margin:12px 0 6px; }
        .rich-preview h2 { font-size:1.5em; font-weight:700; margin:10px 0 5px; }
        .rich-preview h3 { font-size:1.25em; font-weight:600; margin:8px 0 4px; }
        .rich-preview ul { list-style:disc; padding-left:28px; margin:4px 0; }
        .rich-preview ol { list-style:decimal; padding-left:28px; margin:4px 0; }
        .rich-preview li { margin:2px 0; }
        .rich-preview li p { margin:0; white-space:pre-wrap; }
        .rich-preview blockquote { border-left:3px solid #ccc; margin:6px 0; padding-left:16px; color:#666; }
        .rich-preview code { background:#f0f0f0; border-radius:3px; padding:1px 5px; font-family:'Courier New',monospace; font-size:0.9em; }
        .rich-preview pre { background:#1a1a1a; color:#e2e8f0; border-radius:6px; padding:12px 16px; overflow-x:auto; margin:6px 0; white-space:pre; }
        .rich-preview pre code { background:transparent; color:inherit; white-space:pre; }
        .rich-preview hr { border:none; border-top:2px solid #e0e0e0; margin:12px 0; }
        .rich-preview mark { border-radius:2px; }
        .rich-preview strong { font-weight:700; }
        .rich-preview em { font-style:italic; }
        .rich-preview s { text-decoration:line-through; }
        .rich-preview u { text-decoration:underline; }
        .rich-preview [style*="text-align:left"]   { text-align:left; }
        .rich-preview [style*="text-align:center"] { text-align:center; }
        .rich-preview [style*="text-align:right"]  { text-align:right; }
      `}</style>

      <div style={{display:"flex", alignItems:"center", justifyContent:"space-between" ,background:"#272537", borderBottom:"1px solid ${border}", padding:"10px 20px", flexShrink:0 }}>
         <Link href="/" className="logo">
          <div
            className="logo-icon"
            style={{ width: 22, height: 22, fontSize: 11 }}
          >
            ⚒
          </div>
          ForgeCodeHub
        </Link>
         <Link
          href="/"
          style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            fontSize: 12, fontWeight: 500, color: "rgb(232, 105, 42)",
            textDecoration: "none", padding: "6px 8px",
           borderRadius: 6,
            whiteSpace: "nowrap", transition: "color 0.15s, border-color 0.15s",
          }}
        >
          ← All Tools
        </Link>
      </div>

      {/* ── TOP BAR ── */}
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 20px", background:surface, borderBottom:`1px solid ${border}`, flexShrink:0 }}>
        <span style={{ fontWeight:700, fontSize:15 }}>📝 Notepad</span>
        {statusMsg && <span style={{ fontSize:11, color:"#e8692a", marginLeft:8 }}>{statusMsg}</span>}
        <div style={{ marginLeft:"auto", display:"flex", gap:8, alignItems:"center" }}>
          <select value={font} onChange={e=>setFont(e.target.value)} style={SS(surface,border,text_c,130)}>
            {FONTS.map(f=><option key={f}>{f}</option>)}
          </select>
          <select value={fontSize} onChange={e=>setFontSize(Number(e.target.value))} style={SS(surface,border,text_c,64)}>
            {SIZES.map(s=><option key={s}>{s}</option>)}
          </select>
          <button onClick={()=>setDarkMode(d=>!d)}
            style={{ padding:"5px 14px", fontSize:12, fontWeight:600, border:`1px solid ${border}`, borderRadius:6, background:darkMode?"#fff":"#1a1a1a", color:darkMode?"#000":"#fff", cursor:"pointer" }}>
            {darkMode?"☀":"🌙"}
          </button>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{ display:"flex", alignItems:"center", background:surface, borderBottom:`1px solid ${border}`, overflowX:"auto", flexShrink:0, padding:"0 20px" }}>
        {[...tabs.filter(t=>t.pinned),...tabs.filter(t=>!t.pinned)].map(tab=>(
          <div key={tab.id}
            style={{ display:"flex", alignItems:"center", gap:5, padding:"7px 14px", borderBottom:`2px solid ${tab.id===activeId?"#1a1a1a":"transparent"}`, cursor:"pointer", whiteSpace:"nowrap", fontSize:13, color:tab.id===activeId?text_c:muted, flexShrink:0 }}
            onClick={()=>setActiveId(tab.id)}
            onDoubleClick={()=>{ setRenaming(tab.id); setRenameVal(tab.title); }}
          >
            {tab.pinned && <span style={{fontSize:10}}>📌</span>}
            {renaming===tab.id ? (
              <input autoFocus value={renameVal} onChange={e=>setRenameVal(e.target.value)}
                onBlur={()=>{ updateTab(tab.id,{title:renameVal||tab.title}); setRenaming(null); }}
                onKeyDown={e=>{ if(e.key==="Enter"||e.key==="Escape"){ updateTab(tab.id,{title:renameVal||tab.title}); setRenaming(null); }}}
                onClick={e=>e.stopPropagation()}
                style={{ width:80, fontSize:12, border:`1px solid ${border}`, borderRadius:4, padding:"1px 5px", background:surface, color:text_c, outline:"none" }}
              />
            ) : <span>{tab.title}</span>}
            <button onClick={e=>{ e.stopPropagation(); updateTab(tab.id,{pinned:!tab.pinned}); }}
              style={{ background:"transparent", border:"none", cursor:"pointer", fontSize:9, color:muted, padding:0 }}>
              {tab.pinned?"🔓":"📌"}
            </button>
            {tabs.length>1 && (
              <button onClick={e=>{ e.stopPropagation(); closeTab(tab.id); }}
                style={{ background:"transparent", border:"none", cursor:"pointer", fontSize:12, color:muted, padding:"0 2px" }}>✕</button>
            )}
          </div>
        ))}
        <button onClick={newTabAction} style={{ padding:"7px 12px", background:"transparent", border:"none", cursor:"pointer", fontSize:18, color:muted }}>+</button>
      </div>

      {/* ── MENU BAR ── */}
      <div className="menu-root" style={{ display:"flex", alignItems:"center", padding:"2px 20px", background:surface, borderBottom:`1px solid ${border}`, gap:0, position:"relative", zIndex:200, flexShrink:0 }}>
        {menus.map(menu=>(
          <div key={menu.id} style={{position:"relative"}}>
            <button onClick={e=>{ e.stopPropagation(); setOpenMenu(o=>o===menu.id?null:menu.id); setOpenSub(null); }}
              style={{ background:openMenu===menu.id?hover:"transparent", border:"none", color:text_c, padding:"5px 11px", borderRadius:4, cursor:"pointer", fontSize:13, fontWeight:500 }}>
              {menu.label}
            </button>
            {openMenu===menu.id && (
              <div style={{ position:"absolute", top:"100%", left:0, background:menuBg, border:`1px solid ${border}`, borderRadius:7, minWidth:210, boxShadow:"0 8px 28px rgba(0,0,0,0.13)", zIndex:300, padding:"4px 0" }}>
                {(menu.items as any[]).map((item, i) =>
                  item.sep ? <div key={i} style={{height:1,background:border,margin:"4px 0"}}/> : (
                    <div key={i} style={{position:"relative"}} onMouseEnter={()=>item.sub?setOpenSub(item.sub):setOpenSub(null)}>
                      <button onClick={()=>{ if(!item.sub){ item.action?.(); setOpenMenu(null); setOpenSub(null); }}}
                        style={{ display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%", padding:"7px 16px", background:"transparent", border:"none", color:text_c, cursor:"pointer", fontSize:13, textAlign:"left" }}
                        onMouseEnter={e=>(e.currentTarget.style.background=hover)}
                        onMouseLeave={e=>(e.currentTarget.style.background="transparent")}
                      >
                        <span style={{display:"flex",alignItems:"center",gap:9}}>
                          <span style={{width:18,textAlign:"center",fontSize:12,fontWeight:600}}>{item.icon}</span>
                          {item.label}
                        </span>
                        <span style={{fontSize:11,color:muted,marginLeft:12,whiteSpace:"nowrap"}}>{item.sub?"▶":item.sc}</span>
                      </button>
                      {item.sub==="dt" && openSub==="dt" && (
                        <div style={{ position:"absolute", top:0, left:"100%", background:menuBg, border:`1px solid ${border}`, borderRadius:7, minWidth:140, boxShadow:"0 8px 24px rgba(0,0,0,0.13)", zIndex:400, padding:"4px 0" }}>
                          {datetimeSub.map((s,si)=>(
                            <button key={si} onClick={()=>{ s.action?.(); setOpenMenu(null); setOpenSub(null); }}
                              style={{ display:"block", width:"100%", padding:"7px 16px", background:"transparent", border:"none", color:text_c, cursor:"pointer", fontSize:13, textAlign:"left" }}
                              onMouseEnter={e=>(e.currentTarget.style.background=hover)}
                              onMouseLeave={e=>(e.currentTarget.style.background="transparent")}
                            >{s.label}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── ICON TOOLBAR ── */}
      <div style={{ display:"flex", alignItems:"center", gap:1, padding:"5px 20px", background:surface, borderBottom:`1px solid ${border}`, flexWrap:"wrap", flexShrink:0 }}>
        {iconBtns.map((btn,i)=>
          btn===null ? <div key={i} style={{width:1,height:22,background:border,margin:"0 5px"}}/> : (
            <button key={i} onClick={(btn as any).action}
              onMouseEnter={e=>{ const r=e.currentTarget.getBoundingClientRect(); setTooltip({label:(btn as any).label,x:r.left+r.width/2,y:r.bottom+6}); e.currentTarget.style.background=hover; }}
              onMouseLeave={e=>{ setTooltip(null); e.currentTarget.style.background="transparent"; }}
              style={{ background:"transparent", border:"1px solid transparent", borderRadius:5, padding:"4px 7px", fontSize:15, cursor:"pointer", color:text_c }}>
              {(btn as any).icon}
            </button>
          )
        )}
      </div>

      {/* ── FORMATTING TOOLBAR ── */}
      <div className="color-root" style={{ display:"flex", alignItems:"center", gap:3, padding:"5px 20px", background:surface, borderBottom:`1px solid ${border}`, flexWrap:"wrap", flexShrink:0 }}>

        {/* B I S */}
        <button onClick={()=>editor?.chain().focus().toggleBold().run()}
          style={{...BStyle(editor?.isActive("bold")), fontWeight:700, width:28, textAlign:"center"}} title="Bold (Ctrl+B)"
          onMouseEnter={e=>(e.currentTarget.style.background=hover)} onMouseLeave={e=>(e.currentTarget.style.background=editor?.isActive("bold")?hover:"transparent")}>B</button>
        <button onClick={()=>editor?.chain().focus().toggleItalic().run()}
          style={{...BStyle(editor?.isActive("italic")), fontStyle:"italic", width:28, textAlign:"center"}} title="Italic (Ctrl+I)"
          onMouseEnter={e=>(e.currentTarget.style.background=hover)} onMouseLeave={e=>(e.currentTarget.style.background=editor?.isActive("italic")?hover:"transparent")}>I</button>
        <button onClick={()=>editor?.chain().focus().toggleUnderline?.()?.run()}
          style={{...BStyle(editor?.isActive("underline")), textDecoration:"underline", width:28, textAlign:"center"}} title="Underline (Ctrl+U)"
          onMouseEnter={e=>(e.currentTarget.style.background=hover)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>U</button>
        <button onClick={()=>editor?.chain().focus().toggleStrike().run()}
          style={{...BStyle(editor?.isActive("strike")), textDecoration:"line-through", width:28, textAlign:"center"}} title="Strikethrough"
          onMouseEnter={e=>(e.currentTarget.style.background=hover)} onMouseLeave={e=>(e.currentTarget.style.background=editor?.isActive("strike")?hover:"transparent")}>S</button>
        <button onClick={()=>editor?.chain().focus().toggleCode().run()}
          style={{...BStyle(editor?.isActive("code")), fontFamily:"monospace", width:28, textAlign:"center", fontSize:11}} title="Inline code"
          onMouseEnter={e=>(e.currentTarget.style.background=hover)} onMouseLeave={e=>(e.currentTarget.style.background=editor?.isActive("code")?hover:"transparent")}>{`</>`}</button>

        <div style={{width:1,height:22,background:border,margin:"0 5px"}}/>

        {/* Headings */}
        {([1,2,3] as const).map(l=>(
          <button key={l} onClick={()=>editor?.chain().focus().toggleHeading({level:l}).run()}
            style={{...BStyle(editor?.isActive("heading",{level:l})), fontSize:11, padding:"3px 8px"}} title={`Heading ${l}`}
            onMouseEnter={e=>(e.currentTarget.style.background=hover)} onMouseLeave={e=>(e.currentTarget.style.background=editor?.isActive("heading",{level:l})?hover:"transparent")}>H{l}</button>
        ))}

        <div style={{width:1,height:22,background:border,margin:"0 5px"}}/>

        {/* Lists */}
        <button onClick={()=>editor?.chain().focus().toggleBulletList().run()}
          style={{...BStyle(editor?.isActive("bulletList")), fontSize:13, padding:"3px 8px"}} title="Bullet list"
          onMouseEnter={e=>(e.currentTarget.style.background=hover)} onMouseLeave={e=>(e.currentTarget.style.background=editor?.isActive("bulletList")?hover:"transparent")}>• List</button>
        <button onClick={()=>editor?.chain().focus().toggleOrderedList().run()}
          style={{...BStyle(editor?.isActive("orderedList")), fontSize:13, padding:"3px 8px"}} title="Ordered list"
          onMouseEnter={e=>(e.currentTarget.style.background=hover)} onMouseLeave={e=>(e.currentTarget.style.background=editor?.isActive("orderedList")?hover:"transparent")}>1. List</button>
        <button onClick={()=>editor?.chain().focus().toggleBlockquote().run()}
          style={{...BStyle(editor?.isActive("blockquote")), fontSize:13, padding:"3px 8px"}} title="Blockquote"
          onMouseEnter={e=>(e.currentTarget.style.background=hover)} onMouseLeave={e=>(e.currentTarget.style.background=editor?.isActive("blockquote")?hover:"transparent")}>❝</button>

        <div style={{width:1,height:22,background:border,margin:"0 5px"}}/>

        {/* Alignment — works on selected text via Tiptap TextAlign */}
        {(["left","center","right"] as const).map(dir=>(
          <button key={dir} onClick={()=>editor?.chain().focus().setTextAlign(dir).run()}
            style={{...BStyle(editor?.isActive({textAlign:dir})), fontSize:12, padding:"3px 10px"}} title={`Align ${dir}`}
            onMouseEnter={e=>(e.currentTarget.style.background=hover)} onMouseLeave={e=>(e.currentTarget.style.background=editor?.isActive({textAlign:dir})?hover:"transparent")}>
            {dir==="left"?"≡L":dir==="center"?"≡C":"≡R"}
          </button>
        ))}

        <div style={{width:1,height:22,background:border,margin:"0 5px"}}/>

        {/* Text Color picker */}
        <div style={{position:"relative"}}>
          <button onClick={e=>{ e.stopPropagation(); setShowTC(v=>!v); setShowHC(false); }}
            style={{...BStyle(), display:"flex", alignItems:"center", gap:5, padding:"3px 9px"}} title="Text color"
            onMouseEnter={e=>(e.currentTarget.style.background=hover)} onMouseLeave={e=>(e.currentTarget.style.background="transparent")}>
            <span style={{fontWeight:800, color:curTC, textShadow:curTC==="#ffffff"?"0 0 2px #000":"none"}}>A</span>
            <span style={{display:"block", width:14, height:3, background:curTC, borderRadius:2, border:`1px solid ${border}`}}/>
            <span style={{fontSize:10, color:muted}}>▼</span>
          </button>
          {showTC && (
            <div style={{ position:"absolute", top:"110%", left:0, background:menuBg, border:`1px solid ${border}`, borderRadius:8, padding:12, zIndex:300, boxShadow:"0 8px 24px rgba(0,0,0,0.14)", minWidth:200 }}>
              <div style={{fontSize:11,color:muted,marginBottom:8,fontWeight:600}}>Text Color</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
                {TCOLORS.map(c=>(
                  <button key={c} onClick={()=>{ editor?.chain().focus().setColor(c).run(); setCurTC(c); setShowTC(false); }}
                    style={{width:26,height:26,borderRadius:5,background:c,border:c===curTC?`2px solid #1a1a1a`:`1px solid ${border}`,cursor:"pointer",boxShadow:c==="#ffffff"?"inset 0 0 0 1px #ccc":"none"}}/>
                ))}
              </div>
              <input type="color" value={curTC} onChange={e=>{ setCurTC(e.target.value); editor?.chain().focus().setColor(e.target.value).run(); }}
                style={{width:"100%",height:28,border:`1px solid ${border}`,borderRadius:5,cursor:"pointer",background:"transparent"}}/>
              <button onClick={()=>{ editor?.chain().focus().unsetColor().run(); setCurTC("#000000"); setShowTC(false); }}
                style={{marginTop:6,fontSize:11,color:muted,background:"transparent",border:"none",cursor:"pointer"}}>✕ Remove color</button>
            </div>
          )}
        </div>

        {/* Highlight Color picker */}
        <div style={{position:"relative"}}>
          <button onClick={e=>{ e.stopPropagation(); setShowHC(v=>!v); setShowTC(false); }}
            style={{...BStyle(editor?.isActive("highlight")), display:"flex", alignItems:"center", gap:5, padding:"3px 9px"}} title="Highlight color"
            onMouseEnter={e=>(e.currentTarget.style.background=hover)} onMouseLeave={e=>(e.currentTarget.style.background=editor?.isActive("highlight")?hover:"transparent")}>
            <span style={{display:"block", width:16, height:13, background:curHC==="none"?"repeating-linear-gradient(45deg,#ccc 0,#ccc 2px,#fff 0,#fff 6px)":curHC, borderRadius:3, border:`1px solid ${border}`}}/>
            <span style={{fontSize:12}}>H</span>
            <span style={{fontSize:10,color:muted}}>▼</span>
          </button>
          {showHC && (
            <div style={{ position:"absolute", top:"110%", left:0, background:menuBg, border:`1px solid ${border}`, borderRadius:8, padding:12, zIndex:300, boxShadow:"0 8px 24px rgba(0,0,0,0.14)", minWidth:200 }}>
              <div style={{fontSize:11,color:muted,marginBottom:8,fontWeight:600}}>Highlight Color</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {HCOLORS.map(c=>(
                  <button key={c} onClick={()=>{
                    if(c==="none"){ editor?.chain().focus().unsetHighlight().run(); }
                    else { editor?.chain().focus().setHighlight({color:c}).run(); }
                    setCurHC(c); setShowHC(false);
                  }}
                    style={{width:26,height:26,borderRadius:5,background:c==="none"?"repeating-linear-gradient(45deg,#ccc 0,#ccc 2px,#fff 0,#fff 6px)":c,border:c===curHC?`2px solid #1a1a1a`:`1px solid ${border}`,cursor:"pointer"}}/>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{width:1,height:22,background:border,margin:"0 5px"}}/>

        {/* Quick toggles */}
        <button onClick={()=>setShowFind(f=>!f)} style={{...BStyle(showFind), fontSize:12, padding:"3px 10px"}}
          onMouseEnter={e=>(e.currentTarget.style.background=hover)} onMouseLeave={e=>(e.currentTarget.style.background=showFind?hover:"transparent")}>🔍 Find</button>
        <button onClick={()=>setLineNums(l=>!l)} style={{...BStyle(lineNums), fontSize:12, padding:"3px 10px"}}
          onMouseEnter={e=>(e.currentTarget.style.background=hover)} onMouseLeave={e=>(e.currentTarget.style.background=lineNums?hover:"transparent")}># Lines</button>
        <button onClick={()=>{ setShowPreview(p=>!p); setShowDiff(false); }} style={{...BStyle(showPreview), fontSize:12, padding:"3px 10px"}}
          onMouseEnter={e=>(e.currentTarget.style.background=hover)} onMouseLeave={e=>(e.currentTarget.style.background=showPreview?hover:"transparent")}>📖 Preview</button>
        <button onClick={toggleDiff} style={{...BStyle(showDiff), fontSize:12, padding:"3px 10px"}}
          onMouseEnter={e=>(e.currentTarget.style.background=hover)} onMouseLeave={e=>(e.currentTarget.style.background=showDiff?hover:"transparent")}>⇄ Diff</button>
      </div>

      {/* ── FIND & REPLACE ── */}
      {showFind && (
        <div style={{ display:"flex", alignItems:"center", flexWrap:"wrap", gap:8, padding:"7px 20px", background:darkMode?"#12151f":"#e8e8e8", borderBottom:`1px solid ${border}`, flexShrink:0 }}>
          <div style={{display:"flex",alignItems:"center",gap:5,background:surface,border:`1px solid ${border}`,borderRadius:6,padding:"3px 10px"}}>
            <input placeholder="Find…" value={findText} onChange={e=>setFindText(e.target.value)}
              onKeyDown={e=>{ if(e.key==="Enter") doFind(); }}
              style={{border:"none",outline:"none",background:"transparent",color:text_c,fontSize:12,width:140}}/>
            <button onClick={doFind} title="Find (Enter)"   style={{background:"transparent",border:"none",cursor:"pointer",fontSize:14,color:text_c}}>↓</button>
          </div>
          <label style={{display:"flex",alignItems:"center",gap:4,fontSize:12,color:muted,cursor:"pointer"}}>
            <input type="checkbox" checked={matchCase} onChange={e=>setMatchCase(e.target.checked)}/> Case
          </label>
          <div style={{display:"flex",alignItems:"center",gap:5,background:surface,border:`1px solid ${border}`,borderRadius:6,padding:"3px 10px"}}>
            <input placeholder="Replace with…" value={replaceText} onChange={e=>setReplaceText(e.target.value)}
              style={{border:"none",outline:"none",background:"transparent",color:text_c,fontSize:12,width:140}}/>
          </div>
          <button onClick={doReplaceOne} style={SB(border,text_c)}>Replace</button>
          <button onClick={doReplaceAll} style={{...SB(border,text_c),background:"#1a1a1a",color:"#fff",borderColor:"#1a1a1a"}}>Replace All</button>
          <button onClick={()=>setShowFind(false)} style={{...SB(border,muted),marginLeft:"auto"}}>✕</button>
        </div>
      )}

      {/* ── EDITOR AREA ── */}
      <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
        <div style={{ flex:1, display:"flex", overflow:"hidden", margin:"16px 20px", gap:12 }}>

          {/* Tiptap editor pane */}
          <div ref={editorWrapperRef} style={{ flex:1, display:"flex", flexDirection:"column", background:"#ffffff", border:`1px solid ${border}`, borderRadius:8, overflow:"auto", boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}>
            <EditorContent
              editor={editor}
              className={`tiptap-editor${lineNums?" line-num-gutter":""}`}
            />
          </div>

          {/* ── Rich Preview pane — renders exact same HTML as editor ── */}
          {showPreview && (
            <div style={{ flex:1, background:"#ffffff", border:`1px solid ${border}`, borderRadius:8, overflow:"auto", boxShadow:"0 2px 12px rgba(0,0,0,0.06)", display:"flex", flexDirection:"column" }}>
              <div style={{ padding:"10px 18px", borderBottom:`1px solid ${border}`, fontSize:11, fontWeight:600, color:muted, textTransform:"uppercase", letterSpacing:1, background:"#fafafa", borderRadius:"8px 8px 0 0", flexShrink:0 }}>
                📖 Rich Preview — exact output
              </div>
              <div
                className="rich-preview"
                style={{ flex:1, padding:"20px 24px", fontSize:fontSize, fontFamily: font === "Default" ? "system-ui,sans-serif" : font === "Monospace" ? "'Courier New',monospace" : font, lineHeight:1.8, color:"#1a1a1a", overflow:"auto", pointerEvents:"none", userSelect:"none" }}
                dangerouslySetInnerHTML={{ __html: editor?.getHTML() ?? "" }}
              />
            </div>
          )}

          {/* ── Diff pane ── */}
          {showDiff && (
            <div style={{ flex:1, background:"#ffffff", border:`1px solid ${border}`, borderRadius:8, overflow:"hidden", boxShadow:"0 2px 12px rgba(0,0,0,0.06)", display:"flex", flexDirection:"column" }}>
              {/* Diff header */}
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 16px", borderBottom:`1px solid ${border}`, background:"#fafafa", borderRadius:"8px 8px 0 0", flexShrink:0 }}>
                <span style={{ fontSize:11, fontWeight:600, color:muted, textTransform:"uppercase", letterSpacing:1 }}>⇄ Diff — snapshot vs current</span>
                <button
                  onClick={() => setDiffSnapshot(editor?.getText() ?? "")}
                  style={{ fontSize:11, padding:"3px 10px", border:`1px solid ${border}`, borderRadius:5, background:"transparent", color:text_c, cursor:"pointer" }}
                  onMouseEnter={e=>(e.currentTarget.style.background=hover)}
                  onMouseLeave={e=>(e.currentTarget.style.background="transparent")}
                  title="Reset snapshot to current content"
                >↺ Reset snapshot</button>
              </div>

              {/* Legend */}
              <div style={{ display:"flex", gap:16, padding:"6px 16px", borderBottom:`1px solid ${border}`, fontSize:11, color:muted, background:"#fafafa", flexShrink:0 }}>
                <span><span style={{ background:"rgba(229,57,53,0.18)", padding:"1px 6px", borderRadius:3 }}>— removed</span></span>
                <span><span style={{ background:"rgba(67,160,71,0.18)", padding:"1px 6px", borderRadius:3 }}>+ added</span></span>
                <span style={{ marginLeft:"auto" }}>
                  Snapshot: <b style={{ color:text_c }}>{diffSnapshot.trim().split(/\s+/).filter(Boolean).length}</b> words → Current: <b style={{ color:text_c }}>{plainText.trim().split(/\s+/).filter(Boolean).length}</b> words
                </span>
              </div>

              {/* Diff lines */}
              <div style={{ flex:1, overflow:"auto", fontFamily:"'Courier New',monospace", fontSize:13 }}>
                <DiffView original={diffSnapshot} modified={editor?.getText() ?? ""} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── STATUS BAR ── */}
      <div style={{ display:"flex", alignItems:"center", gap:20, padding:"5px 24px", background:surface, borderTop:`1px solid ${border}`, fontSize:11, color:muted, flexWrap:"wrap", flexShrink:0 }}>
        <span>Words: <b style={{color:text_c}}>{wordCount}</b></span>
        <span>Characters: <b style={{color:text_c}}>{charCount}</b></span>
        <span>Lines: <b style={{color:text_c}}>{lineCount}</b></span>
        <span>Reading time: <b style={{color:text_c}}>{readingTime(plainText)}</b></span>
        <span style={{marginLeft:"auto"}}>{font} · {fontSize}px</span>
      </div>

      {/* ── TOOLTIP ── */}
      {tooltip && (
        <div style={{ position:"fixed", left:tooltip.x, top:tooltip.y, transform:"translateX(-50%)", background:"#1a1a1a", color:"#fff", fontSize:11, padding:"4px 10px", borderRadius:5, pointerEvents:"none", zIndex:999, whiteSpace:"nowrap" }}>
          {tooltip.label}
        </div>
      )}

      {/* ── SPECIAL CHARS MODAL ── */}
      {showSpecial && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowSpecial(false)}>
          <div onClick={e=>e.stopPropagation()} style={{background:menuBg,border:`1px solid ${border}`,borderRadius:10,padding:24,minWidth:360,boxShadow:"0 16px 40px rgba(0,0,0,0.2)"}}>
            <div style={{fontWeight:700,fontSize:15,marginBottom:14,color:text_c}}>Special Characters</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {SPECIAL.map(c=>(
                <button key={c} onClick={()=>{ editor?.commands.insertContent(c); setShowSpecial(false); }}
                  style={{width:40,height:40,fontSize:18,background:darkMode?"#12151f":"#f5f5f5",border:`1px solid ${border}`,borderRadius:6,cursor:"pointer",color:text_c}}
                  onMouseEnter={e=>(e.currentTarget.style.background=hover)}
                  onMouseLeave={e=>(e.currentTarget.style.background=darkMode?"#12151f":"#f5f5f5")}
                >{c}</button>
              ))}
            </div>
            <button onClick={()=>setShowSpecial(false)} style={{marginTop:14,padding:"6px 16px",background:"transparent",border:`1px solid ${border}`,borderRadius:6,color:muted,cursor:"pointer",fontSize:12}}>Close</button>
          </div>
        </div>
      )}

      {/* ── SHORTCUTS MODAL ── */}
      {showShortcuts && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowShortcuts(false)}>
          <div onClick={e=>e.stopPropagation()} style={{background:menuBg,border:`1px solid ${border}`,borderRadius:10,padding:28,minWidth:360,boxShadow:"0 16px 40px rgba(0,0,0,0.2)",maxHeight:"80vh",overflow:"auto"}}>
            <div style={{fontWeight:700,fontSize:16,marginBottom:18,color:text_c}}>⌨ Keyboard Shortcuts</div>
            {[
              ["Ctrl+N","New Tab"],["Ctrl+O","Open File"],["Ctrl+S","Save .html"],["Ctrl+Shift+S","Save .txt"],["Ctrl+P","Print"],
              ["Ctrl+Z","Undo"],["Ctrl+Y","Redo"],
              ["Ctrl+B","Bold"],["Ctrl+I","Italic"],
              ["Ctrl+F","Find & Replace"],["Ctrl+M","Rich Preview"],["Ctrl+D","Diff View"],
            ].map(([k,d])=>(
              <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${border}`,fontSize:13}}>
                <span style={{color:muted}}>{d}</span>
                <kbd style={{background:darkMode?"#12151f":"#f0f0f0",border:`1px solid ${border}`,borderRadius:4,padding:"2px 8px",fontSize:11,color:text_c,fontFamily:"monospace"}}>{k}</kbd>
              </div>
            ))}
            <button onClick={()=>setShowShortcuts(false)} style={{marginTop:16,padding:"6px 16px",background:"transparent",border:`1px solid ${border}`,borderRadius:6,color:muted,cursor:"pointer",fontSize:12}}>Close</button>
          </div>
        </div>
      )}
    </div>
    </div>
   
  );
}

function SS(s:string,b:string,t:string,w:number){
  return {padding:"4px 8px",fontSize:12,border:`1px solid ${b}`,borderRadius:5,background:s,color:t,cursor:"pointer",outline:"none",width:w};
}
function SB(b:string,t:string){
  return {padding:"5px 12px",fontSize:12,fontWeight:600 as const,border:`1px solid ${b}`,borderRadius:5,background:"transparent",color:t,cursor:"pointer"};
}

/* ── DiffView component ─────────────────────────────────────────────────────
   Line-by-line diff using a simple LCS-based algorithm.
   Green  = added lines, Red = removed lines, plain = unchanged.
─────────────────────────────────────────────────────────────────────────── */
function DiffView({ original, modified }: { original: string; modified: string }) {
  const origLines = original === "" ? [] : original.split("\n");
  const modLines  = modified  === "" ? [] : modified.split("\n");

  // Build LCS table
  const m = origLines.length, n = modLines.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = m - 1; i >= 0; i--)
    for (let j = n - 1; j >= 0; j--)
      dp[i][j] = origLines[i] === modLines[j]
        ? dp[i+1][j+1] + 1
        : Math.max(dp[i+1][j], dp[i][j+1]);

  // Backtrack to build diff
  type DiffLine = { type: "same"|"del"|"add"; text: string; origLine?: number; modLine?: number };
  const diff: DiffLine[] = [];
  let i = 0, j = 0, origN = 1, modN = 1;
  while (i < m || j < n) {
    if (i < m && j < n && origLines[i] === modLines[j]) {
      diff.push({ type:"same", text: origLines[i], origLine: origN++, modLine: modN++ }); i++; j++;
    } else if (j < n && (i >= m || dp[i][j+1] >= dp[i+1][j])) {
      diff.push({ type:"add",  text: modLines[j],  modLine: modN++ }); j++;
    } else {
      diff.push({ type:"del",  text: origLines[i], origLine: origN++ }); i++;
    }
  }

  if (diff.length === 0)
    return <div style={{ padding:24, color:"#aaa", fontSize:13 }}>No snapshot yet — close and reopen Diff to capture a snapshot.</div>;

  const unchanged = diff.filter(d => d.type === "same").length;
  const added     = diff.filter(d => d.type === "add").length;
  const removed   = diff.filter(d => d.type === "del").length;

  return (
    <div>
      {/* summary bar */}
      <div style={{ display:"flex", gap:16, padding:"6px 12px", fontSize:11, borderBottom:"1px solid #eee", background:"#fafafa" }}>
        <span style={{ color:"#43a047" }}>+{added} added</span>
        <span style={{ color:"#e53935" }}>−{removed} removed</span>
        <span style={{ color:"#aaa" }}>{unchanged} unchanged</span>
      </div>
      {diff.map((line, idx) => {
        const isAdd = line.type === "add";
        const isDel = line.type === "del";
        return (
          <div key={idx} style={{
            display:"flex", alignItems:"stretch",
            background: isAdd ? "rgba(67,160,71,0.10)" : isDel ? "rgba(229,57,53,0.10)" : "transparent",
            borderLeft: isAdd ? "3px solid #43a047" : isDel ? "3px solid #e53935" : "3px solid transparent",
          }}>
            {/* line numbers */}
            <div style={{ display:"flex", flexShrink:0, userSelect:"none" }}>
              <span style={{ width:40, textAlign:"right", padding:"1px 8px", color:"#bbb", fontSize:11, lineHeight:"1.7" }}>
                {line.origLine ?? ""}
              </span>
              <span style={{ width:40, textAlign:"right", padding:"1px 8px", color:"#bbb", fontSize:11, lineHeight:"1.7", borderRight:"1px solid #eee" }}>
                {line.modLine ?? ""}
              </span>
            </div>
            {/* sign */}
            <span style={{ padding:"1px 6px", color: isAdd ? "#43a047" : isDel ? "#e53935" : "#ccc", fontWeight:700, fontSize:12, lineHeight:"1.7", flexShrink:0 }}>
              {isAdd ? "+" : isDel ? "−" : " "}
            </span>
            {/* content */}
            <span style={{
              padding:"1px 8px 1px 2px",
              whiteSpace:"pre-wrap", wordBreak:"break-all",
              color: isAdd ? "#2e7d32" : isDel ? "#c62828" : "#333",
              fontSize:13, lineHeight:"1.7", flex:1,
            }}>
              {line.text || " "}
            </span>
          </div>
        );
      })}
    </div>
  );
}