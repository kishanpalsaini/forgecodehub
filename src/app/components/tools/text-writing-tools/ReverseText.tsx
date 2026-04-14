'use client';

import { useState, ChangeEvent } from 'react';
import styles from './Tool.module.css';

export default function ReverseText() {
  const [text, setText] = useState<string>('');

  const reverseText = (): string => {
    return text.split('').reverse().join('');
  };

  const reverseWords = (): string => {
    return text.split(' ').reverse().join(' ');
  };

  const reverseLines = (): string => {
    return text.split('\n').reverse().join('\n');
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

  const reversed = reverseText();
  const wordsReversed = reverseWords();
  const linesReversed = reverseLines();

  return (
    <div>
      <h2 className={styles.toolTitle}>🔄 Reverse Text Generator</h2>
      <p className={styles.toolDescription}>
        Reverse your text in multiple ways: characters, words, or lines.
      </p>
      
      <textarea
        className={styles.textarea}
        placeholder="Type your text here..."
        value={text}
        onChange={handleTextChange}
        rows={8}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
        <div className={styles.fancyResult}>
          <div className={styles.fancyHeader}>
            <h3 className={styles.fancyLabel}>Reverse Characters</h3>
            <button 
              onClick={() => copyToClipboard(reversed)}
              className={styles.copyBtn}
              type="button"
            >
              📋 Copy
            </button>
          </div>
          <div className={styles.resultBox} style={{ wordBreak: 'break-all' }}>
            {reversed || 'Result will appear here...'}
          </div>
        </div>

        <div className={styles.fancyResult}>
          <div className={styles.fancyHeader}>
            <h3 className={styles.fancyLabel}>Reverse Words</h3>
            <button 
              onClick={() => copyToClipboard(wordsReversed)}
              className={styles.copyBtn}
              type="button"
            >
              📋 Copy
            </button>
          </div>
          <div className={styles.resultBox}>
            {wordsReversed || 'Result will appear here...'}
          </div>
        </div>

        <div className={styles.fancyResult}>
          <div className={styles.fancyHeader}>
            <h3 className={styles.fancyLabel}>Reverse Lines</h3>
            <button 
              onClick={() => copyToClipboard(linesReversed)}
              className={styles.copyBtn}
              type="button"
            >
              📋 Copy
            </button>
          </div>
          <div className={styles.resultBox} style={{ whiteSpace: 'pre-wrap' }}>
            {linesReversed || 'Result will appear here...'}
          </div>
        </div>
      </div>
    </div>
  );
}