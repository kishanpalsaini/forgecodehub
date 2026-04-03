"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useHotkeys } from "react-hotkeys-hook";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

// ── Constants ─────────────────────────────────────────────────────────────────
const FONTS = ["Default","Arial","Courier New","Georgia","Helvetica","Monospace","Palatino","Tahoma","Times New Roman","Trebuchet MS","Verdana"];
const SIZES = [8,9,10,11,12,13,14,15,16,18,20,22,24,26,28,32,36,48,72];
const TEXT_COLORS = ["#000000","#e53935","#43a047","#1e88e5","#fb8c00","#8e24aa","#00acc1","#6d4c41","#ffffff","#9e9e9e"];
const BG_COLORS   = ["transparent","#fff9c4","#c8e6c9","#bbdefb","#ffe0b2","#e1bee7","#b2ebf2","#ffcdd2","#f3e5f5","#e8f5e9"];
const SPECIAL_CHARS = ["©","®","™","€","£","¥","°","±","×","÷","≤","≥","≠","≈","∞","√","∑","∏","∂","∫","α","β","γ","δ","π","Ω","µ","¶","§"];

// ── Types ─────────────────────────────────────────────────────────────────────
interface Tab {
  id: string;
  title: string;
  text: string;
  pinned: boolean;
  history: string[];
  histIdx: number;
}

