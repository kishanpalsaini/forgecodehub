// lib/word-editor/importUtils.ts
// Supports: .docx, .txt, .html, .pdf, .md, .rtf, .odt, .csv

/* ── DOCX ─────────────────────────────────────────────────────────────────── */
export async function importDOCX(file: File): Promise<string> {
  const mammoth = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();

  const result = await mammoth.convertToHtml(
    { arrayBuffer },
    {
      styleMap: [
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Heading 3'] => h3:fresh",
        "p[style-name='Heading 4'] => h4:fresh",
        "p[style-name='Heading 5'] => h5:fresh",
        "p[style-name='Heading 6'] => h6:fresh",
      ],
    }
  );

  return result.value;
}

/* ── PDF ──────────────────────────────────────────────────────────────────── */
export async function importPDF(file: File): Promise<string> {
  // Dynamically import pdfjs-dist (client-side only)
  const pdfjsLib = await import("pdfjs-dist");

  // Use unpkg which hosts every version of pdfjs-dist.
  // For pdfjs-dist v4+, the worker is an ES module, so we use the .mjs path.
  if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
    const version = pdfjsLib.version;
    const isV4Plus = parseInt(version.split(".")[0], 10) >= 4;
    pdfjsLib.GlobalWorkerOptions.workerSrc = isV4Plus
      ? `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.mjs`
      : `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.js`;
  }

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  const htmlParts: string[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();

    // Group items into lines by their y-position
    const lines: Map<number, string[]> = new Map();

    for (const item of textContent.items) {
      if ("str" in item && item.str) {
        // Round y to the nearest integer to group items on the same line
        const transform = (item as any).transform as number[];
        // transform[5] is the y coordinate in PDF space
        const y = Math.round(transform[5]);

        if (!lines.has(y)) lines.set(y, []);
        lines.get(y)!.push(item.str);
      }
    }

    // Sort lines by y descending (PDF y=0 is at the bottom)
    const sortedYs = Array.from(lines.keys()).sort((a, b) => b - a);

    // Add a page-break comment between pages (except before the first page)
    if (pageNum > 1) {
      htmlParts.push('<hr data-page-break="true" />');
    }

    for (const y of sortedYs) {
      const lineText = lines.get(y)!.join(" ").trim();
      if (!lineText) continue;

      // Simple heuristic: if line is short and appears near the top of a page,
      // treat it as a heading. Otherwise it's a paragraph.
      const isLikelyHeading =
        lineText.length < 80 &&
        (lineText === lineText.toUpperCase() ||
          // Check if the font size is significantly larger (rough heuristic via length)
          lineText.length < 40);

      if (isLikelyHeading && pageNum === 1 && sortedYs.indexOf(y) < 3) {
        htmlParts.push(`<h1>${escapeHtml(lineText)}</h1>`);
      } else {
        htmlParts.push(`<p>${escapeHtml(lineText)}</p>`);
      }
    }
  }

  return htmlParts.join("\n");
}

/* ── Markdown ─────────────────────────────────────────────────────────────── */
export async function importMarkdown(file: File): Promise<string> {
  // Use the 'marked' library if available, otherwise do a basic conversion
  try {
    const { marked } = await import("marked");
    const text = await file.text();
    const result = await marked(text);
    return typeof result === "string" ? result : String(result);
  } catch {
    // Fallback: basic markdown to HTML conversion
    const text = await file.text();
    return basicMarkdownToHtml(text);
  }
}

function basicMarkdownToHtml(md: string): string {
  const lines = md.split("\n");
  const html: string[] = [];
  let inList = false;
  let listTag = "";

  const flushList = () => {
    if (inList) { html.push(`</${listTag}>`); inList = false; listTag = ""; }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Headings
    const hMatch = line.match(/^(#{1,6})\s+(.*)/);
    if (hMatch) {
      flushList();
      const level = hMatch[1].length;
      html.push(`<h${level}>${inlineMarkdown(hMatch[2])}</h${level}>`);
      continue;
    }

    // Horizontal rule
    if (/^[-*_]{3,}$/.test(line.trim())) {
      flushList();
      html.push("<hr />");
      continue;
    }

    // Unordered list
    const ulMatch = line.match(/^[\-\*\+]\s+(.*)/);
    if (ulMatch) {
      if (!inList || listTag !== "ul") { flushList(); html.push("<ul>"); inList = true; listTag = "ul"; }
      html.push(`<li>${inlineMarkdown(ulMatch[1])}</li>`);
      continue;
    }

    // Ordered list
    const olMatch = line.match(/^\d+\.\s+(.*)/);
    if (olMatch) {
      if (!inList || listTag !== "ol") { flushList(); html.push("<ol>"); inList = true; listTag = "ol"; }
      html.push(`<li>${inlineMarkdown(olMatch[1])}</li>`);
      continue;
    }

    // Blockquote
    const bqMatch = line.match(/^>\s*(.*)/);
    if (bqMatch) {
      flushList();
      html.push(`<blockquote><p>${inlineMarkdown(bqMatch[1])}</p></blockquote>`);
      continue;
    }

    // Code block (fenced)
    if (line.startsWith("```")) {
      flushList();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(escapeHtml(lines[i]));
        i++;
      }
      html.push(`<pre><code>${codeLines.join("\n")}</code></pre>`);
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      flushList();
      continue;
    }

    // Regular paragraph
    flushList();
    html.push(`<p>${inlineMarkdown(line)}</p>`);
  }

  flushList();
  return html.join("\n");
}

function inlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/__(.+?)__/g, "<strong>$1</strong>")
    .replace(/_(.+?)_/g, "<em>$1</em>")
    .replace(/~~(.+?)~~/g, "<s>$1</s>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
}

