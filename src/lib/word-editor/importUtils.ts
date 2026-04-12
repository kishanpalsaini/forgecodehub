import mammoth from "mammoth";

// Import DOCX file
export async function importDOCX(file: File): Promise<string> {
  const mammoth = await import("mammoth");  // ← dynamic import, client-only
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

// Import TXT file
export async function importTXT(file: File): Promise<string> {
  const text = await file.text();
  // Convert plain text to HTML paragraphs
  const paragraphs = text
    .split("\n\n")
    .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
    .join("");
  return paragraphs;
}

// Import HTML file
export async function importHTML(file: File): Promise<string> {
  const html = await file.text();
  
  // Extract body content if it's a full HTML document
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  
  if (doc.body) {
    return doc.body.innerHTML;
  }
  
  return html;
}