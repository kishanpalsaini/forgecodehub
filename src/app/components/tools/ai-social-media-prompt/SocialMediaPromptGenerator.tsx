"use client";

import { useState, useRef } from "react";
import styles from "./styles.module.css";
import Link from "next/link";

// --- Types -------------------------------------------------------------------

type Platform = "instagram" | "linkedin" | "facebook" | "twitter" | "youtube" | "threads";
type Tone = "casual" | "professional" | "funny" | "inspirational" | "educational" | "promotional";
type Goal = "engagement" | "awareness" | "traffic" | "leads" | "community" | "sales";
type PostType = {
    instagram: string[];
    linkedin: string[];
    facebook: string[];
    twitter: string[];
    youtube: string[];
    threads: string[];
};

// --- Data --------------------------------------------------------------------

const PLATFORMS: { id: Platform; label: string; icon: string; color: string }[] = [
    { id: "instagram", label: "Instagram", icon: "📸", color: "#E1306C" },
    { id: "linkedin", label: "LinkedIn", icon: "💼", color: "#0A66C2" },
    { id: "facebook", label: "Facebook", icon: "👥", color: "#1877F2" },
    { id: "twitter", label: "X / Twitter", icon: "𝕏", color: "#14171A" },
    { id: "youtube", label: "YouTube", icon: "▶", color: "#FF0000" },
    { id: "threads", label: "Threads", icon: "🧵", color: "#000000" },
];

const POST_TYPES: PostType = {
    instagram: ["Feed Post", "Story", "Reel", "Carousel"],
    linkedin: ["Text Post", "Article", "Carousel", "Poll"],
    facebook: ["Feed Post", "Story", "Reel", "Group Post"],
    twitter: ["Tweet", "Thread", "Poll", "Reply"],
    youtube: ["Description", "Community Post", "Short"],
    threads: ["Post", "Thread"],
};

const TONES: { id: Tone; label: string; emoji: string }[] = [
    { id: "casual", label: "Casual", emoji: "😊" },
    { id: "professional", label: "Professional", emoji: "💼" },
    { id: "funny", label: "Funny", emoji: "😄" },
    { id: "inspirational", label: "Inspirational", emoji: "✨" },
    { id: "educational", label: "Educational", emoji: "📚" },
    { id: "promotional", label: "Promotional", emoji: "🚀" },
];

const GOALS: { id: Goal; label: string }[] = [
    { id: "engagement", label: "Boost Engagement" },
    { id: "awareness", label: "Brand Awareness" },
    { id: "traffic", label: "Drive Traffic" },
    { id: "leads", label: "Generate Leads" },
    { id: "community", label: "Build Community" },
    { id: "sales", label: "Drive Sales" },
];

const HASHTAG_COUNTS = ["None", "3–5", "5–10", "10–15", "15–30"];
const EMOJI_OPTIONS = ["None", "1–2", "3–5", "Throughout"];

// --- Example cards for the interactive empty state ---------------------------

const EXAMPLE_CARDS: {
    platform: Platform;
    postType: string;
    tone: Tone;
    goal: Goal;
    topicHint: string;
    label: string;
    description: string;
}[] = [
        {
            platform: "instagram",
            postType: "Reel",
            tone: "casual",
            goal: "engagement",
            topicHint: "e.g. behind the scenes of my small business",
            label: "Instagram Reel",
            description: "Casual hook-led caption with emojis and hashtags",
        },
        {
            platform: "linkedin",
            postType: "Article",
            tone: "professional",
            goal: "awareness",
            topicHint: "e.g. 3 lessons from launching my first product",
            label: "LinkedIn Article",
            description: "Thought-leadership post with insight-driven structure",
        },
        {
            platform: "youtube",
            postType: "Description",
            tone: "educational",
            goal: "traffic",
            topicHint: "e.g. beginner's guide to video editing",
            label: "YouTube Description",
            description: "SEO-optimised description with timestamps and CTA",
        },
        {
            platform: "twitter",
            postType: "Thread",
            tone: "funny",
            goal: "engagement",
            topicHint: "e.g. things nobody tells you about working from home",
            label: "X / Twitter Thread",
            description: "Punchy thread with a strong opinion take",
        },
    ];

// --- Inline styles for example cards -----------------------------------------

