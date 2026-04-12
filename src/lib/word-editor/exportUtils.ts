import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  Table, TableRow, TableCell, WidthType, BorderStyle,
} from "docx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { MarginSettings } from "@/app/components/tools/word-editor/Toolbar";

/* ── Page dimension maps ────────────────────────────────────────────────── */
const PAGE_DIMS_MM: Record<string, [number, number]> = {
  a4:     [210,   297  ],
  letter: [215.9, 279.4],
  legal:  [215.9, 355.6],
};
const MM_TO_PX_96 = 3.7795275591; // 1 mm in px @ 96 dpi

/* ── Build CSS that exactly mirrors the editor's page layout ───────────── */
function buildExportCSS(margins?: MarginSettings): string {
  const mt = margins ? `${margins.top}${margins.unit}`    : "25.4mm";
  const mr = margins ? `${margins.right}${margins.unit}`  : "25.4mm";
  const mb = margins ? `${margins.bottom}${margins.unit}` : "25.4mm";
  const ml = margins ? `${margins.left}${margins.unit}`   : "25.4mm";

  return `
    /* Reset */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /*
     * body padding = page margins.
     * This EXACTLY mirrors what the editor renders:
     * editor page has padding = mmToPx(margin) on each side.
     * We use mm units here so they translate identically.
     */
    body {
      font-family: Calibri, Arial, sans-serif;
      font-size: 12pt;
      line-height: 1.6;
      color: #000000;
      background: #ffffff;
      padding: ${mt} ${mr} ${mb} ${ml};
      /* Prevent content from exceeding page width */
      word-break: break-word;
      overflow-wrap: break-word;
      hyphens: auto;
    }

    p  { margin: 0 0 0.7em 0; color: inherit; orphans: 2; widows: 2; }
    h1 { font-size: 2em;    font-weight: 700; margin: 0.8em 0 0.4em;  line-height: 1.2;  color: inherit; }
    h2 { font-size: 1.5em;  font-weight: 600; margin: 0.75em 0 0.35em; line-height: 1.3; color: inherit; }
    h3 { font-size: 1.25em; font-weight: 600; margin: 0.65em 0 0.3em;  color: inherit; }
    h4, h5, h6 { font-size: 1em; font-weight: 600; margin: 0.6em 0 0.25em; color: inherit; }

    ul, ol { padding-left: 1.5em; margin: 0.5em 0; }
    li { margin: 0.2em 0; }
    strong, b { font-weight: 700; }
    em, i { font-style: italic; }
    u { text-decoration: underline; }
    s, strike { text-decoration: line-through; }
    a { color: #2563eb; text-decoration: underline; }

    blockquote {
      border-left: 3px solid #5b9bd5;
      padding-left: 1em;
      margin: 1em 0;
      font-style: italic;
      color: #555;
    }

    code {
      background: #f1f5f9;
      padding: 0.15em 0.35em;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 0.9em;
    }

    pre {
      background: #1e293b;
      color: #e2e8f0;
      padding: 1em;
      border-radius: 6px;
      font-family: 'Courier New', monospace;
      margin: 1em 0;
      white-space: pre-wrap;
      word-break: break-all;
    }

    hr { border: none; border-top: 1px solid #cbd5e1; margin: 1.25em 0; }

    /* Tables — keep same layout as editor */
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
      table-layout: fixed;
      word-break: break-word;
    }
    table + table { margin-top: 1.5em; }

    th, td {
      border: 1px solid #cbd5e1;
      padding: 6px 10px;
      vertical-align: top;
      text-align: left;
      color: inherit;
      /* Prevent text overflow breaking table layout */
      overflow-wrap: break-word;
      word-break: break-word;
    }
    th { background: #f1f5f9; font-weight: 700; }

    /* Images */
    img { max-width: 100%; height: auto; display: block; margin: 0.5em 0; border-radius: 4px; }

    /* Highlighted text */
    mark { border-radius: 2px; padding: 0 2px; }

    /* Audio/Video — just show a placeholder in export */
    audio, video { display: none; }

    /* Task list */
    ul[data-type="taskList"] { list-style: none; padding-left: 0; }
    ul[data-type="taskList"] li { display: flex; align-items: flex-start; gap: 0.5em; }

    /* Page break avoidance — prevent lines from being cut */
    p, li, td, th, blockquote, pre, img {
      page-break-inside: avoid;
      break-inside: avoid;
    }
    h1, h2, h3, h4, h5, h6 {
      page-break-after: avoid;
      break-after: avoid;
    }
    table { page-break-inside: auto; }
    tr { page-break-inside: avoid; break-inside: avoid; }

    @page { margin: 0; size: auto; }
  `;
}

