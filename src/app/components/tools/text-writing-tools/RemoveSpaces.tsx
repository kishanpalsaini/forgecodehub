'use client';

import { useState, ChangeEvent } from 'react';
import styles from './Tool.module.css';

export default function RemoveSpaces() {
  const [text, setText] = useState<string>('');

  const removeExtraSpaces = (): string => {
    return text.replace(/\s+/g, ' ').trim();
  };

  const removeAllSpaces = (): string => {
    return text.replace(/\s/g, '');
  };

  const copyToClipboard = async (content: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(content);
      alert('✅ Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setText(e.target.value);
  };

  return (
    <div>
      <h2 className={styles.toolTitle}>🧹 Remove Extra Spaces</h2>
      <p className={styles.toolDescription}>
        Clean up your text by removing extra spaces or all spaces entirely.
      </p>
      
      <textarea
        className={styles.textarea}
        placeholder="Paste your text with extra spaces..."
        value={text}
        onChange={handleTextChange}
        rows={10}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div className={styles.fancyResult}>
          <div className={styles.fancyHeader}>
            <h3 className={styles.fancyLabel}>Remove Extra Spaces</h3>
            <button 
              onClick={() => copyToClipboard(removeExtraSpaces())}
              className={styles.copyBtn}
              type="button"
            >
              📋 Copy
            </button>
          </div>
          <div className={styles.resultBox}>
            {removeExtraSpaces() || 'Result will appear here...'}
          </div>
        </div>

        <div className={styles.fancyResult}>
          <div className={styles.fancyHeader}>
            <h3 className={styles.fancyLabel}>Remove All Spaces</h3>
            <button 
              onClick={() => copyToClipboard(removeAllSpaces())}
              className={styles.copyBtn}
              type="button"
            >
              📋 Copy
            </button>
          </div>
          <div className={styles.resultBox} style={{ wordBreak: 'break-all' }}>
            {removeAllSpaces() || 'Result will appear here...'}
          </div>
        </div>
      </div>
    </div>
  );
}