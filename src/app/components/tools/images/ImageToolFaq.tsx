"use client";
import { useState, useMemo } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type ToolKey = "jpg-png" | "png-jpg" | "to-pdf" | "rotate";

interface FaqEntry { question: string; answer: string; }

// ─── FAQ Data ─────────────────────────────────────────────────────────────────
const TOOL_LABELS: Record<ToolKey, string> = {
  "jpg-png": "JPG → PNG",
  "png-jpg": "PNG → JPG",
  "to-pdf": "Image → PDF",
  "rotate": "Rotate / Flip",
};

const ALL_FAQS: Record<ToolKey, FaqEntry[]> = {
  "jpg-png": [
    { question: "Does converting JPG to PNG lose quality?", answer: "No. PNG is a lossless format. Once you convert a JPG to PNG, no further quality is lost — though the original JPG compression artifacts are baked in permanently." },
    { question: "Why is the PNG file larger than my JPG?", answer: "PNG uses lossless compression while JPG uses lossy compression. A lossless PNG stores every pixel exactly, resulting in a larger file size than the equivalent JPG." },
    { question: "Does PNG support transparency?", answer: "Yes! PNG supports an alpha channel, making it ideal for logos, icons, and overlays on different background colors or images." },
    { question: "Is this conversion done on my device?", answer: "Yes. Everything happens in your browser using the Canvas API. No image is uploaded to any server at any point." },
    { question: "Can I convert WebP to PNG as well?", answer: "Yes. The converter accepts JPG, JPEG, and WebP files and converts them all to lossless PNG format." },
  ],
  "png-jpg": [
    { question: "Will converting PNG to JPG lose quality?", answer: "Some quality loss occurs because JPG uses lossy compression. Using the 'High' quality setting minimises any visible differences from the original." },
    { question: "What happens to transparent areas?", answer: "PNG transparency is replaced with a white background, since JPG does not support alpha channels or transparency." },
    { question: "How much smaller will the JPG be?", answer: "Photographs typically shrink 60–80%. Simple graphics with large flat-colour areas may not compress as much." },
    { question: "Can I convert back to PNG after?", answer: "Yes, but each lossy conversion cycle introduces more compression artefacts. Always start from the original PNG whenever possible." },
    { question: "What quality setting should I use?", answer: "High quality is recommended for photographs you intend to print or display at large sizes. Medium is a good balance for web use. Low is best when file size is the top priority." },
  ],
  "to-pdf": [
    { question: "How many images can I add to one PDF?", answer: "Up to 20 images per PDF. Each image becomes one page in the resulting document." },
    { question: "What page sizes are supported?", answer: "A4 (international standard), US Letter (American standard), and A3 (large format) are all supported in both portrait and landscape orientation." },
    { question: "Are my images uploaded to a server?", answer: "No. The PDF is generated entirely in your browser using the jsPDF library. Nothing leaves your device." },
    { question: "What image formats are accepted?", answer: "JPG, PNG, and WebP files are all accepted. You can mix different formats in the same PDF without any issues." },
    { question: "Can I reorder the images?", answer: "Yes. Use the up and down arrows next to each image in the list to change the order before generating your PDF." },
  ],
  "rotate": [
    { question: "What image formats can I rotate?", answer: "Any common image format is supported: JPG, PNG, WebP, GIF, and more. The tool accepts any file that your browser can decode." },
    { question: "Can I rotate by any angle, not just 90°?", answer: "Yes. The free-rotate slider lets you pick any angle from 0° to 359° in one-degree increments." },
    { question: "What is the difference between flip and rotate?", answer: "Rotate turns the image around its centre point. Flip mirrors it — a horizontal flip creates a mirror image, a vertical flip turns it upside down." },
    { question: "Which output format should I choose?", answer: "Choose PNG if the original image had transparency or you need a lossless output. Choose JPG for smaller file sizes, especially with photographs." },
    { question: "Does rotating degrade image quality?", answer: "For 90° and 180° rotations, quality loss is minimal. For free-rotation at non-right-angle values, slight softening may occur at pixel boundaries — this is inherent to all rotation algorithms." },
  ],
};

const TOOL_KEYS = Object.keys(TOOL_LABELS) as ToolKey[];

