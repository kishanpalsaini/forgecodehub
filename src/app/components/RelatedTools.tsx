// src/components/RelatedTools.tsx
// NO "use client" — this renders as real HTML for Google

import Link from "next/link";
import { tools } from "../tool-list";

export default function RelatedTools({
  currentPath,
  category,
  // limit = 6,
}: {
  currentPath: string;
  category: string;
  limit?: number;
}) {
  const related = tools
    .filter((t) => t.cat === category && t.path !== currentPath)
    // .slice(0, limit);

  return (
    <section style={{ marginTop: "4rem", padding: "0 0 4rem" }}>

      {/* Section header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <div className="section-label">More tools</div>
          <h2 className="section-title" style={{ marginBottom: 0 }}>
            Related Tools
          </h2>
        </div>

        {/* View all button — links to main tools page */}
        <Link
          href="/#tools"
          className="btn-secondary"
          style={{ whiteSpace: "nowrap", fontSize: "0.875rem" }}
        >
          View all tools →
        </Link>
      </div>

      {/* Scrollable card strip */}
      <div style={{
        display: "flex",
        gap: "1rem",
        overflowX: "auto",
        paddingBottom: "0.5rem",
        scrollbarWidth: "none",   // hide scrollbar Firefox
      }}>
        {related.map((tool) => (
          <Link
            key={tool.path}
            href={tool.href}
            className="tool-card visible"
            style={{ minWidth: "240px", maxWidth: "260px", flexShrink: 0 }}
          >
            <div className="tool-card-header">
              <div className="tool-icon">{tool.icon}</div>
              <span className={`tool-tag tag-live`}>Live</span>
            </div>
            <div className="tool-name">{tool.name}</div>
            <div className="tool-desc">{tool.desc}</div>
            <div className="tool-footer">
              <span className="tool-path">{tool.path}</span>
              <div className="tool-arrow">↗</div>
            </div>
          </Link>
        ))}
      </div>

    </section>
  );
}