const CARD_STYLES = `
.eg-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    width: 100%;
}

@media (max-width: 520px) {
    .eg-grid { grid-template-columns: 1fr; }
}

.eg-header {
    margin-bottom: 1.1rem;
    text-align: center;
}

.eg-header-title {
    font-size: 0.82rem;
    font-weight: 700;
    color: #c0c0d8;
    letter-spacing: 0.04em;
    margin-bottom: 0.2rem;
}

.eg-header-sub {
    font-size: 0.75rem;
    color: #606080;
}

.eg-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
    padding: 1rem;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s, transform 0.15s;
    text-align: left;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.eg-card:hover {
    background: rgba(232,105,42,0.08);
    border-color: rgba(232,105,42,0.35);
    transform: translateY(-2px);
}

.eg-card-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.eg-platform-badge {
    display: flex;
    align-items: center;
    gap: 0.35rem;
    font-size: 0.75rem;
    font-weight: 700;
    color: #f0f0f8;
}

.eg-post-type {
    font-size: 0.68rem;
    background: rgba(255,255,255,0.07);
    border-radius: 4px;
    padding: 0.15rem 0.5rem;
    color: #9090b0;
}

.eg-desc {
    font-size: 0.78rem;
    color: #8888aa;
    line-height: 1.5;
}

.eg-tone {
    font-size: 0.72rem;
    color: #686888;
    display: flex;
    align-items: center;
    gap: 0.3rem;
}

.eg-try-btn {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.72rem;
    font-weight: 700;
    color: #E8692A;
    margin-top: 0.25rem;
    opacity: 0;
    transition: opacity 0.15s;
}

.eg-card:hover .eg-try-btn { opacity: 1; }

.eg-hint-banner {
    background: rgba(232,105,42,0.1);
    border: 1px solid rgba(232,105,42,0.25);
    border-radius: 8px;
    padding: 0.6rem 0.9rem;
    font-size: 0.8rem;
    color: #E8692A;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.75rem;
    animation: hint-in 0.2s ease;
}

@keyframes hint-in {
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0); }
}
`;

// --- Prompt builder ----------------------------------------------------------

function buildPrompt({
    platform,
    postType,
    topic,
    tone,
    goal,
    audience,
    hashtags,
    emojis,
    cta,
}: {
    platform: Platform;
    postType: string;
    topic: string;
    tone: Tone;
    goal: Goal;
    audience: string;
    hashtags: string;
    emojis: string;
    cta: string;
}): string {
    const platformMeta: Record<Platform, { charLimit: string; style: string; tips: string }> = {
        instagram: {
            charLimit: "under 2,200 characters",
            style: "visually descriptive, story-driven, and emotionally engaging",
            tips: "Start with a strong hook in the first line (visible before 'more'). Use line breaks for readability.",
        },
        linkedin: {
            charLimit: "under 3,000 characters",
            style: "professional yet personal, insight-driven, and thought-leadership focused",
            tips: "Open with a bold statement or question. Share a personal insight or data point. Avoid hard-sell language.",
        },
        facebook: {
            charLimit: "under 63,206 characters, but ideally under 500",
            style: "conversational, community-oriented, and shareable",
            tips: "Encourage comments and shares. Use questions to spark discussion. Native video and images perform best.",
        },
        twitter: {
            charLimit: "under 280 characters per tweet",
            style: "punchy, witty, and direct",
            tips: "Front-load value. Use threads for longer ideas. Strong opinions and takes get more engagement.",
        },
        youtube: {
            charLimit: "under 5,000 characters for descriptions",
            style: "SEO-optimized, value-driven, and keyword-rich",
            tips: "Put the most important info in the first 2-3 lines. Include timestamps and links. Add CTAs.",
        },
        threads: {
            charLimit: "under 500 characters",
            style: "conversational, authentic, and community-driven",
            tips: "Be direct and real. Threads rewards genuine conversation over polished marketing.",
        },
    };

    const toneMap: Record<Tone, string> = {
        casual: "conversational, friendly, and relatable — like texting a friend",
        professional: "polished, credible, and authoritative",
        funny: "witty, playful, and humorous with a light touch",
        inspirational: "uplifting, motivating, and emotionally resonant",
        educational: "clear, informative, and value-packed",
        promotional: "persuasive, benefit-focused, and action-oriented",
    };

    const goalMap: Record<Goal, string> = {
        engagement: "maximise likes, comments, and shares",
        awareness: "introduce the brand/topic to a new audience",
        traffic: "drive clicks to an external website or link",
        leads: "capture interest and encourage sign-ups or enquiries",
        community: "spark discussion and build a sense of belonging",
        sales: "directly encourage a purchase or conversion",
    };

    const meta = platformMeta[platform];
    const platformLabel = PLATFORMS.find((p) => p.id === platform)!.label;

    const hashtagInstruction =
        hashtags === "None"
            ? "Do NOT include any hashtags."
            : `Include ${hashtags} relevant hashtags, ${platform === "instagram"
                ? "placed at the end of the caption"
                : "integrated naturally into the text"
            }.`;

    const emojiInstruction =
        emojis === "None"
            ? "Do NOT use any emojis."
            : `Use ${emojis} emojis ${emojis === "Throughout"
                ? "placed naturally throughout the text to enhance readability"
                : "sparingly for emphasis"
            }.`;

    const ctaLine = cta.trim()
        ? `End with a clear CTA: "${cta}"`
        : "End with a natural, platform-appropriate call-to-action.";

    const audienceLine = audience.trim()
        ? `Target audience: ${audience}.`
        : "Write for a general audience.";

    return `You are an expert ${platformLabel} content strategist.

Write a ${postType} for ${platformLabel} about the following topic:
"${topic || "[Your topic here]"}"

PLATFORM RULES:
- Keep it ${meta.charLimit}
- Style should be ${meta.style}
- ${meta.tips}

CONTENT REQUIREMENTS:
- Tone: ${toneMap[tone]}
- Goal: ${goalMap[goal]}
- ${audienceLine}
- ${hashtagInstruction}
- ${emojiInstruction}
- ${ctaLine}

OUTPUT FORMAT:
Provide only the final ${platformLabel} ${postType} text, ready to copy and post. No explanations, no alternatives — just the post.`.trim();
}

