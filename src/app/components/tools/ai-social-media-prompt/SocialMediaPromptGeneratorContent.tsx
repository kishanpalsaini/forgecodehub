"use client";

// app/components/tools/ai-social-media-prompt/SocialMediaPromptGeneratorContent.tsx
// Static SEO-rich content sections rendered below the interactive tool.
// "use client" is required because the CTA button uses onClick (window.scrollTo).

import React from "react";

// --- Styles ------------------------------------------------------------------

const STYLES = `
/* Shared */
.smcontent-wrap {
  max-width: 860px;
  margin: 0 auto;
  padding: 0 1.25rem 5rem;
  color: #d1d1e0;
  font-family: inherit;
}

/* Intro banner */
.smcontent-intro {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-left: 4px solid #E8692A;
  border-radius: 0 10px 10px 0;
  padding: 1.25rem 1.5rem;
  font-size: 0.95rem;
  line-height: 1.75;
  margin-bottom: 3rem;
}
.smcontent-intro strong { color: #E8692A; }

/* Section chrome */
.smcontent-section { margin-bottom: 3rem; }

.smcontent-h2 {
  font-size: 1.45rem;
  font-weight: 700;
  color: #f5f5f5;
  margin: 0 0 1.1rem;
  padding-bottom: 0.55rem;
  border-bottom: 2px solid rgba(232,105,42,0.35);
}

.smcontent-p {
  font-size: 0.93rem;
  line-height: 1.78;
  margin: 0 0 0.85rem;
}

/* Numbered step list */
.smcontent-steps { display: flex; flex-direction: column; gap: 0.75rem; }

.smcontent-step {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 10px;
  padding: 0.9rem 1.1rem;
}

.smcontent-step-num {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  background: #E8692A;
  color: #fff;
  font-weight: 800;
  font-size: 0.85rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.smcontent-step-text {
  font-size: 0.93rem;
  line-height: 1.65;
  padding-top: 0.25rem;
}
.smcontent-step-text strong { color: #f5f5f5; }

/* Examples grid */
.smcontent-examples {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 1rem;
}

.smcontent-example-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  padding: 1rem 1.1rem;
}

.smcontent-example-label {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #888;
  margin-bottom: 0.35rem;
}

.smcontent-example-platform {
  font-size: 0.78rem;
  font-weight: 700;
  color: #f5f5f5;
  margin-bottom: 0.3rem;
}

.smcontent-example-desc {
  font-size: 0.82rem;
  color: #b0b0c8;
  line-height: 1.55;
}

.smcontent-arrow {
  text-align: center;
  font-size: 1rem;
  color: #E8692A;
  margin: 0.5rem 0 0.3rem;
}

.smcontent-example-output {
  font-size: 0.82rem;
  color: #7cd8a2;
  font-style: italic;
  line-height: 1.55;
}

/* Checklist */
.smcontent-checklist { display: flex; flex-direction: column; gap: 0.6rem; }

.smcontent-check {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 8px;
  padding: 0.7rem 1rem;
  font-size: 0.9rem;
}

.smcontent-check-icon {
  flex-shrink: 0;
  width: 1.5rem;
  height: 1.5rem;
  background: rgba(34,197,94,0.18);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
}

/* Who-can-use cards */
.smcontent-who-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 1rem;
}

.smcontent-who-card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  padding: 1.1rem 1rem;
}

.smcontent-who-icon { font-size: 1.5rem; margin-bottom: 0.5rem; }

.smcontent-who-title {
  font-weight: 700;
  font-size: 0.9rem;
  color: #f5f5f5;
  margin-bottom: 0.35rem;
}

.smcontent-who-desc {
  font-size: 0.82rem;
  color: #a0a0b8;
  line-height: 1.55;
}

/* Platform tips */
.smcontent-platform-list { display: flex; flex-direction: column; gap: 0.75rem; }

.smcontent-platform-row {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 10px;
  padding: 0.9rem 1.1rem;
}

.smcontent-platform-icon {
  flex-shrink: 0;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.smcontent-platform-name {
  font-weight: 700;
  font-size: 0.88rem;
  color: #f5f5f5;
  margin-bottom: 0.2rem;
}

.smcontent-platform-tip {
  font-size: 0.83rem;
  color: #a8a8c0;
  line-height: 1.55;
}

/* Search tags */
.smcontent-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }

.smcontent-tag {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  padding: 0.3rem 0.9rem;
  font-size: 0.8rem;
  color: #c0c0d8;
}

/* CTA banner */
.smcontent-cta {
  background: linear-gradient(135deg, rgba(232,105,42,0.18) 0%, rgba(232,105,42,0.06) 100%);
  border: 1px solid rgba(232,105,42,0.35);
  border-radius: 12px;
  padding: 2rem 1.5rem;
  text-align: center;
}

.smcontent-cta-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #f5f5f5;
  margin-bottom: 0.5rem;
}

.smcontent-cta-sub {
  font-size: 0.9rem;
  color: #b0b0c8;
  margin-bottom: 1.25rem;
}

.smcontent-cta-btn {
  display: inline-block;
  background: #E8692A;
  color: #fff;
  font-weight: 700;
  font-size: 0.95rem;
  border-radius: 8px;
  padding: 0.7rem 2rem;
  text-decoration: none;
  cursor: pointer;
  border: none;
  transition: background 0.15s;
}
.smcontent-cta-btn:hover { background: #d05a20; }

/* Tip box */
.smcontent-tip {
  background: rgba(124,216,162,0.07);
  border: 1px solid rgba(124,216,162,0.22);
  border-radius: 8px;
  padding: 0.85rem 1.1rem;
  font-size: 0.88rem;
  color: #7cd8a2;
  line-height: 1.65;
  margin-top: 0.85rem;
}
`;

