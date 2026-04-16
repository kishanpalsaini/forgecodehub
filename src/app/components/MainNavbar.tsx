"use client";

import { useState, useEffect } from "react";
import "../globals.css";

export default function MainNavbar() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile nav is open
  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileNavOpen]);

  const navLinks = [
    { label: "Tools", href: "#tools" },
    { label: "How It Works", href: "#how" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      <nav id="navbar" className={scrolled ? "scrolled" : ""}>
        <a href="/" className="logo">
          <div className="logo-icon">⚒</div>
          ForgeCodeHub
        </a>

        <ul className="nav-links">
          {navLinks.map(({ label, href }) => (
            <li key={label}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>


        <button
          className={`hamburger ${mobileNavOpen ? "active" : ""}`}
          style={{
    background: mobileNavOpen ? "rgba(249,115,22,0.15)" : "transparent",
    borderColor: mobileNavOpen ? "#f97316" : "rgba(255,255,255,0.08)",
    transform: mobileNavOpen ? "rotate(90deg)" : "rotate(0deg)",
    transition: "all 0.25s ease",
  }}
          onClick={() => setMobileNavOpen(true)}
          aria-label="Open menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {/* Overlay */}
      <div
        className={`mobile-overlay ${mobileNavOpen ? "open" : ""}`}
        onClick={() => setMobileNavOpen(false)}
      />

      {/* Mobile Nav Drawer */}
      <div className={`mobile-nav ${mobileNavOpen ? "open" : ""}`}>
        <div className="mobile-nav-header">
          <a href="/" className="logo" onClick={() => setMobileNavOpen(false)}>
            <div className="logo-icon">⚒</div>
            ForgeCodeHub
          </a>
          <button
            className="mobile-nav-close"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>

        <ul className="mobile-nav-links">
          {navLinks.map(({ label, href }) => (
            <li key={label}>
              <a href={href} onClick={() => setMobileNavOpen(false)}>
                {label}
              </a>
            </li>
          ))}
        </ul>

     
      </div>
    </>
  );
}