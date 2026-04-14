'use client';

import { useState, ChangeEvent } from 'react';
import styles from './Tool.module.css';

type CaseType = 'upper' | 'lower' | 'title' | 'sentence' | 'alternate';

export default function CaseConverter() {
  const [text, setText] = useState<string>('');
  const [output, setOutput] = useState<string>('');

  const convert = (type: CaseType): void => {
    switch(type) {
      case 'upper':
        setOutput(text.toUpperCase());
        break;
      case 'lower':
        setOutput(text.toLowerCase());
        break;
      case 'title':
        setOutput(text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()));
        break;
      case 'sentence':
        setOutput(text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase()));
        break;
      case 'alternate':
        setOutput(text.split('').map((char, i) => i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()).join(''));
        break;
      default:
        setOutput(text);
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
      <h2 className={styles.toolTitle}>🔄 Case Converter</h2>
      <p className={styles.toolDescription}>
        Transform text between different cases: UPPER, lower, Title, Sentence, and aLtErNaTe.
      </p>
      
      <textarea
        className={styles.textarea}
        placeholder="Enter your text..."
        value={text}
        onChange={handleTextChange}
        rows={8}
      />

      <div className={styles.buttonGrid}>
        <button onClick={() => convert('upper')} className={`${styles.btn} ${styles.btnBlue}`} type="button">
          UPPERCASE
        </button>
        <button onClick={() => convert('lower')} className={`${styles.btn} ${styles.btnGreen}`} type="button">
          lowercase
        </button>
        <button onClick={() => convert('title')} className={`${styles.btn} ${styles.btnPurple}`} type="button">
          Title Case
        </button>
        <button onClick={() => convert('sentence')} className={`${styles.btn} ${styles.btnYellow}`} type="button">
          Sentence case
        </button>
        <button onClick={() => convert('alternate')} className={`${styles.btn} ${styles.btnPink}`} type="button">
          aLtErNaTe CaSe
        </button>
      </div>

      {output && (
        <div className={styles.outputContainer}>
          <div className={styles.outputHeader}>
            <h3 className={styles.outputTitle}>Result:</h3>
            <button onClick={copyToClipboard} className={styles.copyBtn} type="button">
              📋 Copy
            </button>
          </div>
          <textarea
            className={styles.outputArea}
            value={output}
            readOnly
            rows={8}
          />
        </div>
      )}
    </div>
  );
}