// --- Data --------------------------------------------------------------------

const STEPS = [
    {
        title: "Choose your platform",
        body: "Select Instagram, LinkedIn, Facebook, X/Twitter, YouTube, or Threads. Each platform has unique character limits, content styles, and audience expectations — the generator applies all the right rules automatically.",
    },
    {
        title: "Pick a post type",
        body: "From Feed Posts and Reels to Articles, Polls, and Community Posts — choose the exact format you need. The prompt will be tailored to that format's best practices.",
    },
    {
        title: "Describe your topic",
        body: "Type a short description of what your post is about. You can be as brief as \"my new cafe opening in Delhi\" or as detailed as you like — the AI will handle the creative writing.",
    },
    {
        title: "Set your tone, goal & audience",
        body: "Choose from 6 tones (casual, professional, funny…) and 6 goals (engagement, sales, traffic…). Optionally add your target audience for a more personalised result.",
    },
    {
        title: "Configure hashtags & emojis",
        body: "Decide how many hashtags and emojis you want included. The generator places them correctly per platform (e.g. hashtags at the end for Instagram, integrated for LinkedIn).",
    },
    {
        title: "Click Generate -> Copy -> Paste",
        body: "Hit Generate Prompt to build your AI-ready instruction. Copy it with one click and paste into ChatGPT, Claude, or Gemini to get your finished post in seconds.",
    },
];

const CHECKS = [
    "Works for all major platforms — Instagram, LinkedIn, Facebook, X, YouTube, Threads",
    "Produces platform-optimised prompts — character limits, style guides, and placement rules built in",
    "6 tones x 6 goals = 36 content flavours, all instantly configurable",
    "Zero sign-up, zero API key, zero cost — 100% free forever",
    "Runs entirely in your browser — your data never leaves your device",
    "Compatible with ChatGPT, Claude, Gemini, and any other AI writing tool",
    "Saves 15-30 minutes per post versus writing prompts manually",
    "Updates live — change any setting and regenerate instantly",
];

const WHO = [
    { icon: "✍️", title: "Content Creators", desc: "Produce consistent, on-brand captions without the blank-page block." },
    { icon: "🏪", title: "Small Businesses", desc: "Market your products and services across platforms without hiring a copywriter." },
    { icon: "📱", title: "Social Media Managers", desc: "Scale content production and meet posting schedules effortlessly." },
    { icon: "🚀", title: "Startups & SaaS", desc: "Build early audience awareness with compelling, goal-driven posts." },
    { icon: "🎓", title: "Coaches & Educators", desc: "Share knowledge and grow your community with educational or inspirational content." },
    { icon: "🛍️", title: "E-commerce Brands", desc: "Drive product awareness and sales with persuasive promotional posts." },
];

