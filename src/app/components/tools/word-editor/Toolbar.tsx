"use client";

import { Editor } from "@tiptap/react";
import { useState, useRef, useCallback } from "react";
import styles from "./Toolbar.module.css";

interface ToolbarProps {
  editor: Editor;
  onInsertImage: (src: string, alt?: string) => void;
  onInsertTable: () => void;
  onFind?: () => void;
}

const FONT_FAMILIES = [
  "Calibri","Arial","Times New Roman","Courier New","Georgia",
  "Verdana","Comic Sans MS","Impact","Trebuchet MS","Cambria",
  "Garamond","Palatino","Tahoma","Century Gothic","Helvetica",
];
const FONT_SIZES = ["8","9","10","11","12","14","16","18","20","22","24","26","28","32","36","48","72"];
const PARA_STYLES = [
  { label:"Normal", value:"paragraph" },
  { label:"Heading 1", value:"h1" },{ label:"Heading 2", value:"h2" },
  { label:"Heading 3", value:"h3" },{ label:"Heading 4", value:"h4" },
  { label:"Heading 5", value:"h5" },{ label:"Heading 6", value:"h6" },
];

/* ── Tooltip ─────────────────────────────────────────────────────────────── */
function Tip({ label, shortcut, children }: { label: string; shortcut?: string; children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  return (
    <div ref={ref} className={styles.tipWrap}
      onMouseEnter={() => {
        if (ref.current) { const r = ref.current.getBoundingClientRect(); setPos({ top: r.bottom + 8, left: r.left + r.width / 2 }); }
        setShow(true);
      }}
      onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div className={styles.tooltip} style={{ top: pos.top, left: pos.left }}>
          <span className={styles.tipLabel}>{label}</span>
          {shortcut && <span className={styles.tipShortcut}>{shortcut}</span>}
        </div>
      )}
    </div>
  );
}

