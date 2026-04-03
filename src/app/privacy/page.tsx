"use client";
import { useState } from "react";

const toc = [
  { id: "overview",      label: "Overview" },
  { id: "data",          label: "Data We Collect" },
  { id: "usage",         label: "How We Use Data" },
  { id: "cookies",       label: "Cookies & Storage" },
  { id: "third-party",   label: "Third Parties" },
  { id: "rights",        label: "Your Rights" },
  { id: "contact",       label: "Contact" },
];

export default function PrivacyPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
      {/* ── NAV (identical to homepage) ── */}
      <nav id="navbar">
        <a href="/" className="logo">
          <div className="logo-icon">⚒</div>
          ForgeCodeHub
        </a>
        <ul className="nav-links">
          <li><a href="/#tools">Tools</a></li>
          <li><a href="/#how">How it works</a></li>
          <li><a href="/#about">About</a></li>
          <li><a href="/#contact">Contact</a></li>
        </ul>
        <div className="hamburger" onClick={() => setMobileNavOpen(true)}>
          <span /><span /><span />
        </div>
      </nav>

      {/* mobile nav */}
      <div className={`mobile-nav ${mobileNavOpen ? "open" : ""}`}>
        <button className="mobile-nav-close" onClick={() => setMobileNavOpen(false)}>✕</button>
        {["tools","how","about","contact"].map((id) => (
          <a key={id} href={`/#${id}`} onClick={() => setMobileNavOpen(false)}>
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </a>
        ))}
      </div>

      {/* ── HERO ── */}
      <section className="legal-hero">
        <div className="hero-orb" />
        <div className="container" style={{ textAlign: "center" }}>
          <div className="hero-badge">📄 Legal</div>
          <h1 className="legal-h1">
            Privacy<br />
            <span className="line2">Policy</span>
          </h1>
          <p className="legal-hero-sub">
            We built these tools to be lean and purposeful. That philosophy extends
            to how we handle your data — we collect as little as possible.
          </p>
          <div className="legal-meta">
            <span>Last updated: January 1, 2025</span>
            <span className="legal-meta-dot" />
            <span>Effective immediately</span>
          </div>
        </div>
      </section>

      {/* gradient rule */}
      <div className="legal-rule" />

      {/* ── BODY ── */}
      <section style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
        <div className="container legal-grid">

          {/* sidebar */}
          <aside className="legal-sidebar">
            <p className="legal-toc-title">Contents</p>
            {toc.map(({ id, label }) => (
              <a key={id} href={`#${id}`} className="legal-toc-link">{label}</a>
            ))}
          </aside>

          {/* content */}
          <main className="legal-content">

            <PolicySection id="overview" num="01" title="Overview">
              <p>ForgeCodeHub ("we," "us," or "our") operates all associated tools and calculators on this website. This Privacy Policy explains what information we collect, how we use it, and what choices you have.</p>
              <p>Our tools run entirely in your browser. We do not require accounts, logins, or personal details to use any tool. Your data stays with you by default.</p>
            </PolicySection>

            <PolicySection id="data" num="02" title="Data We Collect">
              <p>We collect minimal data to operate our services:</p>
              <ul className="legal-list">
                <li><strong>Usage Analytics</strong> — Anonymous page views, tool usage frequency, and referral sources via privacy-respecting analytics. No personal identifiers are captured.</li>
                <li><strong>Email Address</strong> — Only if you subscribe to our newsletter or notification list. You can unsubscribe at any time.</li>
                <li><strong>Technical Data</strong> — Browser type, device type, and general geographic region (country level) for performance optimisation. Aggregated and non-identifiable.</li>
              </ul>
              <p>We do <strong>not</strong> collect financial information, calculator inputs, names, or any sensitive personal data. All tool computations occur locally in your browser.</p>
            </PolicySection>

            <PolicySection id="usage" num="03" title="How We Use Your Data">
              <p>The limited data we collect is used solely to:</p>
              <ul className="legal-list">
                <li>Understand which tools are most useful to improve and prioritise development</li>
                <li>Send tool update notifications (email subscribers only)</li>
                <li>Diagnose performance issues and improve site reliability</li>
                <li>Comply with legal obligations where required</li>
              </ul>
              <p>We do not sell, rent, or trade your data. We do not use it for advertising or profiling purposes.</p>
            </PolicySection>

            <PolicySection id="cookies" num="04" title="Cookies & Local Storage">
              <p>We use minimal cookies and browser storage:</p>
              <ul className="legal-list">
                <li><strong>Essential Cookies</strong> — Required for basic site functionality such as preferences and theme settings.</li>
                <li><strong>Analytics Cookies</strong> — Anonymous usage tracking. These do not contain personally identifiable information.</li>
                <li><strong>Local Storage</strong> — Some tools save your inputs locally in your browser for convenience. This data never leaves your device.</li>
              </ul>
              <p>You can clear cookies and local storage at any time through your browser settings. This will reset tool preferences but will not affect your ability to use any tool.</p>
            </PolicySection>

            <PolicySection id="third-party" num="05" title="Third-Party Services">
              <p>We use a small number of third-party services:</p>
              <ul className="legal-list">
                <li><strong>Hosting</strong> — Our infrastructure provider may collect standard server logs including IP addresses, retained for a maximum of 30 days.</li>
                <li><strong>Analytics</strong> — We use privacy-focused analytics that do not track individuals across sites or sell data.</li>
                <li><strong>Email Delivery</strong> — For subscribers only. Only your email address is shared with our delivery provider.</li>
              </ul>
              <p>We do not embed social media trackers, advertising pixels, or other surveillance technologies.</p>
            </PolicySection>

            <PolicySection id="rights" num="06" title="Your Rights">
              <p>Depending on your location, you may have the following rights:</p>
              <ul className="legal-list">
                <li><strong>Access</strong> — Request a copy of any personal data we hold about you.</li>
                <li><strong>Deletion</strong> — Request that we delete your data. For email subscribers, this means immediate removal from our list and all records.</li>
                <li><strong>Correction</strong> — Request correction of inaccurate data.</li>
                <li><strong>Objection</strong> — Object to processing of your data for specific purposes.</li>
                <li><strong>Portability</strong> — Request your data in a portable format.</li>
              </ul>
              <p>To exercise any of these rights, contact us at the address below. We will respond within 30 days.</p>
            </PolicySection>

            <PolicySection id="contact" num="07" title="Contact Us">
              <p>If you have questions about this Privacy Policy or how we handle your data, reach out:</p>
              <div className="legal-contact-box">
                <p className="legal-contact-name">ForgeCodeHub Privacy Team</p>
                <p className="legal-contact-email">privacy@forgecodehub.com</p>
              </div>
            </PolicySection>

          </main>
        </div>
      </section>

      {/* ── FOOTER (identical to homepage) ── */}
      <footer>
        <a href="/" className="logo">
          <div className="logo-icon" style={{ width: 22, height: 22, fontSize: 11 }}>⚒</div>
          ForgeCodeHub
        </a>
        <div className="footer-links">
          <a href="/privacy" style={{ color: "var(--accent)" }}>Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/disclaimer">Disclaimer</a>
          <a href="https://github.com/forgecodehub" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://twitter.com/forgecodehub" target="_blank" rel="noopener noreferrer">Twitter</a>
        </div>
        <span>© 2025 ForgeCodeHub</span>
      </footer>
    </>
  );
}

function PolicySection({
  id, num, title, children,
}: {
  id: string; num: string; title: string; children: React.ReactNode;
}) {
  return (
    <div id={id} className="legal-section">
      <div className="legal-section-header">
        <span className="legal-section-num">{num}</span>
        <div className="legal-section-rule" />
      </div>
      <h2 className="legal-section-title">{title}</h2>
      {children}
    </div>
  );
}