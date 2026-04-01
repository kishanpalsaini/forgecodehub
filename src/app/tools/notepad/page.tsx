"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const FONTS = [
  "Default","Arial","Courier New","Georgia","Helvetica",
  "Monospace","Palatino","Tahoma","Times New Roman","Trebuchet MS","Verdana",
];
const SIZES = [8,9,10,11,12,13,14,15,16,18,20,22,24,26,28,32,36,48,72];

export default function NotepadPage() {
  const [text, setText]             = useState("");
  const [fontSize, setFontSize]     = useState(14);
  const [font, setFont]             = useState("Default");
  const [darkMode, setDarkMode]     = useState(true);
  const [saved, setSaved]           = useState(false);
  const [wordWrap, setWordWrap]     = useState(true);
  const [showFind, setShowFind]     = useState(false);
  const [findText, setFindText]     = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [statusMsg, setStatusMsg]   = useState("");
  const [openMenu, setOpenMenu]     = useState<string|null>(null);
  const [history, setHistory]       = useState<string[]>([""]);
  const [histIdx, setHistIdx]       = useState(0);
  const skipHistory                 = useRef(false);
  const textareaRef                 = useRef<HTMLTextAreaElement>(null);
  const fileInputRef                = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const s = localStorage.getItem("fch-notepad-v2");
    if (s) { setText(s); setHistory([s]); }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      localStorage.setItem("fch-notepad-v2", text);
      setSaved(true); setTimeout(() => setSaved(false), 1500);
    }, 800);
    return () => clearTimeout(t);
  }, [text]);

  useEffect(() => {
    const h = () => setOpenMenu(null);
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, []);

  function handleChange(val: string) {
    setText(val);
    if (skipHistory.current) { skipHistory.current = false; return; }
    setHistory(h => { const n = [...h.slice(0, histIdx+1), val]; return n.slice(-200); });
    setHistIdx(i => Math.min(i+1, 199));
  }

  function undo() {
    if (histIdx <= 0) return;
    skipHistory.current = true;
    const ni = histIdx - 1; setHistIdx(ni); setText(history[ni]);
  }
  function redo() {
    if (histIdx >= history.length-1) return;
    skipHistory.current = true;
    const ni = histIdx + 1; setHistIdx(ni); setText(history[ni]);
  }

  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const charCount = text.length;
  const lineCount = text === "" ? 1 : text.split("\n").length;

  function flash(msg: string) { setStatusMsg(msg); setTimeout(() => setStatusMsg(""), 2500); }

  function newFile() {
    if (text && !confirm("Discard current content?")) return;
    setText(""); setHistory([""]); setHistIdx(0);
    localStorage.removeItem("fch-notepad-v2");
  }
  function openFile() { fileInputRef.current?.click(); }
  function handleFileRead(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    const r = new FileReader();
    r.onload = ev => { const c = ev.target?.result as string; setText(c); setHistory([c]); setHistIdx(0); };
    r.readAsText(file); e.target.value = "";
  }
  function saveFile() {
    const blob = new Blob([text], { type:"text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="note.txt"; a.click();
    URL.revokeObjectURL(url);
  }
  function printFile() { window.print(); }

  function cut() {
    const ta = textareaRef.current; if (!ta) return;
    const sel = ta.value.substring(ta.selectionStart, ta.selectionEnd);
    if (!sel) return;
    navigator.clipboard.writeText(sel);
    handleChange(ta.value.slice(0, ta.selectionStart) + ta.value.slice(ta.selectionEnd));
  }
  function copy() {
    const ta = textareaRef.current; if (!ta) return;
    const sel = ta.value.substring(ta.selectionStart, ta.selectionEnd) || ta.value;
    navigator.clipboard.writeText(sel); flash("Copied!");
  }
  async function paste() {
    const clip = await navigator.clipboard.readText().catch(() => ""); if (!clip) return;
    const ta = textareaRef.current; if (!ta) return;
    handleChange(ta.value.slice(0, ta.selectionStart) + clip + ta.value.slice(ta.selectionEnd));
  }
  function selectAll() { textareaRef.current?.select(); }

  function findOnly() {
    if (!findText || !textareaRef.current) return;
    const idx = text.indexOf(findText);
    if (idx === -1) { flash("Not found"); return; }
    textareaRef.current.focus();
    textareaRef.current.setSelectionRange(idx, idx + findText.length);
    flash(`Found at position ${idx}`);
  }
  function findAndReplace() {
    if (!findText) return;
    const re = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"g");
    const count = (text.match(re) || []).length;
    handleChange(text.replaceAll(findText, replaceText));
    flash(`Replaced ${count} occurrence(s)`);
  }

  function insertAtCursor(str: string) {
    const ta = textareaRef.current; if (!ta) return;
    const s = ta.selectionStart;
    handleChange(ta.value.slice(0,s) + str + ta.value.slice(ta.selectionEnd));
    setTimeout(() => ta.setSelectionRange(s+str.length, s+str.length), 0);
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey||e.metaKey)) {
        if (e.key==="s") { e.preventDefault(); saveFile(); }
        if (e.key==="n") { e.preventDefault(); newFile(); }
        if (e.key==="o") { e.preventDefault(); openFile(); }
        if (e.key==="p") { e.preventDefault(); printFile(); }
        if (e.key==="z") { e.preventDefault(); undo(); }
        if (e.key==="y") { e.preventDefault(); redo(); }
        if (e.key==="f") { e.preventDefault(); setShowFind(f=>!f); }
      }
      if (e.key==="F11") { e.preventDefault(); toggleFullscreen(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [text, histIdx, history]);

  // ── theme ──
  const bg      = darkMode ? "#0f1117" : "#efefef";
  const surface = darkMode ? "#1a1d2e" : "#ffffff";
  const border  = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.14)";
  const text_c  = darkMode ? "#e2e8f0" : "#1a1a1a";
  const muted   = darkMode ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.38)";
  const menuBg  = darkMode ? "#1e2235" : "#ffffff";
  const accent  = "#e8692a";

  const fontMap: Record<string,string> = {
    Default:"system-ui,sans-serif", Monospace:"'Courier New',monospace", Serif:"Georgia,serif",
  };

  // ── menu definitions ──
  const menus = [
    { id:"file", label:"File", items:[
      { label:"🆕  New",              action:newFile,                  shortcut:"Ctrl+N" },
      { label:"📂  Open…",            action:openFile,                 shortcut:"Ctrl+O" },
      { label:"💾  Save / Download",  action:saveFile,                 shortcut:"Ctrl+S" },
      { sep:true },
      { label:"🖨  Print",            action:printFile,                shortcut:"Ctrl+P" },
    ]},
    { id:"edit", label:"Edit", items:[
      { label:"↩  Undo",              action:undo,                     shortcut:"Ctrl+Z" },
      { label:"↪  Redo",              action:redo,                     shortcut:"Ctrl+Y" },
      { sep:true },
      { label:"✂  Cut",              action:cut,                      shortcut:"Ctrl+X" },
      { label:"📋  Copy",             action:copy,                     shortcut:"Ctrl+C" },
      { label:"📌  Paste",            action:paste,                    shortcut:"Ctrl+V" },
      { sep:true },
      { label:"⬜  Select All",       action:selectAll,                shortcut:"Ctrl+A" },
      { sep:true },
      { label:"🔍  Find & Replace…",  action:()=>setShowFind(f=>!f),  shortcut:"Ctrl+F" },
    ]},
    { id:"insert", label:"Insert", items:[
      { label:"📅  Date",             action:()=>insertAtCursor(new Date().toLocaleDateString()) },
      { label:"🕐  Time",             action:()=>insertAtCursor(new Date().toLocaleTimeString()) },
      { label:"📆  Date & Time",      action:()=>insertAtCursor(new Date().toLocaleString()) },
    ]},
    { id:"view", label:"View", items:[
      { label:(wordWrap?"✓ ":"   ")+"Word Wrap",   action:()=>setWordWrap(w=>!w) },
      { label:darkMode?"☀  Light Mode":"🌙  Dark Mode",    action:()=>setDarkMode(d=>!d) },
      { label:"⛶  Fullscreen",       action:toggleFullscreen,         shortcut:"F11" },
    ]},
    { id:"help", label:"Help", items:[
      { label:"ℹ  About",            action:()=>alert("ForgeCodeHub Notepad\nFree · No sign-up · Saves to your browser.") },
    ]},
  ];

  // ── icon toolbar ──
  const icons = [
    { icon:"🆕", title:"New (Ctrl+N)",    action:newFile },
    { icon:"📂", title:"Open (Ctrl+O)",   action:openFile },
    { icon:"💾", title:"Save (Ctrl+S)",   action:saveFile },
    { icon:"🖨", title:"Print (Ctrl+P)",  action:printFile },
    null,
    { icon:"✂", title:"Cut",             action:cut },
    { icon:"📋", title:"Copy",            action:copy },
    { icon:"📌", title:"Paste",           action:paste },
    null,
    { icon:"↩", title:"Undo (Ctrl+Z)",   action:undo, disabled:histIdx<=0 },
    { icon:"↪", title:"Redo (Ctrl+Y)",   action:redo, disabled:histIdx>=history.length-1 },
    null,
    { icon:"🔍", title:"Find (Ctrl+F)",   action:()=>setShowFind(f=>!f) },
    null,
    { icon:"⛶", title:"Fullscreen (F11)",action:toggleFullscreen },
  ];

  return (
    <div style={{ minHeight:"100vh", background:bg, color:text_c, fontFamily:"system-ui,sans-serif", display:"flex", flexDirection:"column" }}>

      {/* hidden file input */}
      <input ref={fileInputRef} type="file" accept=".txt,.md,.json,.js,.ts,.html,.css,.csv" style={{display:"none"}} onChange={handleFileRead} />

      {/* ── TOP BAR ── */}
      <div style={{ display:"flex", alignItems:"center",justifyContent:"space-between", padding:"8px 16px", background:surface, borderBottom:`1px solid ${border}` }}>
          <a href="#" className="logo">
          <div
            className="logo-icon"
            style={{ width: 22, height: 22, fontSize: 11 }}
          >
            ⚒
          </div>
          ForgeCodeHub
        </a>
        <Link
          href="/"
          style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            fontSize: 12, fontWeight: 500, color: "rgb(232, 105, 42)",
            textDecoration: "none", padding: "6px 8px",
            border: `1px solid rgba(232, 105, 42, 0.3)`, borderRadius: 6,
            whiteSpace: "nowrap", transition: "color 0.15s, border-color 0.15s",
          }}
        >
          ← All Tools
        </Link>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:12, padding:"8px 16px", background:surface, borderBottom:`1px solid ${border}` }}>
        <span style={{ fontWeight:700, fontSize:15, color:accent }}>📝 Notepad</span>
        <span style={{ marginLeft:"auto", fontSize:11, color:statusMsg ? accent : saved ? "#26a869" : muted, transition:"color 0.3s" }}>
          {statusMsg || (saved ? "✓ Saved" : "Auto-saves to browser")}
        </span>
           
      </div>

      {/* ── MENU BAR ── */}
      <div style={{ display:"flex", alignItems:"center", padding:"2px 10px", background:surface, borderBottom:`1px solid ${border}`, gap:2, position:"relative", zIndex:100 }}>
        {menus.map(menu => (
          <div key={menu.id} style={{ position:"relative" }}>
            <button
              onClick={e=>{ e.stopPropagation(); setOpenMenu(o=>o===menu.id?null:menu.id); }}
              style={{ background:openMenu===menu.id?`${accent}22`:"transparent", border:"none", color:text_c, padding:"5px 10px", borderRadius:4, cursor:"pointer", fontSize:13, fontWeight:500 }}
            >{menu.label}</button>

            {openMenu===menu.id && (
              <div onClick={e=>e.stopPropagation()} style={{ position:"absolute", top:"100%", left:0, background:menuBg, border:`1px solid ${border}`, borderRadius:6, minWidth:230, boxShadow:"0 8px 24px rgba(0,0,0,0.3)", zIndex:200, padding:"4px 0" }}>
                {menu.items.map((item,i) =>
                  (item as any).sep ? (
                    <div key={i} style={{ height:1, background:border, margin:"4px 0" }} />
                  ) : (
                    <button key={i} onClick={()=>{ (item as any).action?.(); setOpenMenu(null); }}
                      style={{ display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%", padding:"7px 16px", background:"transparent", border:"none", color:text_c, cursor:"pointer", fontSize:13, textAlign:"left" }}
                      onMouseEnter={e=>(e.currentTarget.style.background=`${accent}18`)}
                      onMouseLeave={e=>(e.currentTarget.style.background="transparent")}
                    >
                      <span>{(item as any).label}</span>
                      {(item as any).shortcut && <span style={{ fontSize:11, color:muted, marginLeft:24 }}>{(item as any).shortcut}</span>}
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── ICON TOOLBAR ── */}
      <div style={{ display:"flex", alignItems:"center", gap:2, padding:"6px 12px", background:surface, borderBottom:`1px solid ${border}`, flexWrap:"wrap" }}>
        {icons.map((btn,i) =>
          btn===null ? (
            <div key={i} style={{ width:1, height:22, background:border, margin:"0 4px" }} />
          ) : (
            <button key={i} title={(btn as any).title} onClick={(btn as any).action}
              disabled={!!(btn as any).disabled}
              style={{ background:"transparent", border:"1px solid transparent", borderRadius:5, padding:"4px 8px", fontSize:16, cursor:(btn as any).disabled?"not-allowed":"pointer", opacity:(btn as any).disabled?0.3:1, transition:"background 0.15s" }}
              onMouseEnter={e=>{ if (!(btn as any).disabled) { (e.currentTarget.style.background=`${accent}18`); (e.currentTarget.style.borderColor=border); }}}
              onMouseLeave={e=>{ (e.currentTarget.style.background="transparent"); (e.currentTarget.style.borderColor="transparent"); }}
            >{(btn as any).icon}</button>
          )
        )}

        <div style={{ marginLeft:"auto", display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ fontSize:11, color:muted }}>Font Family</span>
          <select value={font} onChange={e=>setFont(e.target.value)} style={SS(surface,border,text_c)}>
            {FONTS.map(f=><option key={f}>{f}</option>)}
          </select>
          <span style={{ fontSize:11, color:muted }}>Font Sizes</span>
          <select value={fontSize} onChange={e=>setFontSize(Number(e.target.value))} style={{ ...SS(surface,border,text_c), width:68 }}>
            {SIZES.map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* ── FIND & REPLACE ── */}
      {showFind && (
        <div style={{ display:"flex", alignItems:"center", flexWrap:"wrap", gap:8, padding:"8px 16px", background:darkMode?"#12151f":"#e4e4e4", borderBottom:`1px solid ${border}` }}>
          <span style={{ fontSize:12, color:muted, fontWeight:600 }}>Find & Replace</span>
          <input placeholder="Find…" value={findText} onChange={e=>setFindText(e.target.value)}
            style={{ padding:"5px 10px", fontSize:12, border:`1px solid ${border}`, borderRadius:5, background:surface, color:text_c, outline:"none", width:160 }} />
          <input placeholder="Replace with…" value={replaceText} onChange={e=>setReplaceText(e.target.value)}
            style={{ padding:"5px 10px", fontSize:12, border:`1px solid ${border}`, borderRadius:5, background:surface, color:text_c, outline:"none", width:160 }} />
          <button onClick={findOnly}        style={{ padding:"5px 14px", fontSize:12, fontWeight:600, border:`1px solid ${border}`, borderRadius:5, background:"transparent", color:text_c, cursor:"pointer" }}>Find</button>
          <button onClick={findAndReplace}  style={{ padding:"5px 14px", fontSize:12, fontWeight:600, border:`1px solid ${accent}`, borderRadius:5, background:accent, color:"#fff", cursor:"pointer" }}>Replace All</button>
          <button onClick={()=>setShowFind(false)} style={{ padding:"5px 10px", fontSize:12, border:`1px solid ${border}`, borderRadius:5, background:"transparent", color:muted, cursor:"pointer", marginLeft:"auto" }}>✕ Close</button>
        </div>
      )}

      {/* ── EDITOR ── */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"16px" }}>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e=>handleChange(e.target.value)}
          placeholder="Start typing… your note auto-saves to this browser."
          spellCheck
          style={{
            flex:1, minHeight:"calc(100vh - 280px)", width:"100%",
            background:surface, color:text_c,
            border:`1px solid ${border}`, borderRadius:8,
            padding:"18px 20px", fontSize:fontSize,
            fontFamily:fontMap[font] ?? `${font}, sans-serif`,
            lineHeight:1.75, resize:"none", outline:"none",
            whiteSpace:wordWrap?"pre-wrap":"pre",
            overflowWrap:wordWrap?"break-word":"normal",
            overflowX:wordWrap?"hidden":"auto",
            transition:"border-color 0.2s",
          }}
          onFocus={e=>(e.target.style.borderColor=accent)}
          onBlur={e=>(e.target.style.borderColor=border)}
        />
      </div>

      {/* ── STATUS BAR ── */}
      <div style={{ display:"flex", alignItems:"center", gap:20, padding:"6px 20px", background:surface, borderTop:`1px solid ${border}`, fontSize:12, color:muted, flexWrap:"wrap" }}>
        <span>Words: <b style={{color:text_c}}>{wordCount}</b></span>
        <span>Characters: <b style={{color:text_c}}>{charCount}</b></span>
        <span>Lines: <b style={{color:text_c}}>{lineCount}</b></span>
        <span style={{marginLeft:"auto"}}>
          {wordWrap?"Wrap: On":"Wrap: Off"} · {font} {fontSize}px
        </span>
      </div>
    </div>
  );
}

function SS(surface:string, border:string, text:string) {
  return { padding:"4px 8px", fontSize:12, border:`1px solid ${border}`, borderRadius:5, background:surface, color:text, cursor:"pointer", outline:"none" };
}