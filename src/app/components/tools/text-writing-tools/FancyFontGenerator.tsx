'use client';

import { useState, ChangeEvent } from 'react';
import styles from './Tool.module.css';
import { FontConverter } from './types';

export default function FancyFontGenerator() {
  const [text, setText] = useState<string>('');

  const fonts: Record<string, FontConverter> = {
    bold: { 
      name: '𝗕𝗼𝗹𝗱', 
      convert: (char: string): string => {
        const offset = char >= 'A' && char <= 'Z' ? 0x1D5D4 - 65 : char >= 'a' && char <= 'z' ? 0x1D5EE - 97 : 0;
        return offset ? String.fromCodePoint(char.charCodeAt(0) + offset) : char;
      }
    },
    italic: { 
      name: '𝘐𝘵𝘢𝘭𝘪𝘤', 
      convert: (char: string): string => {
        const offset = char >= 'A' && char <= 'Z' ? 0x1D608 - 65 : char >= 'a' && char <= 'z' ? 0x1D622 - 97 : 0;
        return offset ? String.fromCodePoint(char.charCodeAt(0) + offset) : char;
      }
    },
    script: { 
      name: '𝓢𝓬𝓻𝓲𝓹𝓽', 
      convert: (char: string): string => {
        const offset = char >= 'A' && char <= 'Z' ? 0x1D49C - 65 : char >= 'a' && char <= 'z' ? 0x1D4B6 - 97 : 0;
        return offset ? String.fromCodePoint(char.charCodeAt(0) + offset) : char;
      }
    },
    double: { 
      name: '𝔻𝕠𝕦𝕓𝕝𝕖', 
      convert: (char: string): string => {
        const offset = char >= 'A' && char <= 'Z' ? 0x1D538 - 65 : char >= 'a' && char <= 'z' ? 0x1D552 - 97 : 0;
        return offset ? String.fromCodePoint(char.charCodeAt(0) + offset) : char;
      }
    },
    bubble: { 
      name: 'Ⓑⓤⓑⓑⓛⓔ', 
      convert: (char: string): string => {
        const offset = char >= 'A' && char <= 'Z' ? 0x24B6 - 65 : char >= 'a' && char <= 'z' ? 0x24D0 - 97 : 0;
        return offset ? String.fromCodePoint(char.charCodeAt(0) + offset) : char;
      }
    },
    square: { 
      name: '🅂🅀🅄🄰🅁🄴', 
      convert: (char: string): string => {
        const offset = char >= 'A' && char <= 'Z' ? 0x1F130 - 65 : 0;
        return offset ? String.fromCodePoint(char.charCodeAt(0) + offset) : char.toLowerCase();
      }
    },
    upside: { 
      name: 'uʍop ǝpᴉsd∩', 
      convert: (char: string): string => {
        const map: Record<string, string> = {
          a:'ɐ',b:'q',c:'ɔ',d:'p',e:'ǝ',f:'ɟ',g:'ƃ',h:'ɥ',i:'ᴉ',j:'ɾ',k:'ʞ',l:'l',m:'ɯ',
          n:'u',o:'o',p:'d',q:'b',r:'ɹ',s:'s',t:'ʇ',u:'n',v:'ʌ',w:'ʍ',x:'x',y:'ʎ',z:'z'
        };
        return map[char.toLowerCase()] || char;
      }
    },
    wide: { 
      name: 'Ｗｉｄｅ　Ｔｅｘｔ', 
      convert: (char: string): string => {
        return char === ' ' ? '　' : char.charCodeAt(0) >= 33 && char.charCodeAt(0) <= 126 
          ? String.fromCodePoint(char.charCodeAt(0) + 0xFEE0) 
          : char;
      }
    }
  };

  const convertText = (converter: (char: string) => string): string => {
    return text.split('').map(char => converter(char)).join('');
  };

  const copyToClipboard = async (content: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(content);
      alert('✅ Copied to clipboard! 🎉');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setText(e.target.value);
  };

  return (
    <div>
      <h2 className={styles.toolTitle}>🔥 Fancy Font Generator</h2>
      <p className={styles.toolDescription}>
        Generate stylish Unicode fonts for social media. Works on Instagram, Twitter, Facebook, and more!
      </p>
      
      <textarea
        className={styles.textarea}
        placeholder="Type your text here..."
        value={text}
        onChange={handleTextChange}
        rows={6}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
        {Object.entries(fonts).map(([key, font]) => {
          const converted = convertText(font.convert);
          return (
            <div key={key} className={styles.fancyResult}>
              <div className={styles.fancyHeader}>
                <span className={styles.fancyLabel}>{font.name}</span>
                <button 
                  onClick={() => copyToClipboard(converted)}
                  className={styles.copyBtn}
                  type="button"
                >
                  📋 Copy
                </button>
              </div>
              <div className={styles.fancyText}>
                {converted || 'Preview...'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}