const PLATFORM_TIPS = [
    {
        icon: "📸",
        color: "rgba(225,48,108,0.2)",
        name: "Instagram",
        tip: "The generator caps your prompt at 2,200 characters, opens with a strong hook visible before the 'more' fold, and appends hashtags at the end of the caption — exactly how top accounts format their posts.",
    },
    {
        icon: "💼",
        color: "rgba(10,102,194,0.2)",
        name: "LinkedIn",
        tip: "Prompts open with a bold statement or surprising insight, avoid hard-sell language, and stay under 3,000 characters. Hashtags are woven naturally into the text for professional context.",
    },
    {
        icon: "👥",
        color: "rgba(24,119,242,0.2)",
        name: "Facebook",
        tip: "Community-first language, clear discussion prompts, and a conversational style — all optimised under 500 characters for maximum reach in the News Feed.",
    },
    {
        icon: "𝕏",
        color: "rgba(20,23,26,0.5)",
        name: "X / Twitter",
        tip: "Every prompt front-loads the value into 280 characters. Strong opinions and clear takes are baked in for higher engagement.",
    },
    {
        icon: "▶",
        color: "rgba(255,0,0,0.2)",
        name: "YouTube",
        tip: "Descriptions are keyword-rich and SEO-structured, with the most important info in the first 2-3 lines, timestamps placeholders, and a clear CTA — the formula top channels rely on.",
    },
    {
        icon: "🧵",
        color: "rgba(100,100,100,0.2)",
        name: "Threads",
        tip: "Prompts stay under 500 characters, prioritise authentic and direct language, and avoid polished marketing-speak — because Threads rewards genuine conversation over corporate messaging.",
    },
];

const EXAMPLES = [
    {
        platform: "Instagram · Reel",
        input: "Launching my homemade candle brand",
        output: "A hook-led, emoji-rich Reel caption with lifestyle storytelling, a 'link in bio' CTA, and 10-15 niche hashtags.",
    },
    {
        platform: "LinkedIn · Text Post",
        input: "3 lessons from my first SaaS product failure",
        output: "A thought-leadership post opening with a bold confession, three structured insights, and a question to spark comments.",
    },
    {
        platform: "X / Twitter · Thread",
        input: "Why most developers underestimate TypeScript",
        output: "A punchy 6-tweet thread, each under 280 characters, building an argument and ending with a strong opinion take.",
    },
    {
        platform: "YouTube · Description",
        input: "Full-body home workout — no equipment",
        output: "An SEO-rich description with keywords in the first 2 lines, timestamp placeholders, and a subscribe CTA.",
    },
];

const TONE_GOAL_COMBOS = [
    { title: "Casual + Community", body: "Best for lifestyle brands, personal accounts, and creators who want genuine conversation. Feels like a message from a friend rather than a brand." },
    { title: "Professional + Brand Awareness", body: "Ideal for B2B companies, consultants, and SaaS brands. Builds authority and credibility without being salesy." },
    { title: "Funny + Engagement", body: "The highest-engagement combination for consumer brands. Memes, relatable humour, and playful captions perform exceptionally well on Instagram and Threads." },
    { title: "Inspirational + Community", body: "The go-to for coaches, educators, and wellness brands. Creates emotional connection and encourages shares and saves." },
    { title: "Educational + Traffic", body: "Perfect for blogs, tools, and SaaS products. Value-packed posts naturally drive clicks when combined with a clear CTA." },
    { title: "Promotional + Sales", body: "Use sparingly — no more than 20% of your content. Creates direct-response copy with urgency and benefit-focused language." },
];

const SEARCH_TAGS = [
    "ai social media post generator",
    "instagram caption ai prompt",
    "linkedin post generator free",
    "chatgpt prompt for instagram",
    "social media content ai tool",
    "facebook post generator online",
    "free ai prompt for social media",
    "youtube description generator",
    "threads post generator",
    "twitter post ai generator",
    "social media prompt template",
    "ai caption generator free",
];

// --- Component ---------------------------------------------------------------

