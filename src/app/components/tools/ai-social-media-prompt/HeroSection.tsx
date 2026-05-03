"use client";

// app/components/tools/social-media-prompt-generator/HeroSection.tsx

import React, { useEffect, useState } from "react";

const STYLES = `
/* ===== Hero wrapper ===================================================== */
.hero-root {
  width: 100%;
  min-height: auto;
  background: linear-gradient(135deg, #0f0f1a 0%, #16121f 45%, #111827 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 3.5rem 1.5rem 3rem;
}

/* Subtle radial glow behind headline */
.hero-root::before {
  content: "";
  position: absolute;
  top: -10%;
  left: -5%;
  width: 60%;
  height: 70%;
  background: radial-gradient(ellipse at center, rgba(232,105,42,0.07) 0%, transparent 65%);
  pointer-events: none;
}

/* Grid noise texture overlay */
.hero-root::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
}

/* ===== Two-column layout ================================================ */
.hero-inner {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
gap: 0;
max-width: 720px;
  align-items: center;
  position: relative;
  z-index: 1;
}

@media (max-width: 860px) {
  .hero-inner {
    grid-template-columns: 1fr;
    gap: 3rem;
    text-align: center;
  }
  .hero-root {
    min-height: auto;
    padding: 5rem 1.25rem 3rem;
  }
}

/* ===== Left: copy ======================================================= */
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(232,105,42,0.12);
  border: 1px solid rgba(232,105,42,0.3);
  border-radius: 100px;
  padding: 0.3rem 1rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #E8692A;
  margin-bottom: 1.5rem;
}

.hero-badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #E8692A;
  animation: hero-pulse 2s infinite;
}

@keyframes hero-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.7); }
}

.hero-h1 {
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  font-weight: 800;
  line-height: 1.12;
  color: #f0f0f8;
  margin: 0 0 1.25rem;
  letter-spacing: -0.02em;
}

.hero-h1 span {
  background: linear-gradient(90deg, #E8692A 0%, #f09952 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.05rem;
  line-height: 1.72;
  color: #9090b0;
  margin: 0 0 2rem;
  max-width: 480px;
}

@media (max-width: 860px) {
  .hero-subtitle { margin-left: auto; margin-right: auto; }
}

/* Platform icon row */
.hero-platforms {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2.25rem;
}

@media (max-width: 860px) {
  .hero-platforms { justify-content: center; }
}

.hero-platform-chip {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 8px;
  padding: 0.35rem 0.75rem;
  font-size: 0.8rem;
  color: #b0b0cc;
  font-weight: 500;
  transition: background 0.15s, border-color 0.15s;
}

.hero-platform-chip:hover {
  background: rgba(232,105,42,0.1);
  border-color: rgba(232,105,42,0.3);
  color: #f0f0f8;
}

/* CTA */
.hero-cta-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

@media (max-width: 860px) {
  .hero-cta-row { justify-content: center; }
}

.hero-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #E8692A;
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  border-radius: 10px;
  padding: 0.85rem 2rem;
  border: none;
  cursor: pointer;
  transition: background 0.15s, transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 4px 24px rgba(232,105,42,0.35);
}

.hero-cta-btn:hover {
  background: #d05a20;
  transform: translateY(-1px);
  box-shadow: 0 6px 28px rgba(232,105,42,0.45);
}

.hero-cta-note {
  font-size: 0.82rem;
  color: #686888;
}

/* Trust badges row */
.hero-trust {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  margin-top: 2rem;
}

@media (max-width: 860px) {
  .hero-trust { justify-content: center; }
}

.hero-trust-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: #686888;
}

.hero-trust-item span:first-child {
  color: #7cd8a2;
  font-size: 0.9rem;
}

/* ===== Right: prompt preview mockup ==================================== */
.hero-mockup {
  position: relative;
}

.hero-mockup-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 1.5rem;
  backdrop-filter: blur(8px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04);
  position: relative;
}

/* Subtle glow behind mockup card */
.hero-mockup-card::before {
  content: "";
  position: absolute;
  inset: -1px;
  border-radius: 17px;
  background: linear-gradient(135deg, rgba(232,105,42,0.15), transparent 60%);
  pointer-events: none;
  z-index: -1;
}

.hero-mockup-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.1rem;
}

.hero-mockup-dots {
  display: flex;
  gap: 5px;
}

.hero-mockup-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.hero-mockup-label {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(232,105,42,0.12);
  border: 1px solid rgba(232,105,42,0.25);
  border-radius: 6px;
  padding: 0.2rem 0.65rem;
  font-size: 0.72rem;
  color: #E8692A;
  font-weight: 600;
}

.hero-mockup-body {
  font-size: 0.78rem;
  color: #8888aa;
  line-height: 1.75;
  font-family: "SF Mono", "Fira Code", "Cascadia Code", monospace;
  white-space: pre-wrap;
  word-break: break-word;
}

.hero-mockup-body .hl-key { color: #9d89c4; }
.hero-mockup-body .hl-val { color: #c8c8dc; }
.hero-mockup-body .hl-acc { color: #E8692A; }
.hero-mockup-body .hl-grn { color: #7cd8a2; }

.hero-mockup-copy-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(232,105,42,0.12);
  border: 1px solid rgba(232,105,42,0.25);
  border-radius: 7px;
  padding: 0.45rem 1rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: #E8692A;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.15s;
  width: fit-content;
}
.hero-mockup-copy-btn:hover { background: rgba(232,105,42,0.2); }

/* Floating chip decorations */
.hero-float-chip {
  position: absolute;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 0.4rem 0.8rem;
  font-size: 0.75rem;
  color: #9090b0;
  white-space: nowrap;
  animation: hero-float 4s ease-in-out infinite;
  backdrop-filter: blur(4px);
}

.hero-float-chip:nth-child(2) { animation-delay: -1.3s; }
.hero-float-chip:nth-child(3) { animation-delay: -2.7s; }

@keyframes hero-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
}

.hero-chip-1 { top: -18px; right: 24px; }
.hero-chip-2 { bottom: -16px; left: 16px; }

@media (max-width: 860px) {
  .hero-mockup { display: none; }
}

/* ===== Bottom "how it works" strip ===================================== */
.hero-how-strip {
  max-width: 1200px;
  margin: 4rem auto 0;
  width: 100%;
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px;
  overflow: hidden;
}

@media (max-width: 600px) {
  .hero-how-strip { grid-template-columns: 1fr; }
}

.hero-how-item {
  background: rgba(255,255,255,0.025);
  padding: 1.4rem 1.5rem;
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.hero-how-num {
  flex-shrink: 0;
  font-size: 1.6rem;
  font-weight: 900;
  color: rgba(232,105,42,0.25);
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.hero-how-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: #e0e0f0;
  margin-bottom: 0.25rem;
}

.hero-how-desc {
  font-size: 0.8rem;
  color: #7070a0;
  line-height: 1.55;
}

/* ===== Scroll indicator ================================================= */
.hero-scroll-indicator {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  color: #444466;
  font-size: 0.72rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  z-index: 1;
  animation: hero-bounce 2s ease-in-out infinite;
}

@keyframes hero-bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(4px); }
}

.hero-scroll-arrow {
  width: 20px;
  height: 20px;
  border-right: 2px solid #444466;
  border-bottom: 2px solid #444466;
  transform: rotate(45deg);
}
`;

