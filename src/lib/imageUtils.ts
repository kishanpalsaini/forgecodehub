// src/lib/imageUtils.ts
// Shared utilities for all image tools

export type Quality = "low" | "medium" | "high";

export const qualityMap: Record<Quality, number> = {
  low: 0.35,
  medium: 0.70,
  high: 0.92,
};

export const qualityLabels: Record<Quality, string> = {
  low: "Low — smallest file",
  medium: "Medium — balanced",
  high: "High — best quality",
};

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function getSavingPercent(original: number, compressed: number): number {
  return Math.round(((original - compressed) / original) * 100);
}

export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = reject;
    img.src = url;
  });
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => { blob ? resolve(blob) : reject(new Error("Canvas toBlob failed")); },
      mimeType,
      quality
    );
  });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function getFileNameWithoutExt(filename: string): string {
  return filename.replace(/\.[^/.]+$/, "");
}