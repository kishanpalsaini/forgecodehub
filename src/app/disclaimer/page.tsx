"use client";
import { useState } from "react";

const toc = [
  { id: "general",      label: "General Disclaimer" },
  { id: "financial",    label: "Financial Tools" },
  { id: "tax",          label: "Tax Calculators" },
  { id: "investment",   label: "Investment Tools" },
  { id: "loan",         label: "Loan & EMI Tools" },
  { id: "accuracy",     label: "No Accuracy Guarantee" },
  { id: "external",     label: "External Links" },
  { id: "professional", label: "Seek Professional Help" },
];

export default function DisclaimerPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <>
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

      <div className={`mobile-nav ${mobileNavOpen ? "open" : ""}`}>
        <button className="mobile-nav-close" onClick={() => setMobileNavOpen(false)}>✕</button>
        {["tools","how","about","contact"].map((id) => (
          <a key={id} href={`/#${id}`} onClick={() => setMobileNavOpen(false)}>
            {id.charAt(0).toUpperCase() + id.slice(1)}
          </a>
        ))}
      </div>

      <section className="legal-hero">
        <div className="hero-orb" />
        <div className="container" style={{ textAlign: "center" }}>
          <div className="hero-badge">⚠️ Legal</div>
          <h1 className="legal-h1">
            Disclaimer
          </h1>
          <p className="legal-hero-sub">
            ForgeCodeHub tools are built to be useful — not to replace professional
            advice. Here&apos;s what you need to know before relying on any output.
          </p>
          <div className="legal-meta">
            <span>Last updated: January 1, 2025</span>
            <span className="legal-meta-dot" />
            <span>Effective immediately</span>
          </div>
        </div>
      </section>

      <div className="legal-rule" />

      {/* top alert banner */}
      <div className="container" style={{ paddingTop: "2.5rem" }}>
        <div className="legal-alert-box legal-alert-top">
          <p className="legal-alert-title">⚡ Important</p>
          <p>All tools on ForgeCodeHub are for informational and educational purposes only. They do not constitute financial, legal, tax, or investment advice. Always consult a qualified professional before making financial decisions.</p>
        </div>
      </div>

      <section style={{ paddingTop: "3rem", paddingBottom: "6rem" }}>
        <div className="container legal-grid">

          <aside className="legal-sidebar">
            <p className="legal-toc-title">Contents</p>
            {toc.map(({ id, label }) => (
              <a key={id} href={`#${id}`} className="legal-toc-link">{label}</a>
            ))}
          </aside>

          <main className="legal-content">

            <PolicySection id="general" num="01" title="General Disclaimer">
              <p>The information, calculators, and tools provided on ForgeCodeHub are intended solely for general informational and educational purposes. Nothing on this website constitutes professional advice of any kind.</p>
              <p>While we strive to keep our tools accurate, up to date, and useful, we make no representations or warranties of any kind — express or implied — about the completeness, accuracy, reliability, or suitability of the information or tools provided.</p>
              <p>Any action you take based on the information or results provided by our tools is strictly at your own risk. ForgeCodeHub accepts no liability for any losses or damages arising from your use of the Service.</p>
            </PolicySection>

            <PolicySection id="financial" num="02" title="Financial Tools Disclaimer">
              <p>Our financial calculators — including EMI calculators, SIP calculators, loan eligibility tools, and net worth trackers — are provided as planning aids only.</p>
              <ul className="legal-list">
                <li>Results are estimates based on the inputs you provide and standard mathematical formulas.</li>
                <li>Actual financial outcomes may vary significantly due to market conditions, lender policies, regulatory changes, and individual circumstances.</li>
                <li>These tools do not account for your complete financial picture, personal risk tolerance, or specific goals.</li>
                <li>We are not a registered financial advisor, broker, or investment firm.</li>
              </ul>
              <p>Please consult a SEBI-registered financial advisor or certified financial planner before making investment or borrowing decisions.</p>
            </PolicySection>

            <PolicySection id="tax" num="03" title="Tax Calculator Disclaimer">
              <p>Our income tax calculators and GST tools are based on publicly available tax rules and rates. They are designed for quick estimation only.</p>
              <ul className="legal-list">
                <li>Tax laws are subject to change. Calculations may not reflect the most recent amendments or circulars issued by tax authorities.</li>
                <li>Our tools do not account for individual deductions, exemptions, surcharges, or special provisions that may apply to your specific situation.</li>
                <li>Results should not be used for actual tax filing, advance tax computation, or official submissions.</li>
              </ul>
              <p>Always verify your tax liability with a chartered accountant (CA) or qualified tax professional. Use the Income Tax Department's official portal for authoritative guidance.</p>
            </PolicySection>

            <PolicySection id="investment" num="04" title="Investment Tools Disclaimer">
              <p>Investment-related tools such as retirement planners and SIP projectors use assumed rates of return for illustrative purposes. These assumptions do not guarantee actual future returns.</p>
              <ul className="legal-list">
                <li>Mutual fund and equity investments are subject to market risk. Past performance is not indicative of future results.</li>
                <li>Inflation-adjusted projections are based on estimated future inflation rates, which are inherently uncertain.</li>
                <li>Returns shown in projections are hypothetical and for planning reference only.</li>
              </ul>
              <p>Investment decisions should be made in consultation with a licensed financial advisor who understands your full financial situation.</p>
            </PolicySection>

            <PolicySection id="loan" num="05" title="Loan & EMI Tools Disclaimer">
              <p>Our EMI and loan eligibility calculators use standard amortisation formulas and the inputs you provide. Actual loan terms, EMI amounts, and eligibility criteria are determined solely by the lending institution.</p>
              <ul className="legal-list">
                <li>Interest rates, processing fees, prepayment charges, and other terms vary between lenders and are subject to change.</li>
                <li>Eligibility results are indicative only and not a pre-approval or guarantee of credit.</li>
                <li>CIBIL scores and other credit bureau data are not verified or accessed by our tools.</li>
              </ul>
              <p>Contact your bank or NBFC directly for accurate loan terms and eligibility assessment.</p>
            </PolicySection>

            <PolicySection id="accuracy" num="06" title="No Accuracy Guarantee">
              <p>We maintain and update our tools regularly, but we cannot guarantee that all outputs are error-free or current at all times. Tax rates, regulatory thresholds, and financial parameters change periodically.</p>
              <p>If you notice an error or discrepancy in any tool, please report it to us at <strong>support@forgecodehub.com</strong>. We will investigate and correct verified issues promptly.</p>
            </PolicySection>

            <PolicySection id="external" num="07" title="External Links">
              <p>ForgeCodeHub may contain links to third-party websites, government portals, or financial resources for reference. These links are provided as a convenience only.</p>
              <ul className="legal-list">
                <li>We do not endorse or take responsibility for the content, accuracy, or practices of linked third-party sites.</li>
                <li>Visiting external links is at your own risk. We have no control over the nature or content of those sites.</li>
              </ul>
            </PolicySection>

            <PolicySection id="professional" num="08" title="When to Seek Professional Help">
              <p>Please consult a qualified professional in the following situations:</p>
              <div className="legal-cards-grid">
                {[
                  { icon: "₹", title: "Tax Filing",        desc: "Before filing income tax returns" },
                  { icon: "📈", title: "Investments",      desc: "Before investing in financial products" },
                  { icon: "🏠", title: "Home Loans",       desc: "Before applying for a mortgage" },
                  { icon: "📋", title: "Financial Planning",desc: "For retirement or goal-based planning" },
                  { icon: "⚖️", title: "Legal Matters",    desc: "For compliance or legal questions" },
                  { icon: "🏢", title: "Business Finance", desc: "For GST registration or returns" },
                ].map((item) => (
                  <div key={item.title} className="legal-mini-card">
                    <span className="legal-mini-card-icon">{item.icon}</span>
                    <div>
                      <p className="legal-mini-card-title">{item.title}</p>
                      <p className="legal-mini-card-desc">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </PolicySection>

          </main>
        </div>
      </section>

      <footer>
        <a href="/" className="logo">
          <div className="logo-icon" style={{ width: 22, height: 22, fontSize: 11 }}>⚒</div>
          ForgeCodeHub
        </a>
        <div className="footer-links">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/disclaimer" style={{ color: "var(--accent)" }}>Disclaimer</a>
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