/* ── Main Toolbar ────────────────────────────────────────────────────────── */
export default function Toolbar({
  editor, onInsertImage, onInsertTable, onFind,
}: ToolbarProps) {
  const [fontSize, setFontSize] = useState("12");
  const [fontFamily, setFontFamily] = useState("Calibri");
  const imageRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const savedSelRef = useRef<{ from: number; to: number } | null>(null);

  const editorFontFamily = editor.getAttributes("textStyle").fontFamily;
  const editorFontSize   = editor.getAttributes("textStyle").fontSize;
  const displayFamily    = editorFontFamily || fontFamily;
  const displaySize      = editorFontSize ? editorFontSize.replace(/pt$/, "") : fontSize;

  const saveSelection = () => {
    const { from, to } = editor.state.selection;
    savedSelRef.current = { from, to };
  };

  const withSel = (cb: (c: ReturnType<typeof editor.chain>) => void) => {
    const s = savedSelRef.current;
    const c = s ? editor.chain().focus().setTextSelection(s) : editor.chain().focus();
    cb(c);
  };

  const applyFamily = (f: string) => { setFontFamily(f); withSel(c => c.setFontFamily(f).run()); };
  const applySize   = (s: string) => { setFontSize(s);   withSel(c => (c as any).setFontSize(`${s}pt`).run()); };

  const applyStyle = (v: string) => {
    const map: Record<string,number> = { h1:1,h2:2,h3:3,h4:4,h5:5,h6:6 };
    if (map[v]) editor.chain().focus().toggleHeading({ level: map[v] as any }).run();
    else editor.chain().focus().setParagraph().run();
  };
  const curStyle = () => {
    for (let i = 1; i <= 6; i++) if (editor.isActive("heading",{level:i})) return `h${i}`;
    return "paragraph";
  };

  const handleImage = useCallback(async (file: File) => {
    const reader = new FileReader();
    reader.onload = e => onInsertImage(e.target?.result as string, file.name);
    reader.readAsDataURL(file);
  }, [onInsertImage]);

  const handleAudio = useCallback((file: File) => {
    editor.chain().focus().insertContent({ type:"audio", attrs:{ src:URL.createObjectURL(file), title:file.name } }).run();
  }, [editor]);

  const handleVideo = useCallback((file: File) => {
    editor.chain().focus().insertContent({ type:"video", attrs:{ src:URL.createObjectURL(file), title:file.name } }).run();
  }, [editor]);

  const insertHr = () => {
    if (editor.isActive("table")) {
      editor.chain().focus().command(({ tr, state, dispatch }) => {
        const tableEnd = state.selection.$to.end(1);
        const para = state.schema.nodes.paragraph.create();
        const hr   = state.schema.nodes.horizontalRule?.create();
        if (!hr || !dispatch) return false;
        dispatch(tr.insert(tableEnd, [para, hr, para]));
        return true;
      }).run();
    } else {
      editor.chain().focus().setHorizontalRule().run();
    }
  };

  return (
    <>
      <input ref={imageRef} type="file" accept="image/*" hidden onChange={e => e.target.files?.[0] && handleImage(e.target.files[0])} />
      <input ref={audioRef} type="file" accept="audio/*" hidden onChange={e => e.target.files?.[0] && handleAudio(e.target.files[0])} />
      <input ref={videoRef} type="file" accept="video/*" hidden onChange={e => e.target.files?.[0] && handleVideo(e.target.files[0])} />

      <div className={styles.toolbarWrapper}>
        <div className={styles.toolbar}>

          {/* History */}
          <div className={styles.grp}>
            <div className={styles.grpRow}>
              <Tip label="Undo" shortcut="Ctrl+Z"><button className={styles.btn} disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}><UndoSvg/></button></Tip>
              <Tip label="Redo" shortcut="Ctrl+Y"><button className={styles.btn} disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}><RedoSvg/></button></Tip>
            </div>
            <span className={styles.grpLabel}>History</span>
          </div>
          <div className={styles.divider}/>

          {/* Style */}
          <div className={styles.grp}>
            <div className={styles.grpRow}>
              <select value={curStyle()} onChange={e => applyStyle(e.target.value)} className={`${styles.sel} ${styles.selStyle}`}>
                {PARA_STYLES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <span className={styles.grpLabel}>Style</span>
          </div>
          <div className={styles.divider}/>

          {/* Font */}
          <div className={styles.grp}>
            <div className={styles.grpRow}>
              <select value={displayFamily} onMouseDown={saveSelection} onChange={e => applyFamily(e.target.value)} className={`${styles.sel} ${styles.selFont}`}>
                {FONT_FAMILIES.map(f => <option key={f} value={f} style={{fontFamily:f}}>{f}</option>)}
              </select>
              <select value={displaySize} onMouseDown={saveSelection} onChange={e => applySize(e.target.value)} className={`${styles.sel} ${styles.selSize}`}>
                {FONT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <Tip label="Increase size"><button className={styles.btn} onClick={() => { const i=FONT_SIZES.indexOf(displaySize); const n=FONT_SIZES[i+1]; if(n) applySize(n); }}>A<sup style={{fontSize:8}}>+</sup></button></Tip>
              <Tip label="Decrease size"><button className={styles.btn} onClick={() => { const i=FONT_SIZES.indexOf(displaySize); const n=FONT_SIZES[i-1]; if(n) applySize(n); }}>A<sup style={{fontSize:8}}>−</sup></button></Tip>
            </div>
            <span className={styles.grpLabel}>Font</span>
          </div>
          <div className={styles.divider}/>

          {/* Format */}
          <div className={styles.grp}>
            <div className={styles.grpRow}>
              <Tip label="Bold" shortcut="Ctrl+B"><button className={`${styles.btn} ${editor.isActive("bold")?styles.active:""}`} onClick={() => editor.chain().focus().toggleBold().run()}><BoldSvg/></button></Tip>
              <Tip label="Italic" shortcut="Ctrl+I"><button className={`${styles.btn} ${editor.isActive("italic")?styles.active:""}`} onClick={() => editor.chain().focus().toggleItalic().run()}><ItalicSvg/></button></Tip>
              <Tip label="Underline" shortcut="Ctrl+U"><button className={`${styles.btn} ${editor.isActive("underline")?styles.active:""}`} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineSvg/></button></Tip>
              <Tip label="Strikethrough"><button className={`${styles.btn} ${editor.isActive("strike")?styles.active:""}`} onClick={() => editor.chain().focus().toggleStrike().run()}><StrikeSvg/></button></Tip>
              <Tip label="Subscript"><button className={`${styles.btn} ${editor.isActive("subscript")?styles.active:""}`} onClick={() => (editor.chain().focus() as any).toggleSubscript?.().run()}>X<sub style={{fontSize:8}}>2</sub></button></Tip>
              <Tip label="Superscript"><button className={`${styles.btn} ${editor.isActive("superscript")?styles.active:""}`} onClick={() => (editor.chain().focus() as any).toggleSuperscript?.().run()}>X<sup style={{fontSize:8}}>2</sup></button></Tip>
              <span className={styles.miniDivider}/>
              <Tip label="Font Color">
                <label className={`${styles.btn} ${styles.colorBtn}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><text x="2" y="19" fontSize="19" fontWeight="800">A</text></svg>
                  <div className={styles.colorStripe} style={{background:"#e53e3e"}}/>
                  <input type="color" className={styles.hiddenColor} onChange={e => editor.chain().focus().setColor(e.target.value).run()}/>
                </label>
              </Tip>
              <Tip label="Highlight">
                <label className={`${styles.btn} ${styles.colorBtn}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 3L3 9l9 9 6-6-9-9z"/><path d="M3 21h6"/></svg>
                  <div className={styles.colorStripe} style={{background:"#fef08a"}}/>
                  <input type="color" className={styles.hiddenColor} onChange={e => editor.chain().focus().toggleHighlight({color:e.target.value}).run()}/>
                </label>
              </Tip>
              <Tip label="Clear Formatting"><button className={styles.btn} onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}><ClearSvg/></button></Tip>
            </div>
            <span className={styles.grpLabel}>Format</span>
          </div>
          <div className={styles.divider}/>

          {/* Paragraph */}
          <div className={styles.grp}>
            <div className={styles.grpRow}>
              {(["left","center","right","justify"] as const).map(a => (
                <Tip key={a} label={`Align ${a}`}>
                  <button className={`${styles.btn} ${editor.isActive({textAlign:a})?styles.active:""}`} onClick={() => editor.chain().focus().setTextAlign(a).run()}>
                    <AlignSvg align={a}/>
                  </button>
                </Tip>
              ))}
              <span className={styles.miniDivider}/>
              <Tip label="Bullet List"><button className={`${styles.btn} ${editor.isActive("bulletList")?styles.active:""}`} onClick={() => editor.chain().focus().toggleBulletList().run()}><BulletSvg/></button></Tip>
              <Tip label="Numbered List"><button className={`${styles.btn} ${editor.isActive("orderedList")?styles.active:""}`} onClick={() => editor.chain().focus().toggleOrderedList().run()}><NumberSvg/></button></Tip>
              <Tip label="Task List"><button className={`${styles.btn} ${editor.isActive("taskList")?styles.active:""}`} onClick={() => editor.chain().focus().toggleTaskList()}><TaskSvg/></button></Tip>
              <Tip label="Outdent"><button className={styles.btn} onClick={() => editor.chain().focus().liftListItem("listItem").run()}><OutdentSvg/></button></Tip>
              <Tip label="Indent"><button className={styles.btn} onClick={() => editor.chain().focus().sinkListItem("listItem").run()}><IndentSvg/></button></Tip>
            </div>
            <span className={styles.grpLabel}>Paragraph</span>
          </div>
          <div className={styles.divider}/>

          {/* Insert */}
          <div className={styles.grp}>
            <div className={styles.grpRow}>
              <Tip label="Insert Image"><button className={`${styles.btn} ${styles.mediaBtn} ${styles.imgBtn}`} onClick={() => imageRef.current?.click()}><ImgSvg/><span>Image</span></button></Tip>
              <Tip label="Insert Audio"><button className={`${styles.btn} ${styles.mediaBtn} ${styles.audioBtn}`} onClick={() => audioRef.current?.click()}><AudioSvg/><span>Audio</span></button></Tip>
              <Tip label="Insert Video"><button className={`${styles.btn} ${styles.mediaBtn} ${styles.videoBtn}`} onClick={() => videoRef.current?.click()}><VideoSvg/><span>Video</span></button></Tip>
              <span className={styles.miniDivider}/>
              <Tip label="Insert Link" shortcut="Ctrl+K"><button className={`${styles.btn} ${editor.isActive("link")?styles.active:""}`} onClick={() => { const u=prompt("Enter URL:"); if(u) editor.chain().focus().setLink({href:u}).run(); }}><LinkSvg/></button></Tip>
              <Tip label="Horizontal Rule"><button className={styles.btn} onClick={insertHr}><HrSvg/></button></Tip>
              <Tip label="Blockquote"><button className={`${styles.btn} ${editor.isActive("blockquote")?styles.active:""}`} onClick={() => editor.chain().focus().toggleBlockquote().run()}><QuoteSvg/></button></Tip>
              <Tip label="Code Block"><button className={`${styles.btn} ${editor.isActive("codeBlock")?styles.active:""}`} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><CodeSvg/></button></Tip>
            </div>
            <span className={styles.grpLabel}>Insert</span>
          </div>
          <div className={styles.divider}/>

          {/* Table */}
          <div className={styles.grp}>
            <div className={styles.grpRow}>
              <Tip label="Insert Table"><button className={`${styles.btn} ${styles.accentBtn}`} onClick={onInsertTable}><TableSvg/></button></Tip>
              <Tip label="Add Row Below"><button className={styles.btn} disabled={!editor.isActive("table")} onClick={() => editor.chain().focus().addRowAfter().run()}><AddRowSvg/></button></Tip>
              <Tip label="Add Column Right"><button className={styles.btn} disabled={!editor.isActive("table")} onClick={() => editor.chain().focus().addColumnAfter().run()}><AddColSvg/></button></Tip>
              <Tip label="Delete Row"><button className={`${styles.btn} ${styles.dangerBtn}`} disabled={!editor.isActive("table")} onClick={() => editor.chain().focus().deleteRow().run()}><DelRowSvg/></button></Tip>
              <Tip label="Delete Column"><button className={`${styles.btn} ${styles.dangerBtn}`} disabled={!editor.isActive("table")} onClick={() => editor.chain().focus().deleteColumn().run()}><DelColSvg/></button></Tip>
              <Tip label="Delete Table"><button className={`${styles.btn} ${styles.dangerBtn}`} disabled={!editor.isActive("table")} onClick={() => editor.chain().focus().deleteTable().run()}><DelTableSvg/></button></Tip>
            </div>
            <span className={styles.grpLabel}>Table</span>
          </div>
          <div className={styles.divider}/>

          {/* Tools */}
          <div className={styles.grp}>
            <div className={styles.grpRow}>
              <Tip label="Find & Replace" shortcut="Ctrl+H"><button className={styles.btn} onClick={onFind}><SearchSvg/></button></Tip>
            </div>
            <span className={styles.grpLabel}>Tools</span>
          </div>

        </div>
      </div>
    </>
  );
}

