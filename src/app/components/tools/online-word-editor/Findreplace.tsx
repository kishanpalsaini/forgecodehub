"use client";

import { useState, useRef, useEffect } from "react";
import { Editor } from "@tiptap/react";
import styles from "./Findreplace.module.css";

interface FindReplaceProps {
  editor: Editor;
  onClose: () => void;
}

export default function FindReplace({ editor, onClose }: FindReplaceProps) {
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [matchCase, setMatchCase] = useState(false);
  const [matchCount, setMatchCount] = useState(0);
  const [currentMatch, setCurrentMatch] = useState(0);
  const [showReplace, setShowReplace] = useState(false);
  const findRef = useRef<HTMLInputElement>(null);

  useEffect(() => { findRef.current?.focus(); }, []);

  const getMatches = (text: string) => {
    if (!text || !editor) return [];
    const content = editor.state.doc.textContent;
    const flags = matchCase ? "g" : "gi";
    const regex = new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags);
    const matches: number[] = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      matches.push(match.index);
    }
    return matches;
  };

  useEffect(() => {
    const matches = getMatches(findText);
    setMatchCount(matches.length);
    setCurrentMatch(matches.length > 0 ? 1 : 0);
  }, [findText, matchCase, editor]);

  const handleFind = (direction: "next" | "prev" = "next") => {
    if (!findText || !editor) return;
    const { tr, doc } = editor.state;
    const content = doc.textContent;
    const flags = matchCase ? "g" : "gi";
    const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags);
    const matches: Array<{ index: number; length: number }> = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
      matches.push({ index: match.index, length: match[0].length });
    }
    if (matches.length === 0) return;

    let next = direction === "next" ? currentMatch : currentMatch - 2;
    if (next >= matches.length) next = 0;
    if (next < 0) next = matches.length - 1;
    setCurrentMatch(next + 1);

    // Scroll to match using selection
    const target = matches[next];
    let charCount = 0;
    let from = -1, to = -1;
    doc.descendants((node, pos) => {
      if (from !== -1) return false;
      if (node.isText && node.text) {
        if (charCount + node.text.length > target.index) {
          from = pos + (target.index - charCount);
          to = from + target.length;
          return false;
        }
        charCount += node.text.length;
      }
    });
    if (from !== -1) {
      editor.chain().focus().setTextSelection({ from, to }).run();
    }
  };

  const handleReplace = () => {
    if (!findText || !editor) return;
    const { state } = editor;
    const { from, to } = state.selection;
    const selectedText = state.doc.textBetween(from, to);
    const flags = matchCase ? "" : "i";
    const regex = new RegExp(`^${findText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, flags);
    if (regex.test(selectedText)) {
      editor.chain().focus().insertContent(replaceText).run();
      handleFind("next");
    } else {
      handleFind("next");
    }
  };

  const handleReplaceAll = () => {
    if (!findText || !editor) return;
    const flags = matchCase ? "g" : "gi";
    const html = editor.getHTML();
    const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags);
    const newHtml = html.replace(regex, replaceText);
    editor.commands.setContent(newHtml);
    setMatchCount(0);
    setCurrentMatch(0);
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${!showReplace ? styles.tabActive : ""}`} onClick={() => setShowReplace(false)}>Find</button>
          <button className={`${styles.tab} ${showReplace ? styles.tabActive : ""}`} onClick={() => setShowReplace(true)}>Replace</button>
        </div>
        <button className={styles.closeBtn} onClick={onClose}>✕</button>
      </div>

      <div className={styles.body}>
        <div className={styles.inputRow}>
          <input
            ref={findRef}
            type="text"
            value={findText}
            onChange={(e) => setFindText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleFind(e.shiftKey ? "prev" : "next"); if (e.key === "Escape") onClose(); }}
            placeholder="Find..."
            className={styles.input}
          />
          <span className={styles.count}>{matchCount > 0 ? `${currentMatch}/${matchCount}` : findText ? "0 results" : ""}</span>
          <button className={styles.btn} onClick={() => handleFind("prev")} disabled={matchCount === 0} title="Previous (Shift+Enter)">↑</button>
          <button className={styles.btn} onClick={() => handleFind("next")} disabled={matchCount === 0} title="Next (Enter)">↓</button>
        </div>

        {showReplace && (
          <div className={styles.inputRow}>
            <input
              type="text"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              placeholder="Replace with..."
              className={styles.input}
            />
            <button className={styles.btn} onClick={handleReplace} disabled={matchCount === 0}>Replace</button>
            <button className={styles.btn} onClick={handleReplaceAll} disabled={matchCount === 0}>All</button>
          </div>
        )}

        <div className={styles.options}>
          <label className={styles.option}>
            <input type="checkbox" checked={matchCase} onChange={(e) => setMatchCase(e.target.checked)} />
            Match case
          </label>
        </div>
      </div>
    </div>
  );
}