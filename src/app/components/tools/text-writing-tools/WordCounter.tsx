'use client';

import { useState, ChangeEvent } from 'react';
import styles from './Tool.module.css';

export default function WordCounter() {
  const [text, setText] = useState<string>('');

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const charNoSpace = text.replace(/\s/g, '').length;
  const sentences = text.split(/[.!?]+/).filter(Boolean).length;
  const paragraphs = text.split(/\n+/).filter(Boolean).length;
  const readingTime = Math.ceil(wordCount / 200);

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <div>
      <h2 className={styles.toolTitle}>📝 Word Counter</h2>
      <p className={styles.toolDescription}>
        Count words, characters, sentences, and more. Perfect for essays, articles, and social media posts.
      </p>
      
      <textarea
        className={styles.textarea}
        placeholder="Start typing or paste your text here..."
        value={text}
        onChange={handleTextChange}
        rows={12}
      />

      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.blue}`}>
          <div className={styles.statValue}>{wordCount}</div>
          <div className={styles.statLabel}>Words</div>
        </div>
        <div className={`${styles.statCard} ${styles.green}`}>
          <div className={styles.statValue}>{charCount}</div>
          <div className={styles.statLabel}>Characters</div>
        </div>
        <div className={`${styles.statCard} ${styles.purple}`}>
          <div className={styles.statValue}>{charNoSpace}</div>
          <div className={styles.statLabel}>No Spaces</div>
        </div>
        <div className={`${styles.statCard} ${styles.yellow}`}>
          <div className={styles.statValue}>{sentences}</div>
          <div className={styles.statLabel}>Sentences</div>
        </div>
        <div className={`${styles.statCard} ${styles.pink}`}>
          <div className={styles.statValue}>{paragraphs}</div>
          <div className={styles.statLabel}>Paragraphs</div>
        </div>
        <div className={`${styles.statCard} ${styles.orange}`}>
          <div className={styles.statValue}>{readingTime}</div>
          <div className={styles.statLabel}>Min Read</div>
        </div>
      </div>
    </div>
  );
}