/* ── SVG icon components ─────────────────────────────────────────────────── */
const s = (w=16,h=16) => ({ width:w, height:h, viewBox:"0 0 24 24", fill:"none" as const, stroke:"currentColor" as const, strokeWidth:2.2 });
const UndoSvg  = () => <svg {...s()}><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/></svg>;
const RedoSvg  = () => <svg {...s()}><polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/></svg>;
const BoldSvg  = () => <svg {...s()} fill="currentColor" stroke="none"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" opacity="0.9"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" opacity="0.9"/></svg>;
const ItalicSvg= () => <svg {...s()}><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>;
const UnderlineSvg=()=><svg {...s()}><path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/></svg>;
const StrikeSvg= () => <svg {...s()}><path d="M17.3 12H6.7"/><path d="M12 6C9.8 6 8 7.3 8 9c0 .8.4 1.5 1 2"/><path d="M12 18c2.2 0 4-1.3 4-3 0-.8-.4-1.5-1-2"/></svg>;
const ClearSvg = () => <svg {...s()}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/><line x1="2" y1="2" x2="22" y2="22"/></svg>;
const AlignSvg = ({align}:{align:string}) => <svg {...s()}>
  {align==="left"    && <><line x1="21" y1="6" x2="3" y2="6"/><line x1="15" y1="12" x2="3" y2="12"/><line x1="17" y1="18" x2="3" y2="18"/></>}
  {align==="center"  && <><line x1="21" y1="6" x2="3" y2="6"/><line x1="18" y1="12" x2="6" y2="12"/><line x1="21" y1="18" x2="3" y2="18"/></>}
  {align==="right"   && <><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="12" x2="9" y2="12"/><line x1="21" y1="18" x2="7" y2="18"/></>}
  {align==="justify" && <><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="12" x2="3" y2="12"/><line x1="21" y1="18" x2="3" y2="18"/></>}