// ─── Sub-components ───────────────────────────────────────────────────────────
function FaqCard({ question, answer, query }: FaqEntry & { query: string }) {
  const [open, setOpen] = useState(false);

  // Highlight matching text
  const highlight = (text: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase()
        ? <mark key={i} style={{ background: "#fef08a", borderRadius: 3, padding: "0 2px" }}>{part}</mark>
        : part
    );
  };

  return (
    <div 
      style={{ 
        background: "#fff", 
        border: "1px solid #e2e8f0", 
        borderRadius: 12, 
        padding: "20px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        transition: "all 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{ 
          background: "none", 
          border: "none", 
          cursor: "pointer", 
          width: "100%", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "flex-start", 
          padding: 0, 
          fontSize: 15, 
          fontWeight: 600, 
          color: "#1e293b", 
          textAlign: "left", 
          gap: 12,
          marginBottom: open ? 12 : 0,
        }}
      >
        <span style={{ flex: 1, lineHeight: 1.5 }}>{highlight(question)}</span>
        <span 
          style={{ 
            fontSize: 11, 
            color: "#94a3b8", 
            flexShrink: 0, 
            transform: open ? "rotate(180deg)" : "none", 
            transition: "transform 0.2s",
            marginTop: 4,
          }}
        >
          ▼
        </span>
      </button>
      {open && (
        <p 
          style={{ 
            margin: 0, 
            fontSize: 13, 
            color: "#475569", 
            lineHeight: 1.7,
            animation: "fadeIn 0.2s ease-in",
          }}
        >
          {highlight(answer)}
        </p>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ToolsFaq() {
  const [selectedTool, setSelectedTool] = useState<ToolKey | "all">("all");
  const [search, setSearch] = useState("");

  const faqs = useMemo(() => {
    const source: (FaqEntry & { tool: ToolKey })[] = [];
    const keys = selectedTool === "all" ? TOOL_KEYS : [selectedTool];
    for (const key of keys) {
      ALL_FAQS[key].forEach(faq => source.push({ ...faq, tool: key }));
    }
    if (!search.trim()) return source;
    const q = search.toLowerCase();
    return source.filter(f => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q));
  }, [selectedTool, search]);

  const groupedFaqs = useMemo(() => {
    if (selectedTool !== "all") return { [selectedTool]: faqs };
    const groups: Record<string, (FaqEntry & { tool: ToolKey })[]> = {};
    for (const faq of faqs) {
      if (!groups[faq.tool]) groups[faq.tool] = [];
      groups[faq.tool].push(faq);
    }
    return groups;
  }, [faqs, selectedTool]);

  return (
    <div style={{ margin: "0 auto", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#1e293b", width: "100%", padding: "40px 20px" }}>
      {/* Add keyframe animation for fade-in */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: "0 0 6px" ,color:"rgb(255, 255, 255)"}}>Help & FAQ</h1>
        <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>Find answers to common questions about our image tools</p>
      </div>

      {/* Controls */}
      <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 20,margin: "0 auto 24px", marginBottom: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.05)", width: "50%" }}>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "flex-end" }}>
          {/* Tool Selector */}
          <div style={{ flex: "0 0 auto", minWidth: 200 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
              Filter by Tool
            </label>
            <select
              value={selectedTool}
              onChange={e => setSelectedTool(e.target.value as ToolKey | "all")}
              style={{ width: "100%", padding: "9px 12px", borderRadius: 9, border: "1px solid #e2e8f0", fontSize: 14, color: "#1e293b", background: "#fafbff", cursor: "pointer" }}
            >
              <option value="all">All Tools</option>
              {TOOL_KEYS.map(k => <option key={k} value={k}>{TOOL_LABELS[k]}</option>)}
            </select>
          </div>

          {/* Search Bar */}
          <div style={{ flex: 1, minWidth: 200 }}>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
              Search Questions
            </label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", fontSize: 16, color: "#94a3b8" }}>🔍</span>
              <input
                type="text"
                placeholder="Search questions and answers…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: "100%", padding: "9px 12px 9px 34px", borderRadius: 9, border: "1px solid #e2e8f0", fontSize: 14, color: "#1e293b", background: "#fafbff", boxSizing: "border-box", outline: "none" }}
              />
              {search && (
                <button onClick={() => setSearch("")}
                  style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 16, padding: 0, lineHeight: 1 }}>
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results count */}
        <p style={{ margin: "14px 0 0", fontSize: 13, color: "#94a3b8" }}>
          {faqs.length} question{faqs.length !== 1 ? "s" : ""} found
          {search && <> for "<strong style={{ color: "#475569" }}>{search}</strong>"</>}
          {selectedTool !== "all" && <> in <strong style={{ color: "#6366f1" }}>{TOOL_LABELS[selectedTool]}</strong></>}
        </p>
      </div>

      {/* FAQ Results */}
      <div   style={{
    display: "grid",
    gridTemplateColumns: window.innerWidth < 768 ? "1fr" : "1fr 1fr",
    gap: "16px",
    width: "100%",
  }}>
    {faqs.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 40, textAlign: "center", color: "#94a3b8" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🤔</div>
          <p style={{ margin: 0, fontSize: 15 }}>No questions found matching your search.</p>
          <p style={{ margin: "6px 0 0", fontSize: 13 }}>Try different keywords or select a different tool.</p>
        </div>
      ) : (
        Object.entries(groupedFaqs).map(([toolKey, toolFaqs]) => (
          <div key={toolKey} style={{ marginBottom: 32 }}>
            {selectedTool === "all" && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <span style={{ background: "#eef2ff", color: "#4338ca", fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20 }}>
                  {TOOL_LABELS[toolKey as ToolKey]}
                </span>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{toolFaqs.length} question{toolFaqs.length !== 1 ? "s" : ""}</span>
              </div>
            )}
            
            {/* 3-Column Grid Layout - Responsive */}
            <div 
              style={{ 
                display: "grid",
                gap: 16,
                background:"#000",
                padding: 16,
                borderRadius: 12,
              }}
            >
              {toolFaqs.map((faq, i) => (
                <FaqCard key={i} question={faq.question} answer={faq.answer} query={search} />
              ))}
            </div>
          </div>
        ))
      )}
      </div>
  
    </div>
  );
}