// utils.ts
import { ConvertTo, ConvertFrom } from "./types";
import { TO_OPTIONS, SUPPORTS_TRANSPARENCY, LOSSY_FORMATS } from "./constants";

export function formatBytes(b: number): string {
  if (b < 1024) return b + " B";
  if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
  return (b / 1048576).toFixed(1) + " MB";
}

export function getFileNameWithoutExt(name: string): string {
  return name.replace(/\.[^/.]+$/, "");
}

export function getSavingPercent(orig: number, out: number): number {
  return Math.max(0, Math.round((1 - out / orig) * 100));
}

export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    
    // Handle SVG files
    if (file.type === "image/svg+xml") {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    } else {
      img.src = url;
    }
  });
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  mime: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
      mime,
      quality
    );
  });
}

export async function canvasToSvgBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  const dataUrl = canvas.toDataURL("image/png");
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
     width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}">
  <image width="${canvas.width}" height="${canvas.height}" xlink:href="${dataUrl}"/>
</svg>`;
  
  return new Blob([svgContent], { type: "image/svg+xml" });
}

export function downloadBlob(blob: Blob, name: string): void {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
}

export function getMimeType(format: ConvertTo): string {
  const option = TO_OPTIONS.find((o) => o.value === format);
  return option?.mime || "image/png";
}

export function supportsTransparency(format: string): boolean {
  return SUPPORTS_TRANSPARENCY.includes(format);
}

export function isLossyFormat(format: string): boolean {
  return LOSSY_FORMATS.includes(format);
}

export function getFaqKey(to: ConvertTo): string {
  if (to === "png") return "to-png";
  if (to === "jpg") return "to-jpg";
  if (to === "webp") return "to-webp";
  if (to === "avif") return "to-avif";
  if (to === "gif") return "to-gif";
  if (to === "bmp") return "to-bmp";
  if (to === "tiff") return "to-tiff";
  if (to === "ico") return "to-ico";
  if (to === "svg") return "to-svg";
  if (to === "pdf") return "to-pdf";
  return "rotate";
}

export function getFileExtension(format: ConvertTo): string {
  if (format === "jpg") return "jpg";
  return format;
}