function createTab(title = "Untitled", text = ""): Tab {
  return { id: Date.now().toString() + Math.random(), title, text, pinned: false, history: [text], histIdx: 0 };
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function SS(s:string,b:string,t:string,w:number){ return {padding:"4px 8px",fontSize:12,border:`1px solid ${b}`,borderRadius:5,background:s,color:t,cursor:"pointer",outline:"none",width:w}; }
function IS(s:string,b:string,t:string){ return {padding:"5px 10px",fontSize:12,border:`1px solid ${b}`,borderRadius:5,background:s,color:t,outline:"none",width:160}; }
function SB(b:string,t:string){ return {padding:"5px 14px",fontSize:12,fontWeight:600 as const,border:`1px solid ${b}`,borderRadius:5,background:"transparent",color:t,cursor:"pointer"}; }

// ── Reading time ──────────────────────────────────────────────────────────────
function readingTime(text: string): string {
  const wpm = 200;
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const mins = Math.ceil(words / wpm);
  if (mins < 1) return "< 1 min";
  return `${mins} min read`;
}

// ── applyMarkdownFormat: wraps SELECTED text only — no-ops if nothing selected ─
function applyMarkdownFormat(
  ta: HTMLTextAreaElement,
  before: string,
  after: string,
  savedSel: {start:number;end:number},
  setText: (v:string)=>void,
  flash: (msg:string)=>void
) {
  const { start, end } = savedSel;
  // Guard: must have a real selection
  if (start === end) {
    flash("Select some text first");
    ta.focus();
    return;
  }
  const val = ta.value;
  const sel = val.substring(start, end);
  const newText = val.slice(0, start) + before + sel + after + val.slice(end);
  setText(newText);
  setTimeout(() => {
    ta.focus();
    ta.setSelectionRange(start + before.length, start + before.length + sel.length);
  }, 0);
}

export default function NotepadPage() {
  // ── Tabs ──────────────────────────────────────────────────────────────────
  const [tabs, setTabs] = useState<Tab[]>([createTab("Untitled 1")]);
  const [activeTabId, setActiveTabId] = useState<string>(() => "");
  const activeTab = tabs.find(t => t.id === activeTabId) ?? tabs[0];

  useEffect(() => {
    if (tabs.length > 0 && !activeTabId) setActiveTabId(tabs[0].id);
  }, [tabs, activeTabId]);

  // ── Global UI state ───────────────────────────────────────────────────────
  const [darkMode, setDarkMode]               = useState(false);
  const [font, setFont]                       = useState("Default");
  const [fontSize, setFontSize]               = useState(14);
  const [wordWrap, setWordWrap]               = useState(true);
  const [showFind, setShowFind]               = useState(false);
  const [findText, setFindText]               = useState("");
  const [replaceText, setReplaceText]         = useState("");
  const [statusMsg, setStatusMsg]             = useState("");
  const [saved, setSaved]                     = useState(false);
  const [openMenu, setOpenMenu]               = useState<string|null>(null);
  const [openSub, setOpenSub]                 = useState<string|null>(null);
  const [tooltip, setTooltip]                 = useState<{label:string;x:number;y:number}|null>(null);
  const [showSpecial, setShowSpecial]         = useState(false);
  const [showShortcuts, setShowShortcuts]     = useState(false);
  const [showTextColor, setShowTextColor]     = useState(false);
  const [showBgColor, setShowBgColor]         = useState(false);
  const [activeTextColor, setActiveTextColor] = useState("#000000");
  const [activeBgColor, setActiveBgColor]     = useState("transparent");
  const [viewMode, setViewMode]               = useState<"plain"|"markdown"|"diff"|"monaco">("plain");
  const [showLineNumbers, setShowLineNumbers] = useState(false);
  const [diffBase, setDiffBase]               = useState("");

  const textareaRef  = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef  = useRef<HTMLDivElement>(null);
  // Always-current selection — updated continuously from textarea events
  // AND captured via onMouseDown on toolbar buttons (with e.preventDefault to keep focus)
  const savedSel = useRef<{start:number;end:number}>({start:0,end:0});

  function trackSelection() {
    const ta = textareaRef.current;
    if (!ta) return;
    savedSel.current = { start: ta.selectionStart, end: ta.selectionEnd };
  }
  // onMouseDown on every toolbar button.
  // e.preventDefault() prevents the button click from blurring the textarea,
  // so the textarea keeps focus and selectionStart/End stay valid.
  // We then read them immediately into savedSel.
  function captureSel(e: React.MouseEvent) {
    e.preventDefault(); // keeps textarea focused → selection preserved
    const ta = textareaRef.current;
    if (!ta) return;
    // If textarea doesn't have focus, selection will be 0/0 — still safe
    // because the format guards will catch start===end and flash a hint.
    savedSel.current = { start: ta.selectionStart, end: ta.selectionEnd };
  }

  const text = activeTab?.text ?? "";

  // ── Tab helpers ──────────────────────────────────────────────────────────
  function updateActiveTab(patch: Partial<Tab>) {
    setTabs(ts => ts.map(t => t.id === activeTabId ? { ...t, ...patch } : t));
  }

  function addTab() {
    const t = createTab(`Untitled ${tabs.length + 1}`);
    setTabs(ts => [...ts, t]);
    setActiveTabId(t.id);
  }

  function closeTab(id: string) {
    if (tabs.find(t => t.id === id)?.pinned) return;
    const idx = tabs.findIndex(t => t.id === id);
    const newTabs = tabs.filter(t => t.id !== id);
    if (newTabs.length === 0) {
      const fresh = createTab("Untitled 1");
      setTabs([fresh]);
      setActiveTabId(fresh.id);
    } else {
      setTabs(newTabs);
      if (activeTabId === id) {
        setActiveTabId(newTabs[Math.max(0, idx - 1)].id);
      }
    }
  }

  function pinTab(id: string) {
    setTabs(ts => ts.map(t => t.id === id ? { ...t, pinned: !t.pinned } : t));
  }

  function renameTab(id: string, title: string) {
    setTabs(ts => ts.map(t => t.id === id ? { ...t, title } : t));
  }

  // ── History per-tab ────────────────────────────────────────────────────
  const skipHistory = useRef(false);

  function handleChange(val: string) {
    setTabs(ts => ts.map(t => {
      if (t.id !== activeTabId) return t;
      const newHistory = skipHistory.current
        ? t.history
        : [...t.history.slice(0, t.histIdx + 1), val].slice(-200);
      const newIdx = skipHistory.current ? t.histIdx : Math.min(t.histIdx + 1, 199);
      skipHistory.current = false;
      return { ...t, text: val, history: newHistory, histIdx: newIdx };
    }));
  }

  function undo() {
    if (!activeTab || activeTab.histIdx <= 0) return;
    skipHistory.current = true;
    const n = activeTab.histIdx - 1;
    updateActiveTab({ histIdx: n, text: activeTab.history[n] });
  }
  function redo() {
    if (!activeTab || activeTab.histIdx >= activeTab.history.length - 1) return;
    skipHistory.current = true;
    const n = activeTab.histIdx + 1;
    updateActiveTab({ histIdx: n, text: activeTab.history[n] });
  }

  // ── Stats ──────────────────────────────────────────────────────────────
  const wordCount = text.trim()===""?0:text.trim().split(/\s+/).length;
  const charCount = text.length;
  const lineCount = text===""?1:text.split("\n").length;

  function flash(msg:string){ setStatusMsg(msg); setTimeout(()=>setStatusMsg(""),2500); }

  // ── Autosave ────────────────────────────────────────────────────────────
  useEffect(()=>{
    const t=setTimeout(()=>{
      localStorage.setItem("fch-notepad-tabs-v1", JSON.stringify(tabs));
      localStorage.setItem("fch-notepad-active-v1", activeTabId);
      setSaved(true);setTimeout(()=>setSaved(false),1500);
    },800);
    return ()=>clearTimeout(t);
  },[tabs, activeTabId]);

  useEffect(()=>{
    const saved = localStorage.getItem("fch-notepad-tabs-v1");
    const savedActive = localStorage.getItem("fch-notepad-active-v1");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Tab[];
        if (parsed.length > 0) {
          setTabs(parsed);
          setActiveTabId(savedActive ?? parsed[0].id);
        }
      } catch {}
    }
  },[]);

  // ── Close menus on outside click ────────────────────────────────────────
  useEffect(()=>{
    const h=(e:MouseEvent)=>{
      const t=e.target as HTMLElement;
      if(!t.closest(".menu-root"))  { setOpenMenu(null);setOpenSub(null); }
      if(!t.closest(".color-root")) { setShowTextColor(false);setShowBgColor(false); }
    };
    document.addEventListener("click",h);
    return ()=>document.removeEventListener("click",h);
  },[]);

  // ── File ops ────────────────────────────────────────────────────────────
  function newFile(){ const t=createTab(`Untitled ${tabs.length+1}`);setTabs(ts=>[...ts,t]);setActiveTabId(t.id); }
  function openFile(){ fileInputRef.current?.click(); }
  function handleFileRead(e:React.ChangeEvent<HTMLInputElement>){
    const f=e.target.files?.[0];if(!f)return;
    const r=new FileReader();
    r.onload=ev=>{
      const c=ev.target?.result as string;
      const t=createTab(f.name,c);
      setTabs(ts=>[...ts,t]);setActiveTabId(t.id);
    };
    r.readAsText(f);e.target.value="";
  }
  function saveFile(){
    const blob=new Blob([text],{type:"text/plain"});const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download=(activeTab?.title??"note")+".txt";a.click();URL.revokeObjectURL(url);
  }
  async function saveAsPdf(){
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(text, 180);
    doc.text(lines, 15, 20);
    doc.save((activeTab?.title ?? "note") + ".pdf");
  }
  async function saveAsDocx(){
    const { Document, Packer, Paragraph, TextRun } = await import("docx");
    const { saveAs } = await import("file-saver");
    const paragraphs = text.split("\n").map(line => new Paragraph({ children: [new TextRun(line)] }));
    const doc = new Document({ sections: [{ properties: {}, children: paragraphs }] });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, (activeTab?.title ?? "note") + ".docx");
  }
  function printFile(){ window.print(); }

  // ── Edit ops ────────────────────────────────────────────────────────────
  function cut(){
    const ta=textareaRef.current;if(!ta)return;
    const sel=ta.value.substring(ta.selectionStart,ta.selectionEnd);if(!sel)return;
    navigator.clipboard.writeText(sel);
    handleChange(ta.value.slice(0,ta.selectionStart)+ta.value.slice(ta.selectionEnd));
  }
  function copy(){
    const ta=textareaRef.current;if(!ta)return;
    navigator.clipboard.writeText(ta.value.substring(ta.selectionStart,ta.selectionEnd)||ta.value);flash("Copied!");
  }
  async function paste(){
    const clip=await navigator.clipboard.readText().catch(()=>"");if(!clip)return;
    const ta=textareaRef.current;if(!ta)return;
    handleChange(ta.value.slice(0,ta.selectionStart)+clip+ta.value.slice(ta.selectionEnd));
  }
  function selectAll(){ textareaRef.current?.select(); }

  // ── Find & Replace ────────────────────────────────────────────────────
  function findOnly(){
    if(!findText||!textareaRef.current)return;
    const idx=text.indexOf(findText);
    if(idx===-1){flash("Not found");return;}
    textareaRef.current.focus();textareaRef.current.setSelectionRange(idx,idx+findText.length);flash(`Found at ${idx}`);
  }
  function findAndReplace(){
    if(!findText)return;
    const count=(text.match(new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"g"))||[]).length;
    handleChange(text.replaceAll(findText,replaceText));flash(`Replaced ${count} occurrence(s)`);
  }

  // ── Insert ───────────────────────────────────────────────────────────
  function insertAtCursor(str:string){
    const ta=textareaRef.current;if(!ta)return;
    const s=ta.selectionStart;
    handleChange(ta.value.slice(0,s)+str+ta.value.slice(ta.selectionEnd));
    setTimeout(()=>ta.setSelectionRange(s+str.length,s+str.length),0);
  }

  // ── SELECTION-AWARE align ──────────────────────────────────────────────
  function applyAlign(direction: "left" | "center" | "right") {
    const ta = textareaRef.current;
    if (!ta) return;
    const { start, end } = savedSel.current;
    const val = ta.value;

    if (start === end) {
      flash("Select some text first to align it");
      return;
    }

    const sel     = val.substring(start, end);
    const wrapped = `<div style="text-align:${direction}">${sel}</div>`;
    handleChange(val.slice(0, start) + wrapped + val.slice(end));
    setTimeout(() => { ta.focus(); ta.setSelectionRange(start, start + wrapped.length); }, 0);
  }

  // ── SELECTION-AWARE background color ─────────────────────────────────
  function applyBgColor(color: string) {
    setActiveBgColor(color);
    const ta = textareaRef.current;
    if (!ta) return;
    const { start, end } = savedSel.current;
    const val = ta.value;

    if (start === end || color === "transparent") return;

    const sel     = val.substring(start, end);
    const wrapped = `<span style="background:${color}">${sel}</span>`;
    handleChange(val.slice(0, start) + wrapped + val.slice(end));
    setTimeout(() => { ta.focus(); ta.setSelectionRange(start, start + wrapped.length); }, 0);
    setShowBgColor(false);
  }

  // ── SELECTION-AWARE text color ────────────────────────────────────────
  function applyTextColor(color: string) {
    setActiveTextColor(color);
    const ta = textareaRef.current;
    if (!ta) return;
    const { start, end } = savedSel.current;
    const val = ta.value;

    if (start === end) return;

    const sel     = val.substring(start, end);
    const wrapped = `<span style="color:${color}">${sel}</span>`;
    handleChange(val.slice(0, start) + wrapped + val.slice(end));
    setTimeout(() => { ta.focus(); ta.setSelectionRange(start, start + wrapped.length); }, 0);
    setShowTextColor(false);
  }

  // ── Bold / Italic / Underline ─────────────────────────────────────────
  function applyBold() {
  const ta = textareaRef.current;
  if (!ta) return;

  const { selectionStart, selectionEnd } = ta;

  if (selectionStart === selectionEnd) return; // ❌ No selection

  applyMarkdownFormat(
    ta,
    "**",
    "**",
    savedSel.current,
    handleChange,
    flash
  );
}
  function applyItalic() {
  const ta = textareaRef.current;
  if (!ta) return;

  const { selectionStart, selectionEnd } = ta;
  if (selectionStart === selectionEnd) return;

  applyMarkdownFormat(ta, "_", "_", savedSel.current, handleChange, flash);
}

