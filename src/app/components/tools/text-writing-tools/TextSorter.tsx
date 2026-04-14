'use client';

import { useState, ChangeEvent } from 'react';
import styles from './Tool.module.css';

type SortOrder = 'asc' | 'desc';

export default function TextSorter() {
  const [text, setText] = useState<string>('');
  const [output, setOutput] = useState<string>('');

  const sort = (order: SortOrder): void => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    if (order === 'asc') {
      setOutput(lines.sort().join('\n'));
    } else {
      setOutput(lines.sort().reverse().join('\n'));
    }
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
      <h2 className={styles.toolTitle}>🔤 Text Sorter (A→Z)</h2>
      <p className={styles.toolDescription}>
        Sort your lines alphabetically in ascending or descending order.
      </p>
      
      <textarea
        className={styles.textarea}
        placeholder="Enter each line to sort (one per line)..."
        value={text}
        onChange={handleTextChange}
        rows={10}
      />

      <div className={styles.buttonGrid}>
        <button 
          onClick={() => sort('asc')}
          className={`${styles.btn} ${styles.btnBlue}`}
          type="button"
        >
          Sort A → Z
        </button>
        <button 
          onClick={() => sort('desc')}
          className={`${styles.btn} ${styles.btnPurple}`}
          type="button"
        >
          Sort Z → A
        </button>
      </div>

      {output && (
        <div className={styles.outputContainer}>
          <div className={styles.outputHeader}>
            <h3 className={styles.outputTitle}>Sorted Result:</h3>
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
      )}
    </div>
  );
}