const PLATFORMS = [
    { icon: "📸", label: "Instagram" },
    { icon: "💼", label: "LinkedIn" },
    { icon: "👥", label: "Facebook" },
    { icon: "𝕏", label: "X / Twitter" },
    { icon: "▶", label: "YouTube" },
    { icon: "🧵", label: "Threads" },
];

const PROMPT_LINES = [
    { type: "key", text: "Platform: " },
    { type: "val", text: "Instagram · Feed Post\n" },
    { type: "key", text: "Tone: " },
    { type: "val", text: "Casual & relatable\n" },
    { type: "key", text: "Goal: " },
    { type: "val", text: "Boost engagement\n\n" },
    { type: "acc", text: "Write an Instagram Feed Post about\n" },
    { type: "val", text: '"Launching my homemade candle brand"\n\n' },
    { type: "grn", text: "→ Hook in first line, 10 hashtags at\n  end, 1 emoji per paragraph, CTA:\n  " },
    { type: "acc", text: '"Visit the link in bio"' },
];

const HOW_STEPS = [
    {
        num: "01",
        title: "Fill in the form",
        desc: "Choose platform, tone, goal and describe your topic in plain English.",
    },
    {
        num: "02",
        title: "Generate your prompt",
        desc: "One click builds a platform-optimised AI instruction ready to copy.",
    },
    {
        num: "03",
        title: "Paste into any AI",
        desc: "Drop it into ChatGPT, Claude, or Gemini and get your post instantly.",
    },
];

