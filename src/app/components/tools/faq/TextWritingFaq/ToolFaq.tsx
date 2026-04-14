"use client";
import { useState, useMemo } from "react";

type FAQItem = {
  question: string;
  answer: string;
  categories?: string[]; // Add this optional property
};

export default function ToolFaq({
  faqs,
  title = "Frequently Asked Questions",
  subtitle,
}: {
  faqs: FAQItem[];
  title?: string;
  subtitle?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  const VISIBLE_COUNT = 5;

  const filtered = useMemo(() => {
    if (!search.trim()) return faqs;
    const q = search.toLowerCase();
    return faqs.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q)
    );
  }, [faqs, search]);

  const displayed = showAll ? filtered : filtered.slice(0, VISIBLE_COUNT);

  return (
    <section className="faq-section">
      {/* Mobile background FAQ text (visible only < 768px) */}
      <div className="faq-bg-text" aria-hidden="true">FAQ</div>

      <div className="faq-inner">
        {/* Left column */}
        <div className="faq-left">
          <h2 className="faq-title">{title}</h2>
          {subtitle && <p className="faq-subtitle">{subtitle}</p>}

          {/* Search */}
          <div className="faq-search-wrap">
            <input
              type="text"
              className="faq-search"
              placeholder="Search question here"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setOpenIndex(0);
                setShowAll(false);
              }}
            />
            <span className="faq-search-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
          </div>

          {/* Accordion */}
          <div className="faq-list">
            {displayed.length === 0 && (
              <p className="faq-empty">No results found for &ldquo;{search}&rdquo;</p>
            )}
            {displayed.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={index} className={`faq-item${isOpen ? " open" : ""}`}>
                  <button
                    type="button"
                    className="faq-btn"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                  >
                    <span className="faq-question">{faq.question}</span>
                    <span className="faq-icon">{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && (
                    <div className="faq-answer">{faq.answer}</div>
                  )}
                </div>
              );
            })}
          </div>

          {filtered.length > VISIBLE_COUNT && (
            <button
              type="button"
              className="faq-more-btn"
              onClick={() => setShowAll((v) => !v)}
            >
              {showAll ? "Show less ↑" : "Show more ↓"}
            </button>
          )}
        </div>

        {/* Right column — illustration (desktop only) */}
        <div className="faq-right" aria-hidden="true">
          <svg viewBox="0 0 420 380" fill="none" xmlns="http://www.w3.org/2000/svg" className="faq-illustration">
            <text x="10" y="310" fontSize="210" fontWeight="900" fill="#e8e4dd" fontFamily="Arial Black, Arial, sans-serif" letterSpacing="-8">FAQ</text>
            {/* legs */}
            <rect x="200" y="290" width="18" height="60" rx="9" fill="#2d2f6b"/>
            <rect x="224" y="295" width="18" height="55" rx="9" fill="#2d2f6b"/>
            {/* shoes */}
            <ellipse cx="209" cy="352" rx="14" ry="7" fill="#1a1a3e"/>
            <ellipse cx="233" cy="350" rx="13" ry="7" fill="#1a1a3e"/>
            {/* torso */}
            <rect x="192" y="210" width="56" height="90" rx="22" fill="#f97316"/>
            {/* arms */}
            <path d="M192 240 Q160 260 148 280" stroke="#f97316" strokeWidth="18" strokeLinecap="round"/>
            <path d="M248 235 Q260 220 255 205" stroke="#f97316" strokeWidth="16" strokeLinecap="round"/>
            <ellipse cx="254" cy="200" rx="10" ry="10" fill="#f7c5a0"/>
            {/* neck */}
            <rect x="210" y="198" width="20" height="20" rx="6" fill="#f7c5a0"/>
            {/* head */}
            <ellipse cx="220" cy="183" rx="28" ry="28" fill="#f7c5a0"/>
            {/* hair */}
            <path d="M196 175 Q200 140 220 138 Q248 136 245 165 Q258 155 252 178" fill="#2d2f6b"/>
            <path d="M245 175 Q265 190 260 220 Q250 240 242 230" fill="#2d2f6b"/>
            {/* eyes */}
            <ellipse cx="211" cy="185" rx="3.5" ry="4" fill="#2d2f6b"/>
            <ellipse cx="228" cy="185" rx="3.5" ry="4" fill="#2d2f6b"/>
            {/* mouth */}
            <path d="M214 195 Q220 200 226 195" stroke="#c77a5a" strokeWidth="2" fill="none" strokeLinecap="round"/>
            {/* red question mark */}
            <text x="248" y="135" fontSize="56" fontWeight="900" fill="#e8341c" fontFamily="Arial Black, Arial, sans-serif">?</text>
            {/* small grey question marks */}
            <text x="300" y="100" fontSize="22" fill="#c5c0b8" fontFamily="Arial, sans-serif">?</text>
            <text x="320" y="130" fontSize="16" fill="#d4cfc8" fontFamily="Arial, sans-serif">?</text>
            <text x="275" y="85" fontSize="14" fill="#ccc8c0" fontFamily="Arial, sans-serif">?</text>
            {/* leaves */}
            <ellipse cx="155" cy="185" rx="14" ry="8" fill="#c5d8b0" transform="rotate(-40 155 185)"/>
            <ellipse cx="330" cy="200" rx="12" ry="7" fill="#c5d8b0" transform="rotate(30 330 200)"/>
            {/* clouds */}
            <ellipse cx="60" cy="370" rx="45" ry="28" fill="#e8e4dd"/>
            <ellipse cx="105" cy="368" rx="35" ry="22" fill="#e8e4dd"/>
            <ellipse cx="370" cy="368" rx="38" ry="24" fill="#e8e4dd"/>
            <ellipse cx="340" cy="372" rx="28" ry="18" fill="#e8e4dd"/>
          </svg>
        </div>
      </div>

      <style>{`
        .faq-section {
          position: relative;
          margin: auto;
          width: 100%;
          max-width: 1600px;
          margin-top: 4rem;
          background: #fff;
          border-radius: 24px;
          box-shadow: 0 8px 40px rgba(0,0,0,0.10);
          border: 1px solid #e5e7eb;
          overflow: hidden;
        }

        /* Mobile background FAQ text */
        .faq-bg-text {
          display: none;
          position: absolute;
          inset: 0;
          align-items: center;
          justify-content: center;
          font-size: clamp(100px, 40vw, 200px);
          font-weight: 900;
          font-family: Arial Black, Arial, sans-serif;
          color: #e8e4dd;
          letter-spacing: -4px;
          pointer-events: none;
          user-select: none;
          z-index: 0;
        }

        .faq-inner {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          padding: 48px 40px;
          align-items: start;
        }

        .faq-left {
          display: flex;
          flex-direction: column;
        }

        .faq-title {
          font-size: clamp(28px, 4vw, 36px);
          font-weight: 700;
          color: #2d2f6b;
          line-height: 1.15;
          margin-bottom: 8px;
        }

        .faq-subtitle {
          font-size: 15px;
          color: #6b7280;
          margin-bottom: 20px;
        }

        .faq-search-wrap {
          position: relative;
          margin-bottom: 24px;
        }

        .faq-search {
          width: 100%;
          border: 1.5px solid #e5e7eb;
          border-radius: 30px;
          padding: 11px 44px 11px 20px;
          font-size: 15px;
          color: #374151;
          background: #f7f6f3;
          outline: none;
          font-family: inherit;
          transition: border-color 0.2s;
        }

        .faq-search:focus {
          border-color: #f97316;
          background: #fff;
        }

        .faq-search-icon {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #9ca3af;
          display: flex;
          align-items: center;
        }

        .faq-list {
          display: flex;
          flex-direction: column;
        }

        .faq-empty {
          font-size: 14px;
          color: #9ca3af;
          padding: 16px 0;
        }

        .faq-item {
          border-bottom: 1px solid #e5e7eb;
        }

        .faq-item:first-child {
          border-top: 1px solid #e5e7eb;
        }

        .faq-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 0;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          font-family: inherit;
          gap: 12px;
        }

        .faq-question {
          font-size: 15px;
          font-weight: 600;
          color: #2d2f6b;
          line-height: 1.4;
        }

        .faq-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 1.5px solid #d1d5db;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 400;
          color: #6b7280;
          flex-shrink: 0;
          line-height: 1;
          transition: background 0.2s, border-color 0.2s, color 0.2s;
        }

        .faq-item.open .faq-icon {
          background: #f97316;
          border-color: #f97316;
          color: #fff;
        }

        .faq-answer {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.7;
          padding: 0 0 16px 0;
        }

        .faq-more-btn {
          margin-top: 12px;
          background: none;
          border: 1.5px solid #e5e7eb;
          border-radius: 30px;
          padding: 8px 20px;
          font-size: 14px;
          color: #6b7280;
          cursor: pointer;
          font-family: inherit;
          align-self: flex-start;
          transition: border-color 0.2s, color 0.2s;
        }

        .faq-more-btn:hover {
          border-color: #f97316;
          color: #f97316;
        }

        .faq-right {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .faq-illustration {
          width: 100%;
          max-width: 420px;
        }

        /* ── Between 768px and 1599px: illustration becomes background ── */
        @media (min-width: 768px) and (max-width: 1599px) {
          .faq-inner {
            grid-template-columns: 1fr;
          }

          .faq-right {
            position: absolute;
            inset: 0;
            z-index: 0;
            opacity: 0.18;
            pointer-events: none;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right: 24px;
          }

          .faq-illustration {
            max-width: 420px;
            width: 45%;
          }

          .faq-left {
            position: relative;
            z-index: 1;
          }
        }

        /* ── Responsive: < 768px ── */
        @media (max-width: 767px) {
          .faq-bg-text {
            display: flex;
          }

          .faq-inner {
            grid-template-columns: 1fr;
            padding: 32px 20px 40px;
            gap: 0;
          }

          .faq-right {
            display: none;
          }

          .faq-title {
            font-size: 28px;
          }
        }
      `}</style>
    </section>
  );
}