// constants.ts
import { Quality, PageSize, FormatOption, FAQ, ConvertFrom, ConvertTo } from "./types";

export const qualityMap: Record<Quality, number> = {
  low: 0.5,
  medium: 0.75,
  high: 0.95,
};

export const PAGE_SIZES: Record<PageSize, [number, number]> = {
  a4: [595.28, 841.89],
  letter: [612, 792],
  a3: [841.89, 1190.55],
};

export const FROM_OPTIONS: FormatOption[] = [
  { value: "jpg" as ConvertFrom, label: "JPG / JPEG", accept: "image/jpeg,image/jpg" },
  { value: "png" as ConvertFrom, label: "PNG", accept: "image/png" },
  { value: "webp" as ConvertFrom, label: "WebP", accept: "image/webp" },
  { value: "gif" as ConvertFrom, label: "GIF", accept: "image/gif" },
  { value: "bmp" as ConvertFrom, label: "BMP", accept: "image/bmp" },
  { value: "tiff" as ConvertFrom, label: "TIFF", accept: "image/tiff,image/tif" },
  { value: "svg" as ConvertFrom, label: "SVG", accept: "image/svg+xml,.svg" },
  { value: "ico" as ConvertFrom, label: "ICO (Icon)", accept: "image/x-icon,image/vnd.microsoft.icon" },
  { value: "heic" as ConvertFrom, label: "HEIC", accept: "image/heic,image/heif" },
  { value: "avif" as ConvertFrom, label: "AVIF", accept: "image/avif" },
];

export const TO_OPTIONS: FormatOption[] = [
  { value: "jpg" as ConvertTo, label: "→ JPG", mime: "image/jpeg" },
  { value: "png" as ConvertTo, label: "→ PNG", mime: "image/png" },
  { value: "webp" as ConvertTo, label: "→ WebP", mime: "image/webp" },
  { value: "gif" as ConvertTo, label: "→ GIF", mime: "image/gif" },
  { value: "bmp" as ConvertTo, label: "→ BMP", mime: "image/bmp" },
  { value: "tiff" as ConvertTo, label: "→ TIFF", mime: "image/tiff" },
  { value: "svg" as ConvertTo, label: "→ SVG", mime: "image/svg+xml" },
  { value: "avif" as ConvertTo, label: "→ AVIF", mime: "image/avif" },
  { value: "ico" as ConvertTo, label: "→ ICO", mime: "image/x-icon" },
  { value: "pdf" as ConvertTo, label: "→ PDF" },
  { value: "rotate" as ConvertTo, label: "Rotate / Flip" },
];

export const LOSSY_FORMATS = ["jpg", "webp", "avif"];
export const LOSSLESS_FORMATS = ["png", "gif", "bmp", "tiff", "svg"];
export const SUPPORTS_TRANSPARENCY = ["png", "webp", "gif", "avif", "svg"];

export const ALL_FAQS: Record<string, FAQ[]> = {
  "to-png": [
    {
      question: "Does converting to PNG lose quality?",
      answer: "No. PNG is a lossless format. Once converted, no further quality is lost — though original compression artifacts from lossy formats like JPG are preserved.",
    },
    {
      question: "Why is the PNG file larger?",
      answer: "PNG uses lossless compression, storing every pixel exactly. This results in larger files compared to lossy formats like JPG or WebP.",
    },
    {
      question: "Does PNG support transparency?",
      answer: "Yes! PNG supports full alpha channel transparency, making it ideal for logos, icons, and graphics with transparent backgrounds.",
    },
    {
      question: "Can I convert SVG to PNG?",
      answer: "Yes! SVG (vector) will be rasterized to PNG at the original dimensions. The output will be a pixel-based image.",
    },
  ],
  "to-jpg": [
    {
      question: "Will converting to JPG lose quality?",
      answer: "Yes. JPG uses lossy compression. Using 'High' quality minimizes visible quality loss, but some data is discarded.",
    },
    {
      question: "What happens to transparent areas?",
      answer: "Transparency is replaced with a white background, since JPG doesn't support alpha channels.",
    },
    {
      question: "Can I convert SVG to JPG?",
      answer: "Yes! SVG will be rendered to a canvas and then converted to JPG. Transparent areas will become white.",
    },
  ],
  "to-webp": [
    {
      question: "What is WebP?",
      answer: "WebP is a modern image format developed by Google that provides superior compression for both lossy and lossless images, plus transparency support.",
    },
    {
      question: "Is WebP supported everywhere?",
      answer: "WebP is supported in all modern browsers (Chrome, Firefox, Edge, Safari 14+). Older browsers may not support it.",
    },
    {
      question: "Can I convert SVG to WebP?",
      answer: "Yes! SVG will be rasterized and converted to WebP format with your chosen quality settings.",
    },
  ],
  "to-svg": [
    {
      question: "Can I convert raster images (PNG, JPG) to SVG?",
      answer: "This converter creates an embedded SVG with your raster image inside. For true vector conversion (tracing), you'd need specialized software like Adobe Illustrator or Inkscape.",
    },
    {
      question: "What's the difference between embedded and traced SVG?",
      answer: "Embedded SVG wraps your raster image in SVG tags. Traced SVG converts pixels to vector paths - that requires complex algorithms not included here.",
    },
    {
      question: "Will the SVG file be smaller?",
      answer: "No. Embedded SVG files are typically larger than the original raster image because they include XML markup plus the base64-encoded image data.",
    },
  ],
  "to-avif": [
    {
      question: "What is AVIF?",
      answer: "AVIF is a cutting-edge image format based on AV1 video codec. It offers better compression than WebP and JPG while maintaining high quality.",
    },
    {
      question: "Is AVIF widely supported?",
      answer: "AVIF is supported in Chrome 85+, Firefox 93+, and Safari 16+. Support is growing but not yet universal.",
    },
  ],
  "to-gif": [
    {
      question: "Can I convert any image to GIF?",
      answer: "Yes, but GIF only supports 256 colors. Photos will lose significant quality. GIF is best for simple graphics and animations.",
    },
    {
      question: "Can I convert SVG to GIF?",
      answer: "Yes! SVG will be rendered to canvas and then converted to GIF format.",
    },
  ],
  "to-bmp": [
    {
      question: "Why would I use BMP?",
      answer: "BMP is an uncompressed format mainly used for compatibility with older Windows applications. Files are very large.",
    },
  ],
  "to-tiff": [
    {
      question: "When should I use TIFF?",
      answer: "TIFF is used in professional photography, publishing, and medical imaging where archival quality and metadata preservation are critical.",
    },
  ],
  "to-ico": [
    {
      question: "What is ICO format used for?",
      answer: "ICO is used for website favicons, Windows program icons, and desktop shortcuts.",
    },
    {
      question: "What size should I use for favicons?",
      answer: "Common sizes are 16×16, 32×32, and 48×48 pixels. Modern favicons typically use 32×32 or larger.",
    },
  ],
  "to-pdf": [
    {
      question: "How many images can I add?",
      answer: "Up to 20 images per PDF. Each image becomes one page.",
    },
    {
      question: "Can I add SVG files to PDF?",
      answer: "Yes! SVG files will be rendered and added to the PDF.",
    },
  ],
  "rotate": [
    {
      question: "What formats can I rotate?",
      answer: "All supported image formats including SVG, JPG, PNG, WebP, GIF, BMP, TIFF, AVIF, and more.",
    },
    {
      question: "Can I rotate SVG files?",
      answer: "Yes! SVG files will be rendered to canvas, rotated, and saved in your chosen output format.",
    },
  ],
};