function applyUnderline() {
  const ta = textareaRef.current;
  if (!ta) return;

  const { selectionStart, selectionEnd } = ta;
  if (selectionStart === selectionEnd) return;

  applyMarkdownFormat(ta, "<u>", "</u>", savedSel.current, handleChange, flash);
}

  // ── Drag & Drop image paste ───────────────────────────────────────────
  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
    files.forEach(f => {
      const reader = new FileReader();
      reader.onload = ev => {
        const src = ev.target?.result as string;
        insertAtCursor(`![image](${src})`);
        flash("Image inserted as Markdown!");
      };
      reader.readAsDataURL(f);
    });
  }
  function handlePasteImage(e: React.ClipboardEvent) {
    const items = Array.from(e.clipboardData.items).filter(i => i.type.startsWith("image/"));
    if (items.length === 0) return;
    e.preventDefault();
    items.forEach(item => {
      const file = item.getAsFile(); if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const src = ev.target?.result as string;
        insertAtCursor(`![pasted image](${src})`);
        flash("Image pasted!");
      };
      reader.readAsDataURL(file);
    });
  }

  // ── Fullscreen ───────────────────────────────────────────────────────
  function toggleFullscreen(){
    if(!document.fullscreenElement)document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  }

  // ── Hotkeys ──────────────────────────────────────────────────────────
  useHotkeys("ctrl+s,meta+s", (e) => { e.preventDefault(); saveFile(); }, { enableOnFormTags: true });
  useHotkeys("ctrl+n,meta+n", (e) => { e.preventDefault(); newFile(); }, { enableOnFormTags: true });
  useHotkeys("ctrl+o,meta+o", (e) => { e.preventDefault(); openFile(); }, { enableOnFormTags: true });
  useHotkeys("ctrl+p,meta+p", (e) => { e.preventDefault(); printFile(); }, { enableOnFormTags: true });
  useHotkeys("ctrl+z,meta+z", (e) => { e.preventDefault(); undo(); }, { enableOnFormTags: true });
  useHotkeys("ctrl+y,meta+y", (e) => { e.preventDefault(); redo(); }, { enableOnFormTags: true });
  useHotkeys("ctrl+f,meta+f", (e) => { e.preventDefault(); setShowFind(f=>!f); }, { enableOnFormTags: true });
  useHotkeys("ctrl+b,meta+b", (e) => { e.preventDefault(); trackSelection(); applyBold(); }, { enableOnFormTags: true });
  useHotkeys("ctrl+i,meta+i", (e) => { e.preventDefault(); trackSelection(); applyItalic(); }, { enableOnFormTags: true });
  useHotkeys("ctrl+u,meta+u", (e) => { e.preventDefault(); trackSelection(); applyUnderline(); }, { enableOnFormTags: true });
  useHotkeys("ctrl+t,meta+t", (e) => { e.preventDefault(); addTab(); }, { enableOnFormTags: true });
  useHotkeys("ctrl+w,meta+w", (e) => { e.preventDefault(); closeTab(activeTabId); }, { enableOnFormTags: true });
  // Tab key support inside textarea
  function handleTabKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Tab") {
      e.preventDefault();
      insertAtCursor("  ");
    }
  }

  // ── Diff view ────────────────────────────────────────────────────────
  function computeDiff(original: string, modified: string): React.ReactNode[] {
    const origLines = original.split("\n");
    const modLines  = modified.split("\n");
    const result: React.ReactNode[] = [];
    const maxLen = Math.max(origLines.length, modLines.length);
    for (let i = 0; i < maxLen; i++) {
      const o = origLines[i] ?? "";
      const m = modLines[i] ?? "";
      if (o === m) {
        result.push(<div key={i} style={{padding:"1px 8px",fontFamily:"monospace",fontSize:13,lineHeight:1.6}}><span style={{color:muted,marginRight:8,userSelect:"none",display:"inline-block",width:40,textAlign:"right"}}>{i+1}</span>{m}</div>);
      } else if (o && !modLines[i]) {
        result.push(<div key={i} style={{padding:"1px 8px",background:"rgba(229,57,53,0.15)",fontFamily:"monospace",fontSize:13,lineHeight:1.6}}><span style={{color:muted,marginRight:8,userSelect:"none",display:"inline-block",width:40,textAlign:"right"}}>{i+1}</span><span style={{color:"#e53935"}}>- {o}</span></div>);
      } else if (!origLines[i] && m) {
        result.push(<div key={i} style={{padding:"1px 8px",background:"rgba(67,160,71,0.15)",fontFamily:"monospace",fontSize:13,lineHeight:1.6}}><span style={{color:muted,marginRight:8,userSelect:"none",display:"inline-block",width:40,textAlign:"right"}}>{i+1}</span><span style={{color:"#43a047"}}>+ {m}</span></div>);
      } else {
        result.push(
          <div key={`${i}-del`} style={{padding:"1px 8px",background:"rgba(229,57,53,0.15)",fontFamily:"monospace",fontSize:13,lineHeight:1.6}}><span style={{color:muted,marginRight:8,userSelect:"none",display:"inline-block",width:40,textAlign:"right"}}>{i+1}</span><span style={{color:"#e53935"}}>- {o}</span></div>
        );
        result.push(
          <div key={`${i}-add`} style={{padding:"1px 8px",background:"rgba(67,160,71,0.15)",fontFamily:"monospace",fontSize:13,lineHeight:1.6}}><span style={{color:muted,marginRight:8,userSelect:"none",display:"inline-block",width:40,textAlign:"right"}}>{i+1}</span><span style={{color:"#43a047"}}>+ {m}</span></div>
        );
      }
    }
    return result;
  }

  // ── Theme vars ───────────────────────────────────────────────────────
  const bg      = darkMode?"#0f1117":"#f2f2f2";
  const surface = darkMode?"#1a1d2e":"#ffffff";
  const border  = darkMode?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.12)";
  const text_c  = darkMode?"#e2e8f0":"#1a1a1a";
  const muted   = darkMode?"rgba(255,255,255,0.4)":"rgba(0,0,0,0.38)";
  const menuBg  = darkMode?"#1e2235":"#ffffff";
  const accent  = "#1a1a1a";
  const accentHover = darkMode?"rgba(255,255,255,0.08)":"rgba(0,0,0,0.06)";
  const fontMap:Record<string,string>={Default:"system-ui,sans-serif",Monospace:"'Courier New',monospace",Serif:"Georgia,serif"};

  // ── Menus ────────────────────────────────────────────────────────────
  const datetimeSub=[
    {label:"Date",       action:()=>insertAtCursor(new Date().toLocaleDateString())},
    {label:"Time",       action:()=>insertAtCursor(new Date().toLocaleTimeString())},
    {label:"Date & Time",action:()=>insertAtCursor(new Date().toLocaleString())},
  ];
  const menus=[
    {id:"file",label:"File",items:[
      {label:"New Tab",           action:addTab,    icon:"🗋", shortcut:"Ctrl+T"},
      {label:"Save (.txt)",       action:saveFile,  icon:"💾", shortcut:"Ctrl+S"},
      {label:"Save as PDF",       action:saveAsPdf, icon:"📄", shortcut:""},
      {label:"Save as .docx",     action:saveAsDocx,icon:"📝", shortcut:""},
      {label:"Open...",           action:openFile,  icon:"📂", shortcut:"Ctrl+O"},
      {label:"Print",             action:printFile, icon:"🖨", shortcut:"Ctrl+P"},
    ]},
    {id:"edit",label:"Edit",items:[
      {label:"Undo",             action:undo,      icon:"↩", shortcut:"Ctrl+Z"},
      {label:"Redo",             action:redo,      icon:"↪", shortcut:"Ctrl+Y"},
      {sep:true,label:""},
      {label:"Cut",              action:cut,       icon:"✂", shortcut:"Ctrl+X"},
      {label:"Copy",             action:copy,      icon:"📋",shortcut:"Ctrl+C"},
      {label:"Paste",            action:paste,     icon:"📌",shortcut:"Ctrl+V"},
      {sep:true,label:""},
      {label:"Select all",       action:selectAll, icon:"",  shortcut:"Ctrl+A"},
      {sep:true,label:""},
      {label:"Find and replace", action:()=>setShowFind(f=>!f),icon:"🔍",shortcut:"Ctrl+F"},
    ]},
    {id:"format",label:"Format",items:[
      {label:"Bold",             action:applyBold,      icon:"B",  shortcut:"Ctrl+B"},
      {label:"Italic",           action:applyItalic,    icon:"I",  shortcut:"Ctrl+I"},
      {label:"Underline",        action:applyUnderline, icon:"U",  shortcut:"Ctrl+U"},
    ]},
    {id:"insert",label:"Insert",items:[
      {label:"Date/time",         sub:"datetime", icon:"📅", shortcut:""},
      {label:"Special character", action:()=>setShowSpecial(true),icon:"Ω"},
      {label:"Nonbreaking space", action:()=>insertAtCursor("\u00A0"),icon:""},
    ]},
    {id:"view",label:"View",items:[
      {label:"Fullscreen",           action:toggleFullscreen,                   icon:"⛶",shortcut:"Ctrl+Shift+F"},
      {sep:true,label:""},
      {label:(wordWrap?"✓ ":"  ")+"Word Wrap",      action:()=>setWordWrap(w=>!w), icon:""},
      {label:(showLineNumbers?"✓ ":"  ")+"Line Numbers", action:()=>setShowLineNumbers(v=>!v), icon:""},
      {label:darkMode?"☀ Light Mode":"🌙 Dark Mode", action:()=>setDarkMode(d=>!d), icon:""},
      {sep:true,label:""},
      {label:"Plain Text",  action:()=>setViewMode("plain"),    icon:viewMode==="plain"?"✓":""},
      {label:"Markdown Preview", action:()=>setViewMode("markdown"), icon:viewMode==="markdown"?"✓":""},
      {label:"Code Editor", action:()=>setViewMode("monaco"),   icon:viewMode==="monaco"?"✓":""},
      {label:"Diff View",   action:()=>{setDiffBase(text);setViewMode("diff");}, icon:viewMode==="diff"?"✓":""},
    ]},
    {id:"help",label:"Help",items:[
      {label:"Shortcuts", action:()=>setShowShortcuts(true), icon:"⌨"},
      {label:"Homepage",  action:()=>window.open("/","_self"),icon:"🏠"},
    ]},
  ];

  // ── Icon toolbar ─────────────────────────────────────────────────────
  const iconBtns=[
    {icon:"🗋",label:"New Tab",       action:addTab},
    {icon:"💾",label:"Save",          action:saveFile},
    {icon:"📂",label:"Open",          action:openFile},
    {icon:"🖨",label:"Print",         action:printFile},
    null,
    {icon:"✂",label:"Cut",            action:cut},
    {icon:"📋",label:"Copy",          action:copy},
    {icon:"📌",label:"Paste",         action:paste},
    null,
    {icon:"↩",label:"Undo",           action:undo, disabled:!activeTab||activeTab.histIdx<=0},
    {icon:"↪",label:"Redo",           action:redo, disabled:!activeTab||activeTab.histIdx>=(activeTab?.history.length??1)-1},
    null,
    {icon:"🔍",label:"Find & Replace",action:()=>setShowFind(f=>!f)},
    null,
    {icon:"⛶",label:"Fullscreen",     action:toggleFullscreen},
  ];

  // ── IBStyle ──────────────────────────────────────────────────────────
  function IBStyle(active=false){
    return {
      background:active?(darkMode?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.10)"):"transparent",
      border:`1px solid ${active?border:"transparent"}`,
      borderRadius:5,padding:"4px 8px",fontSize:15,
      cursor:"pointer",transition:"background 0.1s",
      color:text_c,opacity:1,
    };
  }

  // ── Sorted tabs: pinned first ─────────────────────────────────────────
  const sortedTabs = [...tabs].sort((a,b) => (b.pinned?1:0)-(a.pinned?1:0));

  return (

   <div style={{width:"100%", background:"#505073"}}>
     <div style={{minHeight:"100vh",background:"#d2d2e3",color:text_c,fontFamily:"system-ui,sans-serif",display:"flex",flexDirection:"column", margin:"0 auto",maxWidth:1500}}>
      <input ref={fileInputRef} type="file" accept=".txt,.md,.json,.js,.ts,.html,.css,.csv" style={{display:"none"}} onChange={handleFileRead}/>

      {/* ── TOP BAR ── */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 24px",background:"rgb(41 38 38)",borderBottom:`1px solid ${border}`}}>
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
            border: "1px solid rgba(232, 105, 42, 0.3)", borderRadius: 6,
            whiteSpace: "nowrap", transition: "color 0.15s, border-color 0.15s",
          }}
        >
          ← All Tools
        </Link>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:12,padding:"8px 24px",background:surface,borderBottom:`1px solid ${border}`}}>
        <span style={{fontWeight:700,fontSize:15,color:text_c}}>📝 Notepad</span>
        <span style={{marginLeft:"auto",fontSize:11,color:statusMsg?accent:saved?"#26a869":muted,transition:"color 0.3s"}}>
          {statusMsg||(saved?"✓ Saved":"Auto-saves to browser")}
        </span>
        <button onClick={()=>setDarkMode(d=>!d)}
          style={{padding:"5px 14px",fontSize:12,fontWeight:600,border:`1px solid ${border}`,borderRadius:6,background:darkMode?"#fff":"#1a1a1a",color:darkMode?"#000":"#fff",cursor:"pointer",transition:"all 0.2s"}}>
          {darkMode?"☀ Light":"🌙 Dark"}
        </button>
      </div>

      {/* ── TABS BAR ── */}
      <div style={{display:"flex",alignItems:"stretch",background:surface,borderBottom:`1px solid ${border}`,overflowX:"auto",flexShrink:0}}>
        {sortedTabs.map(tab => (
          <TabItem
            key={tab.id}
            tab={tab}
            isActive={tab.id === activeTabId}
            onActivate={() => setActiveTabId(tab.id)}
            onClose={() => closeTab(tab.id)}
            onPin={() => pinTab(tab.id)}
            onRename={(title) => renameTab(tab.id, title)}
            darkMode={darkMode}
            surface={surface}
            border={border}
            text_c={text_c}
            muted={muted}
            accent={accent}
            accentHover={accentHover}
          />
        ))}
        <button onClick={addTab} title="New Tab (Ctrl+T)"
          style={{padding:"0 14px",background:"transparent",border:"none",color:muted,fontSize:18,cursor:"pointer",flexShrink:0}}
          onMouseEnter={e=>(e.currentTarget.style.color=text_c)}
          onMouseLeave={e=>(e.currentTarget.style.color=muted)}
        >＋</button>
      </div>

      {/* ── MENU BAR ── */}
      <div className="menu-root" style={{display:"flex",alignItems:"center",padding:"2px 24px",background:surface,borderBottom:`1px solid ${border}`,gap:0,position:"relative",zIndex:200}}>
        {menus.map(menu=>(
          <div key={menu.id} style={{position:"relative"}}>
            <button
              onClick={e=>{e.stopPropagation();setOpenMenu(o=>o===menu.id?null:menu.id);setOpenSub(null);}}
              style={{background:openMenu===menu.id?accentHover:"transparent",border:"none",color:text_c,padding:"5px 12px",borderRadius:4,cursor:"pointer",fontSize:13,fontWeight:500}}
            >{menu.label}</button>
            {openMenu===menu.id&&(
              <div style={{position:"absolute",top:"100%",left:0,background:menuBg,border:`1px solid ${border}`,borderRadius:7,minWidth:220,boxShadow:"0 8px 28px rgba(0,0,0,0.15)",zIndex:300,padding:"4px 0"}}>
                {menu.items.map((item:any,i:number)=>
                  item.sep?(
                    <div key={i} style={{height:1,background:border,margin:"4px 0"}}/>
                  ):(
                    <div key={i} style={{position:"relative"}} onMouseEnter={()=>item.sub?setOpenSub(item.sub):setOpenSub(null)}>
                      <button onClick={()=>{if(!item.sub){item.action?.();setOpenMenu(null);setOpenSub(null);}}}
                        style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",padding:"7px 16px",background:"transparent",border:"none",color:text_c,cursor:"pointer",fontSize:13,textAlign:"left"}}
                        onMouseEnter={e=>(e.currentTarget.style.background=accentHover)}
                        onMouseLeave={e=>(e.currentTarget.style.background="transparent")}
                      >
                        <span style={{display:"flex",alignItems:"center",gap:9}}>
                          {item.icon&&<span style={{fontSize:13,width:18,textAlign:"center"}}>{item.icon}</span>}
                          {item.label}
                        </span>
                        <span style={{fontSize:11,color:muted,marginLeft:16,whiteSpace:"nowrap"}}>{item.sub?"▶":item.shortcut}</span>
                      </button>
                      {item.sub==="datetime"&&openSub==="datetime"&&(
                        <div style={{position:"absolute",top:0,left:"100%",background:menuBg,border:`1px solid ${border}`,borderRadius:7,minWidth:160,boxShadow:"0 8px 24px rgba(0,0,0,0.15)",zIndex:400,padding:"4px 0"}}>
                          {datetimeSub.map((s,si)=>(
                            <button key={si} onClick={()=>{s.action();setOpenMenu(null);setOpenSub(null);}}
                              style={{display:"block",width:"100%",padding:"7px 16px",background:"transparent",border:"none",color:text_c,cursor:"pointer",fontSize:13,textAlign:"left"}}
                              onMouseEnter={e=>(e.currentTarget.style.background=accentHover)}
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
      <div style={{display:"flex",alignItems:"center",gap:1,padding:"5px 24px",background:surface,borderBottom:`1px solid ${border}`,flexWrap:"wrap"}}>
        {iconBtns.map((btn,i)=>
          btn===null?(
            <div key={i} style={{width:1,height:22,background:border,margin:"0 5px"}}/>
          ):(
            <button key={i} onClick={(btn as any).action} disabled={!!(btn as any).disabled}
              onMouseEnter={e=>{
                if((btn as any).disabled)return;
                const r=e.currentTarget.getBoundingClientRect();
                setTooltip({label:(btn as any).label,x:r.left+r.width/2,y:r.bottom+6});
                e.currentTarget.style.background=accentHover;
              }}
              onMouseLeave={e=>{setTooltip(null);e.currentTarget.style.background="transparent";}}
              style={{background:"transparent",border:"1px solid transparent",borderRadius:5,padding:"4px 8px",fontSize:16,cursor:(btn as any).disabled?"not-allowed":"pointer",opacity:(btn as any).disabled?0.3:1,transition:"background 0.1s",color:text_c}}
            >{(btn as any).icon}</button>
          )
        )}
        <div style={{marginLeft:"auto",display:"flex",gap:8,alignItems:"center"}}>
          <span style={{fontSize:11,color:muted}}>Font</span>
          <select value={font} onChange={e=>setFont(e.target.value)} style={SS(surface,border,text_c,140)}>
            {FONTS.map(f=><option key={f}>{f}</option>)}
          </select>
          <span style={{fontSize:11,color:muted}}>Size</span>
          <select value={fontSize} onChange={e=>setFontSize(Number(e.target.value))} style={SS(surface,border,text_c,64)}>
            {SIZES.map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* ── FORMATTING TOOLBAR ── */}
      <div className="color-root" style={{display:"flex",alignItems:"center",gap:4,padding:"5px 24px",background:surface,borderBottom:`1px solid ${border}`,flexWrap:"wrap"}}>

        {/* Bold / Italic / Underline — onMouseDown prevents focus loss */}
        <button
          onMouseDown={captureSel}
          onClick={applyBold}
          title="Bold (Ctrl+B)"
          style={{...IBStyle(),fontWeight:700,fontSize:14,padding:"4px 10px"}}
          onMouseEnter={e=>(e.currentTarget.style.background=accentHover)}
          onMouseLeave={e=>(e.currentTarget.style.background="transparent")}
        >B</button>
        <button
          onMouseDown={captureSel}
          onClick={applyItalic}
          title="Italic (Ctrl+I)"
          style={{...IBStyle(),fontStyle:"italic",fontSize:14,padding:"4px 10px"}}
          onMouseEnter={e=>(e.currentTarget.style.background=accentHover)}
          onMouseLeave={e=>(e.currentTarget.style.background="transparent")}
        >I</button>
        <button
          onMouseDown={captureSel}
          onClick={applyUnderline}
          title="Underline (Ctrl+U)"
          style={{...IBStyle(),textDecoration:"underline",fontSize:14,padding:"4px 10px"}}
          onMouseEnter={e=>(e.currentTarget.style.background=accentHover)}
          onMouseLeave={e=>(e.currentTarget.style.background="transparent")}
        >U</button>

        <div style={{width:1,height:22,background:border,margin:"0 6px"}}/>

        {/* Selection-aware Alignment */}
        <span style={{fontSize:11,color:muted,marginRight:2}}>Align:</span>
        {([["≡ Left","left"],["≡ Center","center"],["≡ Right","right"]] as [string,string][]).map(([label,val])=>(
          <button key={val}
            onMouseDown={captureSel}
            onClick={()=>applyAlign(val as any)}
            title={`Align selected text ${val}`}
            style={{...IBStyle(),fontSize:13,padding:"5px 12px"}}
            onMouseEnter={e=>(e.currentTarget.style.background=accentHover)}
            onMouseLeave={e=>(e.currentTarget.style.background="transparent")}
          >{label}</button>
        ))}

        <div style={{width:1,height:22,background:border,margin:"0 8px"}}/>

        {/* Text Color — selection-aware */}
        <div style={{position:"relative"}}>
          <button
            onMouseDown={captureSel}
            onClick={e=>{e.stopPropagation();setShowTextColor(v=>!v);setShowBgColor(false);}}
            style={{...IBStyle(),display:"flex",alignItems:"center",gap:6,padding:"5px 10px",fontSize:12,fontWeight:500}}
            onMouseEnter={e=>(e.currentTarget.style.background=accentHover)}
            onMouseLeave={e=>(e.currentTarget.style.background="transparent")}
            title="Text color — applies to selection if text is selected"
          >
            <span>A</span>
            <span style={{display:"inline-block",width:18,height:4,background:activeTextColor,borderRadius:2,border:`1px solid ${border}`}}/>
            <span style={{fontSize:10,color:muted}}>▼</span>
          </button>
          {showTextColor&&(
            <div style={{position:"absolute",top:"110%",left:0,background:menuBg,border:`1px solid ${border}`,borderRadius:8,padding:10,zIndex:300,boxShadow:"0 8px 24px rgba(0,0,0,0.15)",minWidth:200}}>
              <div style={{fontSize:11,color:muted,marginBottom:4,fontWeight:600}}>Text Color</div>
              <div style={{fontSize:10,color:muted,marginBottom:8}}>Select text first to color only that selection</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {TEXT_COLORS.map(c=>(
                  <button key={c}
                    onMouseDown={captureSel}
                    onClick={()=>applyTextColor(c)}
                    style={{width:26,height:26,borderRadius:5,background:c,border:c===activeTextColor?`2px solid ${text_c}`:`1px solid ${border}`,cursor:"pointer"}}/>
                ))}
              </div>
              <input type="color" value={activeTextColor==="transparent"?"#000000":activeTextColor} onChange={e=>applyTextColor(e.target.value)}
                style={{marginTop:8,width:"100%",height:30,border:`1px solid ${border}`,borderRadius:5,cursor:"pointer",background:"transparent"}}/>
            </div>
          )}
        </div>

        {/* Background / Highlight Color — selection-aware */}
        <div style={{position:"relative"}}>
          <button
            onMouseDown={captureSel}
            onClick={e=>{e.stopPropagation();setShowBgColor(v=>!v);setShowTextColor(false);}}
            style={{...IBStyle(),display:"flex",alignItems:"center",gap:6,padding:"5px 10px",fontSize:12,fontWeight:500}}
            onMouseEnter={e=>(e.currentTarget.style.background=accentHover)}
            onMouseLeave={e=>(e.currentTarget.style.background="transparent")}
            title="Highlight — applies to selection if text is selected"
          >
            <span style={{background:activeBgColor==="transparent"?"repeating-linear-gradient(45deg,#ccc 0,#ccc 2px,#fff 0,#fff 6px)":activeBgColor,display:"inline-block",width:18,height:14,borderRadius:3,border:`1px solid ${border}`}}/>
            <span style={{fontSize:12}}>Highlight</span>
            <span style={{fontSize:10,color:muted}}>▼</span>
          </button>
          {showBgColor&&(
            <div style={{position:"absolute",top:"110%",left:0,background:menuBg,border:`1px solid ${border}`,borderRadius:8,padding:10,zIndex:300,boxShadow:"0 8px 24px rgba(0,0,0,0.15)",minWidth:200}}>
              <div style={{fontSize:11,color:muted,marginBottom:4,fontWeight:600}}>Highlight Color</div>
              <div style={{fontSize:10,color:muted,marginBottom:8}}>Select text first to highlight only that selection</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {BG_COLORS.map(c=>(
                  <button key={c} onClick={()=>applyBgColor(c)}
                    style={{width:26,height:26,borderRadius:5,background:c==="transparent"?"repeating-linear-gradient(45deg,#ccc 0,#ccc 2px,#fff 0,#fff 6px)":c,border:c===activeBgColor?`2px solid ${text_c}`:`1px solid ${border}`,cursor:"pointer"}}/>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{width:1,height:22,background:border,margin:"0 8px"}}/>

        {/* View mode buttons */}
        {(["plain","markdown","monaco","diff"] as const).map(mode=>(
          <button key={mode} onClick={()=>{if(mode==="diff"){setDiffBase(text);}setViewMode(mode);}}
            style={{...IBStyle(viewMode===mode),fontSize:12,padding:"4px 10px",textTransform:"capitalize"}}
            onMouseEnter={e=>{if(viewMode!==mode)e.currentTarget.style.background=accentHover;}}
            onMouseLeave={e=>{if(viewMode!==mode)e.currentTarget.style.background="transparent";}}
          >{mode==="monaco"?"Code":mode==="diff"?"Diff":mode==="markdown"?"Markdown":mode}</button>
        ))}

        <div style={{width:1,height:22,background:border,margin:"0 8px"}}/>

        {/* Line numbers toggle */}
        <button onClick={()=>setShowLineNumbers(v=>!v)}
          style={{...IBStyle(showLineNumbers),fontSize:12,padding:"4px 10px"}}
          onMouseEnter={e=>{if(!showLineNumbers)e.currentTarget.style.background=accentHover;}}
          onMouseLeave={e=>{if(!showLineNumbers)e.currentTarget.style.background="transparent";}}
        ># Lines</button>

        <div style={{width:1,height:22,background:border,margin:"0 8px"}}/>

        {/* Find / Replace */}
        <button onClick={()=>setShowFind(f=>!f)}
          style={{...IBStyle(showFind),fontSize:12,fontWeight:500,padding:"5px 12px",display:"flex",alignItems:"center",gap:5}}
          onMouseEnter={e=>{if(!showFind)e.currentTarget.style.background=accentHover;}}
          onMouseLeave={e=>{if(!showFind)e.currentTarget.style.background="transparent";}}
        >🔍 Find</button>

        {/* Word wrap */}
        <button onClick={()=>setWordWrap(w=>!w)}
          style={{...IBStyle(wordWrap),fontSize:12,padding:"5px 12px"}}
          onMouseEnter={e=>{if(!wordWrap)e.currentTarget.style.background=accentHover;}}
          onMouseLeave={e=>{if(!wordWrap)e.currentTarget.style.background="transparent";}}
        >↵ Wrap</button>
      </div>

      {/* ── FIND & REPLACE BAR ── */}
      {showFind&&(
        <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:8,padding:"8px 24px",background:darkMode?"#12151f":"#e8e8e8",borderBottom:`1px solid ${border}`}}>
          <span style={{fontSize:12,fontWeight:600,color:muted}}>Find & Replace</span>
          <input placeholder="Find…" value={findText} onChange={e=>setFindText(e.target.value)}
            style={IS(surface,border,text_c)} onKeyDown={e=>{if(e.key==="Enter")findOnly();}}/>
          <input id="replace-input" placeholder="Replace with…" value={replaceText} onChange={e=>setReplaceText(e.target.value)}
            style={IS(surface,border,text_c)} onKeyDown={e=>{if(e.key==="Enter")findAndReplace();}}/>
          <button onClick={findOnly}       style={SB(border,text_c)}>Find</button>
          <button onClick={findAndReplace} style={{...SB(border,text_c),background:accent,color:"#fff",borderColor:accent}}>Replace All</button>
          <button onClick={()=>setShowFind(false)} style={{...SB(border,muted),marginLeft:"auto"}}>✕ Close</button>
        </div>
      )}

      {/* ── EDITOR AREA ── */}
      <div ref={dropZoneRef} onDrop={handleDrop} onDragOver={e=>e.preventDefault()} style={{flex:1,display:"flex",flexDirection:"column",padding:"20px 24px"}}>

        {/* Plain text with optional line numbers */}
        {viewMode==="plain"&&(
          <div style={{flex:1,display:"flex",minHeight:"calc(100vh - 340px)"}}>
            {showLineNumbers&&(
              <div style={{
                userSelect:"none",padding:"24px 12px 24px 0",textAlign:"right",
                fontSize:fontSize,lineHeight:1.8,fontFamily:fontMap[font]??`${font},sans-serif`,
                color:muted,background:"#f9f9f9",borderRight:`1px solid ${border}`,
                minWidth:48,overflowY:"hidden",flexShrink:0,
                ...(darkMode?{background:"#12151f"}:{})
              }}>
                {text.split("\n").map((_,i)=>(
                  <div key={i} style={{paddingRight:12,height:`calc(${fontSize}px * 1.8)`}}>{i+1}</div>
                ))}
              </div>
            )}
            <textarea
              ref={textareaRef}
              value={text}
              onChange={e=>handleChange(e.target.value)}
              onKeyDown={handleTabKey}
              onSelect={trackSelection}
              onMouseUp={trackSelection}
              onKeyUp={trackSelection}
              onPaste={handlePasteImage}
              placeholder="Start typing… drag & drop images to embed them"
              spellCheck
              style={{
                flex:1,width:"100%",
                background:"#ffffff",
                color:activeTextColor==="transparent"?text_c:activeTextColor,
                backgroundColor:activeBgColor==="transparent"?"#ffffff":activeBgColor,
                border:`1px solid ${border}`,borderRadius:showLineNumbers?"0 8px 8px 0":8,
                padding:"24px 28px",
                fontSize:fontSize,
                fontFamily:fontMap[font]??`${font},sans-serif`,
                lineHeight:1.8,resize:"none",outline:"none",
                whiteSpace:wordWrap?"pre-wrap":"pre",
                overflowWrap:wordWrap?"break-word":"normal",
                overflowX:wordWrap?"hidden":"auto",
                transition:"border-color 0.2s",
                boxShadow:"0 2px 12px rgba(0,0,0,0.06)",
              }}
              onFocus={e=>(e.target.style.borderColor=accent)}
              onBlur={e=>(e.target.style.borderColor=border)}
            />
          </div>
        )}

        {/* Markdown Preview */}
        {viewMode==="markdown"&&(
          <div style={{display:"flex",gap:16,flex:1,minHeight:"calc(100vh - 340px)"}}>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={e=>handleChange(e.target.value)}
              onKeyDown={handleTabKey}
              onSelect={trackSelection}
              onMouseUp={trackSelection}
              onKeyUp={trackSelection}
              onPaste={handlePasteImage}
              spellCheck
              placeholder="Write Markdown here…"
              style={{
                flex:1,background:"#ffffff",color:text_c,
                border:`1px solid ${border}`,borderRadius:8,
                padding:"24px 28px",fontSize:fontSize,
                fontFamily:"'Courier New',monospace",
                lineHeight:1.8,resize:"none",outline:"none",
                boxShadow:"0 2px 12px rgba(0,0,0,0.06)",
              }}
              onFocus={e=>(e.target.style.borderColor=accent)}
              onBlur={e=>(e.target.style.borderColor=border)}
            />
            <div style={{
              flex:1,background:"#ffffff",color:text_c,
              border:`1px solid ${border}`,borderRadius:8,
              padding:"24px 28px",fontSize:fontSize,
              lineHeight:1.8,overflowY:"auto",
              boxShadow:"0 2px 12px rgba(0,0,0,0.06)",
            }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Monaco Code Editor */}
        {viewMode==="monaco"&&(
          <div style={{flex:1,minHeight:"calc(100vh - 340px)",border:`1px solid ${border}`,borderRadius:8,overflow:"hidden",boxShadow:"0 2px 12px rgba(0,0,0,0.06)"}}>
            <MonacoEditor
              height="100%"
              defaultLanguage="markdown"
              value={text}
              theme={darkMode?"vs-dark":"vs-light"}
              onChange={v=>handleChange(v??"")}
              options={{
                fontSize,fontFamily:fontMap[font]??`${font},sans-serif`,
                lineNumbers:showLineNumbers?"on":"off",
                wordWrap:wordWrap?"on":"off",
                minimap:{enabled:false},
                scrollBeyondLastLine:false,
              }}
            />
          </div>
        )}

        {/* Diff View */}
        {viewMode==="diff"&&(
          <div style={{flex:1,display:"flex",gap:16,minHeight:"calc(100vh - 340px)"}}>
            <div style={{flex:1}}>
              <div style={{fontSize:11,fontWeight:600,color:muted,marginBottom:6}}>Original (snapshot)</div>
              <textarea value={diffBase} onChange={e=>setDiffBase(e.target.value)}
                style={{width:"100%",height:"calc(100% - 24px)",background:"#fff5f5",color:text_c,border:`1px solid ${border}`,borderRadius:8,padding:"16px",fontSize:fontSize,fontFamily:"'Courier New',monospace",lineHeight:1.8,resize:"none",outline:"none"}}
              />
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:11,fontWeight:600,color:muted,marginBottom:6}}>Current (modified)</div>
              <textarea ref={textareaRef} value={text} onChange={e=>handleChange(e.target.value)}
                style={{width:"100%",height:"calc(100% - 24px)",background:"#f0fff4",color:text_c,border:`1px solid ${border}`,borderRadius:8,padding:"16px",fontSize:fontSize,fontFamily:"'Courier New',monospace",lineHeight:1.8,resize:"none",outline:"none"}}
              />
            </div>
            <div style={{flex:1}}>
              <div style={{fontSize:11,fontWeight:600,color:muted,marginBottom:6}}>Diff</div>
              <div style={{height:"calc(100% - 24px)",overflowY:"auto",border:`1px solid ${border}`,borderRadius:8,background:"#ffffff",padding:"8px 0"}}>
                {computeDiff(diffBase, text)}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── STATUS BAR ── */}
      <div style={{display:"flex",alignItems:"center",gap:20,padding:"6px 24px",background:surface,borderTop:`1px solid ${border}`,fontSize:12,color:muted,flexWrap:"wrap"}}>
        <span>Words: <b style={{color:text_c}}>{wordCount}</b></span>
        <span>Chars: <b style={{color:text_c}}>{charCount}</b></span>
        <span>Lines: <b style={{color:text_c}}>{lineCount}</b></span>
        <span>Read: <b style={{color:text_c}}>{readingTime(text)}</b></span>
        <span style={{marginLeft:"auto"}}>{font} {fontSize}px · {wordWrap?"Wrap":"No wrap"} · {viewMode}</span>
      </div>

      {/* ── FLOATING TOOLTIP ── */}
      {tooltip&&(
        <div style={{position:"fixed",left:tooltip.x,top:tooltip.y,transform:"translateX(-50%)",background:"#1a1a1a",color:"#fff",fontSize:11,padding:"4px 10px",borderRadius:5,pointerEvents:"none",zIndex:999,whiteSpace:"nowrap",boxShadow:"0 2px 8px rgba(0,0,0,0.3)"}}>
          {tooltip.label}
        </div>
      )}

      {/* ── SPECIAL CHAR MODAL ── */}
      {showSpecial&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowSpecial(false)}>
          <div onClick={e=>e.stopPropagation()} style={{background:menuBg,border:`1px solid ${border}`,borderRadius:10,padding:24,minWidth:360,boxShadow:"0 16px 40px rgba(0,0,0,0.2)"}}>
            <div style={{fontWeight:700,fontSize:15,marginBottom:16,color:text_c}}>Special Characters</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {SPECIAL_CHARS.map(c=>(
                <button key={c} onClick={()=>{insertAtCursor(c);setShowSpecial(false);}}
                  style={{width:40,height:40,fontSize:18,background:darkMode?"#12151f":"#f5f5f5",border:`1px solid ${border}`,borderRadius:6,cursor:"pointer",color:text_c,transition:"background 0.1s"}}
                  onMouseEnter={e=>(e.currentTarget.style.background=accentHover)}
                  onMouseLeave={e=>(e.currentTarget.style.background=darkMode?"#12151f":"#f5f5f5")}
                >{c}</button>
              ))}
            </div>
            <button onClick={()=>setShowSpecial(false)} style={{marginTop:16,padding:"6px 16px",background:"transparent",border:`1px solid ${border}`,borderRadius:6,color:muted,cursor:"pointer",fontSize:12}}>Close</button>
          </div>
        </div>
      )}

      {/* ── SHORTCUTS MODAL ── */}
      {showShortcuts&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowShortcuts(false)}>
          <div onClick={e=>e.stopPropagation()} style={{background:menuBg,border:`1px solid ${border}`,borderRadius:10,padding:28,minWidth:360,boxShadow:"0 16px 40px rgba(0,0,0,0.2)"}}>
            <div style={{fontWeight:700,fontSize:16,marginBottom:18,color:text_c}}>⌨ Keyboard Shortcuts</div>
            {[
              ["Ctrl+T","New Tab"],["Ctrl+W","Close Tab"],["Ctrl+N","New File"],
              ["Ctrl+S","Save .txt"],["Ctrl+O","Open"],["Ctrl+P","Print"],
              ["Ctrl+Z","Undo"],["Ctrl+Y","Redo"],
              ["Ctrl+X","Cut"],["Ctrl+C","Copy"],["Ctrl+V","Paste"],["Ctrl+A","Select All"],
              ["Ctrl+F","Find & Replace"],
              ["Ctrl+B","Bold"],["Ctrl+I","Italic"],["Ctrl+U","Underline"],
              ["Tab","Insert 2 spaces"],
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

// ── TabItem Component ─────────────────────────────────────────────────────────
function TabItem({ tab, isActive, onActivate, onClose, onPin, onRename, darkMode, surface, border, text_c, muted, accent, accentHover }: {
  tab: Tab; isActive: boolean; onActivate: ()=>void; onClose: ()=>void;
  onPin: ()=>void; onRename: (t:string)=>void;
  darkMode:boolean;surface:string;border:string;text_c:string;muted:string;accent:string;accentHover:string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState(tab.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(()=>{ if(editing) inputRef.current?.select(); },[editing]);

  function commit() { onRename(draft.trim()||"Untitled"); setEditing(false); }

  return (
    <div
      onClick={onActivate}
      onDoubleClick={()=>setEditing(true)}
      style={{
        display:"flex",alignItems:"center",gap:4,
        padding:"8px 14px",
        borderRight:`1px solid ${border}`,
        background:isActive?(darkMode?"#0f1117":"#f2f2f2"):surface,
        borderBottom:isActive?`2px solid ${accent}`:`2px solid transparent`,
        cursor:"pointer",flexShrink:0,
        transition:"background 0.1s",
        position:"relative",
      }}
    >
      {tab.pinned&&<span style={{fontSize:10,color:muted}}>📌</span>}
      {editing?(
        <input ref={inputRef} value={draft} onChange={e=>setDraft(e.target.value)}
          onBlur={commit} onKeyDown={e=>{if(e.key==="Enter")commit();if(e.key==="Escape")setEditing(false);}}
          onClick={e=>e.stopPropagation()}
          style={{fontSize:12,border:`1px solid ${border}`,borderRadius:4,padding:"1px 4px",width:90,outline:"none",background:surface,color:text_c}}
        />
      ):(
        <span style={{fontSize:12,fontWeight:isActive?600:400,color:isActive?text_c:muted,maxWidth:100,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
          {tab.title}
        </span>
      )}
      {/* Pin button */}
      <button onClick={e=>{e.stopPropagation();onPin();}}
        title={tab.pinned?"Unpin":"Pin"}
        style={{background:"transparent",border:"none",padding:"0 2px",cursor:"pointer",color:muted,fontSize:11,opacity:0.6}}
        onMouseEnter={e=>(e.currentTarget.style.opacity="1")}
        onMouseLeave={e=>(e.currentTarget.style.opacity="0.6")}
      >{tab.pinned?"🔓":"📌"}</button>
      {/* Close button */}
      {!tab.pinned&&(
        <button onClick={e=>{e.stopPropagation();onClose();}}
          style={{background:"transparent",border:"none",padding:"0 2px",cursor:"pointer",color:muted,fontSize:13,lineHeight:1}}
          onMouseEnter={e=>(e.currentTarget.style.color=text_c)}
          onMouseLeave={e=>(e.currentTarget.style.color=muted)}
        >×</button>
      )}
    </div>
  );
}