export default function SocialMediaPromptGeneratorContent() {
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: STYLES }} />
            <div className="smcontent-wrap">

                {/* Intro */}
                <div className="smcontent-intro">
                    Generate perfectly structured AI prompts for social media in seconds using our free{" "}
                    <strong>Social Media Prompt Generator</strong>. Whether you&apos;re writing an Instagram
                    caption, a LinkedIn thought-leadership post, or a YouTube description, this tool builds a
                    platform-specific, goal-aligned prompt you can paste directly into{" "}
                    <strong>ChatGPT, Claude, or Gemini</strong> — no prompt engineering knowledge required.
                </div>

                {/* What is it */}
                <div className="smcontent-section">
                    <h2 className="smcontent-h2">What Is a Social Media Prompt Generator?</h2>
                    <p className="smcontent-p">
                        A social media prompt generator is a tool that takes your inputs — platform, tone, goal,
                        topic — and assembles them into a detailed AI instruction (prompt) that any large
                        language model can execute. Instead of staring at a blank text box and guessing how to
                        phrase your ChatGPT request, you fill in a structured form and get a ready-to-use prompt
                        engineered specifically for the platform and outcome you want.
                    </p>
                    <p className="smcontent-p">
                        This tool does not call an AI itself. It builds the{" "}
                        <strong>optimal instruction for you to paste into your AI of choice</strong>. That means
                        no API costs, no account required, and no data leaving your browser.
                    </p>
                    <div className="smcontent-tip">
                        <strong>Pro tip:</strong> The quality of an AI-generated post depends almost entirely
                        on the quality of the prompt. This generator encodes years of social media best practices
                        — character limits, hook formulas, hashtag placement, tone guidelines — directly into the
                        prompt it builds for you.
                    </div>
                </div>

                {/* How to use */}
                <div className="smcontent-section">
                    <h2 className="smcontent-h2">How to Use the Prompt Generator</h2>
                    <div className="smcontent-steps">
                        {STEPS.map((s, i) => (
                            <div className="smcontent-step" key={i}>
                                <div className="smcontent-step-num">{i + 1}</div>
                                <div className="smcontent-step-text">
                                    <strong>{s.title}</strong> — {s.body}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Examples */}
                <div className="smcontent-section">
                    <h2 className="smcontent-h2">Examples</h2>
                    <div className="smcontent-examples">
                        {EXAMPLES.map((ex, i) => (
                            <div className="smcontent-example-card" key={i}>
                                <div className="smcontent-example-label">Platform</div>
                                <div className="smcontent-example-platform">{ex.platform}</div>
                                <div className="smcontent-example-label" style={{ marginTop: "0.6rem" }}>Topic</div>
                                <div className="smcontent-example-desc">{ex.input}</div>
                                <div className="smcontent-arrow">↓ Generates</div>
                                <div className="smcontent-example-output">{ex.output}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Platform-specific tips */}
                <div className="smcontent-section">
                    <h2 className="smcontent-h2">Platform-Specific Prompt Intelligence</h2>
                    <p className="smcontent-p">
                        Every platform has its own rules, audience expectations, and algorithm preferences. The
                        generator applies a different set of content rules for each one:
                    </p>
                    <div className="smcontent-platform-list">
                        {PLATFORM_TIPS.map((p, i) => (
                            <div className="smcontent-platform-row" key={i}>
                                <div className="smcontent-platform-icon" style={{ background: p.color }}>
                                    {p.icon}
                                </div>
                                <div>
                                    <div className="smcontent-platform-name">{p.name}</div>
                                    <div className="smcontent-platform-tip">{p.tip}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Why use */}
                <div className="smcontent-section">
                    <h2 className="smcontent-h2">Why Use This Tool?</h2>
                    <div className="smcontent-checklist">
                        {CHECKS.map((c, i) => (
                            <div className="smcontent-check" key={i}>
                                <div className="smcontent-check-icon">✅</div>
                                <span>{c}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Who can use */}
                <div className="smcontent-section">
                    <h2 className="smcontent-h2">Who Can Use This Tool?</h2>
                    <div className="smcontent-who-grid">
                        {WHO.map((w, i) => (
                            <div className="smcontent-who-card" key={i}>
                                <div className="smcontent-who-icon">{w.icon}</div>
                                <div className="smcontent-who-title">{w.title}</div>
                                <div className="smcontent-who-desc">{w.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Tone & Goal guide */}
                <div className="smcontent-section">
                    <h2 className="smcontent-h2">Choosing the Right Tone and Goal</h2>
                    <p className="smcontent-p">
                        The tone and goal settings are the most powerful levers in this tool. Here is a quick
                        guide to picking the right combination:
                    </p>
                    <div className="smcontent-steps">
                        {TONE_GOAL_COMBOS.map((item, i) => (
                            <div className="smcontent-step" key={i}>
                                <div
                                    className="smcontent-step-num"
                                    style={{ borderRadius: "6px", width: "auto", padding: "0 0.5rem", minWidth: "2rem" }}
                                >
                                    →
                                </div>
                                <div className="smcontent-step-text">
                                    <strong>{item.title}</strong> — {item.body}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* People also search for */}
                <div className="smcontent-section">
                    <h2 className="smcontent-h2">People Also Search For</h2>
                    <div className="smcontent-tags">
                        {SEARCH_TAGS.map((tag, i) => (
                            <span className="smcontent-tag" key={i}>{tag}</span>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="smcontent-cta">
                    <div className="smcontent-cta-title">Ready to create better social media content?</div>
                    <div className="smcontent-cta-sub">
                        Use our free prompt generator now — no sign-up, no download, no API key needed.
                    </div>
                    <button className="smcontent-cta-btn" onClick={scrollToTop}>
                        Use the Tool Now
                    </button>
                </div>

            </div>
        </>
    );
}