/* ── Clean Tiptap HTML before export ───────────────────────────────────── */
function prepareHtml(rawHtml: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, "text/html");

  /* Remove Tiptap editor-only attributes */
  doc.querySelectorAll("[contenteditable]").forEach(el => el.removeAttribute("contenteditable"));
  doc.querySelectorAll("[draggable]").forEach(el => el.removeAttribute("draggable"));
  /* Remove resize handles */
  doc.querySelectorAll(".col-resizer,.table-resizer-wrap,.column-resize-handle").forEach(el => el.remove());
  /* Remove data-pm-* attrs */
  doc.querySelectorAll("[data-pm-slice]").forEach(el => el.removeAttribute("data-pm-slice"));

  /* Preserve column widths */
  doc.querySelectorAll("table").forEach(table => {
    const cells = table.querySelectorAll("tr:first-child td, tr:first-child th");
    if (!cells.length || table.querySelector("colgroup")) return;
    const cg = doc.createElement("colgroup");
    cells.forEach(c => {
      const col = doc.createElement("col");
      const w = (c as HTMLElement).style.width;
      if (w) col.style.width = w;
      cg.appendChild(col);
    });
    table.prepend(cg);
  });

  return doc.body.innerHTML;
}

/* ── PDF Export ──────────────────────────────────────────────────────────── */
export async function exportToPDF(
  htmlContent: string,
  fileName: string,
  margins?: MarginSettings,
  pageSize: "a4" | "letter" | "legal" = "a4",
  orientation: "portrait" | "landscape" = "portrait",
) {
  const [pw, ph] = PAGE_DIMS_MM[pageSize] ?? PAGE_DIMS_MM.a4;
  const [PAGE_W_MM, PAGE_H_MM] = orientation === "landscape" ? [ph, pw] : [pw, ph];
  const SCALE = 2; /* retina quality */

  /*
   * KEY FIX: The container must be exactly PAGE_W_MM wide — same as the
   * editor's page width. The CSS padding matches the editor's padding exactly.
   * This guarantees identical text wrapping between editor and PDF.
   */
  const safeHtml = prepareHtml(htmlContent);

  const container = document.createElement("div");
  Object.assign(container.style, {
    position:  "absolute",
    left:      "-99999px",
    top:       "0",
    width:     `${PAGE_W_MM}mm`,  /* exact page width — critical for text wrap matching */
    background: "white",
    color:     "#000000",
  });
  container.innerHTML = `<style>${buildExportCSS(margins)}</style>${safeHtml}`;
  document.body.appendChild(container);

  try {
    /* Wait for fonts and images to load */
    await new Promise(r => setTimeout(r, 200));

    const fullCanvas = await html2canvas(container, {
      scale:           SCALE,
      useCORS:         true,
      allowTaint:      true,
      logging:         false,
      backgroundColor: "#ffffff",
      windowWidth:     container.scrollWidth,
      windowHeight:    container.scrollHeight,
    });

    /*
     * pxPerMm: how many canvas pixels = 1 mm.
     * fullCanvas.width / SCALE = container's CSS pixel width = PAGE_W_MM mm
     * So: pxPerMm = (fullCanvas.width / SCALE) / PAGE_W_MM
     */
    const pxPerMm     = (fullCanvas.width / SCALE) / PAGE_W_MM;
    const pageHcanvas = PAGE_H_MM * pxPerMm * SCALE; /* canvas px per page height */

    const pdf        = new jsPDF({ orientation, unit: "mm", format: pageSize });
    const totalPages = Math.ceil(fullCanvas.height / pageHcanvas);

    for (let p = 0; p < totalPages; p++) {
      if (p > 0) pdf.addPage(pageSize, orientation);

      const srcY = p * pageHcanvas;
      const srcH = Math.min(pageHcanvas, fullCanvas.height - srcY);

      /* Create a canvas exactly one page tall */
      const pc = document.createElement("canvas");
      pc.width  = fullCanvas.width;
      pc.height = pageHcanvas;

      const ctx = pc.getContext("2d")!;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, pc.width, pc.height);
      /* Draw the slice — y=0, no extra margin offset (margin is baked into CSS padding) */
      ctx.drawImage(fullCanvas, 0, srcY, fullCanvas.width, srcH, 0, 0, fullCanvas.width, srcH);

      /* Place into PDF at full page size — no extra PDF margins */
      pdf.addImage(pc.toDataURL("image/png"), "PNG", 0, 0, PAGE_W_MM, PAGE_H_MM);
    }

    pdf.save(`${fileName}.pdf`);
  } finally {
    document.body.removeChild(container);
  }
}

