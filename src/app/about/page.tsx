"use client";

import { useEffect, useRef } from "react";
import styles from "./about.module.css";
import Link from "next/link";

const TOOLS = [
    "EMI Calculator", "GST Calculator", "SIP Calculator", "Income Tax Calculator",
    "Loan Eligibility", "FD Calculator", "Net Worth Tracker", "Retirement Planner",
    "PNG to JPG", "Image Converter", "Base64 Encoder", "JSON Formatter",
    "URL Encoder", "CSS Minifier", "Crypto Tool", "Password Generator",
    "QR Code Generator", "Color Picker", "Regex Tester", "Markdown Preview",
    "Unix Timestamp", "HTML Minifier", "JSON Viewer", "Bank Calculator",
];

const VALUES = [
    { icon: "⚡", title: "Instant", desc: "Open a tool, use it, done. No loading screens, no account creation, no waiting." },
    { icon: "🔒", title: "Private", desc: "Everything runs in your browser. Your data never touches our servers." },
    { icon: "🆓", title: "Always free", desc: "Every tool is 100% free. No hidden plans, no credit limits, no paywalls." },
    { icon: "🎯", title: "Built with purpose", desc: "Each tool solves a real problem. No bloat, no distractions, just what you need." },
];

const TIMELINE = [
    {
        label: "The idea",
        title: "One frustration, one solution",
        desc: "Too many online tools were slow, cluttered with ads, or locked behind signups. We set out to fix that — one clean tool at a time.",
    },
    {
        label: "Starting small",
        title: "A handful of useful tools",
        desc: "Launched with a few essentials that people actually reach for every day. Simple, fast, no-nonsense.",
    },
    {
        label: "Growing fast",
        title: "30+ tools across 4 categories",
        desc: "Finance calculators, image converters, tax tools, developer utilities — the hub now serves students, freelancers, and engineers alike.",
    },
    {
        label: "What's next",
        title: "New tools every week",
        desc: "We're constantly adding more. Subscribe to get notified when something new drops.",
    },
];

const STATS = [
    { id: "tools", target: 30, suffix: "+", label: "Free tools" },
    { id: "users", target: 12000, suffix: "+", label: "Monthly users" },
    { id: "free", target: 100, suffix: "%", label: "Free, always" },
    { id: "signups", target: 0, suffix: "", label: "Signups needed" },
];

const CATEGORIES = [
    {
        icon: "💰",
        title: "Finance",
        desc: "EMI, GST, SIP, income tax, loan eligibility, FD returns — tools for every money decision.",
        color: "#f97316",
    },
    {
        icon: "🖼️",
        title: "Media",
        desc: "Convert, compress, and transform images instantly without uploading to any server.",
        color: "#8b5cf6",
    },
    {
        icon: "⚙️",
        title: "Developer",
        desc: "JSON tools, encoders, minifiers, formatters — everything a developer reaches for daily.",
        color: "#0ea5e9",
    },
    {
        icon: "📋",
        title: "Productivity",
        desc: "Password generators, QR codes, color pickers — small tools that save real time.",
        color: "#10b981",
    },
];

function countUp(el: HTMLElement, target: number, suffix: string, duration: number) {
    let start = 0;
    const steps = 60;
    const step = target / steps;
    const timer = setInterval(() => {
        start = Math.min(start + step, target);
        el.textContent = Math.round(start) + suffix;
        if (start >= target) clearInterval(timer);
    }, duration / steps);
}

