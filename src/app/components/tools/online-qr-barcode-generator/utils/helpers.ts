import type { BarcodeFormat } from "@/app/types/qrcode";

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function toIntOr(prev: number, raw: string, min: number, max: number) {
  if (raw.trim() === "") return prev;
  const n = Number(raw);
  if (!Number.isFinite(n)) return prev;
  return clamp(Math.round(n), min, max);
}

export async function compressImage(
  file: File,
  maxSizeKB: number = 150,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        const maxDimension = 800;
        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        let quality = 0.8;
        let result = canvas.toDataURL("image/jpeg", quality);

        while (new Blob([result]).size > maxSizeKB * 1024 && quality > 0.1) {
          quality -= 0.1;
          result = canvas.toDataURL("image/jpeg", quality);
        }

        resolve(result);
      };

      img.onerror = reject;
      img.src = e.target?.result as string;
    };

    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function getOptimalErrorCorrection(dataSize: number): "L" | "M" | "Q" | "H" {
  const sizeKB = dataSize / 1024;

  if (sizeKB < 0.5) return "H";
  if (sizeKB < 1) return "Q";
  if (sizeKB < 2) return "M";
  return "L";
}

export function getBarcodePlaceholder(format: BarcodeFormat): string {
  switch (format) {
    case "EAN13":
      return "1234567890123";
    case "EAN8":
      return "12345678";
    case "UPC":
      return "123456789012";
    case "UPCE":
      return "12345678";
    case "ITF14":
      return "12345678901234";
    case "ITF":
      return "1234567890";
    case "CODE128C":
      return "123456";
    case "pharmacode":
      return "1234";
    case "MSI":
    case "MSI10":
    case "MSI11":
    case "MSI1010":
    case "MSI1110":
      return "1234567890";
    default:
      return "Enter data...";
  }
}

export function getBarcodeHint(format: BarcodeFormat): string {
  switch (format) {
    case "EAN13":
      return "Enter exactly 12 or 13 digits";
    case "EAN8":
      return "Enter exactly 7 or 8 digits";
    case "EAN5":
      return "Enter exactly 5 digits";
    case "EAN2":
      return "Enter exactly 2 digits";
    case "UPC":
      return "Enter exactly 11 or 12 digits";
    case "UPCE":
      return "Enter 6, 7, or 8 digits";
    case "ITF14":
      return "Enter exactly 14 digits";
    case "ITF":
      return "Enter even number of digits";
    case "CODE128":
      return "Supports letters, numbers, and special characters";
    case "CODE128A":
      return "Uppercase letters, numbers, and control characters";
    case "CODE128B":
      return "Uppercase and lowercase letters, numbers";
    case "CODE128C":
      return "Enter even number of digits (numeric only)";
    case "CODE39":
      return "Letters, numbers, and special characters";
    case "MSI":
    case "MSI10":
    case "MSI11":
    case "MSI1010":
    case "MSI1110":
      return "Numeric only";
    case "pharmacode":
      return "Numbers from 3 to 131070";
    case "codabar":
      return "Numbers and special characters (-, $, :, /, ., +)";
    default:
      return "Enter valid barcode data";
  }
}