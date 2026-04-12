"use client";

import { Editor } from "@tiptap/react";
import styles from "./StatusBar.module.css";

interface StatusBarProps {
  editor: Editor;
}

export default function StatusBar({ editor }: StatusBarProps) {
  // Safely access character count extension data
  const characterCount = editor.storage.characterCount || { characters: () => 0, words: () => 0 };
  
  // Get character and word counts (these are functions that need to be called)
  const characters = typeof characterCount.characters === 'function' 
    ? characterCount.characters() 
    : characterCount.characters || 0;
    
  const words = typeof characterCount.words === 'function' 
    ? characterCount.words() 
    : characterCount.words || 0;
  
  // Count paragraphs
  const textContent = editor.state.doc.textContent || "";
  const paragraphs = textContent.split("\n\n").filter(Boolean).length;
  
  // Estimate reading time (average 200 words per minute)
  const readingTime = words > 0 ? Math.ceil(words / 200) : 0;

  return (
    <div className={styles.statusBar}>
      <div className={styles.stat}>
        <span className={styles.label}>Words:</span>
        <span className={styles.value}>{words}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>Characters:</span>
        <span className={styles.value}>{characters}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>Paragraphs:</span>
        <span className={styles.value}>{paragraphs}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.label}>Reading Time:</span>
        <span className={styles.value}>{readingTime} min</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.autoSave}>✓ Auto-saved</span>
      </div>
    </div>
  );
}