// --- Component ---------------------------------------------------------------

export default function SocialMediaPromptGenerator() {
    const [platform, setPlatform] = useState<Platform>("instagram");
    const [postType, setPostType] = useState("Feed Post");
    const [topic, setTopic] = useState("");
    const [tone, setTone] = useState<Tone>("casual");
    const [goal, setGoal] = useState<Goal>("engagement");
    const [audience, setAudience] = useState("");
    const [hashtags, setHashtags] = useState("5–10");
    const [emojis, setEmojis] = useState("3–5");
    const [cta, setCta] = useState("");
    const [generated, setGenerated] = useState("");
    const [copied, setCopied] = useState(false);
    const [showHint, setShowHint] = useState(false);

    const topicRef = useRef<HTMLTextAreaElement>(null);

    function handlePlatformChange(p: Platform) {
        setPlatform(p);
        setPostType(POST_TYPES[p][0]);
    }

    function handleExampleClick(card: typeof EXAMPLE_CARDS[number]) {
        // Pre-fill platform, post type, tone, goal
        setPlatform(card.platform);
        setPostType(card.postType);
        setTone(card.tone);
        setGoal(card.goal);
        setShowHint(true);

        // Scroll to and focus the topic textarea after state settles
        setTimeout(() => {
            topicRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
            topicRef.current?.focus();
        }, 120);
    }

    function handleGenerate() {
        const prompt = buildPrompt({
            platform, postType, topic, tone, goal,
            audience, hashtags, emojis, cta,
        });
        setGenerated(prompt);
        setCopied(false);
        setShowHint(false);
        setTimeout(() => {
            document.getElementById("output-section")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(generated);
        } catch {
            // Fallback for HTTP / older browsers
            const el = document.createElement("textarea");
            el.value = generated;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    const platformColor = PLATFORMS.find((p) => p.id === platform)?.color ?? "#E8692A";

    // Find tone emoji for hint banner
    const toneEmoji = TONES.find((t) => t.id === tone)?.emoji ?? "";
    const platformLabel = PLATFORMS.find((p) => p.id === platform)?.label ?? "";

    return (
        <div className={styles.page}>
            <style dangerouslySetInnerHTML={{ __html: CARD_STYLES }} />

            {/* Header */}
            <div className={styles.header}>
                <Link href="/" className={styles.backLink}>← Back to tools</Link>
                <div className={styles.badge}>Free · No AI API · Instant</div>
                <h1 className={styles.title}>
                    Social Media<br />
                    <span className={styles.titleAccent}>Prompt Generator</span>
                </h1>
                <p className={styles.subtitle}>
                    Generate ready-to-paste AI prompts for any platform — Instagram, LinkedIn,
                    Facebook & more. Paste into ChatGPT or Claude to get your post instantly.
                </p>
            </div>

            <div className={styles.layout}>
                {/* Left: Form */}
                <div className={styles.form}>

                    {/* Step 1: Platform */}
                    <div className={styles.section}>
                        <div className={styles.stepLabel}>
                            <span className={styles.stepNum}>01</span> Choose platform
                        </div>
                        <div className={styles.platformGrid}>
                            {PLATFORMS.map((p) => (
                                <button
                                    key={p.id}
                                    className={`${styles.platformBtn} ${platform === p.id ? styles.platformBtnActive : ""}`}
                                    style={platform === p.id ? { borderColor: p.color, color: p.color } as React.CSSProperties : {}}
                                    onClick={() => handlePlatformChange(p.id)}
                                >
                                    <span className={styles.platformIcon}>{p.icon}</span>
                                    <span>{p.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Step 2: Post type */}
                    <div className={styles.section}>
                        <div className={styles.stepLabel}>
                            <span className={styles.stepNum}>02</span> Post type
                        </div>
                        <div className={styles.chipRow}>
                            {POST_TYPES[platform].map((type) => (
                                <button
                                    key={type}
                                    className={`${styles.chip} ${postType === type ? styles.chipActive : ""}`}
                                    onClick={() => setPostType(type)}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Step 3: Topic */}
                    <div className={styles.section}>
                        <div className={styles.stepLabel}>
                            <span className={styles.stepNum}>03</span> What&apos;s your post about?
                        </div>

                        {/* Hint banner shown after clicking an example card */}
                        {showHint && !topic.trim() && (
                            <div className="eg-hint-banner">
                                <span>→</span>
                                <span>
                                    {toneEmoji} {platformLabel} · {postType} selected —
                                    now describe your topic below and click Generate
                                </span>
                            </div>
                        )}

                        <textarea
                            ref={topicRef}
                            className={styles.textarea}
                            placeholder="e.g. launching my new bakery in Mumbai, tips for beginner photographers, our new SaaS product..."
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            rows={3}
                        />
                    </div>

                    {/* Step 4: Tone */}
                    <div className={styles.section}>
                        <div className={styles.stepLabel}>
                            <span className={styles.stepNum}>04</span> Tone of voice
                        </div>
                        <div className={styles.chipRow}>
                            {TONES.map((t) => (
                                <button
                                    key={t.id}
                                    className={`${styles.chip} ${tone === t.id ? styles.chipActive : ""}`}
                                    onClick={() => setTone(t.id)}
                                >
                                    {t.emoji} {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Step 5: Goal */}
                    <div className={styles.section}>
                        <div className={styles.stepLabel}>
                            <span className={styles.stepNum}>05</span> Post goal
                        </div>
                        <div className={styles.chipRow}>
                            {GOALS.map((g) => (
                                <button
                                    key={g.id}
                                    className={`${styles.chip} ${goal === g.id ? styles.chipActive : ""}`}
                                    onClick={() => setGoal(g.id)}
                                >
                                    {g.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Step 6: Audience */}
                    <div className={styles.section}>
                        <div className={styles.stepLabel}>
                            <span className={styles.stepNum}>06</span> Target audience{" "}
                            <span className={styles.optional}>(optional)</span>
                        </div>
                        <input
                            className={styles.input}
                            placeholder="e.g. small business owners, fitness enthusiasts aged 25–35..."
                            value={audience}
                            onChange={(e) => setAudience(e.target.value)}
                        />
                    </div>

                    {/* Step 7: CTA */}
                    <div className={styles.section}>
                        <div className={styles.stepLabel}>
                            <span className={styles.stepNum}>07</span> Call to action{" "}
                            <span className={styles.optional}>(optional)</span>
                        </div>
                        <input
                            className={styles.input}
                            placeholder="e.g. Visit the link in bio, Comment below, DM us..."
                            value={cta}
                            onChange={(e) => setCta(e.target.value)}
                        />
                    </div>

                    {/* Step 8: Hashtags & Emojis */}
                    <div className={styles.section}>
                        <div className={styles.stepLabel}>
                            <span className={styles.stepNum}>08</span> Hashtags &amp; emojis
                        </div>
                        <div className={styles.twoCol}>
                            <div>
                                <div className={styles.sublabel}>Hashtags</div>
                                <div className={styles.chipRow}>
                                    {HASHTAG_COUNTS.map((h) => (
                                        <button
                                            key={h}
                                            className={`${styles.chip} ${hashtags === h ? styles.chipActive : ""}`}
                                            onClick={() => setHashtags(h)}
                                        >
                                            {h}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className={styles.sublabel}>Emojis</div>
                                <div className={styles.chipRow}>
                                    {EMOJI_OPTIONS.map((e) => (
                                        <button
                                            key={e}
                                            className={`${styles.chip} ${emojis === e ? styles.chipActive : ""}`}
                                            onClick={() => setEmojis(e)}
                                        >
                                            {e}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Generate */}
                    <button
                        className={styles.generateBtn}
                        onClick={handleGenerate}
                        disabled={!topic.trim()}
                    >
                        Generate Prompt ↗
                    </button>
                    {!topic.trim() && (
                        <p className={styles.hint}>Enter a topic above to generate your prompt</p>
                    )}
                </div>

                {/* Right: Output */}
                <div className={styles.output} id="output-section">
                    {!generated ? (
                        <div className={styles.outputEmpty}>
                            {/* Interactive example cards */}
                            <div className="eg-header">
                                <div className="eg-header-title">Try an example</div>
                                <div className="eg-header-sub">
                                    Click any card to pre-fill the form
                                </div>
                            </div>

                            <div className="eg-grid">
                                {EXAMPLE_CARDS.map((card) => {
                                    const platformData = PLATFORMS.find((p) => p.id === card.platform)!;
                                    const toneData = TONES.find((t) => t.id === card.tone)!;
                                    return (
                                        <button
                                            key={card.label}
                                            className="eg-card"
                                            onClick={() => handleExampleClick(card)}
                                        >
                                            <div className="eg-card-top">
                                                <div className="eg-platform-badge">
                                                    <span>{platformData.icon}</span>
                                                    <span style={{ color: platformData.color }}>
                                                        {platformData.label}
                                                    </span>
                                                </div>
                                                <span className="eg-post-type">{card.postType}</span>
                                            </div>
                                            <div className="eg-desc">{card.description}</div>
                                            <div className="eg-tone">
                                                <span>{toneData.emoji}</span>
                                                <span>{toneData.label} tone</span>
                                            </div>
                                            <div className="eg-try-btn">
                                                Use this setup →
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className={styles.outputCard}>
                            <div className={styles.outputHeader}>
                                <div className={styles.outputMeta}>
                                    <span
                                        className={styles.outputPlatformDot}
                                        style={{ background: platformColor }}
                                    />
                                    <span>{platformLabel} · {postType}</span>
                                </div>
                                <button
                                    className={`${styles.copyBtn} ${copied ? styles.copyBtnDone : ""}`}
                                    onClick={handleCopy}
                                >
                                    {copied ? "✓ Copied!" : "Copy"}
                                </button>
                            </div>
                            <pre className={styles.outputText} style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                                {generated}
                            </pre>
                            <div className={styles.outputFooter}>
                                Paste this into ChatGPT, Claude, or Gemini to generate your post instantly.
                            </div>
                        </div>
                    )}

                    {/* How to use */}
                    <div className={styles.howTo}>
                        <div className={styles.howToTitle}>How to use this</div>
                        <div className={styles.howToSteps}>
                            <div className={styles.howToStep}>
                                <span className={styles.howToNum}>1</span>
                                <span>Click an example above or fill in your platform, topic, tone &amp; goal</span>
                            </div>
                            <div className={styles.howToStep}>
                                <span className={styles.howToNum}>2</span>
                                <span>Click Generate to build your AI prompt</span>
                            </div>
                            <div className={styles.howToStep}>
                                <span className={styles.howToNum}>3</span>
                                <span>Copy and paste into any AI (ChatGPT, Claude, Gemini)</span>
                            </div>
                            <div className={styles.howToStep}>
                                <span className={styles.howToNum}>4</span>
                                <span>Get a ready-to-post social media caption instantly</span>
                            </div>
                        </div>
                    </div>

                    {/* More tools teaser */}
                    <div className={styles.moreSoon}>
                        <div className={styles.moreTitle}>More prompt tools coming soon</div>
                        <div className={styles.moreList}>
                            <span className={styles.moreTag}>Blog / SEO</span>
                            <span className={styles.moreTag}>Email Outreach</span>
                            <span className={styles.moreTag}>Ad Copy</span>
                            <span className={styles.moreTag}>YouTube Scripts</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}