/* ── RTF ──────────────────────────────────────────────────────────────────── */
export async function importRTF(file: File): Promise<string> {
  const text = await file.text();

  // Strip RTF control words and extract plain text
  // This is a simplified RTF stripper — works for most basic RTF files
  let plain = text
    // Remove RTF header and groups
    .replace(/\{\\rtf[^}]*}/g, "")
    // Remove RTF control words with parameters
    .replace(/\\[a-z]+\-?\d*\s?/gi, "")
    // Remove remaining RTF groups
    .replace(/[{}]/g, "")
    // Decode escaped characters
    .replace(/\\'([0-9a-f]{2})/gi, (_m, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/\\\*/g, "")
    .trim();

  // Convert double newlines to paragraphs
  const paragraphs = plain
    .split(/\n{2,}/)
    .map((p) => `<p>${escapeHtml(p.replace(/\n/g, " ").trim())}</p>`)
    .filter((p) => p !== "<p></p>");

  return paragraphs.join("\n");
}

/* ── ODT ──────────────────────────────────────────────────────────────────── */
export async function importODT(file: File): Promise<string> {
  // ODT is a ZIP containing content.xml — use JSZip to extract it
  try {
    const JSZip = (await import("jszip")).default;
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    const contentXml = zip.file("content.xml");
    if (!contentXml) throw new Error("No content.xml in ODT file");

    const xmlText = await contentXml.async("string");
    return odtXmlToHtml(xmlText);
  } catch (err) {
    throw new Error(
      "Could not read ODT file. Make sure jszip is installed: npm install jszip"
    );
  }
}

function odtXmlToHtml(xml: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "application/xml");
  const body = doc.querySelector("body") || doc.querySelector("text");
  if (!body) return "<p>Could not parse ODT content.</p>";

  const html: string[] = [];

  const processNode = (node: Element) => {
    const tag = node.localName;

    if (tag === "h") {
      const level = node.getAttribute("text:outline-level") || "1";
      html.push(`<h${level}>${escapeHtml(node.textContent || "")}</h${level}>`);
    } else if (tag === "p") {
      const text = node.textContent?.trim();
      if (text) html.push(`<p>${escapeHtml(text)}</p>`);
    } else if (tag === "list") {
      html.push("<ul>");
      node.querySelectorAll("list-item").forEach((li) => {
        html.push(`<li>${escapeHtml(li.textContent || "")}</li>`);
      });
      html.push("</ul>");
    } else {
      // Recurse into children
      Array.from(node.children).forEach(processNode);
    }
  };

  Array.from(body.children).forEach(processNode);
  return html.join("\n") || "<p>Empty document.</p>";
}

/* ── CSV ──────────────────────────────────────────────────────────────────── */
export async function importCSV(file: File): Promise<string> {
  const text = await file.text();
  const delimiter = text.includes("\t") ? "\t" : ",";
  const rows = text
    .split("\n")
    .map((line) => parseCSVLine(line, delimiter))
    .filter((row) => row.some((cell) => cell.trim()));

  if (!rows.length) return "<p>Empty CSV file.</p>";

  const [header, ...dataRows] = rows;

  const thCells = header.map((h) => `<th>${escapeHtml(h.trim())}</th>`).join("");
  const bodyRows = dataRows
    .map((row) => {
      const tds = row.map((cell) => `<td>${escapeHtml(cell.trim())}</td>`).join("");
      return `<tr>${tds}</tr>`;
    })
    .join("\n");

  return `<table>
  <thead><tr>${thCells}</tr></thead>
  <tbody>${bodyRows}</tbody>
</table>`;
}

function parseCSVLine(line: string, delimiter: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === delimiter && !inQuotes) {
      cells.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  cells.push(current);
  return cells;
}

/* ── TXT ──────────────────────────────────────────────────────────────────── */
export async function importTXT(file: File): Promise<string> {
  const text = await file.text();
  const paragraphs = text
    .split("\n\n")
    .map((p) => `<p>${escapeHtml(p.replace(/\n/g, "<br>"))}</p>`)
    .join("");
  return paragraphs;
}

/* ── HTML ─────────────────────────────────────────────────────────────────── */
export async function importHTML(file: File): Promise<string> {
  const html = await file.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  return doc.body ? doc.body.innerHTML : html;
}

/* ── Helpers ──────────────────────────────────────────────────────────────── */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}