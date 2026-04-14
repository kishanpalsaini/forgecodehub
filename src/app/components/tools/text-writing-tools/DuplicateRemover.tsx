'use client';

import { useState, ChangeEvent } from 'react';
import styles from './Tool.module.css';

export default function DuplicateRemover() {
  const [text, setText] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [removedCount, setRemovedCount] = useState<number>(0);

  const removeDuplicates = (): void => {
    const lines = text.split('\n');
    const originalCount = lines.length;
    const uniqueLines = [...new Set(lines)];
    const removed = originalCount - uniqueLines.length;
    
    setOutput(uniqueLines.join('\n'));
    setRemovedCount(removed);
  };

  const copyToClipboard = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(output);
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
      <h2 className={styles.toolTitle}>🗑️ Duplicate Line Remover</h2>
      <p className={styles.toolDescription}>
        Remove duplicate lines from your text and keep only unique entries.
      </p>
      
      <textarea
        className={styles.textarea}
        placeholder="Enter your text (one line per entry)..."
        value={text}
        onChange={handleTextChange}
        rows={10}
      />

      <button 
        onClick={removeDuplicates}
        className={`${styles.btn} ${styles.btnPink}`}
        style={{ marginBottom: '1.5rem', width: '100%', maxWidth: '300px' }}
        type="button"
      >
        Remove Duplicates
      </button>

      {output && (
        <>
          <div className={styles.alert}>
            <p className={styles.alertText}>
              <span className={styles.alertValue}>{removedCount}</span> duplicate line(s) removed!
            </p>
          </div>

          <div className={styles.outputContainer}>
            <div className={styles.outputHeader}>
              <h3 className={styles.outputTitle}>Unique Lines:</h3>
              <button onClick={copyToClipboard} className={styles.copyBtn} type="button">
                📋 Copy
              </button>
            </div>
            <textarea
              className={styles.outputArea}
              value={output}
              readOnly
              rows={10}
            />
          </div>
        </>
      )}
    </div>
  );
}
