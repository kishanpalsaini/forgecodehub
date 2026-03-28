"use client";

import { useEffect, useRef, useState } from "react";

const tools = [
  {
    href: "/calculators",
    icon: "🧮",
    tag: "Live",
    tagClass: "tag-live",
    name: "Financial Calculator",
    desc: "Calculate monthly loan installments with a breakdown of principal and interest over time.",
    path: "/calculators",
    cat: "finance",
  },
  {
    href: "/calculator/emi",
    icon: "🧮",
    tag: "Live",
    tagClass: "tag-live",
    name: "EMI Calculator",
    desc: "Calculate monthly loan installments with a breakdown of principal and interest over time.",
    path: "/calculator/emi",
    cat: "finance",
  },
  {
    href: "/reel-scheduler",
    icon: "🎬",
    tag: "Live",
    tagClass: "tag-live",
    name: "Reel Scheduler",
    desc: "Plan and schedule your Instagram Reels and short-form content with smart timing recommendations.",
    path: "/reel-scheduler",
    cat: "media",
  },
  {
    href: "/tools/pdf-converter",
    icon: "📄",
    tag: "New",
    tagClass: "tag-new",
    name: "PDF Converter",
    desc: "Convert documents between PDF, Word, and image formats directly in your browser — no uploads.",
    path: "/tools/pdf-converter",
    cat: "dev",
  },
  {
    href: "/tools/color-picker",
    icon: "🎨",
    tag: "Soon",
    tagClass: "tag-coming",
    name: "Color Palette Gen",
    desc: "Generate accessible color palettes from a single hex. Export to CSS, Figma, or Tailwind format.",
    path: "/tools/color-picker",
    cat: "dev",
  },
  {
    href: "/tools/pomodoro",
    icon: "⏱",
    tag: "Soon",
    tagClass: "tag-coming",
    name: "Focus Timer",
    desc: "Distraction-free Pomodoro timer with session tracking, streaks, and daily focus reports.",
    path: "/tools/pomodoro",
    cat: "productivity",
  },
  {
    href: "/calculator/sip",
    icon: "📈",
    tag: "Soon",
    tagClass: "tag-coming",
    name: "SIP Calculator",
    desc: "Project your mutual fund SIP returns with compound interest over custom time horizons.",
    path: "/calculator/sip",
    cat: "finance",
  },
];