/* ── DOCX Export ─────────────────────────────────────────────────────────── */
export async function exportToDOCX(
  htmlContent: string,
  fileName: string,
  margins?: MarginSettings,
) {
  const MM_TO_TWIP = 56.6929;
  const m = margins ?? { top: 25.4, right: 25.4, bottom: 25.4, left: 25.4, unit: "mm", applyTo: "all" };

  const safeHtml = prepareHtml(htmlContent);
  const parser   = new DOMParser();
  const doc      = parser.parseFromString(safeHtml, "text/html");
  const children: (Paragraph | Table)[] = [];

  const parseRuns = (el: HTMLElement): TextRun[] => {
    const runs: TextRun[] = [];
    el.childNodes.forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        const t = child.textContent || "";
        if (t) runs.push(new TextRun(t));
        return;
      }
      if (child.nodeType !== Node.ELEMENT_NODE) return;
      const c   = child as HTMLElement;
      const tag = c.tagName.toLowerCase();
      const txt = c.textContent || "";
      const color = hexFromColor(c.style.color);
      const bold  = ["strong", "b"].includes(tag) || Number(c.style.fontWeight) >= 700;
      if (["strong","b","em","i","u","s","strike","span","a","code","mark"].includes(tag)) {
        runs.push(new TextRun({
          text:      txt,
          bold:      bold || undefined,
          italics:   ["em","i"].includes(tag) || undefined,
          underline: tag === "u" ? {} : undefined,
          strike:    ["s","strike"].includes(tag) || undefined,
          color,
        }));
      } else {
        runs.push(...parseRuns(c));
      }
    });
    return runs;
  };

  const hmap: Record<string, (typeof HeadingLevel)[keyof typeof HeadingLevel]> = {
    h1: HeadingLevel.HEADING_1, h2: HeadingLevel.HEADING_2,
    h3: HeadingLevel.HEADING_3, h4: HeadingLevel.HEADING_4,
    h5: HeadingLevel.HEADING_5, h6: HeadingLevel.HEADING_6,
  };

  const processNode = (node: Node): (Paragraph | Table)[] => {
    if (node.nodeType !== Node.ELEMENT_NODE) return [];
    const el  = node as HTMLElement;
    const tag = el.tagName.toLowerCase();
    const out: (Paragraph | Table)[] = [];

    if (hmap[tag]) {
      out.push(new Paragraph({ text: el.textContent?.trim() || "", heading: hmap[tag] }));
    } else if (tag === "p") {
      const runs = parseRuns(el);
      out.push(new Paragraph({ children: runs.length ? runs : [new TextRun(el.textContent || "")] }));
    } else if (tag === "li") {
      out.push(new Paragraph({ text: el.textContent?.trim() || "", bullet: { level: 0 } }));
    } else if (tag === "blockquote") {
      out.push(new Paragraph({
        children: [new TextRun({ text: el.textContent?.trim() || "", italics: true, color: "555555" })],
        indent: { left: 720 },
      }));
    } else if (tag === "hr") {
      out.push(new Paragraph({
        children: [],
        border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "CBD5E1" } },
      }));
    } else if (tag === "table") {
      const trows: TableRow[] = [];
      el.querySelectorAll("tr").forEach(tr => {
        const cells: TableCell[] = [];
        tr.querySelectorAll("td,th").forEach(c => {
          cells.push(new TableCell({
            children: [new Paragraph({ children: parseRuns(c as HTMLElement) })],
            shading: c.tagName.toLowerCase() === "th" ? { fill: "F1F5F9" } : undefined,
          }));
        });
        if (cells.length) trows.push(new TableRow({ children: cells }));
      });
      if (trows.length) {
        out.push(new Table({ rows: trows, width: { size: 100, type: WidthType.PERCENTAGE } }));
        out.push(new Paragraph({ children: [] })); /* spacing after table */
      }
    } else {
      el.childNodes.forEach(c => out.push(...processNode(c)));
    }
    return out;
  };

  doc.body.childNodes.forEach(n => children.push(...processNode(n)));

  const document = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top:    Math.round(m.top    * MM_TO_TWIP),
            right:  Math.round(m.right  * MM_TO_TWIP),
            bottom: Math.round(m.bottom * MM_TO_TWIP),
            left:   Math.round(m.left   * MM_TO_TWIP),
          },
        },
      },
      children: children.length ? children : [new Paragraph("Empty document")],
    }],
  });

  saveAs(await Packer.toBlob(document), `${fileName}.docx`);
}

