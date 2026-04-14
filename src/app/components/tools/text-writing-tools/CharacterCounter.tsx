'use client';

import { useState, ChangeEvent } from 'react';
import styles from './Tool.module.css';

export default function CharacterCounter() {
  const [text, setText] = useState<string>('');

  const totalChars = text.length;
  const letters = (text.match(/[a-zA-Z]/g) || []).length;
  const numbers = (text.match(/[0-9]/g) || []).length;
  const spaces = (text.match(/\s/g) || []).length;
  const special = totalChars - letters - numbers - spaces;
  const uppercase = (text.match(/[A-Z]/g) || []).length;
  const lowercase = (text.match(/[a-z]/g) || []).length;

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <div>
      <h2 className={styles.toolTitle}>🔤 Character Counter</h2>
      <p className={styles.toolDescription}>
        Detailed character analysis including letters, numbers, spaces, and special characters.
      </p>
      
      <textarea
        className={styles.textarea}
        placeholder="Type your text here..."
        value={text}
        onChange={handleTextChange}
        rows={12}
      />

      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.indigo}`}>
          <div className={styles.statValue}>{totalChars}</div>
          <div className={styles.statLabel}>Total</div>
        </div>
        <div className={`${styles.statCard} ${styles.blue}`}>
          <div className={styles.statValue}>{letters}</div>
          <div className={styles.statLabel}>Letters</div>
        </div>
        <div className={`${styles.statCard} ${styles.green}`}>
          <div className={styles.statValue}>{numbers}</div>
          <div className={styles.statLabel}>Numbers</div>
        </div>
        <div className={`${styles.statCard} ${styles.yellow}`}>
          <div className={styles.statValue}>{spaces}</div>
          <div className={styles.statLabel}>Spaces</div>
        </div>
        <div className={`${styles.statCard} ${styles.purple}`}>
          <div className={styles.statValue}>{special}</div>
          <div className={styles.statLabel}>Special</div>
        </div>
        <div className={`${styles.statCard} ${styles.pink}`}>
          <div className={styles.statValue}>{uppercase}</div>
          <div className={styles.statLabel}>Uppercase</div>
        </div>
      </div>
    </div>
  );
}