const steps = [
  { num: "01", title: "Pick a tool", desc: "Browse the hub or jump directly to a URL like /calculator/emi. Every tool is one click away." },
  { num: "02", title: "Use it instantly", desc: "No sign-up. No paywall. Tools run entirely in your browser — your data stays with you." },
  { num: "03", title: "Bookmark & share", desc: "Every tool has a clean, shareable URL. Save it, share it, or link it from anywhere." },
  { num: "04", title: "More coming", desc: "New tools drop regularly. Subscribe to get notified when something new gets forged." },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [toolCount, setToolCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [uptime, setUptime] = useState(0);
  const statsTriggered = useRef(false);

  // Particles
  useEffect(() => {
    const container = document.getElementById("particles");
    if (!container) return;
    for (let i = 0; i < 28; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      const size = Math.random() * 3 + 1.5;
      p.style.cssText = `
        --x: ${Math.random() * 100}%;
        --dur: ${Math.random() * 8 + 6}s;
        --delay: ${Math.random() * 8}s;
        width: ${size}px; height: ${size}px;
      `;
      container.appendChild(p);
    }
  }, []);

  // Scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".tool-card, .step").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [activeCategory]);

  function animateCount(setter: (v: number) => void, target: number, duration: number) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      setter(Math.floor(start));
      if (start >= target) clearInterval(timer);
    }, 16);
  }

  // Stats counter
  useEffect(() => {
    const statsEl = document.querySelector(".stats-bar");
    if (!statsEl) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !statsTriggered.current) {
        statsTriggered.current = true;
        animateCount(setToolCount, 6, 800);
        animateCount(setUserCount, 1200, 1200);
        animateCount(setUptime, 99, 1000);
        observer.disconnect();
      }
    });
    observer.observe(statsEl);
    return () => observer.disconnect();
  }, []);


  function handleSubscribe() {
    if (!email.includes("@")) { alert("Please enter a valid email."); return; }
    setEmail("");
    setSubscribed(true);
  }

  const filteredTools = activeCategory === "all"
    ? tools
    : tools.filter((t) => t.cat === activeCategory);

  return (
    <>
      {/* NAV */}
      <nav id="navbar">
        <a href="#" className="logo">
          <div className="logo-icon">⚒</div>
          ForgeCodeHub
        </a>
        <ul className="nav-links">
          <li><a href="#tools">Tools</a></li>
          <li><a href="#how">How it works</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        <div className="hamburger" onClick={() => setMobileNavOpen(true)}>
          <span></span><span></span><span></span>
        </div>
      </nav>

      {/* MOBILE NAV */}
      <div className={`mobile-nav ${mobileNavOpen ? "open" : ""}`}>
        <button className="mobile-nav-close" onClick={() => setMobileNavOpen(false)}>✕</button>
        {["tools", "how", "about", "contact"].map((id) => (
          <a key={id} href={`#${id}`} onClick={() => setMobileNavOpen(false)}>
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </a>
        ))}
      </div>

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero-orb"></div>
        <div className="particles" id="particles"></div>
        <div className="hero-badge">⚡ New tools dropping soon</div>
        <h1>
          Tools forged<br />
          <span className="line2">for builders</span>
        </h1>
        <p>A growing collection of developer utilities, calculators, and productivity apps — built lean, fast, and purpose-driven.</p>
        <div className="hero-ctas">
          <a href="#tools" className="btn-primary">Explore Tools →</a>
          <a href="#how" className="btn-secondary">How it works</a>
        </div>
        <div className="scroll-hint">
          <span>Scroll</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* STATS */}
      <div className="stats-bar">
        <div className="stat">
          <span className="stat-num">{toolCount}</span>
          <span className="stat-label">Tools &amp; Apps</span>
        </div>
        <div className="stat">
          <span className="stat-num">{userCount}<span>+</span></span>
          <span className="stat-label">Monthly Users</span>
        </div>
        <div className="stat">
          <span className="stat-num">{uptime}<span>%</span></span>
          <span className="stat-label">Uptime</span>
        </div>
        <div className="stat">
          <span className="stat-num">Free<span style={{ color: "var(--accent)" }}>.</span></span>
          <span className="stat-label">Always</span>
        </div>
      </div>

      {/* TOOLS */}
      <section id="tools">
        <div className="container">
          <div className="section-label">What we build</div>
          <h2 className="section-title">All tools, one hub</h2>
          <p className="section-desc">Everything is free, fast, and focused. No bloat, no accounts required.</p>

          <div className="categories">
            {["all", "finance", "media", "dev", "productivity"].map((cat) => (
              <button
                key={cat}
                className={`cat-btn ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className="tools-grid">
            {filteredTools.map((tool) => (
              <a key={tool.path} href={tool.href} className="tool-card"
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
                  e.currentTarget.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
                }}
              >
                <div className="tool-card-header">
                  <div className="tool-icon">{tool.icon}</div>
                  <span className={`tool-tag ${tool.tagClass}`}>{tool.tag}</span>
                </div>
                <div className="tool-name">{tool.name}</div>
                <div className="tool-desc">{tool.desc}</div>
                <div className="tool-footer">
                  <span className="tool-path">{tool.path}</span>
                  <div className="tool-arrow">↗</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section" id="how">
        <div className="container">
          <div className="section-label">The process</div>
          <h2 className="section-title">Simple by design</h2>
          <p className="section-desc">No logins. No friction. Just tools that work.</p>
          <div className="steps-grid">
            {steps.map((s) => (
              <div className="step" key={s.num}>
                <div className="step-num">{s.num}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="contact">
        <div className="cta-box">
          <div className="section-label" style={{ justifyContent: "center" }}>Stay in the loop</div>
          <h2>Get notified when new tools drop</h2>
          <p>No spam. Just a heads-up when something worth using is ready.</p>
          <div className="email-form">
            <input
              type="email"
              className="email-input"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn-primary" onClick={handleSubscribe}>Notify me</button>
          </div>
          {subscribed && <p className="subscribe-msg">✓ You&apos;re on the list!</p>}
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <a href="#" className="logo">
          <div className="logo-icon" style={{ width: 22, height: 22, fontSize: 11 }}>⚒</div>
          ForgeCodeHub
        </a>
        <div className="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">GitHub</a>
          <a href="#">Twitter</a>
        </div>
        <span>© 2025 ForgeCodeHub</span>
      </footer>
    </>
  );
}