export default function AboutPage() {
    const valuesRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    const categoriesRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            STATS.forEach(({ id, target, suffix }) => {
                const el = document.getElementById(`stat-${id}`);
                if (el) countUp(el, target, suffix, 1200);
            });
        }, 300);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) e.target.classList.add(styles.visible);
                });
            },
            { threshold: 0.15 }
        );

        const cards = valuesRef.current?.querySelectorAll(`.${styles.valueCard}`);
        const items = timelineRef.current?.querySelectorAll(`.${styles.tlItem}`);
        const cats = categoriesRef.current?.querySelectorAll(`.${styles.catCard}`);

        cards?.forEach((el) => observer.observe(el));
        items?.forEach((el) => observer.observe(el));
        cats?.forEach((el) => observer.observe(el));

        return () => {
            clearTimeout(timeout);
            observer.disconnect();
        };
    }, []);

    const tickerTools = [...TOOLS, ...TOOLS];

    return (
        <main className={styles.page}>

            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.heroBadge}>About us</div>
                <h1 className={styles.heroTitle}>
                    Built for <span className={styles.orange}>everyone</span>,<br />
                    forged with purpose
                </h1>
                <p className={styles.heroSub}>
                    ForgeCodeHub is a growing collection of free tools for developers,
                    students, freelancers, and everyday users — no signups, no ads,
                    just tools that work.
                </p>
                <div className={styles.divider} />

                <div className={styles.statsRow}>
                    {STATS.map((s) => (
                        <div key={s.id} className={styles.statCard}>
                            <span id={`stat-${s.id}`} className={styles.statNum}>0{s.suffix}</span>
                            <span className={styles.statLabel}>{s.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Ticker */}
            <div className={styles.ticker}>
                <div className={styles.tickerInner}>
                    {tickerTools.map((tool, i) => (
                        <span key={i} className={styles.tickerItem}>{tool}</span>
                    ))}
                </div>
            </div>

            {/* Mission */}
            <section className={styles.section}>
                <div className={styles.sectionBadge}>What we build</div>
                <h2 className={styles.sectionTitle}>Tools for real tasks, real people.</h2>
                <p className={styles.sectionText}>
                    Whether you&apos;re calculating your home loan EMI, converting an image,
                    checking your GST, or formatting code at 2am — ForgeCodeHub has a tool for it.
                    Free, instant, no account required.
                </p>
                <p className={styles.sectionText}>
                    We started with developer utilities and kept going. Today the hub covers
                    finance, productivity, media, and developer tools — and we&apos;re adding
                    more every week.
                </p>

                <div className={styles.valuesGrid} ref={valuesRef}>
                    {VALUES.map((v) => (
                        <div key={v.title} className={styles.valueCard}>
                            <div className={styles.valueIcon}>{v.icon}</div>
                            <h3 className={styles.valueTitle}>{v.title}</h3>
                            <p className={styles.valueDesc}>{v.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Categories */}
            <section className={`${styles.section} ${styles.sectionBordered}`}>
                <div className={styles.sectionBadge}>What's inside</div>
                <h2 className={styles.sectionTitle}>Four categories, one hub.</h2>
                <p className={styles.sectionText}>
                    From tax calculators to image converters — everything is organised so
                    you find what you need in seconds.
                </p>
                <div className={styles.catGrid} ref={categoriesRef}>
                    {CATEGORIES.map((c) => (
                        <div key={c.title} className={styles.catCard}>
                            <div className={styles.catIcon} style={{ background: c.color + "18", color: c.color }}>
                                {c.icon}
                            </div>
                            <h3 className={styles.catTitle}>{c.title}</h3>
                            <p className={styles.catDesc}>{c.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Timeline */}
            <section className={`${styles.section} ${styles.sectionBordered}`}>
                <div className={styles.sectionBadge}>The story</div>
                <h2 className={styles.sectionTitle}>How it started</h2>
                <div className={styles.timeline} ref={timelineRef}>
                    {TIMELINE.map((item) => (
                        <div key={item.label} className={styles.tlItem}>
                            <div className={styles.tlDot} />
                            <div className={styles.tlLabel}>{item.label}</div>
                            <h3 className={styles.tlTitle}>{item.title}</h3>
                            <p className={styles.tlDesc}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Who is it for */}
            <section className={`${styles.section} ${styles.sectionBordered}`}>
                <div className={styles.sectionBadge}>Who it's for</div>
                <h2 className={styles.sectionTitle}>Everyone, really.</h2>
                <div className={styles.personaGrid}>
                    {[
                        { emoji: "🧑‍💻", role: "Developers", desc: "Format JSON, encode URLs, minify CSS — all the tools you reach for daily." },
                        { emoji: "🎓", role: "Students", desc: "Calculate EMI, plan SIP, check tax — understand your money better." },
                        { emoji: "💼", role: "Freelancers", desc: "Quick image conversions, QR codes, password generators — small tasks, fast." },
                        { emoji: "🏠", role: "Everyday users", desc: "Home loan calculator, GST checker, retirement planner — no jargon, just answers." },
                    ].map((p) => (
                        <div key={p.role} className={styles.personaCard}>
                            <span className={styles.personaEmoji}>{p.emoji}</span>
                            <h3 className={styles.personaRole}>{p.role}</h3>
                            <p className={styles.personaDesc}>{p.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className={styles.cta}>
                <div className={styles.sectionBadge}>Start now</div>
                <h2 className={styles.ctaTitle}>Explore the hub</h2>
                <p className={styles.ctaSub}>
                    30+ free tools for everyone. No account. Just pick one and go.
                </p>
                <div className={styles.ctaButtons}>
                    <Link href="/#tools" className={styles.btnOrange}>Explore tools</Link>
                    <Link href="/" className={styles.btnGhost}>Back to home</Link>
                    {/* <a href="/" className={styles.btnGhost}>Back to home</a> */}
                </div>
            </section>

        </main>
    );
}