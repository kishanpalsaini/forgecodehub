'use client';

import { useState, ChangeEvent } from 'react';
import styles from './Tool.module.css';
import { EmojiMap } from './types';

export default function TextToEmoji() {
  const [text, setText] = useState<string>('');

  const emojiMap: EmojiMap = {
    'a': '🅰️', 'b': '🅱️', 'c': '©️', 'd': '↩️', 'e': '📧', 'f': '🎏', 'g': '🔱',
    'h': '♓', 'i': 'ℹ️', 'j': '⤴️', 'k': '🎋', 'l': '🛴', 'm': 'Ⓜ️', 'n': '📰',
    'o': '⭕', 'p': '🅿️', 'q': '🔍', 'r': '®️', 's': '💲', 't': '✝️', 'u': '⛎',
    'v': '✅', 'w': '〰️', 'x': '❌', 'y': '💴', 'z': '💤',
    '0': '0️⃣', '1': '1️⃣', '2': '2️⃣', '3': '3️⃣', '4': '4️⃣',
    '5': '5️⃣', '6': '6️⃣', '7': '7️⃣', '8': '8️⃣', '9': '9️⃣',
    '!': '❗', '?': '❓', ' ': '　'
  };

  const convertToEmoji = (): string => {
    return text.toLowerCase().split('').map(char => emojiMap[char] || char).join('');
  };

  const convertToRegionalIndicator = (): string => {
    return text.toLowerCase().split('').map(char => {
      if (char >= 'a' && char <= 'z') {
        return String.fromCodePoint(0x1F1E6 + char.charCodeAt(0) - 97);
      }
      return char === ' ' ? '　' : char;
    }).join('');
  };

  const copyToClipboard = async (content: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(content);
      alert('✅ Copied to clipboard! 😊');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setText(e.target.value);
  };

  const emoji1 = convertToEmoji();
  const emoji2 = convertToRegionalIndicator();

  return (
    <div>
      <h2 className={styles.toolTitle}>😊 Text to Emoji Converter</h2>
      <p className={styles.toolDescription}>
        Convert your text into fun emoji representations. Perfect for social media posts!
      </p>
      
      <textarea
        className={styles.textarea}
        placeholder="Type your text..."
        value={text}
        onChange={handleTextChange}
        rows={6}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
        <div className={styles.fancyResult}>
          <div className={styles.fancyHeader}>
            <h3 className={styles.fancyLabel}>Emoji Style 1</h3>
            <button 
              onClick={() => copyToClipboard(emoji1)}
              className={styles.copyBtn}
              type="button"
            >
              📋 Copy
            </button>
          </div>
          <div className={styles.fancyText}>
            {emoji1 || 'Preview...'}
          </div>
        </div>

        <div className={styles.fancyResult}>
          <div className={styles.fancyHeader}>
            <h3 className={styles.fancyLabel}>Emoji Style 2 (Regional)</h3>
            <button 
              onClick={() => copyToClipboard(emoji2)}
              className={styles.copyBtn}
              type="button"
            >
              📋 Copy
            </button>
          </div>
          <div className={styles.fancyText}>
            {emoji2 || 'Preview...'}
          </div>
        </div>
      </div>
    </div>
  );
}