</svg>;
const BulletSvg= () => <svg {...s()}><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.5" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.5" fill="currentColor" stroke="none"/></svg>;
const NumberSvg= () => <svg {...s()}><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>;
const TaskSvg  = () => <svg {...s()}><rect x="3" y="5" width="6" height="6" rx="1"/><polyline points="4 8 6 10 8 6"/><line x1="13" y1="8" x2="21" y2="8"/><rect x="3" y="15" width="6" height="6" rx="1"/><line x1="13" y1="18" x2="21" y2="18"/></svg>;
const OutdentSvg=()=><svg {...s()}><polyline points="11 17 6 12 11 7"/><line x1="17" y1="7" x2="17" y2="17"/><line x1="6" y1="12" x2="21" y2="12"/></svg>;
const IndentSvg= () => <svg {...s()}><polyline points="13 17 18 12 13 7"/><line x1="7" y1="7" x2="7" y2="17"/><line x1="3" y1="12" x2="18" y2="12"/></svg>;
const ImgSvg   = () => <svg {...s()}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
const AudioSvg = () => <svg {...s()}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>;
const VideoSvg = () => <svg {...s()}><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>;
const LinkSvg  = () => <svg {...s()}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>;
const HrSvg    = () => <svg {...s()}><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="8" x2="5" y2="8" strokeWidth="1.5" opacity="0.5"/><line x1="19" y1="8" x2="22" y2="8" strokeWidth="1.5" opacity="0.5"/></svg>;
const QuoteSvg = () => <svg {...s()} fill="currentColor" stroke="none"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>;
const CodeSvg  = () => <svg {...s()}><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
const SearchSvg= () => <svg {...s()}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const TableSvg = () => <svg {...s()}><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="12" y1="3" x2="12" y2="21"/></svg>;
const AddRowSvg= () => <svg {...s()}><rect x="3" y="3" width="18" height="10" rx="1"/><line x1="3" y1="8" x2="21" y2="8"/><line x1="12" y1="17" x2="12" y2="23"/><line x1="9" y1="20" x2="15" y2="20"/></svg>;
const AddColSvg= () => <svg {...s()}><rect x="3" y="3" width="10" height="18" rx="1"/><line x1="8" y1="3" x2="8" y2="21"/><line x1="17" y1="9" x2="23" y2="9"/><line x1="20" y1="6" x2="20" y2="12"/></svg>;
const DelRowSvg= () => <svg {...s()}><rect x="3" y="3" width="18" height="10" rx="1"/><line x1="3" y1="8" x2="21" y2="8"/><line x1="9" y1="19" x2="15" y2="19"/></svg>;
const DelColSvg= () => <svg {...s()}><rect x="3" y="3" width="10" height="18" rx="1"/><line x1="8" y1="3" x2="8" y2="21"/><line x1="17" y1="9" x2="23" y2="15"/><line x1="23" y1="9" x2="17" y2="15"/></svg>;
const DelTableSvg=()=><svg {...s()}><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="9" x2="15" y2="15"/><line x1="15" y1="9" x2="9" y2="15"/></svg>;