interface HeroSectionProps {
    toolSectionId?: string;
}

export default function HeroSection({ toolSectionId = "prompt-tool" }: HeroSectionProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 80);
        return () => clearTimeout(t);
    }, []);

    function scrollToTool() {
        const el = document.getElementById(toolSectionId);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: STYLES }} />
            <section
                className="hero-root"
                style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "none" : "translateY(12px)",
                    transition: "opacity 0.5s ease, transform 0.5s ease",
                }}
            >
                <div className="hero-inner">
                    {/* LEFT — copy */}
                    <div>
                        <div className="hero-badge">
                            <span className="hero-badge-dot" />
                            Free · No Signup · Instant
                        </div>

                        <h1 className="hero-h1">
                            Post smarter on<br />
                            <span>every platform.</span>
                        </h1>

                        <p className="hero-subtitle">
                            Build AI-ready prompts for Instagram, LinkedIn, Facebook and more
                            in seconds. Paste into ChatGPT or Claude — get a ready-to-post
                            caption instantly.
                        </p>

                        <div className="hero-platforms">
                            {PLATFORMS.map((p) => (
                                <div className="hero-platform-chip" key={p.label}>
                                    <span>{p.icon}</span>
                                    <span>{p.label}</span>
                                </div>
                            ))}
                        </div>

                        <div className="hero-cta-row">
                            <button className="hero-cta-btn" onClick={scrollToTool}>
                                Build Your Prompt
                                <span style={{ fontSize: "1.1rem" }}>↓</span>
                            </button>
                            <span className="hero-cta-note">No account needed</span>
                        </div>

                        <div className="hero-trust">
                            {[
                                ["✓", "100% Free forever"],
                                ["✓", "Works with ChatGPT & Claude"],
                                ["✓", "Runs in your browser"],
                                ["✓", "6 platforms supported"],
                            ].map(([icon, label]) => (
                                <div className="hero-trust-item" key={label}>
                                    <span>{icon}</span>
                                    <span>{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT — prompt mockup */}
                    {/* <div className="hero-mockup">
                        <div className="hero-float-chip hero-chip-1">✨ AI-optimised prompt</div>
                        <div className="hero-mockup-card">
                            <div className="hero-mockup-bar">
                                <div className="hero-mockup-dots">
                                    <div className="hero-mockup-dot" style={{ background: "#ff5f56" }} />
                                    <div className="hero-mockup-dot" style={{ background: "#ffbd2e" }} />
                                    <div className="hero-mockup-dot" style={{ background: "#27c93f" }} />
                                </div>
                                <div className="hero-mockup-label">
                                    <span>📸</span>
                                    <span>Generated prompt</span>
                                </div>
                            </div>

                            <div className="hero-mockup-body">
                                {PROMPT_LINES.map((line, i) => {
                                    const cls =
                                        line.type === "key" ? "hl-key"
                                            : line.type === "acc" ? "hl-acc"
                                                : line.type === "grn" ? "hl-grn"
                                                    : "hl-val";
                                    return (
                                        <span key={i} className={cls}>
                                            {line.text}
                                        </span>
                                    );
                                })}
                            </div>

                            <button className="hero-mockup-copy-btn">
                                <span>⎘</span> Copy prompt
                            </button>
                        </div>
                        <div className="hero-float-chip hero-chip-2">⚡ Paste into ChatGPT</div>
                    </div> */}
                </div>

                {/* How it works strip */}
                <div className="hero-how-strip">
                    {HOW_STEPS.map((step) => (
                        <div className="hero-how-item" key={step.num}>
                            <div className="hero-how-num">{step.num}</div>
                            <div>
                                <div className="hero-how-title">{step.title}</div>
                                <div className="hero-how-desc">{step.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Scroll indicator */}
                <div className="hero-scroll-indicator" onClick={scrollToTool} style={{ cursor: "pointer" }}>
                    <span>Scroll to tool</span>
                    <div className="hero-scroll-arrow" />
                </div>
            </section>
        </>
    );
}