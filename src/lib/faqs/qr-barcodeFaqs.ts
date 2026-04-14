// lib/faqs/qr-barcodeFaqs.ts
const QR_BARCODE_FAQS = [
  // QR Code FAQs
  {
    question: "What is a QR code and how does it work?",
    answer: "A QR code (Quick Response code) is a two-dimensional barcode that stores data in a square grid pattern. It can encode various types of information like URLs, text, contact details, WiFi credentials, and more. When scanned with a smartphone camera or QR reader, the encoded data is instantly decoded and can trigger actions like opening websites, saving contacts, or connecting to WiFi networks.",
  },
  {
    question: "What types of data can I encode in a QR code?",
    answer: "You can encode multiple data types: Plain Text, URLs/Links, Email addresses, Phone numbers, SMS messages, WiFi credentials, Contact cards (vCard), Geographic locations, Calendar events, Images, PDFs, Videos, and Files. Each type has specific formatting requirements for optimal scanning.",
  },
  {
    question: "What's the maximum data capacity of a QR code?",
    answer: "QR codes can hold approximately 3KB of data (around 2,953 bytes). However, for best scanning results, we recommend keeping data under 150KB. For larger files, consider using cloud storage and encoding the share link instead.",
  },
  
  // Barcode FAQs
  {
    question: "What barcode formats are supported?",
    answer: "We support all major barcode formats: CODE128 (alphanumeric), CODE128A/B/C, EAN13, EAN8, UPC, UPC-E, CODE39, ITF14, ITF, MSI variants (MSI10, MSI11, MSI1010, MSI1110), Pharmacode, and Codabar. Each format has specific use cases and data requirements.",
  },
  {
    question: "What's the difference between barcode formats?",
    answer: "Different formats serve different purposes: EAN13/UPC for retail products (13/12 digits), CODE128 for versatile alphanumeric data, CODE39 for inventory/logistics, ITF14 for shipping containers, MSI for warehouse management, and Pharmacode for pharmaceutical packaging. Choose based on your industry standards.",
  },
  {
    question: "How do I validate barcode data?",
    answer: "Each format has specific requirements: EAN13 needs exactly 12-13 digits, UPC needs 11-12 digits, CODE128C requires even-numbered digits, ITF needs even digit count, and Pharmacode accepts numbers 3-131070. Our generator validates input in real-time and shows errors immediately.",
  },
  
  // Common FAQs
  {
    question: "Can I customize the appearance of codes?",
    answer: "Yes! For QR codes: adjust size (128-1024px), choose foreground/background colors, set error correction level (L/M/Q/H), and toggle margins. For barcodes: adjust width, height, font size, line color, background color, and text display. All customizations maintain scannability.",
  },
  {
    question: "What download formats are available?",
    answer: "All codes can be downloaded in PNG, SVG, and JPG formats. PNG offers good quality for web use, SVG provides infinite scalability perfect for printing, and JPG offers smaller file sizes. SVG is recommended for professional printing needs.",
  },
  {
    question: "How do I handle large files?",
    answer: "For files over 512KB, we recommend: 1) Upload to cloud storage (Google Drive, Dropbox, WeTransfer, File.io), 2) Get a shareable link, 3) Optionally shorten the URL using bit.ly or tinyurl.com, 4) Generate QR code from the shortened link. This creates simpler, more reliable codes.",
  },
  {
    question: "What are error correction levels?",
    answer: "QR codes have 4 error correction levels: L (7% recovery) for clean environments, M (15%) for standard use, Q (25%) for potentially damaged codes, H (30%) for harsh conditions. Higher levels create more complex codes but are more resilient to damage. We auto-recommend based on data size.",
  },
  {
    question: "Are the generated codes free to use commercially?",
    answer: "Yes, all generated QR codes and barcodes are free to use for any purpose including commercial use. No attribution required, no watermarks, no usage restrictions. Download and use them in products, marketing materials, packaging, or any other application.",
  },
  {
    question: "How do I ensure codes scan properly?",
    answer: "Best practices: 1) Keep data under recommended limits, 2) Use appropriate error correction, 3) Maintain good contrast (dark on light), 4) Print at minimum 2cm × 2cm for QR codes, 5) Test scans before mass production, 6) Avoid damage to printed codes, 7) Ensure adequate lighting when scanning.",
  },
];

export default QR_BARCODE_FAQS;