/* ── TXT Export ──────────────────────────────────────────────────────────── */
export function exportToTXT(htmlContent: string, fileName: string) {
  const safeHtml = prepareHtml(htmlContent);
  const doc = new DOMParser().parseFromString(safeHtml, "text/html");

  const extract = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent || "";
    if (node.nodeType !== Node.ELEMENT_NODE) return "";
    const el   = node as HTMLElement;
    const tag  = el.tagName.toLowerCase();
    const inner = Array.from(el.childNodes).map(extract).join("");
    switch (tag) {
      case "h1": return `\n${"═".repeat(60)}\n${inner.trim()}\n${"═".repeat(60)}\n\n`;
      case "h2": return `\n${"─".repeat(40)}\n${inner.trim()}\n${"─".repeat(40)}\n\n`;
      case "h3": return `\n${inner.trim()}\n${"~".repeat(inner.trim().length)}\n\n`;
      case "h4": case "h5": case "h6": return `\n${inner.trim()}\n\n`;
      case "p":  return `${inner.trim()}\n\n`;
      case "li": return `  • ${inner.trim()}\n`;
      case "ul": case "ol": return `${inner}\n`;
      case "br": return "\n";
      case "hr": return `${"─".repeat(40)}\n\n`;
      case "blockquote": return `"${inner.trim()}"\n\n`;
      case "table": {
        let t = "\n";
        el.querySelectorAll("tr").forEach(r => {
          t += Array.from(r.querySelectorAll("td,th"))
            .map(c => (c.textContent || "").trim().padEnd(20))
            .join(" │ ") + "\n";
        });
        return t + "\n";
      }
      default: return inner;
    }
  };

  const text = extract(doc.body).replace(/\n{3,}/g, "\n\n").trim();
  saveAs(new Blob([text], { type: "text/plain;charset=utf-8" }), `${fileName}.txt`);
}

/* ── HTML Export ─────────────────────────────────────────────────────────── */
export function exportToHTML(
  htmlContent: string,
  fileName: string,
  margins?: MarginSettings,
) {
  const safeHtml = prepareHtml(htmlContent);
  const full = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${fileName}</title>
  <style>${buildExportCSS(margins)}</style>
</head>
<body>${safeHtml}</body>
</html>`;
  saveAs(new Blob([full], { type: "text/html;charset=utf-8" }), `${fileName}.html`);
}

/* ── Markdown Export ─────────────────────────────────────────────────────── */
export function exportToMarkdown(htmlContent: string, fileName: string) {
  const safeHtml = prepareHtml(htmlContent);
  const doc = new DOMParser().parseFromString(safeHtml, "text/html");

  const proc = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent || "";
    if (node.nodeType !== Node.ELEMENT_NODE) return "";
    const el  = node as HTMLElement;
    const tag = el.tagName.toLowerCase();
    const ch  = Array.from(el.childNodes).map(proc).join("");
    switch (tag) {
      case "h1": return `# ${ch.trim()}\n\n`;
      case "h2": return `## ${ch.trim()}\n\n`;
      case "h3": return `### ${ch.trim()}\n\n`;
      case "h4": return `#### ${ch.trim()}\n\n`;
      case "h5": return `##### ${ch.trim()}\n\n`;
      case "h6": return `###### ${ch.trim()}\n\n`;
      case "p":  return `${ch.trim()}\n\n`;
      case "strong": case "b": return `**${ch}**`;
      case "em":     case "i": return `*${ch}*`;
      case "u":      return `<u>${ch}</u>`;
      case "s": case "strike": return `~~${ch}~~`;
      case "a":  return `[${ch}](${el.getAttribute("href") || "#"})`;
      case "ul": return `${ch}\n`;
      case "ol": {
        let i = 1;
        return Array.from(el.querySelectorAll(":scope > li"))
          .map(li => `${i++}. ${li.textContent?.trim()}`)
          .join("\n") + "\n\n";
      }
      case "li":  return `- ${ch.trim()}\n`;
      case "code": return `\`${ch}\``;
      case "pre":  return `\`\`\`\n${el.textContent}\n\`\`\`\n\n`;
      case "blockquote": return `> ${ch.trim()}\n\n`;
      case "hr":  return `---\n\n`;
      case "br":  return `\n`;
      case "table": {
        const rows = Array.from(el.querySelectorAll("tr"));
        if (!rows.length) return "";
        const toRow = (r: Element) =>
          "| " + Array.from(r.querySelectorAll("td,th"))
            .map(c => (c.textContent || "").trim().replace(/\|/g, "\\|"))
            .join(" | ") + " |";
        const hdr = toRow(rows[0]);
        const sep = hdr.replace(/[^|]/g, "-").replace(/--/g, "---");
        return `\n${hdr}\n${sep}\n${rows.slice(1).map(toRow).join("\n")}\n\n`;
      }
      default: return ch;
    }
  };

  let md = "";
  doc.body.childNodes.forEach(n => { md += proc(n); });
  md = md.replace(/\n{3,}/g, "\n\n").trim();
  saveAs(new Blob([md], { type: "text/markdown;charset=utf-8" }), `${fileName}.md`);
}

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function hexFromColor(color: string): string | undefined {
  if (!color) return undefined;
  if (color.startsWith("#")) return color.replace("#", "").padStart(6, "0");
  const m = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (m) return [m[1], m[2], m[3]].map(n => parseInt(n).toString(16).padStart(2, "0")).join("");
  return undefined;
}