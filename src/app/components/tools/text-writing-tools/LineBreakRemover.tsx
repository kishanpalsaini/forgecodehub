'use client';

import { useState, ChangeEvent } from 'react';
import styles from './Tool.module.css';

export default function LineBreakRemover() {
  const [text, setText] = useState<string>('');
  const [output, setOutput] = useState<string>('');

  const removeLineBreaks = (): void => {
    const result = text.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
    setOutput(result);
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
      <h2 className={styles.toolTitle}>📄 Line Break Remover</h2>
      <p className={styles.toolDescription}>
        Remove all line breaks and convert your multi-line text into a single line.
      </p>
      
      <textarea
        className={styles.textarea}
        placeholder="Paste your text with line breaks..."
        value={text}
        onChange={handleTextChange}
        rows={10}
      />

      <button 
        onClick={removeLineBreaks}
        className={`${styles.btn} ${styles.btnBlue}`}
        style={{ marginBottom: '1.5rem', width: '100%', maxWidth: '300px' }}
        type="button"
      >
        Remove Line Breaks
      </button>

      {output && (
        <div className={styles.outputContainer}>
          <div className={styles.outputHeader}>
            <h3 className={styles.outputTitle}>Result:</h3>
            <button onClick={copyToClipboard} className={styles.copyBtn} type="button">
              📋 Copy
            </button>
          </div>
          <div className={styles.resultBox}>
            {output}
          </div>
        </div>
      )}
    </div>
  );
}