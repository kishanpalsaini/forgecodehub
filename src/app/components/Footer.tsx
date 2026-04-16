"use client";
import "./footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const legalLinks = [
    { label: "Privacy",    href: "/privacy"    },
    { label: "Terms",      href: "/terms"      },
    { label: "Disclaimer", href: "/disclaimer" },
      { label: "GitHub",  href: "https://github.com/forgecodehub"  },
    { label: "Twitter", href: "https://twitter.com/forgecodehub" },
  ];

//   const socialLinks = [
//     { label: "GitHub",  href: "https://github.com/forgecodehub"  },
//     { label: "Twitter", href: "https://twitter.com/forgecodehub" },
//   ];

  return (
    <div className="footer">
      <div className="footer-bottom">

        {/* Left — logo */}
        <a href="/" className="footer-logo-link">
          <span className="footer-logo-icon">⚒</span>
          ForgeCodeHub
        </a>

        {/* Center — legal links */}
        <div className="footer-legal">
          {legalLinks.map(({ label, href }) => (
            <a key={label} href={href}>{label}</a>
          ))}
        </div>

        {/* Right — social links */}
        <div className="footer-social">
          
          <span style={{ fontFamily: "Syne, sans-serif", color: "rgba(255,255,255,0.25)" }}>
            © 2025 ForgeCodeHub
          </span>
        </